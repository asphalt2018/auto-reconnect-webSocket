(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["reconnectWebSocket"] = factory();
	else
		root["reconnectWebSocket"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["b"] = msgToUint;
/* harmony export (immutable) */ __webpack_exports__["c"] = uintToMsg;
/* harmony export (immutable) */ __webpack_exports__["a"] = generateEvent;
function msgToUint(json) {
    try {
        let string = btoa(encodeURIComponent(JSON.stringify(json))), charList = string.split(""), uintArray = [];
        for (let item of charList) {
            uintArray.push(item.charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    }
    catch (err) {
        console.log(`msgToUint err${err}`);
        return new Uint8Array([]);
    }
}
function uintToMsg(uintArray) {
    try {
        let encodedString = String.fromCharCode.apply(null, new Uint8Array(uintArray));
        let decodedString = decodeURIComponent(atob(encodedString));
        return JSON.parse(decodedString);
    }
    catch (err) {
        console.log(`uintToMsg err${err}`);
        return {};
    }
}
function generateEvent(eventName, args) {
    const event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventName, false, false, args);
    return event;
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__reconnect_websocket__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__helper__ = __webpack_require__(0);


class IM {
    constructor(config) {
        this.timeout = 20;
        this.canRequest = false;
        this.reqNo = `${Math.random().toString(16).substring(2)}_${Date.now()}`;
        this.callbacks = {};
        this.initTimeoutTicker();
        this.onMessage = config.onMessage;
        this.onConnected = config.onConnected;
        this.onClosed = config.onClosed;
        this.onError = config.onError;
    }
    initTimeoutTicker() {
        setInterval(() => {
            let now = Date.now();
            for (let cmd of Object.keys(this.callbacks)) {
                let cbs = this.callbacks[cmd];
                for (let reqNo of Object.keys(cbs)) {
                    let cb = cbs[reqNo];
                    if (now > cb.deadline) {
                        cb(null, { data: { code: "0", message: "request timeout", status: false } });
                        delete this.callbacks[cmd][reqNo];
                    }
                }
            }
        }, 1000 * this.timeout);
    }
    close() {
        this.ws.close();
    }
    connectWSServer(url, cb) {
        this.ws = new __WEBPACK_IMPORTED_MODULE_0__reconnect_websocket__["a" /* default */](url, null, {
            binaryType: "arraybuffer",
            debug: false,
            reconnectInterval: 4000,
            timeoutInterval: 5000
        });
        this.ws.onOpen = (data) => {
            this.canRequest = true;
            if (cb) {
                cb(null, data);
            }
            this.onConnected(data);
        };
        this.ws.onClose = (data) => {
            this.canRequest = false;
            this.onClosed(data);
        };
        this.ws.onMessage = (data) => {
            let newData = Object(__WEBPACK_IMPORTED_MODULE_1__helper__["c" /* uintToMsg */])(data.data);
            if (this.callbacks[newData.cmd] && this.callbacks[newData.cmd][newData.resNo]) {
                this.callbacks[newData.cmd][newData.resNo](null, newData);
                delete this.callbacks[newData.cmd][newData.resNo];
            }
            else {
                this.onMessage(newData);
            }
        };
        this.ws.onError = (data) => {
            this.onError(data);
        };
        window.onbeforeunload = () => {
            this.ws.close();
        };
        window.onunload = () => {
            this.ws.close();
        };
    }
    request(cmd, data, cb) {
        if (!this.canRequest)
            return false;
        if (typeof cb === "function") {
            cb.deadline = Date.now() + 1000 * 10;
            if (!this.callbacks[cmd]) {
                this.callbacks[cmd] = {};
            }
            this.callbacks[cmd][this.reqNo] = cb;
        }
        this.send(cmd, this.reqNo, data);
    }
    send(cmd, reqNo, params) {
        let msg = {
            cmd, reqNo, params
        };
        this.ws.send(Object(__WEBPACK_IMPORTED_MODULE_1__helper__["b" /* msgToUint */])(msg));
    }
    closeConnection() {
        this.ws.close();
    }
}
/* harmony export (immutable) */ __webpack_exports__["default"] = IM;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper__ = __webpack_require__(0);

const defaultReconnectSettings = {
    debug: false,
    automaticOpen: true,
    reconnectInterval: 1000,
    maxReconnectInterval: 30000,
    reconnectDecay: 1.5,
    timeoutInterval: 2000,
    maxReconnectAttempts: null,
    binaryType: "blob"
};
class ReconnectWebSocket {
    constructor(url, protocols, options) {
        this.reconnectAttempts = 0;
        this.url = url;
        this.initSettings(options);
        this.readyState = WebSocket.CONNECTING;
        this.protocol = "";
        this.protocols = protocols;
        this.eventTarget = document.createElement("div");
        this.addSocketListener();
        this.addEventListener = this.eventTarget.addEventListener.bind(this.eventTarget);
        this.removeEventListener = this.eventTarget.removeEventListener.bind(this.eventTarget);
        this.dispatchEvent = this.eventTarget.dispatchEvent.bind(this.eventTarget);
        if (defaultReconnectSettings.automaticOpen == true) {
            this.open(false);
        }
        this.debugAll = false;
        this.CONNECTING = WebSocket.CONNECTING;
        this.OPEN = WebSocket.OPEN;
        this.CLOSING = WebSocket.CLOSING;
        this.CLOSED = WebSocket.CLOSED;
    }
    initSettings(options) {
        for (let key of Object.keys(options)) {
            if (typeof options[key] !== "undefined") {
                this[key] = options[key];
            }
            else {
                this[key] = defaultReconnectSettings[key];
            }
        }
    }
    open(reconnectAttempt) {
        if (!("WebSocket" in window)) {
            throw new Error("WebSocket not supported by current browser!");
        }
        this.ws = new WebSocket(this.url, this.protocols || []);
        this.ws.binaryType = this.binaryType;
        if (reconnectAttempt) {
            if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
                return;
            }
        }
        else {
            this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("connecting"));
            this.reconnectAttempts = 0;
        }
        if (this.debug || this.debugAll) {
            console.debug("ReconnectingWebSocket", "attempt-connect", this.url);
        }
        const localWs = this.ws;
        const timeout = setTimeout(() => {
            if (this.debug || this.debugAll) {
                console.debug("ReconnectingWebSocket", "connection-timeout", this.url);
            }
            this.timedOut = true;
            localWs.close();
            this.timedOut = false;
        }, defaultReconnectSettings.timeoutInterval);
        this.ws.onopen = () => {
            clearTimeout(timeout);
            if (this.debug || this.debugAll) {
                console.debug("ReconnectingWebSocket", "onopen", this.url);
            }
            this.protocol = this.ws.protocol;
            this.readyState = WebSocket.OPEN;
            this.reconnectAttempts = 0;
            const e = Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("open");
            Object.assign(e, { isReconnect: reconnectAttempt });
            reconnectAttempt = false;
            this.eventTarget.dispatchEvent(e);
        };
        this.ws.onclose = (event) => {
            clearTimeout(timeout);
            this.ws = null;
            if (this.forcedClose) {
                this.readyState = WebSocket.CLOSED;
                this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("close"));
            }
            else {
                this.readyState = WebSocket.CONNECTING;
                const e = Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("connecting");
                Object.assign(e, {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });
                this.eventTarget.dispatchEvent(e);
                if (!reconnectAttempt && !this.timedOut) {
                    if (this.debug || this.debugAll) {
                        console.debug("ReconnectingWebSocket", "onClose", this.url);
                    }
                    this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("close"));
                }
                const timeout = defaultReconnectSettings.reconnectInterval * Math.pow(defaultReconnectSettings.reconnectDecay, this.reconnectAttempts);
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.open(true);
                }, timeout > defaultReconnectSettings.maxReconnectInterval ? defaultReconnectSettings.maxReconnectInterval : timeout);
            }
        };
        this.ws.onmessage = (event) => {
            if (this.debug || this.debugAll) {
                console.debug("ReconnectingWebSocket", "onMessage", this.url, event.data);
            }
            const e = Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("message");
            Object.assign(e, { data: event.data });
            this.eventTarget.dispatchEvent(e);
        };
        this.ws.onerror = (event) => {
            if (this.debug || this.debugAll) {
                console.debug("ReconnectingWebSocket", "onError", this.url, event);
            }
            this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])("error"));
        };
    }
    addSocketListener() {
        this.eventTarget.addEventListener("open", (event) => {
            this.onOpen(event);
        });
        this.eventTarget.addEventListener("close", (event) => {
            this.onClose(event);
        });
        this.eventTarget.addEventListener("connecting", (event) => {
            this.onConnecting(event);
        });
        this.eventTarget.addEventListener("message", (event) => {
            this.onMessage(event);
        });
        this.eventTarget.addEventListener("error", (event) => {
            this.onError(event);
        });
    }
    send(data) {
        if (this.ws) {
            if (this.debug || this.debugAll) {
                console.debug("ReconnectingWebSocket", "send", this.url, data);
            }
            return this.ws.send(data);
        }
        else {
            throw "INVALID_STATE_ERR : Pausing to reconnect webSocket";
        }
    }
    close(code, reason) {
        if (typeof code == "undefined") {
            code = 1000;
        }
        this.forcedClose = true;
        if (this.ws) {
            this.ws.close(code, reason);
        }
    }
    refresh() {
        if (this.ws) {
            this.ws.close();
        }
    }
    onOpen(event) {
    }
    onClose(event) {
    }
    onConnecting(event) {
    }
    onMessage(event) {
    }
    onError(event) {
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ReconnectWebSocket;



/***/ })
/******/ ]);
});