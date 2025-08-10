import { TRPCClientError } from "@trpc/client";
import type { AnyTRPCRouter } from "@trpc/server";
import type { Observer } from "@trpc/server/observable";
import type { inferRouterError, TRPCClientOutgoingMessage, TRPCResponseMessage } from "@trpc/server/unstable-core-do-not-import";
import { P2PConnection } from "./connection";

export type TCallbacks = Observer<
	TRPCResponseMessage<unknown, inferRouterError<AnyTRPCRouter>>,
	TRPCClientError<AnyTRPCRouter>
>;

export type CallbackOrValue<T> = T | (() => T | Promise<T>);

interface Request {
	message: TRPCClientOutgoingMessage;
	end: Promise<void>;
	callbacks: TCallbacks;
}

type MessageId = string;
type MessageIdLike = string | number | null;

export function withResolvers<T>() {
	let resolve: (value: T | PromiseLike<T>) => void;
	let reject: (reason?: any) => void;
	const promise = new Promise<T>((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return { promise, resolve: resolve!, reject: reject! };
}

export class RequestManager {
	private outgoingRequests = new Array<Request & { id: MessageId }>();
	private pendingRequests: Record<MessageId, Request> = {};
	public register(message: TRPCClientOutgoingMessage, callbacks: TCallbacks) {
		const { promise: end, resolve } = withResolvers<void>();

		this.outgoingRequests.push({
			id: String(message.id),
			message,
			end,
			callbacks: {
				next: callbacks.next,
				complete: () => {
				callbacks.complete();
				resolve();
				},
				error: (e) => {
				callbacks.error(e);
				resolve();
				},
			},
		});

		return () => {
			this.delete(message.id);
			callbacks.complete();
			resolve();
		};
	}

	public delete(messageId: MessageIdLike) {
		if (messageId === null) return;

		this.outgoingRequests = this.outgoingRequests.filter(
			({ id }) => id !== String(messageId),
		);
		delete this.pendingRequests[String(messageId)];
	}

	public flush() {
		const requests = this.outgoingRequests;
		this.outgoingRequests = [];

		for (const request of requests) {
			this.pendingRequests[request.id] = request;
		}
		return requests;
	}

	public getPendingRequests() {
		return Object.values(this.pendingRequests);
	}

	public getPendingRequest(messageId: MessageIdLike) {
		if (messageId === null) return null;

		return this.pendingRequests[String(messageId)];
	}

	public getOutgoingRequests() {
		return this.outgoingRequests;
	}

	public getRequests() {
		return [
			...this.getOutgoingRequests().map((request) => ({
				state: 'outgoing' as const,
				message: request.message,
				end: request.end,
				callbacks: request.callbacks,
			})),
			...this.getPendingRequests().map((request) => ({
				state: 'pending' as const,
				message: request.message,
				end: request.end,
				callbacks: request.callbacks,
			})),
		];
	}

	public hasPendingRequests() {
		return this.getPendingRequests().length > 0;
	}

	public hasPendingSubscriptions() {
		return this.getPendingRequests().some(
			(request) => request.message.method === 'subscription',
		);
	}

	public hasOutgoingRequests() {
		return this.outgoingRequests.length > 0;
	}
}

export class ResettableTimeout {
	private timeout: ReturnType<typeof setTimeout> | undefined;

	constructor(
		private readonly onTimeout: () => void,
		private readonly timeoutMs: number,
	) {}
	
	public reset() {
		if (!this.timeout) return;

		clearTimeout(this.timeout);
		this.timeout = setTimeout(this.onTimeout, this.timeoutMs);
	}

	public start() {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(this.onTimeout, this.timeoutMs);
	}

	public stop() {
		clearTimeout(this.timeout);
		this.timeout = undefined;
	}
}

export const resultOf = <T, TArgs extends any[]>(
	value: T | ((...args: TArgs) => T),
	...args: TArgs
): T => {
	return typeof value === 'function'
		? (value as (...args: TArgs) => T)(...args)
		: value;
};

export function backwardCompatibility(connection: P2PConnection) {
	if (connection.isOpen()) {
		return {
			id: connection.id,
			state: "open",
			stream: connection.stream,
		} as const;
	}

	if (connection.isClosed()) {
		return {
			id: connection.id,
			state: "closed",
			ws: connection.stream,
		} as const;
	}

	if (!connection.stream) {
		return null;
	}

	return {
		id: connection.id,
		state: "connecting",
		ws: connection.stream,
	} as const;
}