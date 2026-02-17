import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Releases — AgenticMail',
  description: 'Release notes and changelog for AgenticMail',
};

interface Release {
  version: string;
  date: string;
  title: string;
  highlights: string[];
  details?: string[];
  tag: 'major' | 'minor' | 'patch';
}

const releases: Release[] = [
  {
    version: '0.5.41',
    date: '2026-02-17',
    title: 'Live Telemetry Pipeline',
    tag: 'patch',
    highlights: [
      'Telemetry pipeline fully working end-to-end from OpenClaw gateway',
      'Tool call counts now increment in real-time on agenticmail.io',
      'Clean dual ESM + CJS builds for all packages',
    ],
  },
  {
    version: '0.5.40',
    date: '2026-02-17',
    title: 'Anonymous Telemetry & Live Stats',
    tag: 'minor',
    highlights: [
      'Anonymous telemetry system — track tool usage, installs, and adoption',
      'Live stats dashboard on agenticmail.io with animated counters',
      'Custom favicon and branding across all devices',
      'CJS compatibility fix for OpenClaw gateway integration',
    ],
    details: [
      'Telemetry is anonymous (random UUID, no PII), opt-out via AGENTICMAIL_TELEMETRY=0',
      'Stats endpoint: GET /api/telemetry returns tool calls, installs, npm downloads',
      'Built with Netlify Functions + Blobs for zero additional infrastructure',
    ],
  },
  {
    version: '0.5.39',
    date: '2026-02-17',
    title: 'Removed assign_task, Streamlined Delegation',
    tag: 'minor',
    highlights: [
      'Removed broken assign_task tool — all delegation now through call_agent',
      'call_agent supports sync and async modes, auto-detects complexity',
      'Updated all documentation and migration guides',
      'Tool count: 59 tools (was 60)',
    ],
    details: [
      'assign_task had a scoping bug — spawned agents couldn\'t find their tasks',
      'call_agent(async=true) replaces assign_task for fire-and-forget delegation',
      'Migration: replace agenticmail_assign_task with agenticmail_call_agent(async=true)',
    ],
  },
  {
    version: '0.5.38',
    date: '2026-02-16',
    title: 'Multi-Agent Task System',
    tag: 'minor',
    highlights: [
      'call_agent for synchronous and asynchronous agent delegation',
      'Auto-spawns isolated sessions for sub-agent tasks',
      'Light mode for simple tasks (no email overhead)',
      'SMS via Google Voice — verification codes, send/receive texts',
    ],
  },
  {
    version: '0.5.37',
    date: '2026-02-16',
    title: 'Initial Public Release',
    tag: 'major',
    highlights: [
      '59 tools for AI agent email identity and communication',
      'Gmail/Outlook relay and custom domain support',
      'OpenClaw plugin and MCP server',
      'Agent-to-agent messaging, templates, signatures, spam protection',
      'Outbound content guard with PII/credential scanning',
    ],
  },
];

const tagColors: Record<string, string> = {
  major: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  minor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  patch: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
};

export default function ReleasesPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
            ← Back to AgenticMail
          </a>
          <h1 className="text-4xl font-bold mt-2">Releases</h1>
          <p className="text-gray-400 mt-2">
            What&apos;s new in AgenticMail. Follow us on{' '}
            <a href="https://x.com/agenticmail" className="text-blue-400 hover:underline" target="_blank" rel="noopener">
              Twitter/X
            </a>{' '}
            for announcements.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-12">
            {releases.map((release, i) => (
              <div key={release.version} className="relative pl-12">
                {/* Dot */}
                <div className={`absolute left-[12px] top-[6px] w-[16px] h-[16px] rounded-full border-2 ${
                  i === 0 ? 'bg-indigo-500 border-indigo-400' : 'bg-gray-700 border-gray-600'
                }`} />

                {/* Content */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-lg font-bold text-white">
                      v{release.version}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[release.tag]}`}>
                      {release.tag}
                    </span>
                    <span className="text-sm text-gray-500">{release.date}</span>
                  </div>

                  <h3 className="text-xl font-semibold mt-2 text-gray-100">
                    {release.title}
                  </h3>

                  <ul className="mt-4 space-y-2">
                    {release.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-2 text-gray-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  {release.details && (
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <ul className="space-y-1.5 text-sm text-gray-400">
                        {release.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <span className="text-gray-600">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex gap-3 text-sm">
                    <a
                      href={`https://github.com/agenticmail/agenticmail/releases/tag/v${release.version}`}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub Release →
                    </a>
                    <a
                      href={`https://www.npmjs.com/package/agenticmail/v/${release.version}`}
                      className="text-gray-400 hover:text-white transition-colors"
                      target="_blank"
                      rel="noopener"
                    >
                      npm →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        <p>
          <code className="text-gray-400">npm install -g agenticmail</code>
        </p>
      </div>
    </div>
  );
}
