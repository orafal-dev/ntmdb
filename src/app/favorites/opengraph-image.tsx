import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #0c0c0c 0%, #1a1a1a 40%, #0f0f0f 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #e11d48 0%, #f97316 50%, #e11d48 100%)',
          }}
        />
        {/* Heart icon (minimal) - use text to avoid dynamic font load */}
        <div
          style={{
            width: 100,
            height: 100,
            marginBottom: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.15)',
            border: '3px solid rgba(225, 29, 72, 0.4)',
          }}
        >
          <span style={{ fontSize: 48, color: '#e11d48', fontWeight: 700 }}>&lt;3</span>
        </div>
        <h1
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: '#fafafa',
            margin: 0,
            marginBottom: 16,
            letterSpacing: '-0.02em',
          }}
        >
          My Favorites
        </h1>
        <p
          style={{
            fontSize: 40,
            color: '#a3a3a3',
            margin: 0,
            fontWeight: 500,
          }}
        >
          Your saved movies
        </p>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            width: 64,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #e11d48, transparent)',
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
