import { ImageResponse } from 'next/og';
import { getMovieDetails } from '@/lib/server-actions';
import { notFound } from 'next/navigation';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

type ImageProps = {
  params: Promise<{ id: string }>;
};

export default async function Image({ params }: ImageProps) {
  const { id } = await params;
  const movieId = parseInt(id, 10);

  if (Number.isNaN(movieId)) {
    notFound();
  }

  const movie = await getMovieDetails(movieId);
  if (!movie?.title) {
    notFound();
  }

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;
  const rating = movie.vote_average != null ? movie.vote_average.toFixed(1) : null;
  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_BASE}/w300${movie.poster_path}`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #171717 50%, #0c0c0c 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Left: poster or gradient block */}
        {posterUrl ? (
          <div
            style={{
              width: 420,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              flexShrink: 0,
            }}
          >
            <img
              src={posterUrl}
              alt=""
              width={280}
              height={420}
              style={{
                objectFit: 'cover',
                borderRadius: 12,
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              }}
            />
          </div>
        ) : (
          <div
            style={{
              width: 360,
              flexShrink: 0,
              background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
            }}
          />
        )}

        {/* Right: title, year, rating */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: posterUrl ? 48 : 64,
            paddingLeft: posterUrl ? 32 : 64,
          }}
        >
          <h1
            style={{
              fontSize: 84,
              fontWeight: 700,
              color: '#fafafa',
              lineHeight: 1.15,
              margin: 0,
              marginBottom: 24,
              display: 'flex',
              maxWidth: '100%',
            }}
          >
            {movie.title}
          </h1>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 28,
            }}
          >
            {year != null && (
              <span style={{ fontSize: 36, color: '#a3a3a3', fontWeight: 500 }}>
                {year}
              </span>
            )}
            {rating != null && (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 36,
                  color: '#fbbf24',
                  fontWeight: 600,
                }}
              >
                Rating {rating}
              </span>
            )}
          </div>
          <div
            style={{
              marginTop: 40,
              width: 64,
              height: 4,
              background: 'linear-gradient(90deg, #e11d48 0%, #f97316 100%)',
              borderRadius: 2,
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
