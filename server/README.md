# Stream Resolver API (Node/TypeScript)

This service is the **ani-cli-style backend** for the PWA. It exposes a tiny HTTP API
that the frontend can call to resolve episode streams.

## Endpoints

- `GET /health` → `{ "status": "ok" }`
- `GET /stream?anilist_id=123&episode=1`
- `POST /oauth/anilist/token` → exchanges an AniList authorization code for a token

Example stream response:

```json
{
  "anilistId": 123,
  "episode": 1,
  "url": null,
  "source": null,
  "note": "No stream resolver wired yet for AniList 123 episode 1."
}
```

Example token exchange body:

```json
{
  "clientId": "12345",
  "clientSecret": "your-secret",
  "redirectUri": "http://localhost:5173",
  "code": "authorization-code"
}
```

## Status

The current implementation uses a **PlaceholderProvider**. Swap this provider for a real
stream resolver (scraper or API) once you're ready.

## Run

```bash
npx tsc -p server/tsconfig.json
node server/dist/index.js
```
