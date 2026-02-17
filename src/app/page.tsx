import { Hero } from '@/components/Hero';
import { BeforeAfter } from '@/components/BeforeAfter';
import { Quickstart } from '@/components/Quickstart';
import { Features } from '@/components/Features';
import { Security } from '@/components/Security';
import { Trust } from '@/components/Trust';
import { LiveStats } from '@/components/LiveStats';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navbar />
      <Hero />
      <BeforeAfter />
      <Quickstart />
      <Features />
      <Security />
      <LiveStats />
      <Trust />
      <CTA />
      <Footer />
    </main>
  );
}
