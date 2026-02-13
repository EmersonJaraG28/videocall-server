# 🧠 videocall-server

A signaling server built with [Socket.IO](https://socket.io/) and [Express](https://expressjs.com/) to support multi-user WebRTC rooms (mesh topology).

> 📡 Designed to work with [`videocall-client-socket`](https://www.npmjs.com/package/videocall-client-socket)

---

## 🚀 Features

- Lightweight signaling server for WebRTC
- Room-based architecture using Socket.IO
- Multi-user room support (not limited to 1:1)
- Handles signaling messages and media state toggles
- Distinguishes user identity and device/session identity (`userId` + `userUUID`)
- CORS-enabled and ready for deployment (e.g., Render, Vercel)

---

## 📦 Installation

```bash
git clone https://github.com/EmersonJaraG28/videocall-server.git
cd videocall-server
npm install
```

---

## ▶️ Running the Server

```bash
npm run dev
```

The server will run on:

```
http://localhost:3000
```

---

## 🔌 Socket Events

### 🔽 Events received from clients

| Event | Payload | Description |
| -------------- | ------------------------ | -------------------------------------- |
| `signal` | `{ targetId, signal }` | Forwards WebRTC signal to target peer. |
| `media-toggle` | `{ userId, userUUID, type: 'audio' or 'video', enabled }` | Informs other peers of media changes. |
| `initial-media-status` | `{ targetId, audio, video }` | Sends initial mic/camera state to a target peer. |

### 🔼 Events emitted to clients

| Event | Payload | Description |
| -------------------- | -------------------------------- | -------------------------------------- |
| `all-users` | `[{ userId, userUUID, socketId }]` | Sent to a new user with current peers in room. |
| `user-joined` | `{ userId, userUUID, socketId }` | Broadcast when a new participant joins. |
| `signal` | `{ fromId, fromUserId, fromUserUUID, signal }` | WebRTC signal sent to specific peer. |
| `user-left` | `{ userId, userUUID }` | Broadcast when a participant disconnects. |
| `user-media-toggled` | `{ userId, userUUID, type, enabled }` | Informs others of mic/camera toggle. |

---

## 🧩 Client Integration

Use with the [videocall-client-socket](https://www.npmjs.com/package/videocall-client-socket) npm package:

```bash
npm install videocall-client-socket
```

Example usage:

```js
import * as VideoClient from "videocall-client-socket";
import { v4 as uuidv4 } from "uuid";

VideoClient.setServerURL("http://localhost:3000");
VideoClient.joinChannel("user123", uuidv4(), "my-room");
```

---

## 🕸 Connection Model

- The server provides signaling only.
- Media is exchanged directly between clients using WebRTC.
- In each room, every participant can connect to every other participant (mesh).

---

## 🛠 Environment Variables

Optional:

- `PORT` – Port to run the server on (default is 3000)

---

## 📚 Related Projects

- [videocall-client-socket (npm)](https://www.npmjs.com/package/videocall-client-socket)
- [simple-peer](https://www.npmjs.com/package/simple-peer)
- [Socket.IO](https://socket.io/)

---

## 🧾 License

ISC © [Jara](https://github.com/EmersonJaraG28)
