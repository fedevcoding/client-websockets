export default class PollingWebsocket<DataType> {
  private nameIdentifier: string;
  private isConnected: boolean = false;
  private pollingInterval: number;
  private pollingTimer: NodeJS.Timeout | null = null;
  private pollingFunction: () => void = () => {};
  private messageCallbacks: ((data: DataType) => void)[] = [];

  constructor({
    nameIdentifier,
    pollingInterval,
    pollingFunction,
  }: {
    nameIdentifier?: string;
    pollingInterval?: number;
    pollingFunction?: () => void;
  }) {
    this.nameIdentifier = nameIdentifier || "some";
    this.pollingInterval = pollingInterval || 3000;
    this.pollingFunction = pollingFunction || (() => {});
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log(`${this.nameIdentifier} WebSocket connected`);

    this.pollingTimer = setInterval(() => {
      this.pollingFunction();
    }, this.pollingInterval);
  }

  public disconnect(): void {
    if (!this.isConnected) return;
    this.isConnected = false;

    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
  }

  public send(data: DataType): void {
    if (!this.isConnected) return;
    this.messageCallbacks.forEach((callback) => callback(data));
  }

  public onMessage(callback: (data: DataType) => void): void {
    this.messageCallbacks.push(callback);
  }
}
