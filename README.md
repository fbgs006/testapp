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
