import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TvShow } from '@/lib/types';

interface TvShowCardProps {
  tvShow: TvShow;
  showOverview?: boolean;
}

const TvShowCard = ({
  tvShow,
  showOverview = true,
}: TvShowCardProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).getFullYear().toString();
  };

  const getPosterUrl = (posterPath: string | null) => {
    if (!posterPath) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  return (
    <Link href={`/tv/${tvShow.id}`}>
      <div className="h-full cursor-pointer py-0 duration-300 gap-0 before:absolute before:bottom-0 before:inset-x-0 before:bg-linear-to-t before:from-black before:to-transparent before:h-full before:content-[''] overflow-hidden rounded-lg relative @container before:z-2 group">
        <div className="aspect-2/3 z-1">
          <Image
            src={getPosterUrl(tvShow.poster_path)}
            alt={tvShow.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+IRjWjBqO6O2mhP//Z"
          />
        </div>
        <div className="p-4 absolute bottom-0 z-3 text-white">
          <h3 className="text-lg line-clamp-2 mb-2">{tvShow.name}</h3>
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-white">
              {formatDate(tvShow.first_air_date)}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-sm font-medium">{tvShow.vote_average.toFixed(1)}</span>
            </div>
          </div>
          {showOverview && (
            <p className="line-clamp-3 text-sm">{tvShow.overview}</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TvShowCard;
