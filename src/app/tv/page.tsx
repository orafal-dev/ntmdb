import { getPopularTvShowsPage } from '@/lib/server-actions';
import AnimatedTvHome from '@/components/AnimatedTvHome';

export default async function TvPage() {
  const { results, total_pages } = await getPopularTvShowsPage(1);

  return (
    <AnimatedTvHome
      initialTvShows={results}
      totalPages={total_pages}
    />
  );
}
