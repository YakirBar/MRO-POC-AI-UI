# MRO AI Assistant — React UI

Minimal React + Vite chat UI. It sends one request at a time to your existing API, waits for the response, and disables the input until completion. Messages are only kept in React memory (refresh clears them).

## Run

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the URL shown by Vite (usually http://localhost:5173).

## API

Default endpoint: `POST http://localhost:5000/ask_chatbot`

Request body:

```json
{"question":"What are the allowable backlash limits?"}
```

Response: `{"answer":"..."}` (also supports `response` or `message` as a string).

To change the endpoint, copy `.env.example` to `.env` and edit `VITE_API_URL`. Restart Vite after editing.

**Important:** `localhost` refers to the computer running the **browser**. If the API runs on another machine, set its reachable host/IP. Since Vite and the API run on different ports, your Node.js API must allow CORS from the UI origin (typically http://localhost:5173), or use a reverse proxy.

## Production build

```bash
npm run build
```

Static output is in `dist/`.
