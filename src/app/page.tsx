import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { DashboardPreview } from '@/components/DashboardPreview';
import { AgentCapabilities } from '@/components/AgentCapabilities';
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
      <HowItWorks />
      <DashboardPreview />
      <AgentCapabilities />
      <EnterpriseFeatures />
      <Integrations />
      <OpenSource />
      <CTA />
      <Footer />
    </main>
  );
}
