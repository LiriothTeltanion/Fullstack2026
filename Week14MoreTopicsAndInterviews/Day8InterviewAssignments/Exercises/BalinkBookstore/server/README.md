# Local practice API 🛠️

![Folder animation](../../../../../assets/readme/folder-pulse.svg)

Run npm run api from the parent folder. The synthetic catalog is read-only. POST /api/orders validates item membership, quantities, customer fields and an authoritative total; its idempotency key protects retries. GET /api/orders/:id returns a receipt while this process remains running. It never sends a remote order or collects a payment.
