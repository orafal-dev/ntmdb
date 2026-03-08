'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Star, Calendar, PlayCircle, Tv } from 'lucide-react';
import { motion } from 'motion/react';
import type { WatchProviders } from 'tmdb-ts';
import type { Video, Videos } from 'tmdb-ts';
import { MovieTrailerPlayer } from '@/components/kibo-ui/video-player/MovieTrailerPlayer';
import TvSeasonEpisodes from '@/components/TvSeasonEpisodes';

interface TvShowDetails {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  genres: Array<{ id: number; name: string }>;
  seasons: Array<{
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    air_date?: string;
    poster_path?: string | null;
    overview?: string;
  }>;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface WatchProvider {
  display_priority: number;
  logo_path: string;
  provider_id: number;
  provider_name: string;
}

interface TvShowDetailProps {
  show: TvShowDetails;
  credits: CastMember[];
  watchProviders?: WatchProviders;
  videos?: Videos;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: 'United States',
  CA: 'Canada',
  MX: 'Mexico',
  BR: 'Brazil',
  GB: 'United Kingdom',
  DE: 'Germany',
  FR: 'France',
  IT: 'Italy',
  ES: 'Spain',
  PL: 'Poland',
  NL: 'Netherlands',
  AU: 'Australia',
  JP: 'Japan',
  KR: 'South Korea',
  IN: 'India',
};

const TvShowDetail = ({ show, credits, watchProviders, videos }: TvShowDetailProps) => {
  const [selectedCountry, setSelectedCountry] = useState('US');

  const youtubeTrailers = useMemo(() => {
    if (!videos?.results?.length) return [];
    return videos.results.filter((v) => v.site === 'YouTube' && v.type === 'Trailer');
  }, [videos]);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(
    youtubeTrailers.length > 0 ? youtubeTrailers[0] : null
  );

  const formatDate = (dateString: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getImageUrl = (path: string | null | undefined, size: 'w500' | 'w1280' = 'w500') => {
    if (!path) return '/placeholder-movie.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  const getProfileUrl = (path: string | null | undefined) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w185${path}`;
  };

  const getAvailableCountries = () => {
    if (!watchProviders?.results) return [];
    return Object.keys(watchProviders.results);
  };

  const getWatchProvidersForCountry = (countryCode: string) => {
    if (!watchProviders?.results || !(countryCode in watchProviders.results)) return null;
    return watchProviders.results[countryCode as keyof typeof watchProviders.results];
  };

  const getCountryName = (countryCode: string) =>
    COUNTRY_NAMES[countryCode] || countryCode;

  const getProviderUrl = (path: string) => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/w92${path}`;
  };

  const renderProviderSection = (providers: WatchProvider[] | undefined, title: string) => {
    if (!providers || providers.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
          {providers
            .sort((a, b) => a.display_priority - b.display_priority)
            .map((provider) => (
              <div
                key={provider.provider_id}
                className="flex items-center gap-2 bg-muted rounded-md px-3 py-2 hover:bg-muted/80 transition-colors"
                title={provider.provider_name}
              >
                {provider.logo_path && (
                  <div className="relative h-6 w-6 shrink-0">
                    <Image
                      src={getProviderUrl(provider.logo_path)!}
                      alt={provider.provider_name}
                      fill
                      sizes="24px"
                      className="object-contain rounded"
                    />
                  </div>
                )}
                <span className="text-sm font-medium">{provider.provider_name}</span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const airDateRange =
    show.first_air_date && show.last_air_date
      ? `${new Date(show.first_air_date).getFullYear()} – ${new Date(show.last_air_date).getFullYear()}`
      : show.first_air_date
        ? new Date(show.first_air_date).getFullYear().toString()
        : '—';

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Link href="/tv">
          <Button variant="outline" aria-label="Back to TV shows">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to TV Shows
          </Button>
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div
        className="relative mb-8 rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="aspect-4/3 sm:aspect-video md:aspect-21/9 bg-linear-to-r from-black/60 to-transparent">
          <Image
            src={getImageUrl(show.backdrop_path, 'w1280')}
            alt={show.name}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
        </div>

        <motion.div
          className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white max-w-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div className="flex items-start justify-between gap-4 mb-3 sm:mb-2">
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight flex-1">
              {show.name}
            </motion.h1>
          </motion.div>
          <motion.div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
              <span className="font-semibold text-lg sm:text-base">
                {show.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-300 text-sm sm:text-base">
                ({show.vote_count.toLocaleString('en-US')} votes)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="text-sm sm:text-base">{airDateRange}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tv className="w-4 h-4 shrink-0" />
              <span className="text-sm sm:text-base">
                {show.number_of_seasons} season{show.number_of_seasons !== 1 ? 's' : ''} ·{' '}
                {show.number_of_episodes} episode{show.number_of_episodes !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
          <motion.div className="flex flex-wrap gap-2 sm:gap-3">
            {show.genres.map((genre) => (
              <Badge
                key={genre.id}
                variant="secondary"
                className="bg-white/20 text-white border-white/30 text-sm px-3 py-1"
              >
                {genre.name}
              </Badge>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <motion.div className="lg:col-span-1">
          <Card className="py-0 overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-2/3 relative rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(show.poster_path)}
                  alt={show.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {show.overview || 'No description available.'}
              </CardDescription>
            </CardContent>
          </Card>

          <TvSeasonEpisodes showId={show.id} seasons={show.seasons} />

          <Card>
            <CardHeader>
              <CardTitle>Cast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {credits.map((actor) => (
                  <div key={actor.id} className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={getProfileUrl(actor.profile_path) || undefined}
                        alt={actor.name}
                      />
                      <AvatarFallback>
                        {actor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{actor.name}</p>
                      <p className="text-sm text-muted-foreground">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {youtubeTrailers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" aria-hidden />
                  Trailers
                </CardTitle>
                <CardDescription>Select a trailer to play.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {youtubeTrailers.map((video) => (
                    <Button
                      key={video.id}
                      type="button"
                      variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() =>
                        setSelectedVideo(selectedVideo?.id === video.id ? null : video)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedVideo(selectedVideo?.id === video.id ? null : video);
                        }
                      }}
                      aria-pressed={selectedVideo?.id === video.id}
                      aria-label={`Play ${video.name}`}
                    >
                      {video.name.length > 50 ? `${video.name.slice(0, 50)}…` : video.name}
                    </Button>
                  ))}
                </div>
                {(selectedVideo ?? youtubeTrailers[0]) && (
                  <div className="rounded-lg overflow-hidden border bg-muted/30">
                    <MovieTrailerPlayer
                      videoKey={(selectedVideo ?? youtubeTrailers[0]).key}
                      title={(selectedVideo ?? youtubeTrailers[0]).name}
                      hideTooltips
                      hideYoutubeControls
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {watchProviders && (
            <Card>
              <CardHeader>
                <CardTitle>Where to Watch</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  Available streaming platforms
                  {getAvailableCountries().length > 0 && (
                    <Select
                      value={selectedCountry}
                      onValueChange={(value) => value && setSelectedCountry(value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableCountries()
                          .sort((a, b) => getCountryName(a).localeCompare(getCountryName(b)))
                          .map((countryCode) => (
                            <SelectItem key={countryCode} value={countryCode}>
                              {getCountryName(countryCode)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const countryProviders = getWatchProvidersForCountry(selectedCountry) as {
                    link?: string;
                    flatrate?: WatchProvider[];
                    rent?: WatchProvider[];
                    buy?: WatchProvider[];
                    ads?: WatchProvider[];
                  } | null;
                  if (!countryProviders) {
                    return (
                      <p className="text-muted-foreground">
                        No streaming information available.
                      </p>
                    );
                  }
                  const hasAny =
                    countryProviders.flatrate?.length ||
                    countryProviders.rent?.length ||
                    countryProviders.buy?.length ||
                    countryProviders.ads?.length;
                  if (!hasAny) {
                    return (
                      <p className="text-muted-foreground">
                        No streaming options for {getCountryName(selectedCountry)}.
                      </p>
                    );
                  }
                  return (
                    <div className="space-y-4">
                      {renderProviderSection(countryProviders.flatrate, 'Stream')}
                      {renderProviderSection(countryProviders.rent, 'Rent')}
                      {renderProviderSection(countryProviders.buy, 'Buy')}
                      {renderProviderSection(countryProviders.ads, 'With Ads')}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default TvShowDetail;
