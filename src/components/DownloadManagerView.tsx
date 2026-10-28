/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Download,
  Pause,
  Play,
  X,
  FolderOpen,
  CheckCircle,
  Clock,
  RotateCcw,
  Sparkles,
  Trash2,
  HardDrive,
  FileVideo,
} from 'lucide-react';
import { DownloadItem, formatBytes } from '../utils/douyinDownloader';

interface DownloadManagerViewProps {
  downloads: DownloadItem[];
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
  onOpenFolder: (filePath?: string) => void;
  onOpenFile: (item: DownloadItem) => void;
  onClearCompleted: () => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
}

export const DownloadManagerView: React.FC<DownloadManagerViewProps> = ({
  downloads,
  onPause,
  onResume,
  onCancel,
  onOpenFolder,
  onOpenFile,
  onClearCompleted,
  onPauseAll,
  onResumeAll,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'downloading' | 'completed' | 'paused'>('all');

  const filteredDownloads = downloads.filter((d) => {
    if (filterTab === 'downloading') return d.status === 'downloading' || d.status === 'processing_nowm' || d.status === 'queued';
    if (filterTab === 'completed') return d.status === 'completed';
    if (filterTab === 'paused') return d.status === 'paused';
    return true;
  });

  const activeCount = downloads.filter((d) => d.status === 'downloading' || d.status === 'processing_nowm').length;
  const completedCount = downloads.filter((d) => d.status === 'completed').length;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-[#202020] overflow-hidden select-none">
      {/* Download Toolbar Header */}
      <div className="p-3 bg-neutral-100 dark:bg-[#282828] border-b border-neutral-200 dark:border-[#383838] flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Tabs */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterTab === 'all'
                ? 'bg-white dark:bg-[#383838] text-[#0067c0] dark:text-[#60cdff] shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#323232]'
            }`}
          >
            Tất cả ({downloads.length})
          </button>
          <button
            onClick={() => setFilterTab('downloading')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterTab === 'downloading'
                ? 'bg-white dark:bg-[#383838] text-[#0067c0] dark:text-[#60cdff] shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#323232]'
            }`}
          >
            Đang tải ({activeCount})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              filterTab === 'completed'
                ? 'bg-white dark:bg-[#383838] text-[#0067c0] dark:text-[#60cdff] shadow-2xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-[#323232]'
            }`}
          >
            Hoàn tất ({completedCount})
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2">
          {activeCount > 0 ? (
            <button
              onClick={onPauseAll}
              className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-[#353535] hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 flex items-center space-x-1"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng tất cả</span>
            </button>
          ) : (
            <button
              onClick={onResumeAll}
              className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-[#353535] hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 flex items-center space-x-1"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Tiếp tục tất cả</span>
            </button>
          )}

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-2.5 py-1 rounded bg-neutral-200 dark:bg-[#353535] hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 flex items-center space-x-1"
              title="Xóa danh sách các tác vụ đã hoàn thành"
            >
              <Trash2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Dọn dẹp danh sách</span>
            </button>
          )}

          <button
            onClick={() => onOpenFolder()}
            className="px-2.5 py-1 rounded bg-[#0067c0] hover:bg-[#1879c9] text-white flex items-center space-x-1 shadow-2xs"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Mở thư mục tải</span>
          </button>
        </div>
      </div>

      {/* Downloads List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDownloads.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-neutral-400">
            <Download className="w-12 h-12 mb-2 stroke-[1.5] text-neutral-300 dark:text-neutral-600" />
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Không có tác vụ tải nào</p>
            <p className="text-xs text-neutral-400 mt-1">Tìm kiếm video hoặc dán link để bắt đầu tải xuống video không chứa watermark.</p>
          </div>
        ) : (
          filteredDownloads.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-neutral-50 dark:bg-[#282828] border border-neutral-200 dark:border-[#383838] rounded-lg shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
            >
              {/* Left: Thumbnail & Title */}
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <img
                  src={item.coverUrl}
                  alt={item.title}
                  className="w-12 h-16 rounded object-cover bg-black shrink-0 shadow-2xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate mb-1">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mb-1.5 flex items-center space-x-2">
                    <span>{item.authorName}</span>
                    <span>•</span>
                    <span className="font-mono">{item.filePath.split('\\').pop()}</span>
                  </div>

                  {/* Windows Progress Bar */}
                  <div className="w-full max-w-md h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        item.status === 'completed'
                          ? 'bg-emerald-500'
                          : item.status === 'paused'
                          ? 'bg-amber-500'
                          : 'bg-[#0067c0] dark:bg-[#60cdff]'
                      }`}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>

                  {/* Status & Stats subtext */}
                  <div className="flex items-center space-x-3 text-[10px] text-neutral-500 dark:text-neutral-400">
                    <span className="font-mono">
                      {formatBytes(item.downloadedMb)} / {formatBytes(item.totalSizeMb)} ({item.progress}%)
                    </span>
                    {item.status === 'downloading' && (
                      <span className="text-[#0067c0] dark:text-[#60cdff] font-medium">
                        Tốc độ: {item.speedMbS.toFixed(1)} MB/s
                      </span>
                    )}
                    {item.status === 'processing_nowm' && (
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        Đang tách watermark và tối ưu âm thanh...
                      </span>
                    )}
                    {item.status === 'completed' && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Đã tải thành công 100% không watermark</span>
                      </span>
                    )}
                    {item.status === 'paused' && (
                      <span className="text-amber-600 dark:text-amber-400 font-medium">
                        Đã tạm dừng
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center space-x-1.5 self-end sm:self-center shrink-0">
                {item.status === 'completed' ? (
                  <>
                    <button
                      onClick={() => onOpenFile(item)}
                      className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center space-x-1"
                      title="Mở video bằng trình phát đa phương tiện"
                    >
                      <FileVideo className="w-3.5 h-3.5" />
                      <span>Mở video</span>
                    </button>
                    <button
                      onClick={() => onOpenFolder(item.filePath)}
                      className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] text-neutral-600 dark:text-neutral-300"
                      title="Mở thư mục chứa file này"
                    >
                      <FolderOpen className="w-4 h-4 text-amber-500" />
                    </button>
                  </>
                ) : (
                  <>
                    {item.status === 'downloading' || item.status === 'processing_nowm' ? (
                      <button
                        onClick={() => onPause(item.id)}
                        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] text-neutral-600 dark:text-neutral-300"
                        title="Tạm dừng"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onResume(item.id)}
                        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] text-neutral-600 dark:text-neutral-300"
                        title="Tiếp tục tải"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onCancel(item.id)}
                      className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-600"
                      title="Hủy bỏ tác vụ này"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
