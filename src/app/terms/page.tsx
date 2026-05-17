import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — AgenticMail',
  description: 'Terms of service for AgenticMail — the agreement governing your use of the AgenticMail platform and the AgenticMail GitHub App.',
  alternates: { canonical: 'https://agenticmail.io/terms' },
};

const lastUpdated = 'May 17, 2026';

interface Section {
  heading: string;
  body: (string | string[])[];
}

const sections: Section[] = [
  {
    heading: '1. Acceptance',
    body: [
      'These Terms of Service ("Terms") govern your use of the AgenticMail platform at agenticmail.io, the AgenticMail GitHub App, and related services (collectively, the "Services"). By installing the App, creating an account, or otherwise using the Services, you agree to these Terms. If you are using the Services on behalf of an organization, you represent that you have authority to bind that organization.',
    ],
  },
  {
    heading: '2. The Services',
    body: [
      'AgenticMail provides AI-powered automation for software teams. The GitHub App responds to @mentions in issues and pull requests, auto-summarizes new pull requests, and auto-triages new issues. The platform also offers agent workflows for email, scheduling, and adjacent tasks.',
      'We may add, modify, or remove features at any time. We will give reasonable notice before removing a feature you depend on.',
    ],
  },
  {
    heading: '3. Eligibility and accounts',
    body: [
      'You must be at least 16 years old to use the Services. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account or installation.',
      'Notify us promptly at security@agenticmail.io if you suspect unauthorized access.',
    ],
  },
  {
    heading: '4. Acceptable use',
    body: [
      'You agree not to:',
      [
        'Use the Services to violate any law or infringe anyone\'s rights, including intellectual property and privacy rights.',
        'Send malware, spam, phishing content, or content that exploits or endangers minors.',
        'Attempt to disrupt or compromise the Services, including by probing for vulnerabilities outside an approved disclosure program.',
        'Reverse-engineer, scrape at abusive volumes, or use the Services to build a competing product.',
        'Use the Services to generate content that violates the Acceptable Use Policy of our LLM provider (Anthropic) or of GitHub.',
      ],
      'We may suspend or terminate access immediately for serious or repeated violations.',
    ],
  },
  {
    heading: '5. Your content',
    body: [
      'You retain all rights to the issues, pull requests, comments, and other content you submit ("Your Content"). You grant us a limited, worldwide, royalty-free license to process Your Content solely to operate and improve the Services — for example, sending the contents of an @mention thread to our LLM provider so the bot can draft a reply.',
      'You are responsible for ensuring you have the right to submit Your Content and that doing so does not violate any third-party rights or confidentiality obligations.',
    ],
  },
  {
    heading: '6. AI-generated output',
    body: [
      'The bot generates replies, summaries, and triage suggestions using large language models. These outputs are probabilistic and can contain inaccuracies, omissions, or errors. You are responsible for reviewing AI-generated output before relying on it for any decision that matters.',
      'AgenticMail makes no warranty that AI-generated output is fit for any particular purpose. Treat it as a draft from a junior collaborator, not a finished work product.',
    ],
  },
  {
    heading: '7. Plans, billing, and free tier',
    body: [
      'Paid plans are billed through GitHub Marketplace under the plan terms displayed at install time. Free plans may be subject to fair-use rate limits.',
      'We may change pricing for future billing periods with at least 30 days\' notice. Existing paid customers will be billed at their current rate until renewal.',
    ],
  },
  {
    heading: '8. Third-party services',
    body: [
      'The Services integrate with GitHub, Anthropic, Netlify, Cloudflare, and other providers. Your use of those services is governed by their own terms. We are not responsible for the acts or omissions of third-party providers, although we will use reasonable care in choosing them.',
    ],
  },
  {
    heading: '9. Intellectual property',
    body: [
      'AgenticMail and its licensors retain all rights, title, and interest in the Services, including all software, designs, trademarks, and documentation. We grant you a limited, non-exclusive, non-transferable license to use the Services in accordance with these Terms.',
      'Feedback you provide may be used by us without obligation.',
    ],
  },
  {
    heading: '10. Disclaimer of warranties',
    body: [
      'THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE". TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTY ARISING FROM A COURSE OF DEALING OR USAGE OF TRADE.',
      'We do not warrant that the Services will be uninterrupted, error-free, or free of harmful components, or that AI-generated output will be accurate.',
    ],
  },
  {
    heading: '11. Limitation of liability',
    body: [
      'TO THE MAXIMUM EXTENT PERMITTED BY LAW, AGENTICMAIL AND ITS AFFILIATES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL.',
      'OUR AGGREGATE LIABILITY FOR ANY CLAIMS RELATING TO THE SERVICES WILL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR (B) USD $100.',
    ],
  },
  {
    heading: '12. Indemnification',
    body: [
      'You will indemnify and hold harmless AgenticMail and its affiliates from any third-party claims arising out of (a) your violation of these Terms, (b) Your Content, or (c) your use of the Services in violation of any law or third-party rights.',
    ],
  },
  {
    heading: '13. Termination',
    body: [
      'You may stop using the Services at any time by uninstalling the GitHub App and/or deleting your account. We may suspend or terminate the Services to you for material breach of these Terms or to comply with applicable law.',
      'Sections that by their nature should survive termination (intellectual property, disclaimers, liability limits, indemnification, governing law) will survive.',
    ],
  },
  {
    heading: '14. Changes to these Terms',
    body: [
      'We may update these Terms as the Services evolve. The "Last updated" date at the top reflects the current version. For material changes, we will provide reasonable advance notice. Continued use of the Services after a change takes effect constitutes acceptance.',
    ],
  },
  {
    heading: '15. Governing law and disputes',
    body: [
      'These Terms are governed by the laws of the State of Delaware, USA, without regard to its conflict-of-laws rules. Disputes will be resolved exclusively in the state or federal courts located in Delaware, and you consent to personal jurisdiction there. Nothing in this section prevents either party from seeking injunctive relief in any court of competent jurisdiction.',
    ],
  },
  {
    heading: '16. Contact',
    body: [
      'Questions about these Terms:',
      [
        'General: support@agenticmail.io',
        'Legal notices: legal@agenticmail.io',
        'Security: security@agenticmail.io',
      ],
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
            ← Back to AgenticMail
          </a>
          <h1 className="text-4xl font-bold mt-2">Terms of Service</h1>
          <p className="text-gray-400 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">
        <p className="text-gray-300 leading-relaxed">
          These Terms govern your use of AgenticMail. Read them carefully — by using the Services
          you agree to be bound by them. We have done our best to write them in plain language.
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
          <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
            Privacy Policy →
          </a>
        </p>
      </div>
    </div>
  );
}
