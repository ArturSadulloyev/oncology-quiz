'use client';

import React, { useState } from 'react';
import { isTelegramWebApp, getTelegramWebApp, TelegramUser } from '../lib/telegram';
import { ShieldCheck, Monitor, Smartphone, ChevronDown, ChevronUp, X } from 'lucide-react';

interface DevEnvironmentBadgeProps {
  user: TelegramUser;
  isTelegram: boolean;
}

export const DevEnvironmentBadge: React.FC<DevEnvironmentBadgeProps> = ({
  user,
  isTelegram,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Only display in development or when ?debug=1 is in URL
  const isDev = process.env.NODE_ENV !== 'production';
  const hasDebugQuery =
    typeof window !== 'undefined' && window.location.search.includes('debug=1');

  if (!isDev && !hasDebugQuery) {
    return null;
  }

  const tg = getTelegramWebApp();

  return (
    <aside aria-label="Development Debug Panel" className="w-full bg-[#1C1C1E] text-white text-[11px] px-3 py-1.5 border-b border-white/10 shadow-sm z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isTelegram ? (
            <span className="flex items-center gap-1.5 font-bold text-[#34C759]">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" />
              <Smartphone className="w-3.5 h-3.5" />
              <span>Telegram Mini App</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 font-bold text-[#007AFF]">
              <span className="w-2 h-2 rounded-full bg-[#007AFF]" />
              <Monitor className="w-3.5 h-3.5" />
              <span>Browser mode</span>
            </span>
          )}
          <span className="text-white/40">|</span>
          <span className="text-white/80 font-medium truncate max-w-[120px]">
            {user.first_name}
          </span>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white flex items-center gap-0.5 px-1 py-0.5 rounded transition-colors"
        >
          <span>{isExpanded ? 'Yopish' : 'Debug'}</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {isExpanded && (
        <div className="max-w-md mx-auto mt-2 pt-2 border-t border-white/10 space-y-1 text-white/70 font-mono text-[10px]">
          <div>Platform: <span className="text-white font-bold">{tg?.platform || 'Standard Web Browser'}</span></div>
          <div>Color Scheme: <span className="text-white">{tg?.colorScheme || 'light'}</span></div>
          <div>Viewport Height: <span className="text-white">{tg?.viewportHeight || window.innerHeight}px</span></div>
          <div>InitData length: <span className="text-white">{tg?.initData ? `${tg.initData.length} chars` : '0 (Browser fallback)'}</span></div>
          <div>User ID: <span className="text-white">{user.id}</span></div>
        </div>
      )}
    </aside>
  );
};
