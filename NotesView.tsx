import React from 'react';
import { Home, PieChart, Settings, StickyNote } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavigationProps {
  activeTab: 'daily' | 'summary' | 'settings' | 'notes';
  onTabChange: (tab: 'daily' | 'summary' | 'settings' | 'notes') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'daily', label: 'Daily', icon: Home },
    { id: 'notes', label: 'Notes', icon: StickyNote },
    { id: 'summary', label: 'Report', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/80 backdrop-blur-lg px-6 pb-8 pt-3">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-all",
                isActive ? "bg-blue-50" : "bg-transparent"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
