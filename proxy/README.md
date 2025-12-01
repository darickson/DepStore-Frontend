# DEP Proxy

This small Express proxy forwards `/api/*` requests to the real backend.

Quick start:

1. Install dependencies:

```powershell
cd proxy
npm install
```

2. Run the proxy:

```powershell
npm start
```

By default it forwards to `https://depbackend-fullstack.onrender.com` and listens on port `3000`.

Environment variables (optional):

- `TARGET` — backend URL (default: `https://depbackend-fullstack.onrender.com`)
- `SERVICE_ID` — service id to add as `x-service-id` header (default from your input)
- `PORT` — port to listen on (default: `3000`)

Usage with frontend during development:

1. In the frontend root, create or update `.env.local` to:

```
VITE_API_URL=http://localhost:3000
```

2. Start the proxy, then start the frontend dev server (`npm run dev`). The frontend will call `http://localhost:3000/api/...` and the proxy will forward to the real backend.
