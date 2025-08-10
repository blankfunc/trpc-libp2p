import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { initTRPC } from "@trpc/server";
import { applyHandler } from "trpc-libp2p";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
const server = await createLibp2p({
	addresses: {
		listen: [
			"/ip4/0.0.0.0/tcp/8066"
		]
	},
	connectionGater: {
		denyDialMultiaddr: () => false
	},
	transports: [
		tcp()
	],
	connectionEncrypters: [
		noise()
	],
	streamMuxers: [
		yamux()
	]
});

await server.start();
console.log("libp2p server started.")
console.log(server.getMultiaddrs())

server.addEventListener("connection:open", () => console.log("New connection."))

const trpc = initTRPC.create();
export const router = trpc.router({
	hello: trpc.procedure.query(() => "Hello, World!")
});
export type Router = typeof router;

applyHandler(server, { router });