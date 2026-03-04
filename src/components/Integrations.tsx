'use client';

import { motion } from 'framer-motion';

const adapters = [
  'Slack', 'GitHub', 'Jira', 'Salesforce', 'HubSpot', 'Zendesk', 'Stripe', 'Notion',
  'Linear', 'Asana', 'Confluence', 'Shopify', 'Intercom', 'Datadog', 'Sentry', 'PagerDuty',
  'AWS', 'Google Cloud', 'Azure DevOps', 'Cloudflare', 'Vercel', 'Netlify', 'Docker', 'Kubernetes',
  'Twilio', 'SendGrid', 'Mailchimp', 'Discord', 'Monday', 'ClickUp', 'Trello', 'Airtable',
  'QuickBooks', 'Xero', 'Gusto', 'BambooHR', 'Workday', 'Rippling', 'ADP', 'Personio',
  'Figma', 'Miro', 'Canva', 'Loom', 'Zoom', 'Webex', 'Microsoft Teams', 'Google Ads',
];

export function Integrations() {
  return (
    <section id="integrations" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="gradient-text">145</span> SaaS integrations
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Pre-built MCP adapters for every tool your team uses. OAuth flows, credential resolution, and rate limiting included.
          </p>
        </motion.div>

        {/* Scrolling ticker */}
        <div className="relative overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-dark to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-dark to-transparent z-10" />
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="flex gap-3 whitespace-nowrap"
          >
            {[...adapters, ...adapters].map((name, i) => (
              <div
                key={`${name}-${i}`}
                className="px-4 py-2 rounded-lg border border-dark-300/40 bg-dark-100/50 text-sm text-gray-400 flex-shrink-0"
              >
                {name}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
          {[
            { label: 'CRM & Sales', count: '15+', examples: 'Salesforce, HubSpot, Pipedrive' },
            { label: 'DevOps & CI', count: '20+', examples: 'GitHub, GitLab, Jira, Linear' },
            { label: 'Finance & HR', count: '25+', examples: 'QuickBooks, Stripe, Gusto, ADP' },
            { label: 'Communication', count: '15+', examples: 'Slack, Teams, Discord, Twilio' },
          ].map((cat) => (
            <div key={cat.label} className="p-4 rounded-lg border border-dark-300/30 bg-dark-100/20">
              <div className="text-xl font-bold text-white mb-1">{cat.count}</div>
              <div className="text-sm font-medium text-gray-300 mb-1">{cat.label}</div>
              <div className="text-xs text-gray-500">{cat.examples}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          All adapters use the Model Context Protocol (MCP) standard. Add custom adapters via the plugin system.
        </p>
      </div>
    </section>
  );
}
