/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Play,
  Download,
  Heart,
  MessageCircle,
  Share2,
  Check,
  Music,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  DouyinVideo,
  formatNumber,
  formatDuration,
  formatBytes,
} from '../utils/douyinDownloader';

interface VideoGridViewProps {
  videos: DouyinVideo[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onPreviewVideo: (video: DouyinVideo) => void;
  onDownloadVideo: (video: DouyinVideo, format?: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3') => void;
}

export const VideoGridView: React.FC<VideoGridViewProps> = ({
  videos,
  selectedIds,
  onToggleSelect,
  onPreviewVideo,
  onDownloadVideo,
}) => {
  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-500 dark:text-neutral-400">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-[#303030] flex items-center justify-center mb-3">
          <Sparkles className="w-8 h-8 text-neutral-400" />
        </div>
        <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200">Không tìm thấy video nào</h3>
        <p className="text-xs text-neutral-400 max-w-sm mt-1">
          Hãy thử đổi từ khóa tìm kiếm (VD: ẩm thực, dance, biến hình, phim...) hoặc dán trực tiếp link Douyin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {videos.map((video) => {
        const isSelected = selectedIds.has(video.id);

        return (
          <div
            key={video.id}
            className={`group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-[#2c2c2c] border transition-all duration-200 shadow-xs hover:shadow-md ${
              isSelected
                ? 'border-[#0067c0] dark:border-[#60cdff] ring-2 ring-[#0067c0]/20 dark:ring-[#60cdff]/20'
                : 'border-neutral-200/90 dark:border-[#383838] hover:border-neutral-300 dark:hover:border-[#4a4a4a]'
            }`}
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-[9/14] bg-black overflow-hidden cursor-pointer" onClick={() => onPreviewVideo(video)}>
              <img
                src={video.cover_url}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

              {/* Top Bar: Select Checkbox & No Watermark Badge */}
              <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
                {/* Select Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSelect(video.id);
                  }}
                  className={`w-6 h-6 rounded flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#0067c0] text-white'
                      : 'bg-black/50 hover:bg-black/80 text-white/80 border border-white/40'
                  }`}
                  title={isSelected ? 'Bỏ chọn video này' : 'Chọn video này để tải hàng loạt'}
                >
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                {/* No Watermark Tag */}
                <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-600/90 text-white text-[10px] font-semibold tracking-wide backdrop-blur-xs shadow-xs">
                  <ShieldCheck className="w-3 h-3" />
                  <span>No Watermark</span>
                </span>
              </div>

              {/* Center Play Button Overlay on Hover */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-90 group-hover:scale-100 opacity-80 group-hover:opacity-100 transition-all shadow-lg border border-white/30">
                  <Play className="w-5 h-5 fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Thumbnail Info: Duration & Quality */}
              <div className="absolute bottom-2 inset-x-2.5 flex items-center justify-between text-white text-[11px] font-medium z-10">
                <span className="px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs">
                  {formatDuration(video.duration)}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-600/80 backdrop-blur-xs font-semibold">
                  {video.resolution.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Video Card Content */}
            <div className="p-3 flex flex-col flex-1 justify-between select-none">
              {/* Author & Nickname */}
              <div>
                <div className="flex items-center space-x-2 mb-1.5">
                  <img
                    src={video.author.avatar}
                    alt={video.author.nickname}
                    className="w-5 h-5 rounded-full object-cover border border-neutral-300 dark:border-neutral-600"
                  />
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 truncate">
                    {video.author.nickname}
                  </span>
                  {video.author.is_verified && (
                    <span className="text-amber-500 text-[10px]" title="Tài khoản đã xác minh Douyin">
                      ✓
                    </span>
                  )}
                </div>

                {/* Video Title */}
                <h4
                  onClick={() => onPreviewVideo(video)}
                  className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 hover:text-[#0067c0] dark:hover:text-[#60cdff] cursor-pointer mb-2"
                  title={video.title}
                >
                  {video.title}
                </h4>
              </div>

              {/* Stats Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 py-1.5 border-t border-b border-neutral-100 dark:border-[#383838] mb-2.5">
                  <span className="flex items-center space-x-1" title="Lượt thích">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                    <span>{formatNumber(video.statistics.digg_count)}</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Bình luận">
                    <MessageCircle className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formatNumber(video.statistics.comment_count)}</span>
                  </span>
                  <span className="flex items-center space-x-1" title="Chia sẻ">
                    <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{formatNumber(video.statistics.share_count)}</span>
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {formatBytes(video.size_mb)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-1.5">
                  {/* Download Video No-WM Button */}
                  <button
                    onClick={() => onDownloadVideo(video, '1080p_nowm')}
                    className="flex-1 py-1.5 px-2 bg-[#0067c0] hover:bg-[#1879c9] active:bg-[#005fb8] text-white rounded-md text-xs font-medium flex items-center justify-center space-x-1 transition-colors shadow-2xs active:scale-95"
                    title="Tải video 1080p không chứa logo hoặc watermark"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Tải Không Logo</span>
                  </button>

                  {/* Audio MP3 Download */}
                  <button
                    onClick={() => onDownloadVideo(video, 'audio_mp3')}
                    className="p-1.5 rounded-md bg-neutral-100 dark:bg-[#383838] hover:bg-neutral-200 dark:hover:bg-[#444444] text-neutral-700 dark:text-neutral-200 text-xs transition-colors"
                    title="Chỉ tải âm thanh / nhạc nền MP3"
                  >
                    <Music className="w-3.5 h-3.5 text-emerald-500" />
                  </button>

                  {/* Preview Button */}
                  <button
                    onClick={() => onPreviewVideo(video)}
                    className="p-1.5 rounded-md bg-neutral-100 dark:bg-[#383838] hover:bg-neutral-200 dark:hover:bg-[#444444] text-neutral-700 dark:text-neutral-200 text-xs transition-colors"
                    title="Xem trước video trong trình phát"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
