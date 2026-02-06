# Stream Resolver API (Node/TypeScript)

This service is the **ani-cli-style backend** for the PWA. It exposes a tiny HTTP API
that the frontend can call to resolve episode streams.

## Endpoints

- `GET /health` → `{ "status": "ok" }`
- `GET /stream?anilist_id=123&episode=1`

Example response:

```json
{
  "anilistId": 123,
  "episode": 1,
  "url": null,
  "source": null,
  "note": "No stream resolver wired yet for AniList 123 episode 1."
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
