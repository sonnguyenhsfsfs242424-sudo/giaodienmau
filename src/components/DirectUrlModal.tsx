/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Link2,
  Sparkles,
  Download,
  ShieldCheck,
  Clipboard,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  parseDouyinShareUrl,
  DouyinVideo,
  SEED_DOUYIN_VIDEOS,
  generateDynamicVideosForQuery,
} from '../utils/douyinDownloader';

interface DirectUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadParsed: (video: DouyinVideo, format: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3') => void;
}

export const DirectUrlModal: React.FC<DirectUrlModalProps> = ({
  isOpen,
  onClose,
  onDownloadParsed,
}) => {
  const [inputText, setInputText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedVideo, setParsedVideo] = useState<DouyinVideo | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleParse = () => {
    setErrorMessage('');
    if (!inputText.trim()) {
      setErrorMessage('Vui lòng nhập hoặc dán link video Douyin.');
      return;
    }

    setIsParsing(true);
    const result = parseDouyinShareUrl(inputText);

    setTimeout(() => {
      setIsParsing(false);
      if (!result.isValid) {
        setErrorMessage('Không nhận diện được định dạng liên kết Douyin hợp lệ. Hãy kiểm tra lại URL hoặc ID video.');
        return;
      }

      // Find matching seed or generate clean video
      const matched = SEED_DOUYIN_VIDEOS.find((v) => v.aweme_id === result.awemeId) ||
        SEED_DOUYIN_VIDEOS[Math.floor(Math.random() * SEED_DOUYIN_VIDEOS.length)];

      const clonedVideo: DouyinVideo = {
        ...matched,
        id: `parsed_${Date.now()}`,
        aweme_id: result.awemeId || matched.aweme_id,
        title: matched.title.includes('Trích xuất') ? matched.title : `[Đã bóc watermark] ${matched.title}`,
      };

      setParsedVideo(clonedVideo);
    }, 400);
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setInputText(text);
        setErrorMessage('');
      }
    } catch {
      // Fallback
    }
  };

  const handleUseSample = (sampleUrl: string) => {
    setInputText(sampleUrl);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-xl bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-neutral-300 dark:border-[#404040] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Title Bar */}
        <div className="h-9 px-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-[#333333] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Link2 className="w-4 h-4 text-[#0067c0] dark:text-[#60cdff]" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Trích xuất & Tải video Douyin qua Link trực tiếp
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-4 space-y-4 text-xs">
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-semibold mb-1.5">
              Dán liên kết chia sẻ từ Douyin:
            </label>
            <div className="relative">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                placeholder="Dán toàn bộ văn bản sao chép từ Douyin (VD: 7.32 e@d.py ... https://v.douyin.com/iABCxyz/ hoặc link video bất kỳ)"
                className="w-full p-2.5 rounded-md bg-neutral-50 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-[#0067c0] dark:focus:border-[#60cdff]"
              />
            </div>

            <div className="flex items-center justify-between mt-1.5">
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] text-[#0067c0] dark:text-[#60cdff] hover:underline flex items-center space-x-1"
              >
                <Clipboard className="w-3 h-3" />
                <span>Dán từ bộ nhớ tạm (Clipboard)</span>
              </button>

              <div className="flex items-center space-x-1 text-[11px] text-neutral-400">
                <span>Mẫu thử:</span>
                <button
                  type="button"
                  onClick={() => handleUseSample('https://v.douyin.com/i89XKa2/')}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#0067c0] underline"
                >
                  Link 1
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => handleUseSample('https://www.douyin.com/video/7412891238491298412')}
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#0067c0] underline"
                >
                  ID Trực tiếp
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 flex items-center space-x-2 text-[11px]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action button to parse */}
          <button
            type="button"
            onClick={handleParse}
            disabled={isParsing || !inputText.trim()}
            className="w-full py-2 bg-[#0067c0] hover:bg-[#1879c9] active:bg-[#005fb8] disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white font-medium rounded-md flex items-center justify-center space-x-2 shadow-xs transition-colors"
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Phân tích & Xóa Watermark</span>
          </button>

          {/* Parsed Result Preview */}
          {parsedVideo && (
            <div className="p-3 bg-neutral-100 dark:bg-[#303030] rounded-lg border border-neutral-200 dark:border-[#3d3d3d] space-y-3">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Đã bóc tách thành công liên kết không watermark!</span>
              </div>

              <div className="flex space-x-3">
                <img
                  src={parsedVideo.cover_url}
                  alt={parsedVideo.title}
                  className="w-20 h-28 object-cover rounded shadow-xs"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2">
                      {parsedVideo.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                      Tác giả: {parsedVideo.author.nickname} (@{parsedVideo.author.unique_id})
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Độ phân giải: {parsedVideo.resolution}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <button
                      onClick={() => {
                        onDownloadParsed(parsedVideo, '1080p_nowm');
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#0067c0] hover:bg-[#1879c9] text-white rounded font-medium text-xs flex items-center space-x-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải Full HD (No Watermark)</span>
                    </button>

                    <button
                      onClick={() => {
                        onDownloadParsed(parsedVideo, 'audio_mp3');
                        onClose();
                      }}
                      className="px-2.5 py-1.5 bg-neutral-200 dark:bg-[#3d3d3d] hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 rounded text-xs"
                    >
                      Tải MP3
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
