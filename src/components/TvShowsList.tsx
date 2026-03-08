import TvShowCard from '@/components/TvShowCard';
import { TvShow } from '@/lib/types';

interface TvShowsListProps {
  tvShows: TvShow[];
}

const TvShowsList = ({ tvShows }: TvShowsListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tvShows.map((tvShow) => (
        <TvShowCard key={tvShow.id} tvShow={tvShow} />
      ))}
    </div>
  );
};

export default TvShowsList;
