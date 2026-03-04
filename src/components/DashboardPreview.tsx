'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const pages = [
  { name: 'Agents', desc: 'Create, configure, and monitor AI agents with 51 personality templates' },
  { name: 'Workforce', desc: 'Shifts, schedules, on-call rotations, capacity planning, clock records' },
  { name: 'DLP', desc: '7 enterprise rule packs (53 rules) — PII, credentials, financial, healthcare, GDPR, IP, agent safety' },
  { name: 'Compliance', desc: 'SOC 2 Type II, GDPR, SOX, incident reports — full HTML export for auditors' },
  { name: 'Task Pipeline', desc: 'Visual node-based task flow with real-time SSE streaming' },
  { name: 'Knowledge', desc: 'Document ingestion, BM25F search, RAG retrieval, agent contributions' },
  { name: 'Vault', desc: 'Encrypted credential storage, API keys, OAuth tokens, org-scoped' },
  { name: 'Journal', desc: 'Every agent action logged with before/after state and rollback capability' },
];

export function DashboardPreview() {
  const [active, setActive] = useState(0);

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            28 dashboard pages. <span className="gradient-text">23 agent detail tabs.</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A full admin control plane for your AI workforce — not a chatbot wrapper.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden"
        >
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-dark-300 bg-dark-200/50">
            {pages.map((p, i) => (
              <button
                key={p.name}
                onClick={() => setActive(i)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  i === active
                    ? 'text-white border-accent bg-dark-100/50'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8 min-h-[280px] flex items-center justify-center">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center max-w-xl"
            >
              <h3 className="text-xl font-bold text-white mb-3">{pages[active].name}</h3>
              <p className="text-gray-400 leading-relaxed">{pages[active].desc}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {active === 0 && ['Create', 'Configure', 'Start/Stop', 'Health', 'Budget', 'Permissions', 'Memory', 'Skills'].map(t => (
                  <span key={t} className="px-2.5 py-1 text-xs rounded-md bg-dark-200 text-gray-400 border border-dark-300/50">{t}</span>
                ))}
                {active === 2 && ['PII Protection', 'Credentials', 'Financial', 'Healthcare', 'GDPR', 'IP', 'Agent Safety'].map(t => (
                  <span key={t} className="px-2.5 py-1 text-xs rounded-md bg-dark-200 text-gray-400 border border-dark-300/50">{t}</span>
                ))}
                {active === 3 && ['SOC 2 Type II', 'GDPR DSAR', 'SOX Audit', 'Incident Report', 'Access Review'].map(t => (
                  <span key={t} className="px-2.5 py-1 text-xs rounded-md bg-dark-200 text-gray-400 border border-dark-300/50">{t}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Page grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {['Audit Log', 'Activity', 'Guardrails', 'Approvals', 'Settings', 'Users', 'Organizations', 'Roles',
            'Messages', 'Memory Transfer', 'Org Chart', 'Domain Status', 'Database Access', 'Skill Connections', 'Community Skills', 'Login/Setup Wizard'
          ].map((p) => (
            <div key={p} className="px-3 py-2 text-xs text-gray-500 rounded-lg border border-dark-300/30 bg-dark-100/30 text-center">
              {p}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          + 49 built-in documentation pages accessible from every dashboard screen
        </p>
      </div>
    </section>
  );
}
