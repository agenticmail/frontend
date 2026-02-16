'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const code = `# Install and start AgenticMail
npx agenticmail

# Or with npm
npm install -g agenticmail
agenticmail start

# MCP mode (for Claude Desktop, etc.)
agenticmail mcp`;

export function Quickstart() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx agenticmail');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-100/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Up and running in <span className="gradient-text">one command</span>
          </h2>
          <p className="text-gray-400">No complex setup. No config files. Just run it.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-dark-300 bg-dark overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-dark-200 border-b border-dark-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-red/80" />
              <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
              <div className="w-3 h-3 rounded-full bg-accent-green/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">quickstart</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-dark-300"
            >
              {copied ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <pre className="p-6 font-mono text-sm text-gray-300 overflow-x-auto whitespace-pre">
            {code}
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
