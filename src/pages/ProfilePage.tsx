import { useMemo, useState } from 'react';
import { buildAniListAuthUrl } from '../lib/anilistAuth';

export function ProfilePage() {
  const [clientId, setClientId] = useState(localStorage.getItem('anilist_client_id') ?? '');
  const [redirectUri, setRedirectUri] = useState(localStorage.getItem('anilist_redirect_uri') ?? window.location.origin);

  const authUrl = useMemo(() => {
    if (!clientId) return '';
    return buildAniListAuthUrl(clientId, redirectUri);
  }, [clientId, redirectUri]);

  const handleSave = () => {
    localStorage.setItem('anilist_client_id', clientId);
    localStorage.setItem('anilist_redirect_uri', redirectUri);
  };

  return (
    <section>
      <h2>Profile</h2>
      <p className="hint">Configure AniList OAuth to fetch your list and sync progress.</p>

      <label className="field">
        AniList Client ID
        <input value={clientId} onChange={(event) => setClientId(event.target.value)} placeholder="e.g. 12345" />
      </label>

      <label className="field">
        Redirect URI
        <input value={redirectUri} onChange={(event) => setRedirectUri(event.target.value)} />
      </label>

      <div className="button-row">
        <button type="button" className="secondary" onClick={handleSave}>
          Save settings
        </button>
        {authUrl ? (
          <a className="primary" href={authUrl}>
            Login with AniList
          </a>
        ) : null}
      </div>

      <p className="status">Access token is saved automatically after login.</p>
    </section>
  );
}
