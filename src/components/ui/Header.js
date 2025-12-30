// src/components/ui/Header.js
import React from "react";
import { Utensils, LogOut } from "lucide-react";

function Header({ view, setView, goToMenu, handleLogout, theme, isDemoMode }) {
    return (
      <header className={`p-4 shadow-lg sticky ${isDemoMode ? 'top-6' : 'top-0'} z-20 border-b-4 transition-all`}
              style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.accent }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer active:opacity-80 transition-opacity" onClick={() => setView("landing")}>
            <theme.icon className="w-7 h-7" style={{ color: theme.colors.accent }} />
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-wider drop-shadow-sm leading-tight text-white">木木營養食</h1>
              <p className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-white/80">{theme.title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            {view !== "landing" && view !== "menu-view" && (
              <button onClick={goToMenu} className="text-xs md:text-sm font-bold px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm active:scale-95 border border-black/10"
                      style={{ backgroundColor: theme.colors.accent, color: theme.colors.textDark }}>
                <Utensils className="w-4 h-4" /> <span className="hidden md:inline">查看</span>菜單
              </button>
            )}
            {view !== "landing" && (
              <button onClick={handleLogout} className="text-xs md:text-sm bg-black/20 hover:bg-black/40 text-white px-3 py-2 rounded-lg flex items-center gap-1 transition-colors shadow-sm active:scale-95">
                <LogOut className="w-4 h-4" /> <span className="hidden md:inline">登出</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
}

export default Header;