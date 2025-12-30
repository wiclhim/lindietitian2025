// src/components/display/LoyaltyCard.js
import React from "react";
import { Crown, Gift, CheckCircle2 } from "lucide-react";

const LoyaltyCard = ({ points = 0, redeemedMilestones = [], onRedeemClick, theme, settings }) => {
  const maxPoints = 20;
  const milestones = [10, 15, 20];
  const safePoints = Number(points) || 0;

  return (
    <div className="p-4 md:p-6 rounded-3xl shadow-lg border-2 relative overflow-hidden"
          style={{ backgroundColor: theme.colors.cardBg, borderColor: theme.colors.cardBorder }}>
       <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: theme.colors.textDark }}></div>
       
       <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl flex items-center gap-2" style={{ color: theme.colors.textDark }}>
             <Crown className="w-6 h-6 fill-current" style={{ color: theme.colors.accent }} />
             便當集點卡
          </h3>
          <div className="text-white px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: theme.colors.textDark }}>
              目前點數：{safePoints} 點
          </div>
       </div>

       <p className="text-xs mb-4" style={{ color: theme.colors.textDark, opacity: 0.8 }}>
          * 買 1 個便當累積 1 點，達成門檻可點擊「禮物」兌換！
       </p>

       <div className="grid grid-cols-5 gap-2 md:gap-4">
          {Array.from({ length: maxPoints }).map((_, idx) => {
             const num = idx + 1;
             const isAchieved = safePoints >= num;
             const isMilestone = milestones.includes(num);
             const isRedeemed = redeemedMilestones.includes(num);
             const canRedeem = isMilestone && isAchieved && !isRedeemed;

             let bg = 'white';
             let border = '#D7CCC8';
             let text = '#D7CCC8';

             if (isRedeemed) {
                 bg = '#E5E7EB'; border = '#D1D5DB'; text = '#9CA3AF';
             } else if (canRedeem) {
                 bg = theme.colors.accent; border = theme.colors.primary; text = theme.colors.textDark;
             } else if (isAchieved) {
                 bg = theme.colors.primary; border = theme.colors.primary; text = 'white';
             } else if (isMilestone) {
                 bg = theme.colors.cardBg; border = theme.colors.accent; text = theme.colors.accent;
             }

             return (
                <div 
                   key={idx} 
                   onClick={() => canRedeem && onRedeemClick(num)}
                   className={`flex flex-col items-center gap-1 relative transition-transform ${canRedeem ? 'cursor-pointer active:scale-95 z-10' : ''}`}
                >
                   <div 
                      className={`
                          w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center relative transition-all duration-500
                          ${canRedeem ? "animate-bounce shadow-lg" : ""}
                          ${isMilestone && !isAchieved ? "border-dashed" : ""}
                        `}
                      style={{ backgroundColor: bg, borderColor: border, color: text }}
                   >
                      {isRedeemed ? (
                          <CheckCircle2 className="w-6 h-6 md:w-7 md:h-7" />
                      ) : canRedeem ? (
                          <Gift className="w-6 h-6" style={{ color: theme.colors.primary }} />
                      ) : isMilestone ? (
                          <Gift className="w-5 h-5 opacity-50" />
                      ) : (
                          <span className="font-mono font-bold text-sm md:text-base">{num}</span>
                      )}
                   </div>
                   
                    {isMilestone && (
                      <div className="text-[9px] md:text-xs font-bold px-1 rounded whitespace-nowrap"
                           style={{ 
                               color: isRedeemed ? 'gray' : theme.colors.textDark, 
                               backgroundColor: canRedeem ? theme.colors.accent : 'transparent' 
                           }}>
                         {isRedeemed ? "已領取" : settings[num] || theme.milestoneText}
                      </div>
                    )}  
              </div>
             );
          })}
       </div>
    </div>
  );
};

export default LoyaltyCard;