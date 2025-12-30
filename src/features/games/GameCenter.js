// src/features/games/GameCenter.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, collection, writeBatch, serverTimestamp } from "firebase/firestore";
import { Loader2, XCircle, Gamepad2, CheckCircle2, Dices, Scissors, Eraser } from "lucide-react";
import { db } from "../../config/firebase";
import { isSameDay, getRandomPrize } from "../../utils/helpers";
import { DiceGame, RPSGame, ScratchGame } from "./MiniGames";

const GameCenter = ({ userData, theme, isDemoMode, onClose }) => {
    const [gameSettings, setGameSettings] = useState(null);
    const [activeGame, setActiveGame] = useState(null);
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

        const initData = async () => {
            if (!db) return;

            try {
                const settingsSnap = await getDoc(doc(db, "settings", "games"));
                if (settingsSnap.exists()) {
                    setGameSettings(settingsSnap.data());
                }
            } catch (error) {
                console.error("Error fetching game settings:", error);
            }

            if (userData?.id) {
                if (userData.gamesLastPlayed) {
                    setPlayedStatus(userData.gamesLastPlayed);
                }
                try {
                    const userRef = doc(db, "customers", userData.id);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        const freshData = userSnap.data();
                        if (freshData.gamesLastPlayed) {
                            setPlayedStatus(freshData.gamesLastPlayed);
                        }
                    }
                } catch (error) {
                    console.error("Error syncing user game status:", error);
                }
            }
        };

        initData();
    }, [isDemoMode, userData?.id]);

    const handleGameEnd = async (gameId, isWin, prizeName) => {
        if (!userData?.id) return;
        const now = new Date();
        
        setPlayedStatus(prev => ({ ...prev, [gameId]: { seconds: now.getTime() / 1000 } }));

        if (isDemoMode) {
            if(isWin) alert(`(Demo) 恭喜獲得：${prizeName}`);
            setActiveGame(null);
            return;
        }

        try {
            const batch = writeBatch(db);
            const userRef = doc(db, "customers", userData.id);
            
            batch.set(userRef, { 
                gamesLastPlayed: { ...playedStatus, [gameId]: serverTimestamp() } 
            }, { merge: true });

            if (isWin) {
                const newPrizeRef = doc(collection(db, "prizes"));
                const expiresAt = new Date();
                expiresAt.setMonth(expiresAt.getMonth() + 1); 
                
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
        } catch (error) {
            console.error("Game save error:", error);
            alert("資料儲存失敗，請檢查網路連線");
        }
        
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
                
                {/* 1. 主標題顏色加深為 text-gray-900 */}
                <h2 className="text-2xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-gray-900">
                    <Gamepad2 className="w-8 h-8" style={{ color: theme.colors.primary }} /> 每日挑戰
                </h2>
                {/* 2. 副標題顏色加深為 text-gray-700 */}
                <p className="text-center text-gray-700 mb-6 text-sm">每天每種遊戲限玩一次，贏了馬上領獎！</p>

                <div className="space-y-4">
                    {games.map(g => {
                        if (!gameSettings[g.id]?.enabled) return null;
                        const isPlayed = isSameDay(playedStatus[g.id]);
                        
                        return (
                            <button key={g.id} disabled={isPlayed} onClick={() => setActiveGame(g.id)}
                                /* 3. 移除 'opacity-60'，改用單純的 bg-gray-100 和 grayscale 
                                   這樣文字不會變透明，但整體看起來還是有「已停用」的感覺
                                */
                                className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all relative overflow-hidden group 
                                    ${isPlayed 
                                        ? 'grayscale bg-gray-100 cursor-not-allowed border-gray-200' 
                                        : 'hover:scale-[1.02] hover:shadow-md bg-white'}`}
                                style={{ borderColor: isPlayed ? '#E5E7EB' : g.color }}>
                                
                                <div className={`p-3 rounded-full text-white shadow-sm`} style={{ backgroundColor: isPlayed ? '#9CA3AF' : g.color }}>
                                    <g.icon className="w-6 h-6" />
                                </div>
                                <div className="text-left flex-1">
                                    {/* 4. 遊戲名稱顏色加深為 text-gray-900 */}
                                    <h3 className="font-bold text-lg text-gray-900">{g.name}</h3>
                                    {/* 5. 遊戲描述顏色加深為 text-gray-600 */}
                                    <p className="text-xs text-gray-600 font-medium">{isPlayed ? "明日再來挑戰！" : g.desc}</p>
                                </div>
                                {isPlayed ? <CheckCircle2 className="w-6 h-6 text-gray-400" /> : <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">GO!</div>}
                            </button>
                        );
                    })}
                    {Object.values(gameSettings).every(s => !s.enabled) && (
                        <div className="text-center py-8 text-gray-500 font-bold">目前沒有開放的活動，敬請期待！</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameCenter;