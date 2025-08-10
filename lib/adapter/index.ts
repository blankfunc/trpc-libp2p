import type { Packet } from "@/packet";
import type { Libp2p, Stream } from "@libp2p/interface";
import type { AnyRouter, BaseHandlerOptions, CreateContextCallback, inferRouterContext, MaybePromise } from "@trpc/server/unstable-core-do-not-import";
import { getConnectionHandler } from "./connection";

export type CreateContextFn<TRouter extends AnyRouter> = (options: {
	contextMessage: Packet["Handshake"],
	stream: Stream
}) => MaybePromise<inferRouterContext<TRouter>>;

export type ConnectionHandlerOptions<TRouter extends AnyRouter> =
	BaseHandlerOptions<TRouter, Packet["Handshake"]> &
	CreateContextCallback<
    	inferRouterContext<TRouter>,
		CreateContextFn<TRouter>
    >;

export type HandlerOptions<TRouter extends AnyRouter> = ConnectionHandlerOptions<TRouter>;

export function applyHandler<TRouter extends AnyRouter>(
	app: Libp2p,
	options: HandlerOptions<TRouter>
) {
	const path = "/trpc/1.0.0";
	const onConnection = getConnectionHandler(options);
	app.handle(path, async ({ stream }) => {
		onConnection(stream);
	});
}