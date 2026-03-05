'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Deploy in one click',
    desc: 'Run the wizard → pick "AgenticMail Cloud" → claim your free subdomain. Your dashboard is live at yourcompany.agenticmail.io in under 2 minutes. No servers, no Docker, no infra.',
    code: 'npx @agenticmail/enterprise\n# → Select "AgenticMail Cloud"\n# → yourcompany.agenticmail.io is live ✓',
    color: 'text-accent',
    badge: 'FREE SUBDOMAIN',
  },
  {
    num: '02',
    title: 'Create your agents',
    desc: 'Pick from 51 personality templates — Sales Rep, Developer, Executive Assistant, and more. Each agent gets their own email, tools, permissions, and soul.',
    code: '# 51 soul templates across 14 categories\n# Each agent gets: email, calendar, tools, DLP',
    color: 'text-accent-purple',
  },
  {
    num: '03',
    title: 'They go to work',
    desc: 'Agents clock in, check email, respond to messages, attend meetings, and collaborate — all with DLP scanning, guardrails, and full audit trails.',
    code: '# Agents operate autonomously with oversight\n# SOC 2 compliance reports out of the box',
    color: 'text-accent-green',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            From zero to AI workforce in <span className="gradient-text">5 minutes</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Deploy on our cloud with a free subdomain — or self-host anywhere. Either way, the wizard handles everything.
          </p>
        </motion.div>

        {/* Cloud deploy highlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-5 rounded-xl border-2 border-accent/40 bg-accent/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-accent text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            RECOMMENDED
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">☁️ Cloud Deploy — Free Subdomain</h3>
              <p className="text-sm text-gray-400">
                Get <code className="text-accent bg-accent/10 px-1.5 py-0.5 rounded text-xs">yourcompany.agenticmail.io</code> live
                in under 2 minutes. No servers to manage, no Docker, no ports to open. Everything runs on our infrastructure —
                just configure from the dashboard.
              </p>
            </div>
            <div className="font-mono text-xs text-gray-400 bg-dark-200/80 rounded-lg px-4 py-3 whitespace-pre shrink-0">
              <span className="text-gray-600">$</span> npx @agenticmail/enterprise{'\n'}
              <span className="text-accent">→ Deploy target:</span> AgenticMail Cloud{'\n'}
              <span className="text-accent">→ Subdomain:</span> yourcompany.agenticmail.io{'\n'}
              <span className="text-green-500">✓ Dashboard live!</span>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative p-6 rounded-xl border border-dark-300/50 bg-dark-100/50 hover:border-dark-300 transition-colors group"
            >
              <div className={`text-4xl font-black ${step.color} opacity-20 absolute top-4 right-4`}>{step.num}</div>
              {'badge' in step && step.badge && (
                <span className="text-[9px] font-bold bg-accent/20 text-accent px-2 py-0.5 rounded-full mb-2 inline-block">
                  {step.badge}
                </span>
              )}
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{step.desc}</p>
              <div className="font-mono text-xs text-gray-500 bg-dark-200/50 rounded-lg px-3 py-2 whitespace-pre-line">
                {step.code}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Self-hosted + DB options */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-5 rounded-xl border border-dark-300/30 bg-dark-100/30"
        >
          <p className="text-sm text-gray-400 text-center">
            <span className="text-white font-medium">Prefer self-hosting?</span>{' '}
            Same wizard — just pick a different deploy target. Docker, Railway, Fly.io, Cloudflare Tunnel, or bare metal.
          </p>
          <p className="text-xs text-gray-500 mt-2 text-center">
            <span className="text-white font-medium">10 database backends:</span>{' '}
            PostgreSQL · Supabase (free) · Neon · MySQL · SQLite · MongoDB · DynamoDB · Turso · PlanetScale · CockroachDB
          </p>
        </motion.div>
      </div>
    </section>
  );
}
