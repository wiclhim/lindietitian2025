// src/components/display/PrizeShowcase.js
import React from "react";
import { Utensils, Store, Ticket, Star, HelpCircle, Calendar } from "lucide-react";

const PrizeShowcase = ({ theme }) => {
    const prizes = [
        { icon: <Utensils className="w-5 h-5" style={{ color: theme.colors.primary }} />, text: "單點買一送一 (限同品項)" },
        { icon: <Store className="w-5 h-5" style={{ color: theme.colors.secondary }} />, text: "餐盒買一送一 (限同品項)" },
        { icon: <Ticket className="w-5 h-5" style={{ color: theme.colors.success }} />, text: "20元折價券 x3" },
        { icon: <Ticket className="w-5 h-5" style={{ color: theme.colors.success }} />, text: "10元折價券 x5" },
        { icon: <Star className="w-5 h-5" style={{ color: theme.colors.accent }} />, text: "茶香豆干 x5" },
        { icon: <HelpCircle className="w-5 h-5 animate-pulse" style={{ color: theme.colors.secondary }} />, text: `${theme.title}隱藏彩蛋 ??`, isEasterEgg: true },
    ];
    const handleHint = () => {
        alert("🤫 偷偷告訴你：\n試著對最上方的「Logo」.....，會有神奇的事情發生喔！");
    };

    return (
        <div className="w-full max-w-md mt-6 backdrop-blur-sm p-5 md:p-6 rounded-2xl shadow-xl border-4 relative overflow-hidden transform -rotate-1 hover:rotate-0 transition-transform duration-300 z-10"
             style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: theme.colors.cardBorder }}>
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="text-white text-[10px] font-bold py-1 px-8 absolute top-3 -right-6 rotate-45 shadow-sm"
                     style={{ backgroundColor: theme.colors.primary }}>Prizes</div>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2 border-b-2 border-dashed pb-3"
                style={{ color: theme.colors.textDark, borderColor: theme.colors.accent }}>
                <theme.icon className="w-7 h-7" style={{ color: theme.colors.primary }} /> 豐富獎項等你抽！
            </h3>
            <ul className="space-y-3">
                {prizes.map((p, i) => (
                    <li key={i} onClick={p.isEasterEgg ? handleHint : undefined} title={p.isEasterEgg ? "點我查看提示！" : ""} 
                        className={`flex items-center gap-3 font-bold text-base md:text-lg group hover:bg-gray-50 p-1 rounded-lg transition-all ${p.isEasterEgg ? "cursor-pointer hover:scale-105" : ""}`}
                        style={{ color: theme.colors.textDark }}>
                        <div className={`p-2 rounded-full shadow-inner border transition-transform ${p.isEasterEgg ? "group-hover:rotate-12" : "group-hover:scale-110"}`}
                             style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>{p.icon}</div>
                        {p.text}
                        {p.isEasterEgg && <span className="text-xs text-white font-normal ml-auto border rounded px-1.5 py-0.5 transition-colors" style={{ backgroundColor: theme.colors.primary }}>點我</span>}
                    </li>
                ))}
            </ul>
            <div className="mt-5 text-white text-center py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 animate-pulse"
                 style={{ background: `linear-gradient(to right, ${theme.colors.primary}, ${theme.colors.primaryHover})` }}>
                <Calendar className="w-5 h-5" /> <span>公開抽獎日：12/25</span>
            </div>
        </div>
    );
};

export default PrizeShowcase;