import { tcp } from "@libp2p/tcp";
import { createTRPCClient } from "@trpc/client";
import { createLibp2p } from "libp2p";
import { createP2PClient, p2pLink } from "trpc-libp2p";
import type { Router } from "./server";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
const node = await createLibp2p({
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

await node.start();

console.log("Try to client.")

const client = createP2PClient({
	url: "/ip4/127.0.0.1/tcp/8066",
	node
});

const trpcClient = createTRPCClient<Router>({
	links: [
		p2pLink<Router>({ client })
	]
});

console.log(`RPC \`hello\`> ${await trpcClient.hello.query()}`);