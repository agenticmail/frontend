'use client';

import { motion } from 'framer-motion';

const modes = [
  {
    title: 'OpenClaw Plugin',
    description: 'Drop-in skill for OpenClaw agents. 63 tools auto-registered.',
    color: 'from-accent to-blue-600',
    code: `// openclaw.yaml\nskills:\n  - agenticmail\n\n# That's it. 63 tools ready.`,
  },
  {
    title: 'MCP Server',
    description: 'Model Context Protocol server with 62 tools for any MCP client.',
    color: 'from-accent-purple to-purple-600',
    code: `// Claude Desktop config\n{\n  "mcpServers": {\n    "agenticmail": {\n      "command": "npx",\n      "args": ["agenticmail", "mcp"]\n    }\n  }\n}`,
  },
  {
    title: 'REST API',
    description: '75+ endpoints. Use from any language, any framework.',
    color: 'from-accent-orange to-orange-600',
    code: `// Send an email via REST\nconst res = await fetch(\n  'http://localhost:3210/api/email/send',\n  {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({\n      to: 'user@example.com',\n      subject: 'Hello from AI',\n      body: 'Sent by my agent!'\n    })\n  }\n);`,
  },
];

export function Integrations() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Three ways to <span className="gradient-text">integrate</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Choose the integration that fits your stack. All three give you the same powerful capabilities.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {modes.map((mode) => (
            <motion.div
              key={mode.title}
              variants={{
                hidden: { opacity: 1, y: 0 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{
                scale: 1.03,
                borderColor: 'rgba(88,166,255,0.3)',
                boxShadow: '0 0 30px rgba(88,166,255,0.06)',
              }}
              className="rounded-xl border border-dark-300 bg-dark-100 overflow-hidden transition-colors"
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
        </motion.div>
      </div>
    </section>
  );
}
