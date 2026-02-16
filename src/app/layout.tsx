import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AgenticMail — Email, SMS & Multi-Agent Coordination for AI Agents',
  description: 'Open source email, SMS & multi-agent coordination for AI agents. 63 OpenClaw tools, 62 MCP tools, 75+ API endpoints. Self-hosted, MIT licensed.',
  keywords: ['AI agents', 'email automation', 'MCP', 'OpenClaw', 'SMS', 'multi-agent', 'open source'],
  authors: [{ name: 'AgenticMail' }],
  openGraph: {
    title: 'AgenticMail — Give your AI agents real email & SMS',
    description: 'Open source email, SMS & multi-agent coordination for AI agents. Self-hosted, MIT licensed.',
    url: 'https://agenticmail.com',
    siteName: 'AgenticMail',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgenticMail — Give your AI agents real email & SMS',
    description: 'Open source email, SMS & multi-agent coordination for AI agents.',
    creator: '@agenticmail',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
