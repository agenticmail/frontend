'use client';

import { AbsoluteFill, interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';

// Animated envelope that opens and reveals content
function Envelope({ progress }: { progress: number }) {
  const flapRotate = interpolate(progress, [0, 0.3], [0, -180], { extrapolateRight: 'clamp' });
  const letterY = interpolate(progress, [0.2, 0.6], [0, -60], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const letterOpacity = interpolate(progress, [0.2, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div className="relative w-32 h-24">
      {/* Envelope body */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] to-[#0d1117] border border-[#30363d] rounded-lg" />
      {/* Letter sliding out */}
      <div
        className="absolute left-2 right-2 h-16 bg-gradient-to-br from-[#58a6ff]/20 to-[#bc8cff]/20 border border-[#58a6ff]/30 rounded-md flex items-center justify-center"
        style={{ top: letterY, opacity: letterOpacity }}
      >
        <div className="text-[10px] text-[#58a6ff] font-mono">from: agent@ai</div>
      </div>
      {/* Envelope flap */}
      <div
        className="absolute top-0 left-0 right-0 h-12 origin-top"
        style={{
          transform: `perspective(200px) rotateX(${flapRotate}deg)`,
          backfaceVisibility: 'hidden',
        }}
      >
        <svg viewBox="0 0 128 48" className="w-full h-full">
          <path d="M0,0 L64,48 L128,0 Z" fill="#1a2332" stroke="#30363d" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}

// Floating particle
function Particle({ x, y, delay, size = 4 }: { x: number; y: number; delay: number; size?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(
    Math.sin((frame + delay * 30) * 0.05),
    [-1, 1],
    [0.1, 0.6]
  );
  const yOffset = interpolate(
    Math.sin((frame + delay * 20) * 0.03),
    [-1, 1],
    [-10, 10]
  );

  return (
    <div
      className="absolute rounded-full bg-[#58a6ff]"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        opacity,
        transform: `translateY(${yOffset}px)`,
        filter: 'blur(1px)',
      }}
    />
  );
}

// Connection line between two points
function ConnectionLine({ x1, y1, x2, y2, progress }: { x1: number; y1: number; x2: number; y2: number; progress: number }) {
  const dashOffset = interpolate(progress, [0, 1], [100, 0], { extrapolateRight: 'clamp' });

  return (
    <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
      <line
        x1={`${x1}%`}
        y1={`${y1}%`}
        x2={`${x2}%`}
        y2={`${y2}%`}
        stroke="#58a6ff"
        strokeWidth="1"
        strokeDasharray="4 4"
        strokeDashoffset={dashOffset}
        opacity={interpolate(progress, [0, 0.1], [0, 0.4], { extrapolateRight: 'clamp' })}
      />
    </svg>
  );
}

// Agent node
function AgentNode({ x, y, label, progress, color = '#58a6ff' }: { x: number; y: number; label: string; progress: number; color?: string }) {
  const scale = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const opacity = interpolate(progress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' });
  const pulse = interpolate(Math.sin(useCurrentFrame() * 0.08), [-1, 1], [0.8, 1.2]);

  return (
    <div
      className="absolute flex flex-col items-center gap-1"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      <div
        className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: color,
          background: `${color}15`,
          boxShadow: `0 0 ${pulse * 15}px ${color}30`,
        }}
      >
        <svg className="w-5 h-5" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
        </svg>
      </div>
      <span className="text-[10px] font-mono" style={{ color }}>{label}</span>
    </div>
  );
}

// The main Remotion composition for the hero
export function HeroComposition() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  // Scene 1: Title reveal (0-30%)
  const titleProgress = interpolate(progress, [0, 0.15], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(titleProgress, [0, 1], [40, 0]);
  const titleOpacity = interpolate(titleProgress, [0, 1], [0, 1]);

  // Scene 2: Agents appear (15-40%)
  const agentProgress = interpolate(progress, [0.15, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Scene 3: Emails fly (30-60%)
  const emailProgress = interpolate(progress, [0.3, 0.6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Scene 4: Shield activates (50-70%)
  const shieldProgress = interpolate(progress, [0.5, 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const shieldScale = interpolate(shieldProgress, [0, 0.5, 1], [0, 1.2, 1]);
  const shieldGlow = interpolate(shieldProgress, [0, 0.5, 1], [0, 30, 15]);

  // Scene 5: Stats count up (60-80%)
  const statsProgress = interpolate(progress, [0.6, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Scene 6: CTA (80-100%)
  const ctaProgress = interpolate(progress, [0.8, 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Background gradient animation
  const bgHue = interpolate(frame % 300, [0, 150, 300], [210, 260, 210]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d1117' }}>
      {/* Animated background */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 50% at 50% 30%, hsla(${bgHue}, 70%, 50%, 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Floating particles */}
      <Particle x={10} y={20} delay={0} />
      <Particle x={85} y={15} delay={1} size={3} />
      <Particle x={25} y={70} delay={2} />
      <Particle x={70} y={60} delay={3} size={5} />
      <Particle x={50} y={40} delay={4} size={3} />
      <Particle x={15} y={50} delay={5} />
      <Particle x={90} y={45} delay={6} size={4} />
      <Particle x={40} y={80} delay={7} />

      {/* Title */}
      <div
        className="absolute top-[8%] left-0 right-0 text-center"
        style={{ transform: `translateY(${titleY}px)`, opacity: titleOpacity }}
      >
        <div className="text-sm text-gray-500 mb-3 font-mono tracking-wider">AGENTICMAIL</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
          Give your AI agents
        </h1>
        <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
          <span style={{
            background: 'linear-gradient(135deg, #58a6ff, #bc8cff, #f0883e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            real email &amp; SMS
          </span>
        </h1>
      </div>

      {/* Agent nodes */}
      <AgentNode x={20} y={45} label="secretary" progress={agentProgress} color="#58a6ff" />
      <AgentNode x={50} y={38} label="researcher" progress={interpolate(agentProgress, [0.2, 1], [0, 1], { extrapolateLeft: 'clamp' })} color="#bc8cff" />
      <AgentNode x={80} y={45} label="writer" progress={interpolate(agentProgress, [0.4, 1], [0, 1], { extrapolateLeft: 'clamp' })} color="#f0883e" />

      {/* Connection lines */}
      <ConnectionLine x1={25} y1={45} x2={45} y2={40} progress={emailProgress} />
      <ConnectionLine x1={55} y1={40} x2={75} y2={45} progress={interpolate(emailProgress, [0.3, 1], [0, 1], { extrapolateLeft: 'clamp' })} />
      <ConnectionLine x1={20} y1={50} x2={80} y2={50} progress={interpolate(emailProgress, [0.5, 1], [0, 1], { extrapolateLeft: 'clamp' })} />

      {/* Envelope animation */}
      <div className="absolute" style={{ left: '42%', top: '55%', transform: 'translate(-50%, -50%)' }}>
        <Envelope progress={emailProgress} />
      </div>

      {/* Security shield */}
      <div
        className="absolute"
        style={{
          left: '50%',
          top: '72%',
          transform: `translate(-50%, -50%) scale(${shieldScale})`,
          opacity: interpolate(shieldProgress, [0, 0.1], [0, 1], { extrapolateRight: 'clamp' }),
        }}
      >
        <div style={{ filter: `drop-shadow(0 0 ${shieldGlow}px #7ee787)` }}>
          <svg className="w-12 h-12 text-[#7ee787]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <div className="text-center text-[10px] text-[#7ee787] mt-1 font-mono">SECURED</div>
      </div>

      {/* Stats */}
      <div
        className="absolute bottom-[12%] left-0 right-0 flex justify-center gap-16"
        style={{ opacity: interpolate(statsProgress, [0, 0.2], [0, 1], { extrapolateRight: 'clamp' }) }}
      >
        {[
          { n: 63, label: 'OpenClaw Tools', color: '#58a6ff' },
          { n: 62, label: 'MCP Tools', color: '#bc8cff' },
          { n: 75, label: 'API Endpoints', color: '#7ee787' },
        ].map((s, i) => {
          const count = Math.round(interpolate(statsProgress, [i * 0.1, 0.5 + i * 0.1], [0, s.n], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
          return (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-extrabold" style={{ color: s.color }}>{count}{s.label.includes('API') ? '+' : ''}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div
        className="absolute bottom-[3%] left-0 right-0 text-center"
        style={{
          opacity: interpolate(ctaProgress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
          transform: `translateY(${interpolate(ctaProgress, [0, 0.3], [20, 0], { extrapolateRight: 'clamp' })}px)`,
        }}
      >
        <span className="text-xs text-gray-500 font-mono">scroll to explore &middot; npx agenticmail</span>
      </div>
    </AbsoluteFill>
  );
}
