/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderOpen,
  Play,
  Copy,
  Trash2,
  HardDrive,
  FileVideo,
  Music,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { DownloadItem, formatBytes } from '../utils/douyinDownloader';

interface CompletedViewProps {
  completedItems: DownloadItem[];
  downloadFolder: string;
  onOpenFile: (item: DownloadItem) => void;
  onOpenFolder: () => void;
  onDeleteItem: (id: string) => void;
}

export const CompletedView: React.FC<CompletedViewProps> = ({
  completedItems,
  downloadFolder,
  onOpenFile,
  onOpenFolder,
  onDeleteItem,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = completedItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.filePath.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopyPath = (item: DownloadItem) => {
    navigator.clipboard.writeText(item.filePath);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#202020] overflow-hidden select-none text-xs">
      {/* Windows Explorer Navigation & Breadcrumb Header */}
      <div className="p-2.5 bg-neutral-100 dark:bg-[#262626] border-b border-neutral-200 dark:border-[#333333] flex flex-wrap items-center justify-between gap-2">
        {/* Breadcrumb Path Bar */}
        <div className="flex items-center space-x-1.5 flex-1 min-w-[240px] px-2.5 py-1.5 rounded bg-white dark:bg-[#303030] border border-neutral-200 dark:border-[#404040] text-neutral-700 dark:text-neutral-200 text-[11px] font-mono">
          <HardDrive className="w-3.5 h-3.5 text-[#0067c0] dark:text-[#60cdff]" />
          <span className="truncate">{downloadFolder}</span>
        </div>

        {/* Search within completed files */}
        <div className="relative w-48">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Lọc file đã tải..."
            className="w-full pl-7 pr-2 py-1 rounded bg-white dark:bg-[#303030] border border-neutral-200 dark:border-[#404040] text-[11px] focus:outline-none focus:border-[#0067c0]"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2 top-1.5" />
        </div>

        {/* Open Folder in Windows */}
        <button
          onClick={onOpenFolder}
          className="px-3 py-1.5 rounded bg-[#0067c0] hover:bg-[#1879c9] text-white font-medium flex items-center space-x-1 shadow-2xs"
        >
          <FolderOpen className="w-3.5 h-3.5" />
          <span>Mở thư mục trên máy tính</span>
        </button>
      </div>

      {/* Files List / Explorer View */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-400">
            <FileVideo className="w-12 h-12 stroke-[1.5] mb-2 text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Chưa có video nào hoàn thành</p>
            <p className="text-xs text-neutral-400 mt-1">
              Hãy chọn các video yêu thích và tải xuống không chứa logo để lưu vào đây.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-[#383838] bg-neutral-50/60 dark:bg-[#282828] hover:bg-neutral-100 dark:hover:bg-[#303030] transition-colors flex items-center justify-between gap-3"
              >
                {/* File Thumbnail & Meta */}
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="relative w-12 h-16 rounded overflow-hidden bg-black shrink-0">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 left-1">
                      {item.format === 'audio_mp3' ? (
                        <Music className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate text-xs">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono truncate mt-0.5">
                      {item.filePath.split('\\').pop()}
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] text-neutral-400 mt-1">
                      <span>Dung lượng: {formatBytes(item.totalSizeMb)}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">Bản sạch 100% Không Watermark</span>
                      <span>•</span>
                      <span>{new Date(item.completedAt || item.startedAt).toLocaleTimeString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                {/* File Actions */}
                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => onOpenFile(item)}
                    className="px-2.5 py-1.5 rounded bg-[#0067c0] hover:bg-[#1879c9] text-white font-medium flex items-center space-x-1"
                    title="Mở xem video"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Phát</span>
                  </button>

                  <button
                    onClick={() => handleCopyPath(item)}
                    className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] text-neutral-600 dark:text-neutral-300"
                    title="Sao chép đường dẫn file Windows"
                  >
                    {copiedId === item.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-600"
                    title="Xóa khỏi danh sách"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
