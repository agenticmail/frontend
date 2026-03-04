'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function TypingTerminal() {
  const lines = [
    { text: '$ npx @agenticmail/enterprise', color: 'text-gray-500', delay: 0 },
    { text: '', color: '', delay: 600 },
    { text: '  Database: Supabase (auto-optimized)', color: 'text-accent', delay: 800 },
    { text: '  ✓ Smart pooler detected — transaction mode (6543)', color: 'text-accent-green', delay: 1400 },
    { text: '  ✓ Direct URL generated for migrations', color: 'text-accent-green', delay: 1800 },
    { text: '  ✓ Schema migrated (32 tables)', color: 'text-accent-green', delay: 2200 },
    { text: '', color: '', delay: 2600 },
    { text: '  52 skills · 270+ tools · 145 SaaS adapters', color: 'text-gray-400', delay: 2800 },
    { text: '  Dashboard: http://localhost:3000', color: 'text-accent-purple', delay: 3200 },
    { text: '', color: '', delay: 3600 },
    { text: '  ✓ Ready. Create your first agent →', color: 'text-accent-green', delay: 3800 },
  ];

  const [visibleLines, setVisibleLines] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    lines.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), lines[i].delay));
    });
    const cursorInterval = setInterval(() => setShowCursor(v => !v), 530);
    return () => { timers.forEach(clearTimeout); clearInterval(cursorInterval); };
  }, []);

  return (
    <div className="p-5 font-mono text-[13px] leading-relaxed">
      {lines.slice(0, visibleLines).map((line, i) => (
        <div key={i} className={line.color}>{line.text || '\u00A0'}</div>
      ))}
      {visibleLines >= lines.length && (
        <div className="mt-1">
          <span className="text-gray-500">$ </span>
          <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity text-accent`}>▌</span>
        </div>
      )}
    </div>
  );
}

const stats = [
  { value: '770+', label: 'Source Files' },
  { value: '270+', label: 'Agent Tools' },
  { value: '145', label: 'SaaS Integrations' },
  { value: '10', label: 'Database Backends' },
];

export function Hero() {
  return (
    <section className="relative pt-24 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle animated gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(88,166,255,0.08) 0%, transparent 70%)',
              'radial-gradient(ellipse 80% 50% at 60% -20%, rgba(188,140,255,0.08) 0%, transparent 70%)',
              'radial-gradient(ellipse 80% 50% at 40% -20%, rgba(88,166,255,0.08) 0%, transparent 70%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0"
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-dark-300 bg-dark-100/50 mb-6 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
                Open Source · MIT Licensed · Self-hosted
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5"
            >
              Deploy AI agents as{' '}
              <span className="gradient-text">real employees</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg"
            >
              Each agent gets their own email, calendar, browser, tools, memory, and identity.
              Enterprise-grade governance, DLP, compliance, and multi-tenant isolation — all built in.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="https://github.com/agenticmail/enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-dark font-semibold text-sm hover:bg-gray-100 transition-all"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                Get Started
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-dark-300 text-white font-semibold text-sm hover:bg-dark-100 transition-all"
              >
                See Features
              </a>
            </motion.div>

            {/* Inline stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-dark-300/50"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Terminal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 px-4 py-3 bg-dark-200 border-b border-dark-300">
                <div className="w-3 h-3 rounded-full bg-accent-red/80" />
                <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
                <div className="w-3 h-3 rounded-full bg-accent-green/80" />
                <span className="ml-2 text-xs text-gray-500 font-mono">terminal</span>
              </div>
              <TypingTerminal />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
