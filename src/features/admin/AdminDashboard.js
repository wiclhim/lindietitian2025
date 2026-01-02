// src/features/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import { PlusCircle, Users, Edit3, PartyPopper, Settings, Gamepad2, CheckCircle2 } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

// 引入同一層級的後台組件
import CheckInSystem from "./CheckInSystem";
import CustomerList from "./CustomerList";
import LoyaltySettings from "./LoyaltySettings";
import LotterySystem from "./LotterySystem";
import StoreSettings from "./StoreSettings";
import RequestApproval from "./RequestApproval"; // 新增

// 引入跨資料夾的遊戲設定組件
import GameSettings from "../games/GameSettings";

const AdminDashboard = ({ user, theme, isDemoMode, setCurrentThemeId, setEventType, eventType }) => {
  const [activeTab, setActiveTab] = useState("checkin");
  const [pendingCount, setPendingCount] = useState(0);

  // 監聽待審核數量，顯示紅點通知
  useEffect(() => {
    if (isDemoMode) return;
    const q = query(collection(db, "pending_requests"), where("status", "==", "pending"));
    const unsubscribe = onSnapshot(q, (snap) => {
      setPendingCount(snap.size);
    });
    return () => unsubscribe();
  }, [isDemoMode]);

  return (
    <div>
      <div className="flex gap-3 mb-6 overflow-x-auto pb-4 snap-x scroll-pl-4 no-scrollbar">
        <AdminTab 
            label="審核申請" 
            icon={<CheckCircle2 className="w-5 h-5" />} 
            active={activeTab === "approval"} 
            onClick={() => setActiveTab("approval")} 
            theme={theme} 
            badge={pendingCount} // 傳入數量
        />
        <AdminTab label="手動登記" icon={<PlusCircle className="w-5 h-5" />} active={activeTab === "checkin"} onClick={() => setActiveTab("checkin")} theme={theme} />
        <AdminTab label="顧客管理" icon={<Users className="w-5 h-5" />} active={activeTab === "customers"} onClick={() => setActiveTab("customers")} theme={theme} />
        <AdminTab label="集點設定" icon={<Edit3 className="w-5 h-5" />} active={activeTab === "loyalty"} onClick={() => setActiveTab("loyalty")} theme={theme} />
        <AdminTab label="節慶抽獎" icon={<PartyPopper className="w-5 h-5" />} active={activeTab === "lottery"} onClick={() => setActiveTab("lottery")} theme={theme} />
        <AdminTab label="商店設定" icon={<Settings className="w-5 h-5" />} active={activeTab === "settings"} onClick={() => setActiveTab("settings")} theme={theme} />
        <AdminTab label="遊戲設定" icon={<Gamepad2 className="w-5 h-5" />} active={activeTab === "games"} onClick={() => setActiveTab("games")} theme={theme} />
      </div>
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "approval" && <RequestApproval theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "checkin" && <CheckInSystem theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "customers" && <CustomerList theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "loyalty" && <LoyaltySettings theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "lottery" && <LotterySystem theme={theme} isDemoMode={isDemoMode} />}
        {activeTab === "settings" && <StoreSettings theme={theme} isDemoMode={isDemoMode} setCurrentThemeId={setCurrentThemeId} setEventType={setEventType} eventType={eventType} />}
        {activeTab === "games" && <GameSettings theme={theme} isDemoMode={isDemoMode} />}
      </div>
    </div>
  );
};

// 內部使用的 Tab 按鈕組件
function AdminTab({ label, icon, active, onClick, theme, badge }) {
  return (
    <button onClick={onClick} className={`relative snap-start flex-none flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all font-bold text-base shadow-sm`}
            style={{ 
                backgroundColor: active ? theme.colors.primary : 'white',
                color: active ? 'white' : theme.colors.textDark,
                borderColor: theme.colors.cardBorder,
                borderWidth: active ? 0 : 1
            }}>
      {icon} {label}
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-bounce">
            {badge}
        </span>
      )}
    </button>
  );
}

export default AdminDashboard;