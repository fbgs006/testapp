# Stream Resolver API (Node/TypeScript)

This service is the **ani-cli-style backend** for the PWA. It exposes a tiny HTTP API
that the frontend can call to resolve episode streams.

## Endpoints

- `GET /health` → `{ "status": "ok" }`
- `GET /stream?anilist_id=123&episode=1`
- `POST /oauth/anilist/token` → exchanges an AniList authorization code for a token

## Stream map

The resolver reads from `server/stream-map.json` (or `STREAM_MAP_PATH`) with this shape:

```json
{
  "15125": {
    "1": { "url": "https://example.com/episode-1.m3u8", "source": "custom" }
  }
}
```

If a match is found, the resolver returns that URL.

## Example responses

```json
{
  "anilistId": 15125,
  "episode": 1,
  "url": "https://example.com/episode-1.m3u8",
  "source": "custom"
}
```

Token exchange body:

```json
{
  "clientId": "12345",
  "clientSecret": "your-secret",
  "redirectUri": "http://localhost:5173",
  "code": "authorization-code"
}
```

## Run

```bash
npx tsc -p server/tsconfig.json
node server/dist/index.js
```
