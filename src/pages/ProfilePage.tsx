import { useMemo, useState } from 'react';
import { buildAniListAuthUrl } from '../lib/anilistAuth';

const RESPONSE_TYPES = [
  { value: 'token', label: 'Implicit (token) — no backend required' },
  { value: 'code', label: 'Authorization Code — requires backend exchange' },
] as const;

type ResponseType = (typeof RESPONSE_TYPES)[number]['value'];

export function ProfilePage() {
  const [clientId, setClientId] = useState(localStorage.getItem('anilist_client_id') ?? '');
  const [redirectUri, setRedirectUri] = useState(localStorage.getItem('anilist_redirect_uri') ?? window.location.origin);
  const [responseType, setResponseType] = useState<ResponseType>(
    (localStorage.getItem('anilist_response_type') as ResponseType) ?? 'token',
  );

  const authUrl = useMemo(() => {
    if (!clientId || !redirectUri) return '';
    return buildAniListAuthUrl(clientId, redirectUri, responseType);
  }, [clientId, redirectUri, responseType]);

  const handleSave = () => {
    localStorage.setItem('anilist_client_id', clientId);
    localStorage.setItem('anilist_redirect_uri', redirectUri);
    localStorage.setItem('anilist_response_type', responseType);
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

      <fieldset className="fieldset">
        <legend>OAuth flow</legend>
        {RESPONSE_TYPES.map((option) => (
          <label key={option.value} className="radio-row">
            <input
              type="radio"
              name="responseType"
              value={option.value}
              checked={responseType === option.value}
              onChange={() => setResponseType(option.value)}
            />
            {option.label}
          </label>
        ))}
      </fieldset>

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

      {authUrl ? <p className="status">Auth URL: {authUrl}</p> : null}
      <p className="status">Access token is saved automatically after login.</p>
    </section>
  );
}
