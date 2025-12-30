// src/features/admin/CheckInSystem.js
import React, { useState } from "react";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp, collection } from "firebase/firestore";
import { PlusCircle, Search, Save, Calendar, Utensils, Ticket } from "lucide-react";
import { db } from "../../config/firebase";

const CheckInSystem = ({ theme, isDemoMode }) => {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [bentoQty, setBentoQty] = useState("");
  
  const getTodayDate = () => {
    const d = new Date();
    const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    return localDate.toISOString().split("T")[0];
  };
  const [date, setDate] = useState(getTodayDate());
  
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [msg, setMsg] = useState({ type: "", text: "" });
  
  const customersRef = collection(db, "customers");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone) return;
    if (isDemoMode) {
        setCurrentCustomer({ id: phone, phone, name: "測試顧客", points: 5, totalSpent: 1500 });
        setMsg({ type: "success", text: `展示模式：已讀取顧客資料` });
        return;
    }
    const docRef = doc(customersRef, phone);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) { setCurrentCustomer({ id: docSnap.id, ...docSnap.data() }); setMsg({ type: "success", text: `已讀取顧客資料` }); }
    else { setCurrentCustomer(null); setMsg({ type: "info", text: "查無此號碼，輸入金額將自動建立新顧客 (預設密碼 0000)" }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
        setMsg({ type: "success", text: "展示模式：模擬儲存成功！" });
        setAmount(""); setBentoQty(""); setCurrentCustomer(null);
        return;
    }
    if (!phone || !date) return;
    const addVal = parseInt(amount, 10) || 0; 
    const addPoints = parseInt(bentoQty, 10) || 0; 
    if (addVal < 0) return; 
    if (addVal === 0 && addPoints === 0) return; 

    const selectedDate = new Date(date);
    const historyDate = selectedDate.toISOString();

    try {
      if (currentCustomer) {
        const newTotal = (currentCustomer.totalSpent || 0) + addVal;
        const currentPoints = Number(currentCustomer.points) || 0;
        const newPoints = currentPoints + addPoints; 

        await updateDoc(doc(customersRef, currentCustomer.id), {
          totalSpent: newTotal,
          points: newPoints,
          lastVisit: selectedDate,
          history: [...(currentCustomer.history || []), { date: historyDate, amount: addVal, bentoQty: addPoints }],
        });
        setMsg({ type: "success", text: `成功補登 ${date} 消費 ${addVal} 元 (${addPoints} 點)！` });
      } else {
        const newUser = {
          phone, name: "店內新客", pin: "0000", totalSpent: addVal, points: addPoints, usedTicketCount: 0,
          joinedAt: serverTimestamp(), lastVisit: selectedDate,
          history: [{ date: historyDate, amount: addVal, bentoQty: addPoints }],
        };
        await setDoc(doc(customersRef, phone), newUser);
        setMsg({ type: "success", text: `已建立新顧客並補登消費！` });
      }
      setAmount(""); setBentoQty(""); setCurrentCustomer(null);
    } catch (err) { console.error(err); setMsg({ type: "error", text: "儲存失敗" }); }
  };

  const total = currentCustomer ? currentCustomer.totalSpent : 0;
  const currentPoints = currentCustomer ? (currentCustomer.points || 0) : 0;
  const tickets = Math.floor(total / 300);

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border max-w-2xl mx-auto" style={{ borderColor: theme.colors.cardBorder }}>
      <h2 className="font-bold mb-6 text-xl flex items-center gap-2" style={{ color: theme.colors.textDark }}><PlusCircle style={{ color: theme.colors.primary }} /> 快速消費登記</h2>
      <form onSubmit={currentCustomer ? handleSubmit : handleSearch} className="space-y-6">
        <div className="flex gap-3">
          <input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setCurrentCustomer(null); setMsg({ type: "", text: "" }); }} onBlur={handleSearch} placeholder="輸入顧客手機" className="flex-1 p-4 border-2 rounded-xl outline-none text-xl tracking-wider placeholder:tracking-normal bg-gray-50 text-gray-800" style={{ borderColor: theme.colors.cardBorder, focusBorderColor: theme.colors.primary }} inputMode="tel" />
          <button type="button" onClick={handleSearch} className="bg-gray-100 px-6 rounded-xl hover:bg-gray-200 border-2 active:bg-gray-300" style={{ borderColor: theme.colors.cardBorder }}><Search className="w-6 h-6 text-gray-600" /></button>
        </div>

        {currentCustomer && (
          <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex justify-between items-center animate-in zoom-in duration-300">
            <div>
              <p className="font-bold text-green-800 text-lg">{currentCustomer.name || currentCustomer.phone}</p>
              <p className="text-sm text-green-700">累積消費: <span className="font-bold">${total}</span> | 點數: <span className="font-bold">{currentPoints}</span></p>
            </div>
            <div className="text-2xl font-bold text-green-700 flex items-center gap-2 bg-white px-3 py-1 rounded-lg shadow-sm"><Ticket className="w-6 h-6" /> {tickets}</div>
          </div>
        )}

        {msg.text && !currentCustomer && <div className={`p-4 text-base font-medium rounded-xl text-center ${msg.type === "error" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}`}>{msg.text}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><Calendar className="w-4 h-4" /> 消費日期</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-4 border rounded-xl outline-none text-gray-800 bg-white text-lg h-[60px]" style={{ borderColor: theme.colors.cardBorder }} /></div>
          <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">消費金額</label>
              <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  onWheel={(e) => e.target.blur()} 
                  placeholder="$" 
                  className="w-full p-4 border rounded-xl text-2xl font-bold text-center outline-none h-[60px] text-gray-800" 
                  style={{ borderColor: theme.colors.cardBorder }} 
                  inputMode="numeric" 
              />
          </div>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-1"><Utensils className="w-4 h-4" /> 便當數量 (集點用)</label>
           <input 
               type="number" 
               value={bentoQty} 
               onChange={(e) => setBentoQty(e.target.value)} 
               onWheel={(e) => e.target.blur()} 
               placeholder="0" 
               className="w-full p-4 border rounded-xl text-xl font-bold text-center outline-none h-[60px] text-gray-800" 
               style={{ borderColor: theme.colors.cardBorder }} 
               inputMode="numeric" 
           />
        </div>

        <button className="w-full text-white font-bold py-5 rounded-2xl shadow-lg active:shadow-none active:translate-y-1 transition-all text-xl flex items-center justify-center gap-2" style={{ backgroundColor: theme.colors.primary }}><Save className="w-6 h-6" /> {currentCustomer ? "確認累積" : "建立並累積"}</button>
      </form>
    </div>
  );
};

export default CheckInSystem;