export interface AirQualityReading {
    temperature: number;
    humidity: number;
    time: Date;
}

type Protocol = "http" | "ws";

export default class ApiClient {
    host: string;
    tls: boolean;
    ws?: WebSocket;

    constructor(host: string, tls: boolean) {
        this.host = host;
        this.tls = tls;
    }

    async getData(): Promise<AirQualityReading[]> {
        const res = await fetch(this.getApiUrl("http", "data"));
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return (await res.json()).map(this.dataToAirQualityReading);
    };

    onMessage(listener: { (reading: AirQualityReading): void }): void {
        if (!this.ws) {
            this.ws = new WebSocket(this.getApiUrl("ws", "current"));
        }
        this.ws?.addEventListener("message", (evt: MessageEvent) => {
            const data: any[] = JSON.parse(evt.data);
            listener.call(this, this.dataToAirQualityReading(data));
        });
    }

    private getApiUrl(protocol: Protocol, resource: string): string {
        return protocol + (this.tls ? "s://" : "://") + this.host + "/dht/" + resource;
    }

    private dataToAirQualityReading(data: any): AirQualityReading {
        return { time: new Date(data[0]), temperature: data[1], humidity: data[2] };
    }
}