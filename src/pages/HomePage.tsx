import { useEffect, useState } from 'react';
import { AnimeCard, type AnimeCardData } from '../components/AnimeCard';
import { anilistRequest } from '../lib/anilist';

type HomeQuery = {
  Page: {
    media: Array<{
      id: number;
      title: { userPreferred: string };
      coverImage: { large: string | null };
    }>;
  };
};

const TRENDING_QUERY = `
  query TrendingAnime {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, sort: [TRENDING_DESC, POPULARITY_DESC], isAdult: false) {
        id
        title { userPreferred }
        coverImage { large }
      }
    }
  }
`;

export function HomePage() {
  const [items, setItems] = useState<AnimeCardData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    anilistRequest<HomeQuery>(TRENDING_QUERY)
      .then((data) => {
        const mapped = data.Page.media.map((media) => ({
          id: media.id,
          title: media.title.userPreferred,
          coverImage: media.coverImage.large,
        }));
        setItems(mapped);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Unknown error');
      });
  }, []);

  return (
    <section>
      <h2>Trending</h2>
      {error ? <p className="error">{error}</p> : null}
      <div className="grid">{items.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}</div>
    </section>
  );
}
