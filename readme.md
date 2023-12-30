# Client websockets

## Introduction

### This npm package provides easy-to-use WebSocket implementations for various scenarios, including polling-based, reconnecting, and Web3 subscriptions. The package is written in TypeScript and supports a generic data type for flexibility.

## Installation

```bash
npm install client-websockets
```

## Usage

## Reconnecting WebSocket

```ts
import { ReconnectingWebSocket } from "client-websockets";

// Example usage
const reconnectingWebSocket = new ReconnectingWebSocket<string>({
  url: "wss://example.com",
  connectionData: { key: "value" },
  reconnectInterval: 1000,
  maxRetries: 10,
  nameIdentifier: "example",
  pingIntervalMs: 5000,
});

reconnectingWebSocket.connect(); // Connect the websocket
reconnectingWebSocket.disconnect(); // Disconnect the websocket
reconnectingWebSocket.onMessage((data) => {
  // Handle incoming messages
});
```

## Polling WebSocket

```ts
import { PollingWebsocket } from "client-websockets";

// Example usage
const pollingWebSocket = new PollingWebsocket<string>({
  nameIdentifier: "example",
  pollingInterval: 3000,
  pollingFunction: () => {
    // fetch data and check if it has changed
    pollingWebSocket.send("Fetched data");
  },
});

pollingWebSocket.connect(); // Connect the websocket
pollingWebSocket.disconnect(); // Disconnect the websocket
pollingWebSocket.onMessage((data) => {
  // Handle incoming messages
});
```
