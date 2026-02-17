'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Stats {
  totalCalls: number;
  totalInstalls: number;
  npmDownloads: number;
  topTools: { tool: string; count: number }[];
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toLocaleString();
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{formatNumber(count)}</span>;
}

// Clean tool name for display
function cleanToolName(name: string): string {
  return name
    .replace(/^agenticmail_/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [npmDownloads, setNpmDownloads] = useState<{ week: number; month: number; total: number } | null>(null);

  useEffect(() => {
    // Fetch telemetry stats
    fetch('/api/telemetry')
      .then(r => r.json())
      .then((data: any) => setStats(data))
      .catch(() => {});

    // Fetch npm stats
    fetch('/api/npm-stats')
      .then(r => r.json())
      .then((data: any) => setNpmDownloads(data.downloads))
      .catch(() => {});
  }, []);

  const totalDownloads = npmDownloads?.total || stats?.npmDownloads || 0;
  const toolCalls = stats?.totalCalls || 0;
  const uniqueInstalls = stats?.totalInstalls || 0;

  return (
    <section className="pt-8 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-dark-300 bg-dark-100/50 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-sm text-gray-400">Live usage stats</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Agents are <span className="gradient-text">already using it</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Real-time numbers from the AgenticMail ecosystem. Anonymous telemetry — no personal data collected.
          </p>
        </motion.div>

        {/* Main stats cards — single row on mobile, 3 cols on desktop */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-dark-100/80 border border-dark-300 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm"
          >
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2 font-mono">
              <AnimatedCounter target={totalDownloads} />
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">npm Downloads</div>
            {npmDownloads && (
              <div className="mt-3 text-xs text-gray-500">
                {formatNumber(npmDownloads.week)}/week · {formatNumber(npmDownloads.month)}/month
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-1 bg-dark-100/80 border border-dark-300 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm"
          >
            <div className="text-4xl sm:text-5xl font-bold text-accent mb-2 font-mono">
              <AnimatedCounter target={toolCalls} />
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Tool Calls</div>
            <div className="mt-3 text-xs text-gray-500">
              Across all agent sessions
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex-1 bg-dark-100/80 border border-dark-300 rounded-xl p-6 sm:p-8 text-center backdrop-blur-sm"
          >
            <div className="text-4xl sm:text-5xl font-bold text-accent-green mb-2 font-mono">
              <AnimatedCounter target={uniqueInstalls} />
            </div>
            <div className="text-gray-400 text-sm uppercase tracking-wider">Unique Installs</div>
            <div className="mt-3 text-xs text-gray-500">
              Active AgenticMail instances
            </div>
          </motion.div>
        </div>

        {/* Top tools */}
        {stats?.topTools && stats.topTools.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-dark-100/80 border border-dark-300 rounded-xl p-8 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Most Popular Tools
            </h3>
            <div className="space-y-3">
              {stats.topTools.map((tool, i) => {
                const maxCount = stats.topTools[0].count;
                const width = Math.max((tool.count / maxCount) * 100, 8);
                return (
                  <div key={tool.tool} className="flex items-center gap-4">
                    <div className="w-40 sm:w-48 text-sm text-gray-300 font-mono truncate">
                      {cleanToolName(tool.tool)}
                    </div>
                    <div className="flex-1 h-6 bg-dark-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${width}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
                        className={`h-full rounded-full ${
                          i === 0 ? 'bg-accent' :
                          i === 1 ? 'bg-accent-purple' :
                          i === 2 ? 'bg-accent-green' :
                          'bg-dark-400'
                        }`}
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-gray-400 font-mono">
                      {formatNumber(tool.count)}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Opt-out notice */}
        <p className="text-center text-xs text-gray-600 mt-8">
          Telemetry is anonymous and opt-out. Set <code className="text-gray-500">AGENTICMAIL_TELEMETRY=0</code> to disable.
        </p>
      </div>
    </section>
  );
}
