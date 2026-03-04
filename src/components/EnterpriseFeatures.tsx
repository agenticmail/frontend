'use client';

import { motion } from 'framer-motion';

const features = [
  {
    category: 'Governance',
    items: [
      { title: 'Data Loss Prevention', desc: '7 rule packs, 53 pre-built rules. PII, credentials, financial, healthcare, GDPR, IP, agent safety.' },
      { title: 'Guardrails & Anomaly Detection', desc: 'Real-time intervention, rate limits, cost thresholds, pattern matching. Auto-stop on violation.' },
      { title: 'Approval Workflows', desc: 'Human-in-the-loop approval policies with escalation chains and time-based auto-escalation.' },
      { title: 'Action Journal & Rollback', desc: 'Every action journaled with before/after state. Click to rollback any reversible action.' },
    ],
  },
  {
    category: 'Compliance',
    items: [
      { title: 'SOC 2 Type II Reports', desc: 'Full Trust Service Criteria CC1-CC9. Executive summary, risk scoring (A-F), control effectiveness.' },
      { title: '5 Report Types', desc: 'SOC 2, GDPR DSAR, SOX Audit Trail, Incident Report, Access Review. HTML export for auditors.' },
      { title: 'Audit Logging', desc: 'Every mutating API call logged with actor, organization, details. Org-scoped filtering.' },
      { title: 'Data Retention Policies', desc: 'Configurable retention with automated cleanup. Policy templates for common standards.' },
    ],
  },
  {
    category: 'Security',
    items: [
      { title: 'Transport Encryption', desc: 'Optional AES-GCM encryption for all API responses. Every call shows {_enc: "..."} in network tab.' },
      { title: 'Secure Vault', desc: 'Encrypted credential storage. API keys, OAuth tokens, connection strings — all encrypted at rest.' },
      { title: 'Per-Tool Permissions', desc: '5 preset profiles + fine-grained allow/deny per tool. Risk levels and side effect classification.' },
      { title: '2FA, SSO, RBAC', desc: 'TOTP 2FA, Google/Microsoft/GitHub/Okta/SAML SSO. 4 roles: owner, admin, member, viewer.' },
    ],
  },
  {
    category: 'Operations',
    items: [
      { title: 'Workforce Management', desc: 'Shifts, schedules, on-call rotations, capacity planning. Off-duty enforcement via guardrails.' },
      { title: 'Agent Autonomy', desc: 'Clock in/out, morning triage, daily catchup, goal tracking, weekly review. Agents work independently.' },
      { title: 'Multi-Tenant Isolation', desc: 'Internal + external client organizations. Org-scoped data across all pages. Billing per org.' },
      { title: 'Budget Controls', desc: 'Per-agent token and cost limits. Warning thresholds. Hard stops. Cost tracking in real-time.' },
    ],
  },
];

export function EnterpriseFeatures() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Enterprise governance <span className="gradient-text">built in</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Not bolted on. Every feature designed for organizations that need real oversight over their AI agents.
          </p>
        </motion.div>

        <div className="space-y-10">
          {features.map((group, gi) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.1 }}
            >
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 pl-1">{group.category}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {group.items.map((item) => (
                  <div key={item.title} className="p-4 rounded-lg border border-dark-300/30 bg-dark-100/30 hover:border-dark-300/60 transition-colors">
                    <h4 className="text-sm font-semibold text-white mb-1.5">{item.title}</h4>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
