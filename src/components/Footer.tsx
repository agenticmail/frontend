'use client';

const links = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Security', href: '#security' },
    { label: 'Quickstart', href: '#quickstart' },
  ],
  Resources: [
    { label: 'GitHub', href: 'https://github.com/agenticmail/agenticmail' },
    { label: 'Issues', href: 'https://github.com/agenticmail/agenticmail/issues' },
    { label: 'MIT License', href: 'https://github.com/agenticmail/agenticmail/blob/main/LICENSE' },
  ],
  Community: [
    { label: 'Twitter', href: 'https://twitter.com/agenticmail' },
    { label: 'Discussions', href: 'https://github.com/agenticmail/agenticmail/discussions' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-dark-300/50 pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-3">
              <span className="text-xl">🎀</span>
              <span className="font-bold text-white">AgenticMail</span>
            </a>
            <p className="text-sm text-gray-500 leading-relaxed">
              Open source email, SMS &amp; multi-agent coordination for AI agents.
            </p>
          </div>
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-3">{category}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-sm text-gray-500 hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-dark-300/50">
          <p className="text-xs text-gray-600">&copy; 2025 AgenticMail. MIT Licensed.</p>
          <p className="text-xs text-gray-600 mt-2 sm:mt-0">Built for the agent era.</p>
        </div>
      </div>
    </footer>
  );
}
