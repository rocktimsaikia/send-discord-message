# send-discord-message

Send message to a Discord channel using channel webhooks. (Simplified)

[![Tests](https://github.com/rocktimsaikia/send-discord-message/actions/workflows/tests.yml/badge.svg)](https://github.com/rocktimsaikia/send-discord-message/actions/workflows/tests.yml) [![Release](https://github.com/rocktimsaikia/send-discord-message/actions/workflows/release.yml/badge.svg)](https://github.com/rocktimsaikia/send-discord-message/actions/workflows/release.yml) [![npm](https://img.shields.io/npm/v/send-discord-message?color=bright)](https://npmjs.com/package/send-discord-message)

## Installtion

```sh
# npm
npm i send-discord-message

# yarn
yarn add send-discord-message

# pnpm
pnpm add send-discord-message
```

## Usage

```javascript
import SendDiscordMessage from "send-discord-message";

// Initialize the messenger with a Discord channel webhook
const messenger = new SendDiscordMessage(process.env.DISCORD_WEBHOOK_URL)

// Send a message. That's it!
await messenger.send("Hello, world!");
```

## API

### `new SendDiscordMessage(options)`

Creates a new instance of the `SendDiscordMessage` class.

#### Parameters

##### `options`

> Type: `object`  
> An object containing the configuration for the Discord webhook.

- **`webhookUrl`**  
  > Type: `string`  
  > Required. The Discord channel webhook URL to send messages to. Must start with `https://discord.com/api/webhooks/`.

### `send(message)`

Sends a message to a Discord channel using the configured webhook.

#### Parameters

##### `message`

> Type: `string`  
> Required. The message content to send to the Discord channel. Must be a non-empty string.

#### Returns

> Type: `Promise<void>`  
> A promise that resolves when the message is successfully sent, or rejects with an error if the request fails.

#### Throws

- `Error: Invalid Discord webhook URL`  
  If the `webhookUrl` provided during instantiation is invalid or empty.
- `Error: Message must be a non-empty string`  
  If the `message` parameter is empty or not a string.
- `Error: Discord webhook failed: <status> <errorText>`  
  If the Discord webhook request fails (e.g., HTTP 401 Unauthorized).


## License

MIT License © [Rocktim Saikia](https://rocktimsaikia.dev)
