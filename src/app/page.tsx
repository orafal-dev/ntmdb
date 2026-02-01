import { getPopularMoviesPage } from '@/lib/server-actions';
import AnimatedHome from '@/components/AnimatedHome';

export default async function Home() {
  const { results, total_pages } = await getPopularMoviesPage(1);

  return (
    <AnimatedHome
      initialMovies={results}
      totalPages={total_pages}
    />
  );
}
