// src/components/display/WinnersList.js
import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { PartyPopper, Trophy } from "lucide-react";
import { db } from "../../config/firebase"; // 記得引入 db

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

export default WinnersList;