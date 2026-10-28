/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, CheckCircle2, HardDrive, Cpu, Terminal } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-neutral-300 dark:border-[#404040] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150 text-xs">
        {/* Title bar */}
        <div className="h-9 px-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-[#333333] flex items-center justify-between">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            Thông tin Douyin Downloader Pro (Windows)
          </span>
          <button
            onClick={onClose}
            className="w-8 h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-tr from-cyan-500 via-pink-500 to-red-500 text-white shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.89 2.89 0 0 1-2.882 2.882 2.89 2.89 0 0 1-2.882-2.882 2.89 2.89 0 0 1 2.882-2.882c.42 0 .822.091 1.187.255V9.45a6.31 6.31 0 0 0-1.187-.113A6.335 6.335 0 0 0 3.157 15.672 6.335 6.335 0 0 0 9.492 22a6.335 6.335 0 0 0 6.335-6.328V9.172a8.212 8.212 0 0 0 5.074 1.745V7.472a4.802 4.802 0 0 1-1.312-.786z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                Douyin Video Downloader
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Phiên bản 2.4.0 (Windows 11 Fluent Design Build 26100)
              </p>
            </div>
          </div>

          <p className="text-neutral-600 dark:text-neutral-300 text-[11px] leading-relaxed">
            Ứng dụng chuyên nghiệp trên nền tảng Windows hỗ trợ tìm kiếm video Douyin theo từ khóa, phân tích video theo hashtag và tải xuống video chuẩn 1080p / 4K không chứa watermark (logo) với tốc độ cao.
          </p>

          <div className="bg-neutral-100 dark:bg-[#303030] rounded-lg p-3 space-y-1.5 text-[11px] border border-neutral-200 dark:border-[#404040]">
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Bóc tách thuật toán No-Watermark trực tiếp</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Hỗ trợ tải hàng loạt và trích xuất nhạc MP3</span>
            </div>
            <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Giao diện chuẩn Fluent UI tích hợp thanh thông báo Windows</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-100 dark:bg-[#1f1f1f] border-t border-neutral-200 dark:border-[#333333] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#0067c0] hover:bg-[#1879c9] text-white rounded font-medium text-xs shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
