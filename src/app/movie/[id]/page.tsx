import type { Metadata } from 'next';
import MovieDetail from '@/components/MovieDetail';
import { getMovieWithCredits, getMovieDetails } from '@/lib/server-actions';
import { notFound } from 'next/navigation';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres: Array<{ id: number; name: string }>;
  production_companies: Array<{ id: number; name: string; logo_path?: string | null }>;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Enable ISR (Incremental Static Regeneration) for movie pages
// Revalidate every 24 hours
export const revalidate = 86400;

export const generateMetadata = async ({ params }: PageProps): Promise<Metadata> => {
  const { id } = await params;
  const movieId = parseInt(id, 10);
  if (Number.isNaN(movieId)) return { title: 'Movie' };
  const movie = await getMovieDetails(movieId);
  if (!movie?.title) return { title: 'Movie' };
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const title = year != null ? `${movie.title} (${year})` : movie.title;
  const description =
    movie.overview?.slice(0, 160).trim().replace(/\s+/g, ' ') + (movie.overview && movie.overview.length > 160 ? '…' : '') ||
    `Movie: ${movie.title}`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: 'summary_large_image', title, description },
  };
};

export default async function MoviePage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  const data = await getMovieWithCredits(movieId);

  return (
    <MovieDetail
      movie={data.movie as MovieDetails}
      credits={data.credits}
      watchProviders={data.watchProviders}
      videos={data.videos}
    />
  );
}