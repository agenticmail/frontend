'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Subdomain {
  name: string;
  fqdn: string;
  createdAt: string;
}

/** "joined 3 days ago" / "joined just now" formatter. Keeps the card chrome
 *  human-friendly without pulling in date-fns. */
function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return '';
  const diffSec = Math.max(0, (Date.now() - t) / 1000);
  if (diffSec < 90) return 'joined just now';
  const diffMin = diffSec / 60;
  if (diffMin < 90) return `joined ${Math.round(diffMin)} min ago`;
  const diffHr = diffMin / 60;
  if (diffHr < 36) return `joined ${Math.round(diffHr)} h ago`;
  const diffDay = diffHr / 24;
  if (diffDay < 14) return `joined ${Math.round(diffDay)} days ago`;
  const diffWk = diffDay / 7;
  if (diffWk < 9) return `joined ${Math.round(diffWk)} weeks ago`;
  const diffMo = diffDay / 30;
  if (diffMo < 12) return `joined ${Math.round(diffMo)} months ago`;
  return `joined ${Math.round(diffDay / 365)} y ago`;
}

/** Deterministic accent colour from the subdomain name — keeps each company's
 *  card visually distinct across page reloads without needing to persist a
 *  colour choice. */
function accentFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  const palette = ['#58a6ff', '#3fb950', '#bc8cff', '#f0883e', '#f85149', '#39d0d8', '#ffa657'];
  return palette[Math.abs(hash) % palette.length];
}

function CompanyCard({ s }: { s: Subdomain }) {
  const accent = accentFor(s.name);
  const initial = (s.name[0] || '?').toUpperCase();
  return (
    <a
      href={`https://${s.fqdn}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-64 sm:w-72 mr-4 bg-dark-100/60 border border-dark-300 rounded-xl p-4 backdrop-blur-sm hover:border-accent/40 hover:bg-dark-100 transition-all"
      aria-label={`${s.name} — ${s.fqdn}`}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
          style={{ background: accent }}
        >
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-semibold truncate group-hover:text-accent transition-colors">
            {s.name}
          </div>
          <div className="text-xs text-gray-500 truncate font-mono">{s.fqdn}</div>
        </div>
      </div>
      <div className="mt-3 text-[11px] text-gray-500 uppercase tracking-wider">
        {relativeTime(s.createdAt)}
      </div>
    </a>
  );
}

const REGISTRY_URL = 'https://registry.agenticmail.io/active';

export function CompanyMarquee() {
  const [subs, setSubs] = useState<Subdomain[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(REGISTRY_URL)
      .then(r => r.json())
      .then((d: { subdomains?: Subdomain[] }) => {
        setSubs(Array.isArray(d.subdomains) ? d.subdomains : []);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  if (loaded && subs.length === 0) return null;

  // Duplicate the list so the marquee loops seamlessly without a visible
  // jump on the wrap-around. The animation moves x from 0 → -50%, which
  // hides the first copy exactly as the second copy reaches the start.
  const cards = subs.length > 0 ? [...subs, ...subs] : [];
  // Speed: ~32px / second. Scales with content so longer lists still feel
  // unhurried — a 20-card list takes ~3 minutes per loop.
  const widthEstimate = subs.length * (288 + 16); // 72*4 + mr-4
  const duration = Math.max(40, widthEstimate / 32);

  return (
    <section className="py-12 sm:py-16 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green"></span>
            </span>
            Live
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Teams running AgenticMail Enterprise
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            Real installs, claimed live from{' '}
            <code className="text-accent font-mono text-xs">registry.agenticmail.io</code>
          </p>
        </div>
      </motion.div>

      {/* Marquee track */}
      <div
        className="relative w-full overflow-hidden group"
        // Fade edges so cards don't pop in/out hard. Vendor prefix kept for
        // older Safari which still gates this behind -webkit-.
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        }}
      >
        {/* Right-to-left auto-scroll. Pause on hover so a curious visitor can
            actually read a card without it sliding away. */}
        <motion.div
          className="flex w-max group-hover:[animation-play-state:paused]"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration, ease: 'linear', repeat: Infinity }}
        >
          {cards.map((s, i) => (
            <CompanyCard key={`${s.name}-${i}`} s={s} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
