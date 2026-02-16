'use client';

import { motion } from 'framer-motion';

const CpuIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const steps = [
  { label: 'Agent sends email', icon: CpuIcon, color: 'bg-accent/20 text-accent', borderColor: 'border-accent/20' },
  { label: 'Outbound Guard scans', icon: SearchIcon, color: 'bg-accent-purple/20 text-accent-purple', borderColor: 'border-accent-purple/20' },
  { label: 'PII & credential check', icon: ShieldIcon, color: 'bg-accent-orange/20 text-accent-orange', borderColor: 'border-accent-orange/20' },
  { label: 'Risk scoring', icon: ChartIcon, color: 'bg-yellow-500/20 text-yellow-400', borderColor: 'border-yellow-500/20' },
  { label: 'HIGH → blocked', icon: XCircleIcon, color: 'bg-accent-red/20 text-accent-red', borderColor: 'border-accent-red/20' },
  { label: 'LOW → delivered', icon: CheckCircleIcon, color: 'bg-accent-green/20 text-accent-green', borderColor: 'border-accent-green/20' },
];

export function Security() {
  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Security <span className="gradient-text">guardrails</span> built in
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Every outbound message passes through the Outbound Guard. 
            PII and credentials are detected and blocked before they leave.
          </p>
        </motion.div>

        {/* Flow diagram */}
        <div className="flex flex-col items-center gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 1, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: 'easeOut' }}
                className="w-full max-w-md"
              >
                <motion.div
                  className={`flex items-center gap-4 p-4 rounded-xl border border-dark-300 bg-dark-100 ${step.borderColor}`}
                  whileHover={{ scale: 1.02, borderColor: 'rgba(88,166,255,0.3)' }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon />
                  </div>
                  <span className="font-medium text-sm text-gray-300">{step.label}</span>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <motion.div
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3, duration: 0.3 }}
                      className="w-px h-4 bg-gradient-to-b from-dark-300 to-dark-300/30 origin-top"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 1 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 1.2 }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          HIGH severity findings require human approval before delivery. No exceptions.
        </motion.p>
      </div>
    </section>
  );
}
