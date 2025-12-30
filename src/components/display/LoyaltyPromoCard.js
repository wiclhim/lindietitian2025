// src/components/display/LoyaltyPromoCard.js
import React from "react";
import { Crown, Phone, Utensils, Gift, CheckCircle2 } from "lucide-react";

const LoyaltyPromoCard = ({ theme }) => {
    return (
        <div className="w-full max-w-md mt-6 backdrop-blur-sm p-5 rounded-2xl shadow-xl border-4 relative overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-2"
             style={{ backgroundColor: 'rgba(255,255,255,0.95)', borderColor: theme.colors.cardBorder }}>
            <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2 border-b-2 border-dashed pb-3"
                style={{ color: theme.colors.textDark, borderColor: theme.colors.accent }}>
                <Crown className="w-6 h-6" style={{ color: theme.colors.primary }} /> 集點活動說明
            </h3>
            
            <div className="flex justify-between items-center px-2 mb-4 relative">
                <div className="absolute top-1/2 left-4 right-4 h-1 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
                
                <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2" 
                          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
                        <Phone className="w-5 h-5" style={{ color: theme.colors.secondary }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.textDark }}>報電話</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2" 
                          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
                        <Utensils className="w-5 h-5" style={{ color: theme.colors.primary }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.textDark }}>吃便當</span>
                </div>
                
                <div className="flex flex-col items-center gap-1 bg-white p-2 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm border-2" 
                          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.accent }}>
                        <Gift className="w-5 h-5 animate-bounce" style={{ color: theme.colors.success }} />
                    </div>
                    <span className="text-xs font-bold" style={{ color: theme.colors.textDark }}>換好禮</span>
                </div>
            </div>

            <ul className="space-y-2 text-sm md:text-base font-medium" style={{ color: theme.colors.textDark }}>
                <li className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.colors.success }} />
                    <span>消費任一餐盒即可累積 1 點</span>
                </li>
                <li className="flex items-start gap-2 bg-gray-50 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: theme.colors.success }} />
                    <span>集滿 10 / 15 / 20 點可兌換專屬美味好禮</span>
                </li>
            </ul>
        </div>
    );
};

export default LoyaltyPromoCard;