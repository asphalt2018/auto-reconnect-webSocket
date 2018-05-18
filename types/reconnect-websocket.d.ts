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
export default class ReconnectWebSocket {
    private reconnectAttempts;
    private readyState;
    private timedOut;
    private forcedClose;
    private maxReconnectAttempts;
    private readonly debug;
    private readonly debugAll;
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
    constructor(url: string, protocols: any, options: ReconnectSettings);
    initSettings(options: ReconnectSettings): void;
    open(reconnectAttempt: boolean): void;
    addSocketListener(): void;
    send(data: string | ArrayBuffer | Blob | ArrayBufferView): void;
    close(code: any, reason: string): void;
    refresh(): void;
    onOpen(event: Event): void;
    onClose(event: Event): void;
    onConnecting(event: Event): void;
    onMessage(event: Event): void;
    onError(event: Event): void;
}
