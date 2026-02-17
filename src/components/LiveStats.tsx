'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Stats {
  totalCalls: number;
  totalInstalls: number;
  npmDownloads: number;
  topTools: { tool: string; count: number }[];
}

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export function LiveStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [npmDownloads, setNpmDownloads] = useState<{ week: number; month: number; total: number } | null>(null);

  useEffect(() => {
    fetch('/api/telemetry').then(r => r.json()).then((d: any) => setStats(d)).catch(() => {});
    fetch('/api/npm-stats').then(r => r.json()).then((d: any) => setNpmDownloads(d.downloads)).catch(() => {});
  }, []);

  const totalDownloads = npmDownloads?.total || stats?.npmDownloads || 0;
  const toolCalls = stats?.totalCalls || 0;
  const uniqueInstalls = stats?.totalInstalls || 0;

  return (
    <section className="pt-4 pb-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl mx-auto"
      >
        <div className="bg-dark-100/60 border border-dark-300 rounded-xl px-4 py-4 sm:px-8 sm:py-5 backdrop-blur-sm flex items-center justify-between gap-2">
          {/* npm Downloads */}
          <div className="flex-1 text-center">
            <div className="text-xl sm:text-3xl font-bold text-white font-mono leading-tight">
              <AnimatedCounter target={totalDownloads} />
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-0.5">Downloads</div>
          </div>

          <div className="w-px h-8 sm:h-10 bg-dark-300" />

          {/* Tool Calls */}
          <div className="flex-1 text-center">
            <div className="text-xl sm:text-3xl font-bold text-accent font-mono leading-tight">
              <AnimatedCounter target={toolCalls} />
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-0.5">Tool Calls</div>
          </div>

          <div className="w-px h-8 sm:h-10 bg-dark-300" />

          {/* Unique Installs */}
          <div className="flex-1 text-center">
            <div className="text-xl sm:text-3xl font-bold text-accent-green font-mono leading-tight">
              <AnimatedCounter target={uniqueInstalls} />
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider mt-0.5">Installs</div>
          </div>

          {/* Live dot */}
          <div className="hidden sm:flex items-center gap-1.5 pl-4 border-l border-dark-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            <span className="text-[10px] text-gray-500 uppercase">Live</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
