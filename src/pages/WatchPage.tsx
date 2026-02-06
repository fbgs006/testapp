import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

const DEFAULT_EPISODE = 1;
const DEFAULT_STREAM_BASE_URL = 'http://localhost:8787';

export function WatchPage() {
  const { anilistId } = useParams();
  const [episode, setEpisode] = useState(DEFAULT_EPISODE);
  const [status, setStatus] = useState<string | null>(null);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);

  const numericId = useMemo(() => Number(anilistId), [anilistId]);
  const streamBaseUrl = useMemo(() => localStorage.getItem('stream_base_url') ?? DEFAULT_STREAM_BASE_URL, []);

  const handleWatch = async () => {
    if (!numericId) {
      setStatus('Missing AniList ID.');
      return;
    }

    setStatus('Resolving stream…');
    setStreamUrl(null);

    try {
      const response = await fetch(`${streamBaseUrl}/stream?anilist_id=${numericId}&episode=${episode}`);
      const contentType = response.headers.get('content-type') ?? '';
      if (!response.ok) {
        const fallback = contentType.includes('application/json') ? await response.json() : await response.text();
        throw new Error(typeof fallback === 'string' ? fallback : JSON.stringify(fallback));
      }

      if (!contentType.includes('application/json')) {
        throw new Error('Stream resolver did not return JSON. Check the backend URL.');
      }

      const payload: { url: string | null; note?: string } = await response.json();
      if (!payload.url) {
        setStatus(payload.note ?? 'No stream URL returned yet.');
      } else {
        setStatus('Stream resolved.');
        setStreamUrl(payload.url);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unknown resolver error.');
    }
  };

  return (
    <section>
      <h2>Watch</h2>
      <p className="hint">AniList ID: {numericId || 'Unknown'}</p>
      <p className="hint">Stream resolver: {streamBaseUrl}</p>

      <label className="field">
        Episode
        <input
          type="number"
          min={1}
          value={episode}
          onChange={(event) => setEpisode(Number(event.target.value))}
        />
      </label>

      <button type="button" className="primary" onClick={handleWatch}>
        Resolve stream
      </button>

      {status ? <p className="status">{status}</p> : null}
      {streamUrl ? (
        <p className="status">
          Stream URL: <a href={streamUrl}>{streamUrl}</a>
        </p>
      ) : null}
    </section>
  );
}
