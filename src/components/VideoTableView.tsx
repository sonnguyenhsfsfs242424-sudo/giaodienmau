/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Download,
  Play,
  Music,
  Heart,
  Share2,
  Check,
  ShieldCheck,
} from 'lucide-react';
import {
  DouyinVideo,
  formatNumber,
  formatDuration,
  formatBytes,
} from '../utils/douyinDownloader';

interface VideoTableViewProps {
  videos: DouyinVideo[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onPreviewVideo: (video: DouyinVideo) => void;
  onDownloadVideo: (video: DouyinVideo, format?: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3') => void;
}

export const VideoTableView: React.FC<VideoTableViewProps> = ({
  videos,
  selectedIds,
  onToggleSelect,
  onPreviewVideo,
  onDownloadVideo,
}) => {
  if (videos.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-neutral-400">
        Không có dữ liệu video Douyin để hiển thị trong bảng.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto select-none">
      <table className="w-full text-left text-xs text-neutral-700 dark:text-neutral-200 border-collapse">
        {/* Table Header (Windows Explorer Column Headers) */}
        <thead className="bg-neutral-100 dark:bg-[#252525] border-b border-neutral-200 dark:border-[#383838] sticky top-0 z-10 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
          <tr>
            <th className="py-2.5 px-3 w-10 text-center">
              <span>#</span>
            </th>
            <th className="py-2.5 px-3 w-16 text-center">Xem</th>
            <th className="py-2.5 px-3 min-w-[220px]">Tiêu đề Video / Mô tả</th>
            <th className="py-2.5 px-3 min-w-[140px]">Tác giả</th>
            <th className="py-2.5 px-3 w-20 text-center">Thời lượng</th>
            <th className="py-2.5 px-3 w-24 text-right">Lượt tim</th>
            <th className="py-2.5 px-3 w-24 text-right">Dung lượng</th>
            <th className="py-2.5 px-3 w-28 text-center">Độ phân giải</th>
            <th className="py-2.5 px-3 w-40 text-center">Thao tác tải</th>
          </tr>
        </thead>

        {/* Table Rows */}
        <tbody className="divide-y divide-neutral-100 dark:divide-[#333333]">
          {videos.map((video) => {
            const isSelected = selectedIds.has(video.id);

            return (
              <tr
                key={video.id}
                onClick={() => onToggleSelect(video.id)}
                className={`transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-sky-50 dark:bg-sky-950/30'
                    : 'hover:bg-neutral-50 dark:hover:bg-[#2a2a2a]'
                }`}
              >
                {/* Checkbox */}
                <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onToggleSelect(video.id)}
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#0067c0] border-[#0067c0] text-white'
                        : 'border-neutral-300 dark:border-neutral-600 hover:border-neutral-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </td>

                {/* Thumbnail */}
                <td className="py-2 px-3 text-center" onClick={(e) => { e.stopPropagation(); onPreviewVideo(video); }}>
                  <div className="relative w-12 h-16 rounded overflow-hidden bg-black mx-auto shadow-2xs group">
                    <img
                      src={video.cover_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  </div>
                </td>

                {/* Title & Description */}
                <td className="py-2 px-3">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1 mb-0.5">
                    {video.title}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                    {video.desc}
                  </div>
                  <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Sẵn sàng tải 100% Không Watermark</span>
                  </div>
                </td>

                {/* Author */}
                <td className="py-2 px-3">
                  <div className="flex items-center space-x-1.5">
                    <img
                      src={video.author.avatar}
                      alt={video.author.nickname}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate font-medium">{video.author.nickname}</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 pl-6.5">
                    @{video.author.unique_id}
                  </div>
                </td>

                {/* Duration */}
                <td className="py-2 px-3 text-center font-mono text-[11px]">
                  {formatDuration(video.duration)}
                </td>

                {/* Likes */}
                <td className="py-2 px-3 text-right font-medium text-rose-500">
                  {formatNumber(video.statistics.digg_count)}
                </td>

                {/* File size */}
                <td className="py-2 px-3 text-right text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                  {formatBytes(video.size_mb)}
                </td>

                {/* Resolution */}
                <td className="py-2 px-3 text-center">
                  <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-[#383838] text-[10px] font-medium">
                    {video.resolution.split(' ')[0]}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-2 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => onDownloadVideo(video, '1080p_nowm')}
                      className="px-2.5 py-1 rounded bg-[#0067c0] hover:bg-[#1879c9] active:bg-[#005fb8] text-white text-[11px] font-medium flex items-center space-x-1 shadow-2xs"
                      title="Tải video không logo"
                    >
                      <Download className="w-3 h-3" />
                      <span>Tải MP4</span>
                    </button>
                    <button
                      onClick={() => onDownloadVideo(video, 'audio_mp3')}
                      className="p-1 rounded bg-neutral-100 dark:bg-[#383838] hover:bg-neutral-200 dark:hover:bg-[#444444] text-emerald-600 dark:text-emerald-400"
                      title="Tải âm thanh MP3"
                    >
                      <Music className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onPreviewVideo(video)}
                      className="p-1 rounded bg-neutral-100 dark:bg-[#383838] hover:bg-neutral-200 dark:hover:bg-[#444444] text-neutral-700 dark:text-neutral-200"
                      title="Xem trước"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
