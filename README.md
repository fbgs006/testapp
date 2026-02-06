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
localStorage.setItem('anilist_user_id', 'YOUR_USER_ID')
```

Then reload and open `/my-list`.

## Stream resolver backend (Node/TypeScript)

A minimal Node/TypeScript service lives in `server/` and exposes the `/stream` endpoint the PWA will call.
The current provider is a placeholder until a real stream resolver is added.

