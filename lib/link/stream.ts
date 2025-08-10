import type { Stream } from "@libp2p/interface";
import EventEmitter from "events";
import { pipe } from "it-pipe";
import { pushable } from "it-pushable";
import * as lp from "it-length-prefixed";

export class P2PStream extends EventEmitter {
	readonly stream: Stream;
	get status(): string {
		return this.stream.status;
	}

	constructor(stream: Stream) {
		super()
		this.stream = stream;
		
		(async () => {
			await pipe(stream, lp.decode, async source => {
				for await (const message of source) {

					this.emit("data", message.subarray());
				}

				this.emit("end");
			})
		})().catch(err => this.emit("error", err));

		(async () => {
			await pipe(this.queue, lp.encode, stream);
		})();
	}

	queue = pushable();
	async write(data: Uint8Array) {
		this.queue.push(data);
	}

	async close() {
		this.emit("close");
		this.queue.end();
		this.stream.abort(new Error());
	}
}