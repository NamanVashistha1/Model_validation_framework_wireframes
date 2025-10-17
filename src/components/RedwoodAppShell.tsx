import { useState } from 'react';
import { LayoutDashboard, LayoutGrid, AlertCircle, History, Bell, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

type NavigationView = 'dashboard' | 'inventory' | 'issues' | 'audit' | 'model-detail';

interface RedwoodAppShellProps {
  currentView: NavigationView;
  onViewChange: (view: NavigationView) => void;
  children: React.ReactNode;
}

export function RedwoodAppShell({ currentView, onViewChange, children }: RedwoodAppShellProps) {
  const navigationItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory' as const, label: 'Model Inventory', icon: LayoutGrid },
    { id: 'issues' as const, label: 'Issues', icon: AlertCircle },
    { id: 'audit' as const, label: 'Audit History', icon: History }
  ];

  return (
    <div className="flex h-screen bg-[#F7F7F7]">
      {/* Left Navigation */}
      <div className="w-60 min-w-60 flex-shrink-0 bg-white border-r border-[#E0E1E3] flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-[#E0E1E3]">
          <h1 className="text-[#1A1816] whitespace-nowrap overflow-hidden text-ellipsis">Model Inventory Tracker</h1>
        </div>
        <nav className="flex-1 py-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 py-3 transition-colors ${
                  isActive
                    ? 'bg-[#E8F3FC] text-[#0067b8] border-l-4 border-[#0067b8] pl-[calc(1.5rem-4px)] pr-6'
                    : 'text-[#262626] hover:bg-[#F2F6FB] px-6'
                }`}
              >
                <Icon className="size-5 flex-shrink-0" />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <div className="h-16 bg-white border-b border-[#E0E1E3] flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-[#1A1816]">
              {currentView === 'model-detail' ? 'Model Details' : navigationItems.find(item => item.id === currentView)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-[#F7F7F7] rounded-lg transition-colors">
              <Bell className="size-5 text-[#262626]" />
            </button>
            <Avatar>
              <AvatarFallback className="bg-[#0067b8] text-white">
                <User className="size-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
