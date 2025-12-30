// src/features/admin/LoyaltySettings.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Edit3 } from "lucide-react";
import { db } from "../../config/firebase";

const LoyaltySettings = ({ theme, isDemoMode }) => {
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
};

export default LoyaltySettings;