'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const existingUserCode = `# Step 1: Install AgenticMail
npm install -g agenticmail

# Step 2: Start the AgenticMail server (runs local mail server via Docker)
agenticmail start

# Step 3: Add to your openclaw.yaml
skills:
  - agenticmail

# Step 4: Restart OpenClaw
openclaw restart

# Done — 63 email/SMS tools now available to your agent.`;

const newUserCode = `# Step 1: Install OpenClaw
npm install -g openclaw

# Step 2: Start OpenClaw (creates config on first run)
openclaw start

# Step 3: Install & start AgenticMail
npm install -g agenticmail
agenticmail start

# Step 4: Add AgenticMail skill to openclaw.yaml
skills:
  - agenticmail

# Step 5: Restart OpenClaw
openclaw restart

# Your AI agent can now:
# ✓ Send and receive real emails
# ✓ Send and receive SMS
# ✓ Coordinate with other agents
# ✓ All with built-in security guardrails`;

const mcpCode = `# For Claude Desktop, Cursor, or any MCP client:
{
  "mcpServers": {
    "agenticmail": {
      "command": "npx",
      "args": ["agenticmail", "mcp"]
    }
  }
}

# 62 MCP tools available immediately.`;

const apiCode = `# Start the REST API server:
npx agenticmail

# Send an email:
curl -X POST http://localhost:3210/api/email/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "user@example.com",
    "subject": "Hello from my agent",
    "text": "Sent programmatically!"
  }'

# 75+ endpoints for full email lifecycle.`;

type Tab = 'openclaw' | 'openclaw-new' | 'mcp' | 'api';

const tabs: { id: Tab; label: string; shortLabel: string; code: string; description: string }[] = [
  {
    id: 'openclaw',
    label: 'Already have OpenClaw',
    shortLabel: 'Existing User',
    code: existingUserCode,
    description: 'Add email & SMS to your existing OpenClaw setup in seconds.',
  },
  {
    id: 'openclaw-new',
    label: 'New to OpenClaw',
    shortLabel: 'New User',
    code: newUserCode,
    description: 'Full setup from scratch — OpenClaw + AgenticMail in under 5 minutes.',
  },
  {
    id: 'mcp',
    label: 'MCP Server',
    shortLabel: 'MCP',
    code: mcpCode,
    description: 'Use with Claude Desktop, Cursor, or any Model Context Protocol client.',
  },
  {
    id: 'api',
    label: 'REST API',
    shortLabel: 'API',
    code: apiCode,
    description: 'Use from any language or framework. 75+ endpoints.',
  },
];

export function Quickstart() {
  const [activeTab, setActiveTab] = useState<Tab>('openclaw');
  const [copied, setCopied] = useState(false);
  const current = tabs.find(t => t.id === activeTab)!;

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-dark-100/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">
            Get started in <span className="gradient-text">minutes</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-lg">Choose your setup path.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all border ${
                activeTab === tab.id
                  ? 'bg-accent/10 border-accent/40 text-white'
                  : 'bg-dark-200 border-dark-300 text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Description */}
        <p className="text-center text-gray-400 text-sm mb-4">{current.description}</p>

        {/* Code block */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0.8, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-dark-200 border-b border-dark-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-red/80" />
              <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
              <div className="w-3 h-3 rounded-full bg-accent-green/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">terminal</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="text-xs px-3 py-1 rounded-md border border-dark-300 text-gray-400 hover:text-white hover:border-accent/50 transition-all"
            >
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>
          <pre className="p-4 sm:p-6 font-mono text-xs sm:text-sm text-gray-300 overflow-x-auto leading-relaxed">
            <code>{current.code}</code>
          </pre>
        </motion.div>

        {/* Recommended badge for OpenClaw tab */}
        {activeTab === 'openclaw' && (
          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-1.5 text-xs text-accent-green">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Recommended — fastest way to get started
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
