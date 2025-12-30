// src/config/constants.js
import {
  Gift,
  PartyPopper,
  Utensils,
  Ghost,
  Flower2,
  Leaf,
  Moon,
  Sun
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
    logo: 'https://i.ibb.co/GvSs1BtJ/1765508995830.png'
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
    logo: 'https://i.ibb.co/35kcbtDk/1766105776647.png'
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
    title: '集點活動',
    milestoneText: '專屬好禮',
    logo: 'https://i.ibb.co/Zz2cFMkT/1766320100151.png'
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
    logo: 'https://i.ibb.co/f6T1X9d/1766102862428.png'
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
    logo: 'https://i.ibb.co/Z1MSwCpW/1766102771173.png'
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
    logo: 'https://i.ibb.co/kVGCHMJS/1766103839305.png'
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
    logo: 'https://i.ibb.co/dJsfGR3P/IMG-20251219-081938.jpg'
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
    logo: 'https://i.ibb.co/XfFC431m/1766103300724.png'
  }
};