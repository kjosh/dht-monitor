
export default class ApiClient {
    host: string;
    tls: boolean;

    constructor(host: string, tls: boolean) {
        this.host = host;
        this.tls = tls;
    }

    currentData(): WebSocket  {
        return new WebSocket((this.tls ? "wss://" : "ws://") + this.host + "/current");
    }
}