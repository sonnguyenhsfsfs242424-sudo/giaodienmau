/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Search,
  Link2,
  Download,
  FolderCheck,
  Settings,
  HardDrive,
  Wifi,
  Sparkles,
} from 'lucide-react';

export type NavTab = 'search' | 'direct_url' | 'downloads' | 'completed' | 'settings';

interface NavigationRailProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  downloadCount: number;
  completedCount: number;
}

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activeTab,
  onSelectTab,
  downloadCount,
  completedCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'search',
      label: 'Tìm kiếm từ khóa',
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: 'direct_url',
      label: 'Trích xuất link Douyin',
      icon: <Link2 className="w-4 h-4" />,
    },
    {
      id: 'downloads',
      label: 'Tiến trình tải xuống',
      icon: <Download className="w-4 h-4" />,
      badge: downloadCount > 0 ? downloadCount : undefined,
    },
    {
      id: 'completed',
      label: 'Video đã tải về',
      icon: <FolderCheck className="w-4 h-4" />,
      badge: completedCount > 0 ? completedCount : undefined,
    },
    {
      id: 'settings',
      label: 'Cài đặt hệ thống',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <aside className="w-56 shrink-0 bg-neutral-100/80 dark:bg-[#1e1e1e] border-r border-neutral-200 dark:border-[#2d2d2d] flex flex-col justify-between py-2 text-xs select-none">
      {/* Navigation Links */}
      <nav className="space-y-1 px-2">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          Điều hướng Windows
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all text-left relative ${
                isActive
                  ? 'bg-white dark:bg-[#2b2b2b] text-[#0067c0] dark:text-[#60cdff] font-semibold shadow-2xs'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-[#282828]'
              }`}
            >
              {/* Fluent Active Indicator Pill */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0067c0] dark:bg-[#60cdff] rounded-r-full" />
              )}

              <div className="flex items-center space-x-2.5 truncate">
                <span className={isActive ? 'text-[#0067c0] dark:text-[#60cdff]' : 'text-neutral-500 dark:text-neutral-400'}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.id === 'downloads'
                      ? 'bg-sky-500 text-white animate-pulse'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Windows Disk & System Status Widget */}
      <div className="px-3 pt-3 border-t border-neutral-200 dark:border-[#2d2d2d] space-y-2 text-[11px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <HardDrive className="w-3.5 h-3.5 text-neutral-400" />
            <span className="font-medium text-neutral-700 dark:text-neutral-300">Ổ C: (M.2 NVMe)</span>
          </div>
          <span className="text-[10px]">184 GB trống</span>
        </div>

        {/* Disk Space Progress Bar */}
        <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
          <div className="h-full bg-[#0067c0] dark:bg-[#60cdff] rounded-full" style={{ width: '64%' }} />
        </div>

        <div className="flex items-center justify-between text-[10px] pt-1">
          <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
            <Wifi className="w-3 h-3" />
            <span>Kết nối ổn định</span>
          </div>
          <span className="text-neutral-400">v2.4 Win11</span>
        </div>
      </div>
    </aside>
  );
};
