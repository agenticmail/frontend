'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const beforeLines = [
  { text: 'You: Send an email to john@company.com', color: 'text-gray-300' },
  { text: '', color: '' },
  { text: 'Agent: I don\'t have the ability to send emails.', color: 'text-accent-red' },
  { text: '       I can help you draft one, but you\'ll need', color: 'text-accent-red' },
  { text: '       to send it yourself through your email client.', color: 'text-accent-red' },
  { text: '', color: '' },
  { text: 'You: Check if anyone replied to my proposal', color: 'text-gray-300' },
  { text: '', color: '' },
  { text: 'Agent: I\'m sorry, I don\'t have access to your', color: 'text-accent-red' },
  { text: '       email inbox. You\'ll need to check manually.', color: 'text-accent-red' },
];

const afterLines = [
  { text: 'You: Send an email to john@company.com', color: 'text-gray-300' },
  { text: '', color: '' },
  { text: 'Agent: ✓ Email sent to john@company.com', color: 'text-accent-green' },
  { text: '       Subject: "Q2 Partnership Proposal"', color: 'text-accent-green' },
  { text: '       Outbound guard: PASSED (low risk)', color: 'text-gray-500' },
  { text: '', color: '' },
  { text: 'You: Check if anyone replied to my proposal', color: 'text-gray-300' },
  { text: '', color: '' },
  { text: 'Agent: ✓ 2 replies found:', color: 'text-accent-green' },
  { text: '       • John (2h ago): "Looks great, let\'s discuss"', color: 'text-accent-green' },
  { text: '       • Sarah (45m ago): "Adding the team to CC"', color: 'text-accent-green' },
  { text: '       I\'ve drafted a follow-up. Send it?', color: 'text-accent' },
];

function Terminal({ title, lines, borderColor, icon }: { title: string; lines: typeof beforeLines; borderColor: string; icon: React.ReactNode }) {
  return (
    <div className={`rounded-xl border ${borderColor} bg-dark-100 overflow-hidden h-full`}>
      <div className="flex items-center gap-2 px-4 py-3 bg-dark-200 border-b border-dark-300">
        <div className="w-3 h-3 rounded-full bg-accent-red/80" />
        <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
        <div className="w-3 h-3 rounded-full bg-accent-green/80" />
        <span className="ml-2 text-xs text-gray-500 font-mono flex items-center gap-1.5">
          {icon}
          {title}
        </span>
      </div>
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={line.color || 'h-3'}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function BeforeAfter() {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            See the <span className="gradient-text">difference</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Without AgenticMail, your AI agent is stuck drafting messages it can never send.
            With it, your agent handles the full email lifecycle.
          </p>
        </motion.div>

        {/* Mobile: tabs */}
        <div className="sm:hidden mb-4">
          <div className="flex rounded-lg border border-dark-300 bg-dark-200 overflow-hidden">
            <button
              onClick={() => setActiveTab('before')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'before' ? 'bg-accent-red/20 text-accent-red' : 'text-gray-400'}`}
            >
              Without AgenticMail
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${activeTab === 'after' ? 'bg-accent-green/20 text-accent-green' : 'text-gray-400'}`}
            >
              With AgenticMail
            </button>
          </div>
          {activeTab === 'before' ? (
            <Terminal
              title="OpenClaw"
              lines={beforeLines}
              borderColor="border-accent-red/30"
              icon={<svg className="w-3 h-3 text-accent-red" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
            />
          ) : (
            <Terminal
              title="OpenClaw + AgenticMail"
              lines={afterLines}
              borderColor="border-accent-green/30"
              icon={<svg className="w-3 h-3 text-accent-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            />
          )}
        </div>

        {/* Desktop: side by side */}
        <div className="hidden sm:grid grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-red">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Without AgenticMail
              </span>
            </div>
            <Terminal
              title="OpenClaw"
              lines={beforeLines}
              borderColor="border-accent-red/30"
              icon={<svg className="w-3 h-3 text-accent-red" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 1, x: 0 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-green">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                With AgenticMail
              </span>
            </div>
            <Terminal
              title="OpenClaw + AgenticMail"
              lines={afterLines}
              borderColor="border-accent-green/30"
              icon={<svg className="w-3 h-3 text-accent-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
