'use client';

import { motion } from 'framer-motion';

const modes = [
  {
    title: 'OpenClaw Plugin',
    description: 'Drop-in skill for OpenClaw agents. 63 tools auto-registered.',
    color: 'from-accent to-blue-600',
    code: `// openclaw.yaml
skills:
  - agenticmail

# That's it. 63 tools ready.`,
  },
  {
    title: 'MCP Server',
    description: 'Model Context Protocol server with 62 tools for any MCP client.',
    color: 'from-accent-purple to-purple-600',
    code: `// Claude Desktop config
{
  "mcpServers": {
    "agenticmail": {
      "command": "npx",
      "args": ["agenticmail", "mcp"]
    }
  }
}`,
  },
  {
    title: 'REST API',
    description: '75+ endpoints. Use from any language, any framework.',
    color: 'from-accent-orange to-orange-600',
    code: `// Send an email via REST
const res = await fetch(
  'http://localhost:3210/api/email/send',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'user@example.com',
      subject: 'Hello from AI',
      body: 'Sent by my agent!'
    })
  }
);`,
  },
];

export function Integrations() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Three ways to <span className="gradient-text">integrate</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose the integration that fits your stack. All three give you the same powerful capabilities.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {modes.map((mode, i) => (
            <motion.div
              key={mode.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden hover:border-dark-400 transition-colors"
            >
              <div className="p-6">
                <div className={`inline-block px-3 py-1 rounded-md text-xs font-semibold bg-gradient-to-r ${mode.color} text-white mb-4`}>
                  {mode.title}
                </div>
                <p className="text-gray-400 text-sm mb-4">{mode.description}</p>
              </div>
              <div className="bg-dark-200 border-t border-dark-300 p-4">
                <pre className="text-xs text-gray-300 font-mono overflow-x-auto whitespace-pre">
                  {mode.code}
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
