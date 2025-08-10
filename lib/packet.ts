import { TRPCConnectionParamsMessage } from "@trpc/server/dist/unstable-core-do-not-import.cjs";

export type Packet = {
	// 握手包
	Handshake: {
		headers: { [key: string]: string },
		trpcMessages?: TRPCConnectionParamsMessage
	}
};