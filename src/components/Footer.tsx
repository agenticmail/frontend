'use client';

export function Footer() {
  return (
    <footer className="border-t border-dark-300/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="font-bold text-white">AgenticMail</span>
            </div>
            <p className="text-sm text-gray-500">
              Open source email, SMS & multi-agent coordination for AI agents.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="#quickstart" className="hover:text-white transition-colors">Quickstart</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://github.com/agenticmail/agenticmail" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="https://github.com/agenticmail/agenticmail/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Issues</a></li>
              <li><a href="https://github.com/agenticmail/agenticmail/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">MIT License</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Community</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://twitter.com/agenticmail" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a></li>
              <li><a href="https://github.com/agenticmail/agenticmail/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discussions</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-300/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2025 AgenticMail. MIT Licensed.</p>
          <p className="text-sm text-gray-500">Built for the agent era.</p>
        </div>
      </div>
    </footer>
  );
}
