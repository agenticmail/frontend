'use client';

import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(88,166,255,0.15) 0%, transparent 70%)',
              'radial-gradient(ellipse 80% 50% at 60% -20%, rgba(188,140,255,0.15) 0%, transparent 70%)',
              'radial-gradient(ellipse 80% 50% at 40% -20%, rgba(240,136,62,0.12) 0%, transparent 70%)',
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(88,166,255,0.15) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-dark-300 bg-dark-100/50 mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            <span className="text-sm text-gray-400">Open Source · MIT Licensed · Self-hosted</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6"
        >
          Give your AI agents{' '}
          <span className="gradient-text">real email & SMS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Open source email, SMS & multi-agent coordination.
          Send, receive, search, organize — with built-in security guardrails.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="https://github.com/agenticmail/agenticmail"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-dark font-semibold text-base hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            Star on GitHub
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </a>
          <a
            href="#quickstart"
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-dark-300 text-white font-semibold text-base hover:bg-dark-100 transition-all"
          >
            Get Started
          </a>
        </motion.div>

        {/* Terminal preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 px-4 py-3 bg-dark-200 border-b border-dark-300">
              <div className="w-3 h-3 rounded-full bg-accent-red/80" />
              <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
              <div className="w-3 h-3 rounded-full bg-accent-green/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">terminal</span>
            </div>
            <div className="p-6 font-mono text-sm">
              <div className="text-gray-500">$ npx agenticmail</div>
              <div className="mt-2 text-accent-green">✓ AgenticMail server started on port 2525</div>
              <div className="text-accent-green">✓ 63 OpenClaw tools registered</div>
              <div className="text-accent-green">✓ 62 MCP tools available</div>
              <div className="text-accent-green">✓ REST API listening on :3210</div>
              <div className="mt-2 text-gray-500">Ready to send and receive emails 📧</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
