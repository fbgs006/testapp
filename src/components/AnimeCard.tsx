import { Link } from 'react-router-dom';

export type AnimeCardData = {
  id: number;
  title: string;
  coverImage?: string | null;
  progressLabel?: string;
};

export function AnimeCard({ anime }: { anime: AnimeCardData }) {
  return (
    <article className="anime-card">
      {anime.coverImage ? <img src={anime.coverImage} alt={anime.title} loading="lazy" /> : <div className="image-fallback" />}
      <h3>{anime.title}</h3>
      {anime.progressLabel ? <p>{anime.progressLabel}</p> : null}
      <div className="card-actions">
        <Link className="secondary" to={`/watch/${anime.id}`}>
          Watch
        </Link>
      </div>
    </article>
  );
}
