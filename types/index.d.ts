export interface InitParams {
    onMessage: (params: object) => void;
    onClosed?: (params?: object) => void;
    onConnected?: (params?: object) => void;
    onError?: (params?: object) => void;
}
export default class IM {
    onMessage: (params: object) => void;
    onConnected?: (params?: object) => void;
    onClosed?: (params?: object) => void;
    onError?: (params?: object) => void;
    callbacks: object;
    private timeout;
    private canRequest;
    private reqNo;
    private ws;
    /**
     *
     * @param {InitParams} config
     */
    constructor(config: InitParams);
    /**
     *
     * @param {string} url
     * @param {(error: null, response: object) => void} cb
     */
    connectWSServer(url: string, cb: (error: null, response: object) => void): void;
    /**
     *
     * @param {string} cmd
     * @param {object} data
     * @param cb
     * @returns {boolean}
     */
    request(cmd: string, data: object, cb: any): void;
    send(cmd: string, reqNo: string, params: object): void;
    closeConnection(): void;
    private close();
    private initTimeoutTicker();
}
