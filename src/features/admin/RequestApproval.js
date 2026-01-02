import React, { useState, useEffect } from "react";
import { 
  collection, query, where, orderBy, onSnapshot, 
  doc, runTransaction, serverTimestamp, updateDoc 
} from "firebase/firestore";
import { 
  CheckCircle2, XCircle, Clock, User, 
  Calendar, DollarSign, Utensils, Edit3, AlertCircle 
} from "lucide-react";
import { db } from "../../config/firebase";

const RequestApproval = ({ theme, isDemoMode }) => {
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ amount: 0, bentoQty: 0 });
  const [processingId, setProcessingId] = useState(null);

  // 監聽待審核的申請
  useEffect(() => {
    if (isDemoMode) {
      setRequests([
        { 
          id: 'demo1', 
          customerName: '王小明', 
          customerId: '0912345678', 
          amount: 500, 
          bentoQty: 1, 
          date: '2023-10-27', 
          timestamp: { seconds: Date.now()/1000 } 
        },
        { 
          id: 'demo2', 
          customerName: '陳美麗', 
          customerId: '0987654321', 
          amount: 120, 
          bentoQty: 0, 
          date: '2023-10-28', 
          timestamp: { seconds: Date.now()/1000 - 86400 } 
        }
      ]);
      return;
    }

    const q = query(
      collection(db, "pending_requests"),
      where("status", "==", "pending"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [isDemoMode]);

  const handleEdit = (req) => {
    setEditingId(req.id);
    setEditValues({ amount: req.amount, bentoQty: req.bentoQty });
  };

  const handleApprove = async (req) => {
    setProcessingId(req.id);
    
    // 如果正在編輯，使用編輯後的值，否則使用原始請求的值
    const finalAmount = editingId === req.id ? parseInt(editValues.amount) : parseInt(req.amount);
    const finalBentoQty = editingId === req.id ? parseInt(editValues.bentoQty) : parseInt(req.bentoQty);

    if (isDemoMode) {
      setTimeout(() => {
        setRequests(prev => prev.filter(r => r.id !== req.id));
        setProcessingId(null);
        setEditingId(null);
        alert(`展示模式：已確認 ${req.customerName} 的消費 ${finalAmount} 元`);
      }, 500);
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        // 1. 讀取顧客資料
        const customerRef = doc(db, "customers", req.customerId);
        const customerDoc = await transaction.get(customerRef);
        
        if (!customerDoc.exists()) {
          throw new Error("Customer does not exist!");
        }

        const customerData = customerDoc.data();
        const newTotal = (customerData.totalSpent || 0) + finalAmount;
        const newPoints = (customerData.points || 0) + finalBentoQty;
        
        // 歷史紀錄
        const newHistory = {
          date: new Date().toISOString(), // 實際寫入時間
          displayDate: req.date, // 顧客宣稱的消費日期
          amount: finalAmount,
          bentoQty: finalBentoQty,
          type: 'self_report_approved',
          requestId: req.id
        };

        // 2. 更新顧客資料
        transaction.update(customerRef, {
          totalSpent: newTotal,
          points: newPoints,
          lastVisit: new Date(req.date), // 更新最後來訪日為消費日
          history: [...(customerData.history || []), newHistory]
        });

        // 3. 更新申請單狀態為已核准
        const requestRef = doc(db, "pending_requests", req.id);
        transaction.update(requestRef, {
          status: "approved",
          finalAmount: finalAmount,
          finalBentoQty: finalBentoQty,
          processedAt: serverTimestamp()
        });
      });
      
      setEditingId(null);
    } catch (error) {
      console.error("Transaction failed: ", error);
      alert("核准失敗，請稍後再試");
    }
    setProcessingId(null);
  };

  const handleReject = async (req) => {
    if (!window.confirm(`確定要拒絕 ${req.customerName} 的申請嗎？`)) return;
    
    if (isDemoMode) {
      setRequests(prev => prev.filter(r => r.id !== req.id));
      return;
    }

    try {
      await updateDoc(doc(db, "pending_requests", req.id), {
        status: "rejected",
        processedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Reject failed: ", error);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden max-w-4xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
      <div className="p-5 bg-gray-50 border-b flex justify-between items-center" style={{ borderColor: theme.colors.cardBorder }}>
        <h2 className="font-bold text-lg flex items-center gap-2" style={{ color: theme.colors.textDark }}>
          <CheckCircle2 className="w-5 h-5" /> 顧客消費申請審核 ({requests.length})
        </h2>
      </div>

      <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto custom-scrollbar">
        {requests.length === 0 ? (
          <div className="p-10 text-center text-gray-400 flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 mb-2 opacity-20" />
            <p>目前沒有待審核的申請</p>
          </div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* 左側資訊 */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-lg text-gray-800">{req.customerName}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full font-mono">{req.customerId}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" /> {req.date}
                    </span>
                    <span className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" /> 申請時間: {new Date(req.timestamp?.seconds * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 中間數值 (可編輯) */}
                <div className={`flex items-center gap-3 p-3 rounded-xl border-2 ${editingId === req.id ? 'bg-white border-blue-400 shadow-md scale-105' : 'bg-gray-50 border-transparent' } transition-all duration-200`}>
                  {editingId === req.id ? (
                    <>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400 font-bold">消費金額</label>
                        <input 
                          type="number" 
                          value={editValues.amount}
                          onChange={(e) => setEditValues({...editValues, amount: e.target.value})}
                          className="w-20 font-bold text-lg text-gray-800 outline-none border-b border-gray-300 focus:border-blue-500 bg-transparent"
                        />
                      </div>
                      <div className="w-px h-8 bg-gray-300"></div>
                      <div className="flex flex-col">
                        <label className="text-xs text-gray-400 font-bold">便當數</label>
                        <input 
                          type="number" 
                          value={editValues.bentoQty}
                          onChange={(e) => setEditValues({...editValues, bentoQty: e.target.value})}
                          className="w-12 font-bold text-lg text-gray-800 outline-none border-b border-gray-300 focus:border-blue-500 bg-transparent"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-end min-w-[60px]">
                        <span className="text-xs text-gray-400">消費金額</span>
                        <span className="font-bold text-xl text-gray-800">${req.amount}</span>
                      </div>
                      {req.bentoQty > 0 && (
                        <>
                          <div className="w-px h-8 bg-gray-200"></div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-400">便當數</span>
                            <span className="font-bold text-lg text-green-600">+{req.bentoQty}</span>
                          </div>
                        </>
                      )}
                      <button onClick={() => handleEdit(req)} className="ml-2 p-1.5 hover:bg-gray-200 rounded-full text-gray-400 hover:text-blue-600 transition-colors" title="修改數值">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>

                {/* 右側按鈕 */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-sm active:translate-y-0.5 transition-all"
                  >
                    {processingId === req.id ? "處理中..." : (editingId === req.id ? "確認修改並核准" : "確認核准")}
                  </button>
                  
                  {editingId === req.id ? (
                    <button 
                      onClick={() => setEditingId(null)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-600 px-3 py-2 rounded-xl font-bold"
                    >
                      取消
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleReject(req)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-5 h-5" /> 拒絕
                    </button>
                  )}
                </div>
              </div>
              
              {editingId === req.id && (
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 p-2 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  您正在修改此筆申請的數值，確認後將以修改後的數值寫入顧客帳戶。
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RequestApproval;