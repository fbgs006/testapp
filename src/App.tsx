import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MyListPage } from './pages/MyListPage';
import { BrowsePage } from './pages/BrowsePage';
import { ProfilePage } from './pages/ProfilePage';
import { WatchPage } from './pages/WatchPage';
import { extractAniListCodeFromSearch, extractAniListTokenFromHash } from './lib/anilistAuth';

const links = [
  { to: '/', label: 'Home' },
  { to: '/my-list', label: 'My List' },
  { to: '/browse', label: 'Browse' },
  { to: '/profile', label: 'Profile' },
];

const DEFAULT_OAUTH_BASE_URL = 'http://localhost:8787';

export function App() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const token = extractAniListTokenFromHash(location.hash);
      if (token) {
        localStorage.setItem('anilist_token', token);
        window.history.replaceState(null, '', location.pathname);
      }
    }
  }, [location]);

  useEffect(() => {
    const code = extractAniListCodeFromSearch(location.search);
    if (!code) return;

    const clientId = localStorage.getItem('anilist_client_id') ?? '';
    const clientSecret = localStorage.getItem('anilist_client_secret') ?? '';
    const redirectUri = localStorage.getItem('anilist_redirect_uri') ?? window.location.origin;
    const oauthBaseUrl = localStorage.getItem('anilist_oauth_base_url') ?? DEFAULT_OAUTH_BASE_URL;

    if (!clientId || !clientSecret) {
      return;
    }

    fetch(`${oauthBaseUrl}/oauth/anilist/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret, redirectUri, code }),
    })
      .then(async (response) => {
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? 'Token exchange failed.');
        }
        if (payload.access_token) {
          localStorage.setItem('anilist_token', payload.access_token);
          window.history.replaceState(null, '', location.pathname);
        }
      })
      .catch(() => {
        // Silently ignore for now; Profile page shows configuration help.
      });
  }, [location]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <h1>AniList UI Starter</h1>
      </header>

      <main className="page-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/my-list" element={<MyListPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/watch/:anilistId" element={<WatchPage />} />
        </Routes>
      </main>

      <nav className="tab-bar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
