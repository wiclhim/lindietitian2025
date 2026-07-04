import React, { useState, useEffect } from 'react';
import {
  Gift,
  PartyPopper,
  Utensils,
  Ghost,
  Flower2,
  Leaf,
  Moon,
  Sun,
  Trophy,
  Target,
  CircleDot,
  Flame,
  Image as ImageIcon
} from "lucide-react";

// --- Global Constants ---
export const ADMIN_PIN = "1225";
export const LINE_ID = "@171kndrh";
export const MENU_URL = "https://i.ibb.co/Rk0Ccjqn/image.jpg";

// --- Theme System Configuration ---
export const THEMES = {
  christmas: {
    id: 'christmas',
    name: '🎄 歡樂耶誕',
    colors: {
      primary: '#B91C1C', 
      primaryHover: '#991B1B',
      secondary: '#15803D', 
      accent: '#FCD34D', 
      bgGradient: 'from-[#4A3426] via-[#2F1E16] to-[#150D0A]',
      textMain: '#EFEBE9',
      textDark: '#5D4037',
      cardBg: '#FFF8E1',
      cardBorder: '#C5A059',
      buttonText: '#FFFFFF',
      success: '#15803D'
    },
    icon: Gift,
    particleType: 'snow',
    title: '聖誕活動',
    milestoneText: '聖誕禮物',
    logo: '/images/聖誕.jpg'
  },
  cny: {
    id: 'cny',
    name: '🧧 恭喜發財',
    colors: {
      primary: '#D32F2F', 
      primaryHover: '#B71C1C',
      secondary: '#F57F17', 
      accent: '#FFD700', 
      bgGradient: 'from-[#8E0000] via-[#5C0000] to-[#2b0000]',
      textMain: '#FFF8E1',
      textDark: '#4E342E',
      cardBg: '#FFFDE7',
      cardBorder: '#FFD700',
      buttonText: '#FFFFFF',
      success: '#E65100'
    },
    icon: PartyPopper,
    particleType: 'coin',
    title: '新春活動',
    milestoneText: '新春紅包',
    logo: '/images/新春.jpg'
  },
  daily: {
    id: 'daily',
    name: '🌿 文青食光',
    colors: {
      primary: '#7C9082', 
      primaryHover: '#5F7365',
      secondary: '#8D7B68', 
      accent: '#C8B6A6', 
      bgGradient: 'from-[#F0F4F1] via-[#E2E8E4] to-[#D5DDD8]', 
      textMain: '#2F3E33', 
      textDark: '#4A4238', 
      cardBg: '#FCFDFD', 
      cardBorder: '#7C9082',
      buttonText: '#FFFFFF',
      success: '#556B2F'
    },
    icon: Utensils,
    particleType: 'none',
    title: '歡迎光臨',
    milestoneText: '專屬好禮',
    logo: '/images/一般.jpg'
  },
  halloween: {
    id: 'halloween',
    name: '🎃 萬聖搞怪',
    colors: {
      primary: '#EA580C', 
      primaryHover: '#C2410C',
      secondary: '#1F2937', 
      accent: '#84CC16', 
      bgGradient: 'from-[#1a0b00] via-[#2d1b0e] to-[#0f172a]', 
      textMain: '#F3F4F6',
      textDark: '#111827',
      cardBg: '#FFF7ED', 
      cardBorder: '#EA580C',
      buttonText: '#FFFFFF',
      success: '#65A30D'
    },
    icon: Ghost,
    particleType: 'ghost',
    title: '萬聖節活動',
    milestoneText: '搗蛋好禮',
    logo: '/images/萬聖.jpg'
  },
  sakura: {
    id: 'sakura',
    name: '🌸 粉嫩櫻花',
    colors: {
      primary: '#F472B6', 
      primaryHover: '#EC4899',
      secondary: '#FBCFE8', 
      accent: '#FDF2F8', 
      bgGradient: 'from-[#FDF2F8] via-[#FCE7F3] to-[#FBCFE8]', 
      textMain: '#831843', 
      textDark: '#831843',
      cardBg: '#FFFFFF',
      cardBorder: '#F9A8D4',
      buttonText: '#FFFFFF',
      success: '#DB2777'
    },
    icon: Flower2,
    particleType: 'sakura',
    title: '春日祭典',
    milestoneText: '櫻花好禮',
    logo: '/images/春櫻.jpg'
  },
  autumn: {
    id: 'autumn',
    name: '🍂 金秋楓紅',
    colors: {
      primary: '#B45309', 
      primaryHover: '#92400E',
      secondary: '#78350F', 
      accent: '#FEF3C7', 
      bgGradient: 'from-[#FFFBEB] via-[#FEF3C7] to-[#FDE68A]', 
      textMain: '#451A03', 
      textDark: '#451A03',
      cardBg: '#FFFFFF',
      cardBorder: '#D97706',
      buttonText: '#FFFFFF',
      success: '#65A30D'
    },
    icon: Leaf,
    particleType: 'leaf',
    title: '秋收感恩',
    milestoneText: '豐收好禮',
    logo: '/images/秋楓.jpg'
  },
  moon: {
    id: 'moon',
    name: '🏮 元宵/中秋',
    colors: {
      primary: '#1E3A8A', 
      primaryHover: '#172554',
      secondary: '#CA8A04', 
      accent: '#FDBA74', 
      bgGradient: 'from-[#0F172A] via-[#1E1B4B] to-[#312E81]',
      textMain: '#E0F2FE',
      textDark: '#172554',
      cardBg: '#EFF6FF',
      cardBorder: '#FDBA74',
      buttonText: '#FFFFFF',
      success: '#0F766E'
    },
    icon: Moon,
    particleType: 'star',
    title: '佳節活動',
    milestoneText: '團圓好禮',
    logo: '/images/元宵.jpg'
  },
  summer: {
    id: 'summer',
    name: '🛶 端午仲夏',
    colors: {
      primary: '#0D9488', 
      primaryHover: '#0F766E',
      secondary: '#0284C7', 
      accent: '#FDE047', 
      bgGradient: 'from-[#ECFEFF] via-[#CFFAFE] to-[#A5F3FC]',
      textMain: '#164E63',
      textDark: '#083344',
      cardBg: '#FFFFFF',
      cardBorder: '#22D3EE',
      buttonText: '#FFFFFF',
      success: '#059669'
    },
    icon: Sun,
    particleType: 'bubble',
    title: '仲夏活動',
    milestoneText: '清涼好禮',
    logo: '/images/仲夏.jpg'
  },
  soccer: {
    id: 'soccer',
    name: '⚽ 熱血足球',
    colors: {
      primary: '#16A34A',
      primaryHover: '#15803D',
      secondary: '#1F2937',
      accent: '#FACC15',
      bgGradient: 'from-[#052e16] via-[#14532d] to-[#166534]',
      textMain: '#F0FDF4',
      textDark: '#052e16',
      cardBg: '#FFFFFF',
      cardBorder: '#16A34A',
      buttonText: '#FFFFFF',
      success: '#15803D'
    },
    icon: Trophy,
    particleType: 'soccer',
    title: '世界盃開踢',
    milestoneText: '足球好禮',
    // 更新為對應的首頁圖
    logo: '/images/足球.png' 
  },
  tennis: {
    id: 'tennis',
    name: '🎾 網球競技',
    colors: {
      primary: '#A3E635',
      primaryHover: '#84CC16',
      secondary: '#1D4ED8',
      accent: '#FFFFFF',
      bgGradient: 'from-[#1E3A8A] via-[#1D4ED8] to-[#3B82F6]',
      textMain: '#F0F9FF',
      textDark: '#1E3A8A',
      cardBg: '#FFFFFF',
      cardBorder: '#A3E635',
      buttonText: '#1E3A8A',
      success: '#65A30D'
    },
    icon: Target,
    particleType: 'tennis',
    title: '四大滿貫',
    milestoneText: '網球好禮',
    // 更新為對應的首頁圖
    logo: '/images/網球.png' 
  },
  baseball: {
    id: 'baseball',
    name: '⚾ 熱力棒球',
    colors: {
      primary: '#DC2626',
      primaryHover: '#B91C1C',
      secondary: '#1E3A8A',
      accent: '#F5DEB3',
      bgGradient: 'from-[#F5F5DC] via-[#E8DCC4] to-[#D2B48C]',
      textMain: '#1E293B',
      textDark: '#1E293B',
      cardBg: '#FFFFFF',
      cardBorder: '#DC2626',
      buttonText: '#FFFFFF',
      success: '#166534'
    },
    icon: CircleDot,
    particleType: 'baseball',
    title: '百萬象迷',
    milestoneText: '全壘打好禮',
    // 更新為對應的首頁圖
    logo: '/images/棒球.png' 
  },
  basketball: {
    id: 'basketball',
    name: '🏀 灌籃球場',
    colors: {
      primary: '#F97316',
      primaryHover: '#EA580C',
      secondary: '#1F2937',
      accent: '#FDBA74',
      bgGradient: 'from-[#1a1005] via-[#3a1f0a] to-[#7c2d12]',
      textMain: '#FFF7ED',
      textDark: '#431407',
      cardBg: '#FFF7ED',
      cardBorder: '#F97316',
      buttonText: '#FFFFFF',
      success: '#16A34A'
    },
    icon: Flame,
    particleType: 'basketball',
    title: 'NBA殿堂',
    milestoneText: '灌籃好禮',
    // 更新為對應的首頁圖
    logo: '/images/籃球.png' 
  }
};

// --- Particle System Logic ---
// 將 particleType 映射到實際要在畫面上掉落的 Emoji 或元素
const PARTICLE_MAP = {
  snow: ['❄️', '❅', '❆'],
  coin: ['🪙', '🧧', '💰'],
  none: [],
  ghost: ['👻', '🎃', '🦇'],
  sakura: ['🌸', '💮'],
  leaf: ['🍂', '🍁'],
  star: ['⭐', '✨', '🏮'],
  bubble: ['🫧', '💧'],
  soccer: ['⚽'],        // 足球掉落物
  tennis: ['🎾'],        // 網球掉落物
  baseball: ['⚾'],      // 棒球掉落物
  basketball: ['🏀']     // 籃球掉落物
};

// 動態生成掉落物的元件 (可整合進您的專案中)
const ParticleEffect = ({ type }) => {
  const particles = PARTICLE_MAP[type];
  if (!particles || particles.length === 0) return null;

  // 產生 30 個隨機位置的掉落物
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(30)].map((_, i) => {
        const randomParticle = particles[Math.floor(Math.random() * particles.length)];
        const left = `${Math.random() * 100}%`;
        const animationDuration = `${Math.random() * 3 + 4}s`; // 4s - 7s
        const animationDelay = `-${Math.random() * 5}s`;      // 提早開始，避免一開始畫面空空的
        const fontSize = `${Math.random() * 1 + 1}rem`;        // 1rem - 2rem 大小隨機

        return (
          <div
            key={i}
            className="absolute top-[-10%] animate-fall"
            style={{
              left,
              animationDuration,
              animationDelay,
              fontSize,
            }}
          >
            {randomParticle}
          </div>
        );
      })}
    </div>
  );
};

export default function App() {
  const [currentThemeId, setCurrentThemeId] = useState('basketball');
  const theme = THEMES[currentThemeId];
  const ThemeIcon = theme.icon;

  return (
    <div 
      className={`min-h-screen relative transition-all duration-700 bg-gradient-to-br ${theme.colors.bgGradient} p-6 flex flex-col items-center justify-center font-sans`}
    >
      {/* 注入掉落動畫的 CSS Keyframes */}
      <style>
        {`
          @keyframes fall {
            0% { transform: translateY(0vh) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
          }
          .animate-fall {
            animation: fall linear infinite;
          }
        `}
      </style>

      {/* 背景掉落物特效 */}
      <ParticleEffect type={theme.particleType} />

      <div className="z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        
        {/* 左側：主題選擇器 */}
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl col-span-1 h-fit">
          <h2 className="text-xl font-bold mb-4 text-white drop-shadow-md">選擇預覽主題</h2>
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {Object.values(THEMES).map((t) => (
              <button
                key={t.id}
                onClick={() => setCurrentThemeId(t.id)}
                className={`text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
                  currentThemeId === t.id 
                    ? 'bg-white text-gray-900 shadow-lg scale-105' 
                    : 'bg-black/20 text-white hover:bg-black/40'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* 右側：主題風格與圖片預覽卡片 */}
        <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center">
          <div 
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 transform hover:scale-105 border-4"
            style={{ 
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
            }}
          >
            {/* 模擬首頁圖片展示區塊 */}
            <div 
              className="h-48 w-full flex flex-col items-center justify-center relative overflow-hidden"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              <ThemeIcon size={64} style={{ color: theme.colors.accent }} className="mb-2 drop-shadow-lg" />
              <h1 className="text-3xl font-extrabold tracking-wider" style={{ color: theme.colors.buttonText }}>
                {theme.title}
              </h1>
            </div>

            <div className="p-8 flex flex-col gap-6">
              <div 
                className="p-4 rounded-xl border-2 border-dashed flex items-center justify-between"
                style={{ borderColor: theme.colors.primary, backgroundColor: theme.colors.cardBg }}
              >
                <div className="flex items-center gap-3">
                  <ImageIcon style={{ color: theme.colors.primary }} />
                  <span className="font-semibold" style={{ color: theme.colors.textDark }}>
                    設定的圖片路徑：
                  </span>
                </div>
                <code className="px-2 py-1 rounded bg-black/5 font-mono text-sm" style={{ color: theme.colors.primary }}>
                  {theme.logo}
                </code>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span style={{ color: theme.colors.textDark }} className="font-bold">里程碑文字</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-bold"
                    style={{ backgroundColor: theme.colors.secondary, color: '#fff' }}
                  >
                    {theme.milestoneText}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span style={{ color: theme.colors.textDark }} className="font-bold">掉落物類型</span>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider"
                    style={{ backgroundColor: theme.colors.accent, color: theme.colors.textDark }}
                  >
                    {theme.particleType}
                  </span>
                </div>
              </div>

              <button 
                className="w-full py-4 rounded-xl font-bold text-lg shadow-md transition-transform active:scale-95"
                style={{ 
                  backgroundColor: theme.colors.primary, 
                  color: theme.colors.buttonText 
                }}
              >
                進入活動
              </button>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}