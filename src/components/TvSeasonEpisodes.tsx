'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { getTvSeasonDetails } from '@/lib/server-actions';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronRight, Film } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface SeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date?: string;
  poster_path?: string | null;
  overview?: string;
}

interface Episode {
  id: number;
  name: string;
  episode_number: number;
  overview: string;
  air_date: string;
  still_path: string | null;
  runtime: number;
  vote_average: number;
}

interface TvSeasonEpisodesProps {
  showId: number;
  seasons: SeasonSummary[];
}

const getImageUrl = (path: string | null | undefined, size: 'w185' | 'w500' = 'w185') => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

const SeasonRow = ({
  showId,
  season,
  defaultOpen = false,
}: {
  showId: number;
  season: SeasonSummary;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [episodes, setEpisodes] = useState<Episode[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const handleOpenChange = useCallback(
    async (open: boolean) => {
      setIsOpen(open);
      if (open && !hasFetched && season.season_number >= 0) {
        setIsLoading(true);
        setHasFetched(true);
        try {
          const details = await getTvSeasonDetails(showId, season.season_number);
          setEpisodes(details.episodes ?? []);
        } catch (error) {
          console.error('Error loading season episodes:', error);
          setEpisodes([]);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [showId, season.season_number, hasFetched]
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const posterUrl = getImageUrl(season.poster_path, 'w185');

  return (
    <Collapsible open={isOpen} onOpenChange={handleOpenChange}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger
          className="w-full flex items-center gap-4 p-4 text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg"
          aria-expanded={isOpen}
          aria-controls={`season-${season.season_number}-content`}
          id={`season-${season.season_number}-trigger`}
        >
          <div className="flex shrink-0 w-8 h-8 items-center justify-center text-muted-foreground">
            {isOpen ? (
              <ChevronDown className="h-5 w-5" aria-hidden />
            ) : (
              <ChevronRight className="h-5 w-5" aria-hidden />
            )}
          </div>
          {posterUrl ? (
            <div className="relative w-12 h-18 shrink-0 rounded overflow-hidden bg-muted">
              <Image
                src={posterUrl}
                alt=""
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-18 shrink-0 rounded bg-muted flex items-center justify-center">
              <Film className="h-6 w-6 text-muted-foreground" aria-hidden />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-foreground">
              {season.name || `Season ${season.season_number}`}
            </h4>
            <p className="text-sm text-muted-foreground">
              {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
              {season.air_date && ` · ${new Date(season.air_date).getFullYear()}`}
            </p>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent id={`season-${season.season_number}-content`}>
          <CardContent className="pt-0 pb-4">
            {isLoading && (
              <div className="flex justify-center py-8" role="status" aria-label="Loading episodes">
                <Spinner className="size-8 text-muted-foreground" />
              </div>
            )}
            {!isLoading && episodes && (
              <ul className="space-y-3" role="list">
                {episodes.map((ep) => (
                  <li
                    key={ep.id}
                    className={cn(
                      'flex gap-4 rounded-lg p-3 transition-colors',
                      'hover:bg-muted/50'
                    )}
                  >
                    <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded bg-muted text-sm font-medium text-muted-foreground">
                      {ep.episode_number}
                    </div>
                    {ep.still_path && (
                      <div className="relative w-24 aspect-video shrink-0 rounded overflow-hidden bg-muted">
                        <Image
                          src={getImageUrl(ep.still_path, 'w185')!}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground">{ep.name}</p>
                      {ep.air_date && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(ep.air_date)}
                          {ep.runtime ? ` · ${ep.runtime} min` : ''}
                        </p>
                      )}
                      {ep.overview && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {ep.overview}
                        </p>
                      )}
                      {ep.vote_average > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          ★ {ep.vote_average.toFixed(1)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!isLoading && episodes && episodes.length === 0 && (
              <p className="text-sm text-muted-foreground py-4">No episodes available.</p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

const TvSeasonEpisodes = ({ showId, seasons }: TvSeasonEpisodesProps) => {
  const displaySeasons = (seasons ?? []).filter((s) => s.season_number >= 0);

  if (displaySeasons.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Seasons & Episodes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No season information available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Seasons & Episodes</CardTitle>
        <CardDescription className="text-muted-foreground">
          Expand a season to see episodes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {displaySeasons.map((season) => (
          <SeasonRow
            key={season.id}
            showId={showId}
            season={season}
            defaultOpen={season.season_number === 1}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default TvSeasonEpisodes;
