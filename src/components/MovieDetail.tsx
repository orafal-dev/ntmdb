"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Star, Calendar, Clock, Heart, PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useFavorites } from '@/hooks/use-favorites';
import type { WatchProviders } from 'tmdb-ts';
import type { Video, Videos } from 'tmdb-ts';
import { MovieTrailerPlayer } from '@/components/kibo-ui/video-player/MovieTrailerPlayer';

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

interface MovieDetailProps {
  movie: MovieDetails;
  credits: CastMember[];
  watchProviders?: WatchProviders;
  videos?: Videos;
}

const MovieDetail = ({ movie, credits, watchProviders, videos }: MovieDetailProps) => {
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedCountry, setSelectedCountry] = useState('US');

  const youtubeTrailers = useMemo(() => {
    if (!videos?.results?.length) return [];
    return videos.results.filter(
      (v) => v.site === 'YouTube' && v.type === 'Trailer'
    );
  }, [videos]);

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (youtubeTrailers.length > 0) {
      setSelectedVideo((prev) =>
        prev && youtubeTrailers.some((v) => v.id === prev.id)
          ? prev
          : youtubeTrailers[0]
      );
    }
  }, [youtubeTrailers]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (runtime: number) => {
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
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
    if (!watchProviders?.results || !(countryCode in watchProviders.results)) {
      return null;
    }
    return watchProviders.results[countryCode as keyof typeof watchProviders.results];
  };

  const getCountryName = (countryCode: string) => {
    const countryNames: Record<string, string> = {
      // North America
      US: 'United States',
      CA: 'Canada',
      MX: 'Mexico',

      // South America
      BR: 'Brazil',
      AR: 'Argentina',
      CO: 'Colombia',
      CL: 'Chile',
      PE: 'Peru',
      VE: 'Venezuela',
      EC: 'Ecuador',
      BO: 'Bolivia',
      PY: 'Paraguay',
      UY: 'Uruguay',
      GY: 'Guyana',
      SR: 'Suriname',

      // Europe
      GB: 'United Kingdom',
      DE: 'Germany',
      FR: 'France',
      IT: 'Italy',
      ES: 'Spain',
      PL: 'Poland',
      NL: 'Netherlands',
      BE: 'Belgium',
      CH: 'Switzerland',
      AT: 'Austria',
      SE: 'Sweden',
      NO: 'Norway',
      DK: 'Denmark',
      FI: 'Finland',
      PT: 'Portugal',
      IE: 'Ireland',
      RU: 'Russia',
      UA: 'Ukraine',
      CZ: 'Czech Republic',
      SK: 'Slovakia',
      HU: 'Hungary',
      RO: 'Romania',
      BG: 'Bulgaria',
      HR: 'Croatia',
      SI: 'Slovenia',
      RS: 'Serbia',
      ME: 'Montenegro',
      MK: 'North Macedonia',
      AL: 'Albania',
      BA: 'Bosnia and Herzegovina',
      GR: 'Greece',
      TR: 'Turkey',
      EE: 'Estonia',
      LV: 'Latvia',
      LT: 'Lithuania',
      BY: 'Belarus',
      MD: 'Moldova',
      GE: 'Georgia',
      AM: 'Armenia',
      AZ: 'Azerbaijan',
      IS: 'Iceland',
      FO: 'Faroe Islands',
      GL: 'Greenland',
      MT: 'Malta',
      CY: 'Cyprus',
      LU: 'Luxembourg',
      MC: 'Monaco',
      AD: 'Andorra',
      LI: 'Liechtenstein',
      SM: 'San Marino',
      VA: 'Vatican City',

      // Asia
      JP: 'Japan',
      KR: 'South Korea',
      CN: 'China',
      HK: 'Hong Kong',
      TW: 'Taiwan',
      IN: 'India',
      TH: 'Thailand',
      MY: 'Malaysia',
      SG: 'Singapore',
      PH: 'Philippines',
      ID: 'Indonesia',
      VN: 'Vietnam',
      KH: 'Cambodia',
      LA: 'Laos',
      MM: 'Myanmar',
      BD: 'Bangladesh',
      PK: 'Pakistan',
      LK: 'Sri Lanka',
      NP: 'Nepal',
      BT: 'Bhutan',
      MV: 'Maldives',
      IO: 'British Indian Ocean Territory',

      // Middle East
      AE: 'United Arab Emirates',
      SA: 'Saudi Arabia',
      IL: 'Israel',
      JO: 'Jordan',
      LB: 'Lebanon',
      KW: 'Kuwait',
      QA: 'Qatar',
      BH: 'Bahrain',
      OM: 'Oman',
      YE: 'Yemen',
      IQ: 'Iraq',
      SY: 'Syria',
      PS: 'Palestine',
      IR: 'Iran',
      AF: 'Afghanistan',
      TJ: 'Tajikistan',
      TM: 'Turkmenistan',
      UZ: 'Uzbekistan',
      KG: 'Kyrgyzstan',

      // Africa
      ZA: 'South Africa',
      EG: 'Egypt',
      NG: 'Nigeria',
      KE: 'Kenya',
      MA: 'Morocco',
      TN: 'Tunisia',
      DZ: 'Algeria',
      LY: 'Libya',
      SD: 'Sudan',
      SS: 'South Sudan',
      ET: 'Ethiopia',
      SO: 'Somalia',
      UG: 'Uganda',
      TZ: 'Tanzania',
      RW: 'Rwanda',
      BI: 'Burundi',
      CD: 'Democratic Republic of the Congo',
      CG: 'Republic of the Congo',
      AO: 'Angola',
      MZ: 'Mozambique',
      ZM: 'Zambia',
      ZW: 'Zimbabwe',
      BW: 'Botswana',
      NA: 'Namibia',
      SZ: 'Eswatini',
      LS: 'Lesotho',
      MW: 'Malawi',
      MG: 'Madagascar',
      MU: 'Mauritius',
      SC: 'Seychelles',
      KM: 'Comoros',
      DJ: 'Djibouti',
      ER: 'Eritrea',
      GH: 'Ghana',
      CI: 'Ivory Coast',
      BF: 'Burkina Faso',
      ML: 'Mali',
      SN: 'Senegal',
      GM: 'Gambia',
      GN: 'Guinea',
      SL: 'Sierra Leone',
      LR: 'Liberia',
      TG: 'Togo',
      BJ: 'Benin',
      NE: 'Niger',
      TD: 'Chad',
      CM: 'Cameroon',
      GQ: 'Equatorial Guinea',
      GA: 'Gabon',
      ST: 'São Tomé and Príncipe',
      CV: 'Cape Verde',
      GW: 'Guinea-Bissau',
      MR: 'Mauritania',
      EH: 'Western Sahara',

      // Oceania
      AU: 'Australia',
      NZ: 'New Zealand',
      PG: 'Papua New Guinea',
      SB: 'Solomon Islands',
      VU: 'Vanuatu',
      NC: 'New Caledonia',
      PF: 'French Polynesia',
      WS: 'Samoa',
      TO: 'Tonga',
      TV: 'Tuvalu',
      KI: 'Kiribati',
      MH: 'Marshall Islands',
      FM: 'Micronesia',
      PW: 'Palau',
      NR: 'Nauru',
      CK: 'Cook Islands',
      NU: 'Niue',
      AS: 'American Samoa',
      GU: 'Guam',
      MP: 'Northern Mariana Islands',
      FJ: 'Fiji',
      TK: 'Tokelau',
      WF: 'Wallis and Futuna',

      // Caribbean
      CU: 'Cuba',
      HT: 'Haiti',
      DO: 'Dominican Republic',
      JM: 'Jamaica',
      TT: 'Trinidad and Tobago',
      BB: 'Barbados',
      LC: 'Saint Lucia',
      VC: 'Saint Vincent and the Grenadines',
      GD: 'Grenada',
      AG: 'Antigua and Barbuda',
      DM: 'Dominica',
      KN: 'Saint Kitts and Nevis',
      BS: 'Bahamas',
      BZ: 'Belize',
      HN: 'Honduras',
      NI: 'Nicaragua',
      CR: 'Costa Rica',
      PA: 'Panama',
      SV: 'El Salvador',
      GT: 'Guatemala',
      KY: 'Cayman Islands',
      TC: 'Turks and Caicos Islands',
      VG: 'British Virgin Islands',
      VI: 'U.S. Virgin Islands',
      MS: 'Montserrat',
      AI: 'Anguilla',
      BM: 'Bermuda',
      PM: 'Saint Pierre and Miquelon',
      AW: 'Aruba',
      CW: 'Curaçao',
      SX: 'Sint Maarten',
      BQ: 'Bonaire, Sint Eustatius and Saba',
      PR: 'Puerto Rico'
    };
    return countryNames[countryCode] || countryCode;
  };

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

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

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
        <Link href="/">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Button>
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.div
        className="relative mb-8 rounded-lg overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="aspect-4/3 sm:aspect-video md:aspect-21/9 bg-linear-to-r from-black/60 to-transparent">
          <Image
            src={getImageUrl(movie.backdrop_path, 'w1280')}
            alt={movie.title}
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
          <motion.div
            className="flex items-start justify-between gap-4 mb-3 sm:mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight flex-1">
              {movie.title}
            </motion.h1>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6 space-y-2 sm:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 shrink-0" />
              <span className="font-semibold text-lg sm:text-base">{movie.vote_average.toFixed(1)}</span>
              <span className="text-gray-300 text-sm sm:text-base">({movie.vote_count.toLocaleString('en-US')} votes)</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="text-sm sm:text-base">{formatDate(movie.release_date)}</span>
            </div>
            {movie.runtime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0" />
                <span className="text-sm sm:text-base">{formatRuntime(movie.runtime)}</span>
              </div>
            )}
          </motion.div>
          <motion.div
            className="flex flex-wrap gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {movie.genres.map((genre) => (
              <Badge key={genre.id} variant="secondary" className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                {genre.name}
              </Badge>
            ))}
          </motion.div>
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Button
              variant={isFavorite(movie.id) ? "default" : "outline"}
              size="lg"
              className={`w-full sm:w-auto px-6 py-3 text-base font-medium transition-all duration-200`}
              onClick={handleToggleFavorite}
              aria-label={isFavorite(movie.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`h-5 w-5 mr-2`}
              />
              <span className="hidden sm:inline">
                {isFavorite(movie.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </span>
              <span className="sm:hidden">
                {isFavorite(movie.id) ? 'Remove' : 'Add to Favorites'}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        {/* Poster */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <Card className='py-0 overflow-hidden'>
            <CardContent className="p-0">
              <div className="aspect-2/3 relative rounded-lg overflow-hidden">
                <Image
                  src={getImageUrl(movie.poster_path)}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Details */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {movie.overview || 'No description available.'}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          {/* Cast */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Cast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {credits.map((actor, index) => (
                    <motion.div
                      key={actor.id}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: 1.2 + index * 0.05,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      <Avatar>
                        <AvatarImage src={getProfileUrl(actor.profile_path) || undefined} alt={actor.name} />
                        <AvatarFallback>
                          {actor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-sm text-muted-foreground">{actor.character}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trailers */}
          {youtubeTrailers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.15 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PlayCircle className="h-5 w-5" aria-hidden />
                    Trailers
                  </CardTitle>
                  <CardDescription>
                    Select a trailer to play.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {youtubeTrailers.map((video) => (
                      <Button
                        key={video.id}
                        type="button"
                        variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedVideo(selectedVideo?.id === video.id ? null : video)}
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
            </motion.div>
          )}

          {/* Watch Providers */}
          {watchProviders && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Where to Watch</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    Available streaming platforms and providers
                    {getAvailableCountries().length > 0 && (
                      <Select value={selectedCountry} onValueChange={(value) => value && setSelectedCountry(value)}>
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

                    const hasAnyProviders =
                      countryProviders.flatrate?.length ||
                      countryProviders.rent?.length ||
                      countryProviders.buy?.length ||
                      countryProviders.ads?.length;

                    if (!hasAnyProviders) {
                      return (
                        <p className="text-muted-foreground">
                          No streaming options available for {getCountryName(selectedCountry)}.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-4">
                        {renderProviderSection(countryProviders.flatrate, "Stream")}
                        {renderProviderSection(countryProviders.rent, "Rent")}
                        {renderProviderSection(countryProviders.buy, "Buy")}
                        {renderProviderSection(countryProviders.ads, "With Ads")}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MovieDetail;