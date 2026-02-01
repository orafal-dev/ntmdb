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
          background: 'linear-gradient(160deg, #0c0c0c 0%, #171717 35%, #0c0c0c 100%)',
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
        {/* Logo / title */}
        <h1
          style={{
            fontSize: 120,
            fontWeight: 800,
            color: '#fafafa',
            margin: 0,
            marginBottom: 20,
            letterSpacing: '-0.03em',
          }}
        >
          NTMDB
        </h1>
        <p
          style={{
            fontSize: 44,
            color: '#a3a3a3',
            margin: 0,
            fontWeight: 500,
          }}
        >
          Discover movies
        </p>
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            width: 96,
            height: 4,
            background: 'linear-gradient(90deg, transparent, #e11d48, #f97316, transparent)',
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
