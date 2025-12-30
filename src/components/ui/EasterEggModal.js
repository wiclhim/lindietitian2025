// src/components/ui/EasterEggModal.js
import React from "react";
import { XCircle } from "lucide-react";

const EasterEggModal = ({ onClose, theme }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="p-8 rounded-3xl border-4 text-center max-w-sm w-full relative overflow-hidden shadow-2xl animate-in zoom-in duration-300"
           style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.accent }}>
        <button onClick={onClose} className="absolute top-2 right-2 hover:opacity-80 text-white">
          <XCircle className="w-8 h-8" />
        </button>
        <div className="mb-4 flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg animate-bounce">
                <img src={theme.logo} alt="Logo" className="w-16 h-16 object-contain" />
            </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 drop-shadow-md" style={{ color: theme.colors.accent }}>Surprise!</h2>
        <h3 className="text-xl font-bold text-white mb-4">發現隱藏彩蛋！</h3>
        <p className="text-white text-lg leading-relaxed mb-6 font-medium">
          感謝您對木木營養食的支持！<br/>
          祝您天天開心，<br/>
          健康滿滿！
          <br/>
          <span className="text-sm opacity-80 mt-2 block">(別忘了告訴店長你發現了這個秘密!)</span>
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl font-bold transition-colors shadow-lg"
           style={{ backgroundColor: theme.colors.accent, color: theme.colors.textDark }}>
          收下祝福 🎁
        </button>
      </div>
    </div>
  );
};

export default EasterEggModal;