import { ReconnectingWebSocket, PollingWebsocket, Web3Websocket } from "src";

declare module "ts-websockets" {
  export { ReconnectingWebSocket, PollingWebsocket, Web3Websocket };
}
