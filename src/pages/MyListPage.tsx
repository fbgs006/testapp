import { useEffect, useMemo, useState } from 'react';
import { AnimeCard, type AnimeCardData } from '../components/AnimeCard';
import { anilistRequest } from '../lib/anilist';

type ViewerQuery = {
  Viewer: {
    id: number;
    name: string;
  };
};

type MyListQuery = {
  MediaListCollection: {
    lists: Array<{
      name: string;
      entries: Array<{
        id: number;
        progress: number;
        media: {
          id: number;
          episodes: number | null;
          title: { userPreferred: string };
          coverImage: { large: string | null };
        };
      }>;
    }>;
  };
};

const VIEWER_QUERY = `
  query {
    Viewer {
      id
      name
    }
  }
`;

const MEDIA_LIST_COLLECTION_QUERY = `
  query($type: MediaType!, $userId: Int!) {
    MediaListCollection(type: $type, userId: $userId) {
      lists {
        name
        entries {
          id
          progress
          media {
            id
            episodes
            title { userPreferred }
            coverImage { large }
          }
        }
      }
    }
  }
`;

export function MyListPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lists, setLists] = useState<MyListQuery['MediaListCollection']['lists']>([]);
  const [viewerName, setViewerName] = useState<string | null>(null);

  const token = useMemo(() => localStorage.getItem('anilist_token') ?? '', []);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        setLoading(false);
        setError('Add your AniList access token to localStorage as "anilist_token" to load your list.');
        return;
      }

      try {
        const viewer = await anilistRequest<ViewerQuery>(VIEWER_QUERY, undefined, token);
        setViewerName(viewer.Viewer.name);

        const data = await anilistRequest<MyListQuery>(MEDIA_LIST_COLLECTION_QUERY, { type: 'ANIME', userId: viewer.Viewer.id }, token);
        setLists(data.MediaListCollection.lists);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [token]);

  if (loading) return <p>Loading your list…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>My List {viewerName ? `(${viewerName})` : ''}</h2>
      {lists.map((list) => {
        const cards: AnimeCardData[] = list.entries.map((entry) => {
          const total = entry.media.episodes ?? '?';
          return {
            id: entry.media.id,
            title: entry.media.title.userPreferred,
            coverImage: entry.media.coverImage.large,
            progressLabel: `Episode ${entry.progress} / ${total}`,
          };
        });

        return (
          <div key={list.name} className="list-section">
            <h3>{list.name}</h3>
            <div className="grid">{cards.map((anime) => <AnimeCard key={`${list.name}-${anime.id}`} anime={anime} />)}</div>
          </div>
        );
      })}
    </section>
  );
}
