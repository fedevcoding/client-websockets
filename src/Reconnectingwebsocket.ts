import WebSocket from "ws";

export default class ReconnectingWebSocket<DataType> {
  private url: string;
  private ws: WebSocket | null;
  private reconnectInterval: number;
  private shouldReconnect: boolean;
  private reconnectTimer: NodeJS.Timeout | null;
  private maxRetries: number;
  private retryAttempts: number = 0;
  private pingInterval: number = 5000;
  private pingTimer: NodeJS.Timeout | null;
  private nameIdentifier: string;

  private connectionData = {};
  private messageCallbacks: ((data: DataType) => void)[] = [];

  constructor({
    url,
    connectionData,
    reconnectInterval = 1000,
    maxRetries = 10,
    nameIdentifier,
    pingIntervalMs = 5000,
  }: {
    url: string;
    connectionData: object;
    pingIntervalMs?: number;
    reconnectInterval?: number;
    maxRetries?: number;
    nameIdentifier?: string;
  }) {
    this.pingInterval = pingIntervalMs;
    this.nameIdentifier = nameIdentifier || "some";
    this.url = url;
    this.ws = null;
    this.connectionData = connectionData;
    this.reconnectInterval = reconnectInterval;
    this.maxRetries = maxRetries;
    this.shouldReconnect = true;
    this.reconnectTimer = null;
    this.pingTimer = null;
  }

  public connect(): void {
    this.ws = new WebSocket(this.url);

    this.ws.on("open", () => {
      console.log(`${this.nameIdentifier} WebSocket connected`);
      this.retryAttempts = 0;
      this.ws?.send(JSON.stringify(this.connectionData));
      this.clearReconnectTimer();
      this.startPingTimer();
    });

    this.ws.on("close", () => {
      console.log(`${this.nameIdentifier} WebSocket disconnected`);
      if (this.shouldReconnect) {
        this.scheduleReconnect();
        this.stopPingTimer();
      }
    });

    this.ws.on("error", (error) => {
      console.log(`${this.nameIdentifier} WebSocket error`, error);
    });

    this.ws.on("message", (data: WebSocket.Data) => {
      const dataString = data.toString();
      this.messageCallbacks.forEach((callback) => {
        callback(JSON.parse(dataString) as DataType);
      });
    });
  }

  public disconnect(): void {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.stopPingTimer();

    if (this.ws) {
      this.ws.close();
    }
  }

  public onMessage(callback: (data: DataType) => void): void {
    this.messageCallbacks.push(callback);
  }

  private scheduleReconnect(): void {
    if (!this.reconnectTimer) {
      if (this.retryAttempts < this.maxRetries) {
        console.log(
          `Reconnecting ${this.nameIdentifier} WebSocket in  ${
            this.reconnectInterval / 1000
          } seconds for the ${this.retryAttempts + 1} time`,
        );

        this.reconnectTimer = setInterval(() => {
          this.clearReconnectTimer();
          this.connect();
          this.retryAttempts++;
        }, this.reconnectInterval);
      } else {
        console.log(`${this.nameIdentifier} WebSocket Max retries reached`);
      }
    }
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearInterval(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startPingTimer(): void {
    if (!this.pingTimer) {
      this.pingTimer = setInterval(() => {
        if (this.ws) {
          this.ws?.ping();
        }
      }, this.pingInterval);
    }
  }

  private stopPingTimer(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }
}
