import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgenticMail — Give Your OpenClaw Agent Real Email & SMS Capabilities',
  description: 'AgenticMail is an open source email and SMS plugin for OpenClaw. Let your AI agent send emails, receive replies, create PDFs, sign up for services, send SMS, coordinate with other agents — all self-hosted with security guardrails. 63 OpenClaw tools, 62 MCP tools, 75+ REST API endpoints.',
  keywords: [
    'AgenticMail', 'OpenClaw', 'OpenClaw plugin', 'OpenClaw email', 'OpenClaw SMS',
    'AI agent email', 'AI agent SMS', 'MCP server', 'MCP email tools',
    'multi-agent coordination', 'agent to agent communication',
    'AI email automation', 'self-hosted email', 'open source AI tools',
    'Claude Desktop MCP', 'AI agent infrastructure', 'email API for AI',
    'call_agent', 'sessions_spawn alternative', 'task queue AI agents',
    'outbound guard', 'PII detection', 'agent security',
  ],
  authors: [{ name: 'AgenticMail', url: 'https://agenticmail.io' }],
  creator: 'AgenticMail',
  publisher: 'AgenticMail',
  metadataBase: new URL('https://agenticmail.io'),
  alternates: {
    canonical: 'https://agenticmail.io',
  },
  openGraph: {
    title: 'AgenticMail — Give Your OpenClaw Agent Real Email & SMS',
    description: 'Open source email, SMS & multi-agent coordination plugin for OpenClaw. Your AI agent can send emails, receive replies, create and attach documents, sign up for services, and coordinate with other agents. Self-hosted, MIT licensed.',
    url: 'https://agenticmail.io',
    siteName: 'AgenticMail',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgenticMail — Give Your OpenClaw Agent Real Email & SMS',
    description: 'Open source email & SMS plugin for OpenClaw. Send emails, receive replies, create PDFs, sign up for services, multi-agent coordination. Self-hosted.',
    creator: '@agenticmail',
    site: '@agenticmail',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'qbbtnm7Hrt79nT7fNNH5BHCd8xVIPC1y-aePv-Lm2x8',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'AgenticMail',
  description: 'Open source email and SMS plugin for OpenClaw AI agents. Send emails, receive replies, create PDFs, sign up for services, multi-agent coordination with security guardrails.',
  url: 'https://agenticmail.io',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'macOS, Linux, Windows',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  license: 'https://opensource.org/licenses/MIT',
  author: {
    '@type': 'Organization',
    name: 'AgenticMail',
    url: 'https://agenticmail.io',
  },
  codeRepository: 'https://github.com/agenticmail/agenticmail',
  programmingLanguage: 'TypeScript',
  softwareRequirements: 'Node.js 18+, Docker',
  featureList: 'Email sending and receiving, SMS via Google Voice, Multi-agent coordination, Task queue, Outbound security guard, PII detection, PDF and document attachments, MCP server, REST API, OpenClaw plugin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
