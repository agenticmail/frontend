'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '📧',
    title: 'Email',
    description: 'Send, receive, reply, forward, search & organize. Full IMAP/SMTP with relay and domain modes.',
    items: ['Send & receive', 'Reply & forward', 'Search & filter', 'Attachments'],
  },
  {
    icon: '💬',
    title: 'SMS',
    description: 'Send and receive SMS via Google Voice integration. Give your agents a phone number.',
    items: ['Google Voice', 'Send & receive', 'Conversation threads', 'Number management'],
  },
  {
    icon: '🤖',
    title: 'Multi-Agent',
    description: 'Coordinate between agents with call_agent, assign_task, and message_agent primitives.',
    items: ['call_agent', 'assign_task', 'message_agent', 'Agent directory'],
  },
  {
    icon: '🛡️',
    title: 'Security',
    description: 'Outbound guard scans for PII & credentials. Blocks HIGH severity, requires human approval.',
    items: ['PII detection', 'Credential scanning', 'Spam scoring', 'Human-in-the-loop'],
  },
  {
    icon: '📁',
    title: 'Organization',
    description: 'Folders, tags, rules, templates, and signatures. Keep your agent\'s inbox structured.',
    items: ['Folders & tags', 'Auto-rules', 'Templates', 'Signatures'],
  },
  {
    icon: '⚙️',
    title: 'Setup',
    description: 'Relay mode for quick start, domain mode for production. Cloudflare DNS automation built in.',
    items: ['Relay mode', 'Domain mode', 'Cloudflare DNS', 'One command setup'],
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-100/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Everything your agents <span className="gradient-text">need</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A complete communication stack built specifically for AI agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 1, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-dark-300 bg-dark p-6 hover:border-dark-400 transition-colors group"
            >
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold mb-2 text-white">{f.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{f.description}</p>
              <div className="flex flex-wrap gap-2">
                {f.items.map((item) => (
                  <span key={item} className="text-xs px-2.5 py-1 rounded-md bg-dark-200 text-gray-400 border border-dark-300">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
