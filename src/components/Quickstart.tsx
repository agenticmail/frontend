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
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-100/30">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Up and running in <span className="gradient-text">one command</span>
          </h2>
          <p className="text-gray-400 text-lg">No complex setup. No config files. Just run it.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ boxShadow: '0 0 60px rgba(88,166,255,0.06)' }}
          className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden shadow-2xl shadow-black/20"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-dark-200 border-b border-dark-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-red/80" />
              <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
              <div className="w-3 h-3 rounded-full bg-accent-green/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">quickstart</span>
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
          <pre className="p-6 font-mono text-sm text-gray-300 overflow-x-auto leading-relaxed">
            <code>{code}</code>
          </pre>
        </motion.div>
      </div>
    </section>
  );
}
