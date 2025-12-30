// src/features/games/GameSettings.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Gamepad2, Dices, Scissors, Eraser } from "lucide-react";
import { db } from "../../config/firebase";

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
            {/* 標題強制使用深色，確保在白底上清楚 */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-900">
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
                            {/* 修改點：加入 text-gray-900 強制文字為深黑色 */}
                            <h4 className="font-bold flex items-center gap-2 text-lg text-gray-900">
                                <g.icon className="w-5 h-5 text-gray-700" /> {g.name}
                            </h4>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={settings[g.id]?.enabled || false} 
                                    onChange={(e) => toggleGame(g.id, 'enabled', e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                        {settings[g.id]?.enabled && (
                            <div>
                                {/* 修改點：label 改為 text-gray-700 確保清晰 */}
                                <label className="text-xs font-bold text-gray-700 mb-1 block">獎品池 (用逗號分隔多個獎項)</label>
                                {/* 修改點：input 加入 text-gray-900 確保輸入文字為深色 */}
                                <input type="text" value={settings[g.id]?.prizes || ""} 
                                    onChange={(e) => toggleGame(g.id, 'prizes', e.target.value)}
                                    className="w-full p-2 border rounded-lg text-gray-900 bg-white placeholder-gray-400" 
                                    placeholder="例如：滷蛋,5元折價券,紅茶" />
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

export default GameSettings;