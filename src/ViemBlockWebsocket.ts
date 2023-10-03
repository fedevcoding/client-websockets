import { createPublicClient } from "viem";
import { OnBlockParameter } from "viem/src/actions/public/watchBlocks";

export default class ViemBlockWebsocket {
  private nameIdentifier: string;
  private isConnected: boolean = false;
  private connectFunction: ReturnType<typeof createPublicClient>["watchBlocks"];
  private connectOptions: Omit<
    Parameters<ReturnType<typeof createPublicClient>["watchBlocks"]>[0],
    "onBlock"
  >;
  private messageCallbacks: ((data: OnBlockParameter) => void)[] = [];

  constructor({
    nameIdentifier,
    connectFunction,
    connectOptions,
  }: {
    nameIdentifier?: string;
    connectFunction: ReturnType<typeof createPublicClient>["watchBlocks"];
    connectOptions: Omit<
      Parameters<ReturnType<typeof createPublicClient>["watchBlocks"]>[0],
      "onBlock"
    >;
  }) {
    this.nameIdentifier = nameIdentifier || "some";
    this.connectFunction = connectFunction;
    this.connectOptions = connectOptions;
  }

  public connect(): void {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log(`${this.nameIdentifier} WebSocket connected`);

    this.connectFunction({
      onBlock: (block) => {
        this.send(block as OnBlockParameter);
      },
      ...this.connectOptions,
    });
  }

  // public disconnect(): void {
  //   if (!this.isConnected) return;
  //   this.isConnected = false;
  //   // this.subscription?.unsubscribe();
  // }

  public send(data: OnBlockParameter): void {
    if (!this.isConnected) return;
    this.messageCallbacks.forEach((callback) => callback(data));
  }

  public onMessage(callback: (data: OnBlockParameter) => void): void {
    this.messageCallbacks.push(callback);
  }
}
