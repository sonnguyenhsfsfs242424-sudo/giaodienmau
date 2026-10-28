/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HardDrive, Wifi, ShieldCheck, Activity } from 'lucide-react';

interface StatusBarProps {
  totalVideos: number;
  selectedCount: number;
  activeDownloadsCount: number;
  totalSpeed: number;
  downloadFolder: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  totalVideos,
  selectedCount,
  activeDownloadsCount,
  totalSpeed,
  downloadFolder,
}) => {
  return (
    <footer className="h-6 w-full bg-neutral-200 dark:bg-[#1c1c1c] border-t border-neutral-300 dark:border-[#2f2f2f] px-3 flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400 select-none z-30">
      {/* Left items */}
      <div className="flex items-center space-x-3 truncate">
        <span className="truncate">
          Tổng số video: <b className="text-neutral-800 dark:text-neutral-200">{totalVideos}</b>
        </span>
        <span>|</span>
        <span>
          Đã chọn: <b className="text-[#0067c0] dark:text-[#60cdff]">{selectedCount}</b>
        </span>
        {activeDownloadsCount > 0 && (
          <>
            <span>|</span>
            <span className="flex items-center space-x-1 text-[#0067c0] dark:text-[#60cdff]">
              <Activity className="w-3 h-3 animate-spin" />
              <span>Đang tải: {activeDownloadsCount} video ({totalSpeed.toFixed(1)} MB/s)</span>
            </span>
          </>
        )}
      </div>

      {/* Right items */}
      <div className="hidden sm:flex items-center space-x-3 shrink-0">
        <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Bóc tách No-Watermark: Sẵn sàng</span>
        </div>
        <span>|</span>
        <div className="flex items-center space-x-1">
          <HardDrive className="w-3 h-3" />
          <span>Ổ C: 184 GB trống</span>
        </div>
        <span>|</span>
        <span>100%</span>
      </div>
    </footer>
  );
};
