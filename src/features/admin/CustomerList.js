// src/features/admin/CustomerList.js
import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { Users, Trash2 } from "lucide-react";
import { db } from "../../config/firebase";

const CustomerList = ({ theme, isDemoMode }) => {
  const [customers, setCustomers] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  
  const customersRef = collection(db, "customers");
  
  useEffect(() => { 
      if (isDemoMode) {
          setCustomers([
              { id: '1', phone: '0912345678', name: '王小明', totalSpent: 3200, points: 5, pin: '0000' },
              { id: '2', phone: '0987654321', name: '陳美麗', totalSpent: 150, points: 0, pin: '1234' },
          ]);
          return;
      }
      const q = query(customersRef, orderBy("totalSpent", "desc")); 
      const unsubscribe = onSnapshot(q, (snapshot) => { setCustomers(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))); }); return () => unsubscribe(); 
  }, [isDemoMode]);
  
  const handleConfirmDelete = async (id) => { 
      if (isDemoMode) {
          setCustomers(prev => prev.filter(c => c.id !== id));
          setDeleteConfirmId(null);
          return;
      }
      await deleteDoc(doc(customersRef, id)); setDeleteConfirmId(null); 
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden max-w-4xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
      <div className="p-5 bg-gray-50 border-b" style={{ borderColor: theme.colors.cardBorder }}><h2 className="font-bold text-lg flex items-center gap-2" style={{ color: theme.colors.textDark }}><Users className="w-5 h-5" /> 顧客列表 ({customers.length})</h2></div>
      <div className="divide-y divide-gray-100 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {customers.map((c) => (
          <div key={c.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex flex-col">
              <p className="font-bold text-lg tracking-wide text-gray-800">{c.phone}</p>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>{c.name || "未命名"}</span>
                <span className="text-gray-300">|</span>
                <span>密碼: {c.pin}</span>
                <span className="text-gray-300">|</span>
                <span>點數: {c.points || 0}</span>
              </div>
            </div>
            <div className="flex items-center gap-4"><span className="font-bold text-xl px-3 py-1 rounded-lg border bg-white" style={{ color: theme.colors.textDark, borderColor: theme.colors.cardBorder }}>${c.totalSpent}</span>{deleteConfirmId === c.id ? (<div className="flex items-center gap-2 animate-in zoom-in duration-200"><button onClick={() => handleConfirmDelete(c.id)} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg">確定</button><button onClick={() => setDeleteConfirmId(null)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg">取消</button></div>) : (<button onClick={() => setDeleteConfirmId(c.id)} className="text-gray-300 hover:text-red-600 p-2 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button>)}</div>
          </div>
        ))}
        {customers.length === 0 && <p className="text-center p-8 text-gray-400">目前還沒有顧客資料</p>}
      </div>
    </div>
  );
};

export default CustomerList;