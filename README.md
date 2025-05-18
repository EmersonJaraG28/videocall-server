# 🧠 videocall-server

A simple signaling server built with [Socket.IO](https://socket.io/) and [Express](https://expressjs.com/) to support peer-to-peer WebRTC connections.

> 📡 Designed to work with [`videocall-client-socket`](https://www.npmjs.com/package/videocall-client-socket)

---

## 🚀 Features

- Lightweight signaling server for WebRTC
- Room-based architecture using Socket.IO
- Handles signaling messages and media state toggles
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

| Event          | Payload                  | Description                            |
| -------------- | ------------------------ | -------------------------------------- | ------------------------------------- |
| `signal`       | `{ targetId, signal }`   | Forwards WebRTC signal to target peer. |
| `media-toggle` | `{ userId, type: 'audio' | 'video', enabled }`                    | Informs other peers of media changes. |

### 🔼 Events emitted to clients

| Event                | Payload                          | Description                            |
| -------------------- | -------------------------------- | -------------------------------------- |
| `all-users`          | `[{ userId, socketId }]`         | Sent to a new user with current peers. |
| `user-joined`        | `{ userId, socketId }`           | Broadcast when a new user joins.       |
| `signal`             | `{ fromId, fromUserId, signal }` | WebRTC signal sent to specific peer.   |
| `user-left`          | `{ userId }`                     | Broadcast when a user disconnects.     |
| `user-media-toggled` | `{ userId, type, enabled }`      | Informs others of mic/camera toggle.   |

---

## 🧩 Client Integration

Use with the [videocall-client-socket](https://www.npmjs.com/package/videocall-client-socket) npm package:

```bash
npm install videocall-client-socket
```

Example usage:

```js
import * as VideoClient from "videocall-client-socket";

VideoClient.setServerURL("http://localhost:3000");
VideoClient.joinChannel("user123", "my-room");
```

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
