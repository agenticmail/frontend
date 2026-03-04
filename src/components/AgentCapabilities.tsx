'use client';

import { motion } from 'framer-motion';

const capabilities = [
  {
    title: 'Real Email & Calendar',
    desc: 'Full Gmail/Outlook integration via OAuth. Agents read, respond, draft, and manage email. Google Calendar for scheduling.',
    items: ['16 Gmail tools', 'Calendar CRUD', 'Signature management', 'Attachment handling'],
    gradient: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
  },
  {
    title: 'Browser & Web',
    desc: 'Full Playwright web automation. Navigate, click, type, screenshot, fill forms, download files.',
    items: ['Page navigation', 'Form filling', 'Screenshots', 'File downloads'],
    gradient: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
  },
  {
    title: 'Messaging Channels',
    desc: 'Telegram, WhatsApp, Google Chat. Agents receive and respond to messages across channels with media support.',
    items: ['Telegram long-polling', 'WhatsApp webhook', 'Google Chat API', 'Image/video/doc support'],
    gradient: 'from-green-500/10 to-green-600/5',
    border: 'border-green-500/20',
  },
  {
    title: 'Voice & Meetings',
    desc: 'Agents join Google Meet with voice (ElevenLabs TTS), listen, and participate through virtual audio.',
    items: ['ElevenLabs TTS', 'Virtual audio device', 'Meeting transcription', 'Browser-based join'],
    gradient: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/20',
  },
  {
    title: 'Shell & Filesystem',
    desc: 'Execute commands, read/write files, search codebases. Full development environment access with sandboxing.',
    items: ['Shell execution', 'File CRUD', 'Glob & grep', 'Code editing'],
    gradient: 'from-red-500/10 to-red-600/5',
    border: 'border-red-500/20',
  },
  {
    title: 'Memory & Knowledge',
    desc: 'DB-backed long-term memory with semantic search. RAG retrieval from knowledge bases. Cross-session continuity.',
    items: ['Long-term memory', 'Semantic search', 'RAG retrieval', 'Knowledge contribution'],
    gradient: 'from-cyan-500/10 to-cyan-600/5',
    border: 'border-cyan-500/20',
  },
];

export function AgentCapabilities() {
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
            Agents that actually <span className="gradient-text">do things</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Not just chat. Real email, real browser, real meetings, real tools. 270+ tools across every category.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-5 rounded-xl border ${cap.border} bg-gradient-to-br ${cap.gradient} hover:border-opacity-40 transition-all`}
            >
              <h3 className="text-base font-semibold text-white mb-2">{cap.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-3">{cap.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {cap.items.map(item => (
                  <span key={item} className="text-[11px] text-gray-500 bg-dark/40 px-2 py-0.5 rounded">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google Workspace callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 p-5 rounded-xl border border-dark-300/30 bg-dark-100/30"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white mb-1">Full Google Workspace Integration</h3>
              <p className="text-sm text-gray-400">13 services: Gmail · Calendar · Drive · Docs · Sheets · Slides · Forms · Meet · Chat · Tasks · Contacts · Maps · Voice</p>
            </div>
            <div className="text-xs text-gray-500 bg-dark-200/50 px-3 py-1.5 rounded-lg font-mono">
              OAuth 2.0 · Auto-refresh tokens
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
