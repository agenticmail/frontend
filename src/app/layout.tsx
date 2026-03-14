import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgenticMail — AI Agent Workforce Platform | Autonomous Trading, Email, Tools & Enterprise Governance',
  description: 'Deploy AI agents as employees with email, phone, calendar, browser, memory, and 126+ Polymarket trading tools. Autonomous prediction market trading with Kelly criterion, whale tracking, AI-powered watchers, and risk management. Google Workspace, Microsoft 365, 145 SaaS integrations, DLP, compliance, and multi-tenant isolation. One command setup.',
  keywords: [
    // Core platform
    'AgenticMail', 'AI agent platform', 'AI agent workforce', 'AI employee platform',
    'enterprise AI agents', 'autonomous AI agents', 'AI agent management',
    // Polymarket & Trading
    'Polymarket trading bot', 'Polymarket AI agent', 'Polymarket automated trading',
    'prediction market trading', 'prediction market bot', 'autonomous trading agent',
    'AI trading bot', 'quant trading AI', 'Kelly criterion trading',
    'Polymarket API', 'CLOB trading', 'prediction market automation',
    'crypto trading bot', 'on-chain trading', 'whale tracking Polymarket',
    'AI market analysis', 'automated risk management', 'trading agent',
    // Agent capabilities
    'AI agent email', 'AI agent tools', 'AI agent browser', 'AI agent memory',
    'MCP server', 'MCP tools', 'multi-agent coordination',
    // Enterprise
    'Google Workspace AI', 'Microsoft 365 AI', 'SaaS integration AI',
    'enterprise AI platform', 'AI compliance', 'AI governance',
    'data loss prevention AI', 'self-hosted AI', 'open source AI platform',
    // Technical
    'AI agent infrastructure', 'agent runtime', 'AI agent SDK',
    'task queue AI agents', 'agent to agent communication',
  ],
  authors: [{ name: 'AgenticMail', url: 'https://agenticmail.io' }],
  creator: 'AgenticMail',
  publisher: 'AgenticMail',
  metadataBase: new URL('https://agenticmail.io'),
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
  alternates: {
    canonical: 'https://agenticmail.io',
  },
  openGraph: {
    title: 'AgenticMail — AI Agent Workforce Platform with Autonomous Polymarket Trading',
    description: 'Deploy AI agents with email, browser, memory, and 126+ trading tools. Autonomous Polymarket prediction market trading with Kelly criterion, AI-powered watchers, whale tracking, and risk management. Google Workspace, Microsoft 365, 145 SaaS integrations. Enterprise-grade security and compliance.',
    url: 'https://agenticmail.io',
    siteName: 'AgenticMail',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgenticMail — AI Agents with Autonomous Polymarket Trading',
    description: 'AI agent workforce platform. 126+ Polymarket trading tools, Kelly criterion, AI watchers, whale tracking, auto-exits. Plus email, browser, 145 SaaS integrations, enterprise security.',
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
  description: 'AI agent workforce platform. Deploy autonomous AI agents with email, phone, calendar, browser, memory, and 126+ Polymarket prediction market trading tools. Institutional-grade quant trading with Kelly criterion, AI-powered market watchers, whale tracking, on-chain analytics, and automated risk management. Google Workspace, Microsoft 365, 145 SaaS integrations. Enterprise security, DLP, compliance, and multi-tenant isolation.',
  url: 'https://agenticmail.io',
  applicationCategory: 'BusinessApplication',
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
  codeRepository: 'https://github.com/agenticmail/enterprise',
  programmingLanguage: 'TypeScript',
  softwareRequirements: 'Node.js 18+',
  featureList: [
    'Autonomous Polymarket prediction market trading',
    '126 trading tools across 10 skill modules',
    'Kelly criterion position sizing',
    'AI-powered market watchers (12 types: news, geopolitical, sentiment, volume, crypto)',
    'Automatic exit system (take-profit, stop-loss, trailing stop OCO)',
    'On-chain whale tracking and orderbook analysis',
    'Quantitative analysis (Black-Scholes, Bayesian, Monte Carlo, RSI, MACD, VaR)',
    'Trade journal with prediction calibration and strategy performance',
    '23-tab real-time trading dashboard with SSE streaming',
    'Agent email, phone, calendar, browser, and memory',
    'Google Workspace integration (14 services)',
    'Microsoft 365 integration (13 services, 90+ tools)',
    '145 SaaS integration adapters',
    '51 agent personality templates',
    'Data Loss Prevention with 53 pre-built rules',
    'Multi-tenant organizations with SSO',
    'Workforce scheduling and shift management',
    'Knowledge base with RAG',
    'Agent-to-agent coordination and task pipeline',
    'Meeting and voice intelligence',
    'Multimodal support (vision, audio, documents)',
    'Self-hosted or AgenticMail Cloud deployment',
    '10 database backends (PostgreSQL, MySQL, MongoDB, DynamoDB, SQLite, Turso)',
  ].join(', '),
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
