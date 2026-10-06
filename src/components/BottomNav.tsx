import React from 'react';
import { NavTab } from '../types/quiz';
import { Home, BookOpen, AlertCircle, History, BarChart2 } from 'lucide-react';
import { triggerHaptic } from '../lib/telegram';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  mistakesBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  mistakesBadgeCount = 0,
}) => {
  const tabs: { key: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'home', label: 'Asosiy', icon: Home },
    { key: 'practice', label: 'Mashq', icon: BookOpen },
    { key: 'mistakes', label: 'Xatolar', icon: AlertCircle },
    { key: 'history', label: 'Tarix', icon: History },
    { key: 'stats', label: 'Statistika', icon: BarChart2 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#FFFFFF]/90 backdrop-blur-md border-t border-[#E5E5EA] transition-all">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                triggerHaptic('selection');
                onChangeTab(tab.key);
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-press relative ${
                isActive ? 'text-[#007AFF]' : 'text-[#8E8E93]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.5]' : 'stroke-2'}`} />
                {tab.key === 'mistakes' && mistakesBadgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FF3B30] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center shadow-sm">
                    {mistakesBadgeCount > 99 ? '99+' : mistakesBadgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-1 font-medium ${isActive ? 'font-semibold text-[#007AFF]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* iOS Home Indicator Spacer */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </nav>
  );
};
