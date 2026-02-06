import { NavLink, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MyListPage } from './pages/MyListPage';
import { BrowsePage } from './pages/BrowsePage';
import { ProfilePage } from './pages/ProfilePage';

const links = [
  { to: '/', label: 'Home' },
  { to: '/my-list', label: 'My List' },
  { to: '/browse', label: 'Browse' },
  { to: '/profile', label: 'Profile' },
];

export function App() {
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
