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
