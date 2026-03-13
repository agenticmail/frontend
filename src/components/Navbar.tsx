'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Features', href: '#features' },
    { label: 'Trading', href: '#trading' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Open Source', href: '#open-source' },
    { label: 'Docs', href: 'https://github.com/agenticmail/enterprise#readme', external: true },
    { label: 'GitHub', href: 'https://github.com/agenticmail/enterprise', external: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-xl border-b border-dark-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="text-2xl">🎀</span>
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-lg text-white group-hover:text-accent transition-colors">AgenticMail</span>
              <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase -mt-0.5">Enterprise</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? '_blank' : undefined}
                rel={l.external ? 'noopener noreferrer' : undefined}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://github.com/agenticmail/enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors border border-dark-300"
            >
              Get Started
            </a>
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-400 hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
