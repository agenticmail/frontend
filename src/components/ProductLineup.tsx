'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PackageStats {
  pkg: string;
  week: number;
  month: number;
  total: number;
}

/**
 * Two-card lineup that gives both products equal billing on the home page:
 *
 *   ┌────────────────────────┬────────────────────────┐
 *   │  @agenticmail/cli (OSS)│  @agenticmail/enterprise│
 *   │  Devs / single agent   │  Orgs / agent fleets   │
 *   │  npx @agenticmail/cli  │  npx @agenticmail/...  │
 *   │  GitHub + npm link     │  Dashboard + npm link  │
 *   └────────────────────────┴────────────────────────┘
 *
 * Each card pulls its actual npm download count from /api/npm-stats so
 * the social proof on each side is the package's own number, not a
 * combined "total downloads" that hides which product is winning.
 */

const FEATURES_OSS = [
  'Real email + SMS for AI agents (your own SMTP/IMAP)',
  'MCP server — drop-in for Claude Code, Codex, any MCP client',
  'OpenClaw plugin + Node SDK',
  'Multi-account, hosted free or self-host',
];

const FEATURES_ENT = [
  'Full multi-tenant workforce platform with dashboard',
  '52 skills, 370+ tools — Google Workspace, Microsoft 365, Slack',
  'Governance, DLP, audit log, SAML/OIDC SSO',
  'Free Cloud Deploy on agenticmail.io subdomains',
];

function StatLine({ pkg }: { pkg: PackageStats | null }) {
  if (!pkg) {
    return <span className="text-gray-600">— downloads</span>;
  }
  return (
    <span>
      <span className="text-white font-semibold font-mono">{pkg.total.toLocaleString()}</span>{' '}
      <span className="text-gray-500">downloads</span>{' '}
      <span className="text-gray-600">·</span>{' '}
      <span className="text-accent-green font-mono">{pkg.week.toLocaleString()}</span>{' '}
      <span className="text-gray-500">this week</span>
    </span>
  );
}

export function ProductLineup() {
  const [packages, setPackages] = useState<PackageStats[]>([]);

  useEffect(() => {
    fetch('/api/npm-stats')
      .then(r => r.json())
      .then((d: { packages?: PackageStats[] }) => {
        if (Array.isArray(d.packages)) setPackages(d.packages);
      })
      .catch(() => {});
  }, []);

  const oss = packages.find(p => p.pkg === '@agenticmail/cli') ?? null;
  const ent = packages.find(p => p.pkg === '@agenticmail/enterprise') ?? null;
  const claudecode = packages.find(p => p.pkg === '@agenticmail/claudecode') ?? null;
  const codex = packages.find(p => p.pkg === '@agenticmail/codex') ?? null;

  return (
    <section id="products" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto text-center mb-10 sm:mb-14"
      >
        <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Two ways in</div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
          Start small, scale to a <span className="gradient-text">full workforce</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          AgenticMail is open source at the protocol layer and a full platform at the org layer.
          Same brand, same data primitives, two different surfaces depending on whether you&rsquo;re a developer
          or you&rsquo;re deploying a fleet.
        </p>
      </motion.div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* ─── OSS card ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-dark-300 bg-dark-100/50 p-6 sm:p-8 hover:border-accent-green/40 transition-colors"
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🎀</span>
            <span className="font-bold text-white text-xl">@agenticmail/cli</span>
            <span className="text-[10px] font-semibold tracking-wider text-accent-green bg-accent-green/10 border border-accent-green/30 px-2 py-0.5 rounded">
              OSS · MIT
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-5">
            Email + SMS for AI agents. The protocol layer. Drop into any MCP client, OpenClaw, or call the SDK directly.
          </p>

          <div className="font-mono text-sm bg-dark-200/70 rounded-lg px-4 py-3 mb-5 text-accent-green">
            $ npx @agenticmail/cli
          </div>

          <ul className="space-y-2 mb-6">
            {FEATURES_OSS.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                <svg className="w-4 h-4 text-accent-green mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="text-xs mb-5 pt-4 border-t border-dark-300/50">
            <StatLine pkg={oss} />
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.npmjs.com/package/@agenticmail/cli"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-dark font-semibold text-sm hover:bg-accent-green/90 transition-colors"
            >
              View on npm
              <span>→</span>
            </a>
            <a
              href="https://github.com/agenticmail/agenticmail"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dark-300 text-white font-semibold text-sm hover:bg-dark-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </motion.div>

        {/* ─── Enterprise card ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl border border-accent/30 bg-gradient-to-br from-dark-100/80 to-accent/5 p-6 sm:p-8 hover:border-accent/60 transition-colors"
        >
          <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold tracking-widest text-dark bg-accent rounded-bl-xl rounded-tr-2xl">
            FULL PLATFORM
          </div>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🎀</span>
            <span className="font-bold text-white text-xl">@agenticmail/enterprise</span>
          </div>
          <p className="text-sm text-gray-400 mb-5">
            Run AI agents as employees. Free Cloud Deploy on your own <code className="text-accent font-mono text-xs">name.agenticmail.io</code> subdomain — or self-host with the same MIT codebase.
          </p>

          <div className="font-mono text-sm bg-dark-200/70 rounded-lg px-4 py-3 mb-5 text-accent">
            $ npx @agenticmail/enterprise
          </div>

          <ul className="space-y-2 mb-6">
            {FEATURES_ENT.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                <svg className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {f}
              </li>
            ))}
          </ul>

          <div className="text-xs mb-5 pt-4 border-t border-dark-300/50">
            <StatLine pkg={ent} />
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.npmjs.com/package/@agenticmail/enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-dark font-semibold text-sm hover:bg-accent/90 transition-colors"
            >
              View on npm
              <span>→</span>
            </a>
            <a
              href="https://github.com/agenticmail/enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dark-300 text-white font-semibold text-sm hover:bg-dark-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
          </div>
        </motion.div>
      </div>

      {/* ─── Host plugins ─────────────────────────────────────────
       *  Below the two main cards. These are how people actually drop
       *  agenticmail into their existing AI tooling — claudecode for
       *  Anthropic Claude Code, codex for OpenAI Codex CLI. They're
       *  not separate products in the strict sense (they wrap the
       *  agenticmail protocol), but they get their own row so the
       *  visitor sees "ok, this thing already supports my editor /
       *  terminal" without scrolling away from the lineup. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-5xl mx-auto mt-10"
      >
        <div className="text-center mb-6">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Host plugins</div>
          <p className="text-sm text-gray-500">
            Drop the OSS into your existing AI CLI in one command. Both plugins ship every AgenticMail agent
            as a native sub-agent the host can delegate to.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <HostPluginCard
            name="@agenticmail/claudecode"
            tagline="Claude Code integration — surfaces every AgenticMail agent as a native subagent."
            install="npx @agenticmail/claudecode install"
            github="https://github.com/agenticmail/agenticmail/tree/main/packages/claudecode"
            npm="https://www.npmjs.com/package/@agenticmail/claudecode"
            stats={claudecode}
          />
          <HostPluginCard
            name="@agenticmail/codex"
            tagline="OpenAI Codex CLI integration — same agents, same threads, Codex-native dispatch."
            install="npx @agenticmail/codex install"
            github="https://github.com/agenticmail/agenticmail/tree/main/packages/codex"
            npm="https://www.npmjs.com/package/@agenticmail/codex"
            stats={codex}
          />
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Compact host-plugin card. Smaller chrome than the main two cards
 * because these are augmentations of `agenticmail`, not standalone
 * products — but they still get their own install command + live
 * download count + npm/repo links so they don't feel like footnotes.
 */
function HostPluginCard({
  name, tagline, install, github, npm, stats,
}: {
  name: string;
  tagline: string;
  install: string;
  github: string;
  npm: string;
  stats: PackageStats | null;
}) {
  return (
    <div className="rounded-xl border border-dark-300 bg-dark-100/40 p-5 hover:border-accent-purple/40 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">🎀</span>
        <span className="font-semibold text-white text-sm font-mono">{name}</span>
      </div>
      <p className="text-xs text-gray-400 mb-3 leading-relaxed">{tagline}</p>
      <div className="font-mono text-xs bg-dark-200/60 rounded px-3 py-2 text-accent-purple mb-3 overflow-x-auto">
        $ {install}
      </div>
      <div className="text-[11px] text-gray-500 mb-3">
        <StatLine pkg={stats} />
      </div>
      <div className="flex gap-3 text-xs">
        <a href={npm} target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:text-white transition-colors">
          npm →
        </a>
        <span className="text-gray-700">·</span>
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
          GitHub →
        </a>
      </div>
    </div>
  );
}
