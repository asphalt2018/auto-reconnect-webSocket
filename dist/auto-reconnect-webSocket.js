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
/**
 *
 * @param {object} json
 * @returns {ArrayLike<number> | ArrayBuffer}
 */
function msgToUint(json) {
    try {
        var data = btoa(encodeURIComponent(JSON.stringify(json)));
        var charList = data.split('');
        var uintArray = [];
        for (var _i = 0, charList_1 = charList; _i < charList_1.length; _i++) {
            var item = charList_1[_i];
            uintArray.push(item.charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    }
    catch (err) {
        console.log("msgToUint err" + err);
        return new Uint8Array([]);
    }
}
/**
 *
 * @param {ArrayLike<number> | ArrayBuffer} uintArray
 * @returns {any}
 */
function uintToMsg(uintArray) {
    try {
        var encodedString = String.fromCharCode.apply(null, new Uint8Array(uintArray));
        var decodedString = decodeURIComponent(atob(encodedString));
        return JSON.parse(decodedString);
    }
    catch (err) {
        console.log("uintToMsg err" + err);
        return {};
    }
}
/**
 *
 * @param {string} eventName
 * @param args
 * @returns {CustomEvent}
 */
function generateEvent(eventName, args) {
    var event = document.createEvent('CustomEvent');
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


var IM = /** @class */ (function () {
    /**
     *
     * @param {InitParams} config
     */
    function IM(config) {
        this.callbacks = {};
        this.timeout = 20;
        this.canRequest = false;
        this.reqNo = Math.random().toString(16).substring(2) + "_" + Date.now();
        this.initTimeoutTicker();
        if (config.onMessage) {
            this.onMessage = config.onMessage;
        }
        if (config.onConnected) {
            this.onConnected = config.onConnected;
        }
        if (config.onClosed) {
            this.onClosed = config.onClosed;
        }
        if (config.onError) {
            this.onError = config.onError;
        }
    }
    /**
     *
     * @param {string} url
     * @param {(error: null, response: object) => void} cb
     */
    IM.prototype.connectWSServer = function (url, cb) {
        var _this = this;
        this.ws = new __WEBPACK_IMPORTED_MODULE_0__reconnect_websocket__["a" /* default */](url, null, {
            binaryType: 'arraybuffer',
            debug: false,
            reconnectInterval: 4000,
            timeoutInterval: 5000
        });
        this.ws.onOpen = function (data) {
            _this.canRequest = true;
            if (cb) {
                cb(null, data);
            }
            _this.onConnected(data);
        };
        this.ws.onClose = function (data) {
            _this.canRequest = false;
            _this.onClosed(data);
        };
        this.ws.onMessage = function (data) {
            var newData = Object(__WEBPACK_IMPORTED_MODULE_1__helper__["c" /* uintToMsg */])(data.data);
            if (_this.callbacks[newData.cmd] && _this.callbacks[newData.cmd][newData.resNo]) {
                _this.callbacks[newData.cmd][newData.resNo](null, newData);
                delete _this.callbacks[newData.cmd][newData.resNo];
            }
            else {
                _this.onMessage(newData);
            }
        };
        this.ws.onError = function (data) {
            _this.onError(data);
        };
        window.onbeforeunload = function () {
            _this.ws.close();
        };
        window.onunload = function () {
            _this.ws.close();
        };
    };
    /**
     *
     * @param {string} cmd
     * @param {object} data
     * @param cb
     * @returns {boolean}
     */
    IM.prototype.request = function (cmd, data, cb) {
        if (!this.canRequest) {
            return;
        }
        if (typeof cb === 'function') {
            cb.deadline = Date.now() + 1000 * 10;
            if (!this.callbacks[cmd]) {
                this.callbacks[cmd] = {};
            }
            this.callbacks[cmd][this.reqNo] = cb;
        }
        this.send(cmd, this.reqNo, data);
    };
    IM.prototype.send = function (cmd, reqNo, params) {
        var msg = {
            cmd: cmd, reqNo: reqNo, params: params
        };
        this.ws.send(Object(__WEBPACK_IMPORTED_MODULE_1__helper__["b" /* msgToUint */])(msg));
    };
    IM.prototype.closeConnection = function () {
        this.ws.close();
    };
    IM.prototype.close = function () {
        this.ws.close();
    };
    IM.prototype.initTimeoutTicker = function () {
        var _this = this;
        setInterval(function () {
            var now = Date.now();
            for (var _i = 0, _a = Object.keys(_this.callbacks); _i < _a.length; _i++) {
                var cmd = _a[_i];
                var cbs = _this.callbacks[cmd];
                for (var _b = 0, _c = Object.keys(cbs); _b < _c.length; _b++) {
                    var reqNo = _c[_b];
                    var cb = cbs[reqNo];
                    if (now > cb.deadline) {
                        cb(null, { data: { code: '0', msg: '请求超时', status: false } });
                        delete _this.callbacks[cmd][reqNo];
                    }
                }
            }
        }, 1000 * this.timeout);
    };
    return IM;
}());
/* harmony default export */ __webpack_exports__["default"] = (IM);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__helper__ = __webpack_require__(0);

var defaultReconnectSettings = {
    debug: false,
    automaticOpen: true,
    reconnectInterval: 1000,
    maxReconnectInterval: 30000,
    reconnectDecay: 1.5,
    timeoutInterval: 2000,
    maxReconnectAttempts: null,
    binaryType: 'blob'
};
var ReconnectWebSocket = /** @class */ (function () {
    /**
     *
     * @param {string} url
     * @param protocols
     * @param {ReconnectSettings} options
     */
    function ReconnectWebSocket(url, protocols, options) {
        this.reconnectAttempts = 0;
        this.url = url;
        this.initSettings(options);
        this.readyState = WebSocket.CONNECTING;
        this.protocol = '';
        this.protocols = protocols;
        this.eventTarget = document.createElement('div');
        this.addSocketListener();
        this.addEventListener = this.eventTarget.addEventListener.bind(this.eventTarget);
        this.removeEventListener = this.eventTarget.removeEventListener.bind(this.eventTarget);
        this.dispatchEvent = this.eventTarget.dispatchEvent.bind(this.eventTarget);
        if (defaultReconnectSettings.automaticOpen === true) {
            this.open(false);
        }
        this.debugAll = false;
        this.CONNECTING = WebSocket.CONNECTING;
        this.OPEN = WebSocket.OPEN;
        this.CLOSING = WebSocket.CLOSING;
        this.CLOSED = WebSocket.CLOSED;
    }
    /**
     *
     * @param {ReconnectSettings} options
     */
    ReconnectWebSocket.prototype.initSettings = function (options) {
        for (var _i = 0, _a = Object.keys(options); _i < _a.length; _i++) {
            var key = _a[_i];
            if (typeof options[key] !== 'undefined') {
                this[key] = options[key];
            }
            else {
                this[key] = defaultReconnectSettings[key];
            }
        }
    };
    ReconnectWebSocket.prototype.open = function (reconnectAttempt) {
        var _this = this;
        if (!('WebSocket' in window)) {
            throw new Error('WebSocket not supported by current browser!');
        }
        this.ws = new WebSocket(this.url, this.protocols || []);
        this.ws.binaryType = this.binaryType;
        if (reconnectAttempt) {
            if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
                return;
            }
        }
        else {
            this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('connecting'));
            this.reconnectAttempts = 0;
        }
        if (this.debug || this.debugAll) {
            console.debug('ReconnectingWebSocket', 'attempt-connect', this.url);
        }
        var localWs = this.ws;
        var timeout = setTimeout(function () {
            if (_this.debug || _this.debugAll) {
                console.debug('ReconnectingWebSocket', 'connection-timeout', _this.url);
            }
            _this.timedOut = true;
            localWs.close();
            _this.timedOut = false;
        }, defaultReconnectSettings.timeoutInterval);
        this.ws.onopen = function () {
            clearTimeout(timeout);
            if (_this.debug || _this.debugAll) {
                console.debug('ReconnectingWebSocket', 'onopen', _this.url);
            }
            _this.protocol = _this.ws.protocol;
            _this.readyState = WebSocket.OPEN;
            _this.reconnectAttempts = 0;
            var e = Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('open');
            Object.assign(e, { isReconnect: reconnectAttempt });
            reconnectAttempt = false;
            _this.eventTarget.dispatchEvent(e);
        };
        this.ws.onclose = function (event) {
            clearTimeout(timeout);
            _this.ws = null;
            if (_this.forcedClose) {
                _this.readyState = WebSocket.CLOSED;
                _this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('close'));
            }
            else {
                _this.readyState = WebSocket.CONNECTING;
                var e = Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('connecting');
                Object.assign(e, {
                    code: event.code,
                    reason: event.reason,
                    wasClean: event.wasClean
                });
                _this.eventTarget.dispatchEvent(e);
                if (!reconnectAttempt && !_this.timedOut) {
                    if (_this.debug || _this.debugAll) {
                        console.debug('ReconnectingWebSocket', 'onclose', _this.url);
                    }
                    _this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('close'));
                }
                var timeouts = defaultReconnectSettings.reconnectInterval * Math.pow(defaultReconnectSettings.reconnectDecay, _this.reconnectAttempts);
                setTimeout(function () {
                    _this.reconnectAttempts++;
                    _this.open(true);
                }, timeouts > defaultReconnectSettings.maxReconnectInterval ? defaultReconnectSettings.maxReconnectInterval : timeouts);
            }
        };
        this.ws.onmessage = function (event) {
            if (_this.debug || _this.debugAll) {
                console.debug('ReconnectingWebSocket', 'onmessage', _this.url, event.data);
            }
            var e = Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('message');
            Object.assign(e, { data: event.data });
            _this.eventTarget.dispatchEvent(e);
        };
        this.ws.onerror = function (event) {
            if (_this.debug || _this.debugAll) {
                console.debug('ReconnectingWebSocket', 'onerror', _this.url, event);
            }
            _this.eventTarget.dispatchEvent(Object(__WEBPACK_IMPORTED_MODULE_0__helper__["a" /* generateEvent */])('error'));
        };
    };
    ReconnectWebSocket.prototype.addSocketListener = function () {
        var _this = this;
        this.eventTarget.addEventListener('open', function (event) {
            _this.onOpen(event);
        });
        this.eventTarget.addEventListener('close', function (event) {
            _this.onClose(event);
        });
        this.eventTarget.addEventListener('connecting', function (event) {
            _this.onConnecting(event);
        });
        this.eventTarget.addEventListener('message', function (event) {
            _this.onMessage(event);
        });
        this.eventTarget.addEventListener('error', function (event) {
            _this.onError(event);
        });
    };
    ReconnectWebSocket.prototype.send = function (data) {
        if (this.ws) {
            if (this.debug || this.debugAll) {
                console.debug('ReconnectingWebSocket', 'send', this.url, data);
            }
            return this.ws.send(data);
        }
        else {
            throw new Error('INVALID_STATE_ERR : Pausing to reconnect websocket');
        }
    };
    ReconnectWebSocket.prototype.close = function (code, reason) {
        if (typeof code === 'undefined') {
            code = 1000;
        }
        this.forcedClose = true;
        if (this.ws) {
            this.ws.close(code, reason);
        }
    };
    ReconnectWebSocket.prototype.refresh = function () {
        if (this.ws) {
            this.ws.close();
        }
    };
    ReconnectWebSocket.prototype.onOpen = function (event) { };
    ReconnectWebSocket.prototype.onClose = function (event) { };
    ReconnectWebSocket.prototype.onConnecting = function (event) { };
    ReconnectWebSocket.prototype.onMessage = function (event) { };
    ReconnectWebSocket.prototype.onError = function (event) { };
    return ReconnectWebSocket;
}());
/* harmony default export */ __webpack_exports__["a"] = (ReconnectWebSocket);


/***/ })
/******/ ]);
});