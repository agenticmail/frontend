'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function TypingTerminal() {
  // Show BOTH products side-by-side in one demo terminal so the page reads
  // "here's the OSS dev path, here's the enterprise path" without forcing
  // a tab switch. Order: OSS first (lower commitment), enterprise second
  // (the upgrade path). Total runtime ~7s.
  const lines = [
    { text: '$ npx @agenticmail/cli', color: 'text-gray-500', delay: 0 },
    { text: '  ✓ Inbox claimed: alice@yourdomain.io', color: 'text-accent-green', delay: 500 },
    { text: '  ✓ MCP server live on stdio', color: 'text-accent-green', delay: 900 },
    { text: '  ✓ SMS number purchased: +1 (555) 0148', color: 'text-accent-green', delay: 1300 },
    { text: '  Drop into Claude Code / Codex / OpenClaw →', color: 'text-gray-400', delay: 1700 },
    { text: '', color: '', delay: 2100 },
    { text: '$ npx @agenticmail/enterprise', color: 'text-gray-500', delay: 2400 },
    { text: '  Deploy target: AgenticMail Cloud (free)', color: 'text-accent', delay: 2800 },
    { text: '  Subdomain: acme.agenticmail.io', color: 'text-accent', delay: 3200 },
    { text: '  ✓ Database provisioned · 32 tables migrated', color: 'text-accent-green', delay: 3600 },
    { text: '  ✓ Admin account created', color: 'text-accent-green', delay: 4000 },
    { text: '  52 skills · 370+ tools · Google + Microsoft 365', color: 'text-gray-400', delay: 4400 },
    { text: '  Dashboard: https://acme.agenticmail.io', color: 'text-accent-purple', delay: 4800 },
    { text: '', color: '', delay: 5200 },
    { text: '  ✓ Live! Create your first agent →', color: 'text-accent-green', delay: 5400 },
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
  { value: '370+', label: 'Agent Tools' },
  { value: '145', label: 'SaaS Integrations' },
  { value: '26', label: 'Productivity Services' },
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
                Open Source · MIT · Free Cloud Deploy · Two npm packages
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5"
            >
              Real email + identity for{' '}
              <span className="gradient-text">AI agents</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-400 leading-relaxed mb-8 max-w-lg"
            >
              <strong className="text-white">@agenticmail/cli</strong> gives any AI agent its own inbox, phone number, and SMS &mdash; with one-command plugins for{' '}
              <strong className="text-white">Claude Code</strong> and <strong className="text-white">Codex</strong>.{' '}
              <strong className="text-white">@agenticmail/enterprise</strong> adds calendars, browsers, 370+ tools, governance, and a multi-tenant dashboard for running whole agent fleets.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="https://www.npmjs.com/package/@agenticmail/cli"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-dark font-semibold text-sm hover:bg-accent-green/90 transition-all"
              >
                Install @agenticmail/cli
                <span className="font-mono text-xs opacity-70">npx</span>
              </a>
              <a
                href="https://www.npmjs.com/package/@agenticmail/enterprise"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-dark font-semibold text-sm hover:bg-accent/90 transition-all"
              >
                Get Enterprise
                <span className="font-mono text-xs opacity-70">npx</span>
              </a>
              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-dark-300 text-white font-semibold text-sm hover:bg-dark-100 transition-all"
              >
                Compare
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
