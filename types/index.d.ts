export interface InitParams {
    onMessage: (params: object) => void;
    onClosed?: (params?: object) => void;
    onConnected?: (params?: object) => void;
    onError?: (params?: object) => void;
}
export default class IM {
    private timeout;
    private canRequest;
    private reqNo;
    onMessage: (params: object) => void;
    onConnected?: (params?: object) => void;
    onClosed?: (params?: object) => void;
    onError?: (params?: object) => void;
    callbacks: object;
    private ws;
    constructor(config: InitParams);
    initTimeoutTicker(): void;
    close(): void;
    connectWSServer(url: string, cb: (error: null, response: object) => void): void;
    request(cmd: string, data: object, cb: any): boolean;
    send(cmd: string, reqNo: string, params: object): void;
    closeConnection(): void;
}
