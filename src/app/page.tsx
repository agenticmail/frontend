import { Hero } from '@/components/Hero';
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
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navbar />
      <Hero />
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
