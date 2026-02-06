import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimeCard, type AnimeCardData } from '../components/AnimeCard';
import { anilistRequest } from '../lib/anilist';

type HomeQuery = {
  Page: {
    pageInfo: {
      currentPage: number;
      hasNextPage: boolean;
    };
    media: Array<{
      id: number;
      title: { userPreferred: string };
      coverImage: { large: string | null };
    }>;
  };
};

const TRENDING_QUERY = `
  query TrendingAnime($page: Int!) {
    Page(page: $page, perPage: 12) {
      pageInfo {
        currentPage
        hasNextPage
      }
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
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const requestedPageRef = useRef<Set<number>>(new Set());

  const loadPage = useCallback(async (nextPage: number) => {
    if (requestedPageRef.current.has(nextPage)) {
      return;
    }

    requestedPageRef.current.add(nextPage);
    setIsLoading(true);
    setError(null);

    try {
      const data = await anilistRequest<HomeQuery>(TRENDING_QUERY, { page: nextPage });
      const mapped = data.Page.media.map((media) => ({
        id: media.id,
        title: media.title.userPreferred,
        coverImage: media.coverImage.large,
      }));

      setItems((prev) => {
        const deduped = new Map<number, AnimeCardData>();
        [...prev, ...mapped].forEach((anime) => {
          deduped.set(anime.id, anime);
        });
        return [...deduped.values()];
      });

      setPage(data.Page.pageInfo.currentPage);
      setHasNextPage(data.Page.pageInfo.hasNextPage);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
      requestedPageRef.current.delete(nextPage);
    }
  }, []);

  useEffect(() => {
    void loadPage(1);
  }, [loadPage]);

  const canLoadMore = useMemo(() => hasNextPage && !isLoading, [hasNextPage, isLoading]);

  useEffect(() => {
    if (!canLoadMore || !sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            void loadPage(page + 1);
          }
        });
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [canLoadMore, loadPage, page]);

  return (
    <section>
      <h2>Trending</h2>
      {error ? <p className="error">{error}</p> : null}
      <div className="grid">{items.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}</div>

      {isLoading ? <p className="loading">Loading more trending anime…</p> : null}
      {!hasNextPage && items.length > 0 ? <p className="hint">You reached the end of trending results.</p> : null}

      <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />
    </section>
  );
}
