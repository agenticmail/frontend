'use client';

import { motion } from 'framer-motion';

const EnvelopeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

const NetworkIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
  </svg>
);

const CogIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const icons = [EnvelopeIcon, ChatIcon, NetworkIcon, ShieldIcon, FolderIcon, CogIcon];
const iconColors = [
  'text-accent',
  'text-accent-green',
  'text-accent-purple',
  'text-accent-orange',
  'text-yellow-400',
  'text-pink-400',
];

const features = [
  {
    title: 'Email',
    description: 'Send, receive, reply, forward, search & organize. Full IMAP/SMTP with relay and domain modes.',
    items: ['Send & receive', 'Reply & forward', 'Search & filter', 'Attachments'],
  },
  {
    title: 'SMS',
    description: 'Send and receive SMS via Google Voice integration. Give your agents a phone number.',
    items: ['Google Voice', 'Send & receive', 'Conversation threads', 'Number management'],
  },
  {
    title: 'Multi-Agent',
    description: 'Coordinate between agents with call_agent, assign_task, and message_agent primitives.',
    items: ['call_agent', 'assign_task', 'message_agent', 'Agent directory'],
  },
  {
    title: 'Security',
    description: 'Outbound guard scans for PII & credentials. Blocks HIGH severity, requires human approval.',
    items: ['PII detection', 'Credential scanning', 'Spam scoring', 'Human-in-the-loop'],
  },
  {
    title: 'Organization',
    description: 'Folders, tags, rules, templates, and signatures. Keep your agent\'s inbox structured.',
    items: ['Folders & tags', 'Auto-rules', 'Templates', 'Signatures'],
  },
  {
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
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Everything your agents <span className="gradient-text">need</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            A complete communication stack built specifically for AI agents.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={f.title}
                variants={{
                  hidden: { opacity: 1, y: 0 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{
                  scale: 1.03,
                  borderColor: 'rgba(88,166,255,0.3)',
                  boxShadow: '0 0 30px rgba(88,166,255,0.06)',
                  transition: { duration: 0.2 },
                }}
                className="rounded-xl border border-dark-300 bg-dark p-6 transition-colors group cursor-default"
              >
                <div className={`w-10 h-10 rounded-lg bg-dark-200 border border-dark-300 flex items-center justify-center mb-4 ${iconColors[i]} group-hover:border-accent/30 transition-colors`}>
                  <Icon />
                </div>
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
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
