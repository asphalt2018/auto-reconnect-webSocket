import {generateEvent} from "./helper";

export interface ReconnectSettings {
  debug: boolean;
  reconnectInterval: number;
  timeoutInterval: number;
  binaryType: string;
  automaticOpen?: boolean;
  maxReconnectInterval?: number;
  reconnectDecay?: number;
  maxReconnectAttempts?: null;
}


const defaultReconnectSettings: ReconnectSettings = {
  debug: false,
  automaticOpen: true,
  reconnectInterval: 1000,
  maxReconnectInterval: 30000,
  reconnectDecay: 1.5,
  timeoutInterval: 2000,
  maxReconnectAttempts: null,
  binaryType: "blob"
};

export default class ReconnectWebSocket {
  private reconnectAttempts: number = 0;
  private readyState: number;
  private timedOut: boolean;
  private forcedClose: boolean;
  private maxReconnectAttempts: number;
  private readonly debug: boolean;
  private readonly debugAll: boolean;
  binaryType: BinaryType;
  protocols: any;
  protocol: string;
  ws: WebSocket;
  addEventListener: any;
  removeEventListener: any;
  dispatchEvent: any;
  readonly url: string;
  readonly eventTarget: HTMLElement;
  readonly CONNECTING: number;
  readonly OPEN: number;
  readonly CLOSING: number;
  readonly CLOSED: number;

  constructor(url: string, protocols: any, options: ReconnectSettings) {
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

  initSettings(options: ReconnectSettings): void {
    for (let key of Object.keys(options)) {
      if (typeof options[key] !== "undefined") {
        this[key] = options[key];
      } else {
        this[key] = defaultReconnectSettings[key];
      }
    }
  }

  open(reconnectAttempt: boolean): void {
    if (!("WebSocket" in window)) {
      throw new Error("WebSocket not supported by current browser!")
    }
    this.ws = new WebSocket(this.url, this.protocols || []);
    this.ws.binaryType = this.binaryType;
    if (reconnectAttempt) {
      if (this.maxReconnectAttempts && this.reconnectAttempts > this.maxReconnectAttempts) {
        return;
      }
    } else {
      this.eventTarget.dispatchEvent(generateEvent("connecting"));
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
    this.ws.onopen = (): void => {
      clearTimeout(timeout);
      if (this.debug || this.debugAll) {
        console.debug("ReconnectingWebSocket", "onopen", this.url);
      }
      this.protocol = this.ws.protocol;
      this.readyState = WebSocket.OPEN;
      this.reconnectAttempts = 0;
      const e = generateEvent("open");
      Object.assign(e, {isReconnect: reconnectAttempt});
      reconnectAttempt = false;
      this.eventTarget.dispatchEvent(e);
    };
    this.ws.onclose = (event: any): void => {
      clearTimeout(timeout);
      this.ws = null;
      if (this.forcedClose) {
        this.readyState = WebSocket.CLOSED;
        this.eventTarget.dispatchEvent(generateEvent("close"));
      } else {
        this.readyState = WebSocket.CONNECTING;
        const e = generateEvent("connecting");
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
          this.eventTarget.dispatchEvent(generateEvent("close"));
        }
        const timeout = defaultReconnectSettings.reconnectInterval * Math.pow(defaultReconnectSettings.reconnectDecay, this.reconnectAttempts);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.open(true);
        }, timeout > defaultReconnectSettings.maxReconnectInterval ? defaultReconnectSettings.maxReconnectInterval : timeout);
      }
    };
    this.ws.onmessage = (event: any): void => {
      if (this.debug || this.debugAll) {
        console.debug("ReconnectingWebSocket", "onMessage", this.url, event.data);
      }
      const e = generateEvent("message");
      Object.assign(e, {data: event.data});
      this.eventTarget.dispatchEvent(e);
    };
    this.ws.onerror = (event: any): void => {
      if (this.debug || this.debugAll) {
        console.debug("ReconnectingWebSocket", "onError", this.url, event);
      }
      this.eventTarget.dispatchEvent(generateEvent("error"));
    };
  }

  addSocketListener(): void {
    this.eventTarget.addEventListener("open", (event: Event): void => {
      this.onOpen(event)
    });
    this.eventTarget.addEventListener("close", (event: Event): void => {
      this.onClose(event)
    });
    this.eventTarget.addEventListener("connecting", (event: Event): void => {
      this.onConnecting(event)
    });
    this.eventTarget.addEventListener("message", (event: Event): void => {
      this.onMessage(event)
    });
    this.eventTarget.addEventListener("error", (event: Event): void => {
      this.onError(event)
    });
  }


  send(data: string | ArrayBuffer | Blob | ArrayBufferView): void {
    if (this.ws) {
      if (this.debug || this.debugAll) {
        console.debug("ReconnectingWebSocket", "send", this.url, data)
      }
      return this.ws.send(data);
    } else {
      throw "INVALID_STATE_ERR : Pausing to reconnect webSocket"
    }
  }

  close(code: any, reason: string): void {
    if (typeof code == "undefined") {
      code = 1000;
    }
    this.forcedClose = true;
    if (this.ws) {
      this.ws.close(code, reason);
    }
  }

  refresh(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  onOpen(event: Event): void {

  }

  onClose(event: Event): void {

  }

  onConnecting(event: Event): void {

  }

  onMessage(event: Event): void {

  }

  onError(event: Event): void {

  }
}