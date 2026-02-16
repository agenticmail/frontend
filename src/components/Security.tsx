'use client';

import { motion } from 'framer-motion';

const steps = [
  { label: 'Agent sends email', icon: '🤖', color: 'bg-accent/20 text-accent' },
  { label: 'Outbound Guard scans', icon: '🔍', color: 'bg-accent-purple/20 text-accent-purple' },
  { label: 'PII & credential check', icon: '🛡️', color: 'bg-accent-orange/20 text-accent-orange' },
  { label: 'Risk scoring', icon: '📊', color: 'bg-yellow-500/20 text-yellow-400' },
  { label: 'HIGH → blocked', icon: '🚫', color: 'bg-accent-red/20 text-accent-red' },
  { label: 'LOW → delivered', icon: '✅', color: 'bg-accent-green/20 text-accent-green' },
];

export function Security() {
  return (
    <section id="security" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
        <div className="flex flex-col items-center gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="w-full max-w-md"
            >
              <div className="flex items-center gap-4 p-4 rounded-xl border border-dark-300 bg-dark-100">
                <div className={`w-10 h-10 rounded-lg ${step.color} flex items-center justify-center text-lg flex-shrink-0`}>
                  {step.icon}
                </div>
                <span className="font-medium text-sm text-gray-300">{step.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-1">
                  <div className="w-px h-4 bg-dark-300" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-gray-500 mt-8"
        >
          HIGH severity findings require human approval before delivery. No exceptions.
        </motion.p>
      </div>
    </section>
  );
}
