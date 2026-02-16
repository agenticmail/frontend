'use client';

import { Hero } from '@/components/Hero';
import { Stats } from '@/components/Stats';
import { Integrations } from '@/components/Integrations';
import { Features } from '@/components/Features';
import { Security } from '@/components/Security';
import { Quickstart } from '@/components/Quickstart';
import { Trust } from '@/components/Trust';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark overflow-hidden">
      <Navbar />
      <Hero />
      <Stats />
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
