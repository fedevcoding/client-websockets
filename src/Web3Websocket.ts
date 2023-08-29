import { Subscription } from "web3-core-subscriptions";

export default class Web3Websocket<T> {
  private nameIdentifier: string;
  private isConnected: boolean = false;
  private connectFunction: () => Subscription<T>;
  private messageCallbacks: ((data: T) => void)[] = [];
  private subscription: Subscription<T> | null = null;

  constructor({
    nameIdentifier,
    connectFunction,
  }: {
    nameIdentifier?: string;
    connectFunction: () => Subscription<T>;
  }) {
    this.nameIdentifier = nameIdentifier || "some";
    this.connectFunction = connectFunction;
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log(`${this.nameIdentifier} WebSocket connected`);
    this.subscription = this.connectFunction();
    this.subscription.on("data", (res: T) => {
      this.send(res);
    });
  }

  public disconnect(): void {
    if (!this.isConnected) return;
    this.isConnected = false;
    this.subscription?.unsubscribe();
  }

  public send(data: T): void {
    if (!this.isConnected) return;
    this.messageCallbacks.forEach((callback) => callback(data));
  }

  public onMessage(callback: (data: T) => void): void {
    this.messageCallbacks.push(callback);
  }
}
