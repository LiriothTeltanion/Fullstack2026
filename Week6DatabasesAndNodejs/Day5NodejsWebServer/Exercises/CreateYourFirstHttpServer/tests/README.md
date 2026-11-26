# Checking the HTTP responses

Run `npm test` from the [exercise directory](../README.md). The tests start a server on a free loopback port and make real HTTP requests. They check the home page, the plain-text reply, the JSON menu and the status codes for unknown routes and unsupported methods.

The `HEAD` test compares the response headers with the length of the corresponding `GET` body. A separate test launches `simple-server.js` as a child process and closes it when the request finishes.
