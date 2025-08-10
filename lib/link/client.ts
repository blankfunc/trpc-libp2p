import {
	type CombinedDataTransformer,
	type TRPCClientIncomingMessage,
	type TRPCClientIncomingRequest,
	type TRPCClientOutgoingMessage,
	type TRPCResponseMessage,
	sleep,
	transformResult,
} from "@trpc/server/unstable-core-do-not-import";
import { type P2PClientOptions, TRPCStreamClosedError } from "./option";
import { type Multiaddr, multiaddr } from "@multiformats/multiaddr";
import { TRPCClientError, type Operation, type OperationResultEnvelope } from "@trpc/client";
import { type TRPCConnectionState } from "@trpc/client/unstable-internals";
import { type AnyTRPCRouter } from "@trpc/server";
import { type BehaviorSubject, behaviorSubject, observable } from "@trpc/server/observable";
import { isArray } from "@utilify/core";
import { BSON, EJSON } from "bson";
import { P2PConnection } from "./connection";
import { P2PStream } from "./stream";
import { RequestManager, ResettableTimeout, type TCallbacks, backwardCompatibility } from "./util";

export class P2PClient {
	public readonly connectionState: BehaviorSubject<
		TRPCConnectionState<TRPCClientError<AnyTRPCRouter>>
	>;

	private allowReconnect = false;
	private requestManager = new RequestManager();
	private activeConnection: P2PConnection;
	private readonly multiaddr: Multiaddr;
	private readonly reconnectRetryDelay: (attemptIndex: number) => number;
	private inactivityTimeout: ResettableTimeout;
	// private readonly lazyMode: boolean;

	constructor(options: P2PClientOptions) {
		this.multiaddr = multiaddr(options.url.toString());
		this.activeConnection = new P2PConnection(options);
		this.reconnectRetryDelay = index => index === 0 ? 0 : Math.min(1000 * 2 ** index, 30000);
		this.inactivityTimeout = new ResettableTimeout(() => {
			if (
				this.requestManager.hasOutgoingRequests() ||
				this.requestManager.hasPendingRequests()
			) {
				this.inactivityTimeout.reset();
				return;
			}

			this.close().catch(() => null);
		}, 0);
		this.connectionState = behaviorSubject<
			TRPCConnectionState<TRPCClientError<AnyTRPCRouter>>
		>({
			type: "state",
			state: "connecting",
			error: null,
		});

		this.activeConnection.streamObservable.subscribe({
			next: stream => {
				if (!stream) return;
				this.setupListeners(stream);
			}
		});

		this.open().catch(() => null);
	}

	private async open() {
		this.allowReconnect = true;
		if (this.connectionState.get().state !== "connecting") {
			this.connectionState.next({
				type: "state",
				state: "connecting",
				error: null,
			});
		}

		try {
			await this.activeConnection.open();
			// this.activeStream = await this.activeNode.dialProtocol(this.multiaddr, "/trpc/1.0.0");
		} catch (error) {
			this.reconnect(
				new TRPCStreamClosedError({
					message: "Initialization error",
					cause: error,
				}),
			);

			return this.reconnecting;
		}
	}

	private reconnecting: Promise<void> | null = null;
	private reconnect(closedError: TRPCStreamClosedError) {
		this.connectionState.next({
			type: "state",
			state: "connecting",
			error: TRPCClientError.from(closedError),
		});
		if (this.reconnecting) return;

		const tryReconnect = async (attemptIndex: number) => {
		try {
			await sleep(this.reconnectRetryDelay(attemptIndex));
			if (this.allowReconnect) {
				await this.activeConnection.close();
				await this.activeConnection.open();

				if (this.requestManager.hasPendingRequests()) {
					this.send(
						this.requestManager
							.getPendingRequests()
							.map(({ message }) => message),
					);
				}
			}
			this.reconnecting = null;
		} catch {
			await tryReconnect(attemptIndex + 1);
		}
		};

		this.reconnecting = tryReconnect(0);
	}

	private send(messageOrMessages: TRPCClientOutgoingMessage | TRPCClientOutgoingMessage[]) {
		if (!this.activeConnection.isOpen()) {
			throw new Error("Active connection is not open");
		}

		const messages = isArray(messageOrMessages) ? messageOrMessages : [messageOrMessages];
		
		this.activeConnection.stream.write(BSON.serialize(messages.length === 1 ? messages[0]! : messages));
	}

	private batchSend(message: TRPCClientOutgoingMessage, callbacks: TCallbacks) {
		this.inactivityTimeout.reset();

		(async () => {
			if (!this.activeConnection.isOpen()) {
				await this.open();
			}
			await sleep(0);

			if (!this.requestManager.hasOutgoingRequests()) return;

			this.send(this.requestManager.flush().map(({ message }) => message));
		})().catch((err) => {
			this.requestManager.delete(message.id);
			callbacks.error(TRPCClientError.from(err));
		});

		return this.requestManager.register(message, callbacks);
	}

	public async close() {
		this.allowReconnect = false;
		this.inactivityTimeout.stop();

		const requestsToAwait: Promise<void>[] = [];
		for (const request of this.requestManager.getRequests()) {
			if (request.message.method === 'subscription') {
				request.callbacks.complete();
			} else if (request.state === 'outgoing') {
				request.callbacks.error(
					TRPCClientError.from(
						new TRPCStreamClosedError({
							message: 'Closed before connection was established',
						}),
					),
				);
			} else {
				requestsToAwait.push(request.end);
			}
		}

		await Promise.all(requestsToAwait).catch(() => null);
		await this.activeConnection.close().catch(() => null);

		this.connectionState.next({
			type: "state",
			state: "idle",
			error: null,
		});
	}

	public request({
		op: { id, type, path, input, signal },
		transformer,
		lastEventId,
	}: {
		op: Pick<Operation, 'id' | 'type' | 'path' | 'input' | 'signal'>;
		transformer: CombinedDataTransformer;
		lastEventId?: string;
	}) {
		return observable<
			OperationResultEnvelope<unknown, TRPCClientError<AnyTRPCRouter>>,
			TRPCClientError<AnyTRPCRouter>
		>((observer) => {
			const abort = this.batchSend({
				id,
				method: type,
				params: {
					input: transformer.input.serialize(input),
					path,
					lastEventId,
				},
			},
			{
				...observer,
				next(event) {
					const transformed = transformResult(event, transformer.output);

					if (!transformed.ok) {
						observer.error(TRPCClientError.from(transformed.error));
						return;
					}

					observer.next({
						result: transformed.result,
					});
				},
			});

			return () => {
				abort();

				if (type === 'subscription' && this.activeConnection.isOpen()) {
				this.send({
					id,
					method: 'subscription.stop',
				});
				}

				signal?.removeEventListener('abort', abort);
			};
		});
	}

	public get connection() {
		return backwardCompatibility(this.activeConnection);
	}

	private setupListeners(stream: P2PStream) {
		const handleCloseOrError = (cause: unknown) => {
			const reqs = this.requestManager.getPendingRequests();
			for (const { message, callbacks } of reqs) {
				if (message.method === "subscription") continue;

				callbacks.error(
					TRPCClientError.from(
						cause ?? new TRPCStreamClosedError({
							message: 'WebSocket closed',
							cause,
						}),
					),
				);
				this.requestManager.delete(message.id);
			}
		};

		stream.on("open", () => {
			(async () => {
				this.connectionState.next({
					type: "state",
					state: "pending",
					error: null,
				});
			})().catch((error) => {
				stream.close();
				handleCloseOrError(error);
			});
		});

		stream.on("data", data => {
			this.inactivityTimeout.reset();

			// if (typeof data !== 'string' || ['PING', 'PONG'].includes(data)) return;
			const docs = BSON.deserialize(data);
			const incomingMessage = EJSON.deserialize(docs) as TRPCClientIncomingMessage;
			if ('method' in incomingMessage) {
				this.handleIncomingRequest(incomingMessage);
				return;
			}

			this.handleResponseMessage(incomingMessage);
		});

		stream.on("close", (event) => {
			handleCloseOrError(event);

			if (this.requestManager.hasPendingSubscriptions()) {
				this.reconnect(
					new TRPCStreamClosedError({
						message: 'WebSocket closed',
						cause: event,
					}),
				);
			}
		});

		stream.on('error', (event) => {
			handleCloseOrError(event);

			this.reconnect(
				new TRPCStreamClosedError({
					message: 'WebSocket closed',
					cause: event,
				}),
			);
		});
	}

	private handleResponseMessage(message: TRPCResponseMessage) {
		const request = this.requestManager.getPendingRequest(message.id);
		if (!request) return;

		request.callbacks.next(message);

		let completed = true;
		if ('result' in message && request.message.method === 'subscription') {
		if (message.result.type === 'data') {
			request.message.params.lastEventId = message.result.id;
		}

		if (message.result.type !== 'stopped') {
			completed = false;
		}
		}

		if (completed) {
			request.callbacks.complete();
			this.requestManager.delete(message.id);
		}
	}

	private handleIncomingRequest(message: TRPCClientIncomingRequest) {
		if (message.method === 'reconnect') {
			this.reconnect(
				new TRPCStreamClosedError({
					message: 'Server requested reconnect',
				}),
			);
		}
	}
}