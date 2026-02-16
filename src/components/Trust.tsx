'use client';

import { motion } from 'framer-motion';

export function Trust() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-dark-300 bg-dark-100/50 mb-8">
            <span className="text-sm text-gray-400">🔌 Built for the OpenClaw ecosystem</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Trusted by the <span className="gradient-text">agent community</span>
          </h2>

          <p className="text-gray-400 max-w-2xl mx-auto mb-12 text-lg leading-relaxed">
            AgenticMail is the communication backbone for AI agents built on OpenClaw. 
            It&apos;s open source, self-hosted, and designed to be extended.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: '🔓', title: 'Open Source', desc: 'MIT licensed. Fork it, extend it, own it.' },
              { icon: '🏠', title: 'Self-hosted', desc: 'Your data stays on your infrastructure.' },
              { icon: '🧩', title: 'Extensible', desc: 'Plugin architecture. Add your own tools.' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-dark-300 bg-dark-100"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
