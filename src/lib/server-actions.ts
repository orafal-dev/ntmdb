'use server';

import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { TMDB } from 'tmdb-ts';
import type { Movie, TvShow } from '@/lib/types';

let tmdb: TMDB | null = null;

function getTMDBClient(): TMDB {
  if (!tmdb) {
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!API_KEY) {
      throw new Error('NEXT_PUBLIC_TMDB_API_KEY is not set. Please add NEXT_PUBLIC_TMDB_API_KEY to your environment variables.');
    }
    tmdb = new TMDB(API_KEY);
  }
  return tmdb;
}

const mapTmdbResultToMovie = (item: { id: number; title: string; overview?: string; poster_path?: string | null; release_date: string; vote_average: number; vote_count?: number }): Movie => ({
  id: item.id,
  title: item.title,
  overview: item.overview ?? '',
  poster_path: item.poster_path ?? null,
  release_date: item.release_date,
  vote_average: item.vote_average,
  vote_count: item.vote_count,
});

export type PopularMoviesPageResult = {
  results: Movie[];
  page: number;
  total_pages: number;
};

// Cached fetcher per page (cache key includes page argument)
const getPopularMoviesPageCached = unstable_cache(
  async (page: number): Promise<PopularMoviesPageResult> => {
    const tmdb = getTMDBClient();
    const response = await tmdb.trending.trending('movie', 'week', { page });
    const results = response.results.map(mapTmdbResultToMovie);
    return {
      results,
      page: response.page,
      total_pages: response.total_pages,
    };
  },
  ['popular-movies-page'],
  {
    revalidate: 3600,
    tags: ['movies', 'popular'],
  }
);

// Fetch a single page of popular (trending) movies for infinite scroll
export async function getPopularMoviesPage(page: number): Promise<PopularMoviesPageResult> {
  return getPopularMoviesPageCached(page);
}

// Cache popular movies page 1 for 1 hour (used by home server component)
export const getPopularMovies = unstable_cache(
  async () => {
    const data = await getPopularMoviesPageCached(1);
    return data.results;
  },
  ['popular-movies'],
  {
    revalidate: 3600, // 1 hour
    tags: ['movies', 'popular']
  }
);

// Cache individual movie details for 24 hours
export const getMovieDetails = unstable_cache(
  async (movieId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.movies.details(movieId);
    return response;
  },
  ['movie-details'],
  {
    revalidate: 86400, // 24 hours
    tags: ['movies', 'details']
  }
);

// Cache movie credits for 24 hours
export const getMovieCredits = unstable_cache(
  async (movieId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.movies.credits(movieId);
    // Ensure cast exists and is an array
    if (!response || !response.cast || !Array.isArray(response.cast)) {
      return [];
    }
    return response.cast.slice(0, 10);
  },
  ['movie-credits'],
  {
    revalidate: 86400, // 24 hours
    tags: ['movies', 'credits']
  }
);

// Cache movie watch providers for 24 hours
export const getMovieWatchProviders = unstable_cache(
  async (movieId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.movies.watchProviders(movieId);
    return response;
  },
  ['movie-watch-providers'],
  {
    revalidate: 86400, // 24 hours
    tags: ['movies', 'watch-providers']
  }
);

// Cache movie videos (trailers, teasers, etc.) for 24 hours
export const getMovieVideos = unstable_cache(
  async (movieId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.movies.videos(movieId);
    return response;
  },
  ['movie-videos'],
  {
    revalidate: 86400, // 24 hours
    tags: ['movies', 'videos']
  }
);

// Request memoization for parallel requests within the same request
export const getMovieWithCredits = cache(async (movieId: number) => {
  const [movie, credits, watchProviders, videos] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getMovieWatchProviders(movieId),
    getMovieVideos(movieId)
  ]);

  return { movie, credits, watchProviders, videos };
});

// --- TV Shows ---

const mapTmdbTvResultToTvShow = (item: {
  id: number;
  name: string;
  overview?: string;
  poster_path?: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count?: number;
}): TvShow => ({
  id: item.id,
  name: item.name,
  overview: item.overview ?? '',
  poster_path: item.poster_path ?? null,
  first_air_date: item.first_air_date,
  vote_average: item.vote_average,
  vote_count: item.vote_count,
});

export type PopularTvShowsPageResult = {
  results: TvShow[];
  page: number;
  total_pages: number;
};

const getPopularTvShowsPageCached = unstable_cache(
  async (page: number): Promise<PopularTvShowsPageResult> => {
    const tmdb = getTMDBClient();
    const response = await tmdb.trending.trending('tv', 'week', { page });
    const results = (response.results ?? []).map(mapTmdbTvResultToTvShow);
    return {
      results,
      page: response.page,
      total_pages: response.total_pages,
    };
  },
  ['trending-tv-shows-page'],
  {
    revalidate: 3600,
    tags: ['tv', 'trending'],
  }
);

export async function getPopularTvShowsPage(page: number): Promise<PopularTvShowsPageResult> {
  return getPopularTvShowsPageCached(page);
}

export const getTvShowDetails = unstable_cache(
  async (seriesId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.tvShows.details(seriesId);
    return response;
  },
  ['tv-show-details'],
  {
    revalidate: 86400,
    tags: ['tv', 'details'],
  }
);

export const getTvShowCredits = unstable_cache(
  async (seriesId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.tvShows.credits(seriesId);
    if (!response?.cast || !Array.isArray(response.cast)) return [];
    return response.cast.slice(0, 10);
  },
  ['tv-show-credits'],
  {
    revalidate: 86400,
    tags: ['tv', 'credits'],
  }
);

export const getTvShowWatchProviders = unstable_cache(
  async (seriesId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.tvShows.watchProviders(seriesId);
    return response;
  },
  ['tv-show-watch-providers'],
  {
    revalidate: 86400,
    tags: ['tv', 'watch-providers'],
  }
);

export const getTvShowVideos = unstable_cache(
  async (seriesId: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.tvShows.videos(seriesId);
    return response;
  },
  ['tv-show-videos'],
  {
    revalidate: 86400,
    tags: ['tv', 'videos'],
  }
);

export const getTvSeasonDetails = unstable_cache(
  async (seriesId: number, seasonNumber: number) => {
    const tmdb = getTMDBClient();
    const response = await tmdb.tvShows.season(seriesId, seasonNumber);
    return response;
  },
  ['tv-season-details'],
  {
    revalidate: 86400,
    tags: ['tv', 'seasons'],
  }
);

export const getTvShowWithCredits = cache(async (seriesId: number) => {
  const [show, credits, watchProviders, videos] = await Promise.all([
    getTvShowDetails(seriesId),
    getTvShowCredits(seriesId),
    getTvShowWatchProviders(seriesId),
    getTvShowVideos(seriesId),
  ]);
  return { show, credits, watchProviders, videos };
});
