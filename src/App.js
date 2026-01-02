// src/App.js
import AdminDashboard from "./features/admin/AdminDashboard";
import GameCenter from "./features/games/GameCenter";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
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
  Eraser,
  Send,
  History
} from "lucide-react";

import ParticleEffect from "./components/ui/ParticleEffect";
import Header from "./components/ui/Header";

// --- 引入設定 ---
import { auth, db } from "./config/firebase";
import { maskTicketId, isSameDay, getRandomPrize } from "./utils/helpers";
import { THEMES, ADMIN_PIN, LINE_ID, MENU_URL } from "./config/constants";
import EasterEggModal from "./components/ui/EasterEggModal";
import RedeemModal from "./components/ui/RedeemModal";
import WinnersList from "./components/display/WinnersList";
import LoyaltyPromoCard from "./components/display/LoyaltyPromoCard";
import PrizeShowcase from "./components/display/PrizeShowcase";
import LoyaltyCard from "./components/display/LoyaltyCard";

// --- Theme Context Provider ---
const ThemeContext = React.createContext();

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
  
  // --- 新增：紀錄是否需要自動開啟回報視窗 ---
  const [initialAction, setInitialAction] = useState(null);

  // --- 遊戲設定狀態 ---
  const [gameSettings, setGameSettings] = useState({}); 

  const theme = THEMES[currentThemeId] || THEMES.christmas;

  // 計算是否有任何遊戲是開啟的 (Demo模式預設開啟)
  const hasActiveGames = useMemo(() => {
      if (isDemoMode) return true;
      return Object.values(gameSettings).some(game => game.enabled === true);
  }, [gameSettings, isDemoMode]);

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

  // --- 同時監聽全域設定與遊戲設定 ---
  useEffect(() => {
    let unsubGlobal = () => {};
    let unsubGames = () => {};

    if (db && user && !isDemoMode) {
        try {
            const settingsRef = doc(db, "settings", "global");
            unsubGlobal = onSnapshot(settingsRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.activeTheme) setCurrentThemeId(data.activeTheme);
                    if (data.eventType) setEventType(data.eventType);
                }
            }, (err) => console.error("Global settings error:", err));

            const gamesRef = doc(db, "settings", "games");
            unsubGames = onSnapshot(gamesRef, (docSnap) => {
                if (docSnap.exists()) {
                    setGameSettings(docSnap.data());
                }
            }, (err) => console.error("Game settings error:", err));

        } catch(e) { console.log("DB error", e); }
    }
    return () => { unsubGlobal(); unsubGames(); };
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
            {view === "landing" && <LandingPage setView={setView} goToMenu={goToMenu} theme={theme} eventType={eventType} hasActiveGames={hasActiveGames} setInitialAction={setInitialAction} />}
            {view === "admin-login" && <AdminLogin setView={setView} theme={theme} isDemoMode={isDemoMode} />}
            {view === "customer-login" && <CustomerLogin setView={setView} setCurrentUserData={setCurrentUserData} theme={theme} isDemoMode={isDemoMode} />}
            {view === "menu-view" && <MenuView goBack={goBackFromMenu} theme={theme} />}
            {view === "admin-dash" && <AdminDashboard user={user} theme={theme} isDemoMode={isDemoMode} setCurrentThemeId={setCurrentThemeId} setEventType={setEventType} eventType={eventType} />}
            {view === "customer-dash" && <CustomerDashboard userData={currentUserData} goToMenu={goToMenu} theme={theme} isDemoMode={isDemoMode} eventType={eventType} hasActiveGames={hasActiveGames} initialAction={initialAction} setInitialAction={setInitialAction} />}
        </main>
        </div>
    </ThemeContext.Provider>
  );
}

// ... ConfigErrorView, LoadingView, MenuView, LandingPage, AdminLogin, CustomerLogin 保持不變 ...
// 為節省篇幅，僅修改 CustomerDashboard，其他組件請保留原始檔案內容，或者我可以重新生成完整的 App.js
// 為了符合 File Generation 規範，我將會生成完整的 App.js 內容。

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

function LandingPage({ setView, goToMenu, theme, eventType = 'both', hasActiveGames, setInitialAction }) {
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
                      <>買餐盒<span className="font-bold text-xl md:text-2xl" style={{ color: theme.colors.primary }}>集點數</span>，美味好禮等你換！</>
                  )}
              </p>
            </div>
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
                  {/* 新增：累積點數說明 */}
                  <div className="mt-2 pt-2 border-t border-dashed border-gray-300">
                    <p className="text-sm">💡 <strong>如何累積？</strong> 點擊下方「登記消費」➜ 輸入餐盒數量 ➜ 店長確認即完成！</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      )}

      {!isNone && showLottery && <PrizeShowcase theme={theme} />}
      {!isNone && showLottery && <WinnersList theme={theme} />}
      {!isNone && showLoyalty && <LoyaltyPromoCard theme={theme} />}

      <div className="w-full max-w-sm md:max-w-md space-y-4 z-10 relative pt-4">
        {hasActiveGames && (
            <button onClick={() => setView("customer-login")} className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg md:text-xl transition-all active:scale-95 group animate-in slide-in-from-bottom-2 border-2 border-white/20">
                <Gamepad2 className="w-7 h-7 animate-bounce" /> 
                <span>每日挑戰 (贏免費好禮)</span>
            </button>
        )}

        {/* 新增：直接登記消費按鈕 */}
        <button 
            onClick={() => { setInitialAction('report'); setView("customer-login"); }} 
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg md:text-xl transition-all active:scale-95 group hover:bg-blue-700 animate-in slide-in-from-bottom-2 border-2 border-white/20"
        >
            <Edit3 className="w-7 h-7" />
            <span>📝 登記消費 (集點)</span>
        </button>

        <button onClick={goToMenu} className="w-full font-bold py-4 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 text-lg md:text-xl transition-all"
                style={{ backgroundColor: theme.colors.accent, color: theme.colors.textDark }}>
          <Utensils className="w-6 h-6" /> 查看美味菜單
        </button>
        <button onClick={() => setView("customer-login")} className="w-full bg-white border-2 font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 text-lg md:text-xl transition-all active:scale-95 group hover:brightness-95"
                style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}>
          <User className="w-6 h-6 group-hover:scale-110 transition-transform" /> 我是顧客 (查詢/登入)
        </button>
        <button onClick={() => setView("admin-login")} className="w-full backdrop-blur-sm border border-white/30 text-white hover:bg-white/10 font-bold py-4 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 text-lg md:text-xl transition-all">
          <Lock className="w-6 h-6" style={{ color: theme.colors.accent }} /> 店長登入 (後台)
        </button>
      </div>

      <div className="mt-8 w-full max-w-md bg-black/40 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 text-center space-y-3 z-10 relative text-white">
        <h3 className="font-bold border-b border-white/20 pb-2 mb-2 flex items-center justify-center gap-2" style={{ color: theme.colors.accent }}>
            <Store className="w-4 h-4" /> 店家資訊
        </h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.accent }} /> 
            <span className="font-medium text-white/80">餐盒訂購專線：</span> 
            <a href="tel:0903282278" className="font-bold hover:text-white transition-colors border-b border-dashed" style={{ color: theme.colors.accent }}>0903-282278</a>
          </div>
          <div className="flex items-start justify-center gap-2">
            <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: theme.colors.success }} />
            <div className="text-left"><span className="font-medium text-white/80">地址：</span> <a href="https://www.google.com/maps/search/?api=1&query=台中市北區文心路四段198-1號" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" style={{ color: theme.colors.accent }}>台中市北區文心路四段198-1號</a></div>
          </div>
        </div>
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
          className="w-full p-4 border rounded-xl text-center text-xl tracking-widest outline-none focus:ring-2 text-black"
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
        <div><label className="block text-base font-medium text-gray-600 mb-2">手機號碼</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0912345678" className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-800 text-lg bg-gray-50 text-black" required inputMode="tel" /></div>
        {isRegistering && <div className="animate-in slide-in-from-top-2"><label className="block text-base font-medium text-gray-600 mb-2">您的稱呼</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="例如: 王小明" className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-800 text-lg bg-gray-50 text-black" required /></div>}
        <div><label className="block text-base font-medium text-gray-600 mb-2">{isRegistering ? "設定查詢密碼 (4-6碼)" : "查詢密碼"}</label><input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="••••" className="w-full p-4 border border-gray-300 rounded-xl outline-none text-gray-800 text-lg bg-gray-50 text-black" required inputMode="numeric" /></div>
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

// --------------------------------------------------------
// CustomerDashboard: 新增自我回報功能
// --------------------------------------------------------
function CustomerDashboard({ userData, goToMenu, theme, isDemoMode, eventType = 'both', hasActiveGames, initialAction, setInitialAction }) {
  const [data, setData] = useState(userData);
  const [myPrizes, setMyPrizes] = useState([]);
  const [confirmRedeemId, setConfirmRedeemId] = useState(null);
  const [loyaltySettings, setLoyaltySettings] = useState({ 10: theme.milestoneText, 15: theme.milestoneText, 20: theme.milestoneText });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showGameCenter, setShowGameCenter] = useState(false);

  // --- 新增：自我回報相關狀態 ---
  const [showSelfCheckIn, setShowSelfCheckIn] = useState(false);
  const [reportAmount, setReportAmount] = useState("");
  const [reportBento, setReportBento] = useState("");
  const [reportDate, setReportDate] = useState(new Date().toISOString().split("T")[0]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [reportMsg, setReportMsg] = useState("");

  const showLottery = eventType === 'lottery' || eventType === 'both';
  const showLoyalty = eventType === 'loyalty' || eventType === 'both';
  const isNone = eventType === 'none';

  // --- 新增：監聽 initialAction (自動開啟回報視窗) ---
  useEffect(() => {
    if (initialAction === 'report') {
        setShowSelfCheckIn(true);
        if (setInitialAction) setInitialAction(null); // 開啟後重置，避免重複觸發
    }
  }, [initialAction, setInitialAction]);

  useEffect(() => {
    if (!userData?.id) return;
    
    if (isDemoMode) {
        // ... demo mode logic ...
        const nextYear = new Date();
        nextYear.setMonth(nextYear.getMonth() + 6);
        setMyPrizes([
            { id: "demo-prize-1", name: "🎁 集點好禮：免費小菜", claimed: true, redeemed: false, winner: { ticketId: "LOYALTY-10PTS-9999" }, expiresAt: { seconds: nextYear.getTime() / 1000, toDate: () => nextYear } },
        ]);
        setPendingRequests([
          { id: 'p1', date: '2023-10-30', amount: 100, bentoQty: 1, status: 'pending' }
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

    // --- 新增：監聽自己的待審核申請 ---
    const qRequests = query(
      collection(db, "pending_requests"), 
      where("customerId", "==", userData.id),
      where("status", "==", "pending")
    );
    const unsubRequests = onSnapshot(qRequests, (snapshot) => {
      setPendingRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubscribe(); unsubPrizes(); unsubSettings(); unsubRequests(); };
  }, [userData, isDemoMode]);

  const totalTickets = Math.floor((data.totalSpent || 0) / 300);
  const usedTickets = data.usedTicketCount || 0;
  const nextTicketNeeds = 300 - ((data.totalSpent || 0) % 300);
  const openLine = () => window.open(`https://line.me/R/ti/p/${LINE_ID}`, "_blank");

  // --- 新增：處理自我回報送出 ---
  const handleSelfReport = async (e) => {
    e.preventDefault();
    if (!reportAmount && !reportBento) return;

    if (isDemoMode) {
      setReportMsg("展示模式：申請已送出！待店長審核。");
      setTimeout(() => {
         setShowSelfCheckIn(false);
         setReportMsg("");
         setReportAmount("");
         setReportBento("");
      }, 1500);
      return;
    }

    try {
      await addDoc(collection(db, "pending_requests"), {
        customerId: data.id,
        customerName: data.name || data.phone,
        date: reportDate,
        amount: parseInt(reportAmount || 0),
        bentoQty: parseInt(reportBento || 0),
        status: "pending",
        timestamp: serverTimestamp()
      });
      setReportMsg("申請已送出！請等待店長確認。");
      setTimeout(() => {
        setShowSelfCheckIn(false);
        setReportMsg("");
        setReportAmount("");
        setReportBento("");
      }, 1500);
    } catch (error) {
      console.error("Report failed:", error);
      setReportMsg("送出失敗，請稍後再試");
    }
  };

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

      {showGameCenter && <GameCenter userData={userData} theme={theme} isDemoMode={isDemoMode} onClose={() => setShowGameCenter(false)} />}

      {/* --- 自我回報 Modal --- */}
      {showSelfCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 relative">
             <button onClick={() => setShowSelfCheckIn(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
               <XCircle className="w-6 h-6" />
             </button>
             <h3 className="text-xl font-bold flex items-center gap-2 text-gray-800">
               <Edit3 className="w-6 h-6 text-blue-500" /> 消費回報申請
             </h3>
             <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-xl border border-blue-100">
               請輸入您今日的消費，店長確認後會自動加入您的帳戶！
             </p>
             <form onSubmit={handleSelfReport} className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-600 mb-1">消費日期</label>
                 <input type="date" value={reportDate} onChange={e => setReportDate(e.target.value)} className="w-full p-3 border rounded-xl text-lg bg-gray-50 text-black" />
               </div>
               <div className="flex gap-3">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-600 mb-1">消費金額</label>
                   <input type="number" placeholder="$" value={reportAmount} onChange={e => setReportAmount(e.target.value)} className="w-full p-3 border rounded-xl text-lg font-bold text-center bg-gray-50 text-black" inputMode="numeric" />
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-600 mb-1">餐盒數量</label>
                   <input type="number" placeholder="0" value={reportBento} onChange={e => setReportBento(e.target.value)} className="w-full p-3 border rounded-xl text-lg font-bold text-center bg-gray-50 text-black" inputMode="numeric" />
                 </div>
               </div>
               {reportMsg && <p className="text-center text-green-600 font-bold text-sm">{reportMsg}</p>}
               <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                 <Send className="w-5 h-5" /> 送出申請
               </button>
             </form>
          </div>
        </div>
      )}

      <div className="space-y-6">
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

        {!isNone && showLoyalty && (
            <LoyaltyCard points={data.points || 0} redeemedMilestones={data.redeemedMilestones || []} onRedeemClick={openRedeemModal} theme={theme} settings={loyaltySettings} />
        )}

        {activePrizes.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 animate-in slide-in-from-bottom-2" style={{ borderColor: theme.colors.accent }}>
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg border-b pb-2" style={{ color: theme.colors.textDark, borderColor: theme.colors.cardBorder }}><Gift className="w-6 h-6" style={{ color: theme.colors.primary }} /> 我的獎品匣</h3>
            <div className="space-y-3">
              {activePrizes.map((prize) => (
                <div key={prize.id} className={`p-4 rounded-xl border-2 flex flex-col gap-3 transition-all ${prize.redeemed ? "bg-gray-50 border-gray-200 grayscale" : "bg-gray-50 shadow-sm"}`} style={{ borderColor: prize.redeemed ? '#E5E7EB' : theme.colors.accent }}>
                  {/* ... Prize content same as before ... */}
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

        {!isNone && showLottery && (
            <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 flex flex-col gap-3" style={{ borderColor: theme.colors.secondary }}>
              <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3"><span className="font-medium text-gray-600">總獲得券數</span><div className="flex items-center gap-2 text-2xl font-bold" style={{ color: theme.colors.secondary }}><Ticket className="w-6 h-6" /> {totalTickets} <span className="text-base font-normal text-gray-400">張</span></div></div>
              <div className="flex justify-between items-center pt-1"><span className="font-medium text-gray-600">下一張還差</span><span className="text-xl font-bold" style={{ color: theme.colors.textDark }}>${nextTicketNeeds}</span></div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2 overflow-hidden"><div className="h-2.5 rounded-full transition-all duration-1000" style={{ width: `${((data.totalSpent % 300) / 300) * 100}%`, backgroundColor: theme.colors.success }}></div></div>
            </div>
        )}

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
        
        {/* --- 修改：新增「消費回報」按鈕 --- */}
        <div className="space-y-4">
            {hasActiveGames && (
                <button onClick={() => setShowGameCenter(true)} className="w-full text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-in slide-in-from-left-2 group">
                    <Gamepad2 className="w-6 h-6 animate-bounce" /> 
                    <span className="text-lg group-hover:scale-105 transition-transform">每日挑戰 (贏免費好禮)</span>
                </button>
            )}

            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowSelfCheckIn(true)} className="text-white font-bold py-6 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 transition-all group bg-blue-500 hover:bg-blue-600">
                    <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform"><Edit3 className="w-8 h-8 text-white" /></div><span className="text-lg">消費回報</span>
                </button>
                <button onClick={goToMenu} className="text-white font-bold py-6 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 transition-all group" style={{ backgroundColor: theme.colors.secondary }}>
                    <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform"><Utensils className="w-8 h-8 text-white" /></div><span className="text-lg">查看菜單</span>
                </button>
            </div>
            
            <button onClick={openLine} className="w-full text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2" style={{ backgroundColor: theme.colors.success }}>
                <MessageCircle className="w-6 h-6" /> 
                <span>聯絡店長 (LINE)</span>
            </button>
        </div>

        {/* 累積點數說明 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border" style={{ borderColor: theme.colors.cardBorder }}>
          <h3 className="font-bold mb-4 flex items-center gap-2 text-lg" style={{ color: theme.colors.textDark }}><PlusCircle className="w-6 h-6" style={{ color: theme.colors.success }} /> 如何累積點數？</h3>
          <p className="text-gray-700 text-base leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
              點擊上方的<strong className="text-blue-600">「消費回報」</strong>按鈕，輸入您的消費金額與餐盒數量。店長收到通知並確認無誤後，點數就會自動入帳喔！
          </p>
        </div>

        {/* 待審核列表 (New) */}
        {pendingRequests.length > 0 && (
          <div className="bg-blue-50 p-6 rounded-2xl shadow-sm border border-blue-100 flex-1">
             <h3 className="font-bold mb-4 border-b border-blue-200 pb-2 text-lg text-blue-800 flex items-center gap-2">
               <History className="w-5 h-5" /> 審核中的申請
             </h3>
             <div className="space-y-3">
               {pendingRequests.map(req => (
                 <div key={req.id} className="bg-white p-3 rounded-xl border border-blue-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{req.date}</p>
                      <p className="text-xs text-gray-500">申請中...</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-gray-800">${req.amount}</p>
                       {req.bentoQty > 0 && <p className="text-xs font-bold text-green-600">+{req.bentoQty} 點</p>}
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* 消費紀錄 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border flex-1" style={{ borderColor: theme.colors.cardBorder }}>
          <h3 className="font-bold mb-4 border-b border-gray-100 pb-2 text-lg" style={{ color: theme.colors.textDark }}>最近已核准紀錄</h3>
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