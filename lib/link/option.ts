import type { TRPCRequestInfo } from "@trpc/server/unstable-core-do-not-import";
import type { CallbackOrValue } from "./util";
import type { Libp2p } from "@libp2p/interface";

export class TRPCStreamClosedError extends Error {
	constructor(opts: { message: string; cause?: unknown }) {
		super(opts.message, {
			cause: opts.cause,
		});
		this.name = "TRPCStreamClosedError";
		Object.setPrototypeOf(this, TRPCStreamClosedError.prototype);
	}
}

export interface P2PClientOptions {
	url: CallbackOrValue<string>;

	connectionParams?: CallbackOrValue<TRPCRequestInfo["connectionParams"]>;

	node: Libp2p;
}