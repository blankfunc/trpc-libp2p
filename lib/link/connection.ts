import type { TRPCConnectionParamsMessage } from "@trpc/server/unstable-core-do-not-import";
import { BSON } from "bson";
import { P2PStream } from "./stream";
import { multiaddr } from "@multiformats/multiaddr";
import { resultOf } from "./util";
import type { Packet } from "@/packet";
import { behaviorSubject } from "@trpc/server/observable";
import type { P2PClientOptions } from "./option";
import type { Stream } from "@libp2p/interface";

export class P2PConnection {
	static connectCount = 0;
	public id = ++P2PConnection.connectCount;

	private readonly options: P2PClientOptions;
	public readonly streamObservable = behaviorSubject<P2PStream | null>(null);

	constructor(options: P2PClientOptions) {
		this.options = options;
	}

	public get stream() {
		return this.streamObservable.get();
	}

	private set stream(stream) {
		this.streamObservable.next(stream);
	}

	public isOpen(): this is { stream: Stream } {
		return (!!this.stream
		&& this.stream.status === "open"
		&& !this.openPromise);
	}

	public isClosed(): this is { stream: Stream } {
    	return (!!this.stream
			&& (this.stream.status === "closing" ||
			this.stream.status === "closed"));
	}

	private openPromise: Promise<void> | null = null;
	public async open() {
		if (this.openPromise) return this.openPromise;
		this.id = ++P2PConnection.connectCount;
		const ma = multiaddr(this.options.url.toString())
		const streamPromise = this.options.node.dialProtocol(ma, "/trpc/1.0.0");
		this.openPromise = streamPromise.then(async raw_stream => {
			const stream = new P2PStream(raw_stream);
			this.stream = stream;

			stream.on("close", () => {
				if (this.stream == stream) {
					this.stream = null;
				}
			});

			// if (this.options.connectionParams) {
			// 	const message = <TRPCConnectionParamsMessage>{
			// 		method: "connectionParams",
			// 		data: await resultOf(this.options.connectionParams)
			// 	};
			// 	stream.write(BSON.serialize(message));
			// }
			let handshake: Packet["Handshake"] = {
				headers: {},
				trpcMessages: this.options.connectionParams
				? <TRPCConnectionParamsMessage>{
					method: "connectionParams",
					data: await resultOf(this.options.connectionParams)
				}
				: void 0,
			}

			stream.write(BSON.serialize(handshake));
		});
		try {
			await this.openPromise;
		} finally {
			this.openPromise = null;
		}
	}

	public async close() {
		try {
			await this.openPromise;
		} finally {
			this.stream?.close();
		}
	}
}