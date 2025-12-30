// src/features/admin/StoreSettings.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Layers, Ticket, Crown, Star, Coffee, Palette } from "lucide-react";
import { db } from "../../config/firebase";
import { THEMES } from "../../config/constants";
import DataBackupSystem from "./DataBackupSystem";

const StoreSettings = ({ theme, isDemoMode, setCurrentThemeId, setEventType, eventType }) => {
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
};

export default StoreSettings;