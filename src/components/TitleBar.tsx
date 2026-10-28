/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Minus, Square, Copy, X, Sun, Moon, Maximize2, ShieldCheck } from 'lucide-react';

interface TitleBarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  isMaximized: boolean;
  onToggleMaximize: () => void;
  onMinimize: () => void;
  onClose: () => void;
  activeTabTitle: string;
}

export const TitleBar: React.FC<TitleBarProps> = ({
  darkMode,
  onToggleDarkMode,
  isMaximized,
  onToggleMaximize,
  onMinimize,
  onClose,
  activeTabTitle,
}) => {
  return (
    <header className="h-9 w-full flex items-center justify-between select-none bg-neutral-100 dark:bg-[#1f1f1f] border-b border-neutral-200 dark:border-[#2f2f2f] text-xs text-neutral-700 dark:text-neutral-300 transition-colors z-40">
      {/* Left: App Icon & Title */}
      <div className="flex items-center space-x-2.5 px-3 min-w-0">
        {/* Douyin Windows Fluent Logo */}
        <div className="w-5 h-5 rounded flex items-center justify-center bg-gradient-to-tr from-cyan-500 via-pink-500 to-red-500 text-white shadow-xs">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.89 2.89 0 0 1-2.882 2.882 2.89 2.89 0 0 1-2.882-2.882 2.89 2.89 0 0 1 2.882-2.882c.42 0 .822.091 1.187.255V9.45a6.31 6.31 0 0 0-1.187-.113A6.335 6.335 0 0 0 3.157 15.672 6.335 6.335 0 0 0 9.492 22a6.335 6.335 0 0 0 6.335-6.328V9.172a8.212 8.212 0 0 0 5.074 1.745V7.472a4.802 4.802 0 0 1-1.312-.786z" />
          </svg>
        </div>

        <span className="font-semibold text-neutral-800 dark:text-neutral-100 truncate text-[13px]">
          Douyin Downloader Pro
        </span>

        <span className="text-neutral-400 dark:text-neutral-500">|</span>

        <span className="truncate text-neutral-500 dark:text-neutral-400 text-[11px] hidden sm:inline">
          {activeTabTitle} - [Giao diện Windows 11 Fluent]
        </span>

        <div className="hidden md:flex items-center space-x-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-medium border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>Bóc Tách Không Watermark 1080p/4K</span>
        </div>
      </div>

      {/* Right: Quick actions & Window Controls */}
      <div className="flex items-center h-full">
        {/* Dark/Light mode toggle */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối (Windows Dark Mode)'}
          aria-label="Chuyển chế độ sáng tối"
          className="h-full px-3 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-[#2d2d2d] transition-colors text-neutral-600 dark:text-neutral-300"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-neutral-700" />}
        </button>

        {/* Windows Caption Buttons */}
        {/* Minimize */}
        <button
          onClick={onMinimize}
          title="Thu nhỏ cửa sổ"
          aria-label="Thu nhỏ"
          className="h-full w-11 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-[#2d2d2d] transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Maximize / Restore */}
        <button
          onClick={onToggleMaximize}
          title={isMaximized ? 'Khôi phục kích thước' : 'Phóng to cửa sổ'}
          aria-label="Phóng to hoặc khôi phục"
          className="h-full w-11 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-[#2d2d2d] transition-colors"
        >
          {isMaximized ? <Copy className="w-3.5 h-3.5 rotate-180" /> : <Square className="w-3 h-3" />}
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          title="Đóng ứng dụng"
          aria-label="Đóng"
          className="h-full w-12 flex items-center justify-center hover:bg-[#e81123] hover:text-white transition-colors group"
        >
          <X className="w-4 h-4 text-neutral-600 dark:text-neutral-300 group-hover:text-white" />
        </button>
      </div>
    </header>
  );
};
