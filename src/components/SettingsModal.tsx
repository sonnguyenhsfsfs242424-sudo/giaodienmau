/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Settings,
  FolderOpen,
  HardDrive,
  ShieldCheck,
  Bell,
  Sliders,
  Check,
} from 'lucide-react';

interface SettingsData {
  downloadFolder: string;
  defaultQuality: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3';
  fileNamingTemplate: string;
  maxConcurrentDownloads: number;
  autoExtractAudio: boolean;
  enableWindowsNotifications: boolean;
  proxyMode: 'direct' | 'custom';
}

interface SettingsModalProps {
  isOpen: boolean;
  settings: SettingsData;
  onSaveSettings: (settings: SettingsData) => void;
  onOpenFolderBrowser: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onSaveSettings,
  onOpenFolderBrowser,
  onClose,
}) => {
  const [formData, setFormData] = useState<SettingsData>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-xl bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-neutral-300 dark:border-[#404040] overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Title bar */}
        <div className="h-9 px-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-[#333333] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-[#0067c0] dark:text-[#60cdff]" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Cài đặt ứng dụng Douyin Downloader Pro (Windows)
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Section 1: Thư mục lưu trữ */}
          <div className="space-y-2 pb-3 border-b border-neutral-100 dark:border-[#333333]">
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
              Thư mục lưu trữ video mặc định trên Windows:
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2 bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] rounded font-mono text-[11px] text-neutral-800 dark:text-neutral-100 truncate">
                {formData.downloadFolder}
              </div>
              <button
                type="button"
                onClick={onOpenFolderBrowser}
                className="px-3 py-2 bg-neutral-200 dark:bg-[#3a3a3a] hover:bg-neutral-300 dark:hover:bg-[#484848] rounded text-neutral-700 dark:text-neutral-200 font-medium flex items-center space-x-1 shrink-0"
              >
                <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Thay đổi...</span>
              </button>
            </div>
          </div>

          {/* Section 2: Chất lượng tải xuống mặc định */}
          <div className="space-y-2 pb-3 border-b border-neutral-100 dark:border-[#333333]">
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
              Chất lượng tải mặc định (Không Logo):
            </label>
            <select
              value={formData.defaultQuality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  defaultQuality: e.target.value as SettingsData['defaultQuality'],
                })
              }
              className="w-full p-2 bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] rounded text-neutral-800 dark:text-neutral-100 focus:outline-none focus:border-[#0067c0]"
            >
              <option value="1080p_nowm">Full HD 1080p Không Watermark (Khuyên dùng)</option>
              <option value="2k_nowm">2K / 4K Ultra HD Không Watermark</option>
              <option value="720p_nowm">HD 720p (Dung lượng nhẹ)</option>
              <option value="audio_mp3">Chỉ tải file âm thanh gốc MP3</option>
            </select>
          </div>

          {/* Section 3: Mẫu đặt tên file */}
          <div className="space-y-2 pb-3 border-b border-neutral-100 dark:border-[#333333]">
            <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
              Quy tắc đặt tên file tải về:
            </label>
            <input
              type="text"
              value={formData.fileNamingTemplate}
              onChange={(e) => setFormData({ ...formData, fileNamingTemplate: e.target.value })}
              className="w-full p-2 bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] rounded text-neutral-800 dark:text-neutral-100 font-mono text-[11px] focus:outline-none focus:border-[#0067c0]"
            />
            <p className="text-[10px] text-neutral-400">
              Các thẻ có thể dùng: <code className="text-[#0067c0] dark:text-[#60cdff]">{'{author}'}</code> (tên tác giả), <code className="text-[#0067c0] dark:text-[#60cdff]">{'{title}'}</code> (tiêu đề video), <code className="text-[#0067c0] dark:text-[#60cdff]">{'{id}'}</code> (Aweme ID), <code className="text-[#0067c0] dark:text-[#60cdff]">{'{quality}'}</code>.
            </p>
          </div>

          {/* Section 4: Tùy chọn nâng cao */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Số tác vụ tải đồng thời:
                </div>
                <div className="text-[11px] text-neutral-400">
                  Tăng tốc độ khi tải hàng loạt video cùng lúc
                </div>
              </div>
              <select
                value={formData.maxConcurrentDownloads}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxConcurrentDownloads: Number(e.target.value),
                  })
                }
                className="p-1.5 bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] rounded text-neutral-800 dark:text-neutral-100"
              >
                <option value={1}>1 tác vụ</option>
                <option value={2}>2 tác vụ</option>
                <option value={3}>3 tác vụ (Tiêu chuẩn)</option>
                <option value={5}>5 tác vụ (Tối đa)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Thông báo Action Center Windows:
                </div>
                <div className="text-[11px] text-neutral-400">
                  Hiển thị thông báo góc phải màn hình khi hoàn thành tải video
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.enableWindowsNotifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    enableWindowsNotifications: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#0067c0] accent-[#0067c0]"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Tự động lưu thêm file MP3 âm thanh:
                </div>
                <div className="text-[11px] text-neutral-400">
                  Tách riêng nhạc nền của video Douyin vào thư mục
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoExtractAudio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autoExtractAudio: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-[#0067c0] accent-[#0067c0]"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-neutral-200 dark:border-[#383838] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-neutral-200 dark:bg-[#383838] text-neutral-700 dark:text-neutral-200 font-medium hover:bg-neutral-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0067c0] hover:bg-[#1879c9] text-white font-medium flex items-center space-x-1.5 shadow-xs"
            >
              {savedSuccess ? <Check className="w-4 h-4" /> : null}
              <span>{savedSuccess ? 'Đã lưu cài đặt!' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
