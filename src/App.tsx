import { useEffect } from 'react';
import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MyListPage } from './pages/MyListPage';
import { BrowsePage } from './pages/BrowsePage';
import { ProfilePage } from './pages/ProfilePage';
import { WatchPage } from './pages/WatchPage';
import { extractAniListTokenFromHash } from './lib/anilistAuth';

const links = [
  { to: '/', label: 'Home' },
  { to: '/my-list', label: 'My List' },
  { to: '/browse', label: 'Browse' },
  { to: '/profile', label: 'Profile' },
];

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
