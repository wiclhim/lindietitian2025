// src/features/admin/LotterySystem.js
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, writeBatch, serverTimestamp, getDoc, updateDoc, increment, deleteField } from "firebase/firestore";
import { Gift, Trash2, CheckCircle2, Clock, UserCheck } from "lucide-react";
import { db } from "../../config/firebase";
import { maskTicketId } from "../../utils/helpers";

const LotterySystem = ({ theme, isDemoMode }) => {
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
};

export default LotterySystem;