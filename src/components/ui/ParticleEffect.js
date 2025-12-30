// src/components/ui/ParticleEffect.js
import React, { useMemo } from "react";

const ParticleEffect = ({ type }) => {
  if (type === 'none') return null;

  const getParticleContent = () => {
    switch(type) {
      case 'snow': return '❄';
      case 'coin': return '💰';
      case 'ghost': return '👻';
      case 'star': return '✨';
      case 'bubble': return '.。';
      case 'sakura': return '🌸';
      case 'leaf': return '🍁';
      default: return '❄';
    }
  };

  const particles = useMemo(() => Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100 + "%",
    duration: Math.random() * 5 + 5 + "s",
    opacity: Math.random() * 0.5 + 0.3,
    delay: Math.random() * 5 + "s",
    size: Math.random() * 15 + 10 + "px",
  })), []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <style>
        {`
          @keyframes snowfall {
            0% { transform: translateY(-10vh) translateX(0) rotate(0deg); }
            50% { transform: translateY(50vh) translateX(20px) rotate(180deg); }
            100% { transform: translateY(110vh) translateX(-20px) rotate(360deg); }
          }
          .particle {
            position: absolute;
            top: -30px;
            animation-name: snowfall;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            text-shadow: 0 0 5px rgba(255,255,255,0.5);
          }
        `}
      </style>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            fontSize: p.size,
            color: (type === 'snow' || type === 'star') ? 'white' : 'inherit'
          }}
        >
          {getParticleContent()}
        </div>
      ))}
    </div>
  );
};

export default ParticleEffect;