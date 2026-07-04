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

  // 足球改用 PNG 圖片
  soccer: ['soccer-ball', '🥅', '🏆'],

  tennis: ['🎾', '🏆', '⭐'],
  baseball: ['⚾', '🧢', '🏆'],
  basketball: ['🏀', '🔥', '🏆'],
  none: []
};

const ParticleEffect = ({ type }) => {
  // 如果是 none 或沒有設定，就不渲染任何掉落物
  if (!type || type === 'none') return null;

  const particlesContent =
    PARTICLE_MAP[type] || PARTICLE_MAP['snow'];

  if (particlesContent.length === 0) return null;

  // 使用 useMemo 確保只有 type 改變時才重新產生掉落物
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,

        // 水平隨機位置
        left: Math.random() * 100 + "%",

        // 隨機下落時間 4 ~ 8 秒
        duration: Math.random() * 4 + 4 + "s",

        // 隨機透明度
        opacity: Math.random() * 0.5 + 0.5,

        // 負值延遲
        // 讓畫面載入時掉落物已經分布在畫面中
        delay: "-" + Math.random() * 8 + "s",

        // 隨機大小
        size: Math.random() * 0.8 + 1.2 + "rem",

        // 隨機選擇掉落符號
        symbol:
          particlesContent[
            Math.floor(Math.random() * particlesContent.length)
          ]
      })),
    [type]
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <style>
        {`
          @keyframes dynamic-fall {
            0% {
              transform:
                translateY(-10vh)
                translateX(0)
                rotate(0deg);

              opacity: 0;
            }

            10% {
              opacity: 1;
            }

            90% {
              opacity: 1;
            }

            100% {
              transform:
                translateY(110vh)
                translateX(20px)
                rotate(360deg);

              opacity: 0;
            }
          }


          .animate-particle {
            position: absolute;
            top: 0;

            animation:
              dynamic-fall
              linear
              infinite;

            text-shadow:
              0 0 5px
              rgba(255, 255, 255, 0.3);
          }


          /*
          ==============================
          足球 PNG 掉落物
          ==============================
          */

          .soccer-particle {
            width: 2.2em;
            height: 2.2em;

            object-fit: contain;
            display: block;

            user-select: none;
            pointer-events: none;

            filter:
              drop-shadow(
                0 4px 5px
                rgba(0, 0, 0, 0.35)
              );
          }
        `}
      </style>


      {particles.map((p) => (
        <div
          key={p.id}
          className="animate-particle drop-shadow-md text-white/90"
          style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            fontSize: p.size
          }}
        >

          {/* 足球主題使用 PNG */}

          {type === 'soccer' ? (
            <img
              src="/images/soccer-ball.png"
              alt=""
              className="soccer-particle"
              draggable="false"
            />
          ) : (

            /* 其他主題維持 Emoji */

            p.symbol

          )}

        </div>
      ))}

    </div>
  );
};

export default ParticleEffect;