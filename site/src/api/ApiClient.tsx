export interface AirQualityReading {
    temperature: number;
    humidity: number;
    time: string;
}

export default class ApiClient {
    host: string;
    tls: boolean;
    ws?: WebSocket;

    constructor(host: string, tls: boolean) {
        this.host = host;
        this.tls = tls;
    }

    async getData(): Promise<AirQualityReading[]> {
        const res = await fetch((this.tls ? "https://" : "http://") + this.host + "/data");
        if (!res.ok) {
            throw new Error(res.statusText);
        }
        return (await res.json()).map(this.dataToAirQualityReading);
    };

    onMessage(listener: { (reading: AirQualityReading): void }): void {
        if (!this.ws) {
            this.ws = new WebSocket((this.tls ? "wss://" : "ws://") + this.host + "/current");
        }
        this.ws?.addEventListener("message", (evt: MessageEvent) => {
            const data: any[] = JSON.parse(evt.data);
            listener.call(this, this.dataToAirQualityReading(data));
        });
    }

    private dataToAirQualityReading(data: any): AirQualityReading {
        return { time: data[0], temperature: data[1], humidity: data[2] };
    }
}