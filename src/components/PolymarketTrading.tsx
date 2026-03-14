'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const toolCategories = [
  {
    name: 'Market Intelligence',
    count: 25,
    tools: ['Screen & rank markets', 'Market deep-dive', 'Order book analysis', 'Related markets', 'Event timelines'],
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    icon: (
      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    name: 'Execution Engine',
    count: 10,
    tools: ['Buy/sell positions', 'Bracket orders', 'Stop-loss & take-profit', 'Auto-exit system', 'Pipeline execution'],
    gradient: 'from-blue-500/10 to-blue-600/5',
    border: 'border-blue-500/20',
    icon: (
      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    name: 'Quant Analytics',
    count: 14,
    tools: ['Kelly criterion sizing', 'Expected value calc', 'Arbitrage detection', 'Correlation analysis', 'Risk scoring'],
    gradient: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
    icon: (
      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Portfolio & Risk',
    count: 7,
    tools: ['Portfolio optimizer', 'Drawdown monitor', 'P&L attribution', 'Position sizing', 'Concentration (HHI)'],
    gradient: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
    icon: (
      <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    name: 'On-Chain Intel',
    count: 6,
    tools: ['Whale tracking', 'Smart money flow', 'Wallet analysis', 'Large trade alerts', 'Volume profiling'],
    gradient: 'from-cyan-500/10 to-cyan-600/5',
    border: 'border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    name: 'Signals & Feeds',
    count: 10,
    tools: ['Social sentiment', 'News aggregation', 'Price alerts', 'Watcher system', 'Proactive monitoring'],
    gradient: 'from-rose-500/10 to-rose-600/5',
    border: 'border-rose-500/20',
    icon: (
      <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];

const screenerStrategies = [
  { name: 'best_opportunities', desc: 'Highest composite score across all dimensions' },
  { name: 'momentum', desc: 'Markets with strong directional price movement' },
  { name: 'mispriced', desc: 'Edge detection where true probability differs from market' },
  { name: 'contested', desc: 'Markets near 50/50 with high disagreement' },
  { name: 'high_volume', desc: 'Most liquid markets with tight spreads' },
  { name: 'closing_soon', desc: 'Markets resolving soon — last chance to trade' },
  { name: 'safe_bets', desc: 'High-confidence outcomes with low risk' },
  { name: 'new_markets', desc: 'Recently listed with early-mover advantage' },
];

const dashboardTabs = [
  { name: 'Dashboard', desc: 'Live P&L, portfolio value, open positions with real-time streaming prices every 3 seconds. End dates, win/loss status, and one-click sell.' },
  { name: 'Wallet', desc: 'On-chain USDC.e balance, exchange balance, POL gas. Create or import wallets. Transfer to whitelisted addresses with cooling periods.' },
  { name: 'Trade Log', desc: 'Every trade logged with timestamp, market, side, price, size, CLOB order ID. Filter by status, search by market name.' },
  { name: 'Alerts', desc: 'Price alert management. Set target prices, get notified via Telegram/email when triggered. Auto-cleanup of expired alerts.' },
  { name: 'Analytics', desc: 'Win rate, profit factor, best/worst trades, per-market P&L attribution. Drawdown tracking over time.' },
];

export function PolymarketTrading() {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStrategy, setActiveStrategy] = useState(0);

  return (
    <section id="trading" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-dark-300/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Prediction Market Trading
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Autonomous <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">quant trading</span> on Polymarket
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your AI agent screens markets, calculates Kelly-optimal position sizes, executes trades on-chain,
            and monitors your portfolio — all with quantitative risk management built in.
          </p>
        </motion.div>

        {/* Hero feature — the trading flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-6 rounded-xl border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-dark-100/50 to-cyan-500/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">
            FULLY AUTONOMOUS
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Agents that trade like quant funds</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Not a simple buy/sell bot. Your agent uses a <strong className="text-white">6-dimension scoring engine</strong> (liquidity,
                volume, spread, edge, timing, momentum) to screen hundreds of markets, applies <strong className="text-white">Kelly criterion</strong> for
                optimal position sizing, executes via the Polymarket CLOB with bracket orders, and continuously monitors
                with <strong className="text-white">automatic stop-loss and take-profit</strong> exits. All trades go through your on-chain wallet — you control the keys.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['6D scoring engine', 'Kelly criterion', 'Bracket orders', 'On-chain execution', 'Drawdown protection', 'Whale tracking'].map(tag => (
                  <span key={tag} className="text-[11px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded">{tag}</span>
                ))}
              </div>
            </div>
            <div className="font-mono text-xs text-gray-400 bg-dark-200/80 rounded-lg px-4 py-3 whitespace-pre shrink-0 leading-relaxed border border-dark-300/30">
              <span className="text-emerald-400">Screening</span> best_opportunities...{'\n'}
              <span className="text-gray-500">Found 8 markets, scored 6 dims</span>{'\n'}
              <span className="text-cyan-400">Kelly:</span> 4.2% bankroll on &quot;BTC &gt; 100k&quot;{'\n'}
              <span className="text-blue-400">Buy</span> 42 shares @ 0.67 ($28.14){'\n'}
              <span className="text-amber-400">Bracket:</span> SL 0.55 | TP 0.85{'\n'}
              <span className="text-emerald-500">Position live. Monitoring...</span>
            </div>
          </div>
        </motion.div>

        {/* Trading flow steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {[
            { step: '1', title: 'Screen', desc: '8 strategies score markets across liquidity, volume, spread, edge, timing, and momentum', color: 'emerald' },
            { step: '2', title: 'Analyze', desc: 'Kelly criterion calculates optimal position size. EV, arbitrage, and correlation checks run', color: 'cyan' },
            { step: '3', title: 'Execute', desc: 'Places limit orders on Polymarket CLOB. Sets bracket orders for stop-loss and take-profit', color: 'blue' },
            { step: '4', title: 'Monitor', desc: 'Proactive watcher checks positions, triggers exits, sends alerts via Telegram or email', color: 'amber' },
          ].map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl border border-dark-300/30 bg-dark-100/30 relative"
            >
              <div className={`text-[10px] font-bold text-${s.color}-400 bg-${s.color}-500/10 w-6 h-6 rounded-full flex items-center justify-center mb-3`}>
                {s.step}
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{s.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* 72 tools across 6 categories */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-xl font-bold text-white mb-2 text-center">126 purpose-built trading tools</h3>
          <p className="text-gray-500 text-sm text-center mb-6">Organized into 6 sub-skills that auto-load based on conversation context</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {toolCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`p-4 rounded-xl border ${cat.border} bg-gradient-to-br ${cat.gradient} hover:border-opacity-40 transition-all`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {cat.icon}
                  <h4 className="text-sm font-semibold text-white">{cat.name}</h4>
                  <span className="ml-auto text-[10px] text-gray-500 bg-dark-200/60 px-1.5 py-0.5 rounded">{cat.count} tools</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.tools.map(tool => (
                    <span key={tool} className="text-[11px] text-gray-500 bg-dark/40 px-2 py-0.5 rounded">{tool}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Screener strategies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 rounded-xl border border-dark-300 bg-dark-100 overflow-hidden"
        >
          <div className="p-5 border-b border-dark-300/50">
            <h3 className="text-base font-bold text-white">Market Screener — 8 built-in strategies</h3>
            <p className="text-xs text-gray-500 mt-1">Each strategy applies different weights to the 6-dimension scoring system</p>
          </div>

          <div className="flex overflow-x-auto border-b border-dark-300/30 bg-dark-200/30">
            {screenerStrategies.map((s, i) => (
              <button
                key={s.name}
                onClick={() => setActiveStrategy(i)}
                className={`px-3 py-2.5 text-xs font-mono whitespace-nowrap transition-colors border-b-2 ${
                  i === activeStrategy
                    ? 'text-emerald-400 border-emerald-400 bg-dark-100/50'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>

          <div className="p-6 min-h-[100px] flex items-center">
            <motion.div
              key={activeStrategy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="font-mono text-sm text-emerald-400 mb-1">{screenerStrategies[activeStrategy].name}</div>
                  <p className="text-sm text-gray-400">{screenerStrategies[activeStrategy].desc}</p>
                </div>
                <div className="font-mono text-xs text-gray-500 bg-dark-200/60 rounded px-3 py-2 whitespace-pre shrink-0">
                  poly_screen_markets({'\n'}
                  {'  '}strategy: &quot;{screenerStrategies[activeStrategy].name}&quot;,{'\n'}
                  {'  '}active_only: true{'\n'}
                  )
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 rounded-xl border border-dark-300 bg-dark-100 overflow-hidden"
        >
          <div className="flex overflow-x-auto border-b border-dark-300 bg-dark-200/50">
            {dashboardTabs.map((tab, i) => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  i === activeTab
                    ? 'text-white border-emerald-400 bg-dark-100/50'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <div className="p-8 min-h-[180px] flex items-center justify-center">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-center max-w-xl"
            >
              <h4 className="text-lg font-bold text-white mb-2">{dashboardTabs[activeTab].name}</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{dashboardTabs[activeTab].desc}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Risk management + Wallet security */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-5 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-dark-100/30"
          >
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Risk Management
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Automatic exits</strong> — Every position gets stop-loss and take-profit brackets. No manual babysitting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Drawdown monitor</strong> — Tracks portfolio peak-to-trough. Alerts when drawdown exceeds your threshold.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Kelly criterion</strong> — Never overbet. Position sizing based on edge and bankroll, not gut feeling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Concentration limits</strong> — HHI tracking prevents over-exposure to single markets.</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-5 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-dark-100/30"
          >
            <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Wallet Security
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Your keys</strong> — Create or import wallets. Private keys encrypted at rest. You control the funds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Whitelist-only transfers</strong> — Agents can only send to pre-registered addresses. No arbitrary destinations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Cooling period</strong> — Configurable delay (default 24h) before new addresses can receive funds.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-0.5">&#8226;</span>
                <span><strong className="text-white">Per-tx limits</strong> — Each address has dollar limits that the agent cannot exceed.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: 'Trading Tools', value: '72+' },
            { label: 'Screener Strategies', value: '8' },
            { label: 'Scoring Dimensions', value: '6' },
            { label: 'Dashboard Pages', value: '5' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-3 rounded-lg border border-dark-300/30 bg-dark-100/20">
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-[11px] text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
