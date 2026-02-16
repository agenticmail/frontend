'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type Line = { text: string; color: string };

interface Scenario {
  id: string;
  label: string;
  shortLabel: string;
  before: Line[];
  after: Line[];
}

const scenarios: Scenario[] = [
  {
    id: 'email',
    label: 'Send & Receive Email',
    shortLabel: 'Email',
    before: [
      { text: 'You: Send an email to john@company.com', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: I can\'t send emails. I can draft one', color: 'text-accent-red' },
      { text: '          but you\'ll need to send it yourself.', color: 'text-accent-red' },
      { text: '', color: '' },
      { text: 'You: Check if anyone replied to my proposal', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: I don\'t have access to your inbox.', color: 'text-accent-red' },
      { text: '          You\'ll need to check manually.', color: 'text-accent-red' },
    ],
    after: [
      { text: 'You: Send an email to john@company.com', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ Email sent to john@company.com', color: 'text-accent-green' },
      { text: '          Subject: "Q2 Partnership Proposal"', color: 'text-accent-green' },
      { text: '          Outbound guard: PASSED (low risk)', color: 'text-gray-500' },
      { text: '', color: '' },
      { text: 'You: Check if anyone replied', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ 2 replies found:', color: 'text-accent-green' },
      { text: '  • John (2h ago): "Looks great, let\'s discuss"', color: 'text-accent-green' },
      { text: '  • Sarah (45m ago): "Adding the team"', color: 'text-accent-green' },
      { text: '  I\'ve drafted a follow-up. Send it?', color: 'text-accent' },
    ],
  },
  {
    id: 'attachments',
    label: 'Create & Send Attachments',
    shortLabel: 'Attachments',
    before: [
      { text: 'You: Write a petition letter and send it to', color: 'text-gray-300' },
      { text: '     the city council as a PDF', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: I\'ve drafted the petition letter.', color: 'text-accent-red' },
      { text: '          However, I can\'t create PDFs or send', color: 'text-accent-red' },
      { text: '          emails. You\'ll need to:', color: 'text-accent-red' },
      { text: '          1. Copy this text into a doc', color: 'text-accent-red' },
      { text: '          2. Export as PDF', color: 'text-accent-red' },
      { text: '          3. Attach and send it yourself', color: 'text-accent-red' },
    ],
    after: [
      { text: 'You: Write a petition letter and send it to', color: 'text-gray-300' },
      { text: '     the city council as a PDF', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ Petition drafted (1,247 words)', color: 'text-accent-green' },
      { text: '          ✓ Converted to PDF: petition.pdf', color: 'text-accent-green' },
      { text: '          ✓ Email sent to council@city.gov', color: 'text-accent-green' },
      { text: '          📎 Attached: petition.pdf (42 KB)', color: 'text-accent' },
      { text: '          Outbound guard: PASSED', color: 'text-gray-500' },
      { text: '', color: '' },
      { text: '          Confirmation received from', color: 'text-accent-green' },
      { text: '          council@city.gov: "Auto-reply:', color: 'text-accent-green' },
      { text: '          Your petition has been logged."', color: 'text-accent-green' },
    ],
  },
  {
    id: 'documents',
    label: 'Draft Documents & Email',
    shortLabel: 'Documents',
    before: [
      { text: 'You: Create an NDA for the freelancer and', color: 'text-gray-300' },
      { text: '     email it as a DOCX', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: Here\'s a draft NDA. I\'ve written it', color: 'text-accent-red' },
      { text: '          as text below. You\'ll need to format', color: 'text-accent-red' },
      { text: '          it in Word and email it yourself.', color: 'text-accent-red' },
      { text: '', color: '' },
      { text: '          [2 pages of text you need to copy]', color: 'text-gray-500' },
    ],
    after: [
      { text: 'You: Create an NDA for the freelancer and', color: 'text-gray-300' },
      { text: '     email it as a DOCX', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ NDA created: freelancer-nda.docx', color: 'text-accent-green' },
      { text: '          ✓ Sent to alex@freelancer.dev', color: 'text-accent-green' },
      { text: '          📎 Attached: freelancer-nda.docx', color: 'text-accent' },
      { text: '          Subject: "NDA for Project Alpha"', color: 'text-accent-green' },
      { text: '', color: '' },
      { text: 'You: Did they sign it?', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ Alex replied 20 min ago:', color: 'text-accent-green' },
      { text: '          "Signed and attached." I\'ve saved', color: 'text-accent-green' },
      { text: '          the signed copy to your files.', color: 'text-accent' },
    ],
  },
  {
    id: 'multiagent',
    label: 'Multi-Agent Coordination',
    shortLabel: 'Multi-Agent',
    before: [
      { text: 'You: Have the research agent find competitor', color: 'text-gray-300' },
      { text: '     pricing then email me a summary', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: I can research competitors, but I', color: 'text-accent-red' },
      { text: '          can\'t coordinate with other agents', color: 'text-accent-red' },
      { text: '          or email you the results. I\'ll just', color: 'text-accent-red' },
      { text: '          paste the findings here instead.', color: 'text-accent-red' },
    ],
    after: [
      { text: 'You: Have the research agent find competitor', color: 'text-gray-300' },
      { text: '     pricing then email me a summary', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ Task assigned to research agent', color: 'text-accent-green' },
      { text: '          ✓ Research complete (12 competitors)', color: 'text-accent-green' },
      { text: '          ✓ Summary emailed to you@company.com', color: 'text-accent-green' },
      { text: '          📎 Attached: competitor-analysis.pdf', color: 'text-accent' },
      { text: '          Subject: "Competitor Pricing Report"', color: 'text-accent-green' },
      { text: '', color: '' },
      { text: '          The research agent also flagged 3', color: 'text-gray-400' },
      { text: '          competitors with recent price drops.', color: 'text-gray-400' },
    ],
  },
];

function Terminal({ title, lines, borderColor, icon }: { title: string; lines: Line[]; borderColor: string; icon: React.ReactNode }) {
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

const redIcon = <svg className="w-3 h-3 text-accent-red" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const greenIcon = <svg className="w-3 h-3 text-accent-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;

export function BeforeAfter() {
  const [activeScenario, setActiveScenario] = useState(0);
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('before');
  const scenario = scenarios[activeScenario];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            See the <span className="gradient-text">difference</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Without AgenticMail, your AI is stuck drafting things it can never send.
            With it, OpenClaw handles the full lifecycle — create, send, receive, confirm.
          </p>
        </motion.div>

        {/* Scenario tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveScenario(i); setActiveTab('before'); }}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all border ${
                activeScenario === i
                  ? 'bg-accent/10 border-accent/40 text-white'
                  : 'bg-dark-200 border-dark-300 text-gray-400 hover:text-white hover:border-gray-500'
              }`}
            >
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.shortLabel}</span>
            </button>
          ))}
        </div>

        {/* Mobile: tabs for before/after */}
        <div className="sm:hidden mb-4">
          <div className="flex rounded-lg border border-dark-300 bg-dark-200 overflow-hidden mb-4">
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
          <motion.div key={`${scenario.id}-${activeTab}`} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }}>
            {activeTab === 'before' ? (
              <Terminal title="OpenClaw" lines={scenario.before} borderColor="border-accent-red/30" icon={redIcon} />
            ) : (
              <Terminal title="OpenClaw + AgenticMail" lines={scenario.after} borderColor="border-accent-green/30" icon={greenIcon} />
            )}
          </motion.div>
        </div>

        {/* Desktop: side by side */}
        <motion.div key={scenario.id} initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} className="hidden sm:grid grid-cols-2 gap-6">
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-red">
                {redIcon} Without AgenticMail
              </span>
            </div>
            <Terminal title="OpenClaw" lines={scenario.before} borderColor="border-accent-red/30" icon={redIcon} />
          </div>
          <div>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-green">
                {greenIcon} With AgenticMail
              </span>
            </div>
            <Terminal title="OpenClaw + AgenticMail" lines={scenario.after} borderColor="border-accent-green/30" icon={greenIcon} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
