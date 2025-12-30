// src/features/games/MiniGames.js
import React, { useState } from "react";
import { Gift, Eraser } from "lucide-react";

export const DiceGame = ({ onEnd, onClose, theme }) => {
    const [pScore, setPScore] = useState(0);
    const [hScore, setHScore] = useState(0);
    const [stage, setStage] = useState('ready'); // ready, rolling, result

    const roll = () => {
        setStage('rolling');
        let count = 0;
        const interval = setInterval(() => {
            setPScore(Math.ceil(Math.random() * 6));
            setHScore(Math.ceil(Math.random() * 6));
            count++;
            if (count > 10) {
                clearInterval(interval);
                const finalP = Math.ceil(Math.random() * 6);
                const finalH = Math.ceil(Math.random() * 6);
                setPScore(finalP); setHScore(finalH);
                setStage('result');
                setTimeout(() => onEnd(finalP > finalH), 1500); 
            }
        }, 100);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
            <div className="bg-white p-8 rounded-3xl w-80 text-center animate-in zoom-in">
                <h3 className="text-2xl font-bold mb-8">🎲 骰子比大小</h3>
                <div className="flex justify-around mb-8">
                    <div><p className="mb-2 text-gray-500 text-sm">你</p><div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-4xl font-bold text-blue-600 border-2 border-blue-200">{pScore || "?"}</div></div>
                    <div className="flex items-center text-gray-300 font-bold">VS</div>
                    <div><p className="mb-2 text-gray-500 text-sm">店長</p><div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center text-4xl font-bold text-red-600 border-2 border-red-200">{hScore || "?"}</div></div>
                </div>
                {stage === 'result' && (
                    <div className={`text-xl font-bold mb-4 ${pScore > hScore ? 'text-green-600' : 'text-gray-500'}`}>
                        {pScore > hScore ? "你贏了！" : pScore === hScore ? "平手..." : "再接再厲！"}
                    </div>
                )}
                {stage === 'ready' && (
                    <button onClick={roll} className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform" style={{ backgroundColor: theme.colors.primary }}>擲骰子</button>
                )}
                <button onClick={onClose} className="mt-4 text-gray-400 text-sm underline">放棄離開</button>
            </div>
        </div>
    );
};

export const RPSGame = ({ onEnd, onClose, theme }) => {
    const options = ['✌️', '✊', '🖐️']; // 0:剪刀, 1:石頭, 2:布
    const [result, setResult] = useState(null); // null, win, lose, draw

    const play = (choice) => {
        const houseChoice = Math.floor(Math.random() * 3);
        let isWin = false;
        let isDraw = false;
        
        if (choice === houseChoice) isDraw = true;
        else if ((choice === 0 && houseChoice === 2) || (choice === 1 && houseChoice === 0) || (choice === 2 && houseChoice === 1)) isWin = true;

        if (isDraw) {
            alert(`店長也出 ${options[houseChoice]}！平手，請再出一次！`);
            return; 
        }
        
        setResult({ player: options[choice], house: options[houseChoice], isWin });
        setTimeout(() => onEnd(isWin), 1500);
    };

    if (result) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
                <div className="bg-white p-8 rounded-3xl w-80 text-center animate-in zoom-in">
                    <div className="text-6xl mb-4">{result.isWin ? '🎉' : '😢'}</div>
                    <h3 className="text-2xl font-bold mb-2">{result.isWin ? '你贏了！' : '可惜輸了'}</h3>
                    <p className="text-gray-500 mb-6">你出 {result.player} vs 店長出 {result.house}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
            <div className="bg-white p-6 rounded-3xl w-full max-w-sm text-center animate-in zoom-in">
                <h3 className="text-2xl font-bold mb-2">✌️ 剪刀石頭布</h3>
                <p className="text-gray-500 mb-6">贏了就有獎，平手再以此！</p>
                <div className="grid grid-cols-3 gap-4">
                    {options.map((opt, idx) => (
                        <button key={idx} onClick={() => play(idx)} 
                            className="aspect-square rounded-2xl bg-gray-50 text-4xl hover:bg-blue-50 hover:scale-105 transition-all border-2 border-gray-200 shadow-sm flex items-center justify-center">
                            {opt}
                        </button>
                    ))}
                </div>
                <button onClick={onClose} className="mt-6 text-gray-400 text-sm underline">放棄離開</button>
            </div>
        </div>
    );
};

export const ScratchGame = ({ onEnd, onClose, theme }) => {
    const [scratched, setScratched] = useState(false);
    const [isWin, setIsWin] = useState(false);
    
    const handleScratch = () => {
        if (scratched) return;
        setScratched(true);
        const win = Math.random() < 0.33;
        setIsWin(win);
        setTimeout(() => onEnd(win), 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80">
            <div className="bg-white p-6 rounded-3xl w-80 text-center animate-in zoom-in relative">
                 <h3 className="text-xl font-bold mb-4">🎫 幸運刮刮樂</h3>
                 <div className="relative w-64 h-32 mx-auto rounded-xl overflow-hidden shadow-inner bg-gray-100 flex items-center justify-center border-2 border-gray-300">
                     <div className={`text-2xl font-bold flex items-center gap-2 ${isWin ? 'text-red-500' : 'text-gray-400'}`}>
                         {isWin ? <><Gift className="animate-bounce"/> 中獎了!</> : "銘謝惠顧"}
                     </div>
                     {!scratched && (
                         <button onClick={handleScratch} 
                            className="absolute inset-0 bg-gray-400 flex flex-col items-center justify-center text-white hover:bg-gray-500 transition-colors z-10 cursor-pointer">
                             <Eraser className="w-8 h-8 mb-2 animate-pulse" />
                             <span className="font-bold tracking-widest">點擊刮開</span>
                         </button>
                     )}
                 </div>
                 <p className="mt-4 text-sm text-gray-500">{scratched ? (isWin ? "正在領取獎品..." : "運氣不好，明天再來！") : "祝您中大獎！"}</p>
                 {!scratched && <button onClick={onClose} className="mt-4 text-gray-400 text-sm underline">放棄離開</button>}
            </div>
        </div>
    );
};