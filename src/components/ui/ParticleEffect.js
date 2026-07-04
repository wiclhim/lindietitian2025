import React, { useMemo } from "react";

// 定義所有主題對應的掉落物陣列
const PARTICLE_MAP = {
  snow: ['❄️', '❅', '❆'],
  coin: ['🪙', '💰', '🧧'],
  ghost: ['👻', '🎃', '🦇'],
  star: ['⭐', '✨', '🌟'],
  bubble: ['🫧', '💧'],
  sakura: ['🌸', '💮'],
  leaf: ['🍂', '🍁'],
  soccer: ['⚽', '🥅', '🏆'],
  tennis: ['🎾', '🏆', '⭐'],
  baseball: ['⚾', '🧢', '🏆'],
  basketball: ['🏀', '🔥', '🏆'],
  none: []
};

const ParticleEffect = ({ type }) => {
  // 如果是 'none' 或沒有設定，就不渲染任何掉落物
  if (!type || type === 'none') return null;

  const particlesContent = PARTICLE_MAP[type] || PARTICLE_MAP['snow'];
  if (particlesContent.length === 0) return null;

  // 使用 useMemo 確保每次 type 改變時才重新計算位置與符號
  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + "%",
    // 隨機下落時間 4 ~ 8 秒，讓每顆速度不同
    duration: Math.random() * 4 + 4 + "s",
    // 隨機透明度
    opacity: Math.random() * 0.5 + 0.5,
    // 給予負值的延遲，讓畫面一載入時掉落物就已經分佈在半空中
    delay: "-" + (Math.random() * 8) + "s",
    // 隨機大小
    size: Math.random() * 0.8 + 1.2 + "rem",
    // 從對應的陣列中隨機挑選一個符號 (例如從 3 種雪花挑 1 種，或直接選 🏀)
    symbol: particlesContent[Math.floor(Math.random() * particlesContent.length)]
  })), [type, particlesContent]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style>
        {`
          @keyframes dynamic-fall {
            0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(110vh) translateX(20px) rotate(360deg); opacity: 0; }
          }
          .animate-particle {
            position: absolute;
            top: 0;
            animation: dynamic-fall linear infinite;
            text-shadow: 0 0 5px rgba(255,255,255,0.3);
          }
        `}
      </style>
      
      {}
      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-particle drop-shadow-md text-white/90"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            fontSize: p.size,
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
};

export default ParticleEffect;