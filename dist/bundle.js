import { randomBytes } from 'crypto';
import EventEmitter from 'events';

//#region src/unstable-core-do-not-import/rpc/codes.ts
/**
* JSON-RPC 2.0 Error codes
*
* `-32000` to `-32099` are reserved for implementation-defined server-errors.
* For tRPC we're copying the last digits of HTTP 4XX errors.
*/
const TRPC_ERROR_CODES_BY_KEY = {
	PARSE_ERROR: -32700,
	BAD_REQUEST: -32600,
	INTERNAL_SERVER_ERROR: -32603,
	NOT_IMPLEMENTED: -32603,
	BAD_GATEWAY: -32603,
	SERVICE_UNAVAILABLE: -32603,
	GATEWAY_TIMEOUT: -32603,
	UNAUTHORIZED: -32001,
	PAYMENT_REQUIRED: -32002,
	FORBIDDEN: -32003,
	NOT_FOUND: -32004,
	METHOD_NOT_SUPPORTED: -32005,
	TIMEOUT: -32008,
	CONFLICT: -32009,
	PRECONDITION_FAILED: -32012,
	PAYLOAD_TOO_LARGE: -32013,
	UNSUPPORTED_MEDIA_TYPE: -32015,
	UNPROCESSABLE_CONTENT: -32022,
	TOO_MANY_REQUESTS: -32029,
	CLIENT_CLOSED_REQUEST: -32099
};
/**
* Check that value is object
* @internal
*/
function isObject(value) {
	return !!value && !Array.isArray(value) && typeof value === "object";
}
const asyncIteratorsSupported = typeof Symbol === "function" && !!Symbol.asyncIterator;
function isAsyncIterable$3(value) {
	return asyncIteratorsSupported && isObject(value) && Symbol.asyncIterator in value;
}
function sleep(ms = 0) {
	return new Promise((res) => setTimeout(res, ms));
}

//#region rolldown:runtime
var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __commonJS$1 = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$1 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames$1(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(__defProp$1(target, "default", {
	value: mod,
	enumerable: true
}) , mod));

//#endregion
//#region src/unstable-core-do-not-import/http/getHTTPStatusCode.ts
const JSONRPC2_TO_HTTP_CODE = {
	PARSE_ERROR: 400,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	PAYMENT_REQUIRED: 402,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_SUPPORTED: 405,
	TIMEOUT: 408,
	CONFLICT: 409,
	PRECONDITION_FAILED: 412,
	PAYLOAD_TOO_LARGE: 413,
	UNSUPPORTED_MEDIA_TYPE: 415,
	UNPROCESSABLE_CONTENT: 422,
	TOO_MANY_REQUESTS: 429,
	CLIENT_CLOSED_REQUEST: 499,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
	GATEWAY_TIMEOUT: 504
};
function getStatusCodeFromKey(code) {
	var _JSONRPC2_TO_HTTP_COD;
	return (_JSONRPC2_TO_HTTP_COD = JSONRPC2_TO_HTTP_CODE[code]) !== null && _JSONRPC2_TO_HTTP_COD !== void 0 ? _JSONRPC2_TO_HTTP_COD : 500;
}
function getHTTPStatusCodeFromError(error) {
	return getStatusCodeFromKey(error.code);
}

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js
var require_typeof$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js"(exports, module) {
	function _typeof$2(o) {
		"@babel/helpers - typeof";
		return module.exports = _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
			return typeof o$1;
		} : function(o$1) {
			return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
		}, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof$2(o);
	}
	module.exports = _typeof$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js
var require_toPrimitive$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js"(exports, module) {
	var _typeof$1 = require_typeof$1()["default"];
	function toPrimitive$1(t, r) {
		if ("object" != _typeof$1(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof$1(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	module.exports = toPrimitive$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js
var require_toPropertyKey$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js"(exports, module) {
	var _typeof = require_typeof$1()["default"];
	var toPrimitive = require_toPrimitive$1();
	function toPropertyKey$1(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	module.exports = toPropertyKey$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js
var require_defineProperty$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js"(exports, module) {
	var toPropertyKey = require_toPropertyKey$1();
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: true,
			configurable: true,
			writable: true
		}) : e[r] = t, e;
	}
	module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js
var require_objectSpread2$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js"(exports, module) {
	var defineProperty = require_defineProperty$1();
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r$1) {
				return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), true).forEach(function(r$1) {
				defineProperty(e, r$1, t[r$1]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
				Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
			});
		}
		return e;
	}
	module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region src/unstable-core-do-not-import/error/getErrorShape.ts
var import_objectSpread2$2 = __toESM$1(require_objectSpread2$1());
/**
* @internal
*/
function getErrorShape(opts) {
	const { path, error, config } = opts;
	const { code } = opts.error;
	const shape = {
		message: error.message,
		code: TRPC_ERROR_CODES_BY_KEY[code],
		data: {
			code,
			httpStatus: getHTTPStatusCodeFromError(error)
		}
	};
	if (config.isDev && typeof opts.error.stack === "string") shape.data.stack = opts.error.stack;
	if (typeof path === "string") shape.data.path = path;
	return config.errorFormatter((0, import_objectSpread2$2.default)((0, import_objectSpread2$2.default)({}, opts), {}, { shape }));
}

//#endregion
//#region src/unstable-core-do-not-import/error/TRPCError.ts
var import_defineProperty$3 = __toESM$1(require_defineProperty$1());
var UnknownCauseError = class extends Error {};
function getCauseFromUnknown(cause) {
	if (cause instanceof Error) return cause;
	const type = typeof cause;
	if (type === "undefined" || type === "function" || cause === null) return void 0;
	if (type !== "object") return new Error(String(cause));
	if (isObject(cause)) return Object.assign(new UnknownCauseError(), cause);
	return void 0;
}
function getTRPCErrorFromUnknown(cause) {
	if (cause instanceof TRPCError) return cause;
	if (cause instanceof Error && cause.name === "TRPCError") return cause;
	const trpcError = new TRPCError({
		code: "INTERNAL_SERVER_ERROR",
		cause
	});
	if (cause instanceof Error && cause.stack) trpcError.stack = cause.stack;
	return trpcError;
}
var TRPCError = class extends Error {
	constructor(opts) {
		var _ref, _opts$message, _this$cause;
		const cause = getCauseFromUnknown(opts.cause);
		const message = (_ref = (_opts$message = opts.message) !== null && _opts$message !== void 0 ? _opts$message : cause === null || cause === void 0 ? void 0 : cause.message) !== null && _ref !== void 0 ? _ref : opts.code;
		super(message, { cause });
		(0, import_defineProperty$3.default)(this, "cause", void 0);
		(0, import_defineProperty$3.default)(this, "code", void 0);
		this.code = opts.code;
		this.name = "TRPCError";
		(_this$cause = this.cause) !== null && _this$cause !== void 0 || (this.cause = cause);
	}
};

//#endregion
//#region src/unstable-core-do-not-import/transformer.ts
var import_objectSpread2$1 = __toESM$1(require_objectSpread2$1());
function transformTRPCResponseItem(config, item) {
	if ("error" in item) return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, item), {}, { error: config.transformer.output.serialize(item.error) });
	if ("data" in item.result) return (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, item), {}, { result: (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, item.result), {}, { data: config.transformer.output.serialize(item.result.data) }) });
	return item;
}
/**
* Takes a unserialized `TRPCResponse` and serializes it with the router's transformers
**/
function transformTRPCResponse(config, itemOrItems) {
	return Array.isArray(itemOrItems) ? itemOrItems.map((item) => transformTRPCResponseItem(config, item)) : transformTRPCResponseItem(config, itemOrItems);
}
/** @internal */
function transformResultInner(response, transformer) {
	if ("error" in response) {
		const error = transformer.deserialize(response.error);
		return {
			ok: false,
			error: (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, response), {}, { error })
		};
	}
	const result = (0, import_objectSpread2$1.default)((0, import_objectSpread2$1.default)({}, response.result), (!response.result.type || response.result.type === "data") && {
		type: "data",
		data: transformer.deserialize(response.result.data)
	});
	return {
		ok: true,
		result
	};
}
var TransformResultError = class extends Error {
	constructor() {
		super("Unable to transform response from server");
	}
};
/**
* Transforms and validates that the result is a valid TRPCResponse
* @internal
*/
function transformResult(response, transformer) {
	let result;
	try {
		result = transformResultInner(response, transformer);
	} catch (_unused) {
		throw new TransformResultError();
	}
	if (!result.ok && (!isObject(result.error.error) || typeof result.error.error["code"] !== "number")) throw new TransformResultError();
	if (result.ok && !isObject(result.result)) throw new TransformResultError();
	return result;
}

//#endregion
//#region src/unstable-core-do-not-import/router.ts
__toESM$1(require_objectSpread2$1());
function isProcedure(procedureOrRouter) {
	return typeof procedureOrRouter === "function";
}
/**
* @internal
*/
async function getProcedureAtPath(router, path) {
	const { _def } = router;
	let procedure = _def.procedures[path];
	while (!procedure) {
		const key = Object.keys(_def.lazy).find((key$1) => path.startsWith(key$1));
		if (!key) return null;
		const lazyRouter = _def.lazy[key];
		await lazyRouter.load();
		procedure = _def.procedures[path];
	}
	return procedure;
}
/**
* @internal
*/
async function callProcedure(opts) {
	const { type, path } = opts;
	const proc = await getProcedureAtPath(opts.router, path);
	if (!proc || !isProcedure(proc) || proc._def.type !== type && !opts.allowMethodOverride) throw new TRPCError({
		code: "NOT_FOUND",
		message: `No "${type}"-procedure on path "${path}"`
	});
	/* istanbul ignore if -- @preserve */
	if (proc._def.type !== type && opts.allowMethodOverride && proc._def.type === "subscription") throw new TRPCError({
		code: "METHOD_NOT_SUPPORTED",
		message: `Method override is not supported for subscriptions`
	});
	return proc(opts);
}

//#endregion
//#region src/unstable-core-do-not-import/stream/tracked.ts
const trackedSymbol = Symbol();
function isTrackedEnvelope(value) {
	return Array.isArray(value) && value[2] === trackedSymbol;
}

//#region src/unstable-core-do-not-import/procedure.ts
const procedureTypes = [
	"query",
	"mutation",
	"subscription"
];

//#endregion
//#region src/unstable-core-do-not-import/rpc/parseTRPCMessage.ts
/* istanbul ignore next -- @preserve */
function assertIsObject(obj) {
	if (!isObject(obj)) throw new Error("Not an object");
}
/* istanbul ignore next -- @preserve */
function assertIsProcedureType(obj) {
	if (!procedureTypes.includes(obj)) throw new Error("Invalid procedure type");
}
/* istanbul ignore next -- @preserve */
function assertIsRequestId(obj) {
	if (obj !== null && typeof obj === "number" && isNaN(obj) && typeof obj !== "string") throw new Error("Invalid request id");
}
/* istanbul ignore next -- @preserve */
function assertIsString(obj) {
	if (typeof obj !== "string") throw new Error("Invalid string");
}
/* istanbul ignore next -- @preserve */
function assertIsJSONRPC2OrUndefined(obj) {
	if (typeof obj !== "undefined" && obj !== "2.0") throw new Error("Must be JSONRPC 2.0");
}
/** @public */
function parseTRPCMessage(obj, transformer) {
	assertIsObject(obj);
	const { id, jsonrpc, method, params } = obj;
	assertIsRequestId(id);
	assertIsJSONRPC2OrUndefined(jsonrpc);
	if (method === "subscription.stop") return {
		id,
		jsonrpc,
		method
	};
	assertIsProcedureType(method);
	assertIsObject(params);
	const { input: rawInput, path, lastEventId } = params;
	assertIsString(path);
	if (lastEventId !== void 0) assertIsString(lastEventId);
	const input = transformer.input.deserialize(rawInput);
	return {
		id,
		jsonrpc,
		method,
		params: {
			input,
			path,
			lastEventId
		}
	};
}

//#region src/observable/observable.ts
/** @public */
function isObservable(x) {
	return typeof x === "object" && x !== null && "subscribe" in x;
}
/** @public */
function observable(subscribe) {
	const self = {
		subscribe(observer) {
			let teardownRef = null;
			let isDone = false;
			let unsubscribed = false;
			let teardownImmediately = false;
			function unsubscribe() {
				if (teardownRef === null) {
					teardownImmediately = true;
					return;
				}
				if (unsubscribed) return;
				unsubscribed = true;
				if (typeof teardownRef === "function") teardownRef();
				else if (teardownRef) teardownRef.unsubscribe();
			}
			teardownRef = subscribe({
				next(value) {
					var _observer$next;
					if (isDone) return;
					(_observer$next = observer.next) === null || _observer$next === void 0 || _observer$next.call(observer, value);
				},
				error(err) {
					var _observer$error;
					if (isDone) return;
					isDone = true;
					(_observer$error = observer.error) === null || _observer$error === void 0 || _observer$error.call(observer, err);
					unsubscribe();
				},
				complete() {
					var _observer$complete;
					if (isDone) return;
					isDone = true;
					(_observer$complete = observer.complete) === null || _observer$complete === void 0 || _observer$complete.call(observer);
					unsubscribe();
				}
			});
			if (teardownImmediately) unsubscribe();
			return { unsubscribe };
		},
		pipe(...operations) {
			return operations.reduce(pipeReducer, self);
		}
	};
	return self;
}
function pipeReducer(prev, fn) {
	return fn(prev);
}
/**
* @internal
*/
function observableToReadableStream(observable$1, signal) {
	let unsub = null;
	const onAbort = () => {
		unsub === null || unsub === void 0 || unsub.unsubscribe();
		unsub = null;
		signal.removeEventListener("abort", onAbort);
	};
	return new ReadableStream({
		start(controller) {
			unsub = observable$1.subscribe({
				next(data) {
					controller.enqueue({
						ok: true,
						value: data
					});
				},
				error(error) {
					controller.enqueue({
						ok: false,
						error
					});
					controller.close();
				},
				complete() {
					controller.close();
				}
			});
			if (signal.aborted) onAbort();
			else signal.addEventListener("abort", onAbort, { once: true });
		},
		cancel() {
			onAbort();
		}
	});
}
/** @internal */
function observableToAsyncIterable(observable$1, signal) {
	const stream = observableToReadableStream(observable$1, signal);
	const reader = stream.getReader();
	const iterator = {
		async next() {
			const value = await reader.read();
			if (value.done) return {
				value: void 0,
				done: true
			};
			const { value: result } = value;
			if (!result.ok) throw result.error;
			return {
				value: result.value,
				done: false
			};
		},
		async return() {
			await reader.cancel();
			return {
				value: void 0,
				done: true
			};
		}
	};
	return { [Symbol.asyncIterator]() {
		return iterator;
	} };
}

//#endregion
//#region src/unstable-core-do-not-import/http/contentType.ts
__toESM$1(require_objectSpread2$1());

//#endregion
//#region src/vendor/unpromise/unpromise.ts
var import_defineProperty$2 = __toESM$1(require_defineProperty$1());
let _Symbol$toStringTag;
/** Memory safe (weakmapped) cache of the ProxyPromise for each Promise,
* which is retained for the lifetime of the original Promise.
*/
const subscribableCache = /* @__PURE__ */ new WeakMap();
/** A NOOP function allowing a consistent interface for settled
* SubscribedPromises (settled promises are not subscribed - they resolve
* immediately). */
const NOOP = () => {};
_Symbol$toStringTag = Symbol.toStringTag;
/**
* Every `Promise<T>` can be shadowed by a single `ProxyPromise<T>`. It is
* created once, cached and reused throughout the lifetime of the Promise. Get a
* Promise's ProxyPromise using `Unpromise.proxy(promise)`.
*
* The `ProxyPromise<T>` attaches handlers to the original `Promise<T>`
* `.then()` and `.catch()` just once. Promises derived from it use a
* subscription- (and unsubscription-) based mechanism that monitors these
* handlers.
*
* Every time you call `.subscribe()`, `.then()` `.catch()` or `.finally()` on a
* `ProxyPromise<T>` it returns a `SubscribedPromise<T>` having an additional
* `unsubscribe()` method. Calling `unsubscribe()` detaches reference chains
* from the original, potentially long-lived Promise, eliminating memory leaks.
*
* This approach can eliminate the memory leaks that otherwise come about from
* repeated `race()` or `any()` calls invoking `.then()` and `.catch()` multiple
* times on the same long-lived native Promise (subscriptions which can never be
* cleaned up).
*
* `Unpromise.race(promises)` is a reference implementation of `Promise.race`
* avoiding memory leaks when using long-lived unsettled Promises.
*
* `Unpromise.any(promises)` is a reference implementation of `Promise.any`
* avoiding memory leaks when using long-lived unsettled Promises.
*
* `Unpromise.resolve(promise)` returns an ephemeral `SubscribedPromise<T>` for
* any given `Promise<T>` facilitating arbitrary async/await patterns. Behind
* the scenes, `resolve` is implemented simply as
* `Unpromise.proxy(promise).subscribe()`. Don't forget to call `.unsubscribe()`
* to tidy up!
*
*/
var Unpromise = class Unpromise {
	constructor(arg) {
		(0, import_defineProperty$2.default)(this, "promise", void 0);
		(0, import_defineProperty$2.default)(this, "subscribers", []);
		(0, import_defineProperty$2.default)(this, "settlement", null);
		(0, import_defineProperty$2.default)(this, _Symbol$toStringTag, "Unpromise");
		if (typeof arg === "function") this.promise = new Promise(arg);
		else this.promise = arg;
		const thenReturn = this.promise.then((value) => {
			const { subscribers } = this;
			this.subscribers = null;
			this.settlement = {
				status: "fulfilled",
				value
			};
			subscribers === null || subscribers === void 0 || subscribers.forEach(({ resolve }) => {
				resolve(value);
			});
		});
		if ("catch" in thenReturn) thenReturn.catch((reason) => {
			const { subscribers } = this;
			this.subscribers = null;
			this.settlement = {
				status: "rejected",
				reason
			};
			subscribers === null || subscribers === void 0 || subscribers.forEach(({ reject }) => {
				reject(reason);
			});
		});
	}
	/** Create a promise that mitigates uncontrolled subscription to a long-lived
	* Promise via .then() and .catch() - otherwise a source of memory leaks.
	*
	* The returned promise has an `unsubscribe()` method which can be called when
	* the Promise is no longer being tracked by application logic, and which
	* ensures that there is no reference chain from the original promise to the
	* new one, and therefore no memory leak.
	*
	* If original promise has not yet settled, this adds a new unique promise
	* that listens to then/catch events, along with an `unsubscribe()` method to
	* detach it.
	*
	* If original promise has settled, then creates a new Promise.resolve() or
	* Promise.reject() and provided unsubscribe is a noop.
	*
	* If you call `unsubscribe()` before the returned Promise has settled, it
	* will never settle.
	*/
	subscribe() {
		let promise;
		let unsubscribe;
		const { settlement } = this;
		if (settlement === null) {
			if (this.subscribers === null) throw new Error("Unpromise settled but still has subscribers");
			const subscriber = withResolvers$2();
			this.subscribers = listWithMember(this.subscribers, subscriber);
			promise = subscriber.promise;
			unsubscribe = () => {
				if (this.subscribers !== null) this.subscribers = listWithoutMember(this.subscribers, subscriber);
			};
		} else {
			const { status } = settlement;
			if (status === "fulfilled") promise = Promise.resolve(settlement.value);
			else promise = Promise.reject(settlement.reason);
			unsubscribe = NOOP;
		}
		return Object.assign(promise, { unsubscribe });
	}
	/** STANDARD PROMISE METHODS (but returning a SubscribedPromise) */
	then(onfulfilled, onrejected) {
		const subscribed = this.subscribe();
		const { unsubscribe } = subscribed;
		return Object.assign(subscribed.then(onfulfilled, onrejected), { unsubscribe });
	}
	catch(onrejected) {
		const subscribed = this.subscribe();
		const { unsubscribe } = subscribed;
		return Object.assign(subscribed.catch(onrejected), { unsubscribe });
	}
	finally(onfinally) {
		const subscribed = this.subscribe();
		const { unsubscribe } = subscribed;
		return Object.assign(subscribed.finally(onfinally), { unsubscribe });
	}
	/** Unpromise STATIC METHODS */
	/** Create or Retrieve the proxy Unpromise (a re-used Unpromise for the VM lifetime
	* of the provided Promise reference) */
	static proxy(promise) {
		const cached = Unpromise.getSubscribablePromise(promise);
		return typeof cached !== "undefined" ? cached : Unpromise.createSubscribablePromise(promise);
	}
	/** Create and store an Unpromise keyed by an original Promise. */
	static createSubscribablePromise(promise) {
		const created = new Unpromise(promise);
		subscribableCache.set(promise, created);
		subscribableCache.set(created, created);
		return created;
	}
	/** Retrieve a previously-created Unpromise keyed by an original Promise. */
	static getSubscribablePromise(promise) {
		return subscribableCache.get(promise);
	}
	/** Promise STATIC METHODS */
	/** Lookup the Unpromise for this promise, and derive a SubscribedPromise from
	* it (that can be later unsubscribed to eliminate Memory leaks) */
	static resolve(value) {
		const promise = typeof value === "object" && value !== null && "then" in value && typeof value.then === "function" ? value : Promise.resolve(value);
		return Unpromise.proxy(promise).subscribe();
	}
	static async any(values) {
		const valuesArray = Array.isArray(values) ? values : [...values];
		const subscribedPromises = valuesArray.map(Unpromise.resolve);
		try {
			return await Promise.any(subscribedPromises);
		} finally {
			subscribedPromises.forEach(({ unsubscribe }) => {
				unsubscribe();
			});
		}
	}
	static async race(values) {
		const valuesArray = Array.isArray(values) ? values : [...values];
		const subscribedPromises = valuesArray.map(Unpromise.resolve);
		try {
			return await Promise.race(subscribedPromises);
		} finally {
			subscribedPromises.forEach(({ unsubscribe }) => {
				unsubscribe();
			});
		}
	}
	/** Create a race of SubscribedPromises that will fulfil to a single winning
	* Promise (in a 1-Tuple). Eliminates memory leaks from long-lived promises
	* accumulating .then() and .catch() subscribers. Allows simple logic to
	* consume the result, like...
	* ```ts
	* const [ winner ] = await Unpromise.race([ promiseA, promiseB ]);
	* if(winner === promiseB){
	*   const result = await promiseB;
	*   // do the thing
	* }
	* ```
	* */
	static async raceReferences(promises) {
		const selfPromises = promises.map(resolveSelfTuple);
		try {
			return await Promise.race(selfPromises);
		} finally {
			for (const promise of selfPromises) promise.unsubscribe();
		}
	}
};
/** Promises a 1-tuple containing the original promise when it resolves. Allows
* awaiting the eventual Promise ***reference*** (easy to destructure and
* exactly compare with ===). Avoids resolving to the Promise ***value*** (which
* may be ambiguous and therefore hard to identify as the winner of a race).
* You can call unsubscribe on the Promise to mitigate memory leaks.
* */
function resolveSelfTuple(promise) {
	return Unpromise.proxy(promise).then(() => [promise]);
}
/** VENDORED (Future) PROMISE UTILITIES */
/** Reference implementation of https://github.com/tc39/proposal-promise-with-resolvers */
function withResolvers$2() {
	let resolve;
	let reject;
	const promise = new Promise((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	return {
		promise,
		resolve,
		reject
	};
}
/** IMMUTABLE LIST OPERATIONS */
function listWithMember(arr, member) {
	return [...arr, member];
}
function listWithoutIndex(arr, index) {
	return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
function listWithoutMember(arr, member) {
	const index = arr.indexOf(member);
	if (index !== -1) return listWithoutIndex(arr, index);
	return arr;
}

//#endregion
//#region src/unstable-core-do-not-import/stream/utils/disposable.ts
var _Symbol, _Symbol$dispose, _Symbol2, _Symbol2$asyncDispose;
(_Symbol$dispose = (_Symbol = Symbol).dispose) !== null && _Symbol$dispose !== void 0 || (_Symbol.dispose = Symbol());
(_Symbol2$asyncDispose = (_Symbol2 = Symbol).asyncDispose) !== null && _Symbol2$asyncDispose !== void 0 || (_Symbol2.asyncDispose = Symbol());
/**
* Takes a value and an async dispose function and returns a new object that implements the AsyncDisposable interface.
* The returned object is the original value augmented with a Symbol.asyncDispose method.
* @param thing The value to make async disposable
* @param dispose Async function to call when disposing the resource
* @returns The original value with Symbol.asyncDispose method added
*/
function makeAsyncResource(thing, dispose) {
	const it = thing;
	const existing = it[Symbol.asyncDispose];
	it[Symbol.asyncDispose] = async () => {
		await dispose();
		await (existing === null || existing === void 0 ? void 0 : existing());
	};
	return it;
}

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/usingCtx.js
var require_usingCtx$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/usingCtx.js"(exports, module) {
	function _usingCtx() {
		var r = "function" == typeof SuppressedError ? SuppressedError : function(r$1, e$1) {
			var n$1 = Error();
			return n$1.name = "SuppressedError", n$1.error = r$1, n$1.suppressed = e$1, n$1;
		}, e = {}, n = [];
		function using(r$1, e$1) {
			if (null != e$1) {
				if (Object(e$1) !== e$1) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
				if (r$1) var o = e$1[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
				if (void 0 === o && (o = e$1[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r$1)) var t = o;
				if ("function" != typeof o) throw new TypeError("Object is not disposable.");
				t && (o = function o$1() {
					try {
						t.call(e$1);
					} catch (r$2) {
						return Promise.reject(r$2);
					}
				}), n.push({
					v: e$1,
					d: o,
					a: r$1
				});
			} else r$1 && n.push({
				d: e$1,
				a: r$1
			});
			return e$1;
		}
		return {
			e,
			u: using.bind(null, false),
			a: using.bind(null, true),
			d: function d() {
				var o, t = this.e, s = 0;
				function next() {
					for (; o = n.pop();) try {
						if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
						if (o.d) {
							var r$1 = o.d.call(o.v);
							if (o.a) return s |= 2, Promise.resolve(r$1).then(next, err);
						} else s |= 1;
					} catch (r$2) {
						return err(r$2);
					}
					if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
					if (t !== e) throw t;
				}
				function err(n$1) {
					return t = t !== e ? new r(n$1, t) : n$1, next();
				}
				return next();
			}
		};
	}
	module.exports = _usingCtx, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/OverloadYield.js
var require_OverloadYield$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/OverloadYield.js"(exports, module) {
	function _OverloadYield(e, d) {
		this.v = e, this.k = d;
	}
	module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/awaitAsyncGenerator.js
var require_awaitAsyncGenerator$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/awaitAsyncGenerator.js"(exports, module) {
	var OverloadYield$2 = require_OverloadYield$1();
	function _awaitAsyncGenerator$5(e) {
		return new OverloadYield$2(e, 0);
	}
	module.exports = _awaitAsyncGenerator$5, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/wrapAsyncGenerator.js
var require_wrapAsyncGenerator$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/wrapAsyncGenerator.js"(exports, module) {
	var OverloadYield$1 = require_OverloadYield$1();
	function _wrapAsyncGenerator$6(e) {
		return function() {
			return new AsyncGenerator(e.apply(this, arguments));
		};
	}
	function AsyncGenerator(e) {
		var r, t;
		function resume(r$1, t$1) {
			try {
				var n = e[r$1](t$1), o = n.value, u = o instanceof OverloadYield$1;
				Promise.resolve(u ? o.v : o).then(function(t$2) {
					if (u) {
						var i = "return" === r$1 ? "return" : "next";
						if (!o.k || t$2.done) return resume(i, t$2);
						t$2 = e[i](t$2).value;
					}
					settle(n.done ? "return" : "normal", t$2);
				}, function(e$1) {
					resume("throw", e$1);
				});
			} catch (e$1) {
				settle("throw", e$1);
			}
		}
		function settle(e$1, n) {
			switch (e$1) {
				case "return":
					r.resolve({
						value: n,
						done: true
					});
					break;
				case "throw":
					r.reject(n);
					break;
				default: r.resolve({
					value: n,
					done: false
				});
			}
			(r = r.next) ? resume(r.key, r.arg) : t = null;
		}
		this._invoke = function(e$1, n) {
			return new Promise(function(o, u) {
				var i = {
					key: e$1,
					arg: n,
					resolve: o,
					reject: u,
					next: null
				};
				t ? t = t.next = i : (r = t = i, resume(e$1, n));
			});
		}, "function" != typeof e["return"] && (this["return"] = void 0);
	}
	AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
		return this;
	}, AsyncGenerator.prototype.next = function(e) {
		return this._invoke("next", e);
	}, AsyncGenerator.prototype["throw"] = function(e) {
		return this._invoke("throw", e);
	}, AsyncGenerator.prototype["return"] = function(e) {
		return this._invoke("return", e);
	};
	module.exports = _wrapAsyncGenerator$6, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region src/unstable-core-do-not-import/stream/utils/asyncIterable.ts
__toESM$1(require_usingCtx$1());
__toESM$1(require_awaitAsyncGenerator$1());
__toESM$1(require_wrapAsyncGenerator$1());
function iteratorResource(iterable) {
	const iterator = iterable[Symbol.asyncIterator]();
	if (iterator[Symbol.asyncDispose]) return iterator;
	return makeAsyncResource(iterator, async () => {
		var _iterator$return;
		await ((_iterator$return = iterator.return) === null || _iterator$return === void 0 ? void 0 : _iterator$return.call(iterator));
	});
}

//#endregion
//#region src/unstable-core-do-not-import/stream/utils/mergeAsyncIterables.ts
__toESM$1(require_usingCtx$1());
__toESM$1(require_awaitAsyncGenerator$1());
__toESM$1(require_wrapAsyncGenerator$1());

//#endregion
//#region src/unstable-core-do-not-import/stream/utils/withPing.ts
__toESM$1(require_usingCtx$1());
__toESM$1(require_awaitAsyncGenerator$1());
__toESM$1(require_wrapAsyncGenerator$1());

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js
var require_asyncIterator$1 = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js"(exports, module) {
	function _asyncIterator$2(r) {
		var n, t, o, e = 2;
		for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
			if (t && null != (n = r[t])) return n.call(r);
			if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
			t = "@@asyncIterator", o = "@@iterator";
		}
		throw new TypeError("Object is not async iterable");
	}
	function AsyncFromSyncIterator(r) {
		function AsyncFromSyncIteratorContinuation(r$1) {
			if (Object(r$1) !== r$1) return Promise.reject(new TypeError(r$1 + " is not an object."));
			var n = r$1.done;
			return Promise.resolve(r$1.value).then(function(r$2) {
				return {
					value: r$2,
					done: n
				};
			});
		}
		return AsyncFromSyncIterator = function AsyncFromSyncIterator$1(r$1) {
			this.s = r$1, this.n = r$1.next;
		}, AsyncFromSyncIterator.prototype = {
			s: null,
			n: null,
			next: function next() {
				return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
			},
			"return": function _return(r$1) {
				var n = this.s["return"];
				return void 0 === n ? Promise.resolve({
					value: r$1,
					done: true
				}) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
			},
			"throw": function _throw(r$1) {
				var n = this.s["return"];
				return void 0 === n ? Promise.reject(r$1) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
			}
		}, new AsyncFromSyncIterator(r);
	}
	module.exports = _asyncIterator$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region src/unstable-core-do-not-import/stream/jsonl.ts
__toESM$1(require_awaitAsyncGenerator$1());
__toESM$1(require_wrapAsyncGenerator$1());
__toESM$1(require_usingCtx$1());
__toESM$1(require_asyncIterator$1());

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncGeneratorDelegate.js
var require_asyncGeneratorDelegate = __commonJS$1({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncGeneratorDelegate.js"(exports, module) {
	var OverloadYield = require_OverloadYield$1();
	function _asyncGeneratorDelegate$1(t) {
		var e = {}, n = false;
		function pump(e$1, r) {
			return n = true, r = new Promise(function(n$1) {
				n$1(t[e$1](r));
			}), {
				done: false,
				value: new OverloadYield(r, 1)
			};
		}
		return e["undefined" != typeof Symbol && Symbol.iterator || "@@iterator"] = function() {
			return this;
		}, e.next = function(t$1) {
			return n ? (n = false, t$1) : pump("next", t$1);
		}, "function" == typeof t["throw"] && (e["throw"] = function(t$1) {
			if (n) throw n = false, t$1;
			return pump("throw", t$1);
		}), "function" == typeof t["return"] && (e["return"] = function(t$1) {
			return n ? (n = false, t$1) : pump("return", t$1);
		}), e;
	}
	module.exports = _asyncGeneratorDelegate$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region src/unstable-core-do-not-import/stream/sse.ts
__toESM$1(require_asyncIterator$1());
__toESM$1(require_awaitAsyncGenerator$1());
__toESM$1(require_wrapAsyncGenerator$1());
__toESM$1(require_asyncGeneratorDelegate());
__toESM$1(require_usingCtx$1());

//#endregion
//#region src/unstable-core-do-not-import/http/resolveResponse.ts
__toESM$1(require_wrapAsyncGenerator$1());
__toESM$1(require_objectSpread2$1());

const TypedArrayPrototypeGetSymbolToStringTag = (() => {
    const g = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(Uint8Array.prototype), Symbol.toStringTag).get;
    return (value) => g.call(value);
})();
function isUint8Array(value) {
    return TypedArrayPrototypeGetSymbolToStringTag(value) === 'Uint8Array';
}
function isAnyArrayBuffer(value) {
    return (typeof value === 'object' &&
        value != null &&
        Symbol.toStringTag in value &&
        (value[Symbol.toStringTag] === 'ArrayBuffer' ||
            value[Symbol.toStringTag] === 'SharedArrayBuffer'));
}
function isRegExp(regexp) {
    return regexp instanceof RegExp || Object.prototype.toString.call(regexp) === '[object RegExp]';
}
function isMap(value) {
    return (typeof value === 'object' &&
        value != null &&
        Symbol.toStringTag in value &&
        value[Symbol.toStringTag] === 'Map');
}
function isDate(date) {
    return date instanceof Date || Object.prototype.toString.call(date) === '[object Date]';
}
function defaultInspect(x, _options) {
    return JSON.stringify(x, (k, v) => {
        if (typeof v === 'bigint') {
            return { $numberLong: `${v}` };
        }
        else if (isMap(v)) {
            return Object.fromEntries(v);
        }
        return v;
    });
}
function getStylizeFunction(options) {
    const stylizeExists = options != null &&
        typeof options === 'object' &&
        'stylize' in options &&
        typeof options.stylize === 'function';
    if (stylizeExists) {
        return options.stylize;
    }
}

const BSON_MAJOR_VERSION = 6;
const BSON_VERSION_SYMBOL = Symbol.for('@@mdb.bson.version');
const BSON_INT32_MAX = 0x7fffffff;
const BSON_INT32_MIN = -2147483648;
const BSON_INT64_MAX = Math.pow(2, 63) - 1;
const BSON_INT64_MIN = -Math.pow(2, 63);
const JS_INT_MAX = Math.pow(2, 53);
const JS_INT_MIN = -Math.pow(2, 53);
const BSON_DATA_NUMBER = 1;
const BSON_DATA_STRING = 2;
const BSON_DATA_OBJECT = 3;
const BSON_DATA_ARRAY = 4;
const BSON_DATA_BINARY = 5;
const BSON_DATA_UNDEFINED = 6;
const BSON_DATA_OID = 7;
const BSON_DATA_BOOLEAN = 8;
const BSON_DATA_DATE = 9;
const BSON_DATA_NULL = 10;
const BSON_DATA_REGEXP = 11;
const BSON_DATA_DBPOINTER = 12;
const BSON_DATA_CODE = 13;
const BSON_DATA_SYMBOL = 14;
const BSON_DATA_CODE_W_SCOPE = 15;
const BSON_DATA_INT = 16;
const BSON_DATA_TIMESTAMP = 17;
const BSON_DATA_LONG = 18;
const BSON_DATA_DECIMAL128 = 19;
const BSON_DATA_MIN_KEY = 0xff;
const BSON_DATA_MAX_KEY = 0x7f;
const BSON_BINARY_SUBTYPE_DEFAULT = 0;
const BSON_BINARY_SUBTYPE_UUID_NEW = 4;
const BSONType = Object.freeze({
    double: 1,
    string: 2,
    object: 3,
    array: 4,
    binData: 5,
    undefined: 6,
    objectId: 7,
    bool: 8,
    date: 9,
    null: 10,
    regex: 11,
    dbPointer: 12,
    javascript: 13,
    symbol: 14,
    javascriptWithScope: 15,
    int: 16,
    timestamp: 17,
    long: 18,
    decimal: 19,
    minKey: -1,
    maxKey: 127
});

class BSONError extends Error {
    get bsonError() {
        return true;
    }
    get name() {
        return 'BSONError';
    }
    constructor(message, options) {
        super(message, options);
    }
    static isBSONError(value) {
        return (value != null &&
            typeof value === 'object' &&
            'bsonError' in value &&
            value.bsonError === true &&
            'name' in value &&
            'message' in value &&
            'stack' in value);
    }
}
class BSONVersionError extends BSONError {
    get name() {
        return 'BSONVersionError';
    }
    constructor() {
        super(`Unsupported BSON version, bson types must be from bson ${BSON_MAJOR_VERSION}.x.x`);
    }
}
class BSONRuntimeError extends BSONError {
    get name() {
        return 'BSONRuntimeError';
    }
    constructor(message) {
        super(message);
    }
}
class BSONOffsetError extends BSONError {
    get name() {
        return 'BSONOffsetError';
    }
    constructor(message, offset, options) {
        super(`${message}. offset: ${offset}`, options);
        this.offset = offset;
    }
}

let TextDecoderFatal;
let TextDecoderNonFatal;
function parseUtf8(buffer, start, end, fatal) {
    if (fatal) {
        TextDecoderFatal ??= new TextDecoder('utf8', { fatal: true });
        try {
            return TextDecoderFatal.decode(buffer.subarray(start, end));
        }
        catch (cause) {
            throw new BSONError('Invalid UTF-8 string in BSON document', { cause });
        }
    }
    TextDecoderNonFatal ??= new TextDecoder('utf8', { fatal: false });
    return TextDecoderNonFatal.decode(buffer.subarray(start, end));
}

function tryReadBasicLatin(uint8array, start, end) {
    if (uint8array.length === 0) {
        return '';
    }
    const stringByteLength = end - start;
    if (stringByteLength === 0) {
        return '';
    }
    if (stringByteLength > 20) {
        return null;
    }
    if (stringByteLength === 1 && uint8array[start] < 128) {
        return String.fromCharCode(uint8array[start]);
    }
    if (stringByteLength === 2 && uint8array[start] < 128 && uint8array[start + 1] < 128) {
        return String.fromCharCode(uint8array[start]) + String.fromCharCode(uint8array[start + 1]);
    }
    if (stringByteLength === 3 &&
        uint8array[start] < 128 &&
        uint8array[start + 1] < 128 &&
        uint8array[start + 2] < 128) {
        return (String.fromCharCode(uint8array[start]) +
            String.fromCharCode(uint8array[start + 1]) +
            String.fromCharCode(uint8array[start + 2]));
    }
    const latinBytes = [];
    for (let i = start; i < end; i++) {
        const byte = uint8array[i];
        if (byte > 127) {
            return null;
        }
        latinBytes.push(byte);
    }
    return String.fromCharCode(...latinBytes);
}
function tryWriteBasicLatin(destination, source, offset) {
    if (source.length === 0)
        return 0;
    if (source.length > 25)
        return null;
    if (destination.length - offset < source.length)
        return null;
    for (let charOffset = 0, destinationOffset = offset; charOffset < source.length; charOffset++, destinationOffset++) {
        const char = source.charCodeAt(charOffset);
        if (char > 127)
            return null;
        destination[destinationOffset] = char;
    }
    return source.length;
}

const nodeJsByteUtils = {
    toLocalBufferType(potentialBuffer) {
        if (Buffer.isBuffer(potentialBuffer)) {
            return potentialBuffer;
        }
        if (ArrayBuffer.isView(potentialBuffer)) {
            return Buffer.from(potentialBuffer.buffer, potentialBuffer.byteOffset, potentialBuffer.byteLength);
        }
        const stringTag = potentialBuffer?.[Symbol.toStringTag] ?? Object.prototype.toString.call(potentialBuffer);
        if (stringTag === 'ArrayBuffer' ||
            stringTag === 'SharedArrayBuffer' ||
            stringTag === '[object ArrayBuffer]' ||
            stringTag === '[object SharedArrayBuffer]') {
            return Buffer.from(potentialBuffer);
        }
        throw new BSONError(`Cannot create Buffer from the passed potentialBuffer.`);
    },
    allocate(size) {
        return Buffer.alloc(size);
    },
    allocateUnsafe(size) {
        return Buffer.allocUnsafe(size);
    },
    equals(a, b) {
        return nodeJsByteUtils.toLocalBufferType(a).equals(b);
    },
    fromNumberArray(array) {
        return Buffer.from(array);
    },
    fromBase64(base64) {
        return Buffer.from(base64, 'base64');
    },
    toBase64(buffer) {
        return nodeJsByteUtils.toLocalBufferType(buffer).toString('base64');
    },
    fromISO88591(codePoints) {
        return Buffer.from(codePoints, 'binary');
    },
    toISO88591(buffer) {
        return nodeJsByteUtils.toLocalBufferType(buffer).toString('binary');
    },
    fromHex(hex) {
        return Buffer.from(hex, 'hex');
    },
    toHex(buffer) {
        return nodeJsByteUtils.toLocalBufferType(buffer).toString('hex');
    },
    toUTF8(buffer, start, end, fatal) {
        const basicLatin = end - start <= 20 ? tryReadBasicLatin(buffer, start, end) : null;
        if (basicLatin != null) {
            return basicLatin;
        }
        const string = nodeJsByteUtils.toLocalBufferType(buffer).toString('utf8', start, end);
        if (fatal) {
            for (let i = 0; i < string.length; i++) {
                if (string.charCodeAt(i) === 0xfffd) {
                    parseUtf8(buffer, start, end, true);
                    break;
                }
            }
        }
        return string;
    },
    utf8ByteLength(input) {
        return Buffer.byteLength(input, 'utf8');
    },
    encodeUTF8Into(buffer, source, byteOffset) {
        const latinBytesWritten = tryWriteBasicLatin(buffer, source, byteOffset);
        if (latinBytesWritten != null) {
            return latinBytesWritten;
        }
        return nodeJsByteUtils.toLocalBufferType(buffer).write(source, byteOffset, undefined, 'utf8');
    },
    randomBytes: randomBytes,
    swap32(buffer) {
        return nodeJsByteUtils.toLocalBufferType(buffer).swap32();
    }
};

function isReactNative() {
    const { navigator } = globalThis;
    return typeof navigator === 'object' && navigator.product === 'ReactNative';
}
function webMathRandomBytes(byteLength) {
    if (byteLength < 0) {
        throw new RangeError(`The argument 'byteLength' is invalid. Received ${byteLength}`);
    }
    return webByteUtils.fromNumberArray(Array.from({ length: byteLength }, () => Math.floor(Math.random() * 256)));
}
const webRandomBytes = (() => {
    const { crypto } = globalThis;
    if (crypto != null && typeof crypto.getRandomValues === 'function') {
        return (byteLength) => {
            return crypto.getRandomValues(webByteUtils.allocate(byteLength));
        };
    }
    else {
        if (isReactNative()) {
            const { console } = globalThis;
            console?.warn?.('BSON: For React Native please polyfill crypto.getRandomValues, e.g. using: https://www.npmjs.com/package/react-native-get-random-values.');
        }
        return webMathRandomBytes;
    }
})();
const HEX_DIGIT = /(\d|[a-f])/i;
const webByteUtils = {
    toLocalBufferType(potentialUint8array) {
        const stringTag = potentialUint8array?.[Symbol.toStringTag] ??
            Object.prototype.toString.call(potentialUint8array);
        if (stringTag === 'Uint8Array') {
            return potentialUint8array;
        }
        if (ArrayBuffer.isView(potentialUint8array)) {
            return new Uint8Array(potentialUint8array.buffer.slice(potentialUint8array.byteOffset, potentialUint8array.byteOffset + potentialUint8array.byteLength));
        }
        if (stringTag === 'ArrayBuffer' ||
            stringTag === 'SharedArrayBuffer' ||
            stringTag === '[object ArrayBuffer]' ||
            stringTag === '[object SharedArrayBuffer]') {
            return new Uint8Array(potentialUint8array);
        }
        throw new BSONError(`Cannot make a Uint8Array from passed potentialBuffer.`);
    },
    allocate(size) {
        if (typeof size !== 'number') {
            throw new TypeError(`The "size" argument must be of type number. Received ${String(size)}`);
        }
        return new Uint8Array(size);
    },
    allocateUnsafe(size) {
        return webByteUtils.allocate(size);
    },
    equals(a, b) {
        if (a.byteLength !== b.byteLength) {
            return false;
        }
        for (let i = 0; i < a.byteLength; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    },
    fromNumberArray(array) {
        return Uint8Array.from(array);
    },
    fromBase64(base64) {
        return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    },
    toBase64(uint8array) {
        return btoa(webByteUtils.toISO88591(uint8array));
    },
    fromISO88591(codePoints) {
        return Uint8Array.from(codePoints, c => c.charCodeAt(0) & 0xff);
    },
    toISO88591(uint8array) {
        return Array.from(Uint16Array.from(uint8array), b => String.fromCharCode(b)).join('');
    },
    fromHex(hex) {
        const evenLengthHex = hex.length % 2 === 0 ? hex : hex.slice(0, hex.length - 1);
        const buffer = [];
        for (let i = 0; i < evenLengthHex.length; i += 2) {
            const firstDigit = evenLengthHex[i];
            const secondDigit = evenLengthHex[i + 1];
            if (!HEX_DIGIT.test(firstDigit)) {
                break;
            }
            if (!HEX_DIGIT.test(secondDigit)) {
                break;
            }
            const hexDigit = Number.parseInt(`${firstDigit}${secondDigit}`, 16);
            buffer.push(hexDigit);
        }
        return Uint8Array.from(buffer);
    },
    toHex(uint8array) {
        return Array.from(uint8array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    toUTF8(uint8array, start, end, fatal) {
        const basicLatin = end - start <= 20 ? tryReadBasicLatin(uint8array, start, end) : null;
        if (basicLatin != null) {
            return basicLatin;
        }
        return parseUtf8(uint8array, start, end, fatal);
    },
    utf8ByteLength(input) {
        return new TextEncoder().encode(input).byteLength;
    },
    encodeUTF8Into(uint8array, source, byteOffset) {
        const bytes = new TextEncoder().encode(source);
        uint8array.set(bytes, byteOffset);
        return bytes.byteLength;
    },
    randomBytes: webRandomBytes,
    swap32(buffer) {
        if (buffer.length % 4 !== 0) {
            throw new RangeError('Buffer size must be a multiple of 32-bits');
        }
        for (let i = 0; i < buffer.length; i += 4) {
            const byte0 = buffer[i];
            const byte1 = buffer[i + 1];
            const byte2 = buffer[i + 2];
            const byte3 = buffer[i + 3];
            buffer[i] = byte3;
            buffer[i + 1] = byte2;
            buffer[i + 2] = byte1;
            buffer[i + 3] = byte0;
        }
        return buffer;
    }
};

const hasGlobalBuffer = typeof Buffer === 'function' && Buffer.prototype?._isBuffer !== true;
const ByteUtils = hasGlobalBuffer ? nodeJsByteUtils : webByteUtils;

class BSONValue {
    get [BSON_VERSION_SYMBOL]() {
        return BSON_MAJOR_VERSION;
    }
    [Symbol.for('nodejs.util.inspect.custom')](depth, options, inspect) {
        return this.inspect(depth, options, inspect);
    }
}

const FLOAT = new Float64Array(1);
const FLOAT_BYTES = new Uint8Array(FLOAT.buffer, 0, 8);
FLOAT[0] = -1;
const isBigEndian = FLOAT_BYTES[7] === 0;
const NumberUtils = {
    isBigEndian,
    getNonnegativeInt32LE(source, offset) {
        if (source[offset + 3] > 127) {
            throw new RangeError(`Size cannot be negative at offset: ${offset}`);
        }
        return (source[offset] |
            (source[offset + 1] << 8) |
            (source[offset + 2] << 16) |
            (source[offset + 3] << 24));
    },
    getInt32LE(source, offset) {
        return (source[offset] |
            (source[offset + 1] << 8) |
            (source[offset + 2] << 16) |
            (source[offset + 3] << 24));
    },
    getUint32LE(source, offset) {
        return (source[offset] +
            source[offset + 1] * 256 +
            source[offset + 2] * 65536 +
            source[offset + 3] * 16777216);
    },
    getUint32BE(source, offset) {
        return (source[offset + 3] +
            source[offset + 2] * 256 +
            source[offset + 1] * 65536 +
            source[offset] * 16777216);
    },
    getBigInt64LE(source, offset) {
        const hi = BigInt(source[offset + 4] +
            source[offset + 5] * 256 +
            source[offset + 6] * 65536 +
            (source[offset + 7] << 24));
        const lo = BigInt(source[offset] +
            source[offset + 1] * 256 +
            source[offset + 2] * 65536 +
            source[offset + 3] * 16777216);
        return (hi << BigInt(32)) + lo;
    },
    getFloat64LE: isBigEndian
        ? (source, offset) => {
            FLOAT_BYTES[7] = source[offset];
            FLOAT_BYTES[6] = source[offset + 1];
            FLOAT_BYTES[5] = source[offset + 2];
            FLOAT_BYTES[4] = source[offset + 3];
            FLOAT_BYTES[3] = source[offset + 4];
            FLOAT_BYTES[2] = source[offset + 5];
            FLOAT_BYTES[1] = source[offset + 6];
            FLOAT_BYTES[0] = source[offset + 7];
            return FLOAT[0];
        }
        : (source, offset) => {
            FLOAT_BYTES[0] = source[offset];
            FLOAT_BYTES[1] = source[offset + 1];
            FLOAT_BYTES[2] = source[offset + 2];
            FLOAT_BYTES[3] = source[offset + 3];
            FLOAT_BYTES[4] = source[offset + 4];
            FLOAT_BYTES[5] = source[offset + 5];
            FLOAT_BYTES[6] = source[offset + 6];
            FLOAT_BYTES[7] = source[offset + 7];
            return FLOAT[0];
        },
    setInt32BE(destination, offset, value) {
        destination[offset + 3] = value;
        value >>>= 8;
        destination[offset + 2] = value;
        value >>>= 8;
        destination[offset + 1] = value;
        value >>>= 8;
        destination[offset] = value;
        return 4;
    },
    setInt32LE(destination, offset, value) {
        destination[offset] = value;
        value >>>= 8;
        destination[offset + 1] = value;
        value >>>= 8;
        destination[offset + 2] = value;
        value >>>= 8;
        destination[offset + 3] = value;
        return 4;
    },
    setBigInt64LE(destination, offset, value) {
        const mask32bits = BigInt(0xffff_ffff);
        let lo = Number(value & mask32bits);
        destination[offset] = lo;
        lo >>= 8;
        destination[offset + 1] = lo;
        lo >>= 8;
        destination[offset + 2] = lo;
        lo >>= 8;
        destination[offset + 3] = lo;
        let hi = Number((value >> BigInt(32)) & mask32bits);
        destination[offset + 4] = hi;
        hi >>= 8;
        destination[offset + 5] = hi;
        hi >>= 8;
        destination[offset + 6] = hi;
        hi >>= 8;
        destination[offset + 7] = hi;
        return 8;
    },
    setFloat64LE: isBigEndian
        ? (destination, offset, value) => {
            FLOAT[0] = value;
            destination[offset] = FLOAT_BYTES[7];
            destination[offset + 1] = FLOAT_BYTES[6];
            destination[offset + 2] = FLOAT_BYTES[5];
            destination[offset + 3] = FLOAT_BYTES[4];
            destination[offset + 4] = FLOAT_BYTES[3];
            destination[offset + 5] = FLOAT_BYTES[2];
            destination[offset + 6] = FLOAT_BYTES[1];
            destination[offset + 7] = FLOAT_BYTES[0];
            return 8;
        }
        : (destination, offset, value) => {
            FLOAT[0] = value;
            destination[offset] = FLOAT_BYTES[0];
            destination[offset + 1] = FLOAT_BYTES[1];
            destination[offset + 2] = FLOAT_BYTES[2];
            destination[offset + 3] = FLOAT_BYTES[3];
            destination[offset + 4] = FLOAT_BYTES[4];
            destination[offset + 5] = FLOAT_BYTES[5];
            destination[offset + 6] = FLOAT_BYTES[6];
            destination[offset + 7] = FLOAT_BYTES[7];
            return 8;
        }
};

class Binary extends BSONValue {
    get _bsontype() {
        return 'Binary';
    }
    constructor(buffer, subType) {
        super();
        if (!(buffer == null) &&
            typeof buffer === 'string' &&
            !ArrayBuffer.isView(buffer) &&
            !isAnyArrayBuffer(buffer) &&
            !Array.isArray(buffer)) {
            throw new BSONError('Binary can only be constructed from Uint8Array or number[]');
        }
        this.sub_type = subType ?? Binary.BSON_BINARY_SUBTYPE_DEFAULT;
        if (buffer == null) {
            this.buffer = ByteUtils.allocate(Binary.BUFFER_SIZE);
            this.position = 0;
        }
        else {
            this.buffer = Array.isArray(buffer)
                ? ByteUtils.fromNumberArray(buffer)
                : ByteUtils.toLocalBufferType(buffer);
            this.position = this.buffer.byteLength;
        }
    }
    put(byteValue) {
        if (typeof byteValue === 'string' && byteValue.length !== 1) {
            throw new BSONError('only accepts single character String');
        }
        else if (typeof byteValue !== 'number' && byteValue.length !== 1)
            throw new BSONError('only accepts single character Uint8Array or Array');
        let decodedByte;
        if (typeof byteValue === 'string') {
            decodedByte = byteValue.charCodeAt(0);
        }
        else if (typeof byteValue === 'number') {
            decodedByte = byteValue;
        }
        else {
            decodedByte = byteValue[0];
        }
        if (decodedByte < 0 || decodedByte > 255) {
            throw new BSONError('only accepts number in a valid unsigned byte range 0-255');
        }
        if (this.buffer.byteLength > this.position) {
            this.buffer[this.position++] = decodedByte;
        }
        else {
            const newSpace = ByteUtils.allocate(Binary.BUFFER_SIZE + this.buffer.length);
            newSpace.set(this.buffer, 0);
            this.buffer = newSpace;
            this.buffer[this.position++] = decodedByte;
        }
    }
    write(sequence, offset) {
        offset = typeof offset === 'number' ? offset : this.position;
        if (this.buffer.byteLength < offset + sequence.length) {
            const newSpace = ByteUtils.allocate(this.buffer.byteLength + sequence.length);
            newSpace.set(this.buffer, 0);
            this.buffer = newSpace;
        }
        if (ArrayBuffer.isView(sequence)) {
            this.buffer.set(ByteUtils.toLocalBufferType(sequence), offset);
            this.position =
                offset + sequence.byteLength > this.position ? offset + sequence.length : this.position;
        }
        else if (typeof sequence === 'string') {
            throw new BSONError('input cannot be string');
        }
    }
    read(position, length) {
        length = length && length > 0 ? length : this.position;
        const end = position + length;
        return this.buffer.subarray(position, end > this.position ? this.position : end);
    }
    value() {
        return this.buffer.length === this.position
            ? this.buffer
            : this.buffer.subarray(0, this.position);
    }
    length() {
        return this.position;
    }
    toJSON() {
        return ByteUtils.toBase64(this.buffer.subarray(0, this.position));
    }
    toString(encoding) {
        if (encoding === 'hex')
            return ByteUtils.toHex(this.buffer.subarray(0, this.position));
        if (encoding === 'base64')
            return ByteUtils.toBase64(this.buffer.subarray(0, this.position));
        if (encoding === 'utf8' || encoding === 'utf-8')
            return ByteUtils.toUTF8(this.buffer, 0, this.position, false);
        return ByteUtils.toUTF8(this.buffer, 0, this.position, false);
    }
    toExtendedJSON(options) {
        options = options || {};
        if (this.sub_type === Binary.SUBTYPE_VECTOR) {
            validateBinaryVector(this);
        }
        const base64String = ByteUtils.toBase64(this.buffer);
        const subType = Number(this.sub_type).toString(16);
        if (options.legacy) {
            return {
                $binary: base64String,
                $type: subType.length === 1 ? '0' + subType : subType
            };
        }
        return {
            $binary: {
                base64: base64String,
                subType: subType.length === 1 ? '0' + subType : subType
            }
        };
    }
    toUUID() {
        if (this.sub_type === Binary.SUBTYPE_UUID) {
            return new UUID(this.buffer.subarray(0, this.position));
        }
        throw new BSONError(`Binary sub_type "${this.sub_type}" is not supported for converting to UUID. Only "${Binary.SUBTYPE_UUID}" is currently supported.`);
    }
    static createFromHexString(hex, subType) {
        return new Binary(ByteUtils.fromHex(hex), subType);
    }
    static createFromBase64(base64, subType) {
        return new Binary(ByteUtils.fromBase64(base64), subType);
    }
    static fromExtendedJSON(doc, options) {
        options = options || {};
        let data;
        let type;
        if ('$binary' in doc) {
            if (options.legacy && typeof doc.$binary === 'string' && '$type' in doc) {
                type = doc.$type ? parseInt(doc.$type, 16) : 0;
                data = ByteUtils.fromBase64(doc.$binary);
            }
            else {
                if (typeof doc.$binary !== 'string') {
                    type = doc.$binary.subType ? parseInt(doc.$binary.subType, 16) : 0;
                    data = ByteUtils.fromBase64(doc.$binary.base64);
                }
            }
        }
        else if ('$uuid' in doc) {
            type = 4;
            data = UUID.bytesFromString(doc.$uuid);
        }
        if (!data) {
            throw new BSONError(`Unexpected Binary Extended JSON format ${JSON.stringify(doc)}`);
        }
        return type === BSON_BINARY_SUBTYPE_UUID_NEW ? new UUID(data) : new Binary(data, type);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        const base64 = ByteUtils.toBase64(this.buffer.subarray(0, this.position));
        const base64Arg = inspect(base64, options);
        const subTypeArg = inspect(this.sub_type, options);
        return `Binary.createFromBase64(${base64Arg}, ${subTypeArg})`;
    }
    toInt8Array() {
        if (this.sub_type !== Binary.SUBTYPE_VECTOR) {
            throw new BSONError('Binary sub_type is not Vector');
        }
        if (this.buffer[0] !== Binary.VECTOR_TYPE.Int8) {
            throw new BSONError('Binary datatype field is not Int8');
        }
        validateBinaryVector(this);
        return new Int8Array(this.buffer.buffer.slice(this.buffer.byteOffset + 2, this.buffer.byteOffset + this.position));
    }
    toFloat32Array() {
        if (this.sub_type !== Binary.SUBTYPE_VECTOR) {
            throw new BSONError('Binary sub_type is not Vector');
        }
        if (this.buffer[0] !== Binary.VECTOR_TYPE.Float32) {
            throw new BSONError('Binary datatype field is not Float32');
        }
        validateBinaryVector(this);
        const floatBytes = new Uint8Array(this.buffer.buffer.slice(this.buffer.byteOffset + 2, this.buffer.byteOffset + this.position));
        if (NumberUtils.isBigEndian)
            ByteUtils.swap32(floatBytes);
        return new Float32Array(floatBytes.buffer);
    }
    toPackedBits() {
        if (this.sub_type !== Binary.SUBTYPE_VECTOR) {
            throw new BSONError('Binary sub_type is not Vector');
        }
        if (this.buffer[0] !== Binary.VECTOR_TYPE.PackedBit) {
            throw new BSONError('Binary datatype field is not packed bit');
        }
        validateBinaryVector(this);
        return new Uint8Array(this.buffer.buffer.slice(this.buffer.byteOffset + 2, this.buffer.byteOffset + this.position));
    }
    toBits() {
        if (this.sub_type !== Binary.SUBTYPE_VECTOR) {
            throw new BSONError('Binary sub_type is not Vector');
        }
        if (this.buffer[0] !== Binary.VECTOR_TYPE.PackedBit) {
            throw new BSONError('Binary datatype field is not packed bit');
        }
        validateBinaryVector(this);
        const byteCount = this.length() - 2;
        const bitCount = byteCount * 8 - this.buffer[1];
        const bits = new Int8Array(bitCount);
        for (let bitOffset = 0; bitOffset < bits.length; bitOffset++) {
            const byteOffset = (bitOffset / 8) | 0;
            const byte = this.buffer[byteOffset + 2];
            const shift = 7 - (bitOffset % 8);
            const bit = (byte >> shift) & 1;
            bits[bitOffset] = bit;
        }
        return bits;
    }
    static fromInt8Array(array) {
        const buffer = ByteUtils.allocate(array.byteLength + 2);
        buffer[0] = Binary.VECTOR_TYPE.Int8;
        buffer[1] = 0;
        const intBytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        buffer.set(intBytes, 2);
        const bin = new this(buffer, this.SUBTYPE_VECTOR);
        validateBinaryVector(bin);
        return bin;
    }
    static fromFloat32Array(array) {
        const binaryBytes = ByteUtils.allocate(array.byteLength + 2);
        binaryBytes[0] = Binary.VECTOR_TYPE.Float32;
        binaryBytes[1] = 0;
        const floatBytes = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
        binaryBytes.set(floatBytes, 2);
        if (NumberUtils.isBigEndian)
            ByteUtils.swap32(new Uint8Array(binaryBytes.buffer, 2));
        const bin = new this(binaryBytes, this.SUBTYPE_VECTOR);
        validateBinaryVector(bin);
        return bin;
    }
    static fromPackedBits(array, padding = 0) {
        const buffer = ByteUtils.allocate(array.byteLength + 2);
        buffer[0] = Binary.VECTOR_TYPE.PackedBit;
        buffer[1] = padding;
        buffer.set(array, 2);
        const bin = new this(buffer, this.SUBTYPE_VECTOR);
        validateBinaryVector(bin);
        return bin;
    }
    static fromBits(bits) {
        const byteLength = (bits.length + 7) >>> 3;
        const bytes = new Uint8Array(byteLength + 2);
        bytes[0] = Binary.VECTOR_TYPE.PackedBit;
        const remainder = bits.length % 8;
        bytes[1] = remainder === 0 ? 0 : 8 - remainder;
        for (let bitOffset = 0; bitOffset < bits.length; bitOffset++) {
            const byteOffset = bitOffset >>> 3;
            const bit = bits[bitOffset];
            if (bit !== 0 && bit !== 1) {
                throw new BSONError(`Invalid bit value at ${bitOffset}: must be 0 or 1, found ${bits[bitOffset]}`);
            }
            if (bit === 0)
                continue;
            const shift = 7 - (bitOffset % 8);
            bytes[byteOffset + 2] |= bit << shift;
        }
        return new this(bytes, Binary.SUBTYPE_VECTOR);
    }
}
Binary.BSON_BINARY_SUBTYPE_DEFAULT = 0;
Binary.BUFFER_SIZE = 256;
Binary.SUBTYPE_DEFAULT = 0;
Binary.SUBTYPE_FUNCTION = 1;
Binary.SUBTYPE_BYTE_ARRAY = 2;
Binary.SUBTYPE_UUID_OLD = 3;
Binary.SUBTYPE_UUID = 4;
Binary.SUBTYPE_MD5 = 5;
Binary.SUBTYPE_ENCRYPTED = 6;
Binary.SUBTYPE_COLUMN = 7;
Binary.SUBTYPE_SENSITIVE = 8;
Binary.SUBTYPE_VECTOR = 9;
Binary.SUBTYPE_USER_DEFINED = 128;
Binary.VECTOR_TYPE = Object.freeze({
    Int8: 0x03,
    Float32: 0x27,
    PackedBit: 0x10
});
function validateBinaryVector(vector) {
    if (vector.sub_type !== Binary.SUBTYPE_VECTOR)
        return;
    const size = vector.position;
    const datatype = vector.buffer[0];
    const padding = vector.buffer[1];
    if ((datatype === Binary.VECTOR_TYPE.Float32 || datatype === Binary.VECTOR_TYPE.Int8) &&
        padding !== 0) {
        throw new BSONError('Invalid Vector: padding must be zero for int8 and float32 vectors');
    }
    if (datatype === Binary.VECTOR_TYPE.Float32) {
        if (size !== 0 && size - 2 !== 0 && (size - 2) % 4 !== 0) {
            throw new BSONError('Invalid Vector: Float32 vector must contain a multiple of 4 bytes');
        }
    }
    if (datatype === Binary.VECTOR_TYPE.PackedBit && padding !== 0 && size === 2) {
        throw new BSONError('Invalid Vector: padding must be zero for packed bit vectors that are empty');
    }
    if (datatype === Binary.VECTOR_TYPE.PackedBit && padding > 7) {
        throw new BSONError(`Invalid Vector: padding must be a value between 0 and 7. found: ${padding}`);
    }
}
const UUID_BYTE_LENGTH = 16;
const UUID_WITHOUT_DASHES = /^[0-9A-F]{32}$/i;
const UUID_WITH_DASHES = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
class UUID extends Binary {
    constructor(input) {
        let bytes;
        if (input == null) {
            bytes = UUID.generate();
        }
        else if (input instanceof UUID) {
            bytes = ByteUtils.toLocalBufferType(new Uint8Array(input.buffer));
        }
        else if (ArrayBuffer.isView(input) && input.byteLength === UUID_BYTE_LENGTH) {
            bytes = ByteUtils.toLocalBufferType(input);
        }
        else if (typeof input === 'string') {
            bytes = UUID.bytesFromString(input);
        }
        else {
            throw new BSONError('Argument passed in UUID constructor must be a UUID, a 16 byte Buffer or a 32/36 character hex string (dashes excluded/included, format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).');
        }
        super(bytes, BSON_BINARY_SUBTYPE_UUID_NEW);
    }
    get id() {
        return this.buffer;
    }
    set id(value) {
        this.buffer = value;
    }
    toHexString(includeDashes = true) {
        if (includeDashes) {
            return [
                ByteUtils.toHex(this.buffer.subarray(0, 4)),
                ByteUtils.toHex(this.buffer.subarray(4, 6)),
                ByteUtils.toHex(this.buffer.subarray(6, 8)),
                ByteUtils.toHex(this.buffer.subarray(8, 10)),
                ByteUtils.toHex(this.buffer.subarray(10, 16))
            ].join('-');
        }
        return ByteUtils.toHex(this.buffer);
    }
    toString(encoding) {
        if (encoding === 'hex')
            return ByteUtils.toHex(this.id);
        if (encoding === 'base64')
            return ByteUtils.toBase64(this.id);
        return this.toHexString();
    }
    toJSON() {
        return this.toHexString();
    }
    equals(otherId) {
        if (!otherId) {
            return false;
        }
        if (otherId instanceof UUID) {
            return ByteUtils.equals(otherId.id, this.id);
        }
        try {
            return ByteUtils.equals(new UUID(otherId).id, this.id);
        }
        catch {
            return false;
        }
    }
    toBinary() {
        return new Binary(this.id, Binary.SUBTYPE_UUID);
    }
    static generate() {
        const bytes = ByteUtils.randomBytes(UUID_BYTE_LENGTH);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        return bytes;
    }
    static isValid(input) {
        if (!input) {
            return false;
        }
        if (typeof input === 'string') {
            return UUID.isValidUUIDString(input);
        }
        if (isUint8Array(input)) {
            return input.byteLength === UUID_BYTE_LENGTH;
        }
        return (input._bsontype === 'Binary' &&
            input.sub_type === this.SUBTYPE_UUID &&
            input.buffer.byteLength === 16);
    }
    static createFromHexString(hexString) {
        const buffer = UUID.bytesFromString(hexString);
        return new UUID(buffer);
    }
    static createFromBase64(base64) {
        return new UUID(ByteUtils.fromBase64(base64));
    }
    static bytesFromString(representation) {
        if (!UUID.isValidUUIDString(representation)) {
            throw new BSONError('UUID string representation must be 32 hex digits or canonical hyphenated representation');
        }
        return ByteUtils.fromHex(representation.replace(/-/g, ''));
    }
    static isValidUUIDString(representation) {
        return UUID_WITHOUT_DASHES.test(representation) || UUID_WITH_DASHES.test(representation);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        return `new UUID(${inspect(this.toHexString(), options)})`;
    }
}

class Code extends BSONValue {
    get _bsontype() {
        return 'Code';
    }
    constructor(code, scope) {
        super();
        this.code = code.toString();
        this.scope = scope ?? null;
    }
    toJSON() {
        if (this.scope != null) {
            return { code: this.code, scope: this.scope };
        }
        return { code: this.code };
    }
    toExtendedJSON() {
        if (this.scope) {
            return { $code: this.code, $scope: this.scope };
        }
        return { $code: this.code };
    }
    static fromExtendedJSON(doc) {
        return new Code(doc.$code, doc.$scope);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        let parametersString = inspect(this.code, options);
        const multiLineFn = parametersString.includes('\n');
        if (this.scope != null) {
            parametersString += `,${multiLineFn ? '\n' : ' '}${inspect(this.scope, options)}`;
        }
        const endingNewline = multiLineFn && this.scope === null;
        return `new Code(${multiLineFn ? '\n' : ''}${parametersString}${endingNewline ? '\n' : ''})`;
    }
}

function isDBRefLike(value) {
    return (value != null &&
        typeof value === 'object' &&
        '$id' in value &&
        value.$id != null &&
        '$ref' in value &&
        typeof value.$ref === 'string' &&
        (!('$db' in value) || ('$db' in value && typeof value.$db === 'string')));
}
class DBRef extends BSONValue {
    get _bsontype() {
        return 'DBRef';
    }
    constructor(collection, oid, db, fields) {
        super();
        const parts = collection.split('.');
        if (parts.length === 2) {
            db = parts.shift();
            collection = parts.shift();
        }
        this.collection = collection;
        this.oid = oid;
        this.db = db;
        this.fields = fields || {};
    }
    get namespace() {
        return this.collection;
    }
    set namespace(value) {
        this.collection = value;
    }
    toJSON() {
        const o = Object.assign({
            $ref: this.collection,
            $id: this.oid
        }, this.fields);
        if (this.db != null)
            o.$db = this.db;
        return o;
    }
    toExtendedJSON(options) {
        options = options || {};
        let o = {
            $ref: this.collection,
            $id: this.oid
        };
        if (options.legacy) {
            return o;
        }
        if (this.db)
            o.$db = this.db;
        o = Object.assign(o, this.fields);
        return o;
    }
    static fromExtendedJSON(doc) {
        const copy = Object.assign({}, doc);
        delete copy.$ref;
        delete copy.$id;
        delete copy.$db;
        return new DBRef(doc.$ref, doc.$id, doc.$db, copy);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        const args = [
            inspect(this.namespace, options),
            inspect(this.oid, options),
            ...(this.db ? [inspect(this.db, options)] : []),
            ...(Object.keys(this.fields).length > 0 ? [inspect(this.fields, options)] : [])
        ];
        args[1] = inspect === defaultInspect ? `new ObjectId(${args[1]})` : args[1];
        return `new DBRef(${args.join(', ')})`;
    }
}

function removeLeadingZerosAndExplicitPlus(str) {
    if (str === '') {
        return str;
    }
    let startIndex = 0;
    const isNegative = str[startIndex] === '-';
    const isExplicitlyPositive = str[startIndex] === '+';
    if (isExplicitlyPositive || isNegative) {
        startIndex += 1;
    }
    let foundInsignificantZero = false;
    for (; startIndex < str.length && str[startIndex] === '0'; ++startIndex) {
        foundInsignificantZero = true;
    }
    if (!foundInsignificantZero) {
        return isExplicitlyPositive ? str.slice(1) : str;
    }
    return `${isNegative ? '-' : ''}${str.length === startIndex ? '0' : str.slice(startIndex)}`;
}
function validateStringCharacters(str, radix) {
    radix = radix ?? 10;
    const validCharacters = '0123456789abcdefghijklmnopqrstuvwxyz'.slice(0, radix);
    const regex = new RegExp(`[^-+${validCharacters}]`, 'i');
    return regex.test(str) ? false : str;
}

let wasm = undefined;
try {
    wasm = new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 13, 2, 96, 0, 1, 127, 96, 4, 127, 127, 127, 127, 1, 127, 3, 7, 6, 0, 1, 1, 1, 1, 1, 6, 6, 1, 127, 1, 65, 0, 11, 7, 50, 6, 3, 109, 117, 108, 0, 1, 5, 100, 105, 118, 95, 115, 0, 2, 5, 100, 105, 118, 95, 117, 0, 3, 5, 114, 101, 109, 95, 115, 0, 4, 5, 114, 101, 109, 95, 117, 0, 5, 8, 103, 101, 116, 95, 104, 105, 103, 104, 0, 0, 10, 191, 1, 6, 4, 0, 35, 0, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 126, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 127, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 128, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 129, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11, 36, 1, 1, 126, 32, 0, 173, 32, 1, 173, 66, 32, 134, 132, 32, 2, 173, 32, 3, 173, 66, 32, 134, 132, 130, 34, 4, 66, 32, 135, 167, 36, 0, 32, 4, 167, 11])), {}).exports;
}
catch {
}
const TWO_PWR_16_DBL = 1 << 16;
const TWO_PWR_24_DBL = 1 << 24;
const TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
const TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
const TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
const INT_CACHE = {};
const UINT_CACHE = {};
const MAX_INT64_STRING_LENGTH = 20;
const DECIMAL_REG_EX = /^(\+?0|(\+|-)?[1-9][0-9]*)$/;
class Long extends BSONValue {
    get _bsontype() {
        return 'Long';
    }
    get __isLong__() {
        return true;
    }
    constructor(lowOrValue = 0, highOrUnsigned, unsigned) {
        super();
        const unsignedBool = typeof highOrUnsigned === 'boolean' ? highOrUnsigned : Boolean(unsigned);
        const high = typeof highOrUnsigned === 'number' ? highOrUnsigned : 0;
        const res = typeof lowOrValue === 'string'
            ? Long.fromString(lowOrValue, unsignedBool)
            : typeof lowOrValue === 'bigint'
                ? Long.fromBigInt(lowOrValue, unsignedBool)
                : { low: lowOrValue | 0, high: high | 0, unsigned: unsignedBool };
        this.low = res.low;
        this.high = res.high;
        this.unsigned = res.unsigned;
    }
    static fromBits(lowBits, highBits, unsigned) {
        return new Long(lowBits, highBits, unsigned);
    }
    static fromInt(value, unsigned) {
        let obj, cachedObj, cache;
        if (unsigned) {
            value >>>= 0;
            if ((cache = 0 <= value && value < 256)) {
                cachedObj = UINT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = Long.fromBits(value, (value | 0) < 0 ? -1 : 0, true);
            if (cache)
                UINT_CACHE[value] = obj;
            return obj;
        }
        else {
            value |= 0;
            if ((cache = -128 <= value && value < 128)) {
                cachedObj = INT_CACHE[value];
                if (cachedObj)
                    return cachedObj;
            }
            obj = Long.fromBits(value, value < 0 ? -1 : 0, false);
            if (cache)
                INT_CACHE[value] = obj;
            return obj;
        }
    }
    static fromNumber(value, unsigned) {
        if (isNaN(value))
            return unsigned ? Long.UZERO : Long.ZERO;
        if (unsigned) {
            if (value < 0)
                return Long.UZERO;
            if (value >= TWO_PWR_64_DBL)
                return Long.MAX_UNSIGNED_VALUE;
        }
        else {
            if (value <= -9223372036854776e3)
                return Long.MIN_VALUE;
            if (value + 1 >= TWO_PWR_63_DBL)
                return Long.MAX_VALUE;
        }
        if (value < 0)
            return Long.fromNumber(-value, unsigned).neg();
        return Long.fromBits(value % TWO_PWR_32_DBL | 0, (value / TWO_PWR_32_DBL) | 0, unsigned);
    }
    static fromBigInt(value, unsigned) {
        const FROM_BIGINT_BIT_MASK = BigInt(0xffffffff);
        const FROM_BIGINT_BIT_SHIFT = BigInt(32);
        return new Long(Number(value & FROM_BIGINT_BIT_MASK), Number((value >> FROM_BIGINT_BIT_SHIFT) & FROM_BIGINT_BIT_MASK), unsigned);
    }
    static _fromString(str, unsigned, radix) {
        if (str.length === 0)
            throw new BSONError('empty string');
        if (radix < 2 || 36 < radix)
            throw new BSONError('radix');
        let p;
        if ((p = str.indexOf('-')) > 0)
            throw new BSONError('interior hyphen');
        else if (p === 0) {
            return Long._fromString(str.substring(1), unsigned, radix).neg();
        }
        const radixToPower = Long.fromNumber(Math.pow(radix, 8));
        let result = Long.ZERO;
        for (let i = 0; i < str.length; i += 8) {
            const size = Math.min(8, str.length - i), value = parseInt(str.substring(i, i + size), radix);
            if (size < 8) {
                const power = Long.fromNumber(Math.pow(radix, size));
                result = result.mul(power).add(Long.fromNumber(value));
            }
            else {
                result = result.mul(radixToPower);
                result = result.add(Long.fromNumber(value));
            }
        }
        result.unsigned = unsigned;
        return result;
    }
    static fromStringStrict(str, unsignedOrRadix, radix) {
        let unsigned = false;
        if (typeof unsignedOrRadix === 'number') {
            (radix = unsignedOrRadix), (unsignedOrRadix = false);
        }
        else {
            unsigned = !!unsignedOrRadix;
        }
        radix ??= 10;
        if (str.trim() !== str) {
            throw new BSONError(`Input: '${str}' contains leading and/or trailing whitespace`);
        }
        if (!validateStringCharacters(str, radix)) {
            throw new BSONError(`Input: '${str}' contains invalid characters for radix: ${radix}`);
        }
        const cleanedStr = removeLeadingZerosAndExplicitPlus(str);
        const result = Long._fromString(cleanedStr, unsigned, radix);
        if (result.toString(radix).toLowerCase() !== cleanedStr.toLowerCase()) {
            throw new BSONError(`Input: ${str} is not representable as ${result.unsigned ? 'an unsigned' : 'a signed'} 64-bit Long ${radix != null ? `with radix: ${radix}` : ''}`);
        }
        return result;
    }
    static fromString(str, unsignedOrRadix, radix) {
        let unsigned = false;
        if (typeof unsignedOrRadix === 'number') {
            (radix = unsignedOrRadix), (unsignedOrRadix = false);
        }
        else {
            unsigned = !!unsignedOrRadix;
        }
        radix ??= 10;
        if (str === 'NaN' && radix < 24) {
            return Long.ZERO;
        }
        else if ((str === 'Infinity' || str === '+Infinity' || str === '-Infinity') && radix < 35) {
            return Long.ZERO;
        }
        return Long._fromString(str, unsigned, radix);
    }
    static fromBytes(bytes, unsigned, le) {
        return le ? Long.fromBytesLE(bytes, unsigned) : Long.fromBytesBE(bytes, unsigned);
    }
    static fromBytesLE(bytes, unsigned) {
        return new Long(bytes[0] | (bytes[1] << 8) | (bytes[2] << 16) | (bytes[3] << 24), bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24), unsigned);
    }
    static fromBytesBE(bytes, unsigned) {
        return new Long((bytes[4] << 24) | (bytes[5] << 16) | (bytes[6] << 8) | bytes[7], (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3], unsigned);
    }
    static isLong(value) {
        return (value != null &&
            typeof value === 'object' &&
            '__isLong__' in value &&
            value.__isLong__ === true);
    }
    static fromValue(val, unsigned) {
        if (typeof val === 'number')
            return Long.fromNumber(val, unsigned);
        if (typeof val === 'string')
            return Long.fromString(val, unsigned);
        return Long.fromBits(val.low, val.high, typeof unsigned === 'boolean' ? unsigned : val.unsigned);
    }
    add(addend) {
        if (!Long.isLong(addend))
            addend = Long.fromValue(addend);
        const a48 = this.high >>> 16;
        const a32 = this.high & 0xffff;
        const a16 = this.low >>> 16;
        const a00 = this.low & 0xffff;
        const b48 = addend.high >>> 16;
        const b32 = addend.high & 0xffff;
        const b16 = addend.low >>> 16;
        const b00 = addend.low & 0xffff;
        let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 + b48;
        c48 &= 0xffff;
        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    }
    and(other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        return Long.fromBits(this.low & other.low, this.high & other.high, this.unsigned);
    }
    compare(other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        if (this.eq(other))
            return 0;
        const thisNeg = this.isNegative(), otherNeg = other.isNegative();
        if (thisNeg && !otherNeg)
            return -1;
        if (!thisNeg && otherNeg)
            return 1;
        if (!this.unsigned)
            return this.sub(other).isNegative() ? -1 : 1;
        return other.high >>> 0 > this.high >>> 0 ||
            (other.high === this.high && other.low >>> 0 > this.low >>> 0)
            ? -1
            : 1;
    }
    comp(other) {
        return this.compare(other);
    }
    divide(divisor) {
        if (!Long.isLong(divisor))
            divisor = Long.fromValue(divisor);
        if (divisor.isZero())
            throw new BSONError('division by zero');
        if (wasm) {
            if (!this.unsigned &&
                this.high === -2147483648 &&
                divisor.low === -1 &&
                divisor.high === -1) {
                return this;
            }
            const low = (this.unsigned ? wasm.div_u : wasm.div_s)(this.low, this.high, divisor.low, divisor.high);
            return Long.fromBits(low, wasm.get_high(), this.unsigned);
        }
        if (this.isZero())
            return this.unsigned ? Long.UZERO : Long.ZERO;
        let approx, rem, res;
        if (!this.unsigned) {
            if (this.eq(Long.MIN_VALUE)) {
                if (divisor.eq(Long.ONE) || divisor.eq(Long.NEG_ONE))
                    return Long.MIN_VALUE;
                else if (divisor.eq(Long.MIN_VALUE))
                    return Long.ONE;
                else {
                    const halfThis = this.shr(1);
                    approx = halfThis.div(divisor).shl(1);
                    if (approx.eq(Long.ZERO)) {
                        return divisor.isNegative() ? Long.ONE : Long.NEG_ONE;
                    }
                    else {
                        rem = this.sub(divisor.mul(approx));
                        res = approx.add(rem.div(divisor));
                        return res;
                    }
                }
            }
            else if (divisor.eq(Long.MIN_VALUE))
                return this.unsigned ? Long.UZERO : Long.ZERO;
            if (this.isNegative()) {
                if (divisor.isNegative())
                    return this.neg().div(divisor.neg());
                return this.neg().div(divisor).neg();
            }
            else if (divisor.isNegative())
                return this.div(divisor.neg()).neg();
            res = Long.ZERO;
        }
        else {
            if (!divisor.unsigned)
                divisor = divisor.toUnsigned();
            if (divisor.gt(this))
                return Long.UZERO;
            if (divisor.gt(this.shru(1)))
                return Long.UONE;
            res = Long.UZERO;
        }
        rem = this;
        while (rem.gte(divisor)) {
            approx = Math.max(1, Math.floor(rem.toNumber() / divisor.toNumber()));
            const log2 = Math.ceil(Math.log(approx) / Math.LN2);
            const delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
            let approxRes = Long.fromNumber(approx);
            let approxRem = approxRes.mul(divisor);
            while (approxRem.isNegative() || approxRem.gt(rem)) {
                approx -= delta;
                approxRes = Long.fromNumber(approx, this.unsigned);
                approxRem = approxRes.mul(divisor);
            }
            if (approxRes.isZero())
                approxRes = Long.ONE;
            res = res.add(approxRes);
            rem = rem.sub(approxRem);
        }
        return res;
    }
    div(divisor) {
        return this.divide(divisor);
    }
    equals(other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        if (this.unsigned !== other.unsigned && this.high >>> 31 === 1 && other.high >>> 31 === 1)
            return false;
        return this.high === other.high && this.low === other.low;
    }
    eq(other) {
        return this.equals(other);
    }
    getHighBits() {
        return this.high;
    }
    getHighBitsUnsigned() {
        return this.high >>> 0;
    }
    getLowBits() {
        return this.low;
    }
    getLowBitsUnsigned() {
        return this.low >>> 0;
    }
    getNumBitsAbs() {
        if (this.isNegative()) {
            return this.eq(Long.MIN_VALUE) ? 64 : this.neg().getNumBitsAbs();
        }
        const val = this.high !== 0 ? this.high : this.low;
        let bit;
        for (bit = 31; bit > 0; bit--)
            if ((val & (1 << bit)) !== 0)
                break;
        return this.high !== 0 ? bit + 33 : bit + 1;
    }
    greaterThan(other) {
        return this.comp(other) > 0;
    }
    gt(other) {
        return this.greaterThan(other);
    }
    greaterThanOrEqual(other) {
        return this.comp(other) >= 0;
    }
    gte(other) {
        return this.greaterThanOrEqual(other);
    }
    ge(other) {
        return this.greaterThanOrEqual(other);
    }
    isEven() {
        return (this.low & 1) === 0;
    }
    isNegative() {
        return !this.unsigned && this.high < 0;
    }
    isOdd() {
        return (this.low & 1) === 1;
    }
    isPositive() {
        return this.unsigned || this.high >= 0;
    }
    isZero() {
        return this.high === 0 && this.low === 0;
    }
    lessThan(other) {
        return this.comp(other) < 0;
    }
    lt(other) {
        return this.lessThan(other);
    }
    lessThanOrEqual(other) {
        return this.comp(other) <= 0;
    }
    lte(other) {
        return this.lessThanOrEqual(other);
    }
    modulo(divisor) {
        if (!Long.isLong(divisor))
            divisor = Long.fromValue(divisor);
        if (wasm) {
            const low = (this.unsigned ? wasm.rem_u : wasm.rem_s)(this.low, this.high, divisor.low, divisor.high);
            return Long.fromBits(low, wasm.get_high(), this.unsigned);
        }
        return this.sub(this.div(divisor).mul(divisor));
    }
    mod(divisor) {
        return this.modulo(divisor);
    }
    rem(divisor) {
        return this.modulo(divisor);
    }
    multiply(multiplier) {
        if (this.isZero())
            return Long.ZERO;
        if (!Long.isLong(multiplier))
            multiplier = Long.fromValue(multiplier);
        if (wasm) {
            const low = wasm.mul(this.low, this.high, multiplier.low, multiplier.high);
            return Long.fromBits(low, wasm.get_high(), this.unsigned);
        }
        if (multiplier.isZero())
            return Long.ZERO;
        if (this.eq(Long.MIN_VALUE))
            return multiplier.isOdd() ? Long.MIN_VALUE : Long.ZERO;
        if (multiplier.eq(Long.MIN_VALUE))
            return this.isOdd() ? Long.MIN_VALUE : Long.ZERO;
        if (this.isNegative()) {
            if (multiplier.isNegative())
                return this.neg().mul(multiplier.neg());
            else
                return this.neg().mul(multiplier).neg();
        }
        else if (multiplier.isNegative())
            return this.mul(multiplier.neg()).neg();
        if (this.lt(Long.TWO_PWR_24) && multiplier.lt(Long.TWO_PWR_24))
            return Long.fromNumber(this.toNumber() * multiplier.toNumber(), this.unsigned);
        const a48 = this.high >>> 16;
        const a32 = this.high & 0xffff;
        const a16 = this.low >>> 16;
        const a00 = this.low & 0xffff;
        const b48 = multiplier.high >>> 16;
        const b32 = multiplier.high & 0xffff;
        const b16 = multiplier.low >>> 16;
        const b00 = multiplier.low & 0xffff;
        let c48 = 0, c32 = 0, c16 = 0, c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xffff;
        return Long.fromBits((c16 << 16) | c00, (c48 << 16) | c32, this.unsigned);
    }
    mul(multiplier) {
        return this.multiply(multiplier);
    }
    negate() {
        if (!this.unsigned && this.eq(Long.MIN_VALUE))
            return Long.MIN_VALUE;
        return this.not().add(Long.ONE);
    }
    neg() {
        return this.negate();
    }
    not() {
        return Long.fromBits(~this.low, ~this.high, this.unsigned);
    }
    notEquals(other) {
        return !this.equals(other);
    }
    neq(other) {
        return this.notEquals(other);
    }
    ne(other) {
        return this.notEquals(other);
    }
    or(other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        return Long.fromBits(this.low | other.low, this.high | other.high, this.unsigned);
    }
    shiftLeft(numBits) {
        if (Long.isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return Long.fromBits(this.low << numBits, (this.high << numBits) | (this.low >>> (32 - numBits)), this.unsigned);
        else
            return Long.fromBits(0, this.low << (numBits - 32), this.unsigned);
    }
    shl(numBits) {
        return this.shiftLeft(numBits);
    }
    shiftRight(numBits) {
        if (Long.isLong(numBits))
            numBits = numBits.toInt();
        if ((numBits &= 63) === 0)
            return this;
        else if (numBits < 32)
            return Long.fromBits((this.low >>> numBits) | (this.high << (32 - numBits)), this.high >> numBits, this.unsigned);
        else
            return Long.fromBits(this.high >> (numBits - 32), this.high >= 0 ? 0 : -1, this.unsigned);
    }
    shr(numBits) {
        return this.shiftRight(numBits);
    }
    shiftRightUnsigned(numBits) {
        if (Long.isLong(numBits))
            numBits = numBits.toInt();
        numBits &= 63;
        if (numBits === 0)
            return this;
        else {
            const high = this.high;
            if (numBits < 32) {
                const low = this.low;
                return Long.fromBits((low >>> numBits) | (high << (32 - numBits)), high >>> numBits, this.unsigned);
            }
            else if (numBits === 32)
                return Long.fromBits(high, 0, this.unsigned);
            else
                return Long.fromBits(high >>> (numBits - 32), 0, this.unsigned);
        }
    }
    shr_u(numBits) {
        return this.shiftRightUnsigned(numBits);
    }
    shru(numBits) {
        return this.shiftRightUnsigned(numBits);
    }
    subtract(subtrahend) {
        if (!Long.isLong(subtrahend))
            subtrahend = Long.fromValue(subtrahend);
        return this.add(subtrahend.neg());
    }
    sub(subtrahend) {
        return this.subtract(subtrahend);
    }
    toInt() {
        return this.unsigned ? this.low >>> 0 : this.low;
    }
    toNumber() {
        if (this.unsigned)
            return (this.high >>> 0) * TWO_PWR_32_DBL + (this.low >>> 0);
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    }
    toBigInt() {
        return BigInt(this.toString());
    }
    toBytes(le) {
        return le ? this.toBytesLE() : this.toBytesBE();
    }
    toBytesLE() {
        const hi = this.high, lo = this.low;
        return [
            lo & 0xff,
            (lo >>> 8) & 0xff,
            (lo >>> 16) & 0xff,
            lo >>> 24,
            hi & 0xff,
            (hi >>> 8) & 0xff,
            (hi >>> 16) & 0xff,
            hi >>> 24
        ];
    }
    toBytesBE() {
        const hi = this.high, lo = this.low;
        return [
            hi >>> 24,
            (hi >>> 16) & 0xff,
            (hi >>> 8) & 0xff,
            hi & 0xff,
            lo >>> 24,
            (lo >>> 16) & 0xff,
            (lo >>> 8) & 0xff,
            lo & 0xff
        ];
    }
    toSigned() {
        if (!this.unsigned)
            return this;
        return Long.fromBits(this.low, this.high, false);
    }
    toString(radix) {
        radix = radix || 10;
        if (radix < 2 || 36 < radix)
            throw new BSONError('radix');
        if (this.isZero())
            return '0';
        if (this.isNegative()) {
            if (this.eq(Long.MIN_VALUE)) {
                const radixLong = Long.fromNumber(radix), div = this.div(radixLong), rem1 = div.mul(radixLong).sub(this);
                return div.toString(radix) + rem1.toInt().toString(radix);
            }
            else
                return '-' + this.neg().toString(radix);
        }
        const radixToPower = Long.fromNumber(Math.pow(radix, 6), this.unsigned);
        let rem = this;
        let result = '';
        while (true) {
            const remDiv = rem.div(radixToPower);
            const intval = rem.sub(remDiv.mul(radixToPower)).toInt() >>> 0;
            let digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) {
                return digits + result;
            }
            else {
                while (digits.length < 6)
                    digits = '0' + digits;
                result = '' + digits + result;
            }
        }
    }
    toUnsigned() {
        if (this.unsigned)
            return this;
        return Long.fromBits(this.low, this.high, true);
    }
    xor(other) {
        if (!Long.isLong(other))
            other = Long.fromValue(other);
        return Long.fromBits(this.low ^ other.low, this.high ^ other.high, this.unsigned);
    }
    eqz() {
        return this.isZero();
    }
    le(other) {
        return this.lessThanOrEqual(other);
    }
    toExtendedJSON(options) {
        if (options && options.relaxed)
            return this.toNumber();
        return { $numberLong: this.toString() };
    }
    static fromExtendedJSON(doc, options) {
        const { useBigInt64 = false, relaxed = true } = { ...options };
        if (doc.$numberLong.length > MAX_INT64_STRING_LENGTH) {
            throw new BSONError('$numberLong string is too long');
        }
        if (!DECIMAL_REG_EX.test(doc.$numberLong)) {
            throw new BSONError(`$numberLong string "${doc.$numberLong}" is in an invalid format`);
        }
        if (useBigInt64) {
            const bigIntResult = BigInt(doc.$numberLong);
            return BigInt.asIntN(64, bigIntResult);
        }
        const longResult = Long.fromString(doc.$numberLong);
        if (relaxed) {
            return longResult.toNumber();
        }
        return longResult;
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        const longVal = inspect(this.toString(), options);
        const unsignedVal = this.unsigned ? `, ${inspect(this.unsigned, options)}` : '';
        return `new Long(${longVal}${unsignedVal})`;
    }
}
Long.TWO_PWR_24 = Long.fromInt(TWO_PWR_24_DBL);
Long.MAX_UNSIGNED_VALUE = Long.fromBits(0xffffffff | 0, 0xffffffff | 0, true);
Long.ZERO = Long.fromInt(0);
Long.UZERO = Long.fromInt(0, true);
Long.ONE = Long.fromInt(1);
Long.UONE = Long.fromInt(1, true);
Long.NEG_ONE = Long.fromInt(-1);
Long.MAX_VALUE = Long.fromBits(0xffffffff | 0, 0x7fffffff | 0, false);
Long.MIN_VALUE = Long.fromBits(0, 0x80000000 | 0, false);

const PARSE_STRING_REGEXP = /^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/;
const PARSE_INF_REGEXP = /^(\+|-)?(Infinity|inf)$/i;
const PARSE_NAN_REGEXP = /^(\+|-)?NaN$/i;
const EXPONENT_MAX = 6111;
const EXPONENT_MIN = -6176;
const EXPONENT_BIAS = 6176;
const MAX_DIGITS = 34;
const NAN_BUFFER = ByteUtils.fromNumberArray([
    0x7c, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
].reverse());
const INF_NEGATIVE_BUFFER = ByteUtils.fromNumberArray([
    0xf8, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
].reverse());
const INF_POSITIVE_BUFFER = ByteUtils.fromNumberArray([
    0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
].reverse());
const EXPONENT_REGEX = /^([-+])?(\d+)?$/;
const COMBINATION_MASK = 0x1f;
const EXPONENT_MASK = 0x3fff;
const COMBINATION_INFINITY = 30;
const COMBINATION_NAN = 31;
function isDigit(value) {
    return !isNaN(parseInt(value, 10));
}
function divideu128(value) {
    const DIVISOR = Long.fromNumber(1000 * 1000 * 1000);
    let _rem = Long.fromNumber(0);
    if (!value.parts[0] && !value.parts[1] && !value.parts[2] && !value.parts[3]) {
        return { quotient: value, rem: _rem };
    }
    for (let i = 0; i <= 3; i++) {
        _rem = _rem.shiftLeft(32);
        _rem = _rem.add(new Long(value.parts[i], 0));
        value.parts[i] = _rem.div(DIVISOR).low;
        _rem = _rem.modulo(DIVISOR);
    }
    return { quotient: value, rem: _rem };
}
function multiply64x2(left, right) {
    if (!left && !right) {
        return { high: Long.fromNumber(0), low: Long.fromNumber(0) };
    }
    const leftHigh = left.shiftRightUnsigned(32);
    const leftLow = new Long(left.getLowBits(), 0);
    const rightHigh = right.shiftRightUnsigned(32);
    const rightLow = new Long(right.getLowBits(), 0);
    let productHigh = leftHigh.multiply(rightHigh);
    let productMid = leftHigh.multiply(rightLow);
    const productMid2 = leftLow.multiply(rightHigh);
    let productLow = leftLow.multiply(rightLow);
    productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
    productMid = new Long(productMid.getLowBits(), 0)
        .add(productMid2)
        .add(productLow.shiftRightUnsigned(32));
    productHigh = productHigh.add(productMid.shiftRightUnsigned(32));
    productLow = productMid.shiftLeft(32).add(new Long(productLow.getLowBits(), 0));
    return { high: productHigh, low: productLow };
}
function lessThan(left, right) {
    const uhleft = left.high >>> 0;
    const uhright = right.high >>> 0;
    if (uhleft < uhright) {
        return true;
    }
    else if (uhleft === uhright) {
        const ulleft = left.low >>> 0;
        const ulright = right.low >>> 0;
        if (ulleft < ulright)
            return true;
    }
    return false;
}
function invalidErr(string, message) {
    throw new BSONError(`"${string}" is not a valid Decimal128 string - ${message}`);
}
class Decimal128 extends BSONValue {
    get _bsontype() {
        return 'Decimal128';
    }
    constructor(bytes) {
        super();
        if (typeof bytes === 'string') {
            this.bytes = Decimal128.fromString(bytes).bytes;
        }
        else if (bytes instanceof Uint8Array || isUint8Array(bytes)) {
            if (bytes.byteLength !== 16) {
                throw new BSONError('Decimal128 must take a Buffer of 16 bytes');
            }
            this.bytes = bytes;
        }
        else {
            throw new BSONError('Decimal128 must take a Buffer or string');
        }
    }
    static fromString(representation) {
        return Decimal128._fromString(representation, { allowRounding: false });
    }
    static fromStringWithRounding(representation) {
        return Decimal128._fromString(representation, { allowRounding: true });
    }
    static _fromString(representation, options) {
        let isNegative = false;
        let sawSign = false;
        let sawRadix = false;
        let foundNonZero = false;
        let significantDigits = 0;
        let nDigitsRead = 0;
        let nDigits = 0;
        let radixPosition = 0;
        let firstNonZero = 0;
        const digits = [0];
        let nDigitsStored = 0;
        let digitsInsert = 0;
        let lastDigit = 0;
        let exponent = 0;
        let significandHigh = new Long(0, 0);
        let significandLow = new Long(0, 0);
        let biasedExponent = 0;
        let index = 0;
        if (representation.length >= 7000) {
            throw new BSONError('' + representation + ' not a valid Decimal128 string');
        }
        const stringMatch = representation.match(PARSE_STRING_REGEXP);
        const infMatch = representation.match(PARSE_INF_REGEXP);
        const nanMatch = representation.match(PARSE_NAN_REGEXP);
        if ((!stringMatch && !infMatch && !nanMatch) || representation.length === 0) {
            throw new BSONError('' + representation + ' not a valid Decimal128 string');
        }
        if (stringMatch) {
            const unsignedNumber = stringMatch[2];
            const e = stringMatch[4];
            const expSign = stringMatch[5];
            const expNumber = stringMatch[6];
            if (e && expNumber === undefined)
                invalidErr(representation, 'missing exponent power');
            if (e && unsignedNumber === undefined)
                invalidErr(representation, 'missing exponent base');
            if (e === undefined && (expSign || expNumber)) {
                invalidErr(representation, 'missing e before exponent');
            }
        }
        if (representation[index] === '+' || representation[index] === '-') {
            sawSign = true;
            isNegative = representation[index++] === '-';
        }
        if (!isDigit(representation[index]) && representation[index] !== '.') {
            if (representation[index] === 'i' || representation[index] === 'I') {
                return new Decimal128(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER);
            }
            else if (representation[index] === 'N') {
                return new Decimal128(NAN_BUFFER);
            }
        }
        while (isDigit(representation[index]) || representation[index] === '.') {
            if (representation[index] === '.') {
                if (sawRadix)
                    invalidErr(representation, 'contains multiple periods');
                sawRadix = true;
                index = index + 1;
                continue;
            }
            if (nDigitsStored < MAX_DIGITS) {
                if (representation[index] !== '0' || foundNonZero) {
                    if (!foundNonZero) {
                        firstNonZero = nDigitsRead;
                    }
                    foundNonZero = true;
                    digits[digitsInsert++] = parseInt(representation[index], 10);
                    nDigitsStored = nDigitsStored + 1;
                }
            }
            if (foundNonZero)
                nDigits = nDigits + 1;
            if (sawRadix)
                radixPosition = radixPosition + 1;
            nDigitsRead = nDigitsRead + 1;
            index = index + 1;
        }
        if (sawRadix && !nDigitsRead)
            throw new BSONError('' + representation + ' not a valid Decimal128 string');
        if (representation[index] === 'e' || representation[index] === 'E') {
            const match = representation.substr(++index).match(EXPONENT_REGEX);
            if (!match || !match[2])
                return new Decimal128(NAN_BUFFER);
            exponent = parseInt(match[0], 10);
            index = index + match[0].length;
        }
        if (representation[index])
            return new Decimal128(NAN_BUFFER);
        if (!nDigitsStored) {
            digits[0] = 0;
            nDigits = 1;
            nDigitsStored = 1;
            significantDigits = 0;
        }
        else {
            lastDigit = nDigitsStored - 1;
            significantDigits = nDigits;
            if (significantDigits !== 1) {
                while (representation[firstNonZero + significantDigits - 1 + Number(sawSign) + Number(sawRadix)] === '0') {
                    significantDigits = significantDigits - 1;
                }
            }
        }
        if (exponent <= radixPosition && radixPosition > exponent + (1 << 14)) {
            exponent = EXPONENT_MIN;
        }
        else {
            exponent = exponent - radixPosition;
        }
        while (exponent > EXPONENT_MAX) {
            lastDigit = lastDigit + 1;
            if (lastDigit >= MAX_DIGITS) {
                if (significantDigits === 0) {
                    exponent = EXPONENT_MAX;
                    break;
                }
                invalidErr(representation, 'overflow');
            }
            exponent = exponent - 1;
        }
        if (options.allowRounding) {
            while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
                if (lastDigit === 0 && significantDigits < nDigitsStored) {
                    exponent = EXPONENT_MIN;
                    significantDigits = 0;
                    break;
                }
                if (nDigitsStored < nDigits) {
                    nDigits = nDigits - 1;
                }
                else {
                    lastDigit = lastDigit - 1;
                }
                if (exponent < EXPONENT_MAX) {
                    exponent = exponent + 1;
                }
                else {
                    const digitsString = digits.join('');
                    if (digitsString.match(/^0+$/)) {
                        exponent = EXPONENT_MAX;
                        break;
                    }
                    invalidErr(representation, 'overflow');
                }
            }
            if (lastDigit + 1 < significantDigits) {
                let endOfString = nDigitsRead;
                if (sawRadix) {
                    firstNonZero = firstNonZero + 1;
                    endOfString = endOfString + 1;
                }
                if (sawSign) {
                    firstNonZero = firstNonZero + 1;
                    endOfString = endOfString + 1;
                }
                const roundDigit = parseInt(representation[firstNonZero + lastDigit + 1], 10);
                let roundBit = 0;
                if (roundDigit >= 5) {
                    roundBit = 1;
                    if (roundDigit === 5) {
                        roundBit = digits[lastDigit] % 2 === 1 ? 1 : 0;
                        for (let i = firstNonZero + lastDigit + 2; i < endOfString; i++) {
                            if (parseInt(representation[i], 10)) {
                                roundBit = 1;
                                break;
                            }
                        }
                    }
                }
                if (roundBit) {
                    let dIdx = lastDigit;
                    for (; dIdx >= 0; dIdx--) {
                        if (++digits[dIdx] > 9) {
                            digits[dIdx] = 0;
                            if (dIdx === 0) {
                                if (exponent < EXPONENT_MAX) {
                                    exponent = exponent + 1;
                                    digits[dIdx] = 1;
                                }
                                else {
                                    return new Decimal128(isNegative ? INF_NEGATIVE_BUFFER : INF_POSITIVE_BUFFER);
                                }
                            }
                        }
                        else {
                            break;
                        }
                    }
                }
            }
        }
        else {
            while (exponent < EXPONENT_MIN || nDigitsStored < nDigits) {
                if (lastDigit === 0) {
                    if (significantDigits === 0) {
                        exponent = EXPONENT_MIN;
                        break;
                    }
                    invalidErr(representation, 'exponent underflow');
                }
                if (nDigitsStored < nDigits) {
                    if (representation[nDigits - 1 + Number(sawSign) + Number(sawRadix)] !== '0' &&
                        significantDigits !== 0) {
                        invalidErr(representation, 'inexact rounding');
                    }
                    nDigits = nDigits - 1;
                }
                else {
                    if (digits[lastDigit] !== 0) {
                        invalidErr(representation, 'inexact rounding');
                    }
                    lastDigit = lastDigit - 1;
                }
                if (exponent < EXPONENT_MAX) {
                    exponent = exponent + 1;
                }
                else {
                    invalidErr(representation, 'overflow');
                }
            }
            if (lastDigit + 1 < significantDigits) {
                if (sawRadix) {
                    firstNonZero = firstNonZero + 1;
                }
                if (sawSign) {
                    firstNonZero = firstNonZero + 1;
                }
                const roundDigit = parseInt(representation[firstNonZero + lastDigit + 1], 10);
                if (roundDigit !== 0) {
                    invalidErr(representation, 'inexact rounding');
                }
            }
        }
        significandHigh = Long.fromNumber(0);
        significandLow = Long.fromNumber(0);
        if (significantDigits === 0) {
            significandHigh = Long.fromNumber(0);
            significandLow = Long.fromNumber(0);
        }
        else if (lastDigit < 17) {
            let dIdx = 0;
            significandLow = Long.fromNumber(digits[dIdx++]);
            significandHigh = new Long(0, 0);
            for (; dIdx <= lastDigit; dIdx++) {
                significandLow = significandLow.multiply(Long.fromNumber(10));
                significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
            }
        }
        else {
            let dIdx = 0;
            significandHigh = Long.fromNumber(digits[dIdx++]);
            for (; dIdx <= lastDigit - 17; dIdx++) {
                significandHigh = significandHigh.multiply(Long.fromNumber(10));
                significandHigh = significandHigh.add(Long.fromNumber(digits[dIdx]));
            }
            significandLow = Long.fromNumber(digits[dIdx++]);
            for (; dIdx <= lastDigit; dIdx++) {
                significandLow = significandLow.multiply(Long.fromNumber(10));
                significandLow = significandLow.add(Long.fromNumber(digits[dIdx]));
            }
        }
        const significand = multiply64x2(significandHigh, Long.fromString('100000000000000000'));
        significand.low = significand.low.add(significandLow);
        if (lessThan(significand.low, significandLow)) {
            significand.high = significand.high.add(Long.fromNumber(1));
        }
        biasedExponent = exponent + EXPONENT_BIAS;
        const dec = { low: Long.fromNumber(0), high: Long.fromNumber(0) };
        if (significand.high.shiftRightUnsigned(49).and(Long.fromNumber(1)).equals(Long.fromNumber(1))) {
            dec.high = dec.high.or(Long.fromNumber(0x3).shiftLeft(61));
            dec.high = dec.high.or(Long.fromNumber(biasedExponent).and(Long.fromNumber(0x3fff).shiftLeft(47)));
            dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x7fffffffffff)));
        }
        else {
            dec.high = dec.high.or(Long.fromNumber(biasedExponent & 0x3fff).shiftLeft(49));
            dec.high = dec.high.or(significand.high.and(Long.fromNumber(0x1ffffffffffff)));
        }
        dec.low = significand.low;
        if (isNegative) {
            dec.high = dec.high.or(Long.fromString('9223372036854775808'));
        }
        const buffer = ByteUtils.allocateUnsafe(16);
        index = 0;
        buffer[index++] = dec.low.low & 0xff;
        buffer[index++] = (dec.low.low >> 8) & 0xff;
        buffer[index++] = (dec.low.low >> 16) & 0xff;
        buffer[index++] = (dec.low.low >> 24) & 0xff;
        buffer[index++] = dec.low.high & 0xff;
        buffer[index++] = (dec.low.high >> 8) & 0xff;
        buffer[index++] = (dec.low.high >> 16) & 0xff;
        buffer[index++] = (dec.low.high >> 24) & 0xff;
        buffer[index++] = dec.high.low & 0xff;
        buffer[index++] = (dec.high.low >> 8) & 0xff;
        buffer[index++] = (dec.high.low >> 16) & 0xff;
        buffer[index++] = (dec.high.low >> 24) & 0xff;
        buffer[index++] = dec.high.high & 0xff;
        buffer[index++] = (dec.high.high >> 8) & 0xff;
        buffer[index++] = (dec.high.high >> 16) & 0xff;
        buffer[index++] = (dec.high.high >> 24) & 0xff;
        return new Decimal128(buffer);
    }
    toString() {
        let biased_exponent;
        let significand_digits = 0;
        const significand = new Array(36);
        for (let i = 0; i < significand.length; i++)
            significand[i] = 0;
        let index = 0;
        let is_zero = false;
        let significand_msb;
        let significand128 = { parts: [0, 0, 0, 0] };
        let j, k;
        const string = [];
        index = 0;
        const buffer = this.bytes;
        const low = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
        const midl = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
        const midh = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
        const high = buffer[index++] | (buffer[index++] << 8) | (buffer[index++] << 16) | (buffer[index++] << 24);
        index = 0;
        const dec = {
            low: new Long(low, midl),
            high: new Long(midh, high)
        };
        if (dec.high.lessThan(Long.ZERO)) {
            string.push('-');
        }
        const combination = (high >> 26) & COMBINATION_MASK;
        if (combination >> 3 === 3) {
            if (combination === COMBINATION_INFINITY) {
                return string.join('') + 'Infinity';
            }
            else if (combination === COMBINATION_NAN) {
                return 'NaN';
            }
            else {
                biased_exponent = (high >> 15) & EXPONENT_MASK;
                significand_msb = 0x08 + ((high >> 14) & 0x01);
            }
        }
        else {
            significand_msb = (high >> 14) & 0x07;
            biased_exponent = (high >> 17) & EXPONENT_MASK;
        }
        const exponent = biased_exponent - EXPONENT_BIAS;
        significand128.parts[0] = (high & 0x3fff) + ((significand_msb & 0xf) << 14);
        significand128.parts[1] = midh;
        significand128.parts[2] = midl;
        significand128.parts[3] = low;
        if (significand128.parts[0] === 0 &&
            significand128.parts[1] === 0 &&
            significand128.parts[2] === 0 &&
            significand128.parts[3] === 0) {
            is_zero = true;
        }
        else {
            for (k = 3; k >= 0; k--) {
                let least_digits = 0;
                const result = divideu128(significand128);
                significand128 = result.quotient;
                least_digits = result.rem.low;
                if (!least_digits)
                    continue;
                for (j = 8; j >= 0; j--) {
                    significand[k * 9 + j] = least_digits % 10;
                    least_digits = Math.floor(least_digits / 10);
                }
            }
        }
        if (is_zero) {
            significand_digits = 1;
            significand[index] = 0;
        }
        else {
            significand_digits = 36;
            while (!significand[index]) {
                significand_digits = significand_digits - 1;
                index = index + 1;
            }
        }
        const scientific_exponent = significand_digits - 1 + exponent;
        if (scientific_exponent >= 34 || scientific_exponent <= -7 || exponent > 0) {
            if (significand_digits > 34) {
                string.push(`${0}`);
                if (exponent > 0)
                    string.push(`E+${exponent}`);
                else if (exponent < 0)
                    string.push(`E${exponent}`);
                return string.join('');
            }
            string.push(`${significand[index++]}`);
            significand_digits = significand_digits - 1;
            if (significand_digits) {
                string.push('.');
            }
            for (let i = 0; i < significand_digits; i++) {
                string.push(`${significand[index++]}`);
            }
            string.push('E');
            if (scientific_exponent > 0) {
                string.push(`+${scientific_exponent}`);
            }
            else {
                string.push(`${scientific_exponent}`);
            }
        }
        else {
            if (exponent >= 0) {
                for (let i = 0; i < significand_digits; i++) {
                    string.push(`${significand[index++]}`);
                }
            }
            else {
                let radix_position = significand_digits + exponent;
                if (radix_position > 0) {
                    for (let i = 0; i < radix_position; i++) {
                        string.push(`${significand[index++]}`);
                    }
                }
                else {
                    string.push('0');
                }
                string.push('.');
                while (radix_position++ < 0) {
                    string.push('0');
                }
                for (let i = 0; i < significand_digits - Math.max(radix_position - 1, 0); i++) {
                    string.push(`${significand[index++]}`);
                }
            }
        }
        return string.join('');
    }
    toJSON() {
        return { $numberDecimal: this.toString() };
    }
    toExtendedJSON() {
        return { $numberDecimal: this.toString() };
    }
    static fromExtendedJSON(doc) {
        return Decimal128.fromString(doc.$numberDecimal);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        const d128string = inspect(this.toString(), options);
        return `new Decimal128(${d128string})`;
    }
}

class Double extends BSONValue {
    get _bsontype() {
        return 'Double';
    }
    constructor(value) {
        super();
        if (value instanceof Number) {
            value = value.valueOf();
        }
        this.value = +value;
    }
    static fromString(value) {
        const coercedValue = Number(value);
        if (value === 'NaN')
            return new Double(NaN);
        if (value === 'Infinity')
            return new Double(Infinity);
        if (value === '-Infinity')
            return new Double(-Infinity);
        if (!Number.isFinite(coercedValue)) {
            throw new BSONError(`Input: ${value} is not representable as a Double`);
        }
        if (value.trim() !== value) {
            throw new BSONError(`Input: '${value}' contains whitespace`);
        }
        if (value === '') {
            throw new BSONError(`Input is an empty string`);
        }
        if (/[^-0-9.+eE]/.test(value)) {
            throw new BSONError(`Input: '${value}' is not in decimal or exponential notation`);
        }
        return new Double(coercedValue);
    }
    valueOf() {
        return this.value;
    }
    toJSON() {
        return this.value;
    }
    toString(radix) {
        return this.value.toString(radix);
    }
    toExtendedJSON(options) {
        if (options && (options.legacy || (options.relaxed && isFinite(this.value)))) {
            return this.value;
        }
        if (Object.is(Math.sign(this.value), -0)) {
            return { $numberDouble: '-0.0' };
        }
        return {
            $numberDouble: Number.isInteger(this.value) ? this.value.toFixed(1) : this.value.toString()
        };
    }
    static fromExtendedJSON(doc, options) {
        const doubleValue = parseFloat(doc.$numberDouble);
        return options && options.relaxed ? doubleValue : new Double(doubleValue);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        return `new Double(${inspect(this.value, options)})`;
    }
}

class Int32 extends BSONValue {
    get _bsontype() {
        return 'Int32';
    }
    constructor(value) {
        super();
        if (value instanceof Number) {
            value = value.valueOf();
        }
        this.value = +value | 0;
    }
    static fromString(value) {
        const cleanedValue = removeLeadingZerosAndExplicitPlus(value);
        const coercedValue = Number(value);
        if (BSON_INT32_MAX < coercedValue) {
            throw new BSONError(`Input: '${value}' is larger than the maximum value for Int32`);
        }
        else if (BSON_INT32_MIN > coercedValue) {
            throw new BSONError(`Input: '${value}' is smaller than the minimum value for Int32`);
        }
        else if (!Number.isSafeInteger(coercedValue)) {
            throw new BSONError(`Input: '${value}' is not a safe integer`);
        }
        else if (coercedValue.toString() !== cleanedValue) {
            throw new BSONError(`Input: '${value}' is not a valid Int32 string`);
        }
        return new Int32(coercedValue);
    }
    valueOf() {
        return this.value;
    }
    toString(radix) {
        return this.value.toString(radix);
    }
    toJSON() {
        return this.value;
    }
    toExtendedJSON(options) {
        if (options && (options.relaxed || options.legacy))
            return this.value;
        return { $numberInt: this.value.toString() };
    }
    static fromExtendedJSON(doc, options) {
        return options && options.relaxed ? parseInt(doc.$numberInt, 10) : new Int32(doc.$numberInt);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        return `new Int32(${inspect(this.value, options)})`;
    }
}

class MaxKey extends BSONValue {
    get _bsontype() {
        return 'MaxKey';
    }
    toExtendedJSON() {
        return { $maxKey: 1 };
    }
    static fromExtendedJSON() {
        return new MaxKey();
    }
    inspect() {
        return 'new MaxKey()';
    }
}

class MinKey extends BSONValue {
    get _bsontype() {
        return 'MinKey';
    }
    toExtendedJSON() {
        return { $minKey: 1 };
    }
    static fromExtendedJSON() {
        return new MinKey();
    }
    inspect() {
        return 'new MinKey()';
    }
}

let PROCESS_UNIQUE = null;
const __idCache = new WeakMap();
class ObjectId extends BSONValue {
    get _bsontype() {
        return 'ObjectId';
    }
    constructor(inputId) {
        super();
        let workingId;
        if (typeof inputId === 'object' && inputId && 'id' in inputId) {
            if (typeof inputId.id !== 'string' && !ArrayBuffer.isView(inputId.id)) {
                throw new BSONError('Argument passed in must have an id that is of type string or Buffer');
            }
            if ('toHexString' in inputId && typeof inputId.toHexString === 'function') {
                workingId = ByteUtils.fromHex(inputId.toHexString());
            }
            else {
                workingId = inputId.id;
            }
        }
        else {
            workingId = inputId;
        }
        if (workingId == null || typeof workingId === 'number') {
            this.buffer = ObjectId.generate(typeof workingId === 'number' ? workingId : undefined);
        }
        else if (ArrayBuffer.isView(workingId) && workingId.byteLength === 12) {
            this.buffer = ByteUtils.toLocalBufferType(workingId);
        }
        else if (typeof workingId === 'string') {
            if (ObjectId.validateHexString(workingId)) {
                this.buffer = ByteUtils.fromHex(workingId);
                if (ObjectId.cacheHexString) {
                    __idCache.set(this, workingId);
                }
            }
            else {
                throw new BSONError('input must be a 24 character hex string, 12 byte Uint8Array, or an integer');
            }
        }
        else {
            throw new BSONError('Argument passed in does not match the accepted types');
        }
    }
    get id() {
        return this.buffer;
    }
    set id(value) {
        this.buffer = value;
        if (ObjectId.cacheHexString) {
            __idCache.set(this, ByteUtils.toHex(value));
        }
    }
    static validateHexString(string) {
        if (string?.length !== 24)
            return false;
        for (let i = 0; i < 24; i++) {
            const char = string.charCodeAt(i);
            if ((char >= 48 && char <= 57) ||
                (char >= 97 && char <= 102) ||
                (char >= 65 && char <= 70)) {
                continue;
            }
            return false;
        }
        return true;
    }
    toHexString() {
        if (ObjectId.cacheHexString) {
            const __id = __idCache.get(this);
            if (__id)
                return __id;
        }
        const hexString = ByteUtils.toHex(this.id);
        if (ObjectId.cacheHexString) {
            __idCache.set(this, hexString);
        }
        return hexString;
    }
    static getInc() {
        return (ObjectId.index = (ObjectId.index + 1) % 0xffffff);
    }
    static generate(time) {
        if ('number' !== typeof time) {
            time = Math.floor(Date.now() / 1000);
        }
        const inc = ObjectId.getInc();
        const buffer = ByteUtils.allocateUnsafe(12);
        NumberUtils.setInt32BE(buffer, 0, time);
        if (PROCESS_UNIQUE === null) {
            PROCESS_UNIQUE = ByteUtils.randomBytes(5);
        }
        buffer[4] = PROCESS_UNIQUE[0];
        buffer[5] = PROCESS_UNIQUE[1];
        buffer[6] = PROCESS_UNIQUE[2];
        buffer[7] = PROCESS_UNIQUE[3];
        buffer[8] = PROCESS_UNIQUE[4];
        buffer[11] = inc & 0xff;
        buffer[10] = (inc >> 8) & 0xff;
        buffer[9] = (inc >> 16) & 0xff;
        return buffer;
    }
    toString(encoding) {
        if (encoding === 'base64')
            return ByteUtils.toBase64(this.id);
        if (encoding === 'hex')
            return this.toHexString();
        return this.toHexString();
    }
    toJSON() {
        return this.toHexString();
    }
    static is(variable) {
        return (variable != null &&
            typeof variable === 'object' &&
            '_bsontype' in variable &&
            variable._bsontype === 'ObjectId');
    }
    equals(otherId) {
        if (otherId === undefined || otherId === null) {
            return false;
        }
        if (ObjectId.is(otherId)) {
            return (this.buffer[11] === otherId.buffer[11] && ByteUtils.equals(this.buffer, otherId.buffer));
        }
        if (typeof otherId === 'string') {
            return otherId.toLowerCase() === this.toHexString();
        }
        if (typeof otherId === 'object' && typeof otherId.toHexString === 'function') {
            const otherIdString = otherId.toHexString();
            const thisIdString = this.toHexString();
            return typeof otherIdString === 'string' && otherIdString.toLowerCase() === thisIdString;
        }
        return false;
    }
    getTimestamp() {
        const timestamp = new Date();
        const time = NumberUtils.getUint32BE(this.buffer, 0);
        timestamp.setTime(Math.floor(time) * 1000);
        return timestamp;
    }
    static createPk() {
        return new ObjectId();
    }
    serializeInto(uint8array, index) {
        uint8array[index] = this.buffer[0];
        uint8array[index + 1] = this.buffer[1];
        uint8array[index + 2] = this.buffer[2];
        uint8array[index + 3] = this.buffer[3];
        uint8array[index + 4] = this.buffer[4];
        uint8array[index + 5] = this.buffer[5];
        uint8array[index + 6] = this.buffer[6];
        uint8array[index + 7] = this.buffer[7];
        uint8array[index + 8] = this.buffer[8];
        uint8array[index + 9] = this.buffer[9];
        uint8array[index + 10] = this.buffer[10];
        uint8array[index + 11] = this.buffer[11];
        return 12;
    }
    static createFromTime(time) {
        const buffer = ByteUtils.allocate(12);
        for (let i = 11; i >= 4; i--)
            buffer[i] = 0;
        NumberUtils.setInt32BE(buffer, 0, time);
        return new ObjectId(buffer);
    }
    static createFromHexString(hexString) {
        if (hexString?.length !== 24) {
            throw new BSONError('hex string must be 24 characters');
        }
        return new ObjectId(ByteUtils.fromHex(hexString));
    }
    static createFromBase64(base64) {
        if (base64?.length !== 16) {
            throw new BSONError('base64 string must be 16 characters');
        }
        return new ObjectId(ByteUtils.fromBase64(base64));
    }
    static isValid(id) {
        if (id == null)
            return false;
        if (typeof id === 'string')
            return ObjectId.validateHexString(id);
        try {
            new ObjectId(id);
            return true;
        }
        catch {
            return false;
        }
    }
    toExtendedJSON() {
        if (this.toHexString)
            return { $oid: this.toHexString() };
        return { $oid: this.toString('hex') };
    }
    static fromExtendedJSON(doc) {
        return new ObjectId(doc.$oid);
    }
    isCached() {
        return ObjectId.cacheHexString && __idCache.has(this);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        return `new ObjectId(${inspect(this.toHexString(), options)})`;
    }
}
ObjectId.index = Math.floor(Math.random() * 0xffffff);

function internalCalculateObjectSize(object, serializeFunctions, ignoreUndefined) {
    let totalLength = 4 + 1;
    if (Array.isArray(object)) {
        for (let i = 0; i < object.length; i++) {
            totalLength += calculateElement(i.toString(), object[i], serializeFunctions, true, ignoreUndefined);
        }
    }
    else {
        if (typeof object?.toBSON === 'function') {
            object = object.toBSON();
        }
        for (const key of Object.keys(object)) {
            totalLength += calculateElement(key, object[key], serializeFunctions, false, ignoreUndefined);
        }
    }
    return totalLength;
}
function calculateElement(name, value, serializeFunctions = false, isArray = false, ignoreUndefined = false) {
    if (typeof value?.toBSON === 'function') {
        value = value.toBSON();
    }
    switch (typeof value) {
        case 'string':
            return 1 + ByteUtils.utf8ByteLength(name) + 1 + 4 + ByteUtils.utf8ByteLength(value) + 1;
        case 'number':
            if (Math.floor(value) === value &&
                value >= JS_INT_MIN &&
                value <= JS_INT_MAX) {
                if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) {
                    return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (4 + 1);
                }
                else {
                    return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
                }
            }
            else {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
            }
        case 'undefined':
            if (isArray || !ignoreUndefined)
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1;
            return 0;
        case 'boolean':
            return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (1 + 1);
        case 'object':
            if (value != null &&
                typeof value._bsontype === 'string' &&
                value[BSON_VERSION_SYMBOL] !== BSON_MAJOR_VERSION) {
                throw new BSONVersionError();
            }
            else if (value == null || value._bsontype === 'MinKey' || value._bsontype === 'MaxKey') {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + 1;
            }
            else if (value._bsontype === 'ObjectId') {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (12 + 1);
            }
            else if (value instanceof Date || isDate(value)) {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
            }
            else if (ArrayBuffer.isView(value) ||
                value instanceof ArrayBuffer ||
                isAnyArrayBuffer(value)) {
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (1 + 4 + 1) + value.byteLength);
            }
            else if (value._bsontype === 'Long' ||
                value._bsontype === 'Double' ||
                value._bsontype === 'Timestamp') {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
            }
            else if (value._bsontype === 'Decimal128') {
                return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (16 + 1);
            }
            else if (value._bsontype === 'Code') {
                if (value.scope != null && Object.keys(value.scope).length > 0) {
                    return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                        1 +
                        4 +
                        4 +
                        ByteUtils.utf8ByteLength(value.code.toString()) +
                        1 +
                        internalCalculateObjectSize(value.scope, serializeFunctions, ignoreUndefined));
                }
                else {
                    return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                        1 +
                        4 +
                        ByteUtils.utf8ByteLength(value.code.toString()) +
                        1);
                }
            }
            else if (value._bsontype === 'Binary') {
                const binary = value;
                if (binary.sub_type === Binary.SUBTYPE_BYTE_ARRAY) {
                    return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                        (binary.position + 1 + 4 + 1 + 4));
                }
                else {
                    return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (binary.position + 1 + 4 + 1));
                }
            }
            else if (value._bsontype === 'Symbol') {
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                    ByteUtils.utf8ByteLength(value.value) +
                    4 +
                    1 +
                    1);
            }
            else if (value._bsontype === 'DBRef') {
                const ordered_values = Object.assign({
                    $ref: value.collection,
                    $id: value.oid
                }, value.fields);
                if (value.db != null) {
                    ordered_values['$db'] = value.db;
                }
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                    1 +
                    internalCalculateObjectSize(ordered_values, serializeFunctions, ignoreUndefined));
            }
            else if (value instanceof RegExp || isRegExp(value)) {
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                    1 +
                    ByteUtils.utf8ByteLength(value.source) +
                    1 +
                    (value.global ? 1 : 0) +
                    (value.ignoreCase ? 1 : 0) +
                    (value.multiline ? 1 : 0) +
                    1);
            }
            else if (value._bsontype === 'BSONRegExp') {
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                    1 +
                    ByteUtils.utf8ByteLength(value.pattern) +
                    1 +
                    ByteUtils.utf8ByteLength(value.options) +
                    1);
            }
            else {
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                    internalCalculateObjectSize(value, serializeFunctions, ignoreUndefined) +
                    1);
            }
        case 'function':
            if (serializeFunctions) {
                return ((name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) +
                    1 +
                    4 +
                    ByteUtils.utf8ByteLength(value.toString()) +
                    1);
            }
            return 0;
        case 'bigint':
            return (name != null ? ByteUtils.utf8ByteLength(name) + 1 : 0) + (8 + 1);
        case 'symbol':
            return 0;
        default:
            throw new BSONError(`Unrecognized JS type: ${typeof value}`);
    }
}

function alphabetize(str) {
    return str.split('').sort().join('');
}
class BSONRegExp extends BSONValue {
    get _bsontype() {
        return 'BSONRegExp';
    }
    constructor(pattern, options) {
        super();
        this.pattern = pattern;
        this.options = alphabetize(options ?? '');
        if (this.pattern.indexOf('\x00') !== -1) {
            throw new BSONError(`BSON Regex patterns cannot contain null bytes, found: ${JSON.stringify(this.pattern)}`);
        }
        if (this.options.indexOf('\x00') !== -1) {
            throw new BSONError(`BSON Regex options cannot contain null bytes, found: ${JSON.stringify(this.options)}`);
        }
        for (let i = 0; i < this.options.length; i++) {
            if (!(this.options[i] === 'i' ||
                this.options[i] === 'm' ||
                this.options[i] === 'x' ||
                this.options[i] === 'l' ||
                this.options[i] === 's' ||
                this.options[i] === 'u')) {
                throw new BSONError(`The regular expression option [${this.options[i]}] is not supported`);
            }
        }
    }
    static parseOptions(options) {
        return options ? options.split('').sort().join('') : '';
    }
    toExtendedJSON(options) {
        options = options || {};
        if (options.legacy) {
            return { $regex: this.pattern, $options: this.options };
        }
        return { $regularExpression: { pattern: this.pattern, options: this.options } };
    }
    static fromExtendedJSON(doc) {
        if ('$regex' in doc) {
            if (typeof doc.$regex !== 'string') {
                if (doc.$regex._bsontype === 'BSONRegExp') {
                    return doc;
                }
            }
            else {
                return new BSONRegExp(doc.$regex, BSONRegExp.parseOptions(doc.$options));
            }
        }
        if ('$regularExpression' in doc) {
            return new BSONRegExp(doc.$regularExpression.pattern, BSONRegExp.parseOptions(doc.$regularExpression.options));
        }
        throw new BSONError(`Unexpected BSONRegExp EJSON object form: ${JSON.stringify(doc)}`);
    }
    inspect(depth, options, inspect) {
        const stylize = getStylizeFunction(options) ?? (v => v);
        inspect ??= defaultInspect;
        const pattern = stylize(inspect(this.pattern), 'regexp');
        const flags = stylize(inspect(this.options), 'regexp');
        return `new BSONRegExp(${pattern}, ${flags})`;
    }
}

class BSONSymbol extends BSONValue {
    get _bsontype() {
        return 'BSONSymbol';
    }
    constructor(value) {
        super();
        this.value = value;
    }
    valueOf() {
        return this.value;
    }
    toString() {
        return this.value;
    }
    toJSON() {
        return this.value;
    }
    toExtendedJSON() {
        return { $symbol: this.value };
    }
    static fromExtendedJSON(doc) {
        return new BSONSymbol(doc.$symbol);
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        return `new BSONSymbol(${inspect(this.value, options)})`;
    }
}

const LongWithoutOverridesClass = Long;
class Timestamp extends LongWithoutOverridesClass {
    get _bsontype() {
        return 'Timestamp';
    }
    get i() {
        return this.low >>> 0;
    }
    get t() {
        return this.high >>> 0;
    }
    constructor(low) {
        if (low == null) {
            super(0, 0, true);
        }
        else if (typeof low === 'bigint') {
            super(low, true);
        }
        else if (Long.isLong(low)) {
            super(low.low, low.high, true);
        }
        else if (typeof low === 'object' && 't' in low && 'i' in low) {
            if (typeof low.t !== 'number' && (typeof low.t !== 'object' || low.t._bsontype !== 'Int32')) {
                throw new BSONError('Timestamp constructed from { t, i } must provide t as a number');
            }
            if (typeof low.i !== 'number' && (typeof low.i !== 'object' || low.i._bsontype !== 'Int32')) {
                throw new BSONError('Timestamp constructed from { t, i } must provide i as a number');
            }
            const t = Number(low.t);
            const i = Number(low.i);
            if (t < 0 || Number.isNaN(t)) {
                throw new BSONError('Timestamp constructed from { t, i } must provide a positive t');
            }
            if (i < 0 || Number.isNaN(i)) {
                throw new BSONError('Timestamp constructed from { t, i } must provide a positive i');
            }
            if (t > 0xffff_ffff) {
                throw new BSONError('Timestamp constructed from { t, i } must provide t equal or less than uint32 max');
            }
            if (i > 0xffff_ffff) {
                throw new BSONError('Timestamp constructed from { t, i } must provide i equal or less than uint32 max');
            }
            super(i, t, true);
        }
        else {
            throw new BSONError('A Timestamp can only be constructed with: bigint, Long, or { t: number; i: number }');
        }
    }
    toJSON() {
        return {
            $timestamp: this.toString()
        };
    }
    static fromInt(value) {
        return new Timestamp(Long.fromInt(value, true));
    }
    static fromNumber(value) {
        return new Timestamp(Long.fromNumber(value, true));
    }
    static fromBits(lowBits, highBits) {
        return new Timestamp({ i: lowBits, t: highBits });
    }
    static fromString(str, optRadix) {
        return new Timestamp(Long.fromString(str, true, optRadix));
    }
    toExtendedJSON() {
        return { $timestamp: { t: this.t, i: this.i } };
    }
    static fromExtendedJSON(doc) {
        const i = Long.isLong(doc.$timestamp.i)
            ? doc.$timestamp.i.getLowBitsUnsigned()
            : doc.$timestamp.i;
        const t = Long.isLong(doc.$timestamp.t)
            ? doc.$timestamp.t.getLowBitsUnsigned()
            : doc.$timestamp.t;
        return new Timestamp({ t, i });
    }
    inspect(depth, options, inspect) {
        inspect ??= defaultInspect;
        const t = inspect(this.t, options);
        const i = inspect(this.i, options);
        return `new Timestamp({ t: ${t}, i: ${i} })`;
    }
}
Timestamp.MAX_VALUE = Long.MAX_UNSIGNED_VALUE;

const JS_INT_MAX_LONG = Long.fromNumber(JS_INT_MAX);
const JS_INT_MIN_LONG = Long.fromNumber(JS_INT_MIN);
function internalDeserialize(buffer, options, isArray) {
    options = options == null ? {} : options;
    const index = options && options.index ? options.index : 0;
    const size = NumberUtils.getInt32LE(buffer, index);
    if (size < 5) {
        throw new BSONError(`bson size must be >= 5, is ${size}`);
    }
    if (options.allowObjectSmallerThanBufferSize && buffer.length < size) {
        throw new BSONError(`buffer length ${buffer.length} must be >= bson size ${size}`);
    }
    if (!options.allowObjectSmallerThanBufferSize && buffer.length !== size) {
        throw new BSONError(`buffer length ${buffer.length} must === bson size ${size}`);
    }
    if (size + index > buffer.byteLength) {
        throw new BSONError(`(bson size ${size} + options.index ${index} must be <= buffer length ${buffer.byteLength})`);
    }
    if (buffer[index + size - 1] !== 0) {
        throw new BSONError("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");
    }
    return deserializeObject(buffer, index, options, isArray);
}
const allowedDBRefKeys = /^\$ref$|^\$id$|^\$db$/;
function deserializeObject(buffer, index, options, isArray = false) {
    const fieldsAsRaw = options['fieldsAsRaw'] == null ? null : options['fieldsAsRaw'];
    const raw = options['raw'] == null ? false : options['raw'];
    const bsonRegExp = typeof options['bsonRegExp'] === 'boolean' ? options['bsonRegExp'] : false;
    const promoteBuffers = options.promoteBuffers ?? false;
    const promoteLongs = options.promoteLongs ?? true;
    const promoteValues = options.promoteValues ?? true;
    const useBigInt64 = options.useBigInt64 ?? false;
    if (useBigInt64 && !promoteValues) {
        throw new BSONError('Must either request bigint or Long for int64 deserialization');
    }
    if (useBigInt64 && !promoteLongs) {
        throw new BSONError('Must either request bigint or Long for int64 deserialization');
    }
    const validation = options.validation == null ? { utf8: true } : options.validation;
    let globalUTFValidation = true;
    let validationSetting;
    let utf8KeysSet;
    const utf8ValidatedKeys = validation.utf8;
    if (typeof utf8ValidatedKeys === 'boolean') {
        validationSetting = utf8ValidatedKeys;
    }
    else {
        globalUTFValidation = false;
        const utf8ValidationValues = Object.keys(utf8ValidatedKeys).map(function (key) {
            return utf8ValidatedKeys[key];
        });
        if (utf8ValidationValues.length === 0) {
            throw new BSONError('UTF-8 validation setting cannot be empty');
        }
        if (typeof utf8ValidationValues[0] !== 'boolean') {
            throw new BSONError('Invalid UTF-8 validation option, must specify boolean values');
        }
        validationSetting = utf8ValidationValues[0];
        if (!utf8ValidationValues.every(item => item === validationSetting)) {
            throw new BSONError('Invalid UTF-8 validation option - keys must be all true or all false');
        }
    }
    if (!globalUTFValidation) {
        utf8KeysSet = new Set();
        for (const key of Object.keys(utf8ValidatedKeys)) {
            utf8KeysSet.add(key);
        }
    }
    const startIndex = index;
    if (buffer.length < 5)
        throw new BSONError('corrupt bson message < 5 bytes long');
    const size = NumberUtils.getInt32LE(buffer, index);
    index += 4;
    if (size < 5 || size > buffer.length)
        throw new BSONError('corrupt bson message');
    const object = isArray ? [] : {};
    let arrayIndex = 0;
    let isPossibleDBRef = isArray ? false : null;
    while (true) {
        const elementType = buffer[index++];
        if (elementType === 0)
            break;
        let i = index;
        while (buffer[i] !== 0x00 && i < buffer.length) {
            i++;
        }
        if (i >= buffer.byteLength)
            throw new BSONError('Bad BSON Document: illegal CString');
        const name = isArray ? arrayIndex++ : ByteUtils.toUTF8(buffer, index, i, false);
        let shouldValidateKey = true;
        if (globalUTFValidation || utf8KeysSet?.has(name)) {
            shouldValidateKey = validationSetting;
        }
        else {
            shouldValidateKey = !validationSetting;
        }
        if (isPossibleDBRef !== false && name[0] === '$') {
            isPossibleDBRef = allowedDBRefKeys.test(name);
        }
        let value;
        index = i + 1;
        if (elementType === BSON_DATA_STRING) {
            const stringSize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            if (stringSize <= 0 ||
                stringSize > buffer.length - index ||
                buffer[index + stringSize - 1] !== 0) {
                throw new BSONError('bad string length in bson');
            }
            value = ByteUtils.toUTF8(buffer, index, index + stringSize - 1, shouldValidateKey);
            index = index + stringSize;
        }
        else if (elementType === BSON_DATA_OID) {
            const oid = ByteUtils.allocateUnsafe(12);
            for (let i = 0; i < 12; i++)
                oid[i] = buffer[index + i];
            value = new ObjectId(oid);
            index = index + 12;
        }
        else if (elementType === BSON_DATA_INT && promoteValues === false) {
            value = new Int32(NumberUtils.getInt32LE(buffer, index));
            index += 4;
        }
        else if (elementType === BSON_DATA_INT) {
            value = NumberUtils.getInt32LE(buffer, index);
            index += 4;
        }
        else if (elementType === BSON_DATA_NUMBER) {
            value = NumberUtils.getFloat64LE(buffer, index);
            index += 8;
            if (promoteValues === false)
                value = new Double(value);
        }
        else if (elementType === BSON_DATA_DATE) {
            const lowBits = NumberUtils.getInt32LE(buffer, index);
            const highBits = NumberUtils.getInt32LE(buffer, index + 4);
            index += 8;
            value = new Date(new Long(lowBits, highBits).toNumber());
        }
        else if (elementType === BSON_DATA_BOOLEAN) {
            if (buffer[index] !== 0 && buffer[index] !== 1)
                throw new BSONError('illegal boolean type value');
            value = buffer[index++] === 1;
        }
        else if (elementType === BSON_DATA_OBJECT) {
            const _index = index;
            const objectSize = NumberUtils.getInt32LE(buffer, index);
            if (objectSize <= 0 || objectSize > buffer.length - index)
                throw new BSONError('bad embedded document length in bson');
            if (raw) {
                value = buffer.subarray(index, index + objectSize);
            }
            else {
                let objectOptions = options;
                if (!globalUTFValidation) {
                    objectOptions = { ...options, validation: { utf8: shouldValidateKey } };
                }
                value = deserializeObject(buffer, _index, objectOptions, false);
            }
            index = index + objectSize;
        }
        else if (elementType === BSON_DATA_ARRAY) {
            const _index = index;
            const objectSize = NumberUtils.getInt32LE(buffer, index);
            let arrayOptions = options;
            const stopIndex = index + objectSize;
            if (fieldsAsRaw && fieldsAsRaw[name]) {
                arrayOptions = { ...options, raw: true };
            }
            if (!globalUTFValidation) {
                arrayOptions = { ...arrayOptions, validation: { utf8: shouldValidateKey } };
            }
            value = deserializeObject(buffer, _index, arrayOptions, true);
            index = index + objectSize;
            if (buffer[index - 1] !== 0)
                throw new BSONError('invalid array terminator byte');
            if (index !== stopIndex)
                throw new BSONError('corrupted array bson');
        }
        else if (elementType === BSON_DATA_UNDEFINED) {
            value = undefined;
        }
        else if (elementType === BSON_DATA_NULL) {
            value = null;
        }
        else if (elementType === BSON_DATA_LONG) {
            if (useBigInt64) {
                value = NumberUtils.getBigInt64LE(buffer, index);
                index += 8;
            }
            else {
                const lowBits = NumberUtils.getInt32LE(buffer, index);
                const highBits = NumberUtils.getInt32LE(buffer, index + 4);
                index += 8;
                const long = new Long(lowBits, highBits);
                if (promoteLongs && promoteValues === true) {
                    value =
                        long.lessThanOrEqual(JS_INT_MAX_LONG) && long.greaterThanOrEqual(JS_INT_MIN_LONG)
                            ? long.toNumber()
                            : long;
                }
                else {
                    value = long;
                }
            }
        }
        else if (elementType === BSON_DATA_DECIMAL128) {
            const bytes = ByteUtils.allocateUnsafe(16);
            for (let i = 0; i < 16; i++)
                bytes[i] = buffer[index + i];
            index = index + 16;
            value = new Decimal128(bytes);
        }
        else if (elementType === BSON_DATA_BINARY) {
            let binarySize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            const totalBinarySize = binarySize;
            const subType = buffer[index++];
            if (binarySize < 0)
                throw new BSONError('Negative binary type element size found');
            if (binarySize > buffer.byteLength)
                throw new BSONError('Binary type size larger than document size');
            if (subType === Binary.SUBTYPE_BYTE_ARRAY) {
                binarySize = NumberUtils.getInt32LE(buffer, index);
                index += 4;
                if (binarySize < 0)
                    throw new BSONError('Negative binary type element size found for subtype 0x02');
                if (binarySize > totalBinarySize - 4)
                    throw new BSONError('Binary type with subtype 0x02 contains too long binary size');
                if (binarySize < totalBinarySize - 4)
                    throw new BSONError('Binary type with subtype 0x02 contains too short binary size');
            }
            if (promoteBuffers && promoteValues) {
                value = ByteUtils.toLocalBufferType(buffer.subarray(index, index + binarySize));
            }
            else {
                value = new Binary(buffer.subarray(index, index + binarySize), subType);
                if (subType === BSON_BINARY_SUBTYPE_UUID_NEW && UUID.isValid(value)) {
                    value = value.toUUID();
                }
            }
            index = index + binarySize;
        }
        else if (elementType === BSON_DATA_REGEXP && bsonRegExp === false) {
            i = index;
            while (buffer[i] !== 0x00 && i < buffer.length) {
                i++;
            }
            if (i >= buffer.length)
                throw new BSONError('Bad BSON Document: illegal CString');
            const source = ByteUtils.toUTF8(buffer, index, i, false);
            index = i + 1;
            i = index;
            while (buffer[i] !== 0x00 && i < buffer.length) {
                i++;
            }
            if (i >= buffer.length)
                throw new BSONError('Bad BSON Document: illegal CString');
            const regExpOptions = ByteUtils.toUTF8(buffer, index, i, false);
            index = i + 1;
            const optionsArray = new Array(regExpOptions.length);
            for (i = 0; i < regExpOptions.length; i++) {
                switch (regExpOptions[i]) {
                    case 'm':
                        optionsArray[i] = 'm';
                        break;
                    case 's':
                        optionsArray[i] = 'g';
                        break;
                    case 'i':
                        optionsArray[i] = 'i';
                        break;
                }
            }
            value = new RegExp(source, optionsArray.join(''));
        }
        else if (elementType === BSON_DATA_REGEXP && bsonRegExp === true) {
            i = index;
            while (buffer[i] !== 0x00 && i < buffer.length) {
                i++;
            }
            if (i >= buffer.length)
                throw new BSONError('Bad BSON Document: illegal CString');
            const source = ByteUtils.toUTF8(buffer, index, i, false);
            index = i + 1;
            i = index;
            while (buffer[i] !== 0x00 && i < buffer.length) {
                i++;
            }
            if (i >= buffer.length)
                throw new BSONError('Bad BSON Document: illegal CString');
            const regExpOptions = ByteUtils.toUTF8(buffer, index, i, false);
            index = i + 1;
            value = new BSONRegExp(source, regExpOptions);
        }
        else if (elementType === BSON_DATA_SYMBOL) {
            const stringSize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            if (stringSize <= 0 ||
                stringSize > buffer.length - index ||
                buffer[index + stringSize - 1] !== 0) {
                throw new BSONError('bad string length in bson');
            }
            const symbol = ByteUtils.toUTF8(buffer, index, index + stringSize - 1, shouldValidateKey);
            value = promoteValues ? symbol : new BSONSymbol(symbol);
            index = index + stringSize;
        }
        else if (elementType === BSON_DATA_TIMESTAMP) {
            value = new Timestamp({
                i: NumberUtils.getUint32LE(buffer, index),
                t: NumberUtils.getUint32LE(buffer, index + 4)
            });
            index += 8;
        }
        else if (elementType === BSON_DATA_MIN_KEY) {
            value = new MinKey();
        }
        else if (elementType === BSON_DATA_MAX_KEY) {
            value = new MaxKey();
        }
        else if (elementType === BSON_DATA_CODE) {
            const stringSize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            if (stringSize <= 0 ||
                stringSize > buffer.length - index ||
                buffer[index + stringSize - 1] !== 0) {
                throw new BSONError('bad string length in bson');
            }
            const functionString = ByteUtils.toUTF8(buffer, index, index + stringSize - 1, shouldValidateKey);
            value = new Code(functionString);
            index = index + stringSize;
        }
        else if (elementType === BSON_DATA_CODE_W_SCOPE) {
            const totalSize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            if (totalSize < 4 + 4 + 4 + 1) {
                throw new BSONError('code_w_scope total size shorter minimum expected length');
            }
            const stringSize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            if (stringSize <= 0 ||
                stringSize > buffer.length - index ||
                buffer[index + stringSize - 1] !== 0) {
                throw new BSONError('bad string length in bson');
            }
            const functionString = ByteUtils.toUTF8(buffer, index, index + stringSize - 1, shouldValidateKey);
            index = index + stringSize;
            const _index = index;
            const objectSize = NumberUtils.getInt32LE(buffer, index);
            const scopeObject = deserializeObject(buffer, _index, options, false);
            index = index + objectSize;
            if (totalSize < 4 + 4 + objectSize + stringSize) {
                throw new BSONError('code_w_scope total size is too short, truncating scope');
            }
            if (totalSize > 4 + 4 + objectSize + stringSize) {
                throw new BSONError('code_w_scope total size is too long, clips outer document');
            }
            value = new Code(functionString, scopeObject);
        }
        else if (elementType === BSON_DATA_DBPOINTER) {
            const stringSize = NumberUtils.getInt32LE(buffer, index);
            index += 4;
            if (stringSize <= 0 ||
                stringSize > buffer.length - index ||
                buffer[index + stringSize - 1] !== 0)
                throw new BSONError('bad string length in bson');
            const namespace = ByteUtils.toUTF8(buffer, index, index + stringSize - 1, shouldValidateKey);
            index = index + stringSize;
            const oidBuffer = ByteUtils.allocateUnsafe(12);
            for (let i = 0; i < 12; i++)
                oidBuffer[i] = buffer[index + i];
            const oid = new ObjectId(oidBuffer);
            index = index + 12;
            value = new DBRef(namespace, oid);
        }
        else {
            throw new BSONError(`Detected unknown BSON type ${elementType.toString(16)} for fieldname "${name}"`);
        }
        if (name === '__proto__') {
            Object.defineProperty(object, name, {
                value,
                writable: true,
                enumerable: true,
                configurable: true
            });
        }
        else {
            object[name] = value;
        }
    }
    if (size !== index - startIndex) {
        if (isArray)
            throw new BSONError('corrupt array bson');
        throw new BSONError('corrupt object bson');
    }
    if (!isPossibleDBRef)
        return object;
    if (isDBRefLike(object)) {
        const copy = Object.assign({}, object);
        delete copy.$ref;
        delete copy.$id;
        delete copy.$db;
        return new DBRef(object.$ref, object.$id, object.$db, copy);
    }
    return object;
}

const regexp = /\x00/;
const ignoreKeys = new Set(['$db', '$ref', '$id', '$clusterTime']);
function serializeString(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_STRING;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes + 1;
    buffer[index - 1] = 0;
    const size = ByteUtils.encodeUTF8Into(buffer, value, index + 4);
    NumberUtils.setInt32LE(buffer, index, size + 1);
    index = index + 4 + size;
    buffer[index++] = 0;
    return index;
}
function serializeNumber(buffer, key, value, index) {
    const isNegativeZero = Object.is(value, -0);
    const type = !isNegativeZero &&
        Number.isSafeInteger(value) &&
        value <= BSON_INT32_MAX &&
        value >= BSON_INT32_MIN
        ? BSON_DATA_INT
        : BSON_DATA_NUMBER;
    buffer[index++] = type;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0x00;
    if (type === BSON_DATA_INT) {
        index += NumberUtils.setInt32LE(buffer, index, value);
    }
    else {
        index += NumberUtils.setFloat64LE(buffer, index, value);
    }
    return index;
}
function serializeBigInt(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_LONG;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index += numberOfWrittenBytes;
    buffer[index++] = 0;
    index += NumberUtils.setBigInt64LE(buffer, index, value);
    return index;
}
function serializeNull(buffer, key, _, index) {
    buffer[index++] = BSON_DATA_NULL;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    return index;
}
function serializeBoolean(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_BOOLEAN;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    buffer[index++] = value ? 1 : 0;
    return index;
}
function serializeDate(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_DATE;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const dateInMilis = Long.fromNumber(value.getTime());
    const lowBits = dateInMilis.getLowBits();
    const highBits = dateInMilis.getHighBits();
    index += NumberUtils.setInt32LE(buffer, index, lowBits);
    index += NumberUtils.setInt32LE(buffer, index, highBits);
    return index;
}
function serializeRegExp(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_REGEXP;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    if (value.source && value.source.match(regexp) != null) {
        throw new BSONError('value ' + value.source + ' must not contain null bytes');
    }
    index = index + ByteUtils.encodeUTF8Into(buffer, value.source, index);
    buffer[index++] = 0x00;
    if (value.ignoreCase)
        buffer[index++] = 0x69;
    if (value.global)
        buffer[index++] = 0x73;
    if (value.multiline)
        buffer[index++] = 0x6d;
    buffer[index++] = 0x00;
    return index;
}
function serializeBSONRegExp(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_REGEXP;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    if (value.pattern.match(regexp) != null) {
        throw new BSONError('pattern ' + value.pattern + ' must not contain null bytes');
    }
    index = index + ByteUtils.encodeUTF8Into(buffer, value.pattern, index);
    buffer[index++] = 0x00;
    const sortedOptions = value.options.split('').sort().join('');
    index = index + ByteUtils.encodeUTF8Into(buffer, sortedOptions, index);
    buffer[index++] = 0x00;
    return index;
}
function serializeMinMax(buffer, key, value, index) {
    if (value === null) {
        buffer[index++] = BSON_DATA_NULL;
    }
    else if (value._bsontype === 'MinKey') {
        buffer[index++] = BSON_DATA_MIN_KEY;
    }
    else {
        buffer[index++] = BSON_DATA_MAX_KEY;
    }
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    return index;
}
function serializeObjectId(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_OID;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    index += value.serializeInto(buffer, index);
    return index;
}
function serializeBuffer(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_BINARY;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const size = value.length;
    index += NumberUtils.setInt32LE(buffer, index, size);
    buffer[index++] = BSON_BINARY_SUBTYPE_DEFAULT;
    if (size <= 16) {
        for (let i = 0; i < size; i++)
            buffer[index + i] = value[i];
    }
    else {
        buffer.set(value, index);
    }
    index = index + size;
    return index;
}
function serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path) {
    if (path.has(value)) {
        throw new BSONError('Cannot convert circular structure to BSON');
    }
    path.add(value);
    buffer[index++] = Array.isArray(value) ? BSON_DATA_ARRAY : BSON_DATA_OBJECT;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const endIndex = serializeInto(buffer, value, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
    path.delete(value);
    return endIndex;
}
function serializeDecimal128(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_DECIMAL128;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    for (let i = 0; i < 16; i++)
        buffer[index + i] = value.bytes[i];
    return index + 16;
}
function serializeLong(buffer, key, value, index) {
    buffer[index++] =
        value._bsontype === 'Long' ? BSON_DATA_LONG : BSON_DATA_TIMESTAMP;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const lowBits = value.getLowBits();
    const highBits = value.getHighBits();
    index += NumberUtils.setInt32LE(buffer, index, lowBits);
    index += NumberUtils.setInt32LE(buffer, index, highBits);
    return index;
}
function serializeInt32(buffer, key, value, index) {
    value = value.valueOf();
    buffer[index++] = BSON_DATA_INT;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    index += NumberUtils.setInt32LE(buffer, index, value);
    return index;
}
function serializeDouble(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_NUMBER;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    index += NumberUtils.setFloat64LE(buffer, index, value.value);
    return index;
}
function serializeFunction(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_CODE;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const functionString = value.toString();
    const size = ByteUtils.encodeUTF8Into(buffer, functionString, index + 4) + 1;
    NumberUtils.setInt32LE(buffer, index, size);
    index = index + 4 + size - 1;
    buffer[index++] = 0;
    return index;
}
function serializeCode(buffer, key, value, index, checkKeys = false, depth = 0, serializeFunctions = false, ignoreUndefined = true, path) {
    if (value.scope && typeof value.scope === 'object') {
        buffer[index++] = BSON_DATA_CODE_W_SCOPE;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
        index = index + numberOfWrittenBytes;
        buffer[index++] = 0;
        let startIndex = index;
        const functionString = value.code;
        index = index + 4;
        const codeSize = ByteUtils.encodeUTF8Into(buffer, functionString, index + 4) + 1;
        NumberUtils.setInt32LE(buffer, index, codeSize);
        buffer[index + 4 + codeSize - 1] = 0;
        index = index + codeSize + 4;
        const endIndex = serializeInto(buffer, value.scope, checkKeys, index, depth + 1, serializeFunctions, ignoreUndefined, path);
        index = endIndex - 1;
        const totalSize = endIndex - startIndex;
        startIndex += NumberUtils.setInt32LE(buffer, startIndex, totalSize);
        buffer[index++] = 0;
    }
    else {
        buffer[index++] = BSON_DATA_CODE;
        const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
        index = index + numberOfWrittenBytes;
        buffer[index++] = 0;
        const functionString = value.code.toString();
        const size = ByteUtils.encodeUTF8Into(buffer, functionString, index + 4) + 1;
        NumberUtils.setInt32LE(buffer, index, size);
        index = index + 4 + size - 1;
        buffer[index++] = 0;
    }
    return index;
}
function serializeBinary(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_BINARY;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const data = value.buffer;
    let size = value.position;
    if (value.sub_type === Binary.SUBTYPE_BYTE_ARRAY)
        size = size + 4;
    index += NumberUtils.setInt32LE(buffer, index, size);
    buffer[index++] = value.sub_type;
    if (value.sub_type === Binary.SUBTYPE_BYTE_ARRAY) {
        size = size - 4;
        index += NumberUtils.setInt32LE(buffer, index, size);
    }
    if (value.sub_type === Binary.SUBTYPE_VECTOR) {
        validateBinaryVector(value);
    }
    if (size <= 16) {
        for (let i = 0; i < size; i++)
            buffer[index + i] = data[i];
    }
    else {
        buffer.set(data, index);
    }
    index = index + value.position;
    return index;
}
function serializeSymbol(buffer, key, value, index) {
    buffer[index++] = BSON_DATA_SYMBOL;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    const size = ByteUtils.encodeUTF8Into(buffer, value.value, index + 4) + 1;
    NumberUtils.setInt32LE(buffer, index, size);
    index = index + 4 + size - 1;
    buffer[index++] = 0;
    return index;
}
function serializeDBRef(buffer, key, value, index, depth, serializeFunctions, path) {
    buffer[index++] = BSON_DATA_OBJECT;
    const numberOfWrittenBytes = ByteUtils.encodeUTF8Into(buffer, key, index);
    index = index + numberOfWrittenBytes;
    buffer[index++] = 0;
    let startIndex = index;
    let output = {
        $ref: value.collection || value.namespace,
        $id: value.oid
    };
    if (value.db != null) {
        output.$db = value.db;
    }
    output = Object.assign(output, value.fields);
    const endIndex = serializeInto(buffer, output, false, index, depth + 1, serializeFunctions, true, path);
    const size = endIndex - startIndex;
    startIndex += NumberUtils.setInt32LE(buffer, index, size);
    return endIndex;
}
function serializeInto(buffer, object, checkKeys, startingIndex, depth, serializeFunctions, ignoreUndefined, path) {
    if (path == null) {
        if (object == null) {
            buffer[0] = 0x05;
            buffer[1] = 0x00;
            buffer[2] = 0x00;
            buffer[3] = 0x00;
            buffer[4] = 0x00;
            return 5;
        }
        if (Array.isArray(object)) {
            throw new BSONError('serialize does not support an array as the root input');
        }
        if (typeof object !== 'object') {
            throw new BSONError('serialize does not support non-object as the root input');
        }
        else if ('_bsontype' in object && typeof object._bsontype === 'string') {
            throw new BSONError(`BSON types cannot be serialized as a document`);
        }
        else if (isDate(object) ||
            isRegExp(object) ||
            isUint8Array(object) ||
            isAnyArrayBuffer(object)) {
            throw new BSONError(`date, regexp, typedarray, and arraybuffer cannot be BSON documents`);
        }
        path = new Set();
    }
    path.add(object);
    let index = startingIndex + 4;
    if (Array.isArray(object)) {
        for (let i = 0; i < object.length; i++) {
            const key = `${i}`;
            let value = object[i];
            if (typeof value?.toBSON === 'function') {
                value = value.toBSON();
            }
            const type = typeof value;
            if (value === undefined) {
                index = serializeNull(buffer, key, value, index);
            }
            else if (value === null) {
                index = serializeNull(buffer, key, value, index);
            }
            else if (type === 'string') {
                index = serializeString(buffer, key, value, index);
            }
            else if (type === 'number') {
                index = serializeNumber(buffer, key, value, index);
            }
            else if (type === 'bigint') {
                index = serializeBigInt(buffer, key, value, index);
            }
            else if (type === 'boolean') {
                index = serializeBoolean(buffer, key, value, index);
            }
            else if (type === 'object' && value._bsontype == null) {
                if (value instanceof Date || isDate(value)) {
                    index = serializeDate(buffer, key, value, index);
                }
                else if (value instanceof Uint8Array || isUint8Array(value)) {
                    index = serializeBuffer(buffer, key, value, index);
                }
                else if (value instanceof RegExp || isRegExp(value)) {
                    index = serializeRegExp(buffer, key, value, index);
                }
                else {
                    index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
                }
            }
            else if (type === 'object') {
                if (value[BSON_VERSION_SYMBOL] !== BSON_MAJOR_VERSION) {
                    throw new BSONVersionError();
                }
                else if (value._bsontype === 'ObjectId') {
                    index = serializeObjectId(buffer, key, value, index);
                }
                else if (value._bsontype === 'Decimal128') {
                    index = serializeDecimal128(buffer, key, value, index);
                }
                else if (value._bsontype === 'Long' || value._bsontype === 'Timestamp') {
                    index = serializeLong(buffer, key, value, index);
                }
                else if (value._bsontype === 'Double') {
                    index = serializeDouble(buffer, key, value, index);
                }
                else if (value._bsontype === 'Code') {
                    index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
                }
                else if (value._bsontype === 'Binary') {
                    index = serializeBinary(buffer, key, value, index);
                }
                else if (value._bsontype === 'BSONSymbol') {
                    index = serializeSymbol(buffer, key, value, index);
                }
                else if (value._bsontype === 'DBRef') {
                    index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions, path);
                }
                else if (value._bsontype === 'BSONRegExp') {
                    index = serializeBSONRegExp(buffer, key, value, index);
                }
                else if (value._bsontype === 'Int32') {
                    index = serializeInt32(buffer, key, value, index);
                }
                else if (value._bsontype === 'MinKey' || value._bsontype === 'MaxKey') {
                    index = serializeMinMax(buffer, key, value, index);
                }
                else if (typeof value._bsontype !== 'undefined') {
                    throw new BSONError(`Unrecognized or invalid _bsontype: ${String(value._bsontype)}`);
                }
            }
            else if (type === 'function' && serializeFunctions) {
                index = serializeFunction(buffer, key, value, index);
            }
        }
    }
    else if (object instanceof Map || isMap(object)) {
        const iterator = object.entries();
        let done = false;
        while (!done) {
            const entry = iterator.next();
            done = !!entry.done;
            if (done)
                continue;
            const key = entry.value ? entry.value[0] : undefined;
            let value = entry.value ? entry.value[1] : undefined;
            if (typeof value?.toBSON === 'function') {
                value = value.toBSON();
            }
            const type = typeof value;
            if (typeof key === 'string' && !ignoreKeys.has(key)) {
                if (key.match(regexp) != null) {
                    throw new BSONError('key ' + key + ' must not contain null bytes');
                }
                if (checkKeys) {
                    if ('$' === key[0]) {
                        throw new BSONError('key ' + key + " must not start with '$'");
                    }
                    else if (key.includes('.')) {
                        throw new BSONError('key ' + key + " must not contain '.'");
                    }
                }
            }
            if (value === undefined) {
                if (ignoreUndefined === false)
                    index = serializeNull(buffer, key, value, index);
            }
            else if (value === null) {
                index = serializeNull(buffer, key, value, index);
            }
            else if (type === 'string') {
                index = serializeString(buffer, key, value, index);
            }
            else if (type === 'number') {
                index = serializeNumber(buffer, key, value, index);
            }
            else if (type === 'bigint') {
                index = serializeBigInt(buffer, key, value, index);
            }
            else if (type === 'boolean') {
                index = serializeBoolean(buffer, key, value, index);
            }
            else if (type === 'object' && value._bsontype == null) {
                if (value instanceof Date || isDate(value)) {
                    index = serializeDate(buffer, key, value, index);
                }
                else if (value instanceof Uint8Array || isUint8Array(value)) {
                    index = serializeBuffer(buffer, key, value, index);
                }
                else if (value instanceof RegExp || isRegExp(value)) {
                    index = serializeRegExp(buffer, key, value, index);
                }
                else {
                    index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
                }
            }
            else if (type === 'object') {
                if (value[BSON_VERSION_SYMBOL] !== BSON_MAJOR_VERSION) {
                    throw new BSONVersionError();
                }
                else if (value._bsontype === 'ObjectId') {
                    index = serializeObjectId(buffer, key, value, index);
                }
                else if (value._bsontype === 'Decimal128') {
                    index = serializeDecimal128(buffer, key, value, index);
                }
                else if (value._bsontype === 'Long' || value._bsontype === 'Timestamp') {
                    index = serializeLong(buffer, key, value, index);
                }
                else if (value._bsontype === 'Double') {
                    index = serializeDouble(buffer, key, value, index);
                }
                else if (value._bsontype === 'Code') {
                    index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
                }
                else if (value._bsontype === 'Binary') {
                    index = serializeBinary(buffer, key, value, index);
                }
                else if (value._bsontype === 'BSONSymbol') {
                    index = serializeSymbol(buffer, key, value, index);
                }
                else if (value._bsontype === 'DBRef') {
                    index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions, path);
                }
                else if (value._bsontype === 'BSONRegExp') {
                    index = serializeBSONRegExp(buffer, key, value, index);
                }
                else if (value._bsontype === 'Int32') {
                    index = serializeInt32(buffer, key, value, index);
                }
                else if (value._bsontype === 'MinKey' || value._bsontype === 'MaxKey') {
                    index = serializeMinMax(buffer, key, value, index);
                }
                else if (typeof value._bsontype !== 'undefined') {
                    throw new BSONError(`Unrecognized or invalid _bsontype: ${String(value._bsontype)}`);
                }
            }
            else if (type === 'function' && serializeFunctions) {
                index = serializeFunction(buffer, key, value, index);
            }
        }
    }
    else {
        if (typeof object?.toBSON === 'function') {
            object = object.toBSON();
            if (object != null && typeof object !== 'object') {
                throw new BSONError('toBSON function did not return an object');
            }
        }
        for (const key of Object.keys(object)) {
            let value = object[key];
            if (typeof value?.toBSON === 'function') {
                value = value.toBSON();
            }
            const type = typeof value;
            if (typeof key === 'string' && !ignoreKeys.has(key)) {
                if (key.match(regexp) != null) {
                    throw new BSONError('key ' + key + ' must not contain null bytes');
                }
                if (checkKeys) {
                    if ('$' === key[0]) {
                        throw new BSONError('key ' + key + " must not start with '$'");
                    }
                    else if (key.includes('.')) {
                        throw new BSONError('key ' + key + " must not contain '.'");
                    }
                }
            }
            if (value === undefined) {
                if (ignoreUndefined === false)
                    index = serializeNull(buffer, key, value, index);
            }
            else if (value === null) {
                index = serializeNull(buffer, key, value, index);
            }
            else if (type === 'string') {
                index = serializeString(buffer, key, value, index);
            }
            else if (type === 'number') {
                index = serializeNumber(buffer, key, value, index);
            }
            else if (type === 'bigint') {
                index = serializeBigInt(buffer, key, value, index);
            }
            else if (type === 'boolean') {
                index = serializeBoolean(buffer, key, value, index);
            }
            else if (type === 'object' && value._bsontype == null) {
                if (value instanceof Date || isDate(value)) {
                    index = serializeDate(buffer, key, value, index);
                }
                else if (value instanceof Uint8Array || isUint8Array(value)) {
                    index = serializeBuffer(buffer, key, value, index);
                }
                else if (value instanceof RegExp || isRegExp(value)) {
                    index = serializeRegExp(buffer, key, value, index);
                }
                else {
                    index = serializeObject(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
                }
            }
            else if (type === 'object') {
                if (value[BSON_VERSION_SYMBOL] !== BSON_MAJOR_VERSION) {
                    throw new BSONVersionError();
                }
                else if (value._bsontype === 'ObjectId') {
                    index = serializeObjectId(buffer, key, value, index);
                }
                else if (value._bsontype === 'Decimal128') {
                    index = serializeDecimal128(buffer, key, value, index);
                }
                else if (value._bsontype === 'Long' || value._bsontype === 'Timestamp') {
                    index = serializeLong(buffer, key, value, index);
                }
                else if (value._bsontype === 'Double') {
                    index = serializeDouble(buffer, key, value, index);
                }
                else if (value._bsontype === 'Code') {
                    index = serializeCode(buffer, key, value, index, checkKeys, depth, serializeFunctions, ignoreUndefined, path);
                }
                else if (value._bsontype === 'Binary') {
                    index = serializeBinary(buffer, key, value, index);
                }
                else if (value._bsontype === 'BSONSymbol') {
                    index = serializeSymbol(buffer, key, value, index);
                }
                else if (value._bsontype === 'DBRef') {
                    index = serializeDBRef(buffer, key, value, index, depth, serializeFunctions, path);
                }
                else if (value._bsontype === 'BSONRegExp') {
                    index = serializeBSONRegExp(buffer, key, value, index);
                }
                else if (value._bsontype === 'Int32') {
                    index = serializeInt32(buffer, key, value, index);
                }
                else if (value._bsontype === 'MinKey' || value._bsontype === 'MaxKey') {
                    index = serializeMinMax(buffer, key, value, index);
                }
                else if (typeof value._bsontype !== 'undefined') {
                    throw new BSONError(`Unrecognized or invalid _bsontype: ${String(value._bsontype)}`);
                }
            }
            else if (type === 'function' && serializeFunctions) {
                index = serializeFunction(buffer, key, value, index);
            }
        }
    }
    path.delete(object);
    buffer[index++] = 0x00;
    const size = index - startingIndex;
    startingIndex += NumberUtils.setInt32LE(buffer, startingIndex, size);
    return index;
}

function isBSONType(value) {
    return (value != null &&
        typeof value === 'object' &&
        '_bsontype' in value &&
        typeof value._bsontype === 'string');
}
const keysToCodecs = {
    $oid: ObjectId,
    $binary: Binary,
    $uuid: Binary,
    $symbol: BSONSymbol,
    $numberInt: Int32,
    $numberDecimal: Decimal128,
    $numberDouble: Double,
    $numberLong: Long,
    $minKey: MinKey,
    $maxKey: MaxKey,
    $regex: BSONRegExp,
    $regularExpression: BSONRegExp,
    $timestamp: Timestamp
};
function deserializeValue(value, options = {}) {
    if (typeof value === 'number') {
        const in32BitRange = value <= BSON_INT32_MAX && value >= BSON_INT32_MIN;
        const in64BitRange = value <= BSON_INT64_MAX && value >= BSON_INT64_MIN;
        if (options.relaxed || options.legacy) {
            return value;
        }
        if (Number.isInteger(value) && !Object.is(value, -0)) {
            if (in32BitRange) {
                return new Int32(value);
            }
            if (in64BitRange) {
                if (options.useBigInt64) {
                    return BigInt(value);
                }
                return Long.fromNumber(value);
            }
        }
        return new Double(value);
    }
    if (value == null || typeof value !== 'object')
        return value;
    if (value.$undefined)
        return null;
    const keys = Object.keys(value).filter(k => k.startsWith('$') && value[k] != null);
    for (let i = 0; i < keys.length; i++) {
        const c = keysToCodecs[keys[i]];
        if (c)
            return c.fromExtendedJSON(value, options);
    }
    if (value.$date != null) {
        const d = value.$date;
        const date = new Date();
        if (options.legacy) {
            if (typeof d === 'number')
                date.setTime(d);
            else if (typeof d === 'string')
                date.setTime(Date.parse(d));
            else if (typeof d === 'bigint')
                date.setTime(Number(d));
            else
                throw new BSONRuntimeError(`Unrecognized type for EJSON date: ${typeof d}`);
        }
        else {
            if (typeof d === 'string')
                date.setTime(Date.parse(d));
            else if (Long.isLong(d))
                date.setTime(d.toNumber());
            else if (typeof d === 'number' && options.relaxed)
                date.setTime(d);
            else if (typeof d === 'bigint')
                date.setTime(Number(d));
            else
                throw new BSONRuntimeError(`Unrecognized type for EJSON date: ${typeof d}`);
        }
        return date;
    }
    if (value.$code != null) {
        const copy = Object.assign({}, value);
        if (value.$scope) {
            copy.$scope = deserializeValue(value.$scope);
        }
        return Code.fromExtendedJSON(value);
    }
    if (isDBRefLike(value) || value.$dbPointer) {
        const v = value.$ref ? value : value.$dbPointer;
        if (v instanceof DBRef)
            return v;
        const dollarKeys = Object.keys(v).filter(k => k.startsWith('$'));
        let valid = true;
        dollarKeys.forEach(k => {
            if (['$ref', '$id', '$db'].indexOf(k) === -1)
                valid = false;
        });
        if (valid)
            return DBRef.fromExtendedJSON(v);
    }
    return value;
}
function serializeArray(array, options) {
    return array.map((v, index) => {
        options.seenObjects.push({ propertyName: `index ${index}`, obj: null });
        try {
            return serializeValue(v, options);
        }
        finally {
            options.seenObjects.pop();
        }
    });
}
function getISOString(date) {
    const isoStr = date.toISOString();
    return date.getUTCMilliseconds() !== 0 ? isoStr : isoStr.slice(0, -5) + 'Z';
}
function serializeValue(value, options) {
    if (value instanceof Map || isMap(value)) {
        const obj = Object.create(null);
        for (const [k, v] of value) {
            if (typeof k !== 'string') {
                throw new BSONError('Can only serialize maps with string keys');
            }
            obj[k] = v;
        }
        return serializeValue(obj, options);
    }
    if ((typeof value === 'object' || typeof value === 'function') && value !== null) {
        const index = options.seenObjects.findIndex(entry => entry.obj === value);
        if (index !== -1) {
            const props = options.seenObjects.map(entry => entry.propertyName);
            const leadingPart = props
                .slice(0, index)
                .map(prop => `${prop} -> `)
                .join('');
            const alreadySeen = props[index];
            const circularPart = ' -> ' +
                props
                    .slice(index + 1, props.length - 1)
                    .map(prop => `${prop} -> `)
                    .join('');
            const current = props[props.length - 1];
            const leadingSpace = ' '.repeat(leadingPart.length + alreadySeen.length / 2);
            const dashes = '-'.repeat(circularPart.length + (alreadySeen.length + current.length) / 2 - 1);
            throw new BSONError('Converting circular structure to EJSON:\n' +
                `    ${leadingPart}${alreadySeen}${circularPart}${current}\n` +
                `    ${leadingSpace}\\${dashes}/`);
        }
        options.seenObjects[options.seenObjects.length - 1].obj = value;
    }
    if (Array.isArray(value))
        return serializeArray(value, options);
    if (value === undefined)
        return null;
    if (value instanceof Date || isDate(value)) {
        const dateNum = value.getTime(), inRange = dateNum > -1 && dateNum < 253402318800000;
        if (options.legacy) {
            return options.relaxed && inRange
                ? { $date: value.getTime() }
                : { $date: getISOString(value) };
        }
        return options.relaxed && inRange
            ? { $date: getISOString(value) }
            : { $date: { $numberLong: value.getTime().toString() } };
    }
    if (typeof value === 'number' && (!options.relaxed || !isFinite(value))) {
        if (Number.isInteger(value) && !Object.is(value, -0)) {
            if (value >= BSON_INT32_MIN && value <= BSON_INT32_MAX) {
                return { $numberInt: value.toString() };
            }
            if (value >= BSON_INT64_MIN && value <= BSON_INT64_MAX) {
                return { $numberLong: value.toString() };
            }
        }
        return { $numberDouble: Object.is(value, -0) ? '-0.0' : value.toString() };
    }
    if (typeof value === 'bigint') {
        if (!options.relaxed) {
            return { $numberLong: BigInt.asIntN(64, value).toString() };
        }
        return Number(BigInt.asIntN(64, value));
    }
    if (value instanceof RegExp || isRegExp(value)) {
        let flags = value.flags;
        if (flags === undefined) {
            const match = value.toString().match(/[gimuy]*$/);
            if (match) {
                flags = match[0];
            }
        }
        const rx = new BSONRegExp(value.source, flags);
        return rx.toExtendedJSON(options);
    }
    if (value != null && typeof value === 'object')
        return serializeDocument(value, options);
    return value;
}
const BSON_TYPE_MAPPINGS = {
    Binary: (o) => new Binary(o.value(), o.sub_type),
    Code: (o) => new Code(o.code, o.scope),
    DBRef: (o) => new DBRef(o.collection || o.namespace, o.oid, o.db, o.fields),
    Decimal128: (o) => new Decimal128(o.bytes),
    Double: (o) => new Double(o.value),
    Int32: (o) => new Int32(o.value),
    Long: (o) => Long.fromBits(o.low != null ? o.low : o.low_, o.low != null ? o.high : o.high_, o.low != null ? o.unsigned : o.unsigned_),
    MaxKey: () => new MaxKey(),
    MinKey: () => new MinKey(),
    ObjectId: (o) => new ObjectId(o),
    BSONRegExp: (o) => new BSONRegExp(o.pattern, o.options),
    BSONSymbol: (o) => new BSONSymbol(o.value),
    Timestamp: (o) => Timestamp.fromBits(o.low, o.high)
};
function serializeDocument(doc, options) {
    if (doc == null || typeof doc !== 'object')
        throw new BSONError('not an object instance');
    const bsontype = doc._bsontype;
    if (typeof bsontype === 'undefined') {
        const _doc = {};
        for (const name of Object.keys(doc)) {
            options.seenObjects.push({ propertyName: name, obj: null });
            try {
                const value = serializeValue(doc[name], options);
                if (name === '__proto__') {
                    Object.defineProperty(_doc, name, {
                        value,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    });
                }
                else {
                    _doc[name] = value;
                }
            }
            finally {
                options.seenObjects.pop();
            }
        }
        return _doc;
    }
    else if (doc != null &&
        typeof doc === 'object' &&
        typeof doc._bsontype === 'string' &&
        doc[BSON_VERSION_SYMBOL] !== BSON_MAJOR_VERSION) {
        throw new BSONVersionError();
    }
    else if (isBSONType(doc)) {
        let outDoc = doc;
        if (typeof outDoc.toExtendedJSON !== 'function') {
            const mapper = BSON_TYPE_MAPPINGS[doc._bsontype];
            if (!mapper) {
                throw new BSONError('Unrecognized or invalid _bsontype: ' + doc._bsontype);
            }
            outDoc = mapper(outDoc);
        }
        if (bsontype === 'Code' && outDoc.scope) {
            outDoc = new Code(outDoc.code, serializeValue(outDoc.scope, options));
        }
        else if (bsontype === 'DBRef' && outDoc.oid) {
            outDoc = new DBRef(serializeValue(outDoc.collection, options), serializeValue(outDoc.oid, options), serializeValue(outDoc.db, options), serializeValue(outDoc.fields, options));
        }
        return outDoc.toExtendedJSON(options);
    }
    else {
        throw new BSONError('_bsontype must be a string, but was: ' + typeof bsontype);
    }
}
function parse(text, options) {
    const ejsonOptions = {
        useBigInt64: options?.useBigInt64 ?? false,
        relaxed: options?.relaxed ?? true,
        legacy: options?.legacy ?? false
    };
    return JSON.parse(text, (key, value) => {
        if (key.indexOf('\x00') !== -1) {
            throw new BSONError(`BSON Document field names cannot contain null bytes, found: ${JSON.stringify(key)}`);
        }
        return deserializeValue(value, ejsonOptions);
    });
}
function stringify(value, replacer, space, options) {
    if (space != null && typeof space === 'object') {
        options = space;
        space = 0;
    }
    if (replacer != null && typeof replacer === 'object' && !Array.isArray(replacer)) {
        options = replacer;
        replacer = undefined;
        space = 0;
    }
    const serializeOptions = Object.assign({ relaxed: true, legacy: false }, options, {
        seenObjects: [{ propertyName: '(root)', obj: null }]
    });
    const doc = serializeValue(value, serializeOptions);
    return JSON.stringify(doc, replacer, space);
}
function EJSONserialize(value, options) {
    options = options || {};
    return JSON.parse(stringify(value, options));
}
function EJSONdeserialize(ejson, options) {
    options = options || {};
    return parse(JSON.stringify(ejson), options);
}
const EJSON = Object.create(null);
EJSON.parse = parse;
EJSON.stringify = stringify;
EJSON.serialize = EJSONserialize;
EJSON.deserialize = EJSONdeserialize;
Object.freeze(EJSON);

const BSONElementType = {
    double: 1,
    string: 2,
    object: 3,
    array: 4,
    binData: 5,
    undefined: 6,
    objectId: 7,
    bool: 8,
    date: 9,
    null: 10,
    regex: 11,
    dbPointer: 12,
    javascript: 13,
    symbol: 14,
    javascriptWithScope: 15,
    int: 16,
    timestamp: 17,
    long: 18,
    decimal: 19,
    minKey: 255,
    maxKey: 127
};
function getSize(source, offset) {
    try {
        return NumberUtils.getNonnegativeInt32LE(source, offset);
    }
    catch (cause) {
        throw new BSONOffsetError('BSON size cannot be negative', offset, { cause });
    }
}
function findNull(bytes, offset) {
    let nullTerminatorOffset = offset;
    for (; bytes[nullTerminatorOffset] !== 0x00; nullTerminatorOffset++)
        ;
    if (nullTerminatorOffset === bytes.length - 1) {
        throw new BSONOffsetError('Null terminator not found', offset);
    }
    return nullTerminatorOffset;
}
function parseToElements(bytes, startOffset = 0) {
    startOffset ??= 0;
    if (bytes.length < 5) {
        throw new BSONOffsetError(`Input must be at least 5 bytes, got ${bytes.length} bytes`, startOffset);
    }
    const documentSize = getSize(bytes, startOffset);
    if (documentSize > bytes.length - startOffset) {
        throw new BSONOffsetError(`Parsed documentSize (${documentSize} bytes) does not match input length (${bytes.length} bytes)`, startOffset);
    }
    if (bytes[startOffset + documentSize - 1] !== 0x00) {
        throw new BSONOffsetError('BSON documents must end in 0x00', startOffset + documentSize);
    }
    const elements = [];
    let offset = startOffset + 4;
    while (offset <= documentSize + startOffset) {
        const type = bytes[offset];
        offset += 1;
        if (type === 0) {
            if (offset - startOffset !== documentSize) {
                throw new BSONOffsetError(`Invalid 0x00 type byte`, offset);
            }
            break;
        }
        const nameOffset = offset;
        const nameLength = findNull(bytes, offset) - nameOffset;
        offset += nameLength + 1;
        let length;
        if (type === BSONElementType.double ||
            type === BSONElementType.long ||
            type === BSONElementType.date ||
            type === BSONElementType.timestamp) {
            length = 8;
        }
        else if (type === BSONElementType.int) {
            length = 4;
        }
        else if (type === BSONElementType.objectId) {
            length = 12;
        }
        else if (type === BSONElementType.decimal) {
            length = 16;
        }
        else if (type === BSONElementType.bool) {
            length = 1;
        }
        else if (type === BSONElementType.null ||
            type === BSONElementType.undefined ||
            type === BSONElementType.maxKey ||
            type === BSONElementType.minKey) {
            length = 0;
        }
        else if (type === BSONElementType.regex) {
            length = findNull(bytes, findNull(bytes, offset) + 1) + 1 - offset;
        }
        else if (type === BSONElementType.object ||
            type === BSONElementType.array ||
            type === BSONElementType.javascriptWithScope) {
            length = getSize(bytes, offset);
        }
        else if (type === BSONElementType.string ||
            type === BSONElementType.binData ||
            type === BSONElementType.dbPointer ||
            type === BSONElementType.javascript ||
            type === BSONElementType.symbol) {
            length = getSize(bytes, offset) + 4;
            if (type === BSONElementType.binData) {
                length += 1;
            }
            if (type === BSONElementType.dbPointer) {
                length += 12;
            }
        }
        else {
            throw new BSONOffsetError(`Invalid 0x${type.toString(16).padStart(2, '0')} type byte`, offset);
        }
        if (length > documentSize) {
            throw new BSONOffsetError('value reports length larger than document', offset);
        }
        elements.push([type, nameOffset, nameLength, offset, length]);
        offset += length;
    }
    return elements;
}

const onDemand = Object.create(null);
onDemand.parseToElements = parseToElements;
onDemand.ByteUtils = ByteUtils;
onDemand.NumberUtils = NumberUtils;
Object.freeze(onDemand);

const MAXSIZE = 1024 * 1024 * 17;
let buffer = ByteUtils.allocate(MAXSIZE);
function setInternalBufferSize(size) {
    if (buffer.length < size) {
        buffer = ByteUtils.allocate(size);
    }
}
function serialize(object, options = {}) {
    const checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
    const serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
    const ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
    const minInternalBufferSize = typeof options.minInternalBufferSize === 'number' ? options.minInternalBufferSize : MAXSIZE;
    if (buffer.length < minInternalBufferSize) {
        buffer = ByteUtils.allocate(minInternalBufferSize);
    }
    const serializationIndex = serializeInto(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, null);
    const finishedBuffer = ByteUtils.allocateUnsafe(serializationIndex);
    finishedBuffer.set(buffer.subarray(0, serializationIndex), 0);
    return finishedBuffer;
}
function serializeWithBufferAndIndex(object, finalBuffer, options = {}) {
    const checkKeys = typeof options.checkKeys === 'boolean' ? options.checkKeys : false;
    const serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
    const ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
    const startIndex = typeof options.index === 'number' ? options.index : 0;
    const serializationIndex = serializeInto(buffer, object, checkKeys, 0, 0, serializeFunctions, ignoreUndefined, null);
    finalBuffer.set(buffer.subarray(0, serializationIndex), startIndex);
    return startIndex + serializationIndex - 1;
}
function deserialize(buffer, options = {}) {
    return internalDeserialize(ByteUtils.toLocalBufferType(buffer), options);
}
function calculateObjectSize(object, options = {}) {
    options = options || {};
    const serializeFunctions = typeof options.serializeFunctions === 'boolean' ? options.serializeFunctions : false;
    const ignoreUndefined = typeof options.ignoreUndefined === 'boolean' ? options.ignoreUndefined : true;
    return internalCalculateObjectSize(object, serializeFunctions, ignoreUndefined);
}
function deserializeStream(data, startIndex, numberOfDocuments, documents, docStartIndex, options) {
    const internalOptions = Object.assign({ allowObjectSmallerThanBufferSize: true, index: 0 }, options);
    const bufferData = ByteUtils.toLocalBufferType(data);
    let index = startIndex;
    for (let i = 0; i < numberOfDocuments; i++) {
        const size = NumberUtils.getInt32LE(bufferData, index);
        internalOptions.index = index;
        documents[docStartIndex + i] = internalDeserialize(bufferData, internalOptions);
        index = index + size;
    }
    return index;
}

var bson = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BSONError: BSONError,
    BSONOffsetError: BSONOffsetError,
    BSONRegExp: BSONRegExp,
    BSONRuntimeError: BSONRuntimeError,
    BSONSymbol: BSONSymbol,
    BSONType: BSONType,
    BSONValue: BSONValue,
    BSONVersionError: BSONVersionError,
    Binary: Binary,
    Code: Code,
    DBRef: DBRef,
    Decimal128: Decimal128,
    Double: Double,
    EJSON: EJSON,
    Int32: Int32,
    Long: Long,
    MaxKey: MaxKey,
    MinKey: MinKey,
    ObjectId: ObjectId,
    Timestamp: Timestamp,
    UUID: UUID,
    calculateObjectSize: calculateObjectSize,
    deserialize: deserialize,
    deserializeStream: deserializeStream,
    onDemand: onDemand,
    serialize: serialize,
    serializeWithBufferAndIndex: serializeWithBufferAndIndex,
    setInternalBufferSize: setInternalBufferSize
});

function pDefer() {
	const deferred = {};

	deferred.promise = new Promise((resolve, reject) => {
		deferred.resolve = resolve;
		deferred.reject = reject;
	});

	return deferred;
}

// ported from https://www.npmjs.com/package/fast-fifo
class FixedFIFO {
    buffer;
    mask;
    top;
    btm;
    next;
    constructor(hwm) {
        if (!(hwm > 0) || ((hwm - 1) & hwm) !== 0) {
            throw new Error('Max size for a FixedFIFO should be a power of two');
        }
        this.buffer = new Array(hwm);
        this.mask = hwm - 1;
        this.top = 0;
        this.btm = 0;
        this.next = null;
    }
    push(data) {
        if (this.buffer[this.top] !== undefined) {
            return false;
        }
        this.buffer[this.top] = data;
        this.top = (this.top + 1) & this.mask;
        return true;
    }
    shift() {
        const last = this.buffer[this.btm];
        if (last === undefined) {
            return undefined;
        }
        this.buffer[this.btm] = undefined;
        this.btm = (this.btm + 1) & this.mask;
        return last;
    }
    isEmpty() {
        return this.buffer[this.btm] === undefined;
    }
}
class FIFO {
    size;
    hwm;
    head;
    tail;
    constructor(options = {}) {
        this.hwm = options.splitLimit ?? 16;
        this.head = new FixedFIFO(this.hwm);
        this.tail = this.head;
        this.size = 0;
    }
    calculateSize(obj) {
        if (obj?.byteLength != null) {
            return obj.byteLength;
        }
        return 1;
    }
    push(val) {
        if (val?.value != null) {
            this.size += this.calculateSize(val.value);
        }
        if (!this.head.push(val)) {
            const prev = this.head;
            this.head = prev.next = new FixedFIFO(2 * this.head.buffer.length);
            this.head.push(val);
        }
    }
    shift() {
        let val = this.tail.shift();
        if (val === undefined && (this.tail.next != null)) {
            const next = this.tail.next;
            this.tail.next = null;
            this.tail = next;
            val = this.tail.shift();
        }
        if (val?.value != null) {
            this.size -= this.calculateSize(val.value);
        }
        return val;
    }
    isEmpty() {
        return this.head.isEmpty();
    }
}

/**
 * @packageDocumentation
 *
 * An iterable that you can push values into.
 *
 * @example
 *
 * ```js
 * import { pushable } from 'it-pushable'
 *
 * const source = pushable()
 *
 * setTimeout(() => source.push('hello'), 100)
 * setTimeout(() => source.push('world'), 200)
 * setTimeout(() => source.end(), 300)
 *
 * const start = Date.now()
 *
 * for await (const value of source) {
 *   console.log(`got "${value}" after ${Date.now() - start}ms`)
 * }
 * console.log(`done after ${Date.now() - start}ms`)
 *
 * // Output:
 * // got "hello" after 105ms
 * // got "world" after 207ms
 * // done after 309ms
 * ```
 *
 * @example
 *
 * ```js
 * import { pushableV } from 'it-pushable'
 * import all from 'it-all'
 *
 * const source = pushableV()
 *
 * source.push(1)
 * source.push(2)
 * source.push(3)
 * source.end()
 *
 * console.info(await all(source))
 *
 * // Output:
 * // [ [1, 2, 3] ]
 * ```
 */
let AbortError$1 = class AbortError extends Error {
    type;
    code;
    constructor(message, code) {
        super(message ?? 'The operation was aborted');
        this.type = 'aborted';
        this.code = code ?? 'ABORT_ERR';
    }
};
function pushable(options = {}) {
    const getNext = (buffer) => {
        const next = buffer.shift();
        if (next == null) {
            return { done: true };
        }
        if (next.error != null) {
            throw next.error;
        }
        return {
            done: next.done === true,
            // @ts-expect-error if done is false, value will be present
            value: next.value
        };
    };
    return _pushable(getNext, options);
}
function _pushable(getNext, options) {
    options = options ?? {};
    let onEnd = options.onEnd;
    let buffer = new FIFO();
    let pushable;
    let onNext;
    let ended;
    let drain = pDefer();
    const waitNext = async () => {
        try {
            if (!buffer.isEmpty()) {
                return getNext(buffer);
            }
            if (ended) {
                return { done: true };
            }
            return await new Promise((resolve, reject) => {
                onNext = (next) => {
                    onNext = null;
                    buffer.push(next);
                    try {
                        resolve(getNext(buffer));
                    }
                    catch (err) {
                        reject(err);
                    }
                    return pushable;
                };
            });
        }
        finally {
            if (buffer.isEmpty()) {
                // settle promise in the microtask queue to give consumers a chance to
                // await after calling .push
                queueMicrotask(() => {
                    drain.resolve();
                    drain = pDefer();
                });
            }
        }
    };
    const bufferNext = (next) => {
        if (onNext != null) {
            return onNext(next);
        }
        buffer.push(next);
        return pushable;
    };
    const bufferError = (err) => {
        buffer = new FIFO();
        if (onNext != null) {
            return onNext({ error: err });
        }
        buffer.push({ error: err });
        return pushable;
    };
    const push = (value) => {
        if (ended) {
            return pushable;
        }
        // @ts-expect-error `byteLength` is not declared on PushType
        if (options?.objectMode !== true && value?.byteLength == null) {
            throw new Error('objectMode was not true but tried to push non-Uint8Array value');
        }
        return bufferNext({ done: false, value });
    };
    const end = (err) => {
        if (ended)
            return pushable;
        ended = true;
        return (err != null) ? bufferError(err) : bufferNext({ done: true });
    };
    const _return = () => {
        buffer = new FIFO();
        end();
        return { done: true };
    };
    const _throw = (err) => {
        end(err);
        return { done: true };
    };
    pushable = {
        [Symbol.asyncIterator]() { return this; },
        next: waitNext,
        return: _return,
        throw: _throw,
        push,
        end,
        get readableLength() {
            return buffer.size;
        },
        onEmpty: async (options) => {
            const signal = options?.signal;
            signal?.throwIfAborted();
            if (buffer.isEmpty()) {
                return;
            }
            let cancel;
            let listener;
            if (signal != null) {
                cancel = new Promise((resolve, reject) => {
                    listener = () => {
                        reject(new AbortError$1());
                    };
                    signal.addEventListener('abort', listener);
                });
            }
            try {
                await Promise.race([
                    drain.promise,
                    cancel
                ]);
            }
            finally {
                if (listener != null && signal != null) {
                    signal?.removeEventListener('abort', listener);
                }
            }
        }
    };
    if (onEnd == null) {
        return pushable;
    }
    const _pushable = pushable;
    pushable = {
        [Symbol.asyncIterator]() { return this; },
        next() {
            return _pushable.next();
        },
        throw(err) {
            _pushable.throw(err);
            if (onEnd != null) {
                onEnd(err);
                onEnd = undefined;
            }
            return { done: true };
        },
        return() {
            _pushable.return();
            if (onEnd != null) {
                onEnd();
                onEnd = undefined;
            }
            return { done: true };
        },
        push,
        end(err) {
            _pushable.end(err);
            if (onEnd != null) {
                onEnd(err);
                onEnd = undefined;
            }
            return pushable;
        },
        get readableLength() {
            return _pushable.readableLength;
        },
        onEmpty: (opts) => {
            return _pushable.onEmpty(opts);
        }
    };
    return pushable;
}

/**
 * Returns a `Uint8Array` of the requested size. Referenced memory will
 * be initialized to 0.
 */
function alloc(size = 0) {
    return new Uint8Array(size);
}
/**
 * Where possible returns a Uint8Array of the requested size that references
 * uninitialized memory. Only use if you are certain you will immediately
 * overwrite every value in the returned `Uint8Array`.
 */
function allocUnsafe(size = 0) {
    return new Uint8Array(size);
}

/* eslint-disable no-fallthrough */
const N1$1 = Math.pow(2, 7);
const N2$1 = Math.pow(2, 14);
const N3$1 = Math.pow(2, 21);
const N4$1 = Math.pow(2, 28);
const N5$1 = Math.pow(2, 35);
const N6$1 = Math.pow(2, 42);
const N7$1 = Math.pow(2, 49);
/** Most significant bit of a byte */
const MSB$2 = 0x80;
/** Rest of the bits in a byte */
const REST = 0x7f;
function encodingLength$1(value) {
    if (value < N1$1) {
        return 1;
    }
    if (value < N2$1) {
        return 2;
    }
    if (value < N3$1) {
        return 3;
    }
    if (value < N4$1) {
        return 4;
    }
    if (value < N5$1) {
        return 5;
    }
    if (value < N6$1) {
        return 6;
    }
    if (value < N7$1) {
        return 7;
    }
    if (Number.MAX_SAFE_INTEGER != null && value > Number.MAX_SAFE_INTEGER) {
        throw new RangeError('Could not encode varint');
    }
    return 8;
}
function encodeUint8Array(value, buf, offset = 0) {
    switch (encodingLength$1(value)) {
        case 8: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value /= 128;
        }
        case 7: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value /= 128;
        }
        case 6: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value /= 128;
        }
        case 5: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value /= 128;
        }
        case 4: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value >>>= 7;
        }
        case 3: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value >>>= 7;
        }
        case 2: {
            buf[offset++] = (value & 0xFF) | MSB$2;
            value >>>= 7;
        }
        case 1: {
            buf[offset++] = (value & 0xFF);
            value >>>= 7;
            break;
        }
        default: throw new Error('unreachable');
    }
    return buf;
}
function encodeUint8ArrayList(value, buf, offset = 0) {
    switch (encodingLength$1(value)) {
        case 8: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value /= 128;
        }
        case 7: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value /= 128;
        }
        case 6: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value /= 128;
        }
        case 5: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value /= 128;
        }
        case 4: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value >>>= 7;
        }
        case 3: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value >>>= 7;
        }
        case 2: {
            buf.set(offset++, (value & 0xFF) | MSB$2);
            value >>>= 7;
        }
        case 1: {
            buf.set(offset++, (value & 0xFF));
            value >>>= 7;
            break;
        }
        default: throw new Error('unreachable');
    }
    return buf;
}
function decodeUint8Array(buf, offset) {
    let b = buf[offset];
    let res = 0;
    res += b & REST;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 1];
    res += (b & REST) << 7;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 2];
    res += (b & REST) << 14;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 3];
    res += (b & REST) << 21;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 4];
    res += (b & REST) * N4$1;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 5];
    res += (b & REST) * N5$1;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 6];
    res += (b & REST) * N6$1;
    if (b < MSB$2) {
        return res;
    }
    b = buf[offset + 7];
    res += (b & REST) * N7$1;
    if (b < MSB$2) {
        return res;
    }
    throw new RangeError('Could not decode varint');
}
function decodeUint8ArrayList(buf, offset) {
    let b = buf.get(offset);
    let res = 0;
    res += b & REST;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 1);
    res += (b & REST) << 7;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 2);
    res += (b & REST) << 14;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 3);
    res += (b & REST) << 21;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 4);
    res += (b & REST) * N4$1;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 5);
    res += (b & REST) * N5$1;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 6);
    res += (b & REST) * N6$1;
    if (b < MSB$2) {
        return res;
    }
    b = buf.get(offset + 7);
    res += (b & REST) * N7$1;
    if (b < MSB$2) {
        return res;
    }
    throw new RangeError('Could not decode varint');
}
function encode$4(value, buf, offset = 0) {
    if (buf == null) {
        buf = allocUnsafe(encodingLength$1(value));
    }
    if (buf instanceof Uint8Array) {
        return encodeUint8Array(value, buf, offset);
    }
    else {
        return encodeUint8ArrayList(value, buf, offset);
    }
}
function decode$6(buf, offset = 0) {
    if (buf instanceof Uint8Array) {
        return decodeUint8Array(buf, offset);
    }
    else {
        return decodeUint8ArrayList(buf, offset);
    }
}

/**
 * To guarantee Uint8Array semantics, convert nodejs Buffers
 * into vanilla Uint8Arrays
 */
function asUint8Array(buf) {
    return buf;
}

/**
 * Returns a new Uint8Array created by concatenating the passed Uint8Arrays
 */
function concat(arrays, length) {
    if (length == null) {
        length = arrays.reduce((acc, curr) => acc + curr.length, 0);
    }
    const output = allocUnsafe(length);
    let offset = 0;
    for (const arr of arrays) {
        output.set(arr, offset);
        offset += arr.length;
    }
    return asUint8Array(output);
}

/**
 * Returns true if the two passed Uint8Arrays have the same content
 */
function equals$2(a, b) {
    if (a === b) {
        return true;
    }
    if (a.byteLength !== b.byteLength) {
        return false;
    }
    for (let i = 0; i < a.byteLength; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

/**
 * @packageDocumentation
 *
 * A class that lets you do operations over a list of Uint8Arrays without
 * copying them.
 *
 * ```js
 * import { Uint8ArrayList } from 'uint8arraylist'
 *
 * const list = new Uint8ArrayList()
 * list.append(Uint8Array.from([0, 1, 2]))
 * list.append(Uint8Array.from([3, 4, 5]))
 *
 * list.subarray()
 * // -> Uint8Array([0, 1, 2, 3, 4, 5])
 *
 * list.consume(3)
 * list.subarray()
 * // -> Uint8Array([3, 4, 5])
 *
 * // you can also iterate over the list
 * for (const buf of list) {
 *   // ..do something with `buf`
 * }
 *
 * list.subarray(0, 1)
 * // -> Uint8Array([0])
 * ```
 *
 * ## Converting Uint8ArrayLists to Uint8Arrays
 *
 * There are two ways to turn a `Uint8ArrayList` into a `Uint8Array` - `.slice` and `.subarray` and one way to turn a `Uint8ArrayList` into a `Uint8ArrayList` with different contents - `.sublist`.
 *
 * ### slice
 *
 * Slice follows the same semantics as [Uint8Array.slice](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/slice) in that it creates a new `Uint8Array` and copies bytes into it using an optional offset & length.
 *
 * ```js
 * const list = new Uint8ArrayList()
 * list.append(Uint8Array.from([0, 1, 2]))
 * list.append(Uint8Array.from([3, 4, 5]))
 *
 * list.slice(0, 1)
 * // -> Uint8Array([0])
 * ```
 *
 * ### subarray
 *
 * Subarray attempts to follow the same semantics as [Uint8Array.subarray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray/subarray) with one important different - this is a no-copy operation, unless the requested bytes span two internal buffers in which case it is a copy operation.
 *
 * ```js
 * const list = new Uint8ArrayList()
 * list.append(Uint8Array.from([0, 1, 2]))
 * list.append(Uint8Array.from([3, 4, 5]))
 *
 * list.subarray(0, 1)
 * // -> Uint8Array([0]) - no-copy
 *
 * list.subarray(2, 5)
 * // -> Uint8Array([2, 3, 4]) - copy
 * ```
 *
 * ### sublist
 *
 * Sublist creates and returns a new `Uint8ArrayList` that shares the underlying buffers with the original so is always a no-copy operation.
 *
 * ```js
 * const list = new Uint8ArrayList()
 * list.append(Uint8Array.from([0, 1, 2]))
 * list.append(Uint8Array.from([3, 4, 5]))
 *
 * list.sublist(0, 1)
 * // -> Uint8ArrayList([0]) - no-copy
 *
 * list.sublist(2, 5)
 * // -> Uint8ArrayList([2], [3, 4]) - no-copy
 * ```
 *
 * ## Inspiration
 *
 * Borrows liberally from [bl](https://www.npmjs.com/package/bl) but only uses native JS types.
 */
const symbol$1 = Symbol.for('@achingbrain/uint8arraylist');
function findBufAndOffset(bufs, index) {
    if (index == null || index < 0) {
        throw new RangeError('index is out of bounds');
    }
    let offset = 0;
    for (const buf of bufs) {
        const bufEnd = offset + buf.byteLength;
        if (index < bufEnd) {
            return {
                buf,
                index: index - offset
            };
        }
        offset = bufEnd;
    }
    throw new RangeError('index is out of bounds');
}
/**
 * Check if object is a CID instance
 *
 * @example
 *
 * ```js
 * import { isUint8ArrayList, Uint8ArrayList } from 'uint8arraylist'
 *
 * isUint8ArrayList(true) // false
 * isUint8ArrayList([]) // false
 * isUint8ArrayList(new Uint8ArrayList()) // true
 * ```
 */
function isUint8ArrayList(value) {
    return Boolean(value?.[symbol$1]);
}
class Uint8ArrayList {
    bufs;
    length;
    [symbol$1] = true;
    constructor(...data) {
        this.bufs = [];
        this.length = 0;
        if (data.length > 0) {
            this.appendAll(data);
        }
    }
    *[Symbol.iterator]() {
        yield* this.bufs;
    }
    get byteLength() {
        return this.length;
    }
    /**
     * Add one or more `bufs` to the end of this Uint8ArrayList
     */
    append(...bufs) {
        this.appendAll(bufs);
    }
    /**
     * Add all `bufs` to the end of this Uint8ArrayList
     */
    appendAll(bufs) {
        let length = 0;
        for (const buf of bufs) {
            if (buf instanceof Uint8Array) {
                length += buf.byteLength;
                this.bufs.push(buf);
            }
            else if (isUint8ArrayList(buf)) {
                length += buf.byteLength;
                this.bufs.push(...buf.bufs);
            }
            else {
                throw new Error('Could not append value, must be an Uint8Array or a Uint8ArrayList');
            }
        }
        this.length += length;
    }
    /**
     * Add one or more `bufs` to the start of this Uint8ArrayList
     */
    prepend(...bufs) {
        this.prependAll(bufs);
    }
    /**
     * Add all `bufs` to the start of this Uint8ArrayList
     */
    prependAll(bufs) {
        let length = 0;
        for (const buf of bufs.reverse()) {
            if (buf instanceof Uint8Array) {
                length += buf.byteLength;
                this.bufs.unshift(buf);
            }
            else if (isUint8ArrayList(buf)) {
                length += buf.byteLength;
                this.bufs.unshift(...buf.bufs);
            }
            else {
                throw new Error('Could not prepend value, must be an Uint8Array or a Uint8ArrayList');
            }
        }
        this.length += length;
    }
    /**
     * Read the value at `index`
     */
    get(index) {
        const res = findBufAndOffset(this.bufs, index);
        return res.buf[res.index];
    }
    /**
     * Set the value at `index` to `value`
     */
    set(index, value) {
        const res = findBufAndOffset(this.bufs, index);
        res.buf[res.index] = value;
    }
    /**
     * Copy bytes from `buf` to the index specified by `offset`
     */
    write(buf, offset = 0) {
        if (buf instanceof Uint8Array) {
            for (let i = 0; i < buf.length; i++) {
                this.set(offset + i, buf[i]);
            }
        }
        else if (isUint8ArrayList(buf)) {
            for (let i = 0; i < buf.length; i++) {
                this.set(offset + i, buf.get(i));
            }
        }
        else {
            throw new Error('Could not write value, must be an Uint8Array or a Uint8ArrayList');
        }
    }
    /**
     * Remove bytes from the front of the pool
     */
    consume(bytes) {
        // first, normalize the argument, in accordance with how Buffer does it
        bytes = Math.trunc(bytes);
        // do nothing if not a positive number
        if (Number.isNaN(bytes) || bytes <= 0) {
            return;
        }
        // if consuming all bytes, skip iterating
        if (bytes === this.byteLength) {
            this.bufs = [];
            this.length = 0;
            return;
        }
        while (this.bufs.length > 0) {
            if (bytes >= this.bufs[0].byteLength) {
                bytes -= this.bufs[0].byteLength;
                this.length -= this.bufs[0].byteLength;
                this.bufs.shift();
            }
            else {
                this.bufs[0] = this.bufs[0].subarray(bytes);
                this.length -= bytes;
                break;
            }
        }
    }
    /**
     * Extracts a section of an array and returns a new array.
     *
     * This is a copy operation as it is with Uint8Arrays and Arrays
     * - note this is different to the behaviour of Node Buffers.
     */
    slice(beginInclusive, endExclusive) {
        const { bufs, length } = this._subList(beginInclusive, endExclusive);
        return concat(bufs, length);
    }
    /**
     * Returns a alloc from the given start and end element index.
     *
     * In the best case where the data extracted comes from a single Uint8Array
     * internally this is a no-copy operation otherwise it is a copy operation.
     */
    subarray(beginInclusive, endExclusive) {
        const { bufs, length } = this._subList(beginInclusive, endExclusive);
        if (bufs.length === 1) {
            return bufs[0];
        }
        return concat(bufs, length);
    }
    /**
     * Returns a allocList from the given start and end element index.
     *
     * This is a no-copy operation.
     */
    sublist(beginInclusive, endExclusive) {
        const { bufs, length } = this._subList(beginInclusive, endExclusive);
        const list = new Uint8ArrayList();
        list.length = length;
        // don't loop, just set the bufs
        list.bufs = [...bufs];
        return list;
    }
    _subList(beginInclusive, endExclusive) {
        beginInclusive = beginInclusive ?? 0;
        endExclusive = endExclusive ?? this.length;
        if (beginInclusive < 0) {
            beginInclusive = this.length + beginInclusive;
        }
        if (endExclusive < 0) {
            endExclusive = this.length + endExclusive;
        }
        if (beginInclusive < 0 || endExclusive > this.length) {
            throw new RangeError('index is out of bounds');
        }
        if (beginInclusive === endExclusive) {
            return { bufs: [], length: 0 };
        }
        if (beginInclusive === 0 && endExclusive === this.length) {
            return { bufs: this.bufs, length: this.length };
        }
        const bufs = [];
        let offset = 0;
        for (let i = 0; i < this.bufs.length; i++) {
            const buf = this.bufs[i];
            const bufStart = offset;
            const bufEnd = bufStart + buf.byteLength;
            // for next loop
            offset = bufEnd;
            if (beginInclusive >= bufEnd) {
                // start after this buf
                continue;
            }
            const sliceStartInBuf = beginInclusive >= bufStart && beginInclusive < bufEnd;
            const sliceEndsInBuf = endExclusive > bufStart && endExclusive <= bufEnd;
            if (sliceStartInBuf && sliceEndsInBuf) {
                // slice is wholly contained within this buffer
                if (beginInclusive === bufStart && endExclusive === bufEnd) {
                    // requested whole buffer
                    bufs.push(buf);
                    break;
                }
                // requested part of buffer
                const start = beginInclusive - bufStart;
                bufs.push(buf.subarray(start, start + (endExclusive - beginInclusive)));
                break;
            }
            if (sliceStartInBuf) {
                // slice starts in this buffer
                if (beginInclusive === 0) {
                    // requested whole buffer
                    bufs.push(buf);
                    continue;
                }
                // requested part of buffer
                bufs.push(buf.subarray(beginInclusive - bufStart));
                continue;
            }
            if (sliceEndsInBuf) {
                if (endExclusive === bufEnd) {
                    // requested whole buffer
                    bufs.push(buf);
                    break;
                }
                // requested part of buffer
                bufs.push(buf.subarray(0, endExclusive - bufStart));
                break;
            }
            // slice started before this buffer and ends after it
            bufs.push(buf);
        }
        return { bufs, length: endExclusive - beginInclusive };
    }
    indexOf(search, offset = 0) {
        if (!isUint8ArrayList(search) && !(search instanceof Uint8Array)) {
            throw new TypeError('The "value" argument must be a Uint8ArrayList or Uint8Array');
        }
        const needle = search instanceof Uint8Array ? search : search.subarray();
        offset = Number(offset ?? 0);
        if (isNaN(offset)) {
            offset = 0;
        }
        if (offset < 0) {
            offset = this.length + offset;
        }
        if (offset < 0) {
            offset = 0;
        }
        if (search.length === 0) {
            return offset > this.length ? this.length : offset;
        }
        // https://en.wikipedia.org/wiki/Boyer%E2%80%93Moore_string-search_algorithm
        const M = needle.byteLength;
        if (M === 0) {
            throw new TypeError('search must be at least 1 byte long');
        }
        // radix
        const radix = 256;
        const rightmostPositions = new Int32Array(radix);
        // position of the rightmost occurrence of the byte c in the pattern
        for (let c = 0; c < radix; c++) {
            // -1 for bytes not in pattern
            rightmostPositions[c] = -1;
        }
        for (let j = 0; j < M; j++) {
            // rightmost position for bytes in pattern
            rightmostPositions[needle[j]] = j;
        }
        // Return offset of first match, -1 if no match
        const right = rightmostPositions;
        const lastIndex = this.byteLength - needle.byteLength;
        const lastPatIndex = needle.byteLength - 1;
        let skip;
        for (let i = offset; i <= lastIndex; i += skip) {
            skip = 0;
            for (let j = lastPatIndex; j >= 0; j--) {
                const char = this.get(i + j);
                if (needle[j] !== char) {
                    skip = Math.max(1, j - right[char]);
                    break;
                }
            }
            if (skip === 0) {
                return i;
            }
        }
        return -1;
    }
    getInt8(byteOffset) {
        const buf = this.subarray(byteOffset, byteOffset + 1);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getInt8(0);
    }
    setInt8(byteOffset, value) {
        const buf = allocUnsafe(1);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setInt8(0, value);
        this.write(buf, byteOffset);
    }
    getInt16(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 2);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getInt16(0, littleEndian);
    }
    setInt16(byteOffset, value, littleEndian) {
        const buf = alloc(2);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setInt16(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getInt32(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 4);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getInt32(0, littleEndian);
    }
    setInt32(byteOffset, value, littleEndian) {
        const buf = alloc(4);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setInt32(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getBigInt64(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 8);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getBigInt64(0, littleEndian);
    }
    setBigInt64(byteOffset, value, littleEndian) {
        const buf = alloc(8);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setBigInt64(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getUint8(byteOffset) {
        const buf = this.subarray(byteOffset, byteOffset + 1);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getUint8(0);
    }
    setUint8(byteOffset, value) {
        const buf = allocUnsafe(1);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setUint8(0, value);
        this.write(buf, byteOffset);
    }
    getUint16(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 2);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getUint16(0, littleEndian);
    }
    setUint16(byteOffset, value, littleEndian) {
        const buf = alloc(2);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setUint16(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getUint32(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 4);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getUint32(0, littleEndian);
    }
    setUint32(byteOffset, value, littleEndian) {
        const buf = alloc(4);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setUint32(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getBigUint64(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 8);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getBigUint64(0, littleEndian);
    }
    setBigUint64(byteOffset, value, littleEndian) {
        const buf = alloc(8);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setBigUint64(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getFloat32(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 4);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getFloat32(0, littleEndian);
    }
    setFloat32(byteOffset, value, littleEndian) {
        const buf = alloc(4);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setFloat32(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    getFloat64(byteOffset, littleEndian) {
        const buf = this.subarray(byteOffset, byteOffset + 8);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        return view.getFloat64(0, littleEndian);
    }
    setFloat64(byteOffset, value, littleEndian) {
        const buf = alloc(8);
        const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
        view.setFloat64(0, value, littleEndian);
        this.write(buf, byteOffset);
    }
    equals(other) {
        if (other == null) {
            return false;
        }
        if (!(other instanceof Uint8ArrayList)) {
            return false;
        }
        if (other.bufs.length !== this.bufs.length) {
            return false;
        }
        for (let i = 0; i < this.bufs.length; i++) {
            if (!equals$2(this.bufs[i], other.bufs[i])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Create a Uint8ArrayList from a pre-existing list of Uint8Arrays.  Use this
     * method if you know the total size of all the Uint8Arrays ahead of time.
     */
    static fromUint8Arrays(bufs, length) {
        const list = new Uint8ArrayList();
        list.bufs = bufs;
        if (length == null) {
            length = bufs.reduce((acc, curr) => acc + curr.byteLength, 0);
        }
        list.length = length;
        return list;
    }
}
/*
function indexOf (needle: Uint8Array, haystack: Uint8Array, offset = 0) {
  for (let i = offset; i < haystack.byteLength; i++) {
    for (let j = 0; j < needle.length; j++) {
      if (haystack[i + j] !== needle[j]) {
        break
      }

      if (j === needle.byteLength -1) {
        return i
      }
    }

    if (haystack.byteLength - i < needle.byteLength) {
      break
    }
  }

  return -1
}
*/

// Maximum length of the length section of the message
const MAX_LENGTH_LENGTH = 8; // Varint.encode(Number.MAX_SAFE_INTEGER).length
// Maximum length of the data section of the message
const MAX_DATA_LENGTH = 1024 * 1024 * 4;

/**
 * The reported length of the next data message was not a positive integer
 */
class InvalidMessageLengthError extends Error {
    name = 'InvalidMessageLengthError';
    code = 'ERR_INVALID_MSG_LENGTH';
}
/**
 * The reported length of the next data message was larger than the configured
 * max allowable value
 */
class InvalidDataLengthError extends Error {
    name = 'InvalidDataLengthError';
    code = 'ERR_MSG_DATA_TOO_LONG';
}
/**
 * The varint used to specify the length of the next data message contained more
 * bytes than the configured max allowable value
 */
class InvalidDataLengthLengthError extends Error {
    name = 'InvalidDataLengthLengthError';
    code = 'ERR_MSG_LENGTH_TOO_LONG';
}
/**
 * The incoming stream ended before the expected number of bytes were read
 */
class UnexpectedEOFError extends Error {
    name = 'UnexpectedEOFError';
    code = 'ERR_UNEXPECTED_EOF';
}

function isAsyncIterable$2(thing) {
    return thing[Symbol.asyncIterator] != null;
}

// Helper function to validate the chunk size against maxDataLength
function validateMaxDataLength(chunk, maxDataLength) {
    if (chunk.byteLength > maxDataLength) {
        throw new InvalidDataLengthError('Message length too long');
    }
}
const defaultEncoder = (length) => {
    const lengthLength = encodingLength$1(length);
    const lengthBuf = allocUnsafe(lengthLength);
    encode$4(length, lengthBuf);
    defaultEncoder.bytes = lengthLength;
    return lengthBuf;
};
defaultEncoder.bytes = 0;
function encode$3(source, options) {
    options = options ?? {};
    const encodeLength = options.lengthEncoder ?? defaultEncoder;
    const maxDataLength = options?.maxDataLength ?? MAX_DATA_LENGTH;
    function* maybeYield(chunk) {
        validateMaxDataLength(chunk, maxDataLength);
        // length + data
        const length = encodeLength(chunk.byteLength);
        // yield only Uint8Arrays
        if (length instanceof Uint8Array) {
            yield length;
        }
        else {
            yield* length;
        }
        // yield only Uint8Arrays
        if (chunk instanceof Uint8Array) {
            yield chunk;
        }
        else {
            yield* chunk;
        }
    }
    if (isAsyncIterable$2(source)) {
        return (async function* () {
            for await (const chunk of source) {
                yield* maybeYield(chunk);
            }
        })();
    }
    return (function* () {
        for (const chunk of source) {
            yield* maybeYield(chunk);
        }
    })();
}
encode$3.single = (chunk, options) => {
    options = options ?? {};
    const encodeLength = options.lengthEncoder ?? defaultEncoder;
    const maxDataLength = options?.maxDataLength ?? MAX_DATA_LENGTH;
    validateMaxDataLength(chunk, maxDataLength);
    return new Uint8ArrayList(encodeLength(chunk.byteLength), chunk);
};

/* eslint max-depth: ["error", 6] */
var ReadMode;
(function (ReadMode) {
    ReadMode[ReadMode["LENGTH"] = 0] = "LENGTH";
    ReadMode[ReadMode["DATA"] = 1] = "DATA";
})(ReadMode || (ReadMode = {}));
const defaultDecoder = (buf) => {
    const length = decode$6(buf);
    defaultDecoder.bytes = encodingLength$1(length);
    return length;
};
defaultDecoder.bytes = 0;
function decode$5(source, options) {
    const buffer = new Uint8ArrayList();
    let mode = ReadMode.LENGTH;
    let dataLength = -1;
    const lengthDecoder = options?.lengthDecoder ?? defaultDecoder;
    const maxLengthLength = options?.maxLengthLength ?? MAX_LENGTH_LENGTH;
    const maxDataLength = options?.maxDataLength ?? MAX_DATA_LENGTH;
    function* maybeYield() {
        while (buffer.byteLength > 0) {
            if (mode === ReadMode.LENGTH) {
                // read length, ignore errors for short reads
                try {
                    dataLength = lengthDecoder(buffer);
                    if (dataLength < 0) {
                        throw new InvalidMessageLengthError('Invalid message length');
                    }
                    if (dataLength > maxDataLength) {
                        throw new InvalidDataLengthError('Message length too long');
                    }
                    const dataLengthLength = lengthDecoder.bytes;
                    buffer.consume(dataLengthLength);
                    if (options?.onLength != null) {
                        options.onLength(dataLength);
                    }
                    mode = ReadMode.DATA;
                }
                catch (err) {
                    if (err instanceof RangeError) {
                        if (buffer.byteLength > maxLengthLength) {
                            throw new InvalidDataLengthLengthError('Message length length too long');
                        }
                        break;
                    }
                    throw err;
                }
            }
            if (mode === ReadMode.DATA) {
                if (buffer.byteLength < dataLength) {
                    // not enough data, wait for more
                    break;
                }
                const data = buffer.sublist(0, dataLength);
                buffer.consume(dataLength);
                if (options?.onData != null) {
                    options.onData(data);
                }
                yield data;
                mode = ReadMode.LENGTH;
            }
        }
    }
    if (isAsyncIterable$2(source)) {
        return (async function* () {
            for await (const buf of source) {
                buffer.append(buf);
                yield* maybeYield();
            }
            if (buffer.byteLength > 0) {
                throw new UnexpectedEOFError('Unexpected end of input');
            }
        })();
    }
    return (function* () {
        for (const buf of source) {
            buffer.append(buf);
            yield* maybeYield();
        }
        if (buffer.byteLength > 0) {
            throw new UnexpectedEOFError('Unexpected end of input');
        }
    })();
}
decode$5.fromReader = (reader, options) => {
    let byteLength = 1; // Read single byte chunks until the length is known
    const varByteSource = (async function* () {
        while (true) {
            try {
                const { done, value } = await reader.next(byteLength);
                if (done === true) {
                    return;
                }
                if (value != null) {
                    yield value;
                }
            }
            catch (err) {
                if (err.code === 'ERR_UNDER_READ') {
                    return { done: true, value: null };
                }
                throw err;
            }
            finally {
                // Reset the byteLength so we continue to check for varints
                byteLength = 1;
            }
        }
    }());
    /**
     * Once the length has been parsed, read chunk for that length
     */
    const onLength = (l) => { byteLength = l; };
    return decode$5(varByteSource, {
        ...(options ?? {}),
        onLength
    });
};

function w(e){return "[object Array]"===Object.prototype.toString.call(e)}function h(e){return null===e}function D(e){return "object"==typeof e&&!h(e)&&!w(e)}function L(e){return void 0===e}function On(e){if("string"!=typeof e)throw new TypeError("Expected a string for 'str'");return e.trim().toLowerCase().replace(/\s+/g,"-")}

//#endregion
//#region src/observable/behaviorSubject.ts
/**
* @internal
* An observable that maintains and provides a "current value" to subscribers
* @see https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject
*/
function behaviorSubject(initialValue) {
	let value = initialValue;
	const observerList = [];
	const addObserver = (observer) => {
		if (value !== void 0) observer.next(value);
		observerList.push(observer);
	};
	const removeObserver = (observer) => {
		observerList.splice(observerList.indexOf(observer), 1);
	};
	const obs = observable((observer) => {
		addObserver(observer);
		return () => {
			removeObserver(observer);
		};
	});
	obs.next = (nextValue) => {
		if (value === nextValue) return;
		value = nextValue;
		for (const observer of observerList) observer.next(nextValue);
	};
	obs.get = () => value;
	return obs;
}

/**
 * An abort error class that extends error
 */
class AbortError extends Error {
    type;
    code;
    constructor(message, code, name) {
        super(message ?? 'The operation was aborted');
        this.type = 'aborted';
        this.name = name ?? 'AbortError';
        this.code = code ?? 'ABORT_ERR';
    }
}
/**
 * Race a promise against an abort signal
 */
async function raceSignal(promise, signal, opts) {
    if (signal == null) {
        return promise;
    }
    if (signal.aborted) {
        // the passed promise may yet resolve or reject but the use has signalled
        // they are no longer interested so smother the error
        promise.catch(() => { });
        return Promise.reject(new AbortError(opts?.errorMessage, opts?.errorCode, opts?.errorName));
    }
    let listener;
    // create the error here so we have more context in the stack trace
    const error = new AbortError(opts?.errorMessage, opts?.errorCode, opts?.errorName);
    try {
        return await Promise.race([
            promise,
            new Promise((resolve, reject) => {
                listener = () => {
                    reject(error);
                };
                signal.addEventListener('abort', listener);
            })
        ]);
    }
    finally {
        if (listener != null) {
            signal.removeEventListener('abort', listener);
        }
    }
}

/**
 * @packageDocumentation
 *
 * A pushable async generator that waits until the current value is consumed
 * before allowing a new value to be pushed.
 *
 * Useful for when you don't want to keep memory usage under control and/or
 * allow a downstream consumer to dictate how fast data flows through a pipe,
 * but you want to be able to apply a transform to that data.
 *
 * @example
 *
 * ```typescript
 * import { queuelessPushable } from 'it-queueless-pushable'
 *
 * const pushable = queuelessPushable<string>()
 *
 * // run asynchronously
 * Promise.resolve().then(async () => {
 *   // push a value - the returned promise will not resolve until the value is
 *   // read from the pushable
 *   await pushable.push('hello')
 * })
 *
 * // read a value
 * const result = await pushable.next()
 * console.info(result) // { done: false, value: 'hello' }
 * ```
 */
class QueuelessPushable {
    readNext;
    haveNext;
    ended;
    nextResult;
    error;
    constructor() {
        this.ended = false;
        this.readNext = pDefer();
        this.haveNext = pDefer();
    }
    [Symbol.asyncIterator]() {
        return this;
    }
    async next() {
        if (this.nextResult == null) {
            // wait for the supplier to push a value
            await this.haveNext.promise;
        }
        if (this.nextResult == null) {
            throw new Error('HaveNext promise resolved but nextResult was undefined');
        }
        const nextResult = this.nextResult;
        this.nextResult = undefined;
        // signal to the supplier that we read the value
        this.readNext.resolve();
        this.readNext = pDefer();
        return nextResult;
    }
    async throw(err) {
        this.ended = true;
        this.error = err;
        if (err != null) {
            // this can cause unhandled promise rejections if nothing is awaiting the
            // next value so attach a dummy catch listener to the promise
            this.haveNext.promise.catch(() => { });
            this.haveNext.reject(err);
        }
        const result = {
            done: true,
            value: undefined
        };
        return result;
    }
    async return() {
        const result = {
            done: true,
            value: undefined
        };
        this.ended = true;
        this.nextResult = result;
        // let the consumer know we have a new value
        this.haveNext.resolve();
        return result;
    }
    async push(value, options) {
        await this._push(value, options);
    }
    async end(err, options) {
        if (err != null) {
            await this.throw(err);
        }
        else {
            // abortable return
            await this._push(undefined, options);
        }
    }
    async _push(value, options) {
        if (value != null && this.ended) {
            throw this.error ?? new Error('Cannot push value onto an ended pushable');
        }
        // wait for all values to be read
        while (this.nextResult != null) {
            await this.readNext.promise;
        }
        if (value != null) {
            this.nextResult = { done: false, value };
        }
        else {
            this.ended = true;
            this.nextResult = { done: true, value: undefined };
        }
        // let the consumer know we have a new value
        this.haveNext.resolve();
        this.haveNext = pDefer();
        // wait for the consumer to have finished processing the value and requested
        // the next one or for the passed signal to abort the waiting
        await raceSignal(this.readNext.promise, options?.signal, options);
    }
}
function queuelessPushable() {
    return new QueuelessPushable();
}

/**
 * @packageDocumentation
 *
 * Merge several (async)iterables into one, yield values as they arrive.
 *
 * Nb. sources are iterated over in parallel so the order of emitted items is not guaranteed.
 *
 * @example
 *
 * ```javascript
 * import merge from 'it-merge'
 * import all from 'it-all'
 *
 * // This can also be an iterator, generator, etc
 * const values1 = [0, 1, 2, 3, 4]
 * const values2 = [5, 6, 7, 8, 9]
 *
 * const arr = all(merge(values1, values2))
 *
 * console.info(arr) // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
 * ```
 *
 * Async sources must be awaited:
 *
 * ```javascript
 * import merge from 'it-merge'
 * import all from 'it-all'
 *
 * // This can also be an iterator, async iterator, generator, etc
 * const values1 = async function * () {
 *   yield * [0, 1, 2, 3, 4]
 * }
 * const values2 = async function * () {
 *   yield * [5, 6, 7, 8, 9]
 * }
 *
 * const arr = await all(merge(values1(), values2()))
 *
 * console.info(arr) // 0, 1, 5, 6, 2, 3, 4, 7, 8, 9  <- nb. order is not guaranteed
 * ```
 */
function isAsyncIterable$1(thing) {
    return thing[Symbol.asyncIterator] != null;
}
async function addAllToPushable(sources, output, signal) {
    try {
        await Promise.all(sources.map(async (source) => {
            for await (const item of source) {
                await output.push(item, {
                    signal
                });
                signal.throwIfAborted();
            }
        }));
        await output.end(undefined, {
            signal
        });
    }
    catch (err) {
        await output.end(err, {
            signal
        })
            .catch(() => { });
    }
}
async function* mergeSources(sources) {
    const controller = new AbortController();
    const output = queuelessPushable();
    addAllToPushable(sources, output, controller.signal)
        .catch(() => { });
    try {
        yield* output;
    }
    finally {
        controller.abort();
    }
}
function* mergeSyncSources(syncSources) {
    for (const source of syncSources) {
        yield* source;
    }
}
function merge(...sources) {
    const syncSources = [];
    for (const source of sources) {
        if (!isAsyncIterable$1(source)) {
            syncSources.push(source);
        }
    }
    if (syncSources.length === sources.length) {
        // all sources are synchronous
        return mergeSyncSources(syncSources);
    }
    return mergeSources(sources);
}

function pipe(first, ...rest) {
    if (first == null) {
        throw new Error('Empty pipeline');
    }
    // Duplex at start: wrap in function and return duplex source
    if (isDuplex(first)) {
        const duplex = first;
        first = () => duplex.source;
        // Iterable at start: wrap in function
    }
    else if (isIterable(first) || isAsyncIterable(first)) {
        const source = first;
        first = () => source;
    }
    const fns = [first, ...rest];
    if (fns.length > 1) {
        // Duplex at end: use duplex sink
        if (isDuplex(fns[fns.length - 1])) {
            fns[fns.length - 1] = fns[fns.length - 1].sink;
        }
    }
    if (fns.length > 2) {
        // Duplex in the middle, consume source with duplex sink and return duplex source
        for (let i = 1; i < fns.length - 1; i++) {
            if (isDuplex(fns[i])) {
                fns[i] = duplexPipelineFn(fns[i]);
            }
        }
    }
    return rawPipe(...fns);
}
const rawPipe = (...fns) => {
    let res;
    while (fns.length > 0) {
        res = fns.shift()(res);
    }
    return res;
};
const isAsyncIterable = (obj) => {
    return obj?.[Symbol.asyncIterator] != null;
};
const isIterable = (obj) => {
    return obj?.[Symbol.iterator] != null;
};
const isDuplex = (obj) => {
    if (obj == null) {
        return false;
    }
    return obj.sink != null && obj.source != null;
};
const duplexPipelineFn = (duplex) => {
    return (source) => {
        const p = duplex.sink(source);
        if (p?.then != null) {
            const stream = pushable({
                objectMode: true
            });
            p.then(() => {
                stream.end();
            }, (err) => {
                stream.end(err);
            });
            let sourceWrap;
            const source = duplex.source;
            if (isAsyncIterable(source)) {
                sourceWrap = async function* () {
                    yield* source;
                    stream.end();
                };
            }
            else if (isIterable(source)) {
                sourceWrap = function* () {
                    yield* source;
                    stream.end();
                };
            }
            else {
                throw new Error('Unknown duplex source type - must be Iterable or AsyncIterable');
            }
            return merge(stream, sourceWrap());
        }
        return duplex.source;
    };
};

function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== void 0) {
        if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
        var dispose, inner;
        {
            if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
            dispose = value[Symbol.asyncDispose];
        }
        if (dispose === void 0) {
            if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
            dispose = value[Symbol.dispose];
            inner = dispose;
        }
        if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
        if (inner) dispose = function() {
            try {
                inner.call(this);
            } catch (e) {
                return Promise.reject(e);
            }
        };
        env.stack.push({
            value: value,
            dispose: dispose,
            async: async
        });
    } else {
        env.stack.push({
            async: true
        });
    }
    return value;
}
function _ts_dispose_resources(env) {
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    return (_ts_dispose_resources = function _ts_dispose_resources(env) {
        function fail(e) {
            env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        var r, s = 0;
        function next() {
            while(r = env.stack.pop()){
                try {
                    if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
                    if (r.dispose) {
                        var result = r.dispose.call(r.value);
                        if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
                            fail(e);
                            return next();
                        });
                    } else s |= 1;
                } catch (e) {
                    fail(e);
                }
            }
            if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
            if (env.hasError) throw env.error;
        }
        return next();
    })(env);
}
function getConnectionHandler(options) {
    const { createContext, router } = options;
    const { transformer } = router._def._config;
    return (stream)=>{
        let contextMsg = undefined;
        let ctx = undefined;
        new ObjectId();
        const writter = pushable();
        const subscriptions = new Map();
        new AbortController();
        (async ()=>{
            await pipe(writter, encode$3, stream);
        })();
        const respond = (rawMap)=>{
            const map = transformTRPCResponse(router._def._config, rawMap);
            const bytes = bson.serialize(map);
            writter.push(bytes);
        };
        const createCtxPromise = async (getConnectionParams)=>{
            try {
                return {
                    ok: true,
                    value: await createContext?.({
                        stream,
                        contextMessage: contextMsg
                    })
                };
            } catch (cause) {
                const error = getTRPCErrorFromUnknown(cause);
                respond({
                    id: null,
                    error: getErrorShape({
                        config: router._def._config,
                        error,
                        type: "unknown",
                        path: void 0,
                        input: void 0,
                        ctx
                    })
                });
                (globalThis.setImmediate ?? globalThis.setTimeout)(()=>stream.abort(error));
                return {
                    ok: false,
                    error
                };
            }
        };
        let ctxPromise = null;
        // 处理请求
        const handleRequest = async (message)=>{
            const { id, jsonrpc } = message;
            const respondError = (error)=>{
                respond({
                    id,
                    jsonrpc,
                    error: getErrorShape({
                        config: router._def._config,
                        error,
                        type: "unknown",
                        path: void 0,
                        input: void 0,
                        ctx
                    })
                });
            };
            if (h(id)) {
                const error = getTRPCErrorFromUnknown(new TRPCError({
                    code: 'PARSE_ERROR',
                    message: '`id` is required'
                }));
                respondError(error);
                return;
            }
            const { method } = message;
            if (method === "subscription.stop") {
                subscriptions.get(id)?.abort();
                return;
            }
            const { path, lastEventId } = message.params;
            let { input } = message.params;
            if (!L(lastEventId)) {
                if (D(input)) {
                    input.lastEventId = lastEventId;
                } else {
                    input ??= {
                        lastEventId
                    };
                }
            }
            (async ()=>{
                const context = await ctxPromise;
                if (!context.ok) {
                    throw context.error;
                }
                const abortController = new AbortController();
                const result = await callProcedure({
                    router,
                    path,
                    getRawInput: async ()=>input,
                    ctx,
                    type: method,
                    signal: abortController.signal
                });
                const isIterableResult = isAsyncIterable$3(result) || isObservable(result);
                if (method !== "subscription") {
                    if (isIterableResult) {
                        throw new TRPCError({
                            code: 'UNSUPPORTED_MEDIA_TYPE',
                            message: `Cannot return an async iterable or observable from a ${method} procedure with WebSockets`
                        });
                    }
                    respond({
                        id,
                        jsonrpc,
                        result: {
                            type: "data",
                            data: result
                        }
                    });
                    return;
                }
                console.log(result);
                if (!isIterableResult) {
                    throw new TRPCError({
                        message: `Subscription ${path} did not return an observable or a AsyncGenerator`,
                        code: 'INTERNAL_SERVER_ERROR'
                    });
                }
                if (stream.status !== "open") {
                    return;
                }
                if (subscriptions.has(id)) {
                    throw new TRPCError({
                        message: `Duplicate id ${id}`,
                        code: 'BAD_REQUEST'
                    });
                }
                const iterable = isObservable(result) ? observableToAsyncIterable(result, abortController.signal) : result;
                (async ()=>{
                    const env = {
                        stack: [],
                        error: void 0,
                        hasError: false
                    };
                    try {
                        const iterator = _ts_add_disposable_resource(env, iteratorResource(iterable), true);
                        const abortPromise = new Promise((resolve)=>{
                            abortController.signal.onabort = ()=>resolve("abort");
                        });
                        let next;
                        let result;
                        while(true){
                            next = await Unpromise.race([
                                iterator.next().catch(getTRPCErrorFromUnknown),
                                abortPromise
                            ]);
                            if (next === "abort") {
                                await iterator.return?.();
                                break;
                            }
                            if (next instanceof Error) {
                                const error = getTRPCErrorFromUnknown(next);
                                respondError(error);
                                break;
                            }
                            if (next.done) {
                                break;
                            }
                            result = {
                                type: "data",
                                data: next.value
                            };
                            if (isTrackedEnvelope(next.value)) {
                                const [id, data] = next.value;
                                result.id = id;
                                result.data = {
                                    id,
                                    data
                                };
                            }
                            respond({
                                id,
                                jsonrpc,
                                result
                            });
                            next = null;
                            result = null;
                        }
                        respond({
                            id,
                            jsonrpc,
                            result: {
                                type: "stopped"
                            }
                        });
                        subscriptions.delete(id);
                    } catch (e) {
                        env.error = e;
                        env.hasError = true;
                    } finally{
                        const result = _ts_dispose_resources(env);
                        if (result) await result;
                    }
                })().catch((cause)=>respondError(cause));
            })().catch((cause)=>respondError(cause));
        };
        // 处理 BSON
        const handleMap = async (map)=>{
            if (h(ctxPromise)) {
                ctxPromise = createCtxPromise();
                return;
            }
            let messages;
            try {
                messages = (w(map) ? map : [
                    map
                ]).map((raw)=>parseTRPCMessage(raw, transformer));
            } catch (cause) {
                const error = new TRPCError({
                    code: 'PARSE_ERROR',
                    cause
                });
                respond({
                    id: null,
                    error: getErrorShape({
                        config: router._def._config,
                        error,
                        type: "unknown",
                        path: void 0,
                        input: void 0,
                        ctx
                    })
                });
                return;
            }
            messages.forEach((message)=>handleRequest(message));
        };
        // 不断读取
        try {
            pipe(stream, (source)=>decode$5(source), async (source)=>{
                for await (const message of source){
                    let map;
                    try {
                        const doc = bson.deserialize(message.subarray());
                        map = EJSON.deserialize(doc);
                    } catch (error) {
                        continue;
                    }
                    if (L(contextMsg)) {
                        // 要先读取 contextMsg
                        try {
                            const doc = bson.deserialize(message.subarray());
                            const map = EJSON.deserialize(doc);
                            contextMsg = map;
                        } catch (error) {
                            const err = new Error("Unable to successfully shake hands.");
                            stream.abort(err);
                            break;
                        }
                        const [_, connectionParams] = Object.entries(contextMsg.headers).filter(([key, _])=>{
                            On(key) === "connection-params";
                        })[0] ?? [];
                        ctxPromise = connectionParams === "1" ? null : createCtxPromise(()=>null);
                        continue;
                    }
                    try {
                        await handleMap(map);
                    } catch (TRPCError) {
                        break;
                    }
                }
                stream.abort(new Error());
            });
        } catch (AbortError) {
            return;
        }
    };
}

function applyHandler(app, options) {
    const path = "/trpc/1.0.0";
    const onConnection = getConnectionHandler(options);
    app.handle(path, async ({ stream })=>{
        onConnection(stream);
    });
}

class TRPCStreamClosedError extends Error {
    constructor(opts){
        super(opts.message, {
            cause: opts.cause
        });
        this.name = "TRPCStreamClosedError";
        Object.setPrototypeOf(this, TRPCStreamClosedError.prototype);
    }
}

function equals$1(aa, bb) {
    if (aa === bb) {
        return true;
    }
    if (aa.byteLength !== bb.byteLength) {
        return false;
    }
    for (let ii = 0; ii < aa.byteLength; ii++) {
        if (aa[ii] !== bb[ii]) {
            return false;
        }
    }
    return true;
}
function coerce(o) {
    if (o instanceof Uint8Array && o.constructor.name === 'Uint8Array') {
        return o;
    }
    if (o instanceof ArrayBuffer) {
        return new Uint8Array(o);
    }
    if (ArrayBuffer.isView(o)) {
        return new Uint8Array(o.buffer, o.byteOffset, o.byteLength);
    }
    throw new Error('Unknown type, must be binary type');
}
function fromString$1(str) {
    return new TextEncoder().encode(str);
}
function toString$1(b) {
    return new TextDecoder().decode(b);
}

/* eslint-disable */
// base-x encoding / decoding
// Copyright (c) 2018 base-x contributors
// Copyright (c) 2014-2018 The Bitcoin Core developers (base58.cpp)
// Distributed under the MIT software license, see the accompanying
// file LICENSE or http://www.opensource.org/licenses/mit-license.php.
/**
 * @param {string} ALPHABET
 * @param {any} name
 */
function base(ALPHABET, name) {
    if (ALPHABET.length >= 255) {
        throw new TypeError('Alphabet too long');
    }
    var BASE_MAP = new Uint8Array(256);
    for (var j = 0; j < BASE_MAP.length; j++) {
        BASE_MAP[j] = 255;
    }
    for (var i = 0; i < ALPHABET.length; i++) {
        var x = ALPHABET.charAt(i);
        var xc = x.charCodeAt(0);
        if (BASE_MAP[xc] !== 255) {
            throw new TypeError(x + ' is ambiguous');
        }
        BASE_MAP[xc] = i;
    }
    var BASE = ALPHABET.length;
    var LEADER = ALPHABET.charAt(0);
    var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up
    var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up
    /**
     * @param {any[] | Iterable<number>} source
     */
    function encode(source) {
        // @ts-ignore
        if (source instanceof Uint8Array)
            ;
        else if (ArrayBuffer.isView(source)) {
            source = new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
        }
        else if (Array.isArray(source)) {
            source = Uint8Array.from(source);
        }
        if (!(source instanceof Uint8Array)) {
            throw new TypeError('Expected Uint8Array');
        }
        if (source.length === 0) {
            return '';
        }
        // Skip & count leading zeroes.
        var zeroes = 0;
        var length = 0;
        var pbegin = 0;
        var pend = source.length;
        while (pbegin !== pend && source[pbegin] === 0) {
            pbegin++;
            zeroes++;
        }
        // Allocate enough space in big-endian base58 representation.
        var size = ((pend - pbegin) * iFACTOR + 1) >>> 0;
        var b58 = new Uint8Array(size);
        // Process the bytes.
        while (pbegin !== pend) {
            var carry = source[pbegin];
            // Apply "b58 = b58 * 256 + ch".
            var i = 0;
            for (var it1 = size - 1; (carry !== 0 || i < length) && (it1 !== -1); it1--, i++) {
                carry += (256 * b58[it1]) >>> 0;
                b58[it1] = (carry % BASE) >>> 0;
                carry = (carry / BASE) >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            pbegin++;
        }
        // Skip leading zeroes in base58 result.
        var it2 = size - length;
        while (it2 !== size && b58[it2] === 0) {
            it2++;
        }
        // Translate the result into a string.
        var str = LEADER.repeat(zeroes);
        for (; it2 < size; ++it2) {
            str += ALPHABET.charAt(b58[it2]);
        }
        return str;
    }
    /**
     * @param {string | string[]} source
     */
    function decodeUnsafe(source) {
        if (typeof source !== 'string') {
            throw new TypeError('Expected String');
        }
        if (source.length === 0) {
            return new Uint8Array();
        }
        var psz = 0;
        // Skip leading spaces.
        if (source[psz] === ' ') {
            return;
        }
        // Skip and count leading '1's.
        var zeroes = 0;
        var length = 0;
        while (source[psz] === LEADER) {
            zeroes++;
            psz++;
        }
        // Allocate enough space in big-endian base256 representation.
        var size = (((source.length - psz) * FACTOR) + 1) >>> 0; // log(58) / log(256), rounded up.
        var b256 = new Uint8Array(size);
        // Process the characters.
        while (source[psz]) {
            // Decode character
            var carry = BASE_MAP[source.charCodeAt(psz)];
            // Invalid character
            if (carry === 255) {
                return;
            }
            var i = 0;
            for (var it3 = size - 1; (carry !== 0 || i < length) && (it3 !== -1); it3--, i++) {
                carry += (BASE * b256[it3]) >>> 0;
                b256[it3] = (carry % 256) >>> 0;
                carry = (carry / 256) >>> 0;
            }
            if (carry !== 0) {
                throw new Error('Non-zero carry');
            }
            length = i;
            psz++;
        }
        // Skip trailing spaces.
        if (source[psz] === ' ') {
            return;
        }
        // Skip leading zeroes in b256.
        var it4 = size - length;
        while (it4 !== size && b256[it4] === 0) {
            it4++;
        }
        var vch = new Uint8Array(zeroes + (size - it4));
        var j = zeroes;
        while (it4 !== size) {
            vch[j++] = b256[it4++];
        }
        return vch;
    }
    /**
     * @param {string | string[]} string
     */
    function decode(string) {
        var buffer = decodeUnsafe(string);
        if (buffer) {
            return buffer;
        }
        throw new Error(`Non-${name} character`);
    }
    return {
        encode: encode,
        decodeUnsafe: decodeUnsafe,
        decode: decode
    };
}
var src = base;
var _brrp__multiformats_scope_baseX = src;

/**
 * Class represents both BaseEncoder and MultibaseEncoder meaning it
 * can be used to encode to multibase or base encode without multibase
 * prefix.
 */
class Encoder {
    name;
    prefix;
    baseEncode;
    constructor(name, prefix, baseEncode) {
        this.name = name;
        this.prefix = prefix;
        this.baseEncode = baseEncode;
    }
    encode(bytes) {
        if (bytes instanceof Uint8Array) {
            return `${this.prefix}${this.baseEncode(bytes)}`;
        }
        else {
            throw Error('Unknown type, must be binary type');
        }
    }
}
/**
 * Class represents both BaseDecoder and MultibaseDecoder so it could be used
 * to decode multibases (with matching prefix) or just base decode strings
 * with corresponding base encoding.
 */
class Decoder {
    name;
    prefix;
    baseDecode;
    prefixCodePoint;
    constructor(name, prefix, baseDecode) {
        this.name = name;
        this.prefix = prefix;
        const prefixCodePoint = prefix.codePointAt(0);
        /* c8 ignore next 3 */
        if (prefixCodePoint === undefined) {
            throw new Error('Invalid prefix character');
        }
        this.prefixCodePoint = prefixCodePoint;
        this.baseDecode = baseDecode;
    }
    decode(text) {
        if (typeof text === 'string') {
            if (text.codePointAt(0) !== this.prefixCodePoint) {
                throw Error(`Unable to decode multibase string ${JSON.stringify(text)}, ${this.name} decoder only supports inputs prefixed with ${this.prefix}`);
            }
            return this.baseDecode(text.slice(this.prefix.length));
        }
        else {
            throw Error('Can only multibase decode strings');
        }
    }
    or(decoder) {
        return or(this, decoder);
    }
}
class ComposedDecoder {
    decoders;
    constructor(decoders) {
        this.decoders = decoders;
    }
    or(decoder) {
        return or(this, decoder);
    }
    decode(input) {
        const prefix = input[0];
        const decoder = this.decoders[prefix];
        if (decoder != null) {
            return decoder.decode(input);
        }
        else {
            throw RangeError(`Unable to decode multibase string ${JSON.stringify(input)}, only inputs prefixed with ${Object.keys(this.decoders)} are supported`);
        }
    }
}
function or(left, right) {
    return new ComposedDecoder({
        ...(left.decoders ?? { [left.prefix]: left }),
        ...(right.decoders ?? { [right.prefix]: right })
    });
}
class Codec {
    name;
    prefix;
    baseEncode;
    baseDecode;
    encoder;
    decoder;
    constructor(name, prefix, baseEncode, baseDecode) {
        this.name = name;
        this.prefix = prefix;
        this.baseEncode = baseEncode;
        this.baseDecode = baseDecode;
        this.encoder = new Encoder(name, prefix, baseEncode);
        this.decoder = new Decoder(name, prefix, baseDecode);
    }
    encode(input) {
        return this.encoder.encode(input);
    }
    decode(input) {
        return this.decoder.decode(input);
    }
}
function from({ name, prefix, encode, decode }) {
    return new Codec(name, prefix, encode, decode);
}
function baseX({ name, prefix, alphabet }) {
    const { encode, decode } = _brrp__multiformats_scope_baseX(alphabet, name);
    return from({
        prefix,
        name,
        encode,
        decode: (text) => coerce(decode(text))
    });
}
function decode$4(string, alphabetIdx, bitsPerChar, name) {
    // Count the padding bytes:
    let end = string.length;
    while (string[end - 1] === '=') {
        --end;
    }
    // Allocate the output:
    const out = new Uint8Array((end * bitsPerChar / 8) | 0);
    // Parse the data:
    let bits = 0; // Number of bits currently in the buffer
    let buffer = 0; // Bits waiting to be written out, MSB first
    let written = 0; // Next byte to write
    for (let i = 0; i < end; ++i) {
        // Read one character from the string:
        const value = alphabetIdx[string[i]];
        if (value === undefined) {
            throw new SyntaxError(`Non-${name} character`);
        }
        // Append the bits to the buffer:
        buffer = (buffer << bitsPerChar) | value;
        bits += bitsPerChar;
        // Write out some bits if the buffer has a byte's worth:
        if (bits >= 8) {
            bits -= 8;
            out[written++] = 0xff & (buffer >> bits);
        }
    }
    // Verify that we have received just enough bits:
    if (bits >= bitsPerChar || (0xff & (buffer << (8 - bits))) !== 0) {
        throw new SyntaxError('Unexpected end of data');
    }
    return out;
}
function encode$2(data, alphabet, bitsPerChar) {
    const pad = alphabet[alphabet.length - 1] === '=';
    const mask = (1 << bitsPerChar) - 1;
    let out = '';
    let bits = 0; // Number of bits currently in the buffer
    let buffer = 0; // Bits waiting to be written out, MSB first
    for (let i = 0; i < data.length; ++i) {
        // Slurp data into the buffer:
        buffer = (buffer << 8) | data[i];
        bits += 8;
        // Write out as much as we can:
        while (bits > bitsPerChar) {
            bits -= bitsPerChar;
            out += alphabet[mask & (buffer >> bits)];
        }
    }
    // Partial character:
    if (bits !== 0) {
        out += alphabet[mask & (buffer << (bitsPerChar - bits))];
    }
    // Add padding characters until we hit a byte boundary:
    if (pad) {
        while (((out.length * bitsPerChar) & 7) !== 0) {
            out += '=';
        }
    }
    return out;
}
function createAlphabetIdx(alphabet) {
    // Build the character lookup table:
    const alphabetIdx = {};
    for (let i = 0; i < alphabet.length; ++i) {
        alphabetIdx[alphabet[i]] = i;
    }
    return alphabetIdx;
}
/**
 * RFC4648 Factory
 */
function rfc4648({ name, prefix, bitsPerChar, alphabet }) {
    const alphabetIdx = createAlphabetIdx(alphabet);
    return from({
        prefix,
        name,
        encode(input) {
            return encode$2(input, alphabet, bitsPerChar);
        },
        decode(input) {
            return decode$4(input, alphabetIdx, bitsPerChar, name);
        }
    });
}

const base10 = baseX({
    prefix: '9',
    name: 'base10',
    alphabet: '0123456789'
});

var base10$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base10: base10
});

const base16 = rfc4648({
    prefix: 'f',
    name: 'base16',
    alphabet: '0123456789abcdef',
    bitsPerChar: 4
});
const base16upper = rfc4648({
    prefix: 'F',
    name: 'base16upper',
    alphabet: '0123456789ABCDEF',
    bitsPerChar: 4
});

var base16$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base16: base16,
	base16upper: base16upper
});

const base2 = rfc4648({
    prefix: '0',
    name: 'base2',
    alphabet: '01',
    bitsPerChar: 1
});

var base2$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base2: base2
});

const alphabet = Array.from('🚀🪐☄🛰🌌🌑🌒🌓🌔🌕🌖🌗🌘🌍🌏🌎🐉☀💻🖥💾💿😂❤😍🤣😊🙏💕😭😘👍😅👏😁🔥🥰💔💖💙😢🤔😆🙄💪😉☺👌🤗💜😔😎😇🌹🤦🎉💞✌✨🤷😱😌🌸🙌😋💗💚😏💛🙂💓🤩😄😀🖤😃💯🙈👇🎶😒🤭❣😜💋👀😪😑💥🙋😞😩😡🤪👊🥳😥🤤👉💃😳✋😚😝😴🌟😬🙃🍀🌷😻😓⭐✅🥺🌈😈🤘💦✔😣🏃💐☹🎊💘😠☝😕🌺🎂🌻😐🖕💝🙊😹🗣💫💀👑🎵🤞😛🔴😤🌼😫⚽🤙☕🏆🤫👈😮🙆🍻🍃🐶💁😲🌿🧡🎁⚡🌞🎈❌✊👋😰🤨😶🤝🚶💰🍓💢🤟🙁🚨💨🤬✈🎀🍺🤓😙💟🌱😖👶🥴▶➡❓💎💸⬇😨🌚🦋😷🕺⚠🙅😟😵👎🤲🤠🤧📌🔵💅🧐🐾🍒😗🤑🌊🤯🐷☎💧😯💆👆🎤🙇🍑❄🌴💣🐸💌📍🥀🤢👅💡💩👐📸👻🤐🤮🎼🥵🚩🍎🍊👼💍📣🥂');
const alphabetBytesToChars = (alphabet.reduce((p, c, i) => { p[i] = c; return p; }, ([])));
const alphabetCharsToBytes = (alphabet.reduce((p, c, i) => {
    const codePoint = c.codePointAt(0);
    if (codePoint == null) {
        throw new Error(`Invalid character: ${c}`);
    }
    p[codePoint] = i;
    return p;
}, ([])));
function encode$1(data) {
    return data.reduce((p, c) => {
        p += alphabetBytesToChars[c];
        return p;
    }, '');
}
function decode$3(str) {
    const byts = [];
    for (const char of str) {
        const codePoint = char.codePointAt(0);
        if (codePoint == null) {
            throw new Error(`Invalid character: ${char}`);
        }
        const byt = alphabetCharsToBytes[codePoint];
        if (byt == null) {
            throw new Error(`Non-base256emoji character: ${char}`);
        }
        byts.push(byt);
    }
    return new Uint8Array(byts);
}
const base256emoji = from({
    prefix: '🚀',
    name: 'base256emoji',
    encode: encode$1,
    decode: decode$3
});

var base256emoji$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base256emoji: base256emoji
});

const base32 = rfc4648({
    prefix: 'b',
    name: 'base32',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567',
    bitsPerChar: 5
});
const base32upper = rfc4648({
    prefix: 'B',
    name: 'base32upper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567',
    bitsPerChar: 5
});
const base32pad = rfc4648({
    prefix: 'c',
    name: 'base32pad',
    alphabet: 'abcdefghijklmnopqrstuvwxyz234567=',
    bitsPerChar: 5
});
const base32padupper = rfc4648({
    prefix: 'C',
    name: 'base32padupper',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567=',
    bitsPerChar: 5
});
const base32hex = rfc4648({
    prefix: 'v',
    name: 'base32hex',
    alphabet: '0123456789abcdefghijklmnopqrstuv',
    bitsPerChar: 5
});
const base32hexupper = rfc4648({
    prefix: 'V',
    name: 'base32hexupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV',
    bitsPerChar: 5
});
const base32hexpad = rfc4648({
    prefix: 't',
    name: 'base32hexpad',
    alphabet: '0123456789abcdefghijklmnopqrstuv=',
    bitsPerChar: 5
});
const base32hexpadupper = rfc4648({
    prefix: 'T',
    name: 'base32hexpadupper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUV=',
    bitsPerChar: 5
});
const base32z = rfc4648({
    prefix: 'h',
    name: 'base32z',
    alphabet: 'ybndrfg8ejkmcpqxot1uwisza345h769',
    bitsPerChar: 5
});

var base32$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base32: base32,
	base32hex: base32hex,
	base32hexpad: base32hexpad,
	base32hexpadupper: base32hexpadupper,
	base32hexupper: base32hexupper,
	base32pad: base32pad,
	base32padupper: base32padupper,
	base32upper: base32upper,
	base32z: base32z
});

const base36 = baseX({
    prefix: 'k',
    name: 'base36',
    alphabet: '0123456789abcdefghijklmnopqrstuvwxyz'
});
const base36upper = baseX({
    prefix: 'K',
    name: 'base36upper',
    alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
});

var base36$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base36: base36,
	base36upper: base36upper
});

const base58btc = baseX({
    name: 'base58btc',
    prefix: 'z',
    alphabet: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
});
const base58flickr = baseX({
    name: 'base58flickr',
    prefix: 'Z',
    alphabet: '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'
});

var base58 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base58btc: base58btc,
	base58flickr: base58flickr
});

const base64 = rfc4648({
    prefix: 'm',
    name: 'base64',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    bitsPerChar: 6
});
const base64pad = rfc4648({
    prefix: 'M',
    name: 'base64pad',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    bitsPerChar: 6
});
const base64url = rfc4648({
    prefix: 'u',
    name: 'base64url',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_',
    bitsPerChar: 6
});
const base64urlpad = rfc4648({
    prefix: 'U',
    name: 'base64urlpad',
    alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=',
    bitsPerChar: 6
});

var base64$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base64: base64,
	base64pad: base64pad,
	base64url: base64url,
	base64urlpad: base64urlpad
});

const base8 = rfc4648({
    prefix: '7',
    name: 'base8',
    alphabet: '01234567',
    bitsPerChar: 3
});

var base8$1 = /*#__PURE__*/Object.freeze({
	__proto__: null,
	base8: base8
});

const identity = from({
    prefix: '\x00',
    name: 'identity',
    encode: (buf) => toString$1(buf),
    decode: (str) => fromString$1(str)
});

var identityBase = /*#__PURE__*/Object.freeze({
	__proto__: null,
	identity: identity
});

new TextEncoder();
new TextDecoder();

/* eslint-disable */
var encode_1 = encode;
var MSB = 0x80, MSBALL = -128, INT = Math.pow(2, 31);
/**
 * @param {number} num
 * @param {number[]} out
 * @param {number} offset
 */
function encode(num, out, offset) {
    out = out || [];
    offset = offset || 0;
    var oldOffset = offset;
    while (num >= INT) {
        out[offset++] = (num & 0xFF) | MSB;
        num /= 128;
    }
    while (num & MSBALL) {
        out[offset++] = (num & 0xFF) | MSB;
        num >>>= 7;
    }
    out[offset] = num | 0;
    // @ts-ignore
    encode.bytes = offset - oldOffset + 1;
    return out;
}
var decode$2 = read;
var MSB$1 = 0x80, REST$1 = 0x7F;
/**
 * @param {string | any[]} buf
 * @param {number} offset
 */
function read(buf, offset) {
    var res = 0, offset = offset || 0, shift = 0, counter = offset, b, l = buf.length;
    do {
        if (counter >= l) {
            // @ts-ignore
            read.bytes = 0;
            throw new RangeError('Could not decode varint');
        }
        b = buf[counter++];
        res += shift < 28
            ? (b & REST$1) << shift
            : (b & REST$1) * Math.pow(2, shift);
        shift += 7;
    } while (b >= MSB$1);
    // @ts-ignore
    read.bytes = counter - offset;
    return res;
}
var N1 = Math.pow(2, 7);
var N2 = Math.pow(2, 14);
var N3 = Math.pow(2, 21);
var N4 = Math.pow(2, 28);
var N5 = Math.pow(2, 35);
var N6 = Math.pow(2, 42);
var N7 = Math.pow(2, 49);
var N8 = Math.pow(2, 56);
var N9 = Math.pow(2, 63);
var length = function (/** @type {number} */ value) {
    return (value < N1 ? 1
        : value < N2 ? 2
            : value < N3 ? 3
                : value < N4 ? 4
                    : value < N5 ? 5
                        : value < N6 ? 6
                            : value < N7 ? 7
                                : value < N8 ? 8
                                    : value < N9 ? 9
                                        : 10);
};
var varint = {
    encode: encode_1,
    decode: decode$2,
    encodingLength: length
};
var _brrp_varint = varint;

function decode$1(data, offset = 0) {
    const code = _brrp_varint.decode(data, offset);
    return [code, _brrp_varint.decode.bytes];
}
function encodeTo(int, target, offset = 0) {
    _brrp_varint.encode(int, target, offset);
    return target;
}
function encodingLength(int) {
    return _brrp_varint.encodingLength(int);
}

/**
 * Creates a multihash digest.
 */
function create(code, digest) {
    const size = digest.byteLength;
    const sizeOffset = encodingLength(code);
    const digestOffset = sizeOffset + encodingLength(size);
    const bytes = new Uint8Array(digestOffset + size);
    encodeTo(code, bytes, 0);
    encodeTo(size, bytes, sizeOffset);
    bytes.set(digest, digestOffset);
    return new Digest(code, size, digest, bytes);
}
/**
 * Turns bytes representation of multihash digest into an instance.
 */
function decode(multihash) {
    const bytes = coerce(multihash);
    const [code, sizeOffset] = decode$1(bytes);
    const [size, digestOffset] = decode$1(bytes.subarray(sizeOffset));
    const digest = bytes.subarray(sizeOffset + digestOffset);
    if (digest.byteLength !== size) {
        throw new Error('Incorrect length');
    }
    return new Digest(code, size, digest, bytes);
}
function equals(a, b) {
    if (a === b) {
        return true;
    }
    else {
        const data = b;
        return (a.code === data.code &&
            a.size === data.size &&
            data.bytes instanceof Uint8Array &&
            equals$1(a.bytes, data.bytes));
    }
}
/**
 * Represents a multihash digest which carries information about the
 * hashing algorithm and an actual hash digest.
 */
class Digest {
    code;
    size;
    digest;
    bytes;
    /**
     * Creates a multihash digest.
     */
    constructor(code, size, digest, bytes) {
        this.code = code;
        this.size = size;
        this.digest = digest;
        this.bytes = bytes;
    }
}

function format(link, base) {
    const { bytes, version } = link;
    switch (version) {
        case 0:
            return toStringV0(bytes, baseCache(link), base ?? base58btc.encoder);
        default:
            return toStringV1(bytes, baseCache(link), (base ?? base32.encoder));
    }
}
const cache = new WeakMap();
function baseCache(cid) {
    const baseCache = cache.get(cid);
    if (baseCache == null) {
        const baseCache = new Map();
        cache.set(cid, baseCache);
        return baseCache;
    }
    return baseCache;
}
class CID {
    code;
    version;
    multihash;
    bytes;
    '/';
    /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param multihash - (Multi)hash of the of the content.
     */
    constructor(version, code, multihash, bytes) {
        this.code = code;
        this.version = version;
        this.multihash = multihash;
        this.bytes = bytes;
        // flag to serializers that this is a CID and
        // should be treated specially
        this['/'] = bytes;
    }
    /**
     * Signalling `cid.asCID === cid` has been replaced with `cid['/'] === cid.bytes`
     * please either use `CID.asCID(cid)` or switch to new signalling mechanism
     *
     * @deprecated
     */
    get asCID() {
        return this;
    }
    // ArrayBufferView
    get byteOffset() {
        return this.bytes.byteOffset;
    }
    // ArrayBufferView
    get byteLength() {
        return this.bytes.byteLength;
    }
    toV0() {
        switch (this.version) {
            case 0: {
                return this;
            }
            case 1: {
                const { code, multihash } = this;
                if (code !== DAG_PB_CODE) {
                    throw new Error('Cannot convert a non dag-pb CID to CIDv0');
                }
                // sha2-256
                if (multihash.code !== SHA_256_CODE) {
                    throw new Error('Cannot convert non sha2-256 multihash CID to CIDv0');
                }
                return (CID.createV0(multihash));
            }
            default: {
                throw Error(`Can not convert CID version ${this.version} to version 0. This is a bug please report`);
            }
        }
    }
    toV1() {
        switch (this.version) {
            case 0: {
                const { code, digest } = this.multihash;
                const multihash = create(code, digest);
                return (CID.createV1(this.code, multihash));
            }
            case 1: {
                return this;
            }
            default: {
                throw Error(`Can not convert CID version ${this.version} to version 1. This is a bug please report`);
            }
        }
    }
    equals(other) {
        return CID.equals(this, other);
    }
    static equals(self, other) {
        const unknown = other;
        return (unknown != null &&
            self.code === unknown.code &&
            self.version === unknown.version &&
            equals(self.multihash, unknown.multihash));
    }
    toString(base) {
        return format(this, base);
    }
    toJSON() {
        return { '/': format(this) };
    }
    link() {
        return this;
    }
    [Symbol.toStringTag] = 'CID';
    // Legacy
    [Symbol.for('nodejs.util.inspect.custom')]() {
        return `CID(${this.toString()})`;
    }
    /**
     * Takes any input `value` and returns a `CID` instance if it was
     * a `CID` otherwise returns `null`. If `value` is instanceof `CID`
     * it will return value back. If `value` is not instance of this CID
     * class, but is compatible CID it will return new instance of this
     * `CID` class. Otherwise returns null.
     *
     * This allows two different incompatible versions of CID library to
     * co-exist and interop as long as binary interface is compatible.
     */
    static asCID(input) {
        if (input == null) {
            return null;
        }
        const value = input;
        if (value instanceof CID) {
            // If value is instance of CID then we're all set.
            return value;
        }
        else if ((value['/'] != null && value['/'] === value.bytes) || value.asCID === value) {
            // If value isn't instance of this CID class but `this.asCID === this` or
            // `value['/'] === value.bytes` is true it is CID instance coming from a
            // different implementation (diff version or duplicate). In that case we
            // rebase it to this `CID` implementation so caller is guaranteed to get
            // instance with expected API.
            const { version, code, multihash, bytes } = value;
            return new CID(version, code, multihash, bytes ?? encodeCID(version, code, multihash.bytes));
        }
        else if (value[cidSymbol] === true) {
            // If value is a CID from older implementation that used to be tagged via
            // symbol we still rebase it to the this `CID` implementation by
            // delegating that to a constructor.
            const { version, multihash, code } = value;
            const digest = decode(multihash);
            return CID.create(version, code, digest);
        }
        else {
            // Otherwise value is not a CID (or an incompatible version of it) in
            // which case we return `null`.
            return null;
        }
    }
    /**
     * @param version - Version of the CID
     * @param code - Code of the codec content is encoded in, see https://github.com/multiformats/multicodec/blob/master/table.csv
     * @param digest - (Multi)hash of the of the content.
     */
    static create(version, code, digest) {
        if (typeof code !== 'number') {
            throw new Error('String codecs are no longer supported');
        }
        if (!(digest.bytes instanceof Uint8Array)) {
            throw new Error('Invalid digest');
        }
        switch (version) {
            case 0: {
                if (code !== DAG_PB_CODE) {
                    throw new Error(`Version 0 CID must use dag-pb (code: ${DAG_PB_CODE}) block encoding`);
                }
                else {
                    return new CID(version, code, digest, digest.bytes);
                }
            }
            case 1: {
                const bytes = encodeCID(version, code, digest.bytes);
                return new CID(version, code, digest, bytes);
            }
            default: {
                throw new Error('Invalid version');
            }
        }
    }
    /**
     * Simplified version of `create` for CIDv0.
     */
    static createV0(digest) {
        return CID.create(0, DAG_PB_CODE, digest);
    }
    /**
     * Simplified version of `create` for CIDv1.
     *
     * @param code - Content encoding format code.
     * @param digest - Multihash of the content.
     */
    static createV1(code, digest) {
        return CID.create(1, code, digest);
    }
    /**
     * Decoded a CID from its binary representation. The byte array must contain
     * only the CID with no additional bytes.
     *
     * An error will be thrown if the bytes provided do not contain a valid
     * binary representation of a CID.
     */
    static decode(bytes) {
        const [cid, remainder] = CID.decodeFirst(bytes);
        if (remainder.length !== 0) {
            throw new Error('Incorrect length');
        }
        return cid;
    }
    /**
     * Decoded a CID from its binary representation at the beginning of a byte
     * array.
     *
     * Returns an array with the first element containing the CID and the second
     * element containing the remainder of the original byte array. The remainder
     * will be a zero-length byte array if the provided bytes only contained a
     * binary CID representation.
     */
    static decodeFirst(bytes) {
        const specs = CID.inspectBytes(bytes);
        const prefixSize = specs.size - specs.multihashSize;
        const multihashBytes = coerce(bytes.subarray(prefixSize, prefixSize + specs.multihashSize));
        if (multihashBytes.byteLength !== specs.multihashSize) {
            throw new Error('Incorrect length');
        }
        const digestBytes = multihashBytes.subarray(specs.multihashSize - specs.digestSize);
        const digest = new Digest(specs.multihashCode, specs.digestSize, digestBytes, multihashBytes);
        const cid = specs.version === 0
            ? CID.createV0(digest)
            : CID.createV1(specs.codec, digest);
        return [cid, bytes.subarray(specs.size)];
    }
    /**
     * Inspect the initial bytes of a CID to determine its properties.
     *
     * Involves decoding up to 4 varints. Typically this will require only 4 to 6
     * bytes but for larger multicodec code values and larger multihash digest
     * lengths these varints can be quite large. It is recommended that at least
     * 10 bytes be made available in the `initialBytes` argument for a complete
     * inspection.
     */
    static inspectBytes(initialBytes) {
        let offset = 0;
        const next = () => {
            const [i, length] = decode$1(initialBytes.subarray(offset));
            offset += length;
            return i;
        };
        let version = next();
        let codec = DAG_PB_CODE;
        if (version === 18) {
            // CIDv0
            version = 0;
            offset = 0;
        }
        else {
            codec = next();
        }
        if (version !== 0 && version !== 1) {
            throw new RangeError(`Invalid CID version ${version}`);
        }
        const prefixSize = offset;
        const multihashCode = next(); // multihash code
        const digestSize = next(); // multihash length
        const size = offset + digestSize;
        const multihashSize = size - prefixSize;
        return { version, codec, multihashCode, digestSize, multihashSize, size };
    }
    /**
     * Takes cid in a string representation and creates an instance. If `base`
     * decoder is not provided will use a default from the configuration. It will
     * throw an error if encoding of the CID is not compatible with supplied (or
     * a default decoder).
     */
    static parse(source, base) {
        const [prefix, bytes] = parseCIDtoBytes(source, base);
        const cid = CID.decode(bytes);
        if (cid.version === 0 && source[0] !== 'Q') {
            throw Error('Version 0 CID string must not include multibase prefix');
        }
        // Cache string representation to avoid computing it on `this.toString()`
        baseCache(cid).set(prefix, source);
        return cid;
    }
}
function parseCIDtoBytes(source, base) {
    switch (source[0]) {
        // CIDv0 is parsed differently
        case 'Q': {
            const decoder = base ?? base58btc;
            return [
                base58btc.prefix,
                decoder.decode(`${base58btc.prefix}${source}`)
            ];
        }
        case base58btc.prefix: {
            const decoder = base ?? base58btc;
            return [base58btc.prefix, decoder.decode(source)];
        }
        case base32.prefix: {
            const decoder = base ?? base32;
            return [base32.prefix, decoder.decode(source)];
        }
        case base36.prefix: {
            const decoder = base ?? base36;
            return [base36.prefix, decoder.decode(source)];
        }
        default: {
            if (base == null) {
                throw Error('To parse non base32, base36 or base58btc encoded CID multibase decoder must be provided');
            }
            return [source[0], base.decode(source)];
        }
    }
}
function toStringV0(bytes, cache, base) {
    const { prefix } = base;
    if (prefix !== base58btc.prefix) {
        throw Error(`Cannot string encode V0 in ${base.name} encoding`);
    }
    const cid = cache.get(prefix);
    if (cid == null) {
        const cid = base.encode(bytes).slice(1);
        cache.set(prefix, cid);
        return cid;
    }
    else {
        return cid;
    }
}
function toStringV1(bytes, cache, base) {
    const { prefix } = base;
    const cid = cache.get(prefix);
    if (cid == null) {
        const cid = base.encode(bytes);
        cache.set(prefix, cid);
        return cid;
    }
    else {
        return cid;
    }
}
const DAG_PB_CODE = 0x70;
const SHA_256_CODE = 0x12;
function encodeCID(version, code, multihash) {
    const codeOffset = encodingLength(version);
    const hashOffset = codeOffset + encodingLength(code);
    const bytes = new Uint8Array(hashOffset + multihash.byteLength);
    encodeTo(version, bytes, 0);
    encodeTo(code, bytes, codeOffset);
    bytes.set(multihash, hashOffset);
    return bytes;
}
const cidSymbol = Symbol.for('@ipld/js-cid/CID');

const bases = { ...identityBase, ...base2$1, ...base8$1, ...base10$1, ...base16$1, ...base32$1, ...base36$1, ...base58, ...base64$1, ...base256emoji$1 };

function createCodec(name, prefix, encode, decode) {
    return {
        name,
        prefix,
        encoder: {
            name,
            prefix,
            encode
        },
        decoder: {
            decode
        }
    };
}
const string = createCodec('utf8', 'u', (buf) => {
    const decoder = new TextDecoder('utf8');
    return 'u' + decoder.decode(buf);
}, (str) => {
    const encoder = new TextEncoder();
    return encoder.encode(str.substring(1));
});
const ascii = createCodec('ascii', 'a', (buf) => {
    let string = 'a';
    for (let i = 0; i < buf.length; i++) {
        string += String.fromCharCode(buf[i]);
    }
    return string;
}, (str) => {
    str = str.substring(1);
    const buf = allocUnsafe(str.length);
    for (let i = 0; i < str.length; i++) {
        buf[i] = str.charCodeAt(i);
    }
    return buf;
});
const BASES = {
    utf8: string,
    'utf-8': string,
    hex: bases.base16,
    latin1: ascii,
    ascii,
    binary: ascii,
    ...bases
};

/**
 * Turns a `Uint8Array` into a string.
 *
 * Supports `utf8`, `utf-8` and any encoding supported by the multibase module.
 *
 * Also `ascii` which is similar to node's 'binary' encoding.
 */
function toString(array, encoding = 'utf8') {
    const base = BASES[encoding];
    if (base == null) {
        throw new Error(`Unsupported encoding "${encoding}"`);
    }
    // strip multibase prefix
    return base.encoder.encode(array).substring(1);
}

/**
 * Thrown when an invalid multiaddr is encountered
 */
class InvalidMultiaddrError extends Error {
    static name = 'InvalidMultiaddrError';
    name = 'InvalidMultiaddrError';
}
class ValidationError extends Error {
    static name = 'ValidationError';
    name = 'ValidationError';
}
class InvalidParametersError extends Error {
    static name = 'InvalidParametersError';
    name = 'InvalidParametersError';
}
class UnknownProtocolError extends Error {
    static name = 'UnknownProtocolError';
    name = 'UnknownProtocolError';
}

/**
 * Create a `Uint8Array` from the passed string
 *
 * Supports `utf8`, `utf-8`, `hex`, and any encoding supported by the multiformats module.
 *
 * Also `ascii` which is similar to node's 'binary' encoding.
 */
function fromString(string, encoding = 'utf8') {
    const base = BASES[encoding];
    if (base == null) {
        throw new Error(`Unsupported encoding "${encoding}"`);
    }
    // add multibase prefix
    return base.decoder.decode(`${base.prefix}${string}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
}

/* eslint-disable @typescript-eslint/no-unsafe-return */
class Parser {
    index = 0;
    input = "";
    new(input) {
        this.index = 0;
        this.input = input;
        return this;
    }
    /** Run a parser, and restore the pre-parse state if it fails. */
    readAtomically(fn) {
        const index = this.index;
        const result = fn();
        if (result === undefined) {
            this.index = index;
        }
        return result;
    }
    /** Run a parser, but fail if the entire input wasn't consumed. Doesn't run atomically. */
    parseWith(fn) {
        const result = fn();
        if (this.index !== this.input.length) {
            return undefined;
        }
        return result;
    }
    /** Peek the next character from the input */
    peekChar() {
        if (this.index >= this.input.length) {
            return undefined;
        }
        return this.input[this.index];
    }
    /** Read the next character from the input */
    readChar() {
        if (this.index >= this.input.length) {
            return undefined;
        }
        return this.input[this.index++];
    }
    /** Read the next character from the input if it matches the target. */
    readGivenChar(target) {
        return this.readAtomically(() => {
            const char = this.readChar();
            if (char !== target) {
                return undefined;
            }
            return char;
        });
    }
    /**
     * Helper for reading separators in an indexed loop. Reads the separator
     * character iff index > 0, then runs the parser. When used in a loop,
     * the separator character will only be read on index > 0 (see
     * readIPv4Addr for an example)
     */
    readSeparator(sep, index, inner) {
        return this.readAtomically(() => {
            if (index > 0) {
                if (this.readGivenChar(sep) === undefined) {
                    return undefined;
                }
            }
            return inner();
        });
    }
    /**
     * Read a number off the front of the input in the given radix, stopping
     * at the first non-digit character or eof. Fails if the number has more
     * digits than max_digits or if there is no number.
     */
    readNumber(radix, maxDigits, allowZeroPrefix, maxBytes) {
        return this.readAtomically(() => {
            let result = 0;
            let digitCount = 0;
            const leadingChar = this.peekChar();
            if (leadingChar === undefined) {
                return undefined;
            }
            const hasLeadingZero = leadingChar === "0";
            const maxValue = 2 ** (8 * maxBytes) - 1;
            // eslint-disable-next-line no-constant-condition
            while (true) {
                const digit = this.readAtomically(() => {
                    const char = this.readChar();
                    if (char === undefined) {
                        return undefined;
                    }
                    const num = Number.parseInt(char, radix);
                    if (Number.isNaN(num)) {
                        return undefined;
                    }
                    return num;
                });
                if (digit === undefined) {
                    break;
                }
                result *= radix;
                result += digit;
                if (result > maxValue) {
                    return undefined;
                }
                digitCount += 1;
                if (maxDigits !== undefined) {
                    if (digitCount > maxDigits) {
                        return undefined;
                    }
                }
            }
            if (digitCount === 0) {
                return undefined;
            }
            else if (!allowZeroPrefix && hasLeadingZero && digitCount > 1) {
                return undefined;
            }
            else {
                return result;
            }
        });
    }
    /** Read an IPv4 address. */
    readIPv4Addr() {
        return this.readAtomically(() => {
            const out = new Uint8Array(4);
            for (let i = 0; i < out.length; i++) {
                const ix = this.readSeparator(".", i, () => this.readNumber(10, 3, false, 1));
                if (ix === undefined) {
                    return undefined;
                }
                out[i] = ix;
            }
            return out;
        });
    }
    /** Read an IPv6 Address. */
    readIPv6Addr() {
        /**
         * Read a chunk of an IPv6 address into `groups`. Returns the number
         * of groups read, along with a bool indicating if an embedded
         * trailing IPv4 address was read. Specifically, read a series of
         * colon-separated IPv6 groups (0x0000 - 0xFFFF), with an optional
         * trailing embedded IPv4 address.
         */
        const readGroups = (groups) => {
            for (let i = 0; i < groups.length / 2; i++) {
                const ix = i * 2;
                // Try to read a trailing embedded IPv4 address. There must be at least 4 groups left.
                if (i < groups.length - 3) {
                    const ipv4 = this.readSeparator(":", i, () => this.readIPv4Addr());
                    if (ipv4 !== undefined) {
                        groups[ix] = ipv4[0];
                        groups[ix + 1] = ipv4[1];
                        groups[ix + 2] = ipv4[2];
                        groups[ix + 3] = ipv4[3];
                        return [ix + 4, true];
                    }
                }
                const group = this.readSeparator(":", i, () => this.readNumber(16, 4, true, 2));
                if (group === undefined) {
                    return [ix, false];
                }
                groups[ix] = group >> 8;
                groups[ix + 1] = group & 255;
            }
            return [groups.length, false];
        };
        return this.readAtomically(() => {
            // Read the front part of the address; either the whole thing, or up to the first ::
            const head = new Uint8Array(16);
            const [headSize, headIp4] = readGroups(head);
            if (headSize === 16) {
                return head;
            }
            // IPv4 part is not allowed before `::`
            if (headIp4) {
                return undefined;
            }
            // Read `::` if previous code parsed less than 8 groups.
            // `::` indicates one or more groups of 16 bits of zeros.
            if (this.readGivenChar(":") === undefined) {
                return undefined;
            }
            if (this.readGivenChar(":") === undefined) {
                return undefined;
            }
            // Read the back part of the address. The :: must contain at least one
            // set of zeroes, so our max length is 7.
            const tail = new Uint8Array(14);
            const limit = 16 - (headSize + 2);
            const [tailSize] = readGroups(tail.subarray(0, limit));
            // Concat the head and tail of the IP address
            head.set(tail.subarray(0, tailSize), 16 - tailSize);
            return head;
        });
    }
    /** Read an IP Address, either IPv4 or IPv6. */
    readIPAddr() {
        return this.readIPv4Addr() ?? this.readIPv6Addr();
    }
}

// See https://stackoverflow.com/questions/166132/maximum-length-of-the-textual-representation-of-an-ipv6-address
const MAX_IPV6_LENGTH = 45;
const MAX_IPV4_LENGTH = 15;
const parser = new Parser();
/** Parse `input` into IPv4 bytes. */
function parseIPv4(input) {
    if (input.length > MAX_IPV4_LENGTH) {
        return undefined;
    }
    return parser.new(input).parseWith(() => parser.readIPv4Addr());
}
/** Parse `input` into IPv6 bytes. */
function parseIPv6(input) {
    // strip zone index if it is present
    if (input.includes("%")) {
        input = input.split("%")[0];
    }
    if (input.length > MAX_IPV6_LENGTH) {
        return undefined;
    }
    return parser.new(input).parseWith(() => parser.readIPv6Addr());
}

/** Check if `input` is IPv4. */
function isIPv4(input) {
    return Boolean(parseIPv4(input));
}
/** Check if `input` is IPv6. */
function isIPv6(input) {
    return Boolean(parseIPv6(input));
}

// the values here come from https://github.com/multiformats/multiaddr/blob/master/protocols.csv
const CODE_IP4 = 4;
const CODE_TCP = 6;
const CODE_UDP = 273;
const CODE_DCCP = 33;
const CODE_IP6 = 41;
const CODE_IP6ZONE = 42;
const CODE_IPCIDR = 43;
const CODE_DNS = 53;
const CODE_DNS4 = 54;
const CODE_DNS6 = 55;
const CODE_DNSADDR = 56;
const CODE_SCTP = 132;
const CODE_UDT = 301;
const CODE_UTP = 302;
const CODE_UNIX = 400;
const CODE_P2P = 421; // also IPFS
const CODE_ONION = 444;
const CODE_ONION3 = 445;
const CODE_GARLIC64 = 446;
const CODE_GARLIC32 = 447;
const CODE_TLS = 448;
const CODE_SNI = 449;
const CODE_NOISE = 454;
const CODE_QUIC = 460;
const CODE_QUIC_V1 = 461;
const CODE_WEBTRANSPORT = 465;
const CODE_CERTHASH = 466;
const CODE_HTTP = 480;
const CODE_HTTP_PATH = 481;
const CODE_HTTPS = 443;
const CODE_WS = 477;
const CODE_WSS = 478;
const CODE_P2P_WEBSOCKET_STAR = 479;
const CODE_P2P_STARDUST = 277;
const CODE_P2P_WEBRTC_STAR = 275;
const CODE_P2P_WEBRTC_DIRECT = 276;
const CODE_WEBRTC_DIRECT = 280;
const CODE_WEBRTC = 281;
const CODE_P2P_CIRCUIT = 290;
const CODE_MEMORY = 777;

function bytesToString(base) {
    return (buf) => {
        return toString(buf, base);
    };
}
function stringToBytes(base) {
    return (buf) => {
        return fromString(buf, base);
    };
}
function bytes2port(buf) {
    const view = new DataView(buf.buffer);
    return view.getUint16(buf.byteOffset).toString();
}
function port2bytes(port) {
    const buf = new ArrayBuffer(2);
    const view = new DataView(buf);
    view.setUint16(0, typeof port === 'string' ? parseInt(port) : port);
    return new Uint8Array(buf);
}
function onion2bytes(str) {
    const addr = str.split(':');
    if (addr.length !== 2) {
        throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`);
    }
    if (addr[0].length !== 16) {
        throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion address.`);
    }
    // onion addresses do not include the multibase prefix, add it before decoding
    const buf = fromString(addr[0], 'base32');
    // onion port number
    const port = parseInt(addr[1], 10);
    if (port < 1 || port > 65536) {
        throw new Error('Port number is not in range(1, 65536)');
    }
    const portBuf = port2bytes(port);
    return concat([buf, portBuf], buf.length + portBuf.length);
}
function onion32bytes(str) {
    const addr = str.split(':');
    if (addr.length !== 2) {
        throw new Error(`failed to parse onion addr: ["'${addr.join('", "')}'"]' does not contain a port number`);
    }
    if (addr[0].length !== 56) {
        throw new Error(`failed to parse onion addr: ${addr[0]} not a Tor onion3 address.`);
    }
    // onion addresses do not include the multibase prefix, add it before decoding
    const buf = base32.decode(`b${addr[0]}`);
    // onion port number
    const port = parseInt(addr[1], 10);
    if (port < 1 || port > 65536) {
        throw new Error('Port number is not in range(1, 65536)');
    }
    const portBuf = port2bytes(port);
    return concat([buf, portBuf], buf.length + portBuf.length);
}
function bytes2onion(buf) {
    const addrBytes = buf.subarray(0, buf.length - 2);
    const portBytes = buf.subarray(buf.length - 2);
    const addr = toString(addrBytes, 'base32');
    const port = bytes2port(portBytes);
    return `${addr}:${port}`;
}
// Copied from https://github.com/indutny/node-ip/blob/master/lib/ip.js#L7
// but with buf/offset args removed because we don't use them
const ip4ToBytes = function (ip) {
    ip = ip.toString().trim();
    const bytes = new Uint8Array(4);
    ip.split(/\./g).forEach((byte, index) => {
        const value = parseInt(byte, 10);
        if (isNaN(value) || value < 0 || value > 0xff) {
            throw new InvalidMultiaddrError('Invalid byte value in IP address');
        }
        bytes[index] = value;
    });
    return bytes;
};
// Copied from https://github.com/indutny/node-ip/blob/master/lib/ip.js#L7
// but with buf/offset args removed because we don't use them
const ip6ToBytes = function (ip) {
    let offset = 0;
    ip = ip.toString().trim();
    const sections = ip.split(':', 8);
    let i;
    for (i = 0; i < sections.length; i++) {
        const isv4 = isIPv4(sections[i]);
        let v4Buffer;
        if (isv4) {
            v4Buffer = ip4ToBytes(sections[i]);
            sections[i] = toString(v4Buffer.subarray(0, 2), 'base16');
        }
        if (v4Buffer != null && ++i < 8) {
            sections.splice(i, 0, toString(v4Buffer.subarray(2, 4), 'base16'));
        }
    }
    if (sections[0] === '') {
        while (sections.length < 8) {
            sections.unshift('0');
        }
    }
    else if (sections[sections.length - 1] === '') {
        while (sections.length < 8) {
            sections.push('0');
        }
    }
    else if (sections.length < 8) {
        for (i = 0; i < sections.length && sections[i] !== ''; i++) { }
        const argv = [i, 1];
        for (i = 9 - sections.length; i > 0; i--) {
            argv.push('0');
        }
        sections.splice.apply(sections, argv);
    }
    const bytes = new Uint8Array(offset + 16);
    for (i = 0; i < sections.length; i++) {
        if (sections[i] === '') {
            sections[i] = '0';
        }
        const word = parseInt(sections[i], 16);
        if (isNaN(word) || word < 0 || word > 0xffff) {
            throw new InvalidMultiaddrError('Invalid byte value in IP address');
        }
        bytes[offset++] = (word >> 8) & 0xff;
        bytes[offset++] = word & 0xff;
    }
    return bytes;
};
// Copied from https://github.com/indutny/node-ip/blob/master/lib/ip.js#L63
const ip4ToString = function (buf) {
    if (buf.byteLength !== 4) {
        throw new InvalidMultiaddrError('IPv4 address was incorrect length');
    }
    const result = [];
    for (let i = 0; i < buf.byteLength; i++) {
        result.push(buf[i]);
    }
    return result.join('.');
};
const ip6ToString = function (buf) {
    if (buf.byteLength !== 16) {
        throw new InvalidMultiaddrError('IPv6 address was incorrect length');
    }
    const result = [];
    for (let i = 0; i < buf.byteLength; i += 2) {
        const byte1 = buf[i];
        const byte2 = buf[i + 1];
        const tuple = `${byte1.toString(16).padStart(2, '0')}${byte2.toString(16).padStart(2, '0')}`;
        result.push(tuple);
    }
    const ip = result.join(':');
    try {
        const url = new URL(`http://[${ip}]`);
        return url.hostname.substring(1, url.hostname.length - 1);
    }
    catch {
        throw new InvalidMultiaddrError(`Invalid IPv6 address "${ip}"`);
    }
};
function ip6StringToValue(str) {
    try {
        const url = new URL(`http://[${str}]`);
        return url.hostname.substring(1, url.hostname.length - 1);
    }
    catch {
        throw new InvalidMultiaddrError(`Invalid IPv6 address "${str}"`);
    }
}
const decoders = Object.values(bases).map((c) => c.decoder);
const anybaseDecoder = (function () {
    let acc = decoders[0].or(decoders[1]);
    decoders.slice(2).forEach((d) => (acc = acc.or(d)));
    return acc;
})();
function mb2bytes(mbstr) {
    return anybaseDecoder.decode(mbstr);
}
function bytes2mb(base) {
    return (buf) => {
        return base.encoder.encode(buf);
    };
}

function integer(value) {
    const int = parseInt(value);
    if (int.toString() !== value) {
        throw new ValidationError('Value must be an integer');
    }
}
function positive(value) {
    if (value < 0) {
        throw new ValidationError('Value must be a positive integer, or zero');
    }
}
function maxValue(max) {
    return (value) => {
        if (value > max) {
            throw new ValidationError(`Value must be smaller than or equal to ${max}`);
        }
    };
}
function validate$1(...funcs) {
    return (value) => {
        for (const fn of funcs) {
            fn(value);
        }
    };
}
const validatePort = validate$1(integer, positive, maxValue(65_535));

const V = -1;
class Registry {
    protocolsByCode = new Map();
    protocolsByName = new Map();
    getProtocol(key) {
        let codec;
        if (typeof key === 'string') {
            codec = this.protocolsByName.get(key);
        }
        else {
            codec = this.protocolsByCode.get(key);
        }
        if (codec == null) {
            throw new UnknownProtocolError(`Protocol ${key} was unknown`);
        }
        return codec;
    }
    addProtocol(codec) {
        this.protocolsByCode.set(codec.code, codec);
        this.protocolsByName.set(codec.name, codec);
        codec.aliases?.forEach(alias => {
            this.protocolsByName.set(alias, codec);
        });
    }
    removeProtocol(code) {
        const codec = this.protocolsByCode.get(code);
        if (codec == null) {
            return;
        }
        this.protocolsByCode.delete(codec.code);
        this.protocolsByName.delete(codec.name);
        codec.aliases?.forEach(alias => {
            this.protocolsByName.delete(alias);
        });
    }
}
const registry = new Registry();
const codecs = [{
        code: CODE_IP4,
        name: 'ip4',
        size: 32,
        valueToBytes: ip4ToBytes,
        bytesToValue: ip4ToString,
        validate: (value) => {
            if (!isIPv4(value)) {
                throw new ValidationError(`Invalid IPv4 address "${value}"`);
            }
        }
    }, {
        code: CODE_TCP,
        name: 'tcp',
        size: 16,
        valueToBytes: port2bytes,
        bytesToValue: bytes2port,
        validate: validatePort
    }, {
        code: CODE_UDP,
        name: 'udp',
        size: 16,
        valueToBytes: port2bytes,
        bytesToValue: bytes2port,
        validate: validatePort
    }, {
        code: CODE_DCCP,
        name: 'dccp',
        size: 16,
        valueToBytes: port2bytes,
        bytesToValue: bytes2port,
        validate: validatePort
    }, {
        code: CODE_IP6,
        name: 'ip6',
        size: 128,
        valueToBytes: ip6ToBytes,
        bytesToValue: ip6ToString,
        stringToValue: ip6StringToValue,
        validate: (value) => {
            if (!isIPv6(value)) {
                throw new ValidationError(`Invalid IPv6 address "${value}"`);
            }
        }
    }, {
        code: CODE_IP6ZONE,
        name: 'ip6zone',
        size: V
    }, {
        code: CODE_IPCIDR,
        name: 'ipcidr',
        size: 8,
        bytesToValue: bytesToString('base10'),
        valueToBytes: stringToBytes('base10')
    }, {
        code: CODE_DNS,
        name: 'dns',
        size: V,
        resolvable: true
    }, {
        code: CODE_DNS4,
        name: 'dns4',
        size: V,
        resolvable: true
    }, {
        code: CODE_DNS6,
        name: 'dns6',
        size: V,
        resolvable: true
    }, {
        code: CODE_DNSADDR,
        name: 'dnsaddr',
        size: V,
        resolvable: true
    }, {
        code: CODE_SCTP,
        name: 'sctp',
        size: 16,
        valueToBytes: port2bytes,
        bytesToValue: bytes2port,
        validate: validatePort
    }, {
        code: CODE_UDT,
        name: 'udt'
    }, {
        code: CODE_UTP,
        name: 'utp'
    }, {
        code: CODE_UNIX,
        name: 'unix',
        size: V,
        path: true,
        stringToValue: (str) => decodeURIComponent(str),
        valueToString: (val) => encodeURIComponent(val)
    }, {
        code: CODE_P2P,
        name: 'p2p',
        aliases: ['ipfs'],
        size: V,
        bytesToValue: bytesToString('base58btc'),
        valueToBytes: (val) => {
            if (val.startsWith('Q') || val.startsWith('1')) {
                return stringToBytes('base58btc')(val);
            }
            return CID.parse(val).multihash.bytes;
        }
    }, {
        code: CODE_ONION,
        name: 'onion',
        size: 96,
        bytesToValue: bytes2onion,
        valueToBytes: onion2bytes
    }, {
        code: CODE_ONION3,
        name: 'onion3',
        size: 296,
        bytesToValue: bytes2onion,
        valueToBytes: onion32bytes
    }, {
        code: CODE_GARLIC64,
        name: 'garlic64',
        size: V
    }, {
        code: CODE_GARLIC32,
        name: 'garlic32',
        size: V
    }, {
        code: CODE_TLS,
        name: 'tls'
    }, {
        code: CODE_SNI,
        name: 'sni',
        size: V
    }, {
        code: CODE_NOISE,
        name: 'noise'
    }, {
        code: CODE_QUIC,
        name: 'quic'
    }, {
        code: CODE_QUIC_V1,
        name: 'quic-v1'
    }, {
        code: CODE_WEBTRANSPORT,
        name: 'webtransport'
    }, {
        code: CODE_CERTHASH,
        name: 'certhash',
        size: V,
        bytesToValue: bytes2mb(base64url),
        valueToBytes: mb2bytes
    }, {
        code: CODE_HTTP,
        name: 'http'
    }, {
        code: CODE_HTTP_PATH,
        name: 'http-path',
        size: V,
        stringToValue: (str) => `/${decodeURIComponent(str)}`,
        valueToString: (val) => encodeURIComponent(val.substring(1))
    }, {
        code: CODE_HTTPS,
        name: 'https'
    }, {
        code: CODE_WS,
        name: 'ws'
    }, {
        code: CODE_WSS,
        name: 'wss'
    }, {
        code: CODE_P2P_WEBSOCKET_STAR,
        name: 'p2p-websocket-star'
    }, {
        code: CODE_P2P_STARDUST,
        name: 'p2p-stardust'
    }, {
        code: CODE_P2P_WEBRTC_STAR,
        name: 'p2p-webrtc-star'
    }, {
        code: CODE_P2P_WEBRTC_DIRECT,
        name: 'p2p-webrtc-direct'
    }, {
        code: CODE_WEBRTC_DIRECT,
        name: 'webrtc-direct'
    }, {
        code: CODE_WEBRTC,
        name: 'webrtc'
    }, {
        code: CODE_P2P_CIRCUIT,
        name: 'p2p-circuit'
    }, {
        code: CODE_MEMORY,
        name: 'memory',
        size: V
    }];
codecs.forEach(codec => {
    registry.addProtocol(codec);
});

function bytesToComponents(bytes) {
    const components = [];
    let i = 0;
    while (i < bytes.length) {
        const code = decode$6(bytes, i);
        const codec = registry.getProtocol(code);
        const codeLength = encodingLength$1(code);
        const size = sizeForAddr(codec, bytes, i + codeLength);
        let sizeLength = 0;
        if (size > 0 && codec.size === V) {
            sizeLength = encodingLength$1(size);
        }
        const componentLength = codeLength + sizeLength + size;
        const component = {
            code,
            name: codec.name,
            bytes: bytes.subarray(i, i + componentLength)
        };
        if (size > 0) {
            const valueOffset = i + codeLength + sizeLength;
            const valueBytes = bytes.subarray(valueOffset, valueOffset + size);
            component.value = codec.bytesToValue?.(valueBytes) ?? toString(valueBytes);
        }
        components.push(component);
        i += componentLength;
    }
    return components;
}
function componentsToBytes(components) {
    let length = 0;
    const bytes = [];
    for (const component of components) {
        if (component.bytes == null) {
            const codec = registry.getProtocol(component.code);
            const codecLength = encodingLength$1(component.code);
            let valueBytes;
            let valueLength = 0;
            let valueLengthLength = 0;
            if (component.value != null) {
                valueBytes = codec.valueToBytes?.(component.value) ?? fromString(component.value);
                valueLength = valueBytes.byteLength;
                if (codec.size === V) {
                    valueLengthLength = encodingLength$1(valueLength);
                }
            }
            const bytes = new Uint8Array(codecLength + valueLengthLength + valueLength);
            // encode the protocol code
            let offset = 0;
            encodeUint8Array(component.code, bytes, offset);
            offset += codecLength;
            // if there is a value
            if (valueBytes != null) {
                // if the value has variable length, encode the length
                if (codec.size === V) {
                    encodeUint8Array(valueLength, bytes, offset);
                    offset += valueLengthLength;
                }
                // finally encode the value
                bytes.set(valueBytes, offset);
            }
            component.bytes = bytes;
        }
        bytes.push(component.bytes);
        length += component.bytes.byteLength;
    }
    return concat(bytes, length);
}
function stringToComponents(string) {
    if (string.charAt(0) !== '/') {
        throw new InvalidMultiaddrError('String multiaddr must start with "/"');
    }
    const components = [];
    let collecting = 'protocol';
    let value = '';
    let protocol = '';
    for (let i = 1; i < string.length; i++) {
        const char = string.charAt(i);
        if (char !== '/') {
            if (collecting === 'protocol') {
                protocol += string.charAt(i);
            }
            else {
                value += string.charAt(i);
            }
        }
        const ended = i === string.length - 1;
        if (char === '/' || ended) {
            const codec = registry.getProtocol(protocol);
            if (collecting === 'protocol') {
                if (codec.size == null || codec.size === 0) {
                    // a protocol without an address, eg. `/tls`
                    components.push({
                        code: codec.code,
                        name: codec.name
                    });
                    value = '';
                    protocol = '';
                    collecting = 'protocol';
                    continue;
                }
                else if (ended) {
                    throw new InvalidMultiaddrError(`Component ${protocol} was missing value`);
                }
                // continue collecting value
                collecting = 'value';
            }
            else if (collecting === 'value') {
                const component = {
                    code: codec.code,
                    name: codec.name
                };
                if (codec.size != null && codec.size !== 0) {
                    if (value === '') {
                        throw new InvalidMultiaddrError(`Component ${protocol} was missing value`);
                    }
                    component.value = codec.stringToValue?.(value) ?? value;
                }
                components.push(component);
                value = '';
                protocol = '';
                collecting = 'protocol';
            }
        }
    }
    if (protocol !== '' && value !== '') {
        throw new InvalidMultiaddrError('Incomplete multiaddr');
    }
    return components;
}
function componentsToString(components) {
    return `/${components.flatMap(component => {
        if (component.value == null) {
            return component.name;
        }
        const codec = registry.getProtocol(component.code);
        if (codec == null) {
            throw new InvalidMultiaddrError(`Unknown protocol code ${component.code}`);
        }
        return [
            component.name,
            codec.valueToString?.(component.value) ?? component.value
        ];
    }).join('/')}`;
}
/**
 * For the passed address, return the serialized size
 */
function sizeForAddr(codec, bytes, offset) {
    if (codec.size == null || codec.size === 0) {
        return 0;
    }
    if (codec.size > 0) {
        return codec.size / 8;
    }
    return decode$6(bytes, offset);
}

const inspect = Symbol.for('nodejs.util.inspect.custom');
const symbol = Symbol.for('@multiformats/multiaddr');
const DNS_CODES = [
    CODE_DNS,
    CODE_DNS4,
    CODE_DNS6,
    CODE_DNSADDR
];
class NoAvailableResolverError extends Error {
    constructor(message = 'No available resolver') {
        super(message);
        this.name = 'NoAvailableResolverError';
    }
}
function toComponents(addr) {
    if (addr == null) {
        addr = '/';
    }
    if (isMultiaddr(addr)) {
        return addr.getComponents();
    }
    if (addr instanceof Uint8Array) {
        return bytesToComponents(addr);
    }
    if (typeof addr === 'string') {
        addr = addr
            .replace(/\/(\/)+/, '/')
            .replace(/(\/)+$/, '');
        if (addr === '') {
            addr = '/';
        }
        return stringToComponents(addr);
    }
    if (Array.isArray(addr)) {
        return addr;
    }
    throw new InvalidMultiaddrError('Must be a string, Uint8Array, Component[], or another Multiaddr');
}
/**
 * Creates a {@link Multiaddr} from a {@link MultiaddrInput}
 */
class Multiaddr {
    [symbol] = true;
    #components;
    // cache string representation
    #string;
    // cache byte representation
    #bytes;
    constructor(addr = '/', options = {}) {
        this.#components = toComponents(addr);
        if (options.validate !== false) {
            validate(this);
        }
    }
    get bytes() {
        if (this.#bytes == null) {
            this.#bytes = componentsToBytes(this.#components);
        }
        return this.#bytes;
    }
    toString() {
        if (this.#string == null) {
            this.#string = componentsToString(this.#components);
        }
        return this.#string;
    }
    toJSON() {
        return this.toString();
    }
    toOptions() {
        let family;
        let transport;
        let host;
        let port;
        let zone = '';
        for (const { code, name, value } of this.#components) {
            if (code === CODE_IP6ZONE) {
                zone = `%${value ?? ''}`;
            }
            // default to https when protocol & port are omitted from DNS addrs
            if (DNS_CODES.includes(code)) {
                transport = 'tcp';
                port = 443;
                host = `${value ?? ''}${zone}`;
                family = code === CODE_DNS6 ? 6 : 4;
            }
            if (code === CODE_TCP || code === CODE_UDP) {
                transport = name === 'tcp' ? 'tcp' : 'udp';
                port = parseInt(value ?? '');
            }
            if (code === CODE_IP4 || code === CODE_IP6) {
                transport = 'tcp';
                host = `${value ?? ''}${zone}`;
                family = code === CODE_IP6 ? 6 : 4;
            }
        }
        if (family == null || transport == null || host == null || port == null) {
            throw new Error('multiaddr must have a valid format: "/{ip4, ip6, dns4, dns6, dnsaddr}/{address}/{tcp, udp}/{port}".');
        }
        const opts = {
            family,
            host,
            transport,
            port
        };
        return opts;
    }
    getComponents() {
        return [
            ...this.#components
        ];
    }
    protos() {
        return this.#components.map(({ code, value }) => {
            const codec = registry.getProtocol(code);
            return {
                code,
                size: codec.size ?? 0,
                name: codec.name,
                resolvable: Boolean(codec.resolvable),
                path: Boolean(codec.path)
            };
        });
    }
    protoCodes() {
        return this.#components.map(({ code }) => code);
    }
    protoNames() {
        return this.#components.map(({ name }) => name);
    }
    tuples() {
        return this.#components.map(({ code, value }) => {
            if (value == null) {
                return [code];
            }
            const codec = registry.getProtocol(code);
            const output = [code];
            if (value != null) {
                output.push(codec.valueToBytes?.(value) ?? fromString(value));
            }
            return output;
        });
    }
    stringTuples() {
        return this.#components.map(({ code, value }) => {
            if (value == null) {
                return [code];
            }
            return [code, value];
        });
    }
    encapsulate(addr) {
        const ma = new Multiaddr(addr);
        return new Multiaddr([
            ...this.#components,
            ...ma.getComponents()
        ], {
            validate: false
        });
    }
    decapsulate(addr) {
        const addrString = addr.toString();
        const s = this.toString();
        const i = s.lastIndexOf(addrString);
        if (i < 0) {
            throw new InvalidParametersError(`Address ${this.toString()} does not contain subaddress: ${addr.toString()}`);
        }
        return new Multiaddr(s.slice(0, i), {
            validate: false
        });
    }
    decapsulateCode(code) {
        let index;
        for (let i = this.#components.length - 1; i > -1; i--) {
            if (this.#components[i].code === code) {
                index = i;
                break;
            }
        }
        return new Multiaddr(this.#components.slice(0, index), {
            validate: false
        });
    }
    getPeerId() {
        try {
            let tuples = [];
            this.#components.forEach(({ code, value }) => {
                if (code === CODE_P2P) {
                    tuples.push([code, value]);
                }
                // if this is a p2p-circuit address, return the target peer id if present
                // not the peer id of the relay
                if (code === CODE_P2P_CIRCUIT) {
                    tuples = [];
                }
            });
            // Get the last ipfs tuple ['p2p', 'peerid string']
            const tuple = tuples.pop();
            if (tuple?.[1] != null) {
                const peerIdStr = tuple[1];
                // peer id is base58btc encoded string but not multibase encoded so add the `z`
                // prefix so we can validate that it is correctly encoded
                if (peerIdStr[0] === 'Q' || peerIdStr[0] === '1') {
                    return toString(base58btc.decode(`z${peerIdStr}`), 'base58btc');
                }
                // try to parse peer id as CID
                return toString(CID.parse(peerIdStr).multihash.bytes, 'base58btc');
            }
            return null;
        }
        catch (e) {
            return null;
        }
    }
    getPath() {
        for (const component of this.#components) {
            const codec = registry.getProtocol(component.code);
            if (!codec.path) {
                continue;
            }
            return component.value ?? null;
        }
        return null;
    }
    equals(addr) {
        return equals$2(this.bytes, addr.bytes);
    }
    async resolve(options) {
        const resolvableProto = this.protos().find((p) => p.resolvable);
        // Multiaddr is not resolvable?
        if (resolvableProto == null) {
            return [this];
        }
        const resolver = resolvers.get(resolvableProto.name);
        if (resolver == null) {
            throw new NoAvailableResolverError(`no available resolver for ${resolvableProto.name}`);
        }
        const result = await resolver(this, options);
        return result.map(str => multiaddr(str));
    }
    nodeAddress() {
        const options = this.toOptions();
        if (options.transport !== 'tcp' && options.transport !== 'udp') {
            throw new Error(`multiaddr must have a valid format - no protocol with name: "${options.transport}". Must have a valid transport protocol: "{tcp, udp}"`);
        }
        return {
            family: options.family,
            address: options.host,
            port: options.port
        };
    }
    isThinWaistAddress() {
        if (this.#components.length !== 2) {
            return false;
        }
        if (this.#components[0].code !== CODE_IP4 && this.#components[0].code !== CODE_IP6) {
            return false;
        }
        if (this.#components[1].code !== CODE_TCP && this.#components[1].code !== CODE_UDP) {
            return false;
        }
        return true;
    }
    /**
     * Returns Multiaddr as a human-readable string
     * https://nodejs.org/api/util.html#utilinspectcustom
     *
     * @example
     * ```js
     * import { multiaddr } from '@multiformats/multiaddr'
     *
     * console.info(multiaddr('/ip4/127.0.0.1/tcp/4001'))
     * // 'Multiaddr(/ip4/127.0.0.1/tcp/4001)'
     * ```
     */
    [inspect]() {
        return `Multiaddr(${this.toString()})`;
    }
}
/**
 * Ensures all multiaddr tuples are correct. Throws if any invalid protocols or
 * values are encountered.
 */
function validate(addr) {
    addr.getComponents()
        .forEach(component => {
        const codec = registry.getProtocol(component.code);
        if (component.value == null) {
            return;
        }
        codec.validate?.(component.value);
    });
}

/**
 * @packageDocumentation
 *
 * A standard way to represent addresses that
 *
 * - support any standard network protocol
 * - are self-describing
 * - have a binary packed format
 * - have a nice string representation
 * - encapsulate well
 *
 * @example
 *
 * ```TypeScript
 * import { multiaddr } from '@multiformats/multiaddr'
 *
 * const addr = multiaddr('/ip4/127.0.0.1/udp/1234')
 * // Multiaddr(/ip4/127.0.0.1/udp/1234)
 *
 * addr.bytes
 * // <Uint8Array 04 7f 00 00 01 11 04 d2>
 *
 * addr.toString()
 * // '/ip4/127.0.0.1/udp/1234'
 *
 * addr.protos()
 * // [
 * //   {code: 4, name: 'ip4', size: 32},
 * //   {code: 273, name: 'udp', size: 16}
 * // ]
 *
 * // gives you an object that is friendly with what Node.js core modules expect for addresses
 * addr.nodeAddress()
 * // {
 * //   family: 4,
 * //   port: 1234,
 * //   address: "127.0.0.1"
 * // }
 *
 * addr.encapsulate('/sctp/5678')
 * // Multiaddr(/ip4/127.0.0.1/udp/1234/sctp/5678)
 * ```
 *
 * ## Resolving DNSADDR addresses
 *
 * [DNSADDR](https://github.com/multiformats/multiaddr/blob/master/protocols/DNSADDR.md) is a spec that allows storing a TXT DNS record that contains a Multiaddr.
 *
 * To resolve DNSADDR addresses, call the `.resolve()` function the multiaddr, optionally passing a `DNS` resolver.
 *
 * DNSADDR addresses can resolve to multiple multiaddrs, since there is no limit to the number of TXT records that can be stored.
 *
 * @example Resolving DNSADDR Multiaddrs
 *
 * ```TypeScript
 * import { multiaddr, resolvers } from '@multiformats/multiaddr'
 * import { dnsaddrResolver } from '@multiformats/multiaddr/resolvers'
 *
 * resolvers.set('dnsaddr', dnsaddrResolver)
 *
 * const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
 *
 * // resolve with a 5s timeout
 * const resolved = await ma.resolve({
 *   signal: AbortSignal.timeout(5000)
 * })
 *
 * console.info(resolved)
 * // [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
 * ```
 *
 * @example Using a custom DNS resolver to resolve DNSADDR Multiaddrs
 *
 * See the docs for [@multiformats/dns](https://www.npmjs.com/package/@multiformats/dns) for a full breakdown of how to specify multiple resolvers or resolvers that can be used for specific TLDs.
 *
 * ```TypeScript
 * import { multiaddr } from '@multiformats/multiaddr'
 * import { dns } from '@multiformats/dns'
 * import { dnsJsonOverHttps } from '@multiformats/dns/resolvers'
 *
 * const resolver = dns({
 *   resolvers: {
 *     '.': dnsJsonOverHttps('https://cloudflare-dns.com/dns-query')
 *   }
 * })
 *
 * const ma = multiaddr('/dnsaddr/bootstrap.libp2p.io')
 * const resolved = await ma.resolve({
 *  dns: resolver
 * })
 *
 * console.info(resolved)
 * // [Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...'), Multiaddr('/ip4/147.75...')...]
 * ```
 *
 * @example Adding custom protocols
 *
 * To add application-specific or experimental protocols, add a protocol codec
 * to the protocol registry:
 *
 * ```ts
 * import { registry, V, multiaddr } from '@multiformats/multiaddr'
 * import type { ProtocolCodec } from '@multiformats/multiaddr'
 *
 * const maWithCustomTuple = '/custom-protocol/hello'
 *
 * // throws UnknownProtocolError
 * multiaddr(maWithCustomTuple)
 *
 * const protocol: ProtocolCodec = {
 *   code: 2059,
 *   name: 'custom-protocol',
 *   size: V
 *   // V means variable length, can also be 0, a positive integer (e.g. a fixed
 *   // length or omitted
 * }
 *
 * registry.addProtocol(protocol)
 *
 * // does not throw UnknownProtocolError
 * multiaddr(maWithCustomTuple)
 *
 * // protocols can also be removed
 * registry.removeProtocol(protocol.code)
 * ```
 */
/**
 * All configured {@link Resolver}s
 *
 * @deprecated DNS resolving will be removed in a future release
 */
const resolvers = new Map();
/**
 * Check if object is a {@link Multiaddr} instance
 *
 * @example
 *
 * ```js
 * import { isMultiaddr, multiaddr } from '@multiformats/multiaddr'
 *
 * isMultiaddr(5)
 * // false
 * isMultiaddr(multiaddr('/ip4/127.0.0.1'))
 * // true
 * ```
 */
function isMultiaddr(value) {
    return Boolean(value?.[symbol]);
}
/**
 * A function that takes a {@link MultiaddrInput} and returns a {@link Multiaddr}
 *
 * @example
 * ```js
 * import { multiaddr } from '@libp2p/multiaddr'
 *
 * multiaddr('/ip4/127.0.0.1/tcp/4001')
 * // Multiaddr(/ip4/127.0.0.1/tcp/4001)
 * ```
 *
 * @param {MultiaddrInput} [addr] - If String or Uint8Array, needs to adhere to the address format of a [multiaddr](https://github.com/multiformats/multiaddr#string-format)
 */
function multiaddr(addr) {
    return new Multiaddr(addr);
}

//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(__defProp(target, "default", {
	value: mod,
	enumerable: true
}) , mod));

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js
var require_typeof = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/typeof.js"(exports, module) {
	function _typeof$2(o) {
		"@babel/helpers - typeof";
		return module.exports = _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o$1) {
			return typeof o$1;
		} : function(o$1) {
			return o$1 && "function" == typeof Symbol && o$1.constructor === Symbol && o$1 !== Symbol.prototype ? "symbol" : typeof o$1;
		}, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof$2(o);
	}
	module.exports = _typeof$2, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js
var require_toPrimitive = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPrimitive.js"(exports, module) {
	var _typeof$1 = require_typeof()["default"];
	function toPrimitive$1(t, r) {
		if ("object" != _typeof$1(t) || !t) return t;
		var e = t[Symbol.toPrimitive];
		if (void 0 !== e) {
			var i = e.call(t, r || "default");
			if ("object" != _typeof$1(i)) return i;
			throw new TypeError("@@toPrimitive must return a primitive value.");
		}
		return ("string" === r ? String : Number)(t);
	}
	module.exports = toPrimitive$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js
var require_toPropertyKey = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/toPropertyKey.js"(exports, module) {
	var _typeof = require_typeof()["default"];
	var toPrimitive = require_toPrimitive();
	function toPropertyKey$1(t) {
		var i = toPrimitive(t, "string");
		return "symbol" == _typeof(i) ? i : i + "";
	}
	module.exports = toPropertyKey$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js
var require_defineProperty = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/defineProperty.js"(exports, module) {
	var toPropertyKey = require_toPropertyKey();
	function _defineProperty(e, r, t) {
		return (r = toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
			value: t,
			enumerable: true,
			configurable: true,
			writable: true
		}) : e[r] = t, e;
	}
	module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js
var require_objectSpread2 = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/objectSpread2.js"(exports, module) {
	var defineProperty = require_defineProperty();
	function ownKeys(e, r) {
		var t = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var o = Object.getOwnPropertySymbols(e);
			r && (o = o.filter(function(r$1) {
				return Object.getOwnPropertyDescriptor(e, r$1).enumerable;
			})), t.push.apply(t, o);
		}
		return t;
	}
	function _objectSpread2(e) {
		for (var r = 1; r < arguments.length; r++) {
			var t = null != arguments[r] ? arguments[r] : {};
			r % 2 ? ownKeys(Object(t), true).forEach(function(r$1) {
				defineProperty(e, r$1, t[r$1]);
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function(r$1) {
				Object.defineProperty(e, r$1, Object.getOwnPropertyDescriptor(t, r$1));
			});
		}
		return e;
	}
	module.exports = _objectSpread2, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#region src/TRPCClientError.ts
var import_defineProperty = __toESM(require_defineProperty());
var import_objectSpread2 = __toESM(require_objectSpread2());
function isTRPCClientError(cause) {
	return cause instanceof TRPCClientError;
}
function isTRPCErrorResponse(obj) {
	return isObject(obj) && isObject(obj["error"]) && typeof obj["error"]["code"] === "number" && typeof obj["error"]["message"] === "string";
}
function getMessageFromUnknownError(err, fallback) {
	if (typeof err === "string") return err;
	if (isObject(err) && typeof err["message"] === "string") return err["message"];
	return fallback;
}
var TRPCClientError = class TRPCClientError extends Error {
	constructor(message, opts) {
		var _opts$result, _opts$result2;
		const cause = opts === null || opts === void 0 ? void 0 : opts.cause;
		super(message, { cause });
		(0, import_defineProperty.default)(this, "cause", void 0);
		(0, import_defineProperty.default)(this, "shape", void 0);
		(0, import_defineProperty.default)(this, "data", void 0);
		(0, import_defineProperty.default)(this, "meta", void 0);
		this.meta = opts === null || opts === void 0 ? void 0 : opts.meta;
		this.cause = cause;
		this.shape = opts === null || opts === void 0 || (_opts$result = opts.result) === null || _opts$result === void 0 ? void 0 : _opts$result.error;
		this.data = opts === null || opts === void 0 || (_opts$result2 = opts.result) === null || _opts$result2 === void 0 ? void 0 : _opts$result2.error.data;
		this.name = "TRPCClientError";
		Object.setPrototypeOf(this, TRPCClientError.prototype);
	}
	static from(_cause, opts = {}) {
		const cause = _cause;
		if (isTRPCClientError(cause)) {
			if (opts.meta) cause.meta = (0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, cause.meta), opts.meta);
			return cause;
		}
		if (isTRPCErrorResponse(cause)) return new TRPCClientError(cause.error.message, (0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, opts), {}, { result: cause }));
		return new TRPCClientError(getMessageFromUnknownError(cause, "Unknown error"), (0, import_objectSpread2.default)((0, import_objectSpread2.default)({}, opts), {}, { cause }));
	}
};

//#region src/internals/transformer.ts
/**
* @internal
*/
/**
* @internal
*/
function getTransformer(transformer) {
	const _transformer = transformer;
	if (!_transformer) return {
		input: {
			serialize: (data) => data,
			deserialize: (data) => data
		},
		output: {
			serialize: (data) => data,
			deserialize: (data) => data
		}
	};
	if ("input" in _transformer) return _transformer;
	return {
		input: _transformer,
		output: _transformer
	};
}

//#endregion
//#region src/links/internals/httpUtils.ts
__toESM(require_objectSpread2());

//#endregion
//#region src/links/httpLink.ts
__toESM(require_objectSpread2());

//#endregion
//#region src/links/httpBatchLink.ts
__toESM(require_objectSpread2());

//#region src/links/loggerLink.ts
__toESM(require_objectSpread2());

//#endregion
//#region src/links/internals/urlWithConnectionParams.ts
/**
* Get the result of a value or function that returns a value
* It also optionally accepts typesafe arguments for the function
*/
const resultOf$1 = (value, ...args) => {
	return typeof value === "function" ? value(...args) : value;
};

//#endregion
//#region src/links/wsLink/wsClient/utils.ts
__toESM(require_defineProperty());
function withResolvers$1() {
	let resolve;
	let reject;
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	return {
		promise,
		resolve,
		reject
	};
}
/**
* Resolves a WebSocket URL and optionally appends connection parameters.
*
* If connectionParams are provided, appends 'connectionParams=1' query parameter.
*/
async function prepareUrl(urlOptions) {
	const url = await resultOf$1(urlOptions.url);
	if (!urlOptions.connectionParams) return url;
	const prefix = url.includes("?") ? "&" : "?";
	const connectionParams = `${prefix}connectionParams=1`;
	return url + connectionParams;
}
async function buildConnectionMessage(connectionParams) {
	const message = {
		method: "connectionParams",
		data: await resultOf$1(connectionParams)
	};
	return JSON.stringify(message);
}

//#endregion
//#region src/links/wsLink/wsClient/requestManager.ts
__toESM(require_defineProperty());

//#endregion
//#region src/links/wsLink/wsClient/wsConnection.ts
var import_defineProperty$1 = __toESM(require_defineProperty());
/**
* Opens a WebSocket connection asynchronously and returns a promise
* that resolves when the connection is successfully established.
* The promise rejects if an error occurs during the connection attempt.
*/
function asyncWsOpen(ws) {
	const { promise, resolve, reject } = withResolvers$1();
	ws.addEventListener("open", () => {
		ws.removeEventListener("error", reject);
		resolve();
	});
	ws.addEventListener("error", reject);
	return promise;
}
/**
* Sets up a periodic ping-pong mechanism to keep the WebSocket connection alive.
*
* - Sends "PING" messages at regular intervals defined by `intervalMs`.
* - If a "PONG" response is not received within the `pongTimeoutMs`, the WebSocket is closed.
* - The ping timer resets upon receiving any message to maintain activity.
* - Automatically starts the ping process when the WebSocket connection is opened.
* - Cleans up timers when the WebSocket is closed.
*
* @param ws - The WebSocket instance to manage.
* @param options - Configuration options for ping-pong intervals and timeouts.
*/
function setupPingInterval(ws, { intervalMs, pongTimeoutMs }) {
	let pingTimeout;
	let pongTimeout;
	function start() {
		pingTimeout = setTimeout(() => {
			ws.send("PING");
			pongTimeout = setTimeout(() => {
				ws.close();
			}, pongTimeoutMs);
		}, intervalMs);
	}
	function reset() {
		clearTimeout(pingTimeout);
		start();
	}
	function pong() {
		clearTimeout(pongTimeout);
		reset();
	}
	ws.addEventListener("open", start);
	ws.addEventListener("message", ({ data }) => {
		clearTimeout(pingTimeout);
		start();
		if (data === "PONG") pong();
	});
	ws.addEventListener("close", () => {
		clearTimeout(pingTimeout);
		clearTimeout(pongTimeout);
	});
}
/**
* Manages a WebSocket connection with support for reconnection, keep-alive mechanisms,
* and observable state tracking.
*/
var WsConnection = class WsConnection {
	constructor(opts) {
		var _opts$WebSocketPonyfi;
		(0, import_defineProperty$1.default)(this, "id", ++WsConnection.connectCount);
		(0, import_defineProperty$1.default)(this, "WebSocketPonyfill", void 0);
		(0, import_defineProperty$1.default)(this, "urlOptions", void 0);
		(0, import_defineProperty$1.default)(this, "keepAliveOpts", void 0);
		(0, import_defineProperty$1.default)(this, "wsObservable", behaviorSubject(null));
		(0, import_defineProperty$1.default)(this, "openPromise", null);
		this.WebSocketPonyfill = (_opts$WebSocketPonyfi = opts.WebSocketPonyfill) !== null && _opts$WebSocketPonyfi !== void 0 ? _opts$WebSocketPonyfi : WebSocket;
		if (!this.WebSocketPonyfill) throw new Error("No WebSocket implementation found - you probably don't want to use this on the server, but if you do you need to pass a `WebSocket`-ponyfill");
		this.urlOptions = opts.urlOptions;
		this.keepAliveOpts = opts.keepAlive;
	}
	get ws() {
		return this.wsObservable.get();
	}
	set ws(ws) {
		this.wsObservable.next(ws);
	}
	/**
	* Checks if the WebSocket connection is open and ready to communicate.
	*/
	isOpen() {
		return !!this.ws && this.ws.readyState === this.WebSocketPonyfill.OPEN && !this.openPromise;
	}
	/**
	* Checks if the WebSocket connection is closed or in the process of closing.
	*/
	isClosed() {
		return !!this.ws && (this.ws.readyState === this.WebSocketPonyfill.CLOSING || this.ws.readyState === this.WebSocketPonyfill.CLOSED);
	}
	async open() {
		var _this = this;
		if (_this.openPromise) return _this.openPromise;
		_this.id = ++WsConnection.connectCount;
		const wsPromise = prepareUrl(_this.urlOptions).then((url) => new _this.WebSocketPonyfill(url));
		_this.openPromise = wsPromise.then(async (ws) => {
			_this.ws = ws;
			ws.addEventListener("message", function({ data }) {
				if (data === "PING") this.send("PONG");
			});
			if (_this.keepAliveOpts.enabled) setupPingInterval(ws, _this.keepAliveOpts);
			ws.addEventListener("close", () => {
				if (_this.ws === ws) _this.ws = null;
			});
			await asyncWsOpen(ws);
			if (_this.urlOptions.connectionParams) ws.send(await buildConnectionMessage(_this.urlOptions.connectionParams));
		});
		try {
			await _this.openPromise;
		} finally {
			_this.openPromise = null;
		}
	}
	/**
	* Closes the WebSocket connection gracefully.
	* Waits for any ongoing open operation to complete before closing.
	*/
	async close() {
		var _this2 = this;
		try {
			await _this2.openPromise;
		} finally {
			var _this$ws;
			(_this$ws = _this2.ws) === null || _this$ws === void 0 || _this$ws.close();
		}
	}
};
(0, import_defineProperty$1.default)(WsConnection, "connectCount", 0);

//#endregion
//#region src/links/wsLink/wsClient/wsClient.ts
__toESM(require_defineProperty());
__toESM(require_objectSpread2());

//#region src/internals/TRPCUntypedClient.ts
__toESM(require_defineProperty());
__toESM(require_objectSpread2());

//#endregion
//#region src/links/httpBatchStreamLink.ts
__toESM(require_objectSpread2());

//#endregion
//#region src/internals/inputWithTrackedEventId.ts
__toESM(require_objectSpread2());

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js
var require_asyncIterator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/asyncIterator.js"(exports, module) {
	function _asyncIterator$1(r) {
		var n, t, o, e = 2;
		for ("undefined" != typeof Symbol && (t = Symbol.asyncIterator, o = Symbol.iterator); e--;) {
			if (t && null != (n = r[t])) return n.call(r);
			if (o && null != (n = r[o])) return new AsyncFromSyncIterator(n.call(r));
			t = "@@asyncIterator", o = "@@iterator";
		}
		throw new TypeError("Object is not async iterable");
	}
	function AsyncFromSyncIterator(r) {
		function AsyncFromSyncIteratorContinuation(r$1) {
			if (Object(r$1) !== r$1) return Promise.reject(new TypeError(r$1 + " is not an object."));
			var n = r$1.done;
			return Promise.resolve(r$1.value).then(function(r$2) {
				return {
					value: r$2,
					done: n
				};
			});
		}
		return AsyncFromSyncIterator = function AsyncFromSyncIterator$1(r$1) {
			this.s = r$1, this.n = r$1.next;
		}, AsyncFromSyncIterator.prototype = {
			s: null,
			n: null,
			next: function next() {
				return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
			},
			"return": function _return(r$1) {
				var n = this.s["return"];
				return void 0 === n ? Promise.resolve({
					value: r$1,
					done: true
				}) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
			},
			"throw": function _throw(r$1) {
				var n = this.s["return"];
				return void 0 === n ? Promise.reject(r$1) : AsyncFromSyncIteratorContinuation(n.apply(this.s, arguments));
			}
		}, new AsyncFromSyncIterator(r);
	}
	module.exports = _asyncIterator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region src/links/httpSubscriptionLink.ts
__toESM(require_asyncIterator());

//#endregion
//#region src/links/retryLink.ts
__toESM(require_objectSpread2());

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/usingCtx.js
var require_usingCtx = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/usingCtx.js"(exports, module) {
	function _usingCtx() {
		var r = "function" == typeof SuppressedError ? SuppressedError : function(r$1, e$1) {
			var n$1 = Error();
			return n$1.name = "SuppressedError", n$1.error = r$1, n$1.suppressed = e$1, n$1;
		}, e = {}, n = [];
		function using(r$1, e$1) {
			if (null != e$1) {
				if (Object(e$1) !== e$1) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
				if (r$1) var o = e$1[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
				if (void 0 === o && (o = e$1[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r$1)) var t = o;
				if ("function" != typeof o) throw new TypeError("Object is not disposable.");
				t && (o = function o$1() {
					try {
						t.call(e$1);
					} catch (r$2) {
						return Promise.reject(r$2);
					}
				}), n.push({
					v: e$1,
					d: o,
					a: r$1
				});
			} else r$1 && n.push({
				d: e$1,
				a: r$1
			});
			return e$1;
		}
		return {
			e,
			u: using.bind(null, false),
			a: using.bind(null, true),
			d: function d() {
				var o, t = this.e, s = 0;
				function next() {
					for (; o = n.pop();) try {
						if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
						if (o.d) {
							var r$1 = o.d.call(o.v);
							if (o.a) return s |= 2, Promise.resolve(r$1).then(next, err);
						} else s |= 1;
					} catch (r$2) {
						return err(r$2);
					}
					if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
					if (t !== e) throw t;
				}
				function err(n$1) {
					return t = t !== e ? new r(n$1, t) : n$1, next();
				}
				return next();
			}
		};
	}
	module.exports = _usingCtx, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/OverloadYield.js
var require_OverloadYield = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/OverloadYield.js"(exports, module) {
	function _OverloadYield(e, d) {
		this.v = e, this.k = d;
	}
	module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/awaitAsyncGenerator.js
var require_awaitAsyncGenerator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/awaitAsyncGenerator.js"(exports, module) {
	var OverloadYield$1 = require_OverloadYield();
	function _awaitAsyncGenerator$1(e) {
		return new OverloadYield$1(e, 0);
	}
	module.exports = _awaitAsyncGenerator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region ../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/wrapAsyncGenerator.js
var require_wrapAsyncGenerator = __commonJS({ "../../node_modules/.pnpm/@oxc-project+runtime@0.72.2/node_modules/@oxc-project/runtime/src/helpers/wrapAsyncGenerator.js"(exports, module) {
	var OverloadYield = require_OverloadYield();
	function _wrapAsyncGenerator$1(e) {
		return function() {
			return new AsyncGenerator(e.apply(this, arguments));
		};
	}
	function AsyncGenerator(e) {
		var r, t;
		function resume(r$1, t$1) {
			try {
				var n = e[r$1](t$1), o = n.value, u = o instanceof OverloadYield;
				Promise.resolve(u ? o.v : o).then(function(t$2) {
					if (u) {
						var i = "return" === r$1 ? "return" : "next";
						if (!o.k || t$2.done) return resume(i, t$2);
						t$2 = e[i](t$2).value;
					}
					settle(n.done ? "return" : "normal", t$2);
				}, function(e$1) {
					resume("throw", e$1);
				});
			} catch (e$1) {
				settle("throw", e$1);
			}
		}
		function settle(e$1, n) {
			switch (e$1) {
				case "return":
					r.resolve({
						value: n,
						done: true
					});
					break;
				case "throw":
					r.reject(n);
					break;
				default: r.resolve({
					value: n,
					done: false
				});
			}
			(r = r.next) ? resume(r.key, r.arg) : t = null;
		}
		this._invoke = function(e$1, n) {
			return new Promise(function(o, u) {
				var i = {
					key: e$1,
					arg: n,
					resolve: o,
					reject: u,
					next: null
				};
				t ? t = t.next = i : (r = t = i, resume(e$1, n));
			});
		}, "function" != typeof e["return"] && (this["return"] = void 0);
	}
	AsyncGenerator.prototype["function" == typeof Symbol && Symbol.asyncIterator || "@@asyncIterator"] = function() {
		return this;
	}, AsyncGenerator.prototype.next = function(e) {
		return this._invoke("next", e);
	}, AsyncGenerator.prototype["throw"] = function(e) {
		return this._invoke("throw", e);
	}, AsyncGenerator.prototype["return"] = function(e) {
		return this._invoke("return", e);
	};
	module.exports = _wrapAsyncGenerator$1, module.exports.__esModule = true, module.exports["default"] = module.exports;
} });

//#endregion
//#region src/links/localLink.ts
__toESM(require_usingCtx());
__toESM(require_awaitAsyncGenerator());
__toESM(require_wrapAsyncGenerator());
__toESM(require_objectSpread2());

class P2PStream extends EventEmitter {
    stream;
    get status() {
        return this.stream.status;
    }
    constructor(stream){
        super();
        this.stream = stream;
        (async ()=>{
            await pipe(stream, decode$5, async (source)=>{
                for await (const message of source){
                    this.emit("data", message.subarray());
                }
                this.emit("end");
            });
        })().catch((err)=>this.emit("error", err));
        (async ()=>{
            await pipe(this.queue, encode$3, stream);
        })();
    }
    queue = pushable();
    async write(data) {
        this.queue.push(data);
    }
    async close() {
        this.emit("close");
        this.queue.end();
        this.stream.abort(new Error());
    }
}

function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
class RequestManager {
    outgoingRequests = new Array();
    pendingRequests = {};
    register(message, callbacks) {
        const { promise: end, resolve } = withResolvers();
        this.outgoingRequests.push({
            id: String(message.id),
            message,
            end,
            callbacks: {
                next: callbacks.next,
                complete: ()=>{
                    callbacks.complete();
                    resolve();
                },
                error: (e)=>{
                    callbacks.error(e);
                    resolve();
                }
            }
        });
        return ()=>{
            this.delete(message.id);
            callbacks.complete();
            resolve();
        };
    }
    delete(messageId) {
        if (messageId === null) return;
        this.outgoingRequests = this.outgoingRequests.filter(({ id })=>id !== String(messageId));
        delete this.pendingRequests[String(messageId)];
    }
    flush() {
        const requests = this.outgoingRequests;
        this.outgoingRequests = [];
        for (const request of requests){
            this.pendingRequests[request.id] = request;
        }
        return requests;
    }
    getPendingRequests() {
        return Object.values(this.pendingRequests);
    }
    getPendingRequest(messageId) {
        if (messageId === null) return null;
        return this.pendingRequests[String(messageId)];
    }
    getOutgoingRequests() {
        return this.outgoingRequests;
    }
    getRequests() {
        return [
            ...this.getOutgoingRequests().map((request)=>({
                    state: 'outgoing',
                    message: request.message,
                    end: request.end,
                    callbacks: request.callbacks
                })),
            ...this.getPendingRequests().map((request)=>({
                    state: 'pending',
                    message: request.message,
                    end: request.end,
                    callbacks: request.callbacks
                }))
        ];
    }
    hasPendingRequests() {
        return this.getPendingRequests().length > 0;
    }
    hasPendingSubscriptions() {
        return this.getPendingRequests().some((request)=>request.message.method === 'subscription');
    }
    hasOutgoingRequests() {
        return this.outgoingRequests.length > 0;
    }
}
class ResettableTimeout {
    onTimeout;
    timeoutMs;
    timeout;
    constructor(onTimeout, timeoutMs){
        this.onTimeout = onTimeout;
        this.timeoutMs = timeoutMs;
    }
    reset() {
        if (!this.timeout) return;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeout, this.timeoutMs);
    }
    start() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.onTimeout, this.timeoutMs);
    }
    stop() {
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
}
const resultOf = (value, ...args)=>{
    return typeof value === 'function' ? value(...args) : value;
};
function backwardCompatibility(connection) {
    if (connection.isOpen()) {
        return {
            id: connection.id,
            state: "open",
            stream: connection.stream
        };
    }
    if (connection.isClosed()) {
        return {
            id: connection.id,
            state: "closed",
            ws: connection.stream
        };
    }
    if (!connection.stream) {
        return null;
    }
    return {
        id: connection.id,
        state: "connecting",
        ws: connection.stream
    };
}

class P2PConnection {
    static connectCount = 0;
    id = ++P2PConnection.connectCount;
    options;
    streamObservable = behaviorSubject(null);
    constructor(options){
        this.options = options;
    }
    get stream() {
        return this.streamObservable.get();
    }
    set stream(stream) {
        this.streamObservable.next(stream);
    }
    isOpen() {
        return !!this.stream && this.stream.status === "open" && !this.openPromise;
    }
    isClosed() {
        return !!this.stream && (this.stream.status === "closing" || this.stream.status === "closed");
    }
    openPromise = null;
    async open() {
        if (this.openPromise) return this.openPromise;
        this.id = ++P2PConnection.connectCount;
        const ma = multiaddr(this.options.url.toString());
        const streamPromise = this.options.node.dialProtocol(ma, "/trpc/1.0.0");
        this.openPromise = streamPromise.then(async (raw_stream)=>{
            const stream = new P2PStream(raw_stream);
            this.stream = stream;
            stream.on("close", ()=>{
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
            let handshake = {
                headers: {},
                trpcMessages: this.options.connectionParams ? {
                    method: "connectionParams",
                    data: await resultOf(this.options.connectionParams)
                } : void 0
            };
            stream.write(bson.serialize(handshake));
        });
        try {
            await this.openPromise;
        } finally{
            this.openPromise = null;
        }
    }
    async close() {
        try {
            await this.openPromise;
        } finally{
            this.stream?.close();
        }
    }
}

class P2PClient {
    connectionState;
    allowReconnect = false;
    requestManager = new RequestManager();
    activeConnection;
    multiaddr;
    reconnectRetryDelay;
    inactivityTimeout;
    // private readonly lazyMode: boolean;
    constructor(options){
        this.multiaddr = multiaddr(options.url.toString());
        this.activeConnection = new P2PConnection(options);
        this.reconnectRetryDelay = (index)=>index === 0 ? 0 : Math.min(1000 * 2 ** index, 30000);
        this.inactivityTimeout = new ResettableTimeout(()=>{
            if (this.requestManager.hasOutgoingRequests() || this.requestManager.hasPendingRequests()) {
                this.inactivityTimeout.reset();
                return;
            }
            this.close().catch(()=>null);
        }, 0);
        this.connectionState = behaviorSubject({
            type: "state",
            state: "connecting",
            error: null
        });
        this.activeConnection.streamObservable.subscribe({
            next: (stream)=>{
                if (!stream) return;
                this.setupListeners(stream);
            }
        });
        this.open().catch(()=>null);
    }
    async open() {
        this.allowReconnect = true;
        if (this.connectionState.get().state !== "connecting") {
            this.connectionState.next({
                type: "state",
                state: "connecting",
                error: null
            });
        }
        try {
            await this.activeConnection.open();
        // this.activeStream = await this.activeNode.dialProtocol(this.multiaddr, "/trpc/1.0.0");
        } catch (error) {
            this.reconnect(new TRPCStreamClosedError({
                message: "Initialization error",
                cause: error
            }));
            return this.reconnecting;
        }
    }
    reconnecting = null;
    reconnect(closedError) {
        this.connectionState.next({
            type: "state",
            state: "connecting",
            error: TRPCClientError.from(closedError)
        });
        if (this.reconnecting) return;
        const tryReconnect = async (attemptIndex)=>{
            try {
                await sleep(this.reconnectRetryDelay(attemptIndex));
                if (this.allowReconnect) {
                    await this.activeConnection.close();
                    await this.activeConnection.open();
                    if (this.requestManager.hasPendingRequests()) {
                        this.send(this.requestManager.getPendingRequests().map(({ message })=>message));
                    }
                }
                this.reconnecting = null;
            } catch  {
                await tryReconnect(attemptIndex + 1);
            }
        };
        this.reconnecting = tryReconnect(0);
    }
    send(messageOrMessages) {
        if (!this.activeConnection.isOpen()) {
            throw new Error("Active connection is not open");
        }
        const messages = w(messageOrMessages) ? messageOrMessages : [
            messageOrMessages
        ];
        this.activeConnection.stream.write(bson.serialize(messages.length === 1 ? messages[0] : messages));
    }
    batchSend(message, callbacks) {
        this.inactivityTimeout.reset();
        (async ()=>{
            if (!this.activeConnection.isOpen()) {
                await this.open();
            }
            await sleep(0);
            if (!this.requestManager.hasOutgoingRequests()) return;
            this.send(this.requestManager.flush().map(({ message })=>message));
        })().catch((err)=>{
            this.requestManager.delete(message.id);
            callbacks.error(TRPCClientError.from(err));
        });
        return this.requestManager.register(message, callbacks);
    }
    async close() {
        this.allowReconnect = false;
        this.inactivityTimeout.stop();
        const requestsToAwait = [];
        for (const request of this.requestManager.getRequests()){
            if (request.message.method === 'subscription') {
                request.callbacks.complete();
            } else if (request.state === 'outgoing') {
                request.callbacks.error(TRPCClientError.from(new TRPCStreamClosedError({
                    message: 'Closed before connection was established'
                })));
            } else {
                requestsToAwait.push(request.end);
            }
        }
        await Promise.all(requestsToAwait).catch(()=>null);
        await this.activeConnection.close().catch(()=>null);
        this.connectionState.next({
            type: "state",
            state: "idle",
            error: null
        });
    }
    request({ op: { id, type, path, input, signal }, transformer, lastEventId }) {
        return observable((observer)=>{
            const abort = this.batchSend({
                id,
                method: type,
                params: {
                    input: transformer.input.serialize(input),
                    path,
                    lastEventId
                }
            }, {
                ...observer,
                next (event) {
                    const transformed = transformResult(event, transformer.output);
                    if (!transformed.ok) {
                        observer.error(TRPCClientError.from(transformed.error));
                        return;
                    }
                    observer.next({
                        result: transformed.result
                    });
                }
            });
            return ()=>{
                abort();
                if (type === 'subscription' && this.activeConnection.isOpen()) {
                    this.send({
                        id,
                        method: 'subscription.stop'
                    });
                }
                signal?.removeEventListener('abort', abort);
            };
        });
    }
    get connection() {
        return backwardCompatibility(this.activeConnection);
    }
    setupListeners(stream) {
        const handleCloseOrError = (cause)=>{
            const reqs = this.requestManager.getPendingRequests();
            for (const { message, callbacks } of reqs){
                if (message.method === "subscription") continue;
                callbacks.error(TRPCClientError.from(cause ?? new TRPCStreamClosedError({
                    message: 'WebSocket closed',
                    cause
                })));
                this.requestManager.delete(message.id);
            }
        };
        stream.on("open", ()=>{
            (async ()=>{
                this.connectionState.next({
                    type: "state",
                    state: "pending",
                    error: null
                });
            })().catch((error)=>{
                stream.close();
                handleCloseOrError(error);
            });
        });
        stream.on("data", (data)=>{
            this.inactivityTimeout.reset();
            // if (typeof data !== 'string' || ['PING', 'PONG'].includes(data)) return;
            const docs = bson.deserialize(data);
            const incomingMessage = EJSON.deserialize(docs);
            if ('method' in incomingMessage) {
                this.handleIncomingRequest(incomingMessage);
                return;
            }
            this.handleResponseMessage(incomingMessage);
        });
        stream.on("close", (event)=>{
            handleCloseOrError(event);
            if (this.requestManager.hasPendingSubscriptions()) {
                this.reconnect(new TRPCStreamClosedError({
                    message: 'WebSocket closed',
                    cause: event
                }));
            }
        });
        stream.on('error', (event)=>{
            handleCloseOrError(event);
            this.reconnect(new TRPCStreamClosedError({
                message: 'WebSocket closed',
                cause: event
            }));
        });
    }
    handleResponseMessage(message) {
        const request = this.requestManager.getPendingRequest(message.id);
        if (!request) return;
        request.callbacks.next(message);
        let completed = true;
        if ('result' in message && request.message.method === 'subscription') {
            if (message.result.type === 'data') {
                request.message.params.lastEventId = message.result.id;
            }
            if (message.result.type !== 'stopped') {
                completed = false;
            }
        }
        if (completed) {
            request.callbacks.complete();
            this.requestManager.delete(message.id);
        }
    }
    handleIncomingRequest(message) {
        if (message.method === 'reconnect') {
            this.reconnect(new TRPCStreamClosedError({
                message: 'Server requested reconnect'
            }));
        }
    }
}

function createP2PClient(options) {
    return new P2PClient(options);
}
function p2pLink(options) {
    const { client } = options;
    const transformer = getTransformer(options.transformer);
    return ()=>{
        return ({ op })=>{
            return observable((observer)=>{
                const connStateSubscription = op.type === 'subscription' ? client.connectionState.subscribe({
                    next (result) {
                        observer.next({
                            result,
                            context: op.context
                        });
                    }
                }) : null;
                const requestSubscription = client.request({
                    op,
                    transformer
                }).subscribe(observer);
                return ()=>{
                    requestSubscription.unsubscribe();
                    connStateSubscription?.unsubscribe();
                };
            });
        };
    };
}

export { applyHandler, createP2PClient, p2pLink };
//# sourceMappingURL=bundle.js.map
