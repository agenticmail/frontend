'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

type Line = { text: string; color: string };

interface Scenario {
  id: string;
  label: string;
  shortLabel: string;
  before: Line[];
  after: Line[];
  details: {
    title: string;
    points: string[];
  };
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
    details: {
      title: 'Full Email Lifecycle',
      points: [
        'Send emails with subject, body, CC/BCC, and custom headers',
        'Receive and read incoming emails in real-time via IMAP IDLE',
        'Reply and forward with proper threading (In-Reply-To headers)',
        'Search inbox by sender, subject, date range, or body text',
        'Outbound guard scans every email for PII and credentials before sending',
        'All blocked emails require human approval — no exceptions',
      ],
    },
  },
  {
    id: 'documents',
    label: 'Documents & Attachments',
    shortLabel: 'Documents',
    before: [
      { text: 'You: Write a petition, save as PDF, create an', color: 'text-gray-300' },
      { text: '     NDA as DOCX, and email both to the lawyer', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: I\'ve drafted both documents as text.', color: 'text-accent-red' },
      { text: '          However, I can\'t:', color: 'text-accent-red' },
      { text: '          ✗ Create PDF or DOCX files', color: 'text-accent-red' },
      { text: '          ✗ Attach files to emails', color: 'text-accent-red' },
      { text: '          ✗ Send any emails', color: 'text-accent-red' },
      { text: '', color: '' },
      { text: '          You\'ll need to copy these drafts,', color: 'text-accent-red' },
      { text: '          format them, export, and send manually.', color: 'text-accent-red' },
    ],
    after: [
      { text: 'You: Write a petition, save as PDF, create an', color: 'text-gray-300' },
      { text: '     NDA as DOCX, and email both to the lawyer', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: 'OpenClaw: ✓ Petition drafted (1,247 words)', color: 'text-accent-green' },
      { text: '          ✓ Exported to petition.pdf (42 KB)', color: 'text-accent-green' },
      { text: '          ✓ NDA drafted (3 pages)', color: 'text-accent-green' },
      { text: '          ✓ Exported to nda-contract.docx', color: 'text-accent-green' },
      { text: '          ✓ Email sent to lawyer@firm.com', color: 'text-accent-green' },
      { text: '          📎 petition.pdf, nda-contract.docx', color: 'text-accent' },
      { text: '', color: '' },
      { text: '          ✓ Delivery confirmed. Lawyer replied:', color: 'text-accent-green' },
      { text: '          "Received. Reviewing now."', color: 'text-accent-green' },
    ],
    details: {
      title: 'Create, Attach & Confirm',
      points: [
        'Create documents (PDF, DOCX, spreadsheets) and attach them to outgoing emails',
        'Multiple attachments per email — mix file types freely',
        'Receive attachments from incoming emails and save them locally',
        'Confirm delivery by checking for reply/read receipts',
        'Templates with variable substitution for recurring documents',
        'Drafts system — save, edit, and send when ready',
      ],
    },
  },
  {
    id: 'multiagent',
    label: 'Multi-Agent Orchestration',
    shortLabel: 'Multi-Agent',
    before: [
      { text: 'You: Have 3 agents research competitors, write', color: 'text-gray-300' },
      { text: '     a report, and email the team', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: '# OpenClaw sessions_spawn:', color: 'text-gray-500' },
      { text: 'OpenClaw: Spawning research sub-agent...', color: 'text-yellow-400' },
      { text: '  ⚠ Full context duplicated (48K tokens)', color: 'text-accent-orange' },
      { text: '  ⚠ Sub-agent crashed mid-task', color: 'text-accent-red' },
      { text: '  ⚠ All progress lost — no recovery', color: 'text-accent-red' },
      { text: '  ⚠ Can\'t coordinate between sub-agents', color: 'text-accent-red' },
      { text: '  ⚠ Can\'t email results — no email access', color: 'text-accent-red' },
      { text: '', color: '' },
      { text: '  Tokens: ~127K | Cost: $0.38 | FAILED', color: 'text-accent-red' },
    ],
    after: [
      { text: 'You: Have 3 agents research competitors, write', color: 'text-gray-300' },
      { text: '     a report, and email the team', color: 'text-gray-300' },
      { text: '', color: '' },
      { text: '# AgenticMail call_agent + task queue:', color: 'text-gray-500' },
      { text: 'OpenClaw: ✓ Task created: "research-competitors"', color: 'text-accent-green' },
      { text: '  → researcher agent claimed task', color: 'text-accent-green' },
      { text: '  → researcher emailed writer: "Data ready"', color: 'text-accent-green' },
      { text: '  → writer agent claimed: "write-report"', color: 'text-accent-green' },
      { text: '  → writer emailed: report.pdf attached', color: 'text-accent-green' },
      { text: '  ✓ Email sent to team@company.com (CC: you)', color: 'text-accent-green' },
      { text: '', color: '' },
      { text: '  Tokens: ~22K (83% less) | Cost: $0.07', color: 'text-accent' },
      { text: '  Result: SUCCESS', color: 'text-accent-green' },
    ],
    details: {
      title: 'Task Queue, Agent Email & Crash Recovery',
      points: [
        'call_agent auto-detects complexity: "light" (minimal context, fast), "standard" (web tools), or "full" (all coordination)',
        'Task queue with durable state: assign_task → agent claims → submits result as JSON',
        'If an agent crashes, the task survives in the queue — another agent can claim and complete it',
        'Agents communicate via real email: CC each other, forward findings, reply to threads',
        'Agent directory lets agents discover each other by name and role',
        'Dynamic timeouts auto-scaled by task complexity — no more arbitrary 10-min limits',
        '80-90% fewer tokens than sessions_spawn — only the task prompt is sent, not the full conversation',
        'Async mode for long-running tasks: agent works for hours, emails you when done',
      ],
    },
  },
  {
    id: 'callagent',
    label: 'call_agent vs sessions_spawn',
    shortLabel: 'call_agent',
    before: [
      { text: '# OpenClaw sessions_spawn internals:', color: 'text-gray-500' },
      { text: '', color: '' },
      { text: 'spawn("research competitors")', color: 'text-gray-300' },
      { text: '  → Copies FULL parent context (48K tokens)', color: 'text-accent-orange' },
      { text: '  → Loads ALL tools (63) even if unused', color: 'text-accent-orange' },
      { text: '  → Fixed 10 min timeout', color: 'text-accent-orange' },
      { text: '  → No mode detection', color: 'text-accent-orange' },
      { text: '  → No crash recovery', color: 'text-accent-orange' },
      { text: '  → Result returned inline (or lost)', color: 'text-accent-orange' },
      { text: '', color: '' },
      { text: '  Session timed out after 10 minutes.', color: 'text-accent-red' },
      { text: '  All work lost. Starting over...', color: 'text-accent-red' },
      { text: '', color: '' },
      { text: '  Tokens: ~127,000 | Cost: ~$0.38', color: 'text-accent-red' },
    ],
    after: [
      { text: '# AgenticMail call_agent internals:', color: 'text-gray-500' },
      { text: '', color: '' },
      { text: 'call_agent("researcher", "research competitors")', color: 'text-gray-300' },
      { text: '  → Auto mode: "light" (simple task)', color: 'text-accent-green' },
      { text: '  → Sends ONLY task prompt (200 tokens)', color: 'text-accent-green' },
      { text: '  → Loads 2 tools: web_search, web_fetch', color: 'text-accent-green' },
      { text: '  → Dynamic timeout: 180s (auto-scaled)', color: 'text-accent-green' },
      { text: '  → Task persists if agent crashes', color: 'text-accent-green' },
      { text: '  → Result delivered via email or JSON', color: 'text-accent-green' },
      { text: '', color: '' },
      { text: '  ✓ Complete. 12 competitors analyzed.', color: 'text-accent-green' },
      { text: '  ✓ Result saved + emailed to you.', color: 'text-accent-green' },
      { text: '', color: '' },
      { text: '  Tokens: ~18,000 (86% less) | Cost: ~$0.05', color: 'text-accent' },
    ],
    details: {
      title: 'Why call_agent Replaces sessions_spawn',
      points: [
        'sessions_spawn copies the entire parent conversation to the sub-agent — massive token waste',
        'call_agent sends only the task description — 80-90% fewer tokens on every call',
        'Auto mode detection: "light" for quick lookups, "standard" for web research, "full" for multi-step coordination',
        'Dynamic timeouts scale with task complexity instead of a fixed 10-minute wall',
        'Durable task queue: if the agent session crashes, the task stays pending and can be retried or claimed by another agent',
        'Async mode: fire-and-forget for long tasks — the agent emails you the result when done, even hours later',
        'Runtime tool discovery: only loads the tools the sub-agent actually needs',
        'Built-in auto-compact: sub-agents can run for hours without context overflow',
      ],
    },
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
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');
  const [desktopHighlight, setDesktopHighlight] = useState<'before' | 'after'>('after');
  const scenario = scenarios[activeScenario];
  // Mobile uses activeTab, desktop uses desktopHighlight
  // Both default to 'after' so SSR is safe
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const showEnabled = isMobile ? activeTab === 'after' : desktopHighlight === 'after';

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
            With it, OpenClaw handles the full lifecycle — create, send, receive, coordinate.
          </p>
        </motion.div>

        {/* Scenario tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {scenarios.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActiveScenario(i); setActiveTab('after'); setDesktopHighlight('after'); }}
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
              Without
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
          <div className={`cursor-pointer transition-opacity ${desktopHighlight === 'before' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`} onClick={() => setDesktopHighlight('before')}>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-red">
                {redIcon} Without AgenticMail
              </span>
            </div>
            <Terminal title="OpenClaw" lines={scenario.before} borderColor="border-accent-red/30" icon={redIcon} />
          </div>
          <div className={`cursor-pointer transition-opacity ${desktopHighlight === 'after' ? 'opacity-100' : 'opacity-60 hover:opacity-80'}`} onClick={() => setDesktopHighlight('after')}>
            <div className="text-center mb-3">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-green">
                {greenIcon} With AgenticMail
              </span>
            </div>
            <Terminal title="OpenClaw + AgenticMail" lines={scenario.after} borderColor="border-accent-green/30" icon={greenIcon} />
          </div>
        </motion.div>

        {/* Details panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${scenario.id}-${showEnabled}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`mt-8 rounded-xl border ${showEnabled ? 'border-accent-green/30' : 'border-accent-red/30'} bg-dark-100/80 p-6 sm:p-8`}
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
              {showEnabled ? (
                <svg className="w-5 h-5 text-accent-green" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              ) : (
                <svg className="w-5 h-5 text-accent-red" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              )}
              {showEnabled ? scenario.details.title : `Not available without AgenticMail`}
            </h3>
            <ul className="space-y-2.5">
              {scenario.details.points.map((point, i) => (
                <li key={i} className={`flex items-start gap-2.5 text-sm ${showEnabled ? 'text-gray-400' : 'text-gray-600 line-through'}`}>
                  {showEnabled ? (
                    <svg className="w-4 h-4 text-accent-green mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-accent-red mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
