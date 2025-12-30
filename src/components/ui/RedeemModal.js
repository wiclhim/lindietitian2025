// src/components/ui/RedeemModal.js
import React from "react";
import { XCircle, Gift, Loader2 } from "lucide-react";

const RedeemModal = ({ isOpen, onClose, onConfirm, prizeName, milestone, isProcessing, theme }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl w-full max-w-sm relative shadow-2xl animate-in zoom-in duration-200">
        <button 
          onClick={!isProcessing ? onClose : undefined} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          disabled={isProcessing}
        >
          <XCircle className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-2"
                style={{ backgroundColor: `${theme.colors.cardBg}`, borderColor: theme.colors.accent }}>
            <Gift className="w-8 h-8" style={{ color: theme.colors.primary }} />
          </div>
          
          <h3 className="text-xl font-bold mb-2" style={{ color: theme.colors.textDark }}>確認兌換好禮？</h3>
          <p className="mb-6" style={{ color: theme.colors.textDark }}>
            您即將使用累積的 
            <span className="font-bold mx-1" style={{ color: theme.colors.primary }}>{milestone}</span> 
            點數兌換：<br/>
            <span className="font-bold text-lg mt-2 block" style={{ color: theme.colors.secondary }}>{prizeName}</span>
            {Number(milestone) === 20 && (
                <span className="block text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
                  (注意：兌換 20 點大獎後，將扣除 20 點並開啟新的一輪集點！)
                </span>
            )}
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              再想想
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl font-bold text-white shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: theme.colors.primary }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 處理中
                </>
              ) : (
                "確認兌換"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedeemModal;