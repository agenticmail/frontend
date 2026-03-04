'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    num: '01',
    title: 'Run one command',
    desc: 'npx @agenticmail/enterprise — interactive wizard sets up your database, admin account, and dashboard. Use free Supabase Postgres or local SQLite.',
    code: 'npx @agenticmail/enterprise',
    color: 'text-accent',
  },
  {
    num: '02',
    title: 'Create your agents',
    desc: 'Pick from 51 personality templates — Sales Rep, Developer, Executive Assistant, and more. Each agent gets their own email, tools, permissions, and soul.',
    code: '# 51 soul templates across 14 categories',
    color: 'text-accent-purple',
  },
  {
    num: '03',
    title: 'They go to work',
    desc: 'Agents clock in, check email, respond to messages, attend meetings, and collaborate — all with DLP scanning, guardrails, and full audit trails.',
    code: '# Agents operate autonomously with oversight',
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
            No complex configuration. No YAML files. The wizard handles everything.
          </p>
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
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{step.desc}</p>
              <div className="font-mono text-xs text-gray-500 bg-dark-200/50 rounded-lg px-3 py-2">
                {step.code}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Database options callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 p-5 rounded-xl border border-dark-300/30 bg-dark-100/30 text-center"
        >
          <p className="text-sm text-gray-400">
            <span className="text-white font-medium">10 database backends supported:</span>{' '}
            PostgreSQL · Supabase (free tier) · Neon · MySQL · SQLite · MongoDB · DynamoDB · Turso · PlanetScale · CockroachDB
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Connection strings are auto-optimized — pooler detection, transaction mode switching, and direct URLs for migrations all happen automatically.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
