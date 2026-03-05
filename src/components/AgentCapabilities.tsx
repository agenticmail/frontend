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
    title: '🎙️ Voice & Live Meetings',
    desc: 'Agents join Google Meet calls and speak like real humans using ElevenLabs TTS. They listen to the conversation, understand context, and respond with natural voice — in real-time.',
    items: ['Google Meet join', 'Real-time voice (TTS)', 'Listen & respond', 'Virtual audio device', 'Meeting transcription', 'Multi-agent meetings'],
    gradient: 'from-orange-500/10 to-orange-600/5',
    border: 'border-orange-500/30',
    featured: true,
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
              className={`p-5 rounded-xl border ${cap.border} bg-gradient-to-br ${cap.gradient} hover:border-opacity-40 transition-all ${'featured' in cap && cap.featured ? 'ring-1 ring-orange-500/20' : ''}`}
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

        {/* Voice & Meetings spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-xl border-2 border-orange-500/30 bg-gradient-to-r from-orange-500/5 via-dark-100/50 to-amber-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            INDUSTRY FIRST
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">🎙️ Agents join Google Meet and speak like humans</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your AI agents don&apos;t just send emails — they <strong className="text-white">join live Google Meet calls</strong>, listen to the conversation in real-time,
                and respond with natural human-like voice powered by ElevenLabs TTS. They participate in standups, client calls, team syncs, and interviews
                just like any other team member. Multiple agents can join the same call and collaborate.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                {['Join via browser', 'ElevenLabs voice', 'Real-time listening', 'Context-aware responses', 'Multi-agent calls', 'Meeting notes'].map(tag => (
                  <span key={tag} className="text-[11px] text-orange-400/80 bg-orange-500/10 px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
            <div className="font-mono text-xs text-gray-400 bg-dark-200/80 rounded-lg px-4 py-3 whitespace-pre shrink-0 leading-relaxed">
              <span className="text-orange-400">Agent Fola</span> joined the meeting{'\n'}
              <span className="text-gray-500">Listening...</span>{'\n'}
              <span className="text-orange-400">Fola:</span> &quot;Based on last week&apos;s{'\n'}
              metrics, I&apos;d recommend we{'\n'}
              focus on retention this sprint.&quot;{'\n'}
              <span className="text-green-500">🎤 Speaking via ElevenLabs TTS</span>
            </div>
          </div>
        </motion.div>

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
