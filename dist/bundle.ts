import { TRPCConnectionParamsMessage } from '@trpc/server/dist/unstable-core-do-not-import.cjs';
import * as _libp2p_interface from '@libp2p/interface';
import { Stream, Libp2p } from '@libp2p/interface';
import { AnyRouter, MaybePromise, inferRouterContext, BaseHandlerOptions, CreateContextCallback, TRPCRequestInfo, CombinedDataTransformer, inferClientTypes } from '@trpc/server/unstable-core-do-not-import';
import * as _trpc_server_observable from '@trpc/server/observable';
import { BehaviorSubject } from '@trpc/server/observable';
import { TRPCClientError, Operation, OperationResultEnvelope, TRPCLink } from '@trpc/client';
import { TRPCConnectionState, TransformerOptions } from '@trpc/client/unstable-internals';
import { AnyTRPCRouter } from '@trpc/server';
import * as it_pushable from 'it-pushable';
import EventEmitter from 'events';

type Packet = {
    Handshake: {
        headers: {
            [key: string]: string;
        };
        trpcMessages?: TRPCConnectionParamsMessage;
    };
};

type CreateContextFn<TRouter extends AnyRouter> = (options: {
    contextMessage: Packet["Handshake"];
    stream: Stream;
}) => MaybePromise<inferRouterContext<TRouter>>;
type ConnectionHandlerOptions<TRouter extends AnyRouter> = BaseHandlerOptions<TRouter, Packet["Handshake"]> & CreateContextCallback<inferRouterContext<TRouter>, CreateContextFn<TRouter>>;
type HandlerOptions<TRouter extends AnyRouter> = ConnectionHandlerOptions<TRouter>;
declare function applyHandler<TRouter extends AnyRouter>(app: Libp2p, options: HandlerOptions<TRouter>): void;

declare class P2PStream extends EventEmitter {
    readonly stream: Stream;
    get status(): string;
    constructor(stream: Stream);
    queue: it_pushable.Pushable<Uint8Array<ArrayBufferLike>, void, unknown>;
    write(data: Uint8Array): Promise<void>;
    close(): Promise<void>;
}

type CallbackOrValue<T> = T | (() => T | Promise<T>);

interface P2PClientOptions {
    url: CallbackOrValue<string>;
    connectionParams?: CallbackOrValue<TRPCRequestInfo["connectionParams"]>;
    node: Libp2p;
}

declare class P2PClient {
    readonly connectionState: BehaviorSubject<TRPCConnectionState<TRPCClientError<AnyTRPCRouter>>>;
    private allowReconnect;
    private requestManager;
    private activeConnection;
    private readonly multiaddr;
    private readonly reconnectRetryDelay;
    private inactivityTimeout;
    constructor(options: P2PClientOptions);
    private open;
    private reconnecting;
    private reconnect;
    private send;
    private batchSend;
    close(): Promise<void>;
    request({ op: { id, type, path, input, signal }, transformer, lastEventId, }: {
        op: Pick<Operation, 'id' | 'type' | 'path' | 'input' | 'signal'>;
        transformer: CombinedDataTransformer;
        lastEventId?: string;
    }): _trpc_server_observable.Observable<OperationResultEnvelope<unknown, TRPCClientError<AnyTRPCRouter>>, TRPCClientError<AnyTRPCRouter>>;
    get connection(): {
        readonly id: number;
        readonly state: "open";
        readonly stream: P2PStream & _libp2p_interface.Stream;
        readonly ws?: undefined;
    } | {
        readonly id: number;
        readonly state: "closed";
        readonly ws: P2PStream & _libp2p_interface.Stream;
        readonly stream?: undefined;
    } | {
        readonly id: number;
        readonly state: "connecting";
        readonly ws: P2PStream;
        readonly stream?: undefined;
    } | null;
    private setupListeners;
    private handleResponseMessage;
    private handleIncomingRequest;
}

declare function createP2PClient(options: P2PClientOptions): P2PClient;
type P2PLinkOptions<TRouter extends AnyRouter> = {
    client: P2PClient;
} & TransformerOptions<inferClientTypes<TRouter>>;
declare function p2pLink<TRouter extends AnyRouter>(options: P2PLinkOptions<TRouter>): TRPCLink<TRouter>;

export { applyHandler, createP2PClient, p2pLink };
export type { ConnectionHandlerOptions, CreateContextFn, HandlerOptions, P2PLinkOptions };
