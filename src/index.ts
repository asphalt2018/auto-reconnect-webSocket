import ReconnectWebSocket from "./reconnect-websocket";
import {msgToUint, uintToMsg} from "./helper"

export interface InitParams {
  onMessage: (params: object) => void;
  onClosed?: (params?: object) => void;
  onConnected?: (params?: object) => void;
  onError?: (params?: object) => void;
}

export default class IM {
  private timeout: number = 20;
  private canRequest: boolean = false;
  private reqNo: string = `${Math.random().toString(16).substring(2)}_${Date.now()}`;
  onMessage: (params: object) => void;
  onConnected?: (params?: object) => void;
  onClosed?: (params?: object) => void;
  onError?: (params?: object) => void;
  callbacks: object = {};
  private ws: any;

  constructor(config: InitParams) {
    this.initTimeoutTicker();
    this.onMessage = config.onMessage;
    this.onConnected = config.onConnected;
    this.onClosed = config.onClosed;
    this.onError = config.onError
  }

  initTimeoutTicker(): void {
    setInterval(() => {
      let now = Date.now();
      for (let cmd of Object.keys(this.callbacks)) {
        let cbs = this.callbacks[cmd];
        for (let reqNo of Object.keys(cbs)) {
          let cb = cbs[reqNo];
          if (now > cb.deadline) {
            cb(null, {data: {code: "0", message: "request timeout", status: false}});
            delete this.callbacks[cmd][reqNo];
          }
        }
      }
    }, 1000 * this.timeout)
  }

  close(): void {
    this.ws.close()
  }

  connectWSServer(url: string, cb: (error: null, response: object) => void): void {
    this.ws = new ReconnectWebSocket(url, null, {
      binaryType: "arraybuffer",
      debug: false,
      reconnectInterval: 4000,
      timeoutInterval: 5000
    });
    this.ws.onOpen = (data: CustomEvent): void => {
      this.canRequest = true;
      if (cb) {
        cb(null, data)
      }
      this.onConnected(data);
    };
    this.ws.onClose = (data: CustomEvent): void => {
      this.canRequest = false;
      this.onClosed(data);
    };
    this.ws.onMessage = (data: any): void => {
      let newData = uintToMsg(data.data);
      if (this.callbacks[newData.cmd] && this.callbacks[newData.cmd][newData.resNo]) {
        this.callbacks[newData.cmd][newData.resNo](null, newData);
        delete this.callbacks[newData.cmd][newData.resNo];
      } else {
        this.onMessage(newData);
      }
    };
    this.ws.onError = (data: CustomEvent): void => {
      this.onError(data);
    };
    window.onbeforeunload = (): void => {
      this.ws.close();
    };
    window.onunload = (): void => {
      this.ws.close();
    };
  }

  request(cmd: string, data: object, cb: any) {
    if (!this.canRequest) return false;
    if (typeof cb === "function") {
      cb.deadline = Date.now() + 1000 * 10;
      if (!this.callbacks[cmd]) {
        this.callbacks[cmd] = {};
      }
      this.callbacks[cmd][this.reqNo] = cb;
    }
    this.send(cmd, this.reqNo, data);
  }

  send(cmd: string, reqNo: string, params: object): void {
    let msg = {
      cmd, reqNo, params
    };
    this.ws.send(msgToUint(msg));
  }

  closeConnection(): void {
    this.ws.close()
  }
}



