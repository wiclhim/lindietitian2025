import React, { useState, useEffect, useRef } from "react";
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
} from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
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
} from "lucide-react";

// --- Firebase Initialization (CodeSandbox 設定區) ---
// ⚠️ 請在此處填入你的 Firebase 設定 (從 Firebase Console -> Project Settings 複製)
const firebaseConfig = {
  apiKey: "AIzaSyAJdTZN7LZxWv_B76NkCyC6Vn2S4YkPdSE",
  authDomain: "lindietitian-85b48.firebaseapp.com",
  projectId: "lindietitian-85b48",
  storageBucket: "lindietitian-85b48.firebasestorage.app",
  messagingSenderId: "513298519750",
  appId: "1:513298519750:web:4c6ed87c840fd23fc029c7",
  measurementId: "G-5JTJ33TWVV",
};

// 初始化檢查
let app, auth, db;
try {
  if (
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("YOUR_API_KEY")
  ) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase 初始化失敗，請檢查 firebaseConfig", error);
}

// --- Global Constants ---
const ADMIN_PIN = "1225";
const LINE_ID = "@171kndrh";

// 圖片連結
const LOGO_URL = "https://i.ibb.co/GvSs1BtJ/1765508995830.png";
const MENU_URL = "https://i.ibb.co/Rk0Ccjqn/image.jpg";

// --- Helper Functions ---
const maskTicketId = (ticketId) => {
  if (!ticketId) return "N/A";
  // 假設格式為 0912345678-01，將中間 6 碼替換為 *
  return ticketId.replace(/^(\d{4})\d{6}(.*)$/, "$1******$2");
};

// --- Main Application Component ---
export default function ChristmasEventApp() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("landing");
  const [currentUserData, setCurrentUserData] = useState(null);
  const [prevView, setPrevView] = useState("landing");
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(false);

  // Auth Effect
  useEffect(() => {
    if (!auth || firebaseConfig.apiKey.includes("YOUR_API_KEY")) {
      setConfigError(true);
      setLoading(false);
      return;
    }

    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Auth failed:", error);
        if (
          error.code === "auth/api-key-not-valid" ||
          error.message.includes("api-key")
        ) {
          setConfigError(true);
        }
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    setView("landing");
    setCurrentUserData(null);
  };

  const goToMenu = () => {
    setPrevView(view);
    setView("menu-view");
  };

  const goBackFromMenu = () => {
    setView(prevView);
  };

  if (configError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFBF7] text-[#4A3728] p-4 text-center">
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-[#E6D5B8] max-w-lg w-full animate-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-[#FEF2F2] p-4 rounded-full">
              <Settings className="w-12 h-12 text-[#B91C1C] animate-spin-slow" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-3 text-[#5D4037]">
            還差最後一步！
          </h1>
          <p className="text-[#8D6E63] mb-6 leading-relaxed">
            為了讓 App 運作，你需要填入 Firebase 設定。
            <br />
            這能確保你的資料安全地儲存在自己的資料庫中。
          </p>

          <div className="bg-[#FAF9F6] p-5 rounded-xl text-left border border-[#D7CCC8] mb-6 text-sm shadow-inner">
            <p className="font-bold mb-3 text-[#5D4037] flex items-center gap-2">
              <span className="bg-[#B91C1C] text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                !
              </span>
              設定步驟：
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-[#5D4037]">
              <li>回到程式碼編輯器 (看程式碼的部分)</li>
              <li>
                找到最上方的{" "}
                <code className="bg-[#EFEBE9] px-1.5 py-0.5 rounded border border-[#D7CCC8] font-mono text-[#B91C1C]">
                  const firebaseConfig
                </code>
              </li>
              <li>
                將{" "}
                <code className="font-mono text-gray-400">
                  YOUR_API_KEY_HERE
                </code>{" "}
                等內容替換為你的 Firebase 設定
              </li>
            </ol>
          </div>

          <a
            href="https://console.firebase.google.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-[#4A3426] text-[#EFEBE9] px-6 py-4 rounded-xl font-bold hover:bg-[#3E2723] transition-all hover:scale-[1.02] shadow-md w-full"
          >
            前往 Firebase Console 取得設定 <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-[#B91C1C] font-bold bg-[#FDFBF7] text-xl gap-3">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#B91C1C]"></div>
        聖誕小屋準備中...
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen bg-[#FDFBF7] text-[#4A3728]">
        連線中...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#4A3728] text-base md:text-lg selection:bg-[#FCD34D] selection:text-[#4A3728]">
      {/* Dynamic Header: Wood & Red Theme */}
      <header className="bg-[#8B1E1E] text-[#FFF8E7] p-4 shadow-lg sticky top-0 z-20 border-b-4 border-[#C5A059]">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity"
            onClick={() => setView("landing")}
          >
            <Gift className="w-7 h-7 text-[#FCD34D]" />
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-wider drop-shadow-sm leading-tight">
                木木營養食
              </h1>
              <p className="text-[10px] md:text-xs text-[#FCA5A5] font-medium tracking-widest uppercase">
                Christmas Event
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {view !== "landing" && view !== "menu-view" && (
              <button
                onClick={goToMenu}
                className="text-xs md:text-sm bg-[#C5A059] hover:bg-[#B08D55] text-[#3E2723] font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm border border-[#3E2723]/20 active:scale-95"
              >
                <Utensils className="w-4 h-4" />{" "}
                <span className="hidden md:inline">查看</span>菜單
              </button>
            )}
            {view !== "landing" && (
              <button
                onClick={handleLogout}
                className="text-xs md:text-sm bg-[#5D4037] hover:bg-[#3E2723] text-white px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm active:scale-95"
              >
                <LogOut className="w-4 h-4" />{" "}
                <span className="hidden md:inline">登出</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Router */}
      <main className="max-w-lg md:max-w-5xl mx-auto p-4 md:p-8 pb-24 md:pb-12">
        {view === "landing" && (
          <LandingPage setView={setView} goToMenu={goToMenu} />
        )}
        {view === "admin-login" && <AdminLogin setView={setView} />}
        {view === "customer-login" && (
          <CustomerLogin
            setView={setView}
            setCurrentUserData={setCurrentUserData}
          />
        )}
        {view === "menu-view" && <MenuView goBack={goBackFromMenu} />}

        {view === "admin-dash" && <AdminDashboard user={user} />}
        {view === "customer-dash" && (
          <CustomerDashboard userData={currentUserData} goToMenu={goToMenu} />
        )}
      </main>
    </div>
  );
}

// --- View: Menu ---
function MenuView({ goBack }) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-[#8D6E63] font-bold hover:text-[#5D4037] mb-2 px-2 py-1 rounded hover:bg-[#EFEBE9] transition-colors"
      >
        <ArrowLeft className="w-6 h-6" /> 返回
      </button>

      <div className="bg-white p-4 md:p-8 rounded-3xl shadow-xl border-2 border-[#E6D5B8]">
        <h2 className="text-2xl md:text-3xl font-bold text-[#5D4037] mb-6 flex items-center gap-3 border-b-2 border-[#F5F5F5] pb-4">
          <Utensils className="text-[#B91C1C] w-8 h-8" /> 木木營養食 美味菜單
        </h2>
        <div className="flex justify-center bg-[#FAF9F6] rounded-2xl overflow-hidden min-h-[300px] md:min-h-[500px] items-center border border-dashed border-[#D7CCC8]">
          <img
            src={MENU_URL}
            alt="店內菜單"
            className="max-w-full h-auto object-contain shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://placehold.co/600x800?text=Menu+Image+Not+Found";
            }}
          />
        </div>
        <p className="text-center text-[#8D6E63] text-sm md:text-base mt-6 bg-[#FFF8E1] py-2 rounded-lg">
          * 餐點內容依現場供應為主，圖片僅供參考
        </p>
      </div>
    </div>
  );
}

// --- 1. Public Views (Landing & Login) ---

function LandingPage({ setView, goToMenu }) {
  return (
    <div className="flex flex-col items-center justify-center pt-4 md:pt-10 px-2 space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Logo Section */}
      <div className="bg-white p-1 rounded-full shadow-xl border-[6px] border-[#15803D] w-40 h-40 md:w-56 md:h-56 flex items-center justify-center overflow-hidden mb-2 relative ring-4 ring-[#15803D]/20">
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
          <img
            src={LOGO_URL}
            alt="Store Logo"
            className="w-full h-full object-cover scale-150"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div className="hidden w-full h-full flex-col items-center justify-center text-gray-300 bg-gray-50">
            <Store className="w-12 h-12 mb-1" />
            <span className="text-xs">Logo</span>
          </div>
        </div>
        {/* Decoration */}
        <div className="absolute -top-1 -right-1 transform rotate-12">
          <Gift className="w-12 h-12 md:w-16 md:h-16 text-[#B91C1C] drop-shadow-md" />
        </div>
      </div>

      <div className="text-center space-y-3 md:space-y-4 max-w-lg">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#4A3728] leading-tight">
          歡迎光臨
          <br />
          <span className="text-[#B91C1C] inline-block mt-2">木木</span>營養食！
        </h2>
        <div className="bg-[#FFF8E1] px-4 py-2 rounded-full inline-block border border-[#FDE68A]">
          <p className="text-[#8D6E63] font-medium text-lg md:text-xl">
            消費滿{" "}
            <span className="font-bold text-[#D97706] text-xl md:text-2xl">
              300
            </span>{" "}
            元贈聖誕摸彩券
          </p>
        </div>
        <p className="text-[#B91C1C] text-sm md:text-base font-bold animate-pulse">
          (金額可跨日累積喔！)
        </p>
      </div>

      <div className="w-full max-w-sm md:max-w-md space-y-4">
        {/* Menu Button */}
        <button
          onClick={goToMenu}
          className="w-full bg-[#E0AC4D] text-[#3E2723] hover:bg-[#D4A040] font-bold py-4 rounded-2xl shadow-[0_4px_0_rgb(180,130,50)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 text-lg md:text-xl transition-all"
        >
          <Utensils className="w-6 h-6" /> 查看美味菜單
        </button>

        {/* Customer Button */}
        <button
          onClick={() => setView("customer-login")}
          className="w-full bg-white border-2 border-[#B91C1C] text-[#B91C1C] hover:bg-[#FEF2F2] font-bold py-4 rounded-2xl shadow-sm flex items-center justify-center gap-3 text-lg md:text-xl transition-all active:scale-95 group"
        >
          <User className="w-6 h-6 group-hover:scale-110 transition-transform" />{" "}
          我是顧客 (查詢/註冊)
        </button>

        {/* Admin Button */}
        <button
          onClick={() => setView("admin-login")}
          className="w-full bg-[#4A3426] text-[#EFEBE9] hover:bg-[#3E2723] font-bold py-4 rounded-2xl shadow-[0_4px_0_rgb(40,20,10)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 text-lg md:text-xl transition-all opacity-80 hover:opacity-100"
        >
          <Lock className="w-6 h-6 text-[#C5A059]" /> 店長登入 (後台)
        </button>
      </div>

      {/* Info Box */}
      <div className="w-full max-w-md mt-8 p-5 bg-[#FEF2F2] rounded-2xl text-sm md:text-base text-[#991B1B] text-center border border-[#FECACA] shadow-inner relative overflow-hidden">
        <div className="relative z-10 leading-relaxed">
          <h3 className="font-bold text-lg mb-2 flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" /> 聖誕活動期間：12/15 ~ 12/25
          </h3>
          <div className="mt-2 text-[#7F1D1D] font-medium bg-white/60 p-3 rounded-xl backdrop-blur-sm">
            <p>只要報手機號碼，消費金額</p>
            <p className="text-lg font-bold my-1 text-[#B91C1C]">
              ✨ 可跨日一直累積 ✨
            </p>
            <p>每滿 300 元自動獲得一張摸彩券</p>
          </div>
        </div>
        {/* Decorations */}
        <Star className="absolute -bottom-4 -left-4 w-20 h-20 text-[#15803D] opacity-10 rotate-12" />
        <Star className="absolute -top-4 -right-4 w-20 h-20 text-[#15803D] opacity-10 -rotate-12" />
      </div>
    </div>
  );
}

function AdminLogin({ setView }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setView("admin-dash");
    } else {
      setError("密碼錯誤");
      setPin("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-3xl shadow-xl border-2 border-[#E6D5B8]">
      <h2 className="text-2xl font-bold text-center mb-8 flex justify-center items-center gap-2 text-[#5D4037]">
        <Lock className="w-6 h-6 text-[#C5A059]" /> 店長驗證
      </h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-base font-medium text-[#8D6E63] mb-2">
            管理密碼
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-4 border-2 border-[#D7CCC8] rounded-xl text-center text-3xl tracking-[0.5em] focus:border-[#B91C1C] focus:ring-1 focus:ring-[#B91C1C] outline-none transition-colors placeholder:tracking-normal"
            placeholder="請輸入密碼"
            inputMode="numeric" // Mobile numeric keypad
            autoFocus
          />
        </div>
        {error && (
          <p className="text-[#B91C1C] text-center font-bold bg-[#FEF2F2] p-2 rounded-lg">
            {error}
          </p>
        )}
        <button className="w-full bg-[#4A3426] text-[#EFEBE9] hover:bg-[#3E2723] font-bold py-4 rounded-xl shadow-md active:scale-95 transition-transform text-lg">
          進入後台
        </button>
      </form>
    </div>
  );
}

function CustomerLogin({ setView, setCurrentUserData }) {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // 使用標準集合路徑，適合 CodeSandbox 新專案
  const customersRef = collection(db, "customers");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      const docRef = doc(customersRef, phone);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.pin === pin) {
          setCurrentUserData({ id: docSnap.id, ...data });
          setView("customer-dash");
        } else {
          setMsg("密碼錯誤，請重試");
        }
      } else {
        setMsg("找不到此號碼，請先註冊");
        setIsRegistering(true);
      }
    } catch (err) {
      console.error(err);
      setMsg("系統忙碌中，請稍後再試");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!phone || !pin || !name) return;
    setLoading(true);

    try {
      const docRef = doc(customersRef, phone);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMsg("此號碼已註冊過，請直接登入");
        setIsRegistering(false);
      } else {
        const newUser = {
          phone,
          name,
          pin,
          totalSpent: 0,
          usedTicketCount: 0, // 新增：已使用票券數
          joinedAt: serverTimestamp(),
          history: [],
        };
        await setDoc(docRef, newUser);
        setCurrentUserData({ id: phone, ...newUser });
        setView("customer-dash");
      }
    } catch (err) {
      console.error(err);
      setMsg("註冊失敗: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 md:p-8 rounded-3xl shadow-xl border-t-8 border-[#B91C1C]">
      <h2 className="text-2xl font-bold text-center mb-8 text-[#5D4037]">
        {isRegistering ? "新顧客註冊" : "顧客查詢/登入"}
      </h2>

      <form
        onSubmit={isRegistering ? handleRegister : handleLogin}
        className="space-y-5"
      >
        <div>
          <label className="block text-base font-medium text-[#8D6E63] mb-2">
            手機號碼
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0912345678"
            className="w-full p-4 border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#B91C1C] outline-none text-[#4A3728] text-lg bg-[#FAF9F6]"
            required
            inputMode="tel"
          />
        </div>

        {isRegistering && (
          <div className="animate-in slide-in-from-top-2">
            <label className="block text-base font-medium text-[#8D6E63] mb-2">
              您的稱呼
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如: 王小明"
              className="w-full p-4 border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#B91C1C] outline-none text-[#4A3728] text-lg bg-[#FAF9F6]"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-base font-medium text-[#8D6E63] mb-2">
            {isRegistering ? "設定查詢密碼 (4-6碼)" : "查詢密碼"}
          </label>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            className="w-full p-4 border border-[#D7CCC8] rounded-xl focus:ring-2 focus:ring-[#B91C1C] outline-none text-[#4A3728] text-lg bg-[#FAF9F6]"
            required
            inputMode="numeric"
          />
        </div>

        {msg && (
          <p className="text-[#B91C1C] text-base font-bold text-center bg-[#FEF2F2] p-3 rounded-xl border border-[#FECACA]">
            {msg}
          </p>
        )}

        <button
          disabled={loading}
          className="w-full bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold py-4 rounded-xl shadow-[0_4px_0_rgb(139,28,28)] active:shadow-none active:translate-y-1 transition-all disabled:opacity-50 text-lg md:text-xl mt-4"
        >
          {loading ? "處理中..." : isRegistering ? "立即註冊" : "登入查詢"}
        </button>

        <div className="text-center pt-4">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMsg("");
            }}
            className="text-base text-[#8D6E63] hover:text-[#B91C1C] underline decoration-dashed p-2"
          >
            {isRegistering ? "已經有帳號？返回登入" : "第一次來？點此註冊"}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- 2. Customer Dashboard View (Responsive Split) ---

function CustomerDashboard({ userData, goToMenu }) {
  const [data, setData] = useState(userData);
  const [myPrizes, setMyPrizes] = useState([]);
  const [confirmRedeemId, setConfirmRedeemId] = useState(null); // ID of prize being redeemed

  useEffect(() => {
    if (!userData?.id) return;
    const docRef = doc(db, "customers", userData.id);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() });
      }
    });

    // Subscribe to Won Prizes (自動發放的獎品)
    // Query prizes where winner.phone == user phone
    const qPrizes = query(
      collection(db, "prizes"),
      where("winner.phone", "==", userData.phone)
    );
    const unsubPrizes = onSnapshot(qPrizes, (snapshot) => {
      const prizes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMyPrizes(prizes);
    });

    return () => {
      unsubscribe();
      unsubPrizes();
    };
  }, [userData]);

  const totalTickets = Math.floor((data.totalSpent || 0) / 300);
  const usedTickets = data.usedTicketCount || 0;
  const nextTicketNeeds = 300 - ((data.totalSpent || 0) % 300);

  const openLine = () => {
    window.open(`https://line.me/R/ti/p/${LINE_ID}`, "_blank");
  };

  const handleRedeem = async (prizeId) => {
    try {
      await updateDoc(doc(db, "prizes", prizeId), {
        redeemed: true,
        redeemedAt: serverTimestamp(),
      });
      setConfirmRedeemId(null);
    } catch (error) {
      console.error("Redeem failed:", error);
      alert("兌換失敗，請稍後再試");
    }
  };

  return (
    <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8 animate-in fade-in duration-500">
      {/* Column 1: The "Card" and Info */}
      <div className="space-y-6">
        {/* Wallet Card - Enhanced for Mobile */}
        <div className="bg-gradient-to-br from-[#8B1E1E] to-[#5C1414] text-[#FFF8E7] p-6 md:p-8 rounded-3xl shadow-2xl relative overflow-hidden border-2 border-[#C5A059] min-h-[220px] flex flex-col justify-between transform transition hover:scale-[1.01]">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Gift className="w-48 h-48 text-[#FCD34D]" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="opacity-90 mb-1 text-[#FCD34D] font-medium text-sm md:text-base">
                  MEMBER CARD
                </p>
                <p className="font-bold text-2xl md:text-3xl tracking-wide">
                  {data.name}
                </p>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                <span className="text-xs md:text-sm font-bold tracking-widest text-[#FCD34D]">
                  VIP
                </span>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-xs md:text-sm text-[#FECACA] mb-1">
                目前累積消費
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-mono font-bold drop-shadow-md text-white">
                  ${data.totalSpent}
                </span>
                <span className="text-lg text-[#FECACA]">元</span>
              </div>
            </div>
          </div>
        </div>

        {/* Won Prizes Section (NEW) */}
        {myPrizes.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#FCD34D] animate-in slide-in-from-bottom-2">
            <h3 className="font-bold text-[#92400E] mb-4 flex items-center gap-2 text-lg border-b border-[#FDE68A] pb-2">
              <Gift className="text-[#D97706] w-6 h-6" /> 我的獎品匣
            </h3>
            <div className="space-y-3">
              {myPrizes.map((prize) => (
                <div
                  key={prize.id}
                  className={`p-4 rounded-xl border-2 flex flex-col gap-3 transition-all ${
                    prize.redeemed
                      ? "bg-gray-50 border-gray-200 grayscale"
                      : "bg-[#FFFBEB] border-[#FCD34D] shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p
                        className={`font-bold text-lg ${
                          prize.redeemed ? "text-gray-500" : "text-[#92400E]"
                        }`}
                      >
                        {prize.name}
                      </p>
                      <p className="text-xs text-gray-400 font-mono mt-1">
                        票號: {maskTicketId(prize.winner?.ticketId)}
                      </p>
                    </div>
                    {prize.redeemed ? (
                      <div className="flex flex-col items-end">
                        <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 已兌換
                        </span>
                        {prize.redeemedAt && (
                          <span className="text-[10px] text-gray-400 mt-1">
                            {new Date(
                              prize.redeemedAt.seconds * 1000
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="bg-[#FEF3C7] text-[#D97706] text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                        <Star className="w-3 h-3" /> 未兌換
                      </span>
                    )}
                  </div>

                  {/* Redeem Action */}
                  {!prize.redeemed && (
                    <div className="pt-2 border-t border-[#FDE68A]/50">
                      {confirmRedeemId === prize.id ? (
                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col gap-2">
                          <p className="text-red-700 text-sm font-bold flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            請出示給店員確認
                          </p>
                          <p className="text-xs text-red-500">
                            點擊確認後即視為已使用
                          </p>
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => handleRedeem(prize.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg shadow-sm"
                            >
                              確認兌換
                            </button>
                            <button
                              onClick={() => setConfirmRedeemId(null)}
                              className="flex-1 bg-white border border-gray-300 text-gray-600 text-sm font-bold py-2 rounded-lg hover:bg-gray-50"
                            >
                              取消
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmRedeemId(prize.id)}
                          className="w-full bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-2 rounded-lg shadow-[0_2px_0_rgb(146,64,14)] active:shadow-none active:translate-y-0.5 transition-all text-sm flex justify-center items-center gap-2"
                        >
                          <QrCode className="w-4 h-4" /> 立即兌換
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-8 border-[#D97706] flex flex-col gap-3">
          <div className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
            <span className="text-[#8D6E63] font-medium">總獲得券數</span>
            <div className="flex items-center gap-2 text-2xl font-bold text-[#D97706]">
              <Ticket className="w-6 h-6" /> {totalTickets}{" "}
              <span className="text-base font-normal text-gray-400">張</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-[#8D6E63] font-medium">下一張還差</span>
            <span className="text-xl font-bold text-[#4A3728]">
              ${nextTicketNeeds}
            </span>
          </div>
          {/* Progress Bar Visual */}
          <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2 overflow-hidden">
            <div
              className="bg-[#15803D] h-2.5 rounded-full transition-all duration-1000"
              style={{ width: `${((data.totalSpent % 300) / 300) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-right text-gray-400">
            進度: {Math.round(((data.totalSpent % 300) / 300) * 100)}%
          </p>
        </div>

        {/* My Tickets List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6D5B8]">
          <h3 className="font-bold text-[#5D4037] mb-4 flex items-center gap-2 text-lg">
            <Ticket className="text-[#B91C1C] w-6 h-6" /> 我的摸彩券
            <span className="text-xs font-normal text-gray-500 ml-auto">
              (使用後失效)
            </span>
          </h3>
          <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto custom-scrollbar">
            {totalTickets > 0 ? (
              Array.from({ length: totalTickets }).map((_, idx) => {
                const ticketNumber = idx + 1;
                const isUsed = ticketNumber <= usedTickets;
                const ticketId = `${data.phone}-${String(ticketNumber).padStart(
                  2,
                  "0"
                )}`;

                return (
                  <div
                    key={idx}
                    className={`flex justify-between items-center p-3 rounded-xl border ${
                      isUsed
                        ? "bg-gray-100 border-gray-200 opacity-70"
                        : "bg-[#FFF8E1] border-[#FDE68A]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          isUsed ? "bg-gray-200" : "bg-[#FCD34D]"
                        }`}
                      >
                        <Ticket
                          className={`w-5 h-5 ${
                            isUsed ? "text-gray-400" : "text-[#B45309]"
                          }`}
                        />
                      </div>
                      <div>
                        <p
                          className={`font-mono font-bold text-lg ${
                            isUsed
                              ? "text-gray-400 line-through"
                              : "text-[#92400E]"
                          }`}
                        >
                          {ticketId}
                        </p>
                        <p className="text-xs text-gray-500">
                          編號 #{ticketNumber}
                        </p>
                      </div>
                    </div>
                    <div>
                      {isUsed ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          <CheckCircle2 className="w-3 h-3" /> 已使用
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#15803D] bg-[#DCFCE7] px-2 py-1 rounded animate-pulse">
                          <PartyPopper className="w-3 h-3" /> 可抽獎
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-400 py-4">
                尚未獲得摸彩券，加油！
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Column 2: Actions and History */}
      <div className="space-y-6">
        {/* Action Buttons Grid - Bigger targets */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={openLine}
            className="bg-[#15803D] hover:bg-[#166534] text-white font-bold py-6 rounded-2xl shadow-[0_4px_0_rgb(20,83,45)] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
              <MessageCircle className="w-8 h-8 text-[#86EFAC]" />
            </div>
            <span className="text-lg">通知登記</span>
          </button>

          <button
            onClick={goToMenu}
            className="bg-[#D97706] hover:bg-[#B45309] text-white font-bold py-6 rounded-2xl shadow-[0_4px_0_rgb(146,64,14)] active:shadow-none active:translate-y-1 flex flex-col items-center justify-center gap-2 transition-all group"
          >
            <div className="bg-white/20 p-3 rounded-full group-hover:scale-110 transition-transform">
              <Utensils className="w-8 h-8 text-[#FDE68A]" />
            </div>
            <span className="text-lg">查看菜單</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6D5B8]">
          <h3 className="font-bold text-[#5D4037] mb-4 flex items-center gap-2 text-lg">
            <PlusCircle className="text-[#15803D] w-6 h-6" /> 如何累積點數？
          </h3>
          <p className="text-[#8D6E63] text-base leading-relaxed bg-[#F0FDF4] p-4 rounded-xl border border-[#BBF7D0]">
            每次消費後，請點擊上方
            <strong className="text-[#15803D]">「通知登記」</strong>
            按鈕，私訊店長您的消費金額或收據照片，確認後店長會為您更新點數！
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#E6D5B8] flex-1">
          <h3 className="font-bold text-[#5D4037] mb-4 border-b border-[#F5F5F5] pb-2 text-lg">
            最近消費紀錄
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {data.history && data.history.length > 0 ? (
              [...data.history].reverse().map((record, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-base p-3 hover:bg-[#FAF9F6] rounded-xl border border-transparent hover:border-[#E6D5B8] transition-colors"
                >
                  <span className="text-[#A1887F] font-mono">
                    {new Date(record.date).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-[#4A3728] bg-[#FFF8E1] px-3 py-1 rounded-lg">
                    + ${record.amount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-[#D7CCC8] py-8 italic">
                尚無消費紀錄，快來店裡吃好料！
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 3. Admin Dashboard (Updated Layout for Tablet) ---

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState("checkin");

  return (
    <div>
      {/* Snap scrolling for mobile tabs */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-4 snap-x scroll-pl-4 no-scrollbar">
        <AdminTab
          label="消費登記"
          icon={<PlusCircle className="w-5 h-5" />}
          active={activeTab === "checkin"}
          onClick={() => setActiveTab("checkin")}
        />
        <AdminTab
          label="顧客管理"
          icon={<Users className="w-5 h-5" />}
          active={activeTab === "customers"}
          onClick={() => setActiveTab("customers")}
        />
        <AdminTab
          label="聖誕抽獎"
          icon={<PartyPopper className="w-5 h-5" />}
          active={activeTab === "lottery"}
          onClick={() => setActiveTab("lottery")}
        />
        <AdminTab
          label="資料備份"
          icon={<Settings className="w-5 h-5" />}
          active={activeTab === "backup"}
          onClick={() => setActiveTab("backup")}
        />
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "checkin" && <CheckInSystem />}
        {activeTab === "customers" && <CustomerList />}
        {activeTab === "lottery" && <LotterySystem />}
        {activeTab === "backup" && <DataBackupSystem />}
      </div>
    </div>
  );
}

function AdminTab({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`snap-start flex-none flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all font-bold text-base shadow-sm
        ${
          active
            ? "bg-[#4A3426] text-[#EFEBE9] ring-2 ring-[#C5A059] ring-offset-2 ring-offset-[#FDFBF7] scale-105"
            : "bg-white text-[#8D6E63] border border-[#D7CCC8] hover:bg-[#EFEBE9]"
        }`}
    >
      {icon} {label}
    </button>
  );
}

// --- Admin Sub-Components ---

function CheckInSystem() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const customersRef = collection(db, "customers");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone) return;

    const docRef = doc(customersRef, phone);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setCurrentCustomer({ id: docSnap.id, ...docSnap.data() });
      setMsg({ type: "success", text: `已讀取顧客資料` });
    } else {
      setCurrentCustomer(null);
      setMsg({
        type: "info",
        text: "查無此號碼，輸入金額將自動建立新顧客 (預設密碼 0000)",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone || !amount || !date) return;
    const addVal = parseInt(amount, 10);
    if (isNaN(addVal) || addVal <= 0) return;

    const selectedDate = new Date(date);
    const historyDate = selectedDate.toISOString();

    try {
      if (currentCustomer) {
        const newTotal = (currentCustomer.totalSpent || 0) + addVal;
        await updateDoc(doc(customersRef, currentCustomer.id), {
          totalSpent: newTotal,
          lastVisit: selectedDate,
          history: [
            ...(currentCustomer.history || []),
            { date: historyDate, amount: addVal },
          ],
        });
        setMsg({
          type: "success",
          text: `成功補登 ${date} 消費 ${addVal} 元！`,
        });
      } else {
        const newUser = {
          phone,
          name: "店內新客",
          pin: "0000",
          totalSpent: addVal,
          usedTicketCount: 0,
          joinedAt: serverTimestamp(),
          lastVisit: selectedDate,
          history: [{ date: historyDate, amount: addVal }],
        };
        await setDoc(doc(customersRef, phone), newUser);
        setMsg({ type: "success", text: `已建立新顧客並補登消費！` });
      }
      setAmount("");
      setCurrentCustomer(null);
    } catch (err) {
      console.error(err);
      setMsg({ type: "error", text: "儲存失敗" });
    }
  };

  const total = currentCustomer ? currentCustomer.totalSpent : 0;
  const tickets = Math.floor(total / 300);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-[#E6D5B8] max-w-2xl mx-auto">
      <h2 className="font-bold text-[#5D4037] mb-6 text-xl flex items-center gap-2">
        <PlusCircle className="text-[#B91C1C]" /> 快速消費登記
      </h2>
      <form
        onSubmit={currentCustomer ? handleSubmit : handleSearch}
        className="space-y-6"
      >
        {/* Phone Input with large text */}
        <div className="flex gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setCurrentCustomer(null);
              setMsg({ type: "", text: "" });
            }}
            onBlur={handleSearch}
            placeholder="輸入顧客手機"
            className="flex-1 p-4 border-2 border-[#D7CCC8] rounded-xl outline-none focus:border-[#B91C1C] text-xl tracking-wider placeholder:tracking-normal bg-[#FAF9F6]"
            inputMode="tel"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="bg-[#EFEBE9] px-6 rounded-xl hover:bg-[#D7CCC8] border-2 border-[#D7CCC8] active:bg-[#BCAAA4]"
          >
            <Search className="w-6 h-6 text-[#5D4037]" />
          </button>
        </div>

        {/* Customer Found Card */}
        {currentCustomer && (
          <div className="bg-[#F0FDF4] p-4 rounded-xl border border-[#BBF7D0] flex justify-between items-center animate-in zoom-in duration-300">
            <div>
              <p className="font-bold text-[#14532D] text-lg">
                {currentCustomer.name || currentCustomer.phone}
              </p>
              <p className="text-sm text-[#166534]">
                目前累積: <span className="font-bold">${total}</span>
              </p>
            </div>
            <div className="text-2xl font-bold text-[#15803D] flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm">
              <Ticket className="w-6 h-6" /> {tickets}
            </div>
          </div>
        )}

        {msg.text && !currentCustomer && (
          <div
            className={`p-4 text-base font-medium rounded-xl text-center ${
              msg.type === "error"
                ? "bg-[#FEF2F2] text-[#991B1B]"
                : "bg-[#EFF6FF] text-[#1E40AF]"
            }`}
          >
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#8D6E63] mb-2 flex items-center gap-1">
              <Calendar className="w-4 h-4" /> 消費日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-4 border border-[#D7CCC8] rounded-xl outline-none focus:border-[#B91C1C] text-[#4A3728] bg-white text-lg h-[60px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8D6E63] mb-2">
              消費金額
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$"
              className="w-full p-4 border border-[#D7CCC8] rounded-xl text-2xl font-bold text-center outline-none focus:border-[#B91C1C] h-[60px]"
              inputMode="numeric"
            />
          </div>
        </div>

        <button className="w-full bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold py-5 rounded-2xl shadow-[0_4px_0_rgb(139,28,28)] active:shadow-none active:translate-y-1 transition-all text-xl flex items-center justify-center gap-2">
          <Save className="w-6 h-6" />{" "}
          {currentCustomer ? "確認累積" : "建立並累積"}
        </button>
      </form>
    </div>
  );
}

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null); // Track deletion
  const customersRef = collection(db, "customers");

  useEffect(() => {
    const q = query(customersRef, orderBy("totalSpent", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async (id) => {
    await deleteDoc(doc(customersRef, id));
    setDeleteConfirmId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#E6D5B8] overflow-hidden max-w-4xl mx-auto">
      <div className="p-5 bg-[#FAF9F6] border-b border-[#E6D5B8]">
        <h2 className="font-bold text-[#5D4037] text-lg flex items-center gap-2">
          <Users className="w-5 h-5" /> 顧客列表 ({customers.length})
        </h2>
      </div>
      <div className="divide-y divide-[#F5F5F5] max-h-[60vh] overflow-y-auto custom-scrollbar">
        {customers.map((c) => (
          <div
            key={c.id}
            className="p-5 flex items-center justify-between hover:bg-[#FAF9F6] transition-colors"
          >
            <div className="flex flex-col">
              <p className="font-bold text-[#4A3728] text-lg tracking-wide">
                {c.phone}
              </p>
              <div className="flex gap-2 text-sm text-[#8D6E63]">
                <span>{c.name || "未命名"}</span>
                <span className="text-[#D7CCC8]">|</span>
                <span>密碼: {c.pin}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-[#5D4037] text-xl bg-[#FFF8E1] px-3 py-1 rounded-lg border border-[#FDE68A]">
                ${c.totalSpent}
              </span>

              {/* Delete Button Area with Confirm Logic */}
              {deleteConfirmId === c.id ? (
                <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                  <button
                    onClick={() => handleConfirmDelete(c.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg"
                  >
                    確定
                  </button>
                  <button
                    onClick={handleCancelDelete}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleDeleteClick(c.id)}
                  className="text-[#D7CCC8] hover:text-[#B91C1C] p-2 hover:bg-[#FEF2F2] rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {customers.length === 0 && (
          <p className="text-center p-8 text-gray-400">目前還沒有顧客資料</p>
        )}
      </div>
    </div>
  );
}

function LotterySystem() {
  const [prizes, setPrizes] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [prizeName, setPrizeName] = useState("");
  const [prizeQty, setPrizeQty] = useState(1);
  const [winner, setWinner] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [availableTicketCount, setAvailableTicketCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState(""); // For UI feedback

  const customersRef = collection(db, "customers");
  const prizesRef = collection(db, "prizes");

  useEffect(() => {
    const unsubC = onSnapshot(customersRef, (s) => {
      const allCustomers = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCustomers(allCustomers);

      // 計算目前總共還剩下多少張可抽的票
      let count = 0;
      allCustomers.forEach((c) => {
        const earned = Math.floor((c.totalSpent || 0) / 300);
        const used = c.usedTicketCount || 0;
        count += Math.max(0, earned - used);
      });
      setAvailableTicketCount(count);
    });

    const qPrizes = query(prizesRef, orderBy("name"));
    const unsubP = onSnapshot(qPrizes, (s) =>
      setPrizes(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => {
      unsubC();
      unsubP();
    };
  }, []);

  const showMsg = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3000);
  };

  const addPrize = async (e) => {
    e.preventDefault();
    if (!prizeName || prizeQty < 1) return;
    setIsAdding(true);

    const batch = writeBatch(db);
    try {
      const promises = [];
      for (let i = 0; i < prizeQty; i++) {
        promises.push(
          addDoc(prizesRef, {
            name: prizeName,
            claimed: false,
            winner: null,
            redeemed: false, // New Field
            createdAt: serverTimestamp(),
          })
        );
      }
      await Promise.all(promises);

      setPrizeName("");
      setPrizeQty(1);
    } catch (err) {
      showMsg("新增失敗");
    }
    setIsAdding(false);
  };

  const drawWinner = async (prizeId) => {
    // 建立抽獎池，只放入「未使用」的票券
    let pool = [];
    customers.forEach((c) => {
      const earned = Math.floor((c.totalSpent || 0) / 300);
      const used = c.usedTicketCount || 0;
      const available = Math.max(0, earned - used);

      // 為每一張可用的票建立物件
      for (let i = 0; i < available; i++) {
        const ticketNumber = used + i + 1; // 票號邏輯：已使用+1開始
        const ticketId = `${c.phone}-${String(ticketNumber).padStart(2, "0")}`;
        pool.push({
          ...c,
          currentTicketId: ticketId, // 紀錄這張中獎的票號
        });
      }
    });

    if (pool.length === 0) return showMsg("目前沒有可抽獎的票券！");

    setIsDrawing(true);
    setWinner(null);
    let duration = 3000;
    let startTime = Date.now();

    const animate = () => {
      if (Date.now() - startTime < duration) {
        setWinner(pool[Math.floor(Math.random() * pool.length)]);
        requestAnimationFrame(animate);
      } else {
        const luckyWinner = pool[Math.floor(Math.random() * pool.length)];
        setWinner(luckyWinner);
        setIsDrawing(false);

        // 1. 更新獎品狀態
        updateDoc(doc(prizesRef, prizeId), {
          claimed: true,
          redeemed: false,
          winner: {
            name: luckyWinner.name,
            phone: luckyWinner.phone,
            ticketId: luckyWinner.currentTicketId,
          },
        });

        // 2. 更新顧客資料：將已使用票數 +1
        // 這樣這張票就會在下一次計算時被排除
        updateDoc(doc(customersRef, luckyWinner.id), {
          usedTicketCount: increment(1),
        });
      }
    };
    animate();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto relative">
      {errorMsg && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-4 rounded-xl z-50 font-bold animate-in fade-in zoom-in">
          {errorMsg}
        </div>
      )}

      <div className="bg-[#FFF8E1] p-6 rounded-2xl border-2 border-[#FDE68A] text-center shadow-sm flex flex-col md:flex-row justify-around gap-4">
        <div>
          <p className="text-[#B45309] text-sm font-medium mb-1">
            目前有效票券總數
          </p>
          <p className="text-[#92400E] font-bold text-4xl">
            {availableTicketCount}{" "}
            <span className="text-lg text-[#B45309]">張</span>
          </p>
        </div>
        <div className="w-px bg-[#FDE68A] hidden md:block"></div>
        <div>
          <p className="text-[#B45309] text-sm font-medium mb-1">
            歷史已發出總票數
          </p>
          <p className="text-[#92400E] font-bold text-4xl opacity-60">
            {customers.reduce(
              (acc, c) => acc + Math.floor((c.totalSpent || 0) / 300),
              0
            )}{" "}
            <span className="text-lg text-[#B45309]">張</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#E6D5B8]">
        <h3 className="font-bold text-[#5D4037] mb-4">新增獎品</h3>
        <form
          onSubmit={addPrize}
          className="flex flex-col md:flex-row gap-4 items-end bg-[#FAF9F6] p-4 rounded-xl border border-[#D7CCC8]"
        >
          <div className="flex-1 w-full">
            <label className="text-sm font-bold text-[#8D6E63] mb-2 block">
              獎品名稱
            </label>
            <input
              type="text"
              value={prizeName}
              onChange={(e) => setPrizeName(e.target.value)}
              placeholder="例：免費餐盒"
              className="w-full p-3 border border-[#D7CCC8] rounded-lg outline-none focus:border-[#B91C1C] text-lg bg-white"
            />
          </div>
          <div className="w-full md:w-32">
            <label className="text-sm font-bold text-[#8D6E63] mb-2 block">
              數量
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={prizeQty}
              onChange={(e) => {
                const val = e.target.value;
                setPrizeQty(val === "" ? "" : parseInt(val));
              }}
              className="w-full p-3 border border-[#D7CCC8] rounded-lg text-center outline-none focus:border-[#B91C1C] text-lg bg-white"
            />
          </div>
          <button
            disabled={isAdding}
            className="w-full md:w-auto bg-[#4A3426] hover:bg-[#3E2723] text-white px-8 py-3 rounded-xl h-[54px] font-bold active:scale-95 transition-transform"
          >
            {isAdding ? "..." : "新增"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {prizes.length === 0 && (
          <p className="col-span-full text-[#D7CCC8] text-center py-8 bg-white rounded-2xl border border-dashed border-[#E6D5B8]">
            尚未設定獎品
          </p>
        )}
        {prizes.map((p) => (
          <div
            key={p.id}
            className="border border-[#E6D5B8] p-4 rounded-2xl flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${
                  p.claimed ? "bg-gray-100" : "bg-red-50"
                }`}
              >
                <Gift
                  className={`w-6 h-6 ${
                    p.claimed ? "text-[#D7CCC8]" : "text-[#B91C1C]"
                  }`}
                />
              </div>
              <div>
                <p
                  className={`font-bold text-lg ${
                    p.claimed ? "line-through text-[#D7CCC8]" : "text-[#5D4037]"
                  }`}
                >
                  {p.name}
                </p>
                {p.claimed && (
                  <div className="text-sm mt-1">
                    <p className="font-bold text-[#15803D]">
                      🎉 {p.winner?.name} ({p.winner?.phone?.substring(0, 4)}
                      ******)
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-400 font-mono">
                        Ticket: {maskTicketId(p.winner?.ticketId)}
                      </p>
                      {/* Admin Redemption Check */}
                      {p.redeemed ? (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 已於{" "}
                          {p.redeemedAt
                            ? new Date(
                                p.redeemedAt.seconds * 1000
                              ).toLocaleDateString()
                            : ""}
                          兌換
                        </span>
                      ) : (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 尚未兌換
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!p.claimed && (
              <button
                disabled={isDrawing}
                onClick={() => drawWinner(p.id)}
                className="bg-[#B91C1C] hover:bg-[#991B1B] text-white px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-transform active:scale-95"
              >
                抽獎
              </button>
            )}
            {p.claimed && (
              <button
                onClick={() => deleteDoc(doc(prizesRef, p.id))}
                className="text-[#D7CCC8] hover:text-[#B91C1C] p-2 hover:bg-[#FEF2F2] rounded-full transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {isDrawing && winner && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="text-center text-white animate-in zoom-in duration-300 w-full max-w-sm bg-[#B91C1C] p-8 rounded-3xl shadow-2xl border-4 border-[#FCD34D]">
            <p className="text-xl mb-6 text-[#FDE68A] font-bold uppercase tracking-widest">
              Congratulations
            </p>
            <Gift className="w-20 h-20 text-white mx-auto mb-6 animate-bounce" />
            <div className="text-5xl font-mono font-bold text-white tracking-wider mb-2">
              {winner.phone.substring(0, 4)}******
            </div>
            <div className="text-2xl font-bold text-[#FCD34D] mb-4">
              {winner.name}
            </div>
            <div className="bg-black/20 px-6 py-2 rounded-full inline-block text-white/80 font-mono border border-white/20">
              {maskTicketId(winner.currentTicketId)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Backup System ---

function DataBackupSystem() {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pendingFile, setPendingFile] = useState(null); // Track file waiting for confirm

  const customersRef = collection(db, "customers");
  const prizesRef = collection(db, "prizes");

  const handleDownload = async () => {
    setProcessing(true);
    setStatus("準備資料中...");
    try {
      // Fetch all data
      const customersSnap = await getDocs(customersRef);
      const prizesSnap = await getDocs(prizesRef);

      const data = {
        customers: customersSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        prizes: prizesSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        exportDate: new Date().toISOString(),
      };

      // Create file
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wood_food_backup_${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatus("備份下載完成！請妥善保存檔案。");
    } catch (err) {
      console.error(err);
      setStatus("下載失敗，請稍後再試。");
    }
    setProcessing(false);
  };

  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) setPendingFile(file);
    e.target.value = ""; // Reset input
  };

  const confirmUpload = async () => {
    if (!pendingFile) return;

    setProcessing(true);
    setStatus("讀取檔案中...");

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);

        if (!data.customers || !Array.isArray(data.customers)) {
          throw new Error("檔案格式錯誤：找不到顧客資料");
        }

        setStatus(`正在還原 ${data.customers.length} 筆顧客資料...`);

        // Process Customers
        const customerPromises = data.customers.map(async (c) => {
          const { id, ...cData } = c;
          // Ensure phone is ID if available, otherwise use provided ID
          const docId = c.phone || id;
          if (!docId) return; // Skip invalid

          await setDoc(doc(customersRef, docId), cData, { merge: true });
        });

        // Process Prizes (Optional, checking if exists)
        let prizePromises = [];
        if (data.prizes && Array.isArray(data.prizes)) {
          prizePromises = data.prizes.map(async (p) => {
            const { id, ...pData } = p;
            if (id) {
              await setDoc(doc(prizesRef, id), pData, { merge: true });
            } else {
              await addDoc(prizesRef, pData);
            }
          });
        }

        await Promise.all([...customerPromises, ...prizePromises]);
        setStatus(
          `還原成功！已更新 ${data.customers.length} 位顧客與 ${
            data.prizes?.length || 0
          } 個獎品設定。`
        );
      } catch (err) {
        console.error(err);
        setStatus("還原失敗：" + err.message);
      }
      setProcessing(false);
      setPendingFile(null);
    };
    reader.readAsText(pendingFile);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-[#FFF8E1] p-6 rounded-3xl border-2 border-[#FDE68A] text-center">
        <h3 className="text-xl font-bold text-[#92400E] mb-2 flex items-center justify-center gap-2">
          <Settings className="w-6 h-6" /> 資料庫安全中心
        </h3>
        <p className="text-[#B45309] text-sm md:text-base">
          建議每週備份一次，以防資料遺失。
          <br />
          下載的檔案請保存在安全的地方。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Download Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] flex flex-col items-center gap-4 hover:shadow-md transition-shadow">
          <div className="bg-[#E0F2FE] p-5 rounded-full">
            <Download className="w-10 h-10 text-[#0369A1]" />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-[#4A3728] text-lg mb-1">
              下載備份檔
            </h4>
            <p className="text-sm text-[#8D6E63] mb-4">
              匯出所有顧客與獎品資料 (.json)
            </p>
          </div>
          <button
            onClick={handleDownload}
            disabled={processing}
            className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold py-4 rounded-xl shadow-sm active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2 text-lg"
          >
            {processing ? "處理中..." : "立即下載"}
          </button>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#E6D5B8] flex flex-col items-center gap-4 hover:shadow-md transition-shadow relative">
          <div className="bg-[#DCFCE7] p-5 rounded-full">
            <Upload className="w-10 h-10 text-[#15803D]" />
          </div>
          <div className="text-center">
            <h4 className="font-bold text-[#4A3728] text-lg mb-1">上傳還原</h4>
            <p className="text-sm text-[#8D6E63] mb-4">
              將備份檔寫回資料庫 (會覆蓋舊資料)
            </p>
          </div>

          {pendingFile ? (
            <div className="w-full bg-[#FEF2F2] p-4 rounded-xl border border-red-200 animate-in fade-in zoom-in absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
              <p className="text-red-800 font-bold mb-1">確定要還原嗎？</p>
              <p className="text-xs text-red-600 mb-3">
                這將覆蓋現有資料且無法復原
              </p>
              <div className="flex gap-2 w-full px-4">
                <button
                  onClick={confirmUpload}
                  className="flex-1 bg-red-600 text-white text-sm font-bold py-2 rounded-lg"
                >
                  確認覆蓋
                </button>
                <button
                  onClick={() => setPendingFile(null)}
                  className="flex-1 bg-gray-200 text-gray-700 text-sm font-bold py-2 rounded-lg"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <label className="w-full cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={onFileSelect}
                disabled={processing}
                className="hidden"
              />
              <div className="w-full bg-[#15803D] hover:bg-[#166534] text-white font-bold py-4 rounded-xl shadow-sm active:scale-95 transition-all flex justify-center items-center gap-2 text-lg">
                {processing ? "處理中..." : "選擇檔案並還原"}
              </div>
            </label>
          )}
        </div>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-center font-bold text-lg ${
            status.includes("失敗")
              ? "bg-[#FEF2F2] text-[#991B1B]"
              : "bg-[#F0FDF4] text-[#166534]"
          }`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
// update
