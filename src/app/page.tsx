'use client';

import dynamic from 'next/dynamic';
import { Integrations } from '@/components/Integrations';
import { Features } from '@/components/Features';
import { Security } from '@/components/Security';
import { Quickstart } from '@/components/Quickstart';
import { Trust } from '@/components/Trust';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

// Remotion Player must be loaded client-side only (no SSR)
const ScrollPlayer = dynamic(() => import('@/components/ScrollPlayer').then(m => ({ default: m.ScrollPlayer })), {
  ssr: false,
  loading: () => (
    <div className="h-screen flex items-center justify-center bg-dark">
      <div className="text-center">
        <span className="text-4xl">🎀</span>
        <div className="mt-4 text-gray-500 text-sm font-mono">Loading experience...</div>
      </div>
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navbar />
      {/* Scroll-driven Remotion cinematic hero — takes 4x viewport height */}
      <ScrollPlayer />
      {/* Traditional sections below the cinematic intro */}
      <Integrations />
      <Features />
      <Security />
      <Quickstart />
      <Trust />
      <CTA />
      <Footer />
    </main>
  );
}
