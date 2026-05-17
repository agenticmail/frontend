import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { LiveStats } from '@/components/LiveStats';
import { CompanyMarquee } from '@/components/CompanyMarquee';
import { ProductLineup } from '@/components/ProductLineup';
import { HowItWorks } from '@/components/HowItWorks';
import { DashboardPreview } from '@/components/DashboardPreview';
import { AgentCapabilities } from '@/components/AgentCapabilities';
import { PolymarketTrading } from '@/components/PolymarketTrading';
import { EnterpriseFeatures } from '@/components/EnterpriseFeatures';
import { Integrations } from '@/components/Integrations';
import { OpenSource } from '@/components/OpenSource';
import { CTA } from '@/components/CTA';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-dark overflow-x-hidden">
      <Navbar />
      <Hero />
      <LiveStats />
      <CompanyMarquee />
      <ProductLineup />
      <HowItWorks />
      <DashboardPreview />
      <AgentCapabilities />
      <PolymarketTrading />
      <EnterpriseFeatures />
      <Integrations />
      <OpenSource />
      <CTA />
      <Footer />
    </main>
  );
}
