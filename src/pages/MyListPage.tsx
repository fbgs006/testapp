import { useEffect, useMemo, useState } from 'react';
import { AnimeCard, type AnimeCardData } from '../components/AnimeCard';
import { anilistRequest } from '../lib/anilist';

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

  const userId = useMemo(() => {
    const raw = localStorage.getItem('anilist_user_id');
    return raw ? Number(raw) : 0;
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setError('No AniList user ID found. Set localStorage key "anilist_user_id" first.');
      return;
    }

    anilistRequest<MyListQuery>(MEDIA_LIST_COLLECTION_QUERY, { type: 'ANIME', userId })
      .then((data) => {
        setLists(data.MediaListCollection.lists);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <p>Loading your list…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>My List</h2>
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
