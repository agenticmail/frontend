'use client';

import { motion } from 'framer-motion';

export function OpenSource() {
  return (
    <section id="open-source" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Open Source</div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              MIT licensed. <span className="gradient-text">Self-hosted.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-5">
              Your data stays on your infrastructure. No vendor lock-in. Fork it, extend it, own it.
              The entire platform — dashboard, engine, runtime, tools, adapters — is open source.
            </p>
            <div className="space-y-3 mb-6">
              {[
                'Full source code — 770+ files, zero obfuscation',
                'Deploy anywhere — Docker, Fly.io, Railway, bare metal',
                'No telemetry, no phone-home, no usage tracking',
                'Community skill marketplace with auto-sync',
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <svg className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {point}
                </div>
              ))}
            </div>
            <a
              href="https://github.com/agenticmail/enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              View on GitHub
              <span>→</span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Also looking for the original AgenticMail */}
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-dark-300/50 bg-dark-100/50">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎀</span>
                  <span className="font-bold text-white">AgenticMail Enterprise</span>
                </div>
                <p className="text-sm text-gray-400 mb-3">Full AI workforce platform. Deploy and govern AI agents as employees.</p>
                <div className="font-mono text-xs text-gray-500 bg-dark-200/50 rounded px-3 py-2">
                  npx @agenticmail/enterprise
                </div>
                <div className="flex gap-3 mt-3 text-xs text-gray-500">
                  <span>770+ files</span>
                  <span>·</span>
                  <span>MIT</span>
                  <span>·</span>
                  <span>TypeScript</span>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-dark-300/30 bg-dark-100/30">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🎀</span>
                  <span className="font-semibold text-gray-300">AgenticMail</span>
                  <span className="text-[10px] text-gray-500 bg-dark-200 px-1.5 py-0.5 rounded">OSS</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Email & SMS for AI agents. OpenClaw plugin, MCP server, REST API.</p>
                <div className="font-mono text-xs text-gray-600 bg-dark-200/30 rounded px-3 py-2">
                  npx agenticmail
                </div>
                <a href="https://github.com/agenticmail/agenticmail" target="_blank" rel="noopener noreferrer" className="inline-block mt-3 text-xs text-gray-500 hover:text-gray-400 transition-colors">
                  View repository →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
