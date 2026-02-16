'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

const codeLines = [
  '# Install and start AgenticMail',
  'npx agenticmail',
  '',
  '# Or with npm',
  'npm install -g agenticmail',
  'agenticmail start',
  '',
  '# MCP mode (for Claude Desktop, etc.)',
  'agenticmail mcp',
];

function TypingCode() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor(v => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!inView) return;
    let lineIdx = 0;
    const timer = setInterval(() => {
      if (lineIdx < codeLines.length) {
        setDisplayedLines(prev => [...prev, codeLines[lineIdx]]);
        lineIdx++;
      } else {
        clearInterval(timer);
      }
    }, 200);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <pre ref={ref} className="p-6 font-mono text-sm text-gray-300 overflow-x-auto whitespace-pre">
      {displayedLines.map((line, i) => (
        <div key={i} className={line.startsWith('#') ? 'text-gray-500' : ''}>
          {line}
        </div>
      ))}
      {displayedLines.length < codeLines.length && (
        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity text-accent`}>▌</span>
      )}
    </pre>
  );
}

export function Quickstart() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx agenticmail');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="quickstart" className="py-24 px-4 sm:px-6 lg:px-8 bg-dark-100/50">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Up and running in <span className="gradient-text">one command</span>
          </h2>
          <p className="text-gray-400">No complex setup. No config files. Just run it.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          whileHover={{ boxShadow: '0 0 60px rgba(88,166,255,0.06)', borderColor: 'rgba(88,166,255,0.2)' }}
          className="rounded-xl border border-dark-300 bg-dark overflow-hidden shadow-2xl shadow-black/40"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-dark-200 border-b border-dark-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent-red/80" />
              <div className="w-3 h-3 rounded-full bg-accent-orange/80" />
              <div className="w-3 h-3 rounded-full bg-accent-green/80" />
              <span className="ml-2 text-xs text-gray-500 font-mono">quickstart</span>
            </div>
            <motion.button
              onClick={handleCopy}
              className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 rounded-md hover:bg-dark-300"
              whileTap={{ scale: 0.9 }}
            >
              {copied ? (
                <span className="text-accent-green flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Copied!
                </span>
              ) : 'Copy'}
            </motion.button>
          </div>
          <TypingCode />
        </motion.div>
      </div>
    </section>
  );
}
