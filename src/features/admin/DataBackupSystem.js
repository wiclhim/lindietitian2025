// src/features/admin/DataBackupSystem.js
import React, { useState } from "react";
import { collection, getDocs, setDoc, doc, addDoc, query, where, writeBatch } from "firebase/firestore";
import { Settings, Download, Upload, AlertTriangle, Clock, RefreshCw, Trash2 } from "lucide-react";
import { db } from "../../config/firebase";
import { ADMIN_PIN } from "../../config/constants";

const DataBackupSystem = ({ theme, isDemoMode }) => {
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showFixConfirm, setShowFixConfirm] = useState(false); 
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
      const q = query(prizesRef, where("claimed", "==", true), where("redeemed", "==", false));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);
      let count = 0;
      
      snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.createdAt) {
              let createdDate;
              if (typeof data.createdAt.toDate === 'function') {
                  createdDate = data.createdAt.toDate();
              } else if (data.createdAt.seconds) {
                  createdDate = new Date(data.createdAt.seconds * 1000);
              } else if (data.createdAt instanceof Date) {
                  createdDate = data.createdAt;
              } else {
                  createdDate = new Date(data.createdAt);
              }

              if (createdDate && !isNaN(createdDate.getTime())) {
                  const newExpiresAt = new Date(createdDate);
                  newExpiresAt.setMonth(newExpiresAt.getMonth() + 6);
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-left"><h4 className="text-xl font-bold text-red-800 flex items-center gap-2 mb-2"><RefreshCw className="w-6 h-6" /> 活動重置 (危險區域)</h4><p className="text-red-700 text-sm leading-relaxed">活動結束後使用此功能。<br />這將會 <strong className="underline">清空所有</strong> 顧客的消費金額、抽獎紀錄與<span className="underline">已兌換</span>獎品。<br /><span className="text-red-600 font-bold">(顧客帳號、未兌換獎品與集點進度將保留，方便下次活動使用)</span></p></div>
            {showResetConfirm ? (<div className="w-full md:w-auto bg-white p-4 rounded-xl border-2 border-red-300 shadow-sm animate-in zoom-in"><p className="text-red-800 font-bold text-sm mb-2 text-center">請輸入管理密碼確認重置</p><input type="password" value={resetPin} onChange={(e) => setResetPin(e.target.value)} placeholder="輸入密碼" className="w-full p-2 border border-red-200 rounded-lg text-center mb-3 outline-none focus:border-red-500" /><div className="flex gap-2"><button onClick={handleResetEvent} className="flex-1 bg-red-600 text-white font-bold py-2 rounded-lg text-sm hover:bg-red-700">確認執行</button><button onClick={() => { setShowResetConfirm(false); setResetPin(""); }} className="flex-1 bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-sm hover:bg-gray-300">取消</button></div></div>) : (<button onClick={() => setShowResetConfirm(true)} disabled={processing} className="w-full md:w-auto bg-white border-2 border-red-600 text-red-600 hover:bg-red-50 font-bold px-6 py-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"><Trash2 className="w-5 h-5" /> 結束活動並重置資料</button>)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackupSystem;