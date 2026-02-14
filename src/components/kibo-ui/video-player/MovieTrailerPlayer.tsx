'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  VideoPlayer,
  VideoPlayerControlBar,
  VideoPlayerMuteButton,
  VideoPlayerPlayButton,
  VideoPlayerSeekBackwardButton,
  VideoPlayerSeekForwardButton,
  VideoPlayerTimeDisplay,
  VideoPlayerTimeRange,
  VideoPlayerVolumeRange,
} from './index';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

const VIDEO_STYLE = {
  width: '100%',
  height: '100%',
  '--controls': 'none',
} as React.CSSProperties;

export interface MovieTrailerPlayerProps {
  /** YouTube video key from TMDB (e.g. "O-b2VfmmbyA") */
  videoKey: string;
  /** Optional video name for aria-label */
  title?: string;
  /** Hide tooltips on play/seek buttons (e.g. "More Videos") */
  hideTooltips?: boolean;
  /** Use YouTube embed with controls=0 to hide YouTube's native control bar */
  hideYoutubeControls?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Renders a TMDB movie trailer (YouTube) using react-player inside the kibo-ui
 * VideoPlayer (MediaController) with custom control bar.
 * Only mounts the player on the client to avoid hydration mismatch between
 * MediaController's shadow DOM and the dynamic ReactPlayer Suspense boundary.
 */
const noTooltipProps = { notooltip: true } as const;

export const MovieTrailerPlayer = ({
  videoKey,
  title,
  hideTooltips = false,
  hideYoutubeControls = false,
  className,
  style,
}: MovieTrailerPlayerProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const src = hideYoutubeControls
    ? `https://www.youtube.com/embed/${videoKey}?controls=0&modestbranding=1&rel=0`
    : `https://www.youtube.com/watch?v=${videoKey}`;

  const buttonProps = hideTooltips ? noTooltipProps : undefined;

  const containerStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '16/9',
    ...style,
  };

  if (!mounted) {
    return (
      <div
        className={className}
        style={containerStyle}
        aria-label={title ?? 'Movie trailer'}
      >
        <div
          className="flex size-full items-center justify-center rounded-lg bg-muted"
          aria-hidden
        >
          <span className="sr-only">Loading trailer</span>
        </div>
      </div>
    );
  }

  return (
    <VideoPlayer
      className={className}
      style={containerStyle}
      aria-label={title ?? 'Movie trailer'}
    >
      <ReactPlayer
        slot="media"
        src={src}
        controls={false}
        width="100%"
        height="100%"
        style={VIDEO_STYLE}
      />
      <VideoPlayerControlBar>
        <VideoPlayerPlayButton {...buttonProps} />
        <VideoPlayerSeekBackwardButton {...buttonProps} />
        <VideoPlayerSeekForwardButton {...buttonProps} />
        <VideoPlayerTimeRange />
        <VideoPlayerTimeDisplay />
        <VideoPlayerMuteButton {...buttonProps} />
        <VideoPlayerVolumeRange />
      </VideoPlayerControlBar>
    </VideoPlayer>
  );
};
