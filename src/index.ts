import ReconnectWebSocket from './reconnect-websocket';
import {msgToUint, uintToMsg} from './helper';

export interface InitParams {
  onMessage: (params: object) => void;
  onClosed?: (params?: object) => void;
  onConnected?: (params?: object) => void;
  onError?: (params?: object) => void;
}

export default class IM {
  public onMessage: (params: object) => void;
  public onConnected?: (params?: object) => void;
  public onClosed?: (params?: object) => void;
  public onError?: (params?: object) => void;
  public callbacks: object = {};
  private timeout: number = 20;
  private canRequest: boolean = false;
  private reqNo: string = `${Math.random().toString(16).substring(2)}_${Date.now()}`;
  private ws: any;

  /**
   *
   * @param {InitParams} config
   */
  constructor(config: InitParams) {
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
  public connectWSServer(url: string, cb: (error: null, response: object) => void): void {
    this.ws = new ReconnectWebSocket(url, null, {
      binaryType: 'arraybuffer',
      debug: false,
      reconnectInterval: 4000,
      timeoutInterval: 5000
    });
    this.ws.onOpen = (data: CustomEvent): void => {
      this.canRequest = true;
      if (cb) {
        cb(null, data);
      }
      this.onConnected(data);
    };
    this.ws.onClose = (data: CustomEvent): void => {
      this.canRequest = false;
      this.onClosed(data);
    };
    this.ws.onMessage = (data: any): void => {
      const newData = uintToMsg(data.data);
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

  /**
   *
   * @param {string} cmd
   * @param {object} data
   * @param cb
   * @returns {boolean}
   */
  public request(cmd: string, data: object, cb: any) {
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
  }

  public send(cmd: string, reqNo: string, params: object): void {
    const msg = {
      cmd, reqNo, params
    };
    this.ws.send(msgToUint(msg));
  }

  public closeConnection(): void {
    this.ws.close();
  }

  private close(): void {
    this.ws.close();
  }

  private initTimeoutTicker(): void {
    setInterval(() => {
      const now = Date.now();
      for (const cmd of Object.keys(this.callbacks)) {
        const cbs = this.callbacks[cmd];
        for (const reqNo of Object.keys(cbs)) {
          const cb = cbs[reqNo];
          if (now > cb.deadline) {
            cb(null, {data: {code: '0', msg: '请求超时', status: false}});
            delete this.callbacks[cmd][reqNo];
          }
        }
      }
    }, 1000 * this.timeout);
  }
}



