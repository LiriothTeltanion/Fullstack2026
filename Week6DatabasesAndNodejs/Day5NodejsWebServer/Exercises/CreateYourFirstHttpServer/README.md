# First HTTP Server Practice 🌐

A small, dependency-free Node.js server that moves from a plain-text response to HTML, path routing and a nested JSON menu. Each response uses the native `node:http` module and finishes with `response.end()`.

## Run

Use Node.js 20 or newer. No dependency installation is needed.

```sh
node simple-server.js
# Or: npm start
```

Open <http://127.0.0.1:3000>. The homepage renders an HTML document headed **Welcome to My Server**. `PORT` changes the port and `HOST` changes the bind address. The default host is loopback; the server stays on your computer. For example, in PowerShell:

```powershell
$env:PORT = '3100'
node simple-server.js
```

| Request            | Response                                                           |
| ------------------ | ------------------------------------------------------------------ |
| `GET /`            | HTML homepage with the required heading and navigation             |
| `GET /hello`       | A simple plain-text greeting                                       |
| `GET /about`       | A separate HTML response                                           |
| `GET /menu`        | JSON with `menu.firstCourse`, `menu.mainCourse` and `menu.dessert` |
| Unknown path       | `404` JSON error                                                   |
| Unsupported method | `405` with an `Allow` header                                       |

`HEAD` returns the same representation headers without its body. Query strings do not change route selection. The JSON menu contains Vegetable Soup, Hamburger and Fruit salad. In browser developer tools, inspect Network → Headers and Response to compare the HTML, plain-text and JSON content types.

## Verify

```sh
npm test
```

The tests start real HTTP listeners on temporary loopback ports and make actual requests. They check the exact homepage heading, text/HTML headers, all menu fields and values, distinct paths,404/405 behavior,HEAD responses and the documented executable. They use no external services and close their listeners afterward.

The application deliberately has no persistence, authentication or third-party dependencies. Importing `createPracticeServer()` creates a server object without opening a port, which keeps tests isolated from the command-line entrypoint.

## Learning notes

- A URL path selects the response; the query string can be handled separately.
- `Content-Type` tells a browser how to interpret the body. JSON objects must be serialized before sending.
- Headers precede `end()`, which completes the response. A missing `end()` can leave a client waiting.
- The tests verify executable behavior; they do not establish an instructor grade or chapter completion.

This standalone practice keeps the plain-text, HTML and JSON examples together in one server. It is an original implementation and explanation of native HTTP responses.

Built with AI-assisted tooling; I reviewed, tested and can explain every change.
