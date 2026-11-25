# 🎮 Mini Project - Real-time Chat App

<div align="center">

<img src="../../../../assets/readme/folder-pulse.svg" width="100%" alt="Animated learning pulse">

<img src="../../../../assets/readme/progress/real-time-chat-app-0204c11b5a.svg" width="100%" alt="Progress card for Real-time Chat App">

</div>

A chat where messages show up in every open tab straight away. Express serves the page and Socket.IO keeps a live connection to each browser, with rooms, an online list and a typing notice.

## ▶️ How to run

```bash
npm install
npm run dev
```

Open http://localhost:3000 in two tabs, pick a name in each and join the same room.

I tested it with two scripted clients (Noa and Ariel in room `js`). Noa received (I left out the `time` field):

```
chat:system {"text":"Welcome to #js, Noa"}
chat:system {"text":"Ariel joined"}
room:users ["Noa","Ariel"]
chat:typing {"username":"Ariel","isTyping":true}
chat:message {"username":"Noa","text":"<b>hi</b> from Noa"}
chat:system {"text":"Ariel left"}
```

## 🎯 The challenge

| Event | Direction | What it does |
|---|---|---|
| `join` | browser → server | Saves `{ username, room }` for the socket and calls `socket.join(room)` |
| `chat:message` | both ways | The server trims the text (max 500 characters), adds the time and sends it to the room |
| `chat:typing` | both ways | Tells the others in the room that someone is typing |
| `chat:system` | server → browser | Welcome, joined and left notices |
| `room:users` | server → browser | The list of names in the room |

The browser code in `public/app.js` writes every message with `textContent`, so the `<b>hi</b>` above shows up as plain text instead of bold HTML.

## 🧠 What I learned

- `io.to(room).emit` reaches everyone in the room, `socket.to(room).emit` everyone except the sender
- A `Map` from `socket.id` to the user is enough to know who left on `disconnect`
- The typing notice turns itself off after 1.2 seconds with `clearTimeout` and `setTimeout`
- The client library comes from the server itself at `/socket.io/socket.io.js`, no CDN needed
- `express-rate-limit` guards the page Express serves (100 requests per 15 minutes per IP); chat messages go over the socket and don't count

---

## 👤 Author

**Kevin Cusnir 'Lirioth'**  
Repository: [Fullstack2026](https://github.com/LiriothTeltanion/Fullstack2026)  
Week 7 Day 3 - Mini-project Day - Mini Project
