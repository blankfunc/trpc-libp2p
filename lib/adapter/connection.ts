import { getErrorShape, getTRPCErrorFromUnknown, isAsyncIterable, isTrackedEnvelope, iteratorResource, parseConnectionParamsFromUnknown, parseTRPCMessage, transformTRPCResponse, TRPCError, Unpromise, type AnyRouter, type inferRouterContext, type Result, type TRPCClientOutgoingMessage, type TRPCConnectionParamsMessage, type TRPCRequestInfo, type TRPCResponseMessage, type TRPCResultMessage } from "@trpc/server/unstable-core-do-not-import";
import type { HandlerOptions } from ".";
import type { Stream } from "@libp2p/interface";
import type { Packet } from "@/packet";
import { BSON, EJSON, ObjectId } from "bson";
import { pushable } from "it-pushable";
import * as lp from "it-length-prefixed";
import { isArray, isNull, isObject, isUndefined, toKebabCase } from "@utilify/core";
import { callTRPCProcedure } from "@trpc/server";
import { isObservable, observableToAsyncIterable } from "@trpc/server/observable";
import { pipe } from "it-pipe";

export function getConnectionHandler<TRouter extends AnyRouter>(
	options: HandlerOptions<TRouter>
) {
	const { createContext, router } = options;
	const { transformer } = router._def._config;

	return (stream: Stream) => {
		type Context = inferRouterContext<TRouter>;
		type ContextResult = Result<TRouter>;

		let contextMsg: Packet["Handshake"] | undefined = undefined;
		let ctx: Context | undefined = undefined;
		const id = new ObjectId();
		const writter = pushable();

		const subscriptions = new Map<number | string, AbortController>();
		const abortController = new AbortController();

		(async () => {
			await pipe(writter, lp.encode, stream);
		})()

		const respond = (rawMap: TRPCResponseMessage) => {
			const map = transformTRPCResponse(router._def._config, rawMap);
			const bytes = BSON.serialize(map);
			writter.push(bytes);
		}

		const createCtxPromise = async (
			getConnectionParams: () => TRPCRequestInfo["connectionParams"],
		): Promise<ContextResult> => {
			try {
				return <ContextResult>{
					ok: true,
					value: await createContext?.({
						stream,
						contextMessage: contextMsg!
					})
				};
			} catch (cause) {
				const error = getTRPCErrorFromUnknown(cause);

				respond({
					id: null,
					error: getErrorShape({
						config: router._def._config,
						error,
						type: "unknown",
						path: void 0,
						input: void 0,
						ctx
					})
				});

				(globalThis.setImmediate ?? globalThis.setTimeout)(() => stream.abort(error));

				return {
					ok: false,
					error
				};
			}
		}

		let ctxPromise: Promise<Result<TRouter>> | null = null;

		// 处理请求
		const handleRequest = async (message: TRPCClientOutgoingMessage) => {
			const { id, jsonrpc } = message;
			const respondError = (error: TRPCError) => {
				respond({
					id,
					jsonrpc,
					error: getErrorShape({
						config: router._def._config,
						error,
						type: "unknown",
						path: void 0,
						input: void 0,
						ctx,
					}),
				});
			};

			if (isNull(id)) {
				const error = getTRPCErrorFromUnknown(
					new TRPCError({
						code: 'PARSE_ERROR',
						message: '`id` is required',
					}),
				);

				respondError(error);
				return;
			}

			const { method } = message;
			if (method === "subscription.stop") {
				subscriptions.get(id)?.abort();
				return;
			}

			const { path, lastEventId } = message.params;
			let { input } = message.params;

			if (!isUndefined(lastEventId)) {
				if (isObject(input)) {
					input.lastEventId = lastEventId;
				} else {
					input ??= { lastEventId };
				}
			}

			(async () => {
				const context = await ctxPromise!;
				if (!context.ok) {
					throw context.error;
				}

				const abortController = new AbortController();
				const result = await callTRPCProcedure({
					router,
					path,
					getRawInput: async () => input,
					ctx,
					type: method,
					signal: abortController.signal,
				});
				const isIterableResult = isAsyncIterable(result) || isObservable(result);

				if (method !== "subscription") {
					if (isIterableResult) {
						throw new TRPCError({
							code: 'UNSUPPORTED_MEDIA_TYPE',
							message: `Cannot return an async iterable or observable from a ${method} procedure with WebSockets`,
						});
					}

					respond({
						id,
						jsonrpc,
						result: {
							type: "data",
							data: result,
						},
					});

					return;
				}

				console.log(result);
				if (!isIterableResult) {
					throw new TRPCError({
						message: `Subscription ${path} did not return an observable or a AsyncGenerator`,
						code: 'INTERNAL_SERVER_ERROR',
					});
				}

				if (stream.status !== "open") {
					return;
				}

				if (subscriptions.has(id)) {
					throw new TRPCError({
						message: `Duplicate id ${id}`,
						code: 'BAD_REQUEST',
					});
				}

				const iterable = isObservable(result)
					? observableToAsyncIterable(result, abortController.signal)
					: result;

				(async () => {
					await using iterator = iteratorResource(iterable);
					const abortPromise = new Promise<"abort">((resolve) => {
						abortController.signal.onabort = () => resolve("abort");
					});

					let next: | null | TRPCError |
						Awaited<
							typeof abortPromise | ReturnType<(typeof iterator)["next"]>
						>;
					let result: null | TRPCResultMessage<unknown>["result"];

					while (true) {
						next = await Unpromise.race([
							iterator.next().catch(getTRPCErrorFromUnknown),
							abortPromise,
						]);

						if (next === "abort") {
							await iterator.return?.();
							break;
						}

						if (next instanceof Error) {
							const error = getTRPCErrorFromUnknown(next);
							respondError(error);

							break;
						}

						if (next.done) {
							break;
						}

						result = {
							type: "data",
							data: next.value,
						};

						if (isTrackedEnvelope(next.value)) {
							const [id, data] = next.value;
							result.id = id;
							result.data = {
								id,
								data,
							};
						}

						respond({
							id,
							jsonrpc,
							result,
						});

						next = null;
						result = null;
					}

					respond({
						id,
						jsonrpc,
						result: {
							type: "stopped",
						},
					});
					subscriptions.delete(id);
				})().catch(cause => respondError(cause) );
			})().catch(cause => respondError(cause) );
		}

		// 处理 BSON
		const handleMap = async (map: Object) => {
			if (isNull(ctxPromise)) {
				ctxPromise = createCtxPromise(() => {
					let message: TRPCConnectionParamsMessage;
					try {
						message = map as TRPCConnectionParamsMessage;

						if (!isObject(message)) {
							throw new Error("Message was not an object");
						}
					} catch (cause) {
						throw new TRPCError({
							code: 'PARSE_ERROR',
							message: `Malformed TRPCConnectionParamsMessage`,
							cause,
						});
					}

					const connectionParams = parseConnectionParamsFromUnknown(message.data);

					return connectionParams;
				});

				return;
			}

			let messages: TRPCClientOutgoingMessage[];
			try {
				messages = (isArray(map) ? map : [map])
					.map(raw => parseTRPCMessage(raw, transformer));
			} catch (cause) {
				const error = new TRPCError({
					code: 'PARSE_ERROR',
					cause,
				});

				respond({
					id: null,
					error: getErrorShape({
						config: router._def._config,
						error,
						type: "unknown",
						path: void 0,
						input: void 0,
						ctx
					})
				});

				return;
			}

			messages.forEach(message => handleRequest(message));
		};

		// 不断读取
		try {
			pipe(
				stream,
				source => lp.decode(source),
				async source => {
					for await (const message of source) {
						let map: Object;
						try {
							const doc = BSON.deserialize(message.subarray());
							map = EJSON.deserialize(doc);
						} catch (error) {
							continue;
						}

						if (isUndefined(contextMsg)) {
							// 要先读取 contextMsg
							try {
								const doc = BSON.deserialize(message.subarray());
								const map = EJSON.deserialize(doc);
								contextMsg = map as Packet["Handshake"];
							} catch (error) {
								const err = new Error("Unable to successfully shake hands.");
								stream.abort(err);
								break;
							}

							const [ _, connectionParams ] = Object
								.entries(contextMsg!.headers)
								.filter(([ key, _ ]) => { toKebabCase(key) === "connection-params" })[0] ?? [];
							ctxPromise = connectionParams === "1" ? null : createCtxPromise(() => null);

							continue;
						}

						try {
							await handleMap(map);
						} catch (TRPCError) {
							// 说明连接无效
							break;
						}
					}

					stream.abort(new Error());
				}
			)
		} catch (AbortError) {
			return;
		}
	}
}