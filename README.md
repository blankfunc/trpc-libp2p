## tRPC-libP2P

This project is the implementation of [libp2p][libp2p] transport for [tRPC][tRPC].

The specific implementation is completely inspired by [wsLink](https://github.com/trpc/trpc/blob/main/packages/client/src/links/wsLink) and [wsAdapter](https://github.com/trpc/trpc/blob/main/packages/server/src/adapters/ws.ts).

The underlying layer adopts [BSON][bson] serialization (not transformer).

### Plans
+ [ ] Ping/Pong keep alive
+ [ ] Stronger support for KAD

### Usages

**For server**, because the specific implementation is similar, the operation method on the server is almost the same as [the tRPC WebSocket document](https://trpc.io/docs/server/websockets#creating-a-websocket-server).

+ `applyHandler(server, options)`
	+ *@server* libP2P instance
	+ *@options*
		+ *options.router* the AppRouter instance for tRPC

Very easy to use, you can see [the example file](./example/server.ts).

**For client**, Similarly, it is almost a direct copy of [wsLink](https://trpc.io/docs/client/links/wsLink).

+ `createP2PClient(options)`
	+ *@options*
		+ *options.url* the MultiAddr for libP2P server
		+ *options.node* the libP2P instance

You can see [the example file](./example/client.ts).

[bson]: https://github.com/mongodb/js-bson
[libp2p]: https://github.com/libp2p/js-libp2p
[tRPC]: https://github.com/trpc/trpc