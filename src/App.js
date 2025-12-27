import React, { useState, useEffect, useRef, useMemo } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  deleteDoc,
  getDoc,
  setDoc,
  writeBatch,
  getDocs,
  increment,
  where,
  arrayUnion,
  Timestamp,
  deleteField,
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import {
  Gift,
  Users,
  PartyPopper,
  Ticket,
  PlusCircle,
  Search,
  Save,
  Trash2,
  LogOut,
  Lock,
  User,
  MessageCircle,
  ArrowLeft,
  Utensils,
  Star,
  Calendar,
  Download,
  Upload,
  Settings,
  Store,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  QrCode,
  Clock,
  Phone,
  MapPin,
  RefreshCw,
  HelpCircle,
  Circle,
  Crown,
  Edit3,
  Loader2,
  Ghost,
  Moon,
  Sun,
  Palette,
  WifiOff,
  Flower2,
  Leaf,
  Layers,
  Coffee,
  Trophy,
  UserCheck,
  Gamepad2,
  Dices,
  Scissors,
  Eraser
} from "lucide-react";

// --- Firebase Initialization ---
const firebaseConfig = {
  apiKey: "AIzaSyAJdTZN7LZxWv_B76NkCyC6Vn2S4YkPdSE",
  authDomain: "lindietitian-85b48.firebaseapp.com",
  projectId: "lindietitian-85b48",
  storageBucket: "lindietitian-85b48.firebasestorage.app",
  messagingSenderId: "513298519750",
  appId: "1:513298519750:web:4c6ed87c840fd23fc029c7",
  measurementId: "G-5JTJ33TWVV",
};

let app, auth, db;
try {
  if (!window.firebaseAppInitialized) {
      app = initializeApp(firebaseConfig);
      window.firebaseAppInitialized = true;
      window.firebaseAppInstance = app;
  } else {
      app = window.firebaseAppInstance;
  }
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase 初始化失敗", error);
}

// --- Global Constants ---
const ADMIN_PIN = "1225";
const LINE_ID = "@171kndrh";
const MENU_URL = "https://i.ibb.co/Rk0Ccjqn/image.jpg";

// --- Theme System Configuration ---
const THEMES = {
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

// --- Helper Functions ---
const maskTicketId = (ticketId) => {
  if (!ticketId) return "N/A";
  return ticketId.replace(/^(\d{4})\d{6}(.*)$/, "$1******$2");
};

// --- Theme Context Provider ---
const ThemeContext = React.createContext();

// --- Particle Effects Component ---
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

// --- Easter Egg & Modals ---
const EasterEggModal = ({ onClose, theme }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="p-8 rounded-3xl border-4 text-center max-w-sm w-full relative overflow-hidden shadow-2xl animate-in zoom-in duration-300"
           style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.accent }}>
        <button onClick={onClose} className="absolute top-2 right-2 hover:opacity-80 text-white">
          <XCircle className="w-8 h-8" />
        </button>
        <div className="mb-4 flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg animate-bounce">
                <img src={theme.logo} alt="Logo" className="w-16 h-16 object-contain" />
            </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 drop-shadow-md" style={{ color: theme.colors.accent }}>Surprise!</h2>
        <h3 className="text-xl font-bold text-white mb-4">發現隱藏彩蛋！</h3>
        <p className="text-white text-lg leading-relaxed mb-6 font-medium">
          感謝您對木木營養食的支持！<br/>
          祝您天天開心，<br/>
          健康滿滿！
          <br/>
          <span className="text-sm opacity-80 mt-2 block">(別忘了告訴店長你發現了這個秘密!)</span>
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-bold transition-colors shadow-lg"
           style={{ backgroundColor: theme.colors.accent, color: theme.colors.textDark }}>
          收下祝福 🎁
        </button>
      </div>
    </div>
  );
};

const RedeemModal = ({ isOpen, onClose, onConfirm, prizeName, milestone, isProcessing, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl w-full max-w-sm relative shadow-2xl animate-in zoom-in duration-200">
        <button 
          onClick={!isProcessing ? onClose : undefined} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          disabled={isProcessing}
        >
          <XCircle className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                style={{ backgroundColor: `${theme.colors.cardBg}`, borderColor: theme.colors.accent }}>
            <Gift className="w-8 h-8" style={{ color: theme.colors.primary }} />
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.textDark }}>確認兌換好禮？</h3>
          <p className="mb-6" style={{ color: theme.colors.textDark }}>
            您即將使用累積的 
            <span className="font-bold mx-1" style={{ color: theme.colors.primary }}>{milestone}</span> 
            點數兌換：<br/>
            <span className="font-bold text-lg mt-2 block" style={{ color: theme.colors.secondary }}>{prizeName}</span>
            {Number(milestone) === 20 && (
                <span className="block text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
                  (注意：兌換 20 點大獎後，將扣除 20 點並開啟新的一輪集點！)
                </span>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              再想想
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 處理中
                </>
              ) : (
                "確認兌換"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WinnersList = ({ theme }) => {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(collection(db, "prizes"), (snapshot) => {
      const fetchedWinners = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((p) => p.claimed === true && p.type !== 'loyalty_reward'); 
      fetchedWinners.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setWinners(fetchedWinners);
    });
    return () => unsubscribe();
  }, []);

  if (winners.length === 0) return null;

  return (
    <div className="w-full max-w-md mt-6 backdrop-blur-sm p-5 rounded-2xl shadow-xl border-4 relative overflow-hidden animate-in fade-in slide-in-from-bottom-2 z-10"
         style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: theme.colors.cardBorder }}>
        <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2 border-b-2 border-dashed pb-3"
            style={{ color: theme.colors.textDark, borderColor: theme.colors.accent }}>
            <PartyPopper className="w-6 h-6 animate-bounce" style={{ color: theme.colors.primary }} /> 恭喜中獎名單
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
            {winners.map((w) => (
                <div key={w.id} className="flex justify-between items-center bg-red-50 p-3 rounded-xl border border-red-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-red-100">
                            <Trophy className="w-4 h-4" style={{ color: theme.colors.secondary }} />
                        </div>
                        <div>
                            <p className="font-bold text-base" style={{ color: theme.colors.textDark }}>{w.name}</p>
                            <p className="text-xs text-gray-500 font-medium">
                                得主: {w.winner?.name || "幸運兒"} 
                                <span className="ml-1 opacity-70">
                                    ({w.winner?.phone?.slice(0, 4)}***{w.winner?.phone?.slice(-3)})
                                </span>
                            </p>
                        </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-1 rounded text-white shadow-sm" style={{ backgroundColor: theme.colors.primary }}>已開獎</span>
                </div>
            ))}
        </div>
    </div>
  );
};

const LoyaltyPromoCard = ({ theme }) => {
    return (
        <div className="w-full max-w-md mt-6 backdrop-blur-sm p-5 rounded-2xl shadow-xl border-4 relative overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2"
             style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: theme.colors.cardBorder }}>
            <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2 border-b-2 border-dashed pb-3"
                style={{ color: theme.colors.textDark, borderColor: theme.colors.accent }}>
                <Crown className="w-6 h-6" style={{ color: theme.colors.primary }} /> 集點活動說明
            </h3>
            
            <div className="flex justify-between items-center px-2 mb-4 relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                
                <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2" 
                          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
                        <Phone className="w-5 h-5" style={{ color: theme.colors.secondary }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.textDark }}>報電話</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2" 
                          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
                        <Utensils className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.textDark }}>吃便當</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2" 
                          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
                        <Gift className="w-5 h-5 animate-bounce" style={{ color: theme.colors.success }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.textDark }}>換好禮</span>
                </div>
            </div>

            <ul className="space-y-2 text-sm md:text-base font-medium" style={{ color: theme.colors.textDark }}>
                <li className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.colors.success }} />
                    <span>消費任一餐盒即可累積 1 點</span>
                </li>
                <li className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.colors.success }} />
                    <span>集滿 10 / 15 / 20 點可兌換專屬美味好禮</span>
                </li>
            </ul>
        </div>
    );
};

const PrizeShowcase = ({ theme }) => {
    const prizes = [
        { icon: <Utensils className="w-5 h-5" style={{ color: theme.colors.primary }} />, text: "單點買一送一 (限同品項)" },
        { icon: <Store className="w-5 h-5" style={{ color: theme.colors.secondary }} />, text: "餐盒買一送一 (限同品項)" },
        { icon: <Ticket className="w-5 h-5" style={{ color: theme.colors.success }} />, text: "20元折價券 x3" },
        { icon: <Ticket className="w-5 h-5" style={{ color: theme.colors.success }} />, text: "10元折價券 x5" },
        { icon: <Star className="w-5 h-5" style={{ color: theme.colors.accent }} />, text: "茶香豆干 x5" },
        { icon: <HelpCircle className="w-5 h-5 animate-pulse" style={{ color: theme.colors.secondary }} />, text: `${theme.title}隱藏彩蛋 ??`, isEasterEgg: true },
    ];
    const handleHint = () => {
        alert("🤫 偷偷告訴你：\n試著對最上方的「Logo」.....，會有神奇的事情發生喔！");
    };

    return (
        <div className="w-full max-w-md mt-6 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-xl border-4 relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-10"
             style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: theme.colors.cardBorder }}>
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="text-white text-[10px] font-bold py-1 px-8 absolute top-3 -right-6 rotate-45 shadow-sm"
                     style={{ backgroundColor: theme.colors.primary }}>Prizes</div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2 border-b-2 border-dashed pb-3"
                style={{ color: theme.colors.textDark, borderColor: theme.colors.accent }}>
                <theme.icon className="w-7 h-7" style={{ color: theme.colors.primary }} /> 豐富獎項等你抽！
            </h3>
            <ul className="space-y-3">
                {prizes.map((p, i) => (
                    <li key={i} onClick={p.isEasterEgg ? handleHint : undefined} title={p.isEasterEgg ? "點我查看提示！" : ""} 
                        className={`flex items-center gap-3 font-bold text-base md:text-lg group hover:bg-gray-50 p-1 rounded-lg transition-all ${p.isEasterEgg ? "cursor-pointer hover:scale-105" : ""}`}
                        style={{ color: theme.colors.textDark }}>
                        <div className={`p-2 rounded-full shadow-inner border transition-transform ${p.isEasterEgg ? "group-hover:rotate-12" : "group-hover:scale-110"}`}
                             style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>{p.icon}</div>
                        {p.text}
                        {p.isEasterEgg && <span className="text-xs text-white font-normal ml-auto border rounded px-1.5 py-0.5 transition-colors" style={{ backgroundColor: theme.colors.primary }}>點我</span>}
                    </li>
                ))}
            </ul>
            <div className="mt-5 text-white text-center py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 animate-pulse"
                 style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryHover})` }}>
                <Calendar className="w-5 h-5" /> <span>公開抽獎日：12/25</span>
            </div>
        </div>
    );
};

const LoyaltyCard = ({ points = 0, redeemedMilestones = [], onRedeemClick, theme, settings }) => {
  const maxPoints = 20;
  const milestones = [10, 15, 20];
  const safePoints = Number(points) || 0;

  return (
    <div className="p-4 md:p-6 rounded-3xl shadow-lg border-2 relative overflow-hidden"
          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }}>
       <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: theme.colors.textDark }}></div>
       
       <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl flex items-center gap-2" style={{ color: theme.colors.textDark }}>
             <Crown className="w-6 h-6 fill-current" style={{ color: theme.colors.accent }} />
             便當集點卡
          </h3>
          <div className="text-white px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: theme.colors.textDark }}>
              目前點數：{safePoints} 點
          </div>
       </div>

       <p className="text-xs mb-4" style={{ color: theme.colors.textDark, opacity: 0.8 }}>
          * 買 1 個便當累積 1 點，達成門檻可點擊「禮物」兌換！
       </p>

       <div className="grid grid-cols-5 gap-2 md:gap-4">
          {Array.from({ length: maxPoints }).map((_, idx) => {
             const num = idx + 1;
             const isAchieved = safePoints >= num;
             const isMilestone = milestones.includes(num);
             const isRedeemed = redeemedMilestones.includes(num);
             const canRedeem = isMilestone && isAchieved && !isRedeemed;

             let bg = 'white';
             let border = '#D7CCC8';
             let text = '#D7CCC8';

             if (isRedeemed) {
                 bg = '#E5E7EB'; border = '#D1D5DB'; text = '#9CA3AF';
             } else if (canRedeem) {
                 bg = theme.colors.accent; border = theme.colors.primary; text = theme.colors.textDark;
             } else if (isAchieved) {
                 bg = theme.colors.primary; border = theme.colors.primary; text = 'white';
             } else if (isMilestone) {
                 bg = theme.colors.cardBg; border = theme.colors.accent; text = theme.colors.accent;
             }

             return (
                <div 
                   key={idx} 
                   onClick={() => canRedeem && onRedeemClick(num)}
                   className={`flex flex-col items-center gap-1 relative transition-transform ${canRedeem ? 'cursor-pointer active:scale-95 z-10' : ''}`}
                >
                   <div 
                      className={`
                          w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center relative transition-all duration-500
                          ${canRedeem ? "animate-bounce shadow-lg" : ""}
                          ${isMilestone && !isAchieved ? "border-dashed" : ""}
                        `}
                      style={{ backgroundColor: bg, borderColor: border, color: text }}
                   >
                      {isRedeemed ? (
                          <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" />
                      ) : canRedeem ? (
                          <Gift className="w-6 h-6" style={{ color: theme.colors.primary }} />
                      ) : isMilestone ? (
                          <Gift className="w-5 h-5 opacity-50" />
                      ) : (
                          <span className="font-mono font-bold text-sm md:text-base">{num}</span>
                      )}
                   </div>
                   
                   {isMilestone && (
                      <div className="text-[9px] md:text-xs font-bold px-1 rounded whitespace-nowrap"
                           style={{ 
                               color: isRedeemed ? 'gray' : theme.colors.textDark, 
                               backgroundColor: canRedeem ? theme.colors.accent : 'transparent' 
                           }}>
                         {isRedeemed ? "已領取" : canRedeem ? "點我兌換" : settings[num] || theme.milestoneText}
                      </div>
                   )}
                </div>
             );
          })}
       </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");
  const [currentUserData, setCurrentUserData] = useState(null);
  const [prevView, setPrevView] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);
  const [authError, setAuthError] = useState(null); 
  const [currentThemeId, setCurrentThemeId] = useState('christmas');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [eventType, setEventType] = useState('both'); 

  const theme = THEMES[currentThemeId] || THEMES.christmas;

  useEffect(() => {
    let mounted = true;
    const timeoutId = setTimeout(() => {
        if (loading && mounted) {
            console.warn("Auth connection timed out");
            setAuthError("連線逾時 (10s)。請檢查網路狀況或 API Key 設定。");
            setLoading(false);
        }
    }, 10000); 

    if (!auth) {
      setConfigError(true);
      setLoading(false);
      return () => clearTimeout(timeoutId);
    }

    const initAuth = async () => {
      try {
        if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
           try {
             await signInWithCustomToken(auth, window.__initial_auth_token);
           } catch (e) { console.warn("Fallback auth"); }
        } else {
            await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth failed:", error);
        if (mounted) {
            setAuthError(error.message || "Authentication failed");
            setLoading(false);
        }
      }
    };

    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (mounted) {
          if (u) {
              setUser(u);
              setLoading(false);
              setAuthError(null); 
              clearTimeout(timeoutId);
          }
      }
    });

    return () => { 
        mounted = false;
        clearTimeout(timeoutId);
        unsubscribe(); 
    };
  }, []);

  useEffect(() => {
    let unsubSettings = () => {};
    if (db && user && !isDemoMode) {
        try {
            const settingsRef = doc(db, "settings", "global");
            unsubSettings = onSnapshot(settingsRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.activeTheme) setCurrentThemeId(data.activeTheme);
                    if (data.eventType) setEventType(data.eventType);
                }
            }, (err) => {
                console.error("Settings fetch error:", err);
            });
        } catch(e) { console.log("DB error", e); }
    }
    return () => unsubSettings();
  }, [user, isDemoMode]);

  const handleLogout = () => {
    setView("landing");
    setCurrentUserData(null);
  };
  const goToMenu = () => { setPrevView(view); setView("menu-view"); };
  const goBackFromMenu = () => { setView(prevView); };

  if (configError) return <ConfigErrorView />;
  
  if (authError) return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">連線失敗 (Firebase Error)</h2>
          <p className="bg-white p-4 rounded border border-red-200 font-mono text-sm mb-4 break-all">
              {authError}
          </p>
          <p className="text-sm text-gray-600 mb-6">
              常見原因：API Key 限制、網域未授權、或匿名登入未開啟。
          </p>
          <div className="flex gap-2 justify-center">
            <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
            >
                重試連線
            </button>
          </div>
      </div>
  );

  if (loading) return (
      <div className="flex flex-col items-center justify-center h-screen font-bold text-xl gap-4 text-gray-600 bg-gray-50">
        <div className="flex items-center gap-3">
            <Loader2 className="animate-spin h-6 w-6" />
            載入中...
        </div>
        <button 
            onClick={() => { setAuthError("使用者手動中止等待"); setLoading(false); }}
            className="text-sm text-gray-400 hover:text-gray-600 underline"
        >
            等待太久？點此查看錯誤
        </button>
      </div>
  );
  
  if (!user && !isDemoMode) return <LoadingView />;

  return (
    <ThemeContext.Provider value={theme}>
        <div className={`min-h-screen font-sans bg-gradient-to-br ${theme.colors.bgGradient} text-base md:text-lg transition-colors duration-700 ease-in-out`}
             style={{ color: theme.colors.textMain }}>
        <ParticleEffect type={theme.particleType} />
        {isDemoMode && (
            <div className="fixed top-0 left-0 w-full bg-orange-500 text-white text-xs font-bold text-center z-50 py-1 shadow-md">
                目前為預覽展示模式 (無後端連線)
            </div>
        )}
        <Header view={view} setView={setView} goToMenu={goToMenu} handleLogout={handleLogout} theme={theme} isDemoMode={isDemoMode} />
        
        <main className="max-w-lg md:max-w-5xl mx-auto p-4 md:p-8 pb-24 md:pb-12 relative z-10">
            {view === "landing" && <LandingPage setView={setView} goToMenu={goToMenu} theme={theme} eventType={eventType} />}
            {view === "admin-login" && <AdminLogin setView={setView} theme={theme} isDemoMode={isDemoMode} />}
            {view === "customer-login" && <CustomerLogin setView={setView} setCurrentUserData={setCurrentUserData} theme={theme} isDemoMode={isDemoMode} />}
            {view === "menu-view" && <MenuView goBack={goBackFromMenu} theme={theme} />}
            {view === "admin-dash" && <AdminDashboard user={user} theme={theme} isDemoMode={isDemoMode} setCurrentThemeId={setCurrentThemeId} setEventType={setEventType} eventType={eventType} />}
            {view === "customer-dash" && <CustomerDashboard userData={currentUserData} goToMenu={goToMenu} theme={theme} isDemoMode={isDemoMode} eventType={eventType} />}
        </main>
        </div>
    </ThemeContext.Provider>
  );
}

function ConfigErrorView() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 text-center">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl max-w-lg w-full">
          <h1 className="text-2xl font-bold mb-3 text-red-600">設定錯誤</h1>
          <p className="mb-6">請檢查程式碼上方的 Firebase 設定。</p>
        </div>
      </div>
    );
}

function LoadingView() {
    return (
      <div className="flex items-center justify-center h-screen font-bold text-xl gap-3 text-gray-600 bg-gray-50">
        <Loader2 className="animate-spin h-6 w-6" />
        載入中...
      </div>
    );
}

function Header({ view, setView, goToMenu, handleLogout, theme, isDemoMode }) {
    return (
      <header className={`p-4 shadow-lg sticky ${isDemoMode ? 'top-6' : 'top-0'} z-20 border-b-4 transition-all`}
              style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.accent }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity" onClick={() => setView("landing")}>
            <theme.icon className="w-7 h-7" style={{ color: theme.colors.accent }} />
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-wider drop-shadow-sm leading-tight text-white">木木營養食</h1>
              <p className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-white/80">{theme.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {view !== "landing" && view !== "menu-view" && (
              <button onClick={goToMenu} className="text-xs md:text-sm font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm active:scale-95 border border-black/10"
                      style={{ backgroundColor: theme.colors.accent, color: theme.colors.textDark }}>
                <Utensils className="w-4 h-4" /> <span className="hidden md:inline">查看</span>菜單
              </button>
            )}
            {view !== "landing" && (
              <button onClick={handleLogout} className="text-xs md:text-sm bg-black/20 hover:bg-black/40 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                <LogOut className="w-4 h-4" /> <span className="hidden md:inline">登出</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
}

function MenuView({ goBack, theme }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button onClick={goBack} className="flex items-center gap-2 font-bold hover:opacity-80 mb-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-white">
        <ArrowLeft className="w-6 h-6" /> 返回
      </button>
      <div className="bg-white p-4 md:p-8 rounded-3xl shadow-xl border-2" style={{ borderColor: theme.colors.cardBorder }}>
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 border-b-2 pb-4" style={{ color: theme.colors.textDark }}>
          <Utensils className="w-8 h-8" style={{ color: theme.colors.primary }} /> 木木營養食 美味菜單
        </h2>
        <div className="flex justify-center bg-gray-50 rounded-2xl overflow-hidden min-h-[300px] md:min-h-[500px] items-center border border-dashed border-gray-300">
          <img src={MENU_URL} alt="店內菜單" className="max-w-full h-auto object-contain shadow-sm" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800?text=Menu+Image+Not+Found"; }} />
        </div>
        <p className="text-center text-sm md:text-base mt-6 py-2 rounded-lg" style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.textDark }}>* 餐點內容依現場供應為主，圖片僅供參考</p>
      </div>
    </div>
  );
}

function LandingPage({ setView, goToMenu, theme, eventType = 'both' }) {
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const handleLogoClick = () => {
    setClickCount(prev => {
        const newCount = prev + 1;
        if (newCount === 5) { setShowEasterEgg(true); return 0; }
        return newCount;
    });
  };

  const showLottery = eventType === 'lottery' || eventType === 'both';
  const showLoyalty = eventType === 'loyalty' || eventType === 'both';
  const isNone = eventType === 'none';

  return (
    <div className="flex flex-col items-center justify-center pt-4 md:pt-10 px-2 space-y-8 animate-in fade-in zoom-in duration-500">
      {showEasterEgg && <EasterEggModal onClose={() => setShowEasterEgg(false)} theme={theme} />}
      <div onClick={handleLogoClick} className="p-[6px] rounded-full shadow-2xl w-40 h-40 md:w-56 md:h-56 flex items-center justify-center overflow-hidden mb-2 relative z-10 cursor-pointer active:scale-95 transition-transform"
           style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}>
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
          <img src={theme.logo} alt="Store Logo" className="w-full h-full object-cover scale-150" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
          <div className="hidden w-full h-full flex-col items-center justify-center text-gray-300 bg-gray-50"><Store className="w-12 h-12 mb-1" /><span className="text-xs">Logo</span></div>
        </div>
        <div className="absolute -top-1 -right-1 transform rotate-12"><theme.icon className="w-12 h-12 md:w-16 md:h-16 drop-shadow-md" style={{ color: theme.colors.primary }} /></div>
      </div>
      
      <div className="text-center space-y-3 md:space-y-4 max-w-lg z-10 relative">
        <h2 onClick={handleLogoClick} className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-lg cursor-pointer select-none text-white">
            歡迎光臨<br /><span className="inline-block mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" style={{ color: theme.colors.accent }}>木木</span>營養食！
        </h2>
        
        {!isNone && (
            <div className="px-4 py-2 rounded-full inline-block border-2 shadow-lg transform -rotate-2"
                 style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
              <p className="font-medium text-lg md:text-xl" style={{ color: theme.colors.textDark }}>
                  {showLottery ? (
                      <>消費滿 <span className="font-bold text-xl md:text-2xl" style={{ color: theme.colors.primary }}>300</span> 元贈{theme.milestoneText}</>
                  ) : (
                      <>買便當<span className="font-bold text-xl md:text-2xl" style={{ color: theme.colors.primary }}>集點數</span>，美味好禮等你換！</>
                  )}
              </p>
            </div>
        )}
        {!isNone && (
            <p className="text-sm md:text-base font-bold animate-pulse tracking-wide text-white/90">
                {showLottery ? "(金額可跨日累積喔！)" : "(報電話即可快速累積！)"}
            </p>
        )}
      </div>
      
      {!isNone && showLottery && (
          <div className="w-full max-w-md mt-2 p-1 rounded-2xl shadow-2xl z-10 relative"
               style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.secondary})` }}>
            <div className="p-5 rounded-[14px] text-sm md:text-base text-center relative overflow-hidden h-full bg-white">
              <div className="relative z-10 leading-relaxed text-gray-800">
                <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2" style={{ color: theme.colors.primary }}>
                    <Calendar className="w-5 h-5" /> {theme.title}期間
                </h3>
                <div className="mt-2 font-medium bg-gray-50 p-3 rounded-xl border" style={{ borderColor: theme.colors.cardBorder, color: theme.colors.textDark }}>
                  <p>只要報手機號碼，消費金額</p>
                  <p className="text-lg font-bold my-1" style={{ color: theme.colors.primary }}>✨ 可跨日一直累積 ✨</p>
                  <p>每滿 300 元自動獲得一張摸彩券</p>
                </div>
              </div>
            </div>
          </div>
      )}

      {!isNone && showLottery && <PrizeShowcase theme={theme} />}
      {!isNone && showLottery && <WinnersList theme={theme} />}
      
      {!isNone && showLoyalty && <LoyaltyPromoCard theme={theme} />}
</div>
    </div>
  );
}

function AdminLogin({ setView, theme, isDemoMode }) {
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setView("admin-dash");
    } else {
      setMsg("密碼錯誤");
      setPin("");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl border-t-8 animate-in fade-in slide-in-from-bottom-4" style={{ borderColor: theme.colors.primary }}>
      <h2 className="text-2xl font-bold text-center mb-6" style={{ color: theme.colors.textDark }}>店長管理登入</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="password" 
          value={pin} 
          onChange={(e) => setPin(e.target.value)} 
          placeholder="請輸入管理密碼" 
          className="w-full p-4 border rounded-xl text-center text-xl tracking-widest outline-none focus:ring-2"
          style={{ focusRing: theme.colors.primary }}
          inputMode="numeric"
          autoFocus
        />
        {msg && <p className="text-red-500 text-center font-bold bg-red-50 p-2 rounded-lg">{msg}</p>}
        <button className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: theme.colors.primary }}>
          登入系統
        </button>
        <button type="button" onClick={() => setView("landing")} className="w-full text-gray-400 text-sm hover:text-gray-600 underline">
          返回首頁
        </button>
      </form>
    </div>
  );
}

function CustomerLogin({ setView, setCurrentUserData, theme, isDemoMode }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const customersRef = collection(db, "customers");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!phone || !pin) return;
    
    if (isDemoMode) {
         setTimeout(() => {
            if ((phone === '0912345678' && pin === '0000') || (phone === '0987654321' && pin === '1234')) {
                 setCurrentUserData({ id: phone, phone, name: phone==='0912345678'?'王小明':'陳美麗', totalSpent: phone==='0912345678'?3200:150, points: phone==='0912345678'?5:0, history: [], redeemedMilestones: [] });
                 setView("customer-dash");
            } else {
                setMsg("展示模式：帳號或密碼錯誤 (試試 0912345678 / 0000)");
            }
            setLoading(false);
        }, 500);
        return;
    }
    try {
      const docRef = doc(customersRef, phone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.pin === pin) { setCurrentUserData({ id: docSnap.id, ...data }); setView("customer-dash"); }
        else setMsg("密碼錯誤，請重試");
      } else { setMsg("找不到此號碼，請先註冊"); setIsRegistering(true); }
    } catch (err) { console.error(err); setMsg("系統忙碌中，請稍後再試"); }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !pin || !name) return;
    setLoading(true);
    if (isDemoMode) {
        setTimeout(() => {
            setCurrentUserData({ id: phone, phone, name, pin, totalSpent: 0, points: 0, history: [], redeemedMilestones: [] });
            setView("customer-dash");
            setLoading(false);
        }, 500);
        return;
    }
    try {
      const docRef = doc(customersRef, phone);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) { setMsg("此號碼已註冊過，請直接登入"); setIsRegistering(false); }
      else {
        const newUser = { phone, name, pin, totalSpent: 0, usedTicketCount: 0, points: 0, redeemedMilestones: [], joinedAt: serverTimestamp(), history: [] };
        await setDoc(docRef, newUser);
        setCurrentUserData({ id: phone, ...newUser });
        setView("customer-dash");
      }
    } catch (err) { console.error(err); setMsg("註冊失敗: " + err.message); }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-8" style={{ borderColor: theme.colors.primary }}>
      <h2 className="text-2xl font-bold text-center mb-8" style={{ color: theme.colors.textDark }}>{isRegistering ? "新顧客註冊" : "顧客查詢/登入"}</h2>
      <form onSubmit={isRegistering ? handleRegister : handleLogin} className="space-y-5">
        <div><label className="block text-base font-medium text-gray-600 mb-2">手機號碼</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678" className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-800 text-lg bg-gray-50" required inputMode="tel" /></div>
        {isRegistering && <div className="animate-in slide-in-from-top-2"><label className="block text-base font-medium text-gray-600 mb-2">您的稱呼</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如: 王小明" className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-800 text-lg bg-gray-50" required /></div>}
        <div><label className="block text-base font-medium text-gray-600 mb-2">{isRegistering ? "設定查詢密碼 (4-6碼)" : "查詢密碼"}</label><input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-800 text-lg bg-gray-50" required inputMode="numeric" /></div>
        {msg && <p className="text-base font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100 text-red-600">{msg}</p>}
        <button disabled={loading} className="w-full text-white font-bold py-4 rounded-xl shadow-lg active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 text-lg md:text-xl mt-4"
                style={{ backgroundColor: theme.colors.primary }}>
            {loading ? "處理中..." : isRegistering ? "立即註冊" : "登入查詢"}
        </button>
        <div className="text-center pt-4"><button type="button" onClick={() => { setIsRegistering(!isRegistering); setMsg(""); }} className="text-base underline decoration-dashed p-2" style={{ color: theme.colors.textDark }}>{isRegistering ? "已經有帳號？返回登入" : "第一次來？點此註冊"}</button></div>
      </form>
    </div>
  );
}

function CustomerDashboard({ userData, goToMenu, theme, isDemoMode, eventType = 'both' }) {
  const [data, setData] = useState(userData);
  const [myPrizes, setMyPrizes] = useState([]);
  const [confirmRedeemId, setConfirmRedeemId] = useState(null);
  const [loyaltySettings, setLoyaltySettings] = useState({ 10: theme.milestoneText, 15: theme.milestoneText, 20: theme.milestoneText });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 新增：控制遊戲中心顯示的狀態 ---
  const [showGameCenter, setShowGameCenter] = useState(false);

  const showLottery = eventType === 'lottery' || eventType === 'both';
  const showLoyalty = eventType === 'loyalty' || eventType === 'both';
  const isNone = eventType === 'none';

  useEffect(() => {
    if (!userData?.id) return;
    
    if (isDemoMode) {
        const nextYear = new Date();
        nextYear.setMonth(nextYear.getMonth() + 6);
        setMyPrizes([
            { id: "demo-prize-1", name: "🎁 集點好禮：免費小菜", claimed: true, redeemed: false, winner: { ticketId: "LOYALTY-10PTS-9999" }, expiresAt: { seconds: nextYear.getTime() / 1000, toDate: () => nextYear } },
            { id: "demo-prize-2", name: "🎁 集點好禮：茶香豆干", claimed: true, redeemed: true, redeemedAt: { seconds: Date.now()/1000 }, winner: { ticketId: "LOYALTY-10PTS-8888" } }
        ]);
        return;
    }

    const docRef = doc(db, "customers", userData.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) setData({ id: docSnap.id, ...docSnap.data() });
    });
    
    const settingsRef = doc(db, "settings", "loyalty");
    const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) setLoyaltySettings(docSnap.data());
    });

    const qPrizes = query(collection(db, "prizes"), where("winner.phone", "==", userData.id)); 
    const unsubPrizes = onSnapshot(qPrizes, (snapshot) => {
      const fetchedPrizes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      fetchedPrizes.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); 
      setMyPrizes(fetchedPrizes); 
    });
    return () => { unsubscribe(); unsubPrizes(); unsubSettings(); };
  }, [userData, isDemoMode]);

  const totalTickets = Math.floor((data.totalSpent || 0) / 300);
  const usedTickets = data.usedTicketCount || 0;
  const nextTicketNeeds = 300 - ((data.totalSpent || 0) % 300);
  const openLine = () => window.open(`https://line.me/R/ti/p/${LINE_ID}`, "_blank");

  const handleRedeem = async (prizeId) => {
    if (isDemoMode) {
        alert("展示模式無法實際兌換");
        return;
    }
    try {
      await updateDoc(doc(db, "prizes", prizeId), { redeemed: true, redeemedAt: serverTimestamp() });
      setConfirmRedeemId(null);
    } catch (error) { console.error("Redeem failed:", error); alert("兌換失敗，請稍後再試"); }
  };

  const openRedeemModal = (milestone) => {
      setSelectedMilestone(milestone);
      setModalOpen(true);
  };

  const handleConfirmRedeem = async () => {
      if (!selectedMilestone) return;
      if (isDemoMode) {
          alert("展示模式：兌換成功！(模擬)");
          setModalOpen(false);
          return;
      }
      const currentPoints = Number(data.points) || 0;
      if (currentPoints < selectedMilestone) { alert("點數不足，無法兌換！"); return; }
      setIsProcessing(true);
      const prizeName = loyaltySettings[selectedMilestone] || theme.milestoneText;
      
      const prizesRef = collection(db, "prizes");
      const customerRef = doc(db, "customers", data.id);
      
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 6);

      try {
          const batch = writeBatch(db);
          const newPrizeRef = doc(prizesRef);
          batch.set(newPrizeRef, {
              name: `🎁 集點好禮：${prizeName}`,
              claimed: true, redeemed: false,
              winner: { name: data.name || "貴賓", phone: userData.id, ticketId: `LOYALTY-${selectedMilestone}PTS-${Date.now().toString().slice(-4)}` },
              type: 'loyalty_reward', 
              createdAt: serverTimestamp(),
              expiresAt: expiresAt, 
          });
          if (Number(selectedMilestone) === 20) {
              batch.set(customerRef, { points: increment(-20), redeemedMilestones: [] }, { merge: true });
          } else {
              batch.update(customerRef, { redeemedMilestones: arrayUnion(selectedMilestone) });
          }
          await batch.commit();
          setModalOpen(false);
          setTimeout(() => {
              if (Number(selectedMilestone) === 20) alert("🎉 恭喜集滿 20 點！已為您兌換大獎，並開啟新的一張集點卡！");
              else alert(`🎉 已兌換 ${selectedMilestone} 點好禮，請到下方「我的獎品匣」查看！`);
          }, 100);
      } catch (error) { console.error("Redeem milestone failed:", error); alert("兌換失敗，請稍後再試"); }
      setIsProcessing(false);
  };

  const activePrizes = myPrizes.filter(p => {
      if (p.redeemed) return false;
      if (p.expiresAt) {
          const now = new Date();
          const expDate = p.expiresAt.toDate ? p.expiresAt.toDate() : new Date(p.expiresAt);
          if (expDate < now) return false; 
      }
      return true;
  });

  return (
    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 animate-in fade-in duration-500 relative">
      <RedeemModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleConfirmRedeem}
        prizeName={loyaltySettings[selectedMilestone] || theme.milestoneText} milestone={selectedMilestone} isProcessing={isProcessing} theme={theme}
      />

      {/* --- 新增：遊戲中心彈窗 --- */}
      {showGameCenter && <GameCenter userData={userData} theme={theme} isDemoMode={isDemoMode} onClose={() => setShowGameCenter(false)} />}

      <div className="space-y-6">
        {/* 會員卡片 */}
        <div className="p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden border-2 min-h-[220px] flex flex-col justify-between transform transition hover:scale-[1.01]"
             style={{ background: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.textDark})`, borderColor: theme.colors.accent }}>
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10"><theme.icon className="w-48 h-48 text-white" /></div>
          <div className="relative z-10 text-white">
            <div className="flex justify-between items-start">
              <div><p className="opacity-90 mb-1 font-medium text-sm md:text-base" style={{ color: theme.colors.accent }}>MEMBER CARD</p><p className="font-bold text-2xl md:text-3xl tracking-wide">{data.name}</p></div>
              <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20"><span className="text-xs md:text-sm font-bold tracking-widest" style={{ color: theme.colors.accent }}>VIP</span></div>
            </div>
            <div className="mt-8"><p className="text-xs md:text-sm opacity-80 mb-1">目前累積消費</p><div className="flex items-baseline gap-2"><span className="text-5xl md:text-6xl font-mono font-bold drop-shadow-md text-white">${data.totalSpent}</span><span className="text-lg opacity-80">元</span></div></div>
          </div>
        </div>

        {/* 集點卡 */}
        {!isNone && showLoyalty && (
            <LoyaltyCard points={data.points || 0} redeemedMilestones={data.redeemedMilestones || []} onRedeemClick={openRedeemModal} theme={theme} settings={loyaltySettings} />
        )}

        {/* 獎品匣 */}
        {activePrizes.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 animate-in slide-in-from-bottom-2" style={{ borderColor: theme.colors.accent }}>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg border-b pb-2" style={{ color: theme.colors.textDark, borderColor: theme.colors.cardBorder }}><Gift className="w-6 h-6" style={{ color: theme.colors.primary }} /> 我的獎品匣</h3>
            <div className="space-y-3">
              {activePrizes.map((prize) => (
                <div key={prize.id} className={`p-4 rounded-xl border-2 flex flex-col gap-3 transition-all ${prize.redeemed ? "bg-gray-50 border-gray-200 grayscale" : "bg-gray-50 shadow-sm"}`} style={{ borderColor: prize.redeemed ? '#E5E7EB' : theme.colors.accent }}>
                  <div className="flex justify-between items-start">
                    <div>
                        <p className={`font-bold text-lg ${prize.redeemed ? "text-gray-500" : ""}`} style={{ color: prize.redeemed ? undefined : theme.colors.textDark }}>{prize.name}</p>
                        <div className="text-xs text-gray-400 font-mono mt-1 space-y-1">
                            <p>票號: {maskTicketId(prize.winner?.ticketId)}</p>
                            {prize.expiresAt && !prize.redeemed && (
                                <p className="text-orange-500 font-medium flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    效期至: {
                                        (prize.expiresAt.toDate ? prize.expiresAt.toDate() : new Date(prize.expiresAt))
                                        .toLocaleDateString()
                                    }
                                </p>
                            )}
                        </div>
                    </div>
                    {prize.redeemed ? (<div className="flex flex-col items-end"><span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 已兌換</span></div>) : (<span className="bg-[#FEF3C7] text-[#D97706] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse"><Star className="w-3 h-3" /> 未兌換</span>)}
                  </div>
                  {!prize.redeemed && (
                    <div className="pt-2 border-t border-gray-200">
                      {confirmRedeemId === prize.id ? (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col gap-2">
                          <p className="text-red-700 text-sm font-bold flex items-start gap-2"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> 請出示給店員確認</p>
                          <div className="flex gap-2 mt-1"><button onClick={() => handleRedeem(prize.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg shadow-sm">確認兌換</button><button onClick={() => setConfirmRedeemId(null)} className="flex-1 bg-white border border-gray-300 text-gray-600 text-sm font-bold py-2 rounded-lg hover:bg-gray-50">取消</button></div>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmRedeemId(prize.id)} className="w-full text-white font-bold py-2 rounded-lg shadow-sm active:translate-y-0.5 transition-all text-sm flex justify-center items-center gap-2" style={{ backgroundColor: theme.colors.primary }}><QrCode className="w-4 h-4" /> 立即兌換</button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 摸彩券進度條 */}
        {!isNone && showLottery && (
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 flex flex-col gap-3" style={{ borderColor: theme.colors.secondary }}>
              <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3"><span className="font-medium text-gray-600">總獲得券數</span><div className="flex items-center gap-2 text-2xl font-bold" style={{ color: theme.colors.secondary }}><Ticket className="w-6 h-6" /> {totalTickets} <span className="text-base font-normal text-gray-400">張</span></div></div>
              <div className="flex justify-between items-center pt-1"><span className="font-medium text-gray-600">下一張還差</span><span className="text-xl font-bold" style={{ color: theme.colors.textDark }}>${nextTicketNeeds}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2 overflow-hidden"><div className="h-2.5 rounded-full transition-all duration-1000" style={{ width: `${((data.totalSpent % 300) / 300) * 100}%`, backgroundColor: theme.colors.success }}></div></div>
            </div>
        )}

        {/* 摸彩券列表 */}
        {!isNone && showLottery && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: theme.colors.cardBorder }}>
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg" style={{ color: theme.colors.textDark }}><Ticket className="w-6 h-6" style={{ color: theme.colors.primary }} /> 我的摸彩券</h3>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
                {totalTickets > 0 ? (
                  Array.from({ length: totalTickets }).map((_, idx) => {
                    const ticketNumber = idx + 1;
                    const isUsed = ticketNumber <= usedTickets;
                    const ticketId = `${data.phone}-${String(ticketNumber).padStart(2, "0")}`;
                    return (
                      <div key={idx} className={`flex justify-between items-center p-3 rounded-xl border ${isUsed ? "bg-gray-100 border-gray-200 opacity-70" : "bg-white border-gray-200"}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isUsed ? "bg-gray-200" : ""}`} style={{ backgroundColor: isUsed ? undefined : theme.colors.cardBg }}><Ticket className={`w-5 h-5 ${isUsed ? "text-gray-400" : ""}`} style={{ color: isUsed ? undefined : theme.colors.primary }} /></div>
                          <div><p className={`font-mono font-bold text-lg ${isUsed ? "text-gray-400 line-through" : "text-gray-800"}`}>{ticketId}</p><p className="text-xs text-gray-500">編號 #{ticketNumber}</p></div>
                        </div>
                        <div>{isUsed ? (<span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded"><CheckCircle2 className="w-3 h-3" /> 已使用</span>) : (<span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded animate-pulse" style={{ backgroundColor: theme.colors.cardBg, color: theme.colors.success }}><PartyPopper className="w-3 h-3" /> 可抽獎</span>)}</div>
                      </div>
                    );
                  })
                ) : (<p className="text-center text-gray-400 py-4">尚未獲得摸彩券，加油！</p>)}
              </div>
            </div>
        )}
      </div>

      <div className="space-y-6">
        {/* --- 新增：每日挑戰按鈕區塊 (放在右側最上方) --- */}
        <div className="space-y-4">
            <button onClick={() => setShowGameCenter(true)} className="w-full text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-in slide-in-from-left-2 group">
                <Gamepad2 className="w-6 h-6 animate-bounce" /> 
                <span className="text-lg group-hover:scale-105 transition-transform">每日挑戰 (贏免費好禮)</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
                <button onClick={openLine} className="text-white font-bold py-6 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 transition-all group" style={{ backgroundColor: theme.colors.success }}>
                    <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform"><MessageCircle className="w-8 h-8 text-white" /></div><span className="text-lg">通知登記</span>
                </button>
                <button onClick={goToMenu} className="text-white font-bold py-6 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 transition-all group" style={{ backgroundColor: theme.colors.secondary }}>
                    <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform"><Utensils className="w-8 h-8 text-white" /></div><span className="text-lg">查看菜單</span>
                </button>
            </div>
        </div>

        {/* 累積點數說明 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: theme.colors.cardBorder }}>
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg" style={{ color: theme.colors.textDark }}><PlusCircle className="w-6 h-6" style={{ color: theme.colors.success }} /> 如何累積點數？</h3>
          <p className="text-gray-700 text-base leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">每次消費後，請點擊上方<strong style={{ color: theme.colors.success }}>「通知登記」</strong>按鈕，私訊店長您的消費金額或收據照片，確認後店長會為您更新點數！</p>
        </div>

        {/* 消費紀錄 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex-1" style={{ borderColor: theme.colors.cardBorder }}>
          <h3 className="font-bold mb-4 border-b border-gray-100 pb-2 text-lg" style={{ color: theme.colors.textDark }}>最近消費紀錄</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {data.history && data.history.length > 0 ? (
              [...data.history].reverse().map((record, idx) => (
                <div key={idx} className="flex justify-between items-center text-base p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="text-gray-500 font-mono">{new Date(record.date).toLocaleDateString()}</span>
                  <div className="text-right">
                    <div className="font-bold text-gray-800">+ ${record.amount}</div>
                    {record.bentoQty > 0 && <div className="text-xs font-bold" style={{ color: theme.colors.success }}>+ {record.bentoQty} 點</div>}
                  </div>
                </div>
              ))
            ) : (<p className="text-center text-gray-400 py-8 italic">尚無消費紀錄</p>)}
          </div>
        </div>
      </div>
    </div>
  );
}


function AdminDashboard({ user, theme, isDemoMode, setCurrentThemeId, setEventType, eventType }) {
  const [activeTab, setActiveTab] = useState("checkin");
  return (
    <div>
      <div className="flex gap-3 mb-6 overflow-x-auto pb-4 snap-x scroll-pl-4 no-scrollbar">
        <AdminTab label="消費登記" icon={<PlusCircle className="w-5 h-5" />} active={activeTab === "checkin"} onClick={() => setActiveTab("checkin")} theme={theme} />
        <AdminTab label="顧客管理" icon={<Users className="w-5 h-5" />} active={activeTab === "customers"} onClick={() => setActiveTab("customers")} theme={theme} />
        <AdminTab label="集點設定" icon={<Edit3 className="w-5 h-5" />} active={activeTab === "loyalty"} onClick={() => setActiveTab("loyalty")} theme={theme} />
        <AdminTab label="節慶抽獎" icon={<PartyPopper className="w-5 h-5" />} active={activeTab === "lottery"} onClick={() => setActiveTab("lottery")} theme={theme} />
        <AdminTab label="商店設定" icon={<Settings className="w-5 h-5" />} active={activeTab === "settings"} onClick={() => setActiveTab("settings")} theme={theme} />
        <AdminTab label="遊戲設定" icon={<Gamepad2 className="w-5 h-5" />} active={activeTab === "games"} onClick={() => setActiveTab("games")} theme={theme} />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "checkin" && <CheckInSystem theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "customers" && <CustomerList theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "loyalty" && <LoyaltySettings theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "lottery" && <LotterySystem theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "settings" && <StoreSettings theme={theme} isDemoMode={isDemoMode} setCurrentThemeId={setCurrentThemeId} setEventType={setEventType} eventType={eventType} />}
        {activeTab === "games" && <GameSettings theme={theme} isDemoMode={isDemoMode} />}
      </div>
    </div>
  );
}

function AdminTab({ label, icon, active, onClick, theme }) {
  return (
    <button onClick={onClick} className={`snap-start flex-none flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all font-bold text-base shadow-sm`}
            style={{ 
                backgroundColor: active ? theme.colors.primary : 'white',
                color: active ? 'white' : theme.colors.textDark,
                borderColor: theme.colors.cardBorder,
                borderWidth: active ? 0 : 1
            }}>
      {icon} {label}
    </button>
  );
}

function StoreSettings({ theme, isDemoMode, setCurrentThemeId, setEventType, eventType }) {
    const [activeTheme, setActiveTheme] = useState(theme.id);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isDemoMode) {
            const fetchSettings = async () => {
                const docSnap = await getDoc(doc(db, "settings", "global"));
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.activeTheme) setActiveTheme(data.activeTheme);
                }
            };
            fetchSettings();
        }
    }, [isDemoMode]);

    const handleThemeChange = async (themeId) => {
        setLoading(true);
        try {
            if (isDemoMode) {
                setCurrentThemeId(themeId);
                setActiveTheme(themeId);
            } else {
                await setDoc(doc(db, "settings", "global"), { activeTheme: themeId }, { merge: true });
                setActiveTheme(themeId);
            }
            setMsg(`已切換至「${THEMES[themeId].name}」風格！`);
        } catch (error) { console.error(error); setMsg("設定失敗"); }
        setLoading(false);
    };

    const handleEventTypeChange = async (type) => {
        setLoading(true);
        try {
            if (isDemoMode) {
                setEventType(type);
            } else {
                await setDoc(doc(db, "settings", "global"), { eventType: type }, { merge: true });
                setEventType(type);
            }
            setMsg(`活動模式已切換！`);
        } catch (error) { console.error(error); setMsg("設定失敗"); }
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            
            {/* Event Type Settings */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm" style={{ borderColor: theme.colors.cardBorder }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.textDark }}>
                    <Layers className="w-6 h-6" style={{ color: theme.colors.primary }} /> 活動模式設定
                </h3>
                <p className="text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg">
                    控制首頁顯示的活動內容，可隨時切換。
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <button onClick={() => handleEventTypeChange('lottery')} 
                        className={`p-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${eventType === 'lottery' ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        style={{ borderColor: theme.colors.primary, backgroundColor: eventType === 'lottery' ? theme.colors.primary : 'white', color: eventType === 'lottery' ? 'white' : theme.colors.textDark }}>
                        <Ticket className="w-5 h-5" /> 只顯示摸彩
                    </button>
                    <button onClick={() => handleEventTypeChange('loyalty')} 
                        className={`p-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${eventType === 'loyalty' ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        style={{ borderColor: theme.colors.primary, backgroundColor: eventType === 'loyalty' ? theme.colors.primary : 'white', color: eventType === 'loyalty' ? 'white' : theme.colors.textDark }}>
                        <Crown className="w-5 h-5" /> 只顯示集點
                    </button>
                    <button onClick={() => handleEventTypeChange('both')} 
                        className={`p-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${eventType === 'both' ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        style={{ borderColor: theme.colors.primary, backgroundColor: eventType === 'both' ? theme.colors.primary : 'white', color: eventType === 'both' ? 'white' : theme.colors.textDark }}>
                        <Star className="w-5 h-5" /> 同時顯示
                    </button>
                    <button onClick={() => handleEventTypeChange('none')} 
                        className={`p-3 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 ${eventType === 'none' ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'}`}
                        style={{ borderColor: '#6B7280', backgroundColor: eventType === 'none' ? '#6B7280' : 'white', color: eventType === 'none' ? 'white' : '#374151' }}>
                        <Coffee className="w-5 h-5" /> 目前無活動
                    </button>
                </div>
            </div>

            {/* Theme Settings */}
            <div className="bg-white p-6 rounded-3xl border shadow-sm" style={{ borderColor: theme.colors.cardBorder }}>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.textDark }}>
                    <Palette className="w-6 h-6" style={{ color: theme.colors.primary }} /> 商店風格設定
                </h3>
                <p className="text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                    點擊下方按鈕即可切換全站風格（包含配色、圖示與特效）。
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.values(THEMES).map((t) => (
                        <button 
                            key={t.id}
                            onClick={() => handleThemeChange(t.id)}
                            disabled={loading}
                            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${activeTheme === t.id ? 'ring-2 ring-offset-2' : 'hover:bg-gray-50'}`}
                            style={{ 
                                borderColor: activeTheme === t.id ? t.colors.primary : '#E5E7EB',
                                ringColor: t.colors.primary,
                                opacity: loading ? 0.5 : 1
                            }}
                        >
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: t.colors.primary }}>
                                <t.icon className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-gray-700">{t.name}</span>
                            {activeTheme === t.id && <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: t.colors.secondary }}>使用中</span>}
                        </button>
                    ))}
                </div>
                {msg && <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold animate-in fade-in">{msg}</div>}
            </div>

            <DataBackupSystem theme={theme} isDemoMode={isDemoMode} />
        </div>
    );
}

function LoyaltySettings({ theme, isDemoMode }) {
    const [rewards, setRewards] = useState({ 10: "", 15: "", 20: "" });
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!isDemoMode) {
            const fetchSettings = async () => {
                const docRef = doc(db, "settings", "loyalty");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setRewards(docSnap.data());
                }
            };
            fetchSettings();
        }
    }, [isDemoMode]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (isDemoMode) {
            setMsg("展示模式：設定已儲存 (模擬)");
            setLoading(false);
            return;
        }
        try {
            await setDoc(doc(db, "settings", "loyalty"), rewards);
            setMsg("設定已儲存！");
            setTimeout(() => setMsg(""), 3000);
        } catch (err) {
            console.error(err);
            setMsg("儲存失敗");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border max-w-2xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
            <h2 className="font-bold mb-6 text-xl flex items-center gap-2" style={{ color: theme.colors.textDark }}><Edit3 style={{ color: theme.colors.primary }} /> 集點好禮設定</h2>
            <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
                請在此設定各階段的獎品名稱。顧客端在集點時只會看到「{theme.milestoneText}」，直到達成門檻並按下兌換後，才會看到具體的獎品名稱。
            </p>
            <form onSubmit={handleSave} className="space-y-4">
                {[10, 15, 20].map(points => (
                    <div key={points}>
                        <label className="block text-sm font-bold mb-1" style={{ color: theme.colors.textDark }}>
                            累積 {points} 點贈送：
                        </label>
                        <input 
                            type="text" 
                            value={rewards[points] || ""} 
                            onChange={(e) => setRewards({...rewards, [points]: e.target.value})}
                            placeholder={`例如：免費小菜、便當折價券...`}
                            className="w-full p-3 border rounded-xl outline-none focus:ring-1 text-gray-800"
                            style={{ borderColor: theme.colors.cardBorder, focusRing: theme.colors.primary }}
                        />
                    </div>
                ))}
                
                {msg && <div className="font-bold text-center py-2" style={{ color: theme.colors.success }}>{msg}</div>}
                
                <button disabled={loading} className="w-full text-white font-bold py-4 rounded-xl shadow-md active:scale-95 transition-all mt-4" style={{ backgroundColor: theme.colors.primary }}>
                    {loading ? "儲存中..." : "儲存設定"}
                </button>
            </form>
        </div>
    );
}

function CheckInSystem({ theme, isDemoMode }) {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [bentoQty, setBentoQty] = useState("");
  
  const getTodayDate = () => {
    const d = new Date();
    const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    return localDate.toISOString().split("T")[0];
  };
  const [date, setDate] = useState(getTodayDate());
  
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  const customersRef = collection(db, "customers");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone) return;
    if (isDemoMode) {
        setCurrentCustomer({ id: phone, phone, name: "測試顧客", points: 5, totalSpent: 1500 });
        setMsg({ type: "success", text: `展示模式：已讀取顧客資料` });
        return;
    }
    const docRef = doc(customersRef, phone);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) { setCurrentCustomer({ id: docSnap.id, ...docSnap.data() }); setMsg({ type: "success", text: `已讀取顧客資料` }); }
    else { setCurrentCustomer(null); setMsg({ type: "info", text: "查無此號碼，輸入金額將自動建立新顧客 (預設密碼 0000)" }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
        setMsg({ type: "success", text: "展示模式：模擬儲存成功！" });
        setAmount(""); setBentoQty(""); setCurrentCustomer(null);
        return;
    }
    if (!phone || !date) return;
    const addVal = parseInt(amount, 10) || 0; 
    const addPoints = parseInt(bentoQty, 10) || 0; 
    if (addVal < 0) return; 
    if (addVal === 0 && addPoints === 0) return; 

    const selectedDate = new Date(date);
    const historyDate = selectedDate.toISOString();

    try {
      if (currentCustomer) {
        const newTotal = (currentCustomer.totalSpent || 0) + addVal;
        const currentPoints = Number(currentCustomer.points) || 0;
        const newPoints = currentPoints + addPoints; 

        await updateDoc(doc(customersRef, currentCustomer.id), {
          totalSpent: newTotal,
          points: newPoints,
          lastVisit: selectedDate,
          history: [...(currentCustomer.history || []), { date: historyDate, amount: addVal, bentoQty: addPoints }],
        });
        setMsg({ type: "success", text: `成功補登 ${date} 消費 ${addVal} 元 (${addPoints} 點)！` });
      } else {
        const newUser = {
          phone, name: "店內新客", pin: "0000", totalSpent: addVal, points: addPoints, usedTicketCount: 0,
          joinedAt: serverTimestamp(), lastVisit: selectedDate,
          history: [{ date: historyDate, amount: addVal, bentoQty: addPoints }],
        };
        await setDoc(doc(customersRef, phone), newUser);
        setMsg({ type: "success", text: `已建立新顧客並補登消費！` });
      }
      setAmount(""); setBentoQty(""); setCurrentCustomer(null);
    } catch (err) { console.error(err); setMsg({ type: "error", text: "儲存失敗" }); }
  };

  const total = currentCustomer ? currentCustomer.totalSpent : 0;
  const currentPoints = currentCustomer ? (currentCustomer.points || 0) : 0;
  const tickets = Math.floor(total / 300);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-2xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
      <h2 className="font-bold mb-6 text-xl flex items-center gap-2" style={{ color: theme.colors.textDark }}><PlusCircle style={{ color: theme.colors.primary }} /> 快速消費登記</h2>
      <form onSubmit={currentCustomer ? handleSubmit : handleSearch} className="space-y-6">
        <div className="flex gap-3">
          <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setCurrentCustomer(null); setMsg({ type: "", text: "" }); }} onBlur={handleSearch} placeholder="輸入顧客手機" className="flex-1 p-4 border-2 rounded-xl outline-none text-xl tracking-wider placeholder:tracking-normal bg-gray-50 text-gray-800" style={{ borderColor: theme.colors.cardBorder, focusBorderColor: theme.colors.primary }} inputMode="tel" />
          <button type="button" onClick={handleSearch} className="bg-gray-100 px-6 rounded-xl hover:bg-gray-200 border-2 active:bg-gray-300" style={{ borderColor: theme.colors.cardBorder }}><Search className="w-6 h-6 text-gray-600" /></button>
        </div>

        {currentCustomer && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex justify-between items-center animate-in zoom-in duration-300">
            <div>
              <p className="font-bold text-green-800 text-lg">{currentCustomer.name || currentCustomer.phone}</p>
              <p className="text-sm text-green-700">累積消費: <span className="font-bold">${total}</span> | 點數: <span className="font-bold">{currentPoints}</span></p>
            </div>
            <div className="text-2xl font-bold text-green-700 flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm"><Ticket className="w-6 h-6" /> {tickets}</div>
          </div>
        )}

        {msg.text && !currentCustomer && <div className={`p-4 text-base font-medium rounded-xl text-center ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>{msg.text}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><Calendar className="w-4 h-4" /> 消費日期</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-4 border rounded-xl outline-none text-gray-800 bg-white text-lg h-[60px]" style={{ borderColor: theme.colors.cardBorder }} /></div>
          <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">消費金額</label>
              <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  onWheel={(e) => e.target.blur()} 
                  placeholder="$" 
                  className="w-full p-4 border rounded-xl text-2xl font-bold text-center outline-none h-[60px] text-gray-800" 
                  style={{ borderColor: theme.colors.cardBorder }} 
                  inputMode="numeric" 
              />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><Utensils className="w-4 h-4" /> 便當數量 (集點用)</label>
           <input 
               type="number" 
               value={bentoQty} 
               onChange={(e) => setBentoQty(e.target.value)} 
               onWheel={(e) => e.target.blur()} 
               placeholder="0" 
               className="w-full p-4 border rounded-xl text-xl font-bold text-center outline-none h-[60px] text-gray-800" 
               style={{ borderColor: theme.colors.cardBorder }} 
               inputMode="numeric" 
           />
        </div>

        <button className="w-full text-white font-bold py-5 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 transition-all text-xl flex items-center justify-center gap-2" style={{ backgroundColor: theme.colors.primary }}><Save className="w-6 h-6" /> {currentCustomer ? "確認累積" : "建立並累積"}</button>
      </form>
    </div>
  );
}

function CustomerList({ theme, isDemoMode }) {
  const [customers, setCustomers] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const customersRef = collection(db, "customers");
  
  useEffect(() => { 
      if (isDemoMode) {
          setCustomers([
              { id: '1', phone: '0912345678', name: '王小明', totalSpent: 3200, points: 5, pin: '0000' },
              { id: '2', phone: '0987654321', name: '陳美麗', totalSpent: 150, points: 0, pin: '1234' },
          ]);
          return;
      }
      const q = query(customersRef, orderBy("totalSpent", "desc")); 
      const unsubscribe = onSnapshot(q, (snapshot) => { setCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))); }); return () => unsubscribe(); 
  }, [isDemoMode]);
  
  const handleConfirmDelete = async (id) => { 
      if (isDemoMode) {
          setCustomers(prev => prev.filter(c => c.id !== id));
          setDeleteConfirmId(null);
          return;
      }
      await deleteDoc(doc(customersRef, id)); setDeleteConfirmId(null); 
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden max-w-4xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
      <div className="p-5 bg-gray-50 border-b" style={{ borderColor: theme.colors.cardBorder }}><h2 className="font-bold text-lg flex items-center gap-2" style={{ color: theme.colors.textDark }}><Users className="w-5 h-5" /> 顧客列表 ({customers.length})</h2></div>
      <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {customers.map((c) => (
          <div key={c.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex flex-col">
              <p className="font-bold text-lg tracking-wide text-gray-800">{c.phone}</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>{c.name || "未命名"}</span>
                <span className="text-gray-300">|</span>
                <span>密碼: {c.pin}</span>
                <span className="text-gray-300">|</span>
                <span>點數: {c.points || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-4"><span className="font-bold text-xl px-3 py-1 rounded-lg border bg-white" style={{ color: theme.colors.textDark, borderColor: theme.colors.cardBorder }}>${c.totalSpent}</span>{deleteConfirmId === c.id ? (<div className="flex items-center gap-2 animate-in zoom-in duration-200"><button onClick={() => handleConfirmDelete(c.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg">確定</button><button onClick={() => setDeleteConfirmId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg">取消</button></div>) : (<button onClick={() => setDeleteConfirmId(c.id)} className="text-gray-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button>)}</div>
          </div>
        ))}
        {customers.length === 0 && <p className="text-center p-8 text-gray-400">目前還沒有顧客資料</p>}
      </div>
    </div>
  );
}

function LotterySystem({ theme, isDemoMode }) {
  const [prizes, setPrizes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [prizeName, setPrizeName] = useState("");
  const [prizeQty, setPrizeQty] = useState(1);
  const [winner, setWinner] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [availableTicketCount, setAvailableTicketCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");

  const [targetPhone, setTargetPhone] = useState("");
  const [targetPrizeId, setTargetPrizeId] = useState("");
  
  const customersRef = collection(db, "customers");
  const prizesRef = collection(db, "prizes");

  useEffect(() => {
    if (isDemoMode) {
        setCustomers([{id:'1', phone:'0912345678', totalSpent: 3000, usedTicketCount: 0}, {id:'2', phone:'0988777666', totalSpent: 600, usedTicketCount: 0}]);
        setAvailableTicketCount(12);
        setPrizes([{id:'1', name:'免費餐盒', claimed: false}]);
        return;
    }
    const unsubC = onSnapshot(customersRef, (s) => {
      const allCustomers = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCustomers(allCustomers);
      let count = 0;
      allCustomers.forEach((c) => {
        const earned = Math.floor((c.totalSpent || 0) / 300);
        const used = c.usedTicketCount || 0;
        const available = Math.max(0, earned - used);
        count += Math.max(0, available);
      });
      setAvailableTicketCount(count);
    });
    const qPrizes = query(prizesRef, orderBy("name"));
    const unsubP = onSnapshot(qPrizes, (s) => setPrizes(s.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => { unsubC(); unsubP(); };
  }, [isDemoMode]);

  const showMsg = (msg) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(""), 3000); };

  const addPrize = async (e) => {
    e.preventDefault(); if (!prizeName || prizeQty < 1) return; setIsAdding(true);
    if (isDemoMode) {
        setPrizes(prev => [...prev, { id: Date.now().toString(), name: prizeName, claimed: false }]);
        setPrizeName(""); setPrizeQty(1); setIsAdding(false);
        return;
    }
    const batch = writeBatch(db);
    try {
      for (let i = 0; i < prizeQty; i++) { batch.set(doc(prizesRef), { name: prizeName, claimed: false, winner: null, redeemed: false, createdAt: serverTimestamp() }); }
      await batch.commit(); setPrizeName(""); setPrizeQty(1);
    } catch (err) { showMsg("新增失敗"); } setIsAdding(false);
  };

  const drawWinner = async (prizeId) => {
    const targetPrize = prizes.find(p => p.id === prizeId);
    const designatedPhone = targetPrize?.designatedTo;

    let pool = [];
    customers.forEach((c) => {
      const earned = Math.floor((c.totalSpent || 0) / 300);
      const used = c.usedTicketCount || 0;
      const available = Math.max(0, earned - used);
      for (let i = 0; i < available; i++) { pool.push({ ...c, currentTicketId: `${c.phone}-${String(used + i + 1).padStart(2, "0")}` }); }
    });

    if (pool.length === 0 && !designatedPhone) return showMsg("目前沒有可抽獎的票券！");

    let finalWinner = null;

    if (designatedPhone) {
        let targetUser = customers.find(c => c.id === designatedPhone);
        
        if (isDemoMode && !targetUser && designatedPhone === '0912345678') {
             targetUser = { id: '0912345678', phone: '0912345678', name: 'VIP測試', totalSpent: 3000, usedTicketCount: 2 };
        }

        if (targetUser) {
            const earned = Math.floor((targetUser.totalSpent || 0) / 300);
            const used = targetUser.usedTicketCount || 0;
            if (earned - used <= 0) {
                return showMsg(`指定中獎人 ${targetUser.name || designatedPhone} 抽獎券不足，無法開獎！`);
            }
            finalWinner = { 
                ...targetUser, 
                currentTicketId: `${targetUser.phone}-${String(used + 1).padStart(2, "0")}` 
            };
            
            if (pool.length < 5) {
                for(let k=0; k<5; k++) pool.push({ name: "...", phone: "..." }); 
            }
        } else {
            return showMsg("找不到指定的顧客資料！");
        }
    } else {
        if (pool.length === 0) return showMsg("沒有票券可抽！");
        finalWinner = pool[Math.floor(Math.random() * pool.length)];
    }

    setIsDrawing(true); setWinner(null);
    let duration = 3000; let startTime = Date.now();
    
    const animate = () => {
      if (Date.now() - startTime < duration) { 
          setWinner(pool[Math.floor(Math.random() * pool.length)] || { name: "...", phone: "..." }); 
          requestAnimationFrame(animate); 
      } else {
        setWinner(finalWinner); 
        setIsDrawing(false);
        
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 6); // Set expiration to 6 months

        if (!isDemoMode) {
            const batch = writeBatch(db);
            const prizeRef = doc(prizesRef, prizeId);
            batch.update(prizeRef, { 
                claimed: true, 
                redeemed: false, 
                winner: { name: finalWinner.name || "顧客", phone: finalWinner.phone, ticketId: finalWinner.currentTicketId },
                expiresAt: expiresAt,
                designatedTo: deleteField() 
            });
            const customerRef = doc(customersRef, finalWinner.id);
            batch.update(customerRef, { usedTicketCount: increment(1) });
            
            batch.commit().catch(err => console.error(err));
        } else {
             setPrizes(prev => prev.map(p => p.id === prizeId ? { 
                 ...p, 
                 claimed: true, 
                 winner: { name: finalWinner.name || "測試得主", phone: finalWinner.phone, ticketId: finalWinner.currentTicketId }, 
                 expiresAt: expiresAt,
                 designatedTo: undefined 
             } : p));
        }
      }
    }; animate();
  };

  const handleDesignateWinner = async () => {
      if (!targetPhone || !targetPrizeId) return showMsg("請輸入電話並選擇獎品");
      
      if (!isDemoMode) {
          const docRef = doc(customersRef, targetPhone);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) return showMsg("找不到此顧客，請先建立資料");
      }

      if (isDemoMode) {
          setPrizes(prev => prev.map(p => p.id === targetPrizeId ? { ...p, designatedTo: targetPhone } : p));
          showMsg(`Demo: 已預約 ${targetPhone} 獲獎，請按下該獎品的「抽獎」按鈕。`);
      } else {
          try {
              await updateDoc(doc(prizesRef, targetPrizeId), {
                  designatedTo: targetPhone
              });
              showMsg(`指定成功！請按下該獎品的「抽獎」按鈕進行開獎。`);
          } catch (err) {
              console.error(err);
              showMsg("指定失敗");
          }
      }
      setTargetPhone("");
      setTargetPrizeId("");
  };

  const unclaimedPrizes = prizes.filter(p => !p.claimed && p.type !== 'loyalty_reward');

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      {errorMsg && <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 rounded-xl z-50 font-bold animate-in fade-in zoom-in">{errorMsg}</div>}
      <div className="bg-white p-6 rounded-2xl border-2 text-center shadow-sm flex flex-col md:flex-row justify-around gap-4" style={{ borderColor: theme.colors.cardBorder }}>
        <div><p className="text-sm font-medium mb-1" style={{ color: theme.colors.primary }}>目前有效票券總數</p><p className="font-bold text-4xl" style={{ color: theme.colors.textDark }}>{availableTicketCount} <span className="text-lg" style={{ color: theme.colors.accent }}>張</span></p></div>
        <div className="w-px bg-gray-200 hidden md:block"></div>
        <div><p className="text-sm font-medium mb-1 text-gray-500">歷史已發出總票數</p><p className="font-bold text-4xl text-gray-400">{customers.reduce((acc, c) => acc + Math.floor((c.totalSpent || 0) / 300), 0)} <span className="text-lg text-gray-300">張</span></p></div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border" style={{ borderColor: theme.colors.cardBorder }}>
        <h3 className="font-bold mb-4" style={{ color: theme.colors.textDark }}>新增獎品</h3>
        <form onSubmit={addPrize} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="flex-1 w-full"><label className="text-sm font-bold text-gray-600 mb-2 block">獎品名稱</label><input type="text" value={prizeName} onChange={(e) => setPrizeName(e.target.value)} placeholder="例：免費餐盒" className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-1 text-lg bg-white text-gray-800" style={{ focusRing: theme.colors.primary }} /></div>
          <div className="w-full md:w-32"><label className="text-sm font-bold text-gray-600 mb-2 block">數量</label><input type="number" min="1" max="50" value={prizeQty} onChange={(e) => { const val = e.target.value; setPrizeQty(val === "" ? "" : parseInt(val)); }} className="w-full p-3 border border-gray-300 rounded-lg text-center outline-none focus:ring-1 text-lg bg-white text-gray-800" style={{ focusRing: theme.colors.primary }} /></div>
          <button disabled={isAdding} className="w-full md:w-auto text-white px-8 py-3 rounded-xl h-[54px] font-bold active:scale-95 transition-transform" style={{ backgroundColor: theme.colors.primary }}>{isAdding ? "..." : "新增"}</button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-l-8" style={{ borderColor: theme.colors.cardBorder, borderLeftColor: theme.colors.textDark }}>
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.textDark }}>
            <UserCheck className="w-5 h-5" /> 指定中獎 (黑箱/VIP贈禮)
        </h3>
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-end">
             <div className="flex-1 w-full">
                 <label className="text-sm font-bold text-gray-600 mb-2 block">選擇未開獎獎品</label>
                 <select 
                    value={targetPrizeId} 
                    onChange={(e) => setTargetPrizeId(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-1 text-lg bg-white text-gray-800"
                 >
                     <option value="">-- 請選擇獎品 --</option>
                     {unclaimedPrizes.map(p => (
                         <option key={p.id} value={p.id}>
                             {p.name}
                         </option>
                     ))}
                 </select>
             </div>
             <div className="flex-1 w-full">
                 <label className="text-sm font-bold text-gray-600 mb-2 block">指定顧客手機</label>
                 <input 
                    type="tel" 
                    value={targetPhone} 
                    onChange={(e) => setTargetPhone(e.target.value)} 
                    placeholder="輸入手機號碼" 
                    className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-1 text-lg bg-white text-gray-800" 
                 />
             </div>
             <button 
                onClick={handleDesignateWinner}
                className="w-full md:w-auto bg-gray-800 text-white px-6 py-3 rounded-xl h-[54px] font-bold active:scale-95 transition-transform whitespace-nowrap"
             >
                確認指定
             </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 px-1">
            * 設定後請按下方的「抽獎」按鈕。系統將執行隨機動畫，最後<strong className="text-red-600">強制中獎</strong>給指定人並扣除其票券。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prizes.length === 0 && <p className="col-span-full text-gray-400 text-center py-8 bg-white rounded-2xl border border-dashed border-gray-200">尚未設定獎品</p>}
        {prizes.map((p) => (
          <div key={p.id} className="border border-gray-200 p-4 rounded-2xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${p.claimed ? "bg-gray-100" : "bg-red-50"}`}><Gift className={`w-6 h-6 ${p.claimed ? "text-gray-300" : ""}`} style={{ color: p.claimed ? undefined : theme.colors.primary }} /></div>
              <div>
                <p className={`font-bold text-lg ${p.claimed ? "line-through text-gray-300" : "text-gray-800"}`}>
                    {p.name} 
                </p>
                {p.claimed && (<div className="text-sm mt-1"><p className="font-bold text-green-700">🎉 {p.winner?.name} ({p.winner?.phone?.substring(0, 4)}******)</p><div className="flex items-center gap-2 mt-1"><p className="text-xs text-gray-400 font-mono">Ticket: {maskTicketId(p.winner?.ticketId)}</p>{p.redeemed ? (<span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 已於 {p.redeemedAt ? new Date(p.redeemedAt.seconds * 1000).toLocaleDateString() : ""} 兌換</span>) : (<span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> 尚未兌換</span>)}</div></div>)}
              </div>
            </div>
            {!p.claimed && <button disabled={isDrawing} onClick={() => drawWinner(p.id)} className="text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-transform active:scale-95" style={{ backgroundColor: theme.colors.primary }}>抽獎</button>}
            {p.claimed && <button onClick={() => isDemoMode ? setPrizes(prev => prev.filter(pr => pr.id !== p.id)) : deleteDoc(doc(prizesRef, p.id))} className="text-gray-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button>}
          </div>
        ))}
      </div>
      {isDrawing && winner && (<div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"><div className="text-center text-white animate-in zoom-in duration-300 w-full max-w-sm p-8 rounded-3xl shadow-2xl border-4" style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.accent }}><p className="text-xl mb-6 font-bold uppercase tracking-widest" style={{ color: theme.colors.accent }}>Congratulations</p><Gift className="w-20 h-20 text-white mx-auto mb-6 animate-bounce" /><div className="text-5xl font-mono font-bold text-white tracking-wider mb-2">{winner.phone.substring(0, 4)}******</div><div className="text-2xl font-bold mb-4" style={{ color: theme.colors.accent }}>{winner.name}</div><div className="bg-black/20 px-6 py-2 rounded-full inline-block text-white/80 font-mono border border-white/20">{maskTicketId(winner.currentTicketId)}</div></div></div>)}
    </div>
  );
}

function DataBackupSystem({ theme, isDemoMode }) {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFixConfirm, setShowFixConfirm] = useState(false); // New state for fix confirm
  const [resetPin, setResetPin] = useState("");
  
  const customersRef = collection(db, "customers");
  const prizesRef = collection(db, "prizes");

  const handleDownload = async () => {
    setProcessing(true); setStatus("準備資料中...");
    if (isDemoMode) {
        setTimeout(() => {
            setStatus("展示模式：備份下載模擬成功！");
            setProcessing(false);
        }, 1000);
        return;
    }
    try {
      const customersSnap = await getDocs(customersRef);
      const prizesSnap = await getDocs(prizesRef);
      const data = { customers: customersSnap.docs.map((d) => ({ id: d.id, ...d.data() })), prizes: prizesSnap.docs.map((d) => ({ id: d.id, ...d.data() })), exportDate: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `wood_food_backup_${new Date().toISOString().split("T")[0]}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      setStatus("備份下載完成！請妥善保存檔案。");
    } catch (err) { console.error(err); setStatus("下載失敗，請稍後再試。"); }
    setProcessing(false);
  };

  const onFileSelect = (e) => { const file = e.target.files?.[0]; if (file) setPendingFile(file); e.target.value = ""; };
  const confirmUpload = async () => {
    if (!pendingFile) return;
    setProcessing(true); setStatus("讀取檔案中...");
    if (isDemoMode) {
        setTimeout(() => {
            setStatus("展示模式：還原模擬成功！");
            setProcessing(false);
            setPendingFile(null);
        }, 1000);
        return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (!data.customers || !Array.isArray(data.customers)) throw new Error("檔案格式錯誤：找不到顧客資料");
        setStatus(`正在還原 ${data.customers.length} 筆顧客資料...`);
        const customerPromises = data.customers.map(async (c) => { const { id, ...cData } = c; const docId = c.phone || id; if (!docId) return; await setDoc(doc(customersRef, docId), cData, { merge: true }); });
        let prizePromises = []; if (data.prizes && Array.isArray(data.prizes)) { prizePromises = data.prizes.map(async (p) => { const { id, ...pData } = p; if (id) await setDoc(doc(prizesRef, id), pData, { merge: true }); else await addDoc(prizesRef, pData); }); }
        await Promise.all([...customerPromises, ...prizePromises]);
        setStatus(`還原成功！已更新 ${data.customers.length} 位顧客與 ${data.prizes?.length || 0} 個獎品設定。`);
      } catch (err) { console.error(err); setStatus("還原失敗：" + err.message); }
      setProcessing(false); setPendingFile(null);
    };
    reader.readAsText(pendingFile);
  };

  const handleFixExpiry = async () => {
    if (resetPin !== ADMIN_PIN) { alert("密碼錯誤，無法執行"); return; }
    setProcessing(true); setStatus("正在校正效期...");
    if (isDemoMode) {
        setTimeout(() => {
            setStatus("展示模式：效期校正模擬完成！已將所有舊獎品效期重設為發送日+6個月。");
            setShowFixConfirm(false); setResetPin("");
            setProcessing(false);
        }, 1000);
        return;
    }
    try {
      // Find all claimed but unredeemed prizes
      const q = query(prizesRef, where("claimed", "==", true), where("redeemed", "==", false));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      let count = 0;
      
      snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.createdAt) {
              let createdDate;
              
              // 1. 標準 Firestore Timestamp (有 .toDate 方法)
              if (typeof data.createdAt.toDate === 'function') {
                  createdDate = data.createdAt.toDate();
              }
              // 2. 從 JSON 還原的物件 (沒有 .toDate，只有 seconds)
              else if (data.createdAt.seconds) {
                  createdDate = new Date(data.createdAt.seconds * 1000);
              }
              // 3. 原生 Date 物件
              else if (data.createdAt instanceof Date) {
                  createdDate = data.createdAt;
              }
              // 4. 字串或數字 (最後嘗試)
              else {
                  createdDate = new Date(data.createdAt);
              }

              // 確保轉換出來的時間有效
              if (createdDate && !isNaN(createdDate.getTime())) {
                  const newExpiresAt = new Date(createdDate);
                  newExpiresAt.setMonth(newExpiresAt.getMonth() + 6); // Set to 6 months from creation
                  
                  batch.update(docSnap.ref, { expiresAt: newExpiresAt });
                  count++;
              }
          }
      });
      
      if (count > 0) await batch.commit();
      setStatus(`校正完成！已更新 ${count} 筆未兌換獎品的效期 (設為發出日+6個月)。`);
      setShowFixConfirm(false); setResetPin("");
    } catch (err) { console.error(err); setStatus("校正失敗: " + err.message); }
    setProcessing(false);
  };

  const handleResetEvent = async () => {
    if (resetPin !== ADMIN_PIN) { alert("密碼錯誤，無法執行重置"); return; }
    setProcessing(true); setStatus("正在重置活動資料...");
    if (isDemoMode) {
        setTimeout(() => {
            setStatus("展示模式：系統重置模擬完成！");
            setShowResetConfirm(false); setResetPin("");
            setProcessing(false);
        }, 1000);
        return;
    }
    try {
      const batch = writeBatch(db);
      const customersSnap = await getDocs(customersRef);
      const prizesSnap = await getDocs(prizesRef);
      
      customersSnap.docs.forEach((doc) => {
          batch.update(doc.ref, { 
              totalSpent: 0, 
              usedTicketCount: 0, 
              history: [], 
              lastVisit: null
          });
      });

      prizesSnap.docs.forEach((doc) => {
          const data = doc.data();
          if (data.redeemed === true) {
              batch.delete(doc.ref);
          }
      });

      await batch.commit();
      setStatus("活動已重置！消費金額與抽獎紀錄已歸零 (點數、兌換進度與未兌換獎品已保留)。"); 
      setShowResetConfirm(false); 
      setResetPin("");
    } catch (err) { console.error(err); setStatus("重置失敗: " + err.message); }
    setProcessing(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pt-8 border-t" style={{ borderColor: theme.colors.cardBorder }}>
      <div className="bg-white p-6 rounded-3xl border text-center" style={{ borderColor: theme.colors.cardBorder }}><h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2" style={{ color: theme.colors.textDark }}><Settings className="w-6 h-6" /> 資料庫安全中心</h3><p className="text-sm md:text-base text-gray-500">管理備份與系統重置功能。<br />執行任何重置前，強烈建議先下載備份檔。</p></div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm border flex flex-col items-center gap-4 hover:shadow-md transition-shadow" style={{ borderColor: theme.colors.cardBorder }}>
          <div className="bg-blue-50 p-5 rounded-full"><Download className="w-10 h-10 text-blue-600" /></div><div className="text-center"><h4 className="font-bold text-gray-800 text-lg mb-1">下載備份檔</h4><p className="text-sm text-gray-500 mb-4">匯出所有顧客與獎品資料 (.json)</p></div><button onClick={handleDownload} disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-sm active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 text-lg">{processing ? "處理中..." : "立即下載"}</button>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm border flex flex-col items-center gap-4 hover:shadow-md transition-shadow relative" style={{ borderColor: theme.colors.cardBorder }}>
          <div className="bg-green-50 p-5 rounded-full"><Upload className="w-10 h-10 text-green-600" /></div><div className="text-center"><h4 className="font-bold text-gray-800 text-lg mb-1">上傳還原</h4><p className="text-sm text-gray-500 mb-4">將備份檔寫回資料庫 (會覆蓋舊資料)</p></div>
          {pendingFile ? (<div className="w-full bg-red-50 p-4 rounded-xl border border-red-200 animate-in fade-in zoom-in absolute inset-0 z-10 flex flex-col items-center justify-center text-center"><AlertTriangle className="w-8 h-8 text-red-500 mb-2" /><p className="text-red-800 font-bold mb-1">確定要還原嗎？</p><p className="text-xs text-red-600 mb-3">這將覆蓋現有資料且無法復原</p><div className="flex gap-2 w-full px-4"><button onClick={confirmUpload} className="flex-1 bg-red-600 text-white text-sm font-bold py-2 rounded-lg">確認覆蓋</button><button onClick={() => setPendingFile(null)} className="flex-1 bg-gray-200 text-gray-700 text-sm font-bold py-2 rounded-lg">取消</button></div></div>) : (<label className="w-full cursor-pointer"><input type="file" accept=".json" onChange={onFileSelect} disabled={processing} className="hidden" /><div className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-sm active:scale-95 transition-all flex justify-center items-center gap-2 text-lg">{processing ? "處理中..." : "選擇檔案並還原"}</div></label>)}
        </div>
      </div>
      {status && <div className={`p-4 rounded-xl text-center font-bold text-lg ${status.includes("失敗") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>{status}</div>}
      <div className="mt-8 border-t-2 border-red-100 pt-8">
        <div className="bg-red-50 p-6 md:p-8 rounded-3xl border border-red-200 space-y-6">
          {/* Fix Expiry Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-red-200 pb-6">
            <div className="text-left">
                <h4 className="text-xl font-bold text-orange-800 flex items-center gap-2 mb-2">
                    <Clock className="w-6 h-6" /> 校正舊獎品效期
                </h4>
                <p className="text-orange-700 text-sm leading-relaxed">
                    因應新規則 (6個月)，此功能可將所有<strong className="underline">已發出但未兌換</strong>的舊獎品，<br/>
                    強制重新計算效期為：<span className="font-bold">「原發送日 + 6個月」</span>。
                </p>
            </div>
            {showFixConfirm ? (
                <div className="w-full md:w-auto bg-white p-4 rounded-xl border-2 border-orange-300 shadow-sm animate-in zoom-in">
                    <p className="text-orange-800 font-bold text-sm mb-2 text-center">請輸入管理密碼確認</p>
                    <input type="password" value={resetPin} onChange={(e) => setResetPin(e.target.value)} placeholder="輸入密碼" className="w-full p-2 border border-orange-200 rounded-lg text-center mb-3 outline-none focus:border-orange-500" />
                    <div className="flex gap-2">
                        <button onClick={handleFixExpiry} className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-orange-700">確認執行</button>
                        <button onClick={() => { setShowFixConfirm(false); setResetPin(""); }} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-300">取消</button>
                    </div>
                </div>
            ) : (
                <button onClick={() => setShowFixConfirm(true)} disabled={processing} className="w-full md:w-auto bg-white border-2 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold px-6 py-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                    <Clock className="w-5 h-5" /> 執行效期校正
                </button>
            )}
          </div>

          {/* Reset Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left"><h4 className="text-xl font-bold text-red-800 flex items-center gap-2 mb-2"><RefreshCw className="w-6 h-6" /> 活動重置 (危險區域)</h4><p className="text-red-700 text-sm leading-relaxed">活動結束後使用此功能。<br />這將會 <strong className="underline">清空所有</strong> 顧客的消費金額、抽獎紀錄與<span className="underline">已兌換</span>獎品。<br /><span className="text-red-600 font-bold">(顧客帳號、未兌換獎品與集點進度將保留，方便下次活動使用)</span></p></div>
            {showResetConfirm ? (<div className="w-full md:w-auto bg-white p-4 rounded-xl border-2 border-red-300 shadow-sm animate-in zoom-in"><p className="text-red-800 font-bold text-sm mb-2 text-center">請輸入管理密碼確認重置</p><input type="password" value={resetPin} onChange={(e) => setResetPin(e.target.value)} placeholder="輸入密碼" className="w-full p-2 border border-red-200 rounded-lg text-center mb-3 outline-none focus:border-red-500" /><div className="flex gap-2"><button onClick={handleResetEvent} className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-red-700">確認執行</button><button onClick={() => { setShowResetConfirm(false); setResetPin(""); }} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-300">取消</button></div></div>) : (<button onClick={() => setShowResetConfirm(true)} disabled={processing} className="w-full md:w-auto bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold px-6 py-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"><Trash2 className="w-5 h-5" /> 結束活動並重置資料</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
// --- 🎮 遊戲中心擴充模組 Start ---

// 輔助函式：檢查是否為同一天
const isSameDay = (timestamp) => {
  if (!timestamp) return false;
  const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() &&
         date.getMonth() === now.getMonth() &&
         date.getDate() === now.getDate();
};

// 輔助函式：從設定字串隨機抽取獎品
const getRandomPrize = (prizeString) => {
  if (!prizeString) return "神秘小禮物";
  const prizes = prizeString.split(/[,，]/).map(p => p.trim()).filter(p => p); // 支援中英文逗號
  if (prizes.length === 0) return "神秘小禮物";
  return prizes[Math.floor(Math.random() * prizes.length)];
};

const GameSettings = ({ theme, isDemoMode }) => {
    const [settings, setSettings] = useState({
        dice: { enabled: false, prizes: "免費荷包蛋,折價券5元" },
        rps: { enabled: false, prizes: "免費飲料,折價券10元" },
        scratch: { enabled: false, prizes: "半價券,大雞腿乙支" }
    });
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (!isDemoMode && db) {
            getDoc(doc(db, "settings", "games")).then(snap => {
                if (snap.exists()) setSettings(snap.data());
            });
        }
    }, [isDemoMode]);

    const handleSave = async () => {
        if (isDemoMode) { setMsg("展示模式：儲存成功"); return; }
        try {
            await setDoc(doc(db, "settings", "games"), settings);
            setMsg("遊戲設定已更新！");
            setTimeout(() => setMsg(""), 3000);
        } catch (e) { setMsg("儲存失敗"); }
    };

    const toggleGame = (game, field, val) => {
        setSettings(prev => ({ ...prev, [game]: { ...prev[game], [field]: val } }));
    };

    return (
        <div className="bg-white p-6 rounded-3xl border shadow-sm max-w-2xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: theme.colors.textDark }}>
                <Gamepad2 className="w-6 h-6" style={{ color: theme.colors.primary }} /> 每日挑戰設定
            </h3>
            <div className="space-y-6">
                {[
                    { id: 'dice', name: '🎲 骰子比大小', icon: Dices },
                    { id: 'rps', name: '✌️ 剪刀石頭布', icon: Scissors },
                    { id: 'scratch', name: '🎫 美味刮刮樂', icon: Eraser }
                ].map(g => (
                    <div key={g.id} className="p-4 rounded-xl border-2 bg-gray-50" style={{ borderColor: settings[g.id]?.enabled ? theme.colors.success : '#E5E7EB' }}>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold flex items-center gap-2 text-lg">
                                <g.icon className="w-5 h-5" /> {g.name}
                            </h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings[g.id]?.enabled || false} 
                                    onChange={(e) => toggleGame(g.id, 'enabled', e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                        {settings[g.id]?.enabled && (
                            <div>
                                <label className="text-xs font-bold text-gray-500 mb-1 block">獎品池 (用逗號分隔多個獎項)</label>
                                <input type="text" value={settings[g.id]?.prizes || ""} 
                                    onChange={(e) => toggleGame(g.id, 'prizes', e.target.value)}
                                    className="w-full p-2 border rounded-lg" placeholder="例如：滷蛋,5元折價券,紅茶" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {msg && <div className="text-center mt-4 font-bold text-green-600">{msg}</div>}
            <button onClick={handleSave} className="w-full mt-6 text-white font-bold py-3 rounded-xl shadow-md" style={{ backgroundColor: theme.colors.primary }}>儲存設定</button>
        </div>
    );
};

const GameCenter = ({ userData, theme, isDemoMode, onClose }) => {
    const [gameSettings, setGameSettings] = useState(null);
    const [activeGame, setActiveGame] = useState(null); // 'dice', 'rps', 'scratch'
    const [playedStatus, setPlayedStatus] = useState({});

    useEffect(() => {
        if (isDemoMode) {
            setGameSettings({
                dice: { enabled: true, prizes: "免費滷蛋" },
                rps: { enabled: true, prizes: "折價券" },
                scratch: { enabled: true, prizes: "大獎" }
            });
            return;
        }
        if (db) {
            getDoc(doc(db, "settings", "games")).then(s => s.exists() && setGameSettings(s.data()));
        }
        // 檢查 user 上次遊玩紀錄
        if (userData && userData.gamesLastPlayed) {
            setPlayedStatus(userData.gamesLastPlayed);
        }
    }, [isDemoMode, userData]);

    const handleGameEnd = async (gameId, isWin, prizeName) => {
        if (!userData?.id) return;
        const now = new Date();
        
        // 更新本地狀態以即時顯示
        setPlayedStatus(prev => ({ ...prev, [gameId]: { seconds: now.getTime() / 1000 } }));

        if (isDemoMode) {
            if(isWin) alert(`(Demo) 恭喜獲得：${prizeName}`);
            setActiveGame(null);
            return;
        }

        const batch = writeBatch(db);
        const userRef = doc(db, "customers", userData.id);
        
        // 1. 更新最後遊玩時間
        batch.set(userRef, { 
            gamesLastPlayed: { ...playedStatus, [gameId]: serverTimestamp() } 
        }, { merge: true });

        // 2. 如果贏了，發送獎品
        if (isWin) {
            const newPrizeRef = doc(collection(db, "prizes"));
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 1); // 遊戲獎品期限1個月
            
            batch.set(newPrizeRef, {
                name: `🎮 挑戰禮：${prizeName}`,
                claimed: true, redeemed: false,
                winner: { name: userData.name, phone: userData.phone, ticketId: `GAME-${gameId.toUpperCase()}-${Date.now().toString().slice(-4)}` },
                type: 'game_reward',
                createdAt: serverTimestamp(),
                expiresAt: expiresAt
            });
        }
        await batch.commit();
        if(isWin) alert(`🎉 太棒了！獲得「${prizeName}」\n請至「我的獎品匣」查看。`);
        setActiveGame(null);
    };

    if (activeGame) {
        const commonProps = { 
            onEnd: (isWin) => handleGameEnd(activeGame, isWin, getRandomPrize(gameSettings[activeGame]?.prizes)), 
            onClose: () => setActiveGame(null), 
            theme 
        };
        if (activeGame === 'dice') return <DiceGame {...commonProps} />;
        if (activeGame === 'rps') return <RPSGame {...commonProps} />;
        if (activeGame === 'scratch') return <ScratchGame {...commonProps} />;
    }

    if (!gameSettings) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto"/></div>;

    const games = [
        { id: 'dice', name: '骰子比大小', desc: '點數大於店長就贏！', icon: Dices, color: '#3B82F6' },
        { id: 'rps', name: '剪刀石頭布', desc: '經典對決，贏了拿獎！', icon: Scissors, color: '#EAB308' },
        { id: 'scratch', name: '美味刮刮樂', desc: '刮出三個相同圖案！', icon: Eraser, color: '#EC4899' }
    ];

    return (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 relative animate-in zoom-in duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"><XCircle className="w-8 h-8 text-gray-400" /></button>
                
                <h2 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2">
                    <Gamepad2 className="w-8 h-8" style={{ color: theme.colors.primary }} /> 每日挑戰
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">每天每種遊戲限玩一次，贏了馬上領獎！</p>

                <div className="space-y-4">
                    {games.map(g => {
                        if (!gameSettings[g.id]?.enabled) return null;
                        const isPlayed = isSameDay(playedStatus[g.id]);
                        
                        return (
                            <button key={g.id} disabled={isPlayed} onClick={() => setActiveGame(g.id)}
                                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all relative overflow-hidden group ${isPlayed ? 'opacity-60 grayscale bg-gray-50 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-md bg-white'}`}
                                style={{ borderColor: isPlayed ? '#E5E7EB' : g.color }}>
                                <div className={`p-3 rounded-full text-white shadow-sm`} style={{ backgroundColor: isPlayed ? '#9CA3AF' : g.color }}>
                                    <g.icon className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    <h3 className="font-bold text-lg text-gray-800">{g.name}</h3>
                                    <p className="text-xs text-gray-500">{isPlayed ? "明日再來挑戰！" : g.desc}</p>
                                </div>
                                {isPlayed ? <CheckCircle2 className="w-6 h-6 text-gray-400" /> : <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">GO!</div>}
                            </button>
                        );
                    })}
                    {Object.values(gameSettings).every(s => !s.enabled) && (
                        <div className="text-center py-8 text-gray-400">目前沒有開放的活動，敬請期待！</div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 小遊戲組件 ---
const DiceGame = ({ onEnd, onClose, theme }) => {
    const [pScore, setPScore] = useState(0);
    const [hScore, setHScore] = useState(0);
    const [stage, setStage] = useState('ready'); // ready, rolling, result

    const roll = () => {
        setStage('rolling');
        let count = 0;
        const interval = setInterval(() => {
            setPScore(Math.ceil(Math.random() * 6));
            setHScore(Math.ceil(Math.random() * 6));
            count++;
            if (count > 10) {
                clearInterval(interval);
                const finalP = Math.ceil(Math.random() * 6);
                const finalH = Math.ceil(Math.random() * 6); // 店長稍微強一點? 不，公平隨機
                setPScore(finalP); setHScore(finalH);
                setStage('result');
                setTimeout(() => onEnd(finalP > finalH), 1500); // 贏的條件：玩家 > 店長
            }
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
            <div className="bg-white p-8 rounded-3xl w-80 text-center animate-in zoom-in">
                <h3 className="text-2xl font-bold mb-8">🎲 骰子比大小</h3>
                <div className="flex justify-around mb-8">
                    <div><p className="mb-2 text-gray-500 text-sm">你</p><div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-4xl font-bold text-blue-600 border-2 border-blue-200">{pScore || "?"}</div></div>
                    <div className="flex items-center text-gray-300 font-bold">VS</div>
                    <div><p className="mb-2 text-gray-500 text-sm">店長</p><div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-4xl font-bold text-red-600 border-2 border-red-200">{hScore || "?"}</div></div>
                </div>
                {stage === 'result' && (
                    <div className={`text-xl font-bold mb-4 ${pScore > hScore ? 'text-green-600' : 'text-gray-500'}`}>
                        {pScore > hScore ? "你贏了！" : pScore === hScore ? "平手..." : "再接再厲！"}
                    </div>
                )}
                {stage === 'ready' && (
                    <button onClick={roll} className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform" style={{ backgroundColor: theme.colors.primary }}>擲骰子</button>
                )}
                <button onClick={onClose} className="mt-4 text-gray-400 text-sm underline">放棄離開</button>
            </div>
        </div>
    );
};

const RPSGame = ({ onEnd, onClose, theme }) => {
    const options = ['✌️', '✊', '🖐️']; // 0:剪刀, 1:石頭, 2:布
    const [result, setResult] = useState(null); // null, win, lose, draw

    const play = (choice) => {
        const houseChoice = Math.floor(Math.random() * 3);
        // 0贏2, 1贏0, 2贏1
        let isWin = false;
        let isDraw = false;
        
        if (choice === houseChoice) isDraw = true;
        else if ((choice === 0 && houseChoice === 2) || (choice === 1 && houseChoice === 0) || (choice === 2 && houseChoice === 1)) isWin = true;

        if (isDraw) {
            alert(`店長也出 ${options[houseChoice]}！平手，請再出一次！`);
            return; // 平手重來
        }
        
        setResult({ player: options[choice], house: options[houseChoice], isWin });
        setTimeout(() => onEnd(isWin), 1500);
    };

    if (result) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
                <div className="bg-white p-8 rounded-3xl w-80 text-center animate-in zoom-in">
                    <div className="text-6xl mb-4">{result.isWin ? '🎉' : '😢'}</div>
                    <h3 className="text-2xl font-bold mb-2">{result.isWin ? '你贏了！' : '可惜輸了'}</h3>
                    <p className="text-gray-500 mb-6">你出 {result.player} vs 店長出 {result.house}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
            <div className="bg-white p-6 rounded-3xl w-full max-w-sm text-center animate-in zoom-in">
                <h3 className="text-2xl font-bold mb-2">✌️ 剪刀石頭布</h3>
                <p className="text-gray-500 mb-6">贏了就有獎，平手再以此！</p>
                <div className="grid grid-cols-3 gap-4">
                    {options.map((opt, idx) => (
                        <button key={idx} onClick={() => play(idx)} 
                            className="aspect-square rounded-2xl bg-gray-50 text-4xl hover:bg-blue-50 hover:scale-105 transition-all border-2 border-gray-200 shadow-sm flex items-center justify-center">
                            {opt}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 text-gray-400 text-sm underline">放棄離開</button>
            </div>
        </div>
    );
};

const ScratchGame = ({ onEnd, onClose, theme }) => {
    const [scratched, setScratched] = useState(false);
    const [isWin, setIsWin] = useState(false);
    
    const handleScratch = () => {
        if (scratched) return;
        setScratched(true);
        // 33% 機率中獎
        const win = Math.random() < 0.33;
        setIsWin(win);
        setTimeout(() => onEnd(win), 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
            <div className="bg-white p-6 rounded-3xl w-80 text-center animate-in zoom-in relative">
                 <h3 className="text-xl font-bold mb-4">🎫 幸運刮刮樂</h3>
                 <div className="relative w-64 h-32 mx-auto rounded-xl overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                     {/* 底層結果 */}
                     <div className={`text-2xl font-bold flex items-center gap-2 ${isWin ? 'text-red-500' : 'text-gray-400'}`}>
                         {isWin ? <><Gift className="animate-bounce"/> 中獎了!</> : "銘謝惠顧"}
                     </div>
                     
                     {/* 上層銀漆 (簡單模擬，點擊刮開) */}
                     {!scratched && (
                         <button onClick={handleScratch} 
                            className="absolute inset-0 bg-gray-400 flex flex-col items-center justify-center text-white hover:bg-gray-500 transition-colors z-10 cursor-pointer">
                             <Eraser className="w-8 h-8 mb-2 animate-pulse" />
                             <span className="font-bold tracking-widest">點擊刮開</span>
                         </button>
                     )}
                 </div>
                 <p className="mt-4 text-sm text-gray-500">{scratched ? (isWin ? "正在領取獎品..." : "運氣不好，明天再來！") : "祝您中大獎！"}</p>
                 {!scratched && <button onClick={onClose} className="mt-4 text-gray-400 text-sm underline">放棄離開</button>}
            </div>
        </div>
    );
};
// --- 🎮 遊戲中心擴充模組 End ---
