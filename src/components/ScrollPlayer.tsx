'use client';

import { Player, PlayerRef } from '@remotion/player';
import { useEffect, useRef, useState, useCallback } from 'react';
import { HeroComposition } from './EmailAnimation';

export function ScrollPlayer() {
  const playerRef = useRef<PlayerRef>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  const totalFrames = 300; // 10 seconds at 30fps

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollableHeight = rect.height - window.innerHeight;
    const scrolled = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / scrollableHeight));
    const targetFrame = Math.round(progress * (totalFrames - 1));
    setFrame(targetFrame);
    if (playerRef.current) {
      playerRef.current.seekTo(targetFrame);
    }
  }, [totalFrames]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      style={{ height: '400vh' }} // 4x viewport = lots of scroll room
      className="relative"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <Player
          ref={playerRef}
          component={HeroComposition}
          compositionWidth={1200}
          compositionHeight={675}
          durationInFrames={totalFrames}
          fps={30}
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '100vw',
            maxHeight: '100vh',
          }}
          controls={false}
          loop={false}
          autoPlay={false}
          inputProps={{}}
        />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#21262d]">
          <div
            className="h-full bg-gradient-to-r from-[#58a6ff] via-[#bc8cff] to-[#f0883e] transition-all duration-75"
            style={{ width: `${(frame / (totalFrames - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
