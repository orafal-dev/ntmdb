// Shared type definitions for the application

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count?: number;
}

export interface FavoriteMovie {
  _id: string;
  _rev?: string;
  movieId: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  addedAt: string;
}

export interface TvShow {
  id: number;
  name: string;
  overview?: string;
  poster_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count?: number;
}