'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import MoviesList from '@/components/MoviesList';
import ThemeToggle from '@/components/ThemeToggle';
import NewsletterForm from '@/components/NewsletterForm';
import AppNav from '@/components/AppNav';
import { motion } from 'motion/react';
import { HyperText } from './ui/hyper-text';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Movie } from '@/lib/types';
import { getPopularMoviesPage } from '@/lib/server-actions';
import { Spinner } from '@/components/ui/spinner';

interface AnimatedHomeProps {
  initialMovies: Movie[];
  totalPages: number;
}

const AnimatedHome = ({ initialMovies, totalPages }: AnimatedHomeProps) => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

  const hasMore = currentPage < totalPages;

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const { results } = await getPopularMoviesPage(nextPage);
      setMovies((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMovies = results.filter((m) => !existingIds.has(m.id));
        return newMovies.length > 0 ? [...prev, ...newMovies] : prev;
      });
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more movies:', error);
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMore, isLoadingMore]);

  useEffect(() => {
    if (!hasMore) return;

    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasMore && !loadingMoreRef.current) {
          loadMore();
        }
      },
      {
        root: null,
        rootMargin: '400px 0px 0px 0px',
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, loadMore]);

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Header */}
      <motion.header
        className="border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.h1
                className="text-3xl font-black text-foreground font-display shrink-0"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <HyperText duration={1200}>
                  N.T.M.D.B.
                </HyperText>
              </motion.h1>
              <div className="flex items-center gap-2 sm:hidden shrink-0">
                <AppNav />
              </div>
              <div className="hidden sm:block shrink-0">
                <AppNav />
              </div>
            </div>
            <motion.div
              className="flex items-center gap-2 sm:gap-4 ml-auto shrink-0"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/favorites">
                <Button variant="ghost" size="sm">
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
              </Link>
              <ThemeToggle />
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.h2
            className="text-2xl font-semibold mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Trending Movies
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
          >
            Click on any movie to view detailed information, cast, and ratings.
          </motion.p>
        </motion.div>

        <MoviesList movies={movies} />

        {/* Infinite scroll sentinel: load more when this enters viewport */}
        {hasMore && <div ref={sentinelRef} className="h-1 w-full" aria-hidden />}

        {isLoadingMore && (
          <div className="flex justify-center py-8" role="status" aria-label="Loading more movies">
            <Spinner className="size-8 text-muted-foreground" />
          </div>
        )}

        {/* Newsletter Section */}
        <motion.div
          className="mt-16 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </motion.div>
      </motion.main>
    </motion.div>
  );
};

export default AnimatedHome;