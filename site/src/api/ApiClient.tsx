
export default class ApiClient {
    host: string;
    tls: boolean;
    ws?: WebSocket;

    constructor(host: string, tls: boolean) {
        this.host = host;
        this.tls = tls;
    }

    onMessage(listener: { (evt: MessageEvent): void }): void {
        if (!this.ws) {
            this.ws = new WebSocket((this.tls ? "wss://" : "ws://") + this.host + "/current");
        }
        this.ws?.addEventListener("message", listener);
    }
}