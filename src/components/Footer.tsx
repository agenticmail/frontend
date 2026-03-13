'use client';

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Trading', href: '#trading' },
    { label: 'Integrations', href: '#integrations' },
    { label: 'Open Source', href: '#open-source' },
    { label: 'Releases', href: '/releases' },
  ],
  Resources: [
    { label: 'Documentation', href: 'https://github.com/agenticmail/enterprise#readme' },
    { label: 'Getting Started', href: 'https://github.com/agenticmail/enterprise#getting-started-5-minutes' },
    { label: 'API Reference', href: 'https://github.com/agenticmail/enterprise#api-reference' },
  ],
  GitHub: [
    { label: 'Enterprise', href: 'https://github.com/agenticmail/enterprise' },
    { label: 'AgenticMail OSS', href: 'https://github.com/agenticmail/agenticmail' },
    { label: 'Issues', href: 'https://github.com/agenticmail/enterprise/issues' },
  ],
  Community: [
    { label: 'Twitter', href: 'https://twitter.com/agenticmail' },
    { label: 'Discussions', href: 'https://github.com/agenticmail/enterprise/discussions' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-dark-300/50 pt-14 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎀</span>
              <span className="font-bold text-white">AgenticMail</span>
            </a>
            <p className="text-xs text-gray-500 leading-relaxed">
              The complete AI agent workforce platform. Deploy, manage, and govern AI agents as real employees.
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h4>
              <ul className="space-y-2">
                {items.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-dark-300/30 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            MIT License · AgenticMail {new Date().getFullYear()}
          </p>
          <p className="text-xs text-gray-600">
            Built for organizations that take AI governance seriously.
          </p>
        </div>
      </div>
    </footer>
  );
}
