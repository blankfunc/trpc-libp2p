import { observable } from "@trpc/server/observable";
import type { P2PClientOptions } from "./option";
import { P2PClient } from "./client";
import { getTransformer, type TransformerOptions } from "@trpc/client/unstable-internals";
import type { AnyRouter, inferClientTypes } from "@trpc/server/unstable-core-do-not-import";
import type { TRPCLink } from "@trpc/client";

export function createP2PClient(options: P2PClientOptions) {
	return new P2PClient(options);
}

export type P2PLinkOptions<TRouter extends AnyRouter> = {
	client: P2PClient;
} & TransformerOptions<inferClientTypes<TRouter>>;

export function p2pLink<TRouter extends AnyRouter>(
	options: P2PLinkOptions<TRouter>,
): TRPCLink<TRouter> {
	const { client } = options;
	const transformer = getTransformer(options.transformer);
	return () => {
		return ({ op }) => {
			return observable((observer) => {
				const connStateSubscription =
					op.type === 'subscription'
					? client.connectionState.subscribe({
						next(result) {
							observer.next({
								result,
								context: op.context,
							});
						},
					})
					: null;

				const requestSubscription = client
					.request({
						op,
						transformer,
					})
					.subscribe(observer);

				return () => {
					requestSubscription.unsubscribe();
					connStateSubscription?.unsubscribe();
				};
			});
		};
	};
}