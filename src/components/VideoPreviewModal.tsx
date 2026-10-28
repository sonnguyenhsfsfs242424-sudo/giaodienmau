/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  Music,
  ShieldCheck,
  Info,
  Maximize,
  ExternalLink,
  Check,
} from 'lucide-react';
import {
  DouyinVideo,
  formatNumber,
  formatDuration,
  formatBytes,
} from '../utils/douyinDownloader';

interface VideoPreviewModalProps {
  video: DouyinVideo | null;
  onClose: () => void;
  onDownload: (video: DouyinVideo, format: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3') => void;
}

export const VideoPreviewModal: React.FC<VideoPreviewModalProps> = ({
  video,
  onClose,
  onDownload,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showWatermarkCompare, setShowWatermarkCompare] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3'>('1080p_nowm');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
  }, [video]);

  if (!video) return null;

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleToggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(video.video_url_nowatermark);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      {/* Windows 11 Media Player Window Frame */}
      <div className="w-full max-w-4xl bg-white dark:bg-[#202020] rounded-xl shadow-2xl border border-neutral-300 dark:border-[#404040] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Window Title Bar */}
        <div className="h-9 px-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-[#333333] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 truncate">
            <span className="w-3.5 h-3.5 rounded-full bg-red-500/80 flex items-center justify-center text-[8px] text-white font-bold">
              ▶
            </span>
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
              Trình xem trước đa phương tiện Windows - {video.title}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white text-neutral-500 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Left Player, Right Info & Download Controls */}
        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
          {/* Left: Video Player Section */}
          <div className="flex-1 bg-black flex flex-col justify-between items-center relative min-h-[360px] md:min-h-[460px]">
            <div className="relative w-full h-full flex items-center justify-center flex-1">
              <video
                ref={videoRef}
                src={video.video_url_nowatermark}
                poster={video.cover_url}
                autoPlay
                playsInline
                loop
                onTimeUpdate={handleTimeUpdate}
                onClick={handleTogglePlay}
                className="max-h-[420px] max-w-full object-contain cursor-pointer"
              />

              {/* Watermark Simulation Overlay if compare mode is active */}
              {showWatermarkCompare && (
                <div className="absolute top-4 left-4 flex items-center space-x-1.5 px-2 py-1 rounded bg-black/70 text-white text-[11px] backdrop-blur-xs border border-white/20">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                  <span>Logo Douyin gốc (Bị loại bỏ trong bản tải)</span>
                </div>
              )}

              {/* Watermark-free Verified Stamp */}
              <div className="absolute bottom-16 right-4 flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg border border-emerald-400/40">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Không Watermark</span>
              </div>
            </div>

            {/* Custom Fluent Video Controls Bar */}
            <div className="w-full bg-neutral-900/90 backdrop-blur-md p-3 text-white flex flex-col gap-2">
              {/* Progress Slider */}
              <div className="flex items-center space-x-2 text-[11px] font-mono">
                <span>{formatDuration(currentTime)}</span>
                <input
                  type="range"
                  min={0}
                  max={duration || video.duration}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-[#0067c0]"
                />
                <span>{formatDuration(duration || video.duration)}</span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  {/* Play/Pause */}
                  <button
                    onClick={handleTogglePlay}
                    className="p-1.5 rounded hover:bg-white/20 transition-colors"
                    title={isPlaying ? 'Tạm dừng' : 'Phát'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  {/* Volume */}
                  <button
                    onClick={handleToggleMute}
                    className="p-1.5 rounded hover:bg-white/20 transition-colors"
                    title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Compare Watermark Toggle */}
                <button
                  onClick={() => setShowWatermarkCompare(!showWatermarkCompare)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors border ${
                    showWatermarkCompare
                      ? 'bg-rose-600 text-white border-rose-500'
                      : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
                  }`}
                  title="Bật/Tắt so sánh với bản gốc có watermark"
                >
                  {showWatermarkCompare ? 'Ẩn logo so sánh' : 'Hiển thị logo gốc để so sánh'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Video Info & Download Quality Config */}
          <div className="w-full md:w-80 bg-neutral-50 dark:bg-[#252525] p-4 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-200 dark:border-[#383838] text-xs">
            <div className="space-y-4">
              {/* Author Profile */}
              <div className="flex items-center space-x-2.5 pb-3 border-b border-neutral-200 dark:border-[#383838]">
                <img
                  src={video.author.avatar}
                  alt={video.author.nickname}
                  className="w-10 h-10 rounded-full object-cover border border-neutral-300 dark:border-neutral-600"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                    {video.author.nickname}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    @{video.author.unique_id} • {formatNumber(video.author.follower_count)} fans
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm mb-1">
                  {video.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-[11px] line-clamp-3">
                  {video.desc}
                </p>
              </div>

              {/* Technical Video Specs */}
              <div className="bg-white dark:bg-[#2e2e2e] rounded-lg p-2.5 border border-neutral-200 dark:border-[#3c3c3c] space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Độ phân giải:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{video.resolution}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Tốc độ khung hình:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{video.fps} FPS</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Dung lượng video:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatBytes(video.size_mb)}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Aweme ID:</span>
                  <span className="font-mono text-[10px] text-neutral-700 dark:text-neutral-300">{video.aweme_id}</span>
                </div>
                <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Âm nhạc:</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[130px]">{video.music.title}</span>
                </div>
              </div>

              {/* Quality Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Chọn định dạng tải xuống:
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('1080p_nowm')}
                    className={`p-2 rounded-md border text-left transition-all ${
                      selectedFormat === '1080p_nowm'
                        ? 'border-[#0067c0] bg-sky-50 dark:bg-sky-950/40 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                        : 'border-neutral-200 dark:border-[#404040] hover:bg-neutral-100 dark:hover:bg-[#333333]'
                    }`}
                  >
                    <div className="text-xs">Full HD 1080p</div>
                    <div className="text-[10px] opacity-75">No Watermark</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat('2k_nowm')}
                    className={`p-2 rounded-md border text-left transition-all ${
                      selectedFormat === '2k_nowm'
                        ? 'border-[#0067c0] bg-sky-50 dark:bg-sky-950/40 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                        : 'border-neutral-200 dark:border-[#404040] hover:bg-neutral-100 dark:hover:bg-[#333333]'
                    }`}
                  >
                    <div className="text-xs">4K / 2K UHD</div>
                    <div className="text-[10px] opacity-75">Siêu sắc nét</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat('720p_nowm')}
                    className={`p-2 rounded-md border text-left transition-all ${
                      selectedFormat === '720p_nowm'
                        ? 'border-[#0067c0] bg-sky-50 dark:bg-sky-950/40 text-[#0067c0] dark:text-[#60cdff] font-semibold'
                        : 'border-neutral-200 dark:border-[#404040] hover:bg-neutral-100 dark:hover:bg-[#333333]'
                    }`}
                  >
                    <div className="text-xs">HD 720p</div>
                    <div className="text-[10px] opacity-75">Tiết kiệm bộ nhớ</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedFormat('audio_mp3')}
                    className={`p-2 rounded-md border text-left transition-all ${
                      selectedFormat === 'audio_mp3'
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold'
                        : 'border-neutral-200 dark:border-[#404040] hover:bg-neutral-100 dark:hover:bg-[#333333]'
                    }`}
                  >
                    <div className="text-xs flex items-center space-x-1">
                      <Music className="w-3 h-3" />
                      <span>Audio MP3</span>
                    </div>
                    <div className="text-[10px] opacity-75">Chỉ lấy nhạc nền</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-neutral-200 dark:border-[#383838] space-y-2">
              <button
                onClick={() => {
                  onDownload(video, selectedFormat);
                  onClose();
                }}
                className="w-full py-2 px-3 bg-[#0067c0] hover:bg-[#1879c9] active:bg-[#005fb8] text-white rounded-md font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Bắt đầu tải (Không Watermark)</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-1.5 px-2 bg-white dark:bg-[#333333] hover:bg-neutral-100 dark:hover:bg-[#3d3d3d] border border-neutral-200 dark:border-[#444444] rounded text-neutral-700 dark:text-neutral-200 text-[11px] flex items-center justify-center space-x-1 transition-colors"
                >
                  {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink ? 'Đã chép link tải!' : 'Chép link No-WM'}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-3 py-1.5 bg-neutral-200 dark:bg-[#383838] hover:bg-neutral-300 dark:hover:bg-[#444444] rounded text-neutral-700 dark:text-neutral-200 text-[11px] transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
