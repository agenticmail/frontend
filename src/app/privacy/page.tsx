import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — AgenticMail',
  description: 'Privacy policy for AgenticMail — how we collect, use, and protect your data across the platform and the AgenticMail GitHub App.',
  alternates: { canonical: 'https://agenticmail.io/privacy' },
};

const lastUpdated = 'May 17, 2026';

interface Section {
  heading: string;
  body: (string | string[])[];
}

const sections: Section[] = [
  {
    heading: '1. Who we are',
    body: [
      'AgenticMail ("we", "us", "our") operates the AgenticMail platform at agenticmail.io, the AgenticMail GitHub App, and related services (collectively, the "Services"). This policy explains what data we collect, how we use it, and the choices you have.',
      'Contact: support@agenticmail.io',
    ],
  },
  {
    heading: '2. What we collect',
    body: [
      'We collect only what we need to operate the Services:',
      [
        'Account data: email address, account name, and authentication tokens you provide when you sign up.',
        'GitHub App installation data: installation ID, account login, repository list, permissions granted, and webhook events your installation sends us (issue comments, pull request comments, issue/PR open events).',
        'Comment content: when you @mention the bot or open an issue/PR with auto-triage enabled, we read the surrounding thread text so the AI can draft a relevant reply.',
        'Operational telemetry: request timestamps, status codes, error traces, and inbound IP address for abuse mitigation and uptime monitoring.',
        'Billing data: for paid plans, we receive a customer identifier from GitHub Marketplace. We do not see or store card numbers.',
      ],
      'We do not collect data from private repository code beyond what arrives in webhook events you trigger by installing the App and mentioning the bot.',
    ],
  },
  {
    heading: '3. How we use it',
    body: [
      'We use collected data to:',
      [
        'Generate the bot\'s replies in your issues and pull requests.',
        'Authenticate webhook deliveries (HMAC verification of the GitHub signature).',
        'Deduplicate redelivered webhooks and rate-limit abusive traffic.',
        'Diagnose errors, improve reliability, and prevent abuse.',
        'Send transactional email (install confirmations, security notices, billing receipts).',
      ],
      'We do not sell your data. We do not use your content to train AI models. We do not use webhook payloads for advertising.',
    ],
  },
  {
    heading: '4. Third-party processors',
    body: [
      'We rely on a small set of vetted sub-processors to deliver the Services:',
      [
        'Anthropic, PBC — LLM inference for the bot\'s replies. Comment text is sent over TLS and is not retained for training under our enterprise terms.',
        'GitHub, Inc. — the platform that hosts your repositories and delivers webhook events to our endpoint.',
        'Netlify, Inc. — hosting for our marketing site and serverless functions.',
        'Cloudflare, Inc. — DNS, CDN, and DDoS protection.',
      ],
      'Each sub-processor is bound by its own enterprise data processing terms. We review this list and update it as our stack evolves.',
    ],
  },
  {
    heading: '5. Retention',
    body: [
      'Webhook payloads and bot replies are retained for up to 90 days in our operational logs, then automatically purged.',
      'Account and installation metadata is retained for the life of your installation. When you uninstall the App, we delete installation-scoped data within 30 days.',
      'Billing records may be retained longer where required by tax or accounting law (typically 7 years).',
    ],
  },
  {
    heading: '6. Security',
    body: [
      'We follow industry-standard practices: TLS in transit, encryption at rest, principle of least privilege for engineering access, HMAC-signed webhooks, and short-lived GitHub installation tokens.',
      'No system is perfectly secure. If you discover a vulnerability, please email security@agenticmail.io — we follow coordinated disclosure and will acknowledge your report within 72 hours.',
    ],
  },
  {
    heading: '7. Your rights',
    body: [
      'Depending on where you live (GDPR in the EEA/UK, CCPA in California, and similar laws elsewhere), you have the right to:',
      [
        'Access — request a copy of the personal data we hold about you.',
        'Correct — ask us to fix inaccurate data.',
        'Delete — ask us to erase data we are not legally required to keep.',
        'Port — receive your data in a machine-readable format.',
        'Object — opt out of processing in specific circumstances.',
      ],
      'To exercise any of these rights, email support@agenticmail.io. We respond within 30 days.',
    ],
  },
  {
    heading: '8. Children',
    body: [
      'The Services are not directed at children under 16. We do not knowingly collect data from children. If you believe a child has provided us with data, email support@agenticmail.io and we will delete it.',
    ],
  },
  {
    heading: '9. International transfers',
    body: [
      'Our infrastructure and our processors operate primarily in the United States. If you access the Services from outside the US, you consent to the transfer of your data to the US, subject to the safeguards required by applicable law (e.g., Standard Contractual Clauses for EEA/UK transfers).',
    ],
  },
  {
    heading: '10. Changes',
    body: [
      'We may update this policy as the Services evolve. The "Last updated" date at the top reflects the current version. For material changes, we will give reasonable advance notice by email or in-product banner.',
    ],
  },
  {
    heading: '11. Contact',
    body: [
      'Questions about this policy or your data:',
      [
        'General: support@agenticmail.io',
        'Security: security@agenticmail.io',
        'Privacy requests: support@agenticmail.io (subject line: "Privacy request")',
      ],
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
            ← Back to AgenticMail
          </a>
          <h1 className="text-4xl font-bold mt-2">Privacy Policy</h1>
          <p className="text-gray-400 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <p className="text-gray-300 leading-relaxed">
          This Privacy Policy describes how AgenticMail handles personal data across our website,
          our GitHub App, and our agent platform. We keep it short and concrete so you can read it
          in a few minutes.
        </p>

        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-semibold text-gray-100">{section.heading}</h2>
            <div className="mt-4 space-y-3 text-gray-300 leading-relaxed">
              {section.body.map((block, i) =>
                Array.isArray(block) ? (
                  <ul key={i} className="space-y-2 ml-6 list-disc marker:text-gray-600">
                    {block.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{block}</p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="border-t border-white/10 py-8 text-center text-sm text-gray-500">
        <p>
          <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
            Terms of Service →
          </a>
        </p>
      </div>
    </div>
  );
}
