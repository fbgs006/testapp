# AniList PWA Starter

Minimal React + TypeScript starter for an AniList-inspired interface with:

- **Home** (trending anime via AniList with infinite scroll pagination)
- **My List** (full list using `MediaListCollection`)
- **Browse/Profile** placeholders

## Run

```bash
npm install
npm run dev
```

## My List setup

Until OAuth is wired, set a localStorage user id from your browser console:

```js
localStorage.setItem('anilist_token', 'YOUR_ANILIST_ACCESS_TOKEN')
```

Then reload and open `/my-list`. The app will fetch your Viewer profile and list.

## Stream resolver backend (Node/TypeScript)

A minimal Node/TypeScript service lives in `server/` and exposes the `/stream` endpoint the PWA will call.
The current provider is a placeholder until a real stream resolver is added.



## Watch placeholder

Each anime card now includes a **Watch** button that opens `/watch/:anilistId`. This page calls the
backend `/stream` endpoint and displays the resolved URL (or a placeholder note until the resolver
is implemented).


## Stream resolver URL

By default the Watch page calls `http://localhost:8787/stream`. If your backend runs elsewhere, set:

```js
localStorage.setItem('stream_base_url', 'http://localhost:8787')
```


## AniList OAuth (Login button)

1. Create an AniList app: https://anilist.co/settings/developer
2. Add your client ID and redirect URI in the Profile tab.
3. Tap **Login with AniList** to store the access token automatically.

The token is saved to `localStorage.anilist_token` so My List can load.


## OAuth flow selection

If you see `unsupported_grant_type`, ensure you are using the **Implicit (token)** flow. The Profile tab
lets you switch between `response_type=token` and `response_type=code` (the latter requires a backend exchange).


## Authorization Code exchange

If you select the **Authorization Code** flow, the app will send the `code` to the backend
`POST /oauth/anilist/token` endpoint (configured in Profile via **OAuth Backend Base URL**) to
exchange it for an access token. This requires the server to be running and your client secret to
be saved in the Profile settings.


## Troubleshooting invalid token

If My List says **Invalid token**, check the Profile page:
- "Token saved ✅" means an access token is stored.
- "Token missing ❌" means OAuth did not complete.
- Any "Last OAuth error" message will tell you why the exchange failed.

For **Authorization Code** flow, ensure the backend is running on the configured OAuth base URL and
that your client secret matches the AniList app settings.


## Stream resolver mapping

To return a real stream URL, add entries to `server/stream-map.json` using the AniList ID and episode
number. The backend will return that URL from `/stream` when you hit the Watch button.


## Start the resolver

The stream resolver is a separate Node service. Start it in another terminal:

```bash
node server/dist/index.js
```

Then set the PWA to point to it:

```js
localStorage.setItem('stream_base_url', 'http://localhost:8787')
```
