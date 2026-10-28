/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TitleBar } from './components/TitleBar';
import { MenuBar } from './components/MenuBar';
import { NavigationRail, NavTab } from './components/NavigationRail';
import { SearchHeader } from './components/SearchHeader';
import { VideoGridView } from './components/VideoGridView';
import { VideoTableView } from './components/VideoTableView';
import { VideoPreviewModal } from './components/VideoPreviewModal';
import { DirectUrlModal } from './components/DirectUrlModal';
import { DownloadManagerView } from './components/DownloadManagerView';
import { CompletedView } from './components/CompletedView';
import { SettingsModal } from './components/SettingsModal';
import { FolderBrowserDialog } from './components/FolderBrowserDialog';
import { AboutModal } from './components/AboutModal';
import { StatusBar } from './components/StatusBar';
import { WindowsToast, ToastMessage } from './components/WindowsToast';
import {
  DouyinVideo,
  DownloadItem,
  SearchFilter,
  searchDouyinVideos,
  createDownloadTask,
  SEED_DOUYIN_VIDEOS,
} from './utils/douyinDownloader';

export default function App() {
  // Theme & Window State
  const [darkMode, setDarkMode] = useState(true);
  const [isMaximized, setIsMaximized] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  // App Navigation & Views
  const [activeTab, setActiveTab] = useState<NavTab>('search');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilter>({
    sort: 'relevance',
    duration: 'all',
    dateRange: 'all',
  });
  const [videos, setVideos] = useState<DouyinVideo[]>(SEED_DOUYIN_VIDEOS);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Downloads State
  const [downloads, setDownloads] = useState<DownloadItem[]>([
    {
      id: 'demo_completed_1',
      videoId: 'dy_001',
      title: 'Học cách làm thịt kho Đông Pha trứ danh Hàng Châu chuẩn vị Trung Hoa',
      authorName: 'Đầu Bếp Lý - Ẩm Thực Giang Nam',
      authorAvatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      progress: 100,
      speedMbS: 0,
      totalSizeMb: 32.4,
      downloadedMb: 32.4,
      status: 'completed',
      format: '1080p_nowm',
      filePath: 'C:\\Users\\Admin\\Downloads\\Douyin_NoWatermark\\Dau_Bep_Ly_Hoc_cach_lam_thit_kho_Dong_Pha_1080P.mp4',
      downloadUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      startedAt: Date.now() - 3600 * 1000,
      completedAt: Date.now() - 3500 * 1000,
    },
  ]);

  // Modals
  const [previewVideo, setPreviewVideo] = useState<DouyinVideo | null>(null);
  const [isDirectUrlModalOpen, setIsDirectUrlModalOpen] = useState(false);
  const [isFolderBrowserOpen, setIsFolderBrowserOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // App Settings
  const [settings, setSettings] = useState({
    downloadFolder: 'C:\\Users\\Admin\\Downloads\\Douyin_NoWatermark',
    defaultQuality: '1080p_nowm' as const,
    fileNamingTemplate: '{author}_{title}_{id}_{quality}',
    maxConcurrentDownloads: 3,
    autoExtractAudio: false,
    enableWindowsNotifications: true,
    proxyMode: 'direct' as const,
  });

  // Windows Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Run Search
  const handlePerformSearch = (query: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const results = searchDouyinVideos(query, filters);
      setVideos(results);
      setIsLoading(false);
      setSelectedIds(new Set());
    }, 250);
  };

  // Re-run search whenever filters change
  useEffect(() => {
    const results = searchDouyinVideos(searchQuery, filters);
    setVideos(results);
  }, [filters]);

  // Multi-select handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setSelectedIds(new Set(videos.map((v) => v.id)));
  };

  const handleDeselectAll = () => {
    setSelectedIds(new Set());
  };

  // Real-time Download simulation engine
  useEffect(() => {
    const interval = setInterval(() => {
      setDownloads((prev) => {
        let hasChanges = false;
        const updated = prev.map((item) => {
          if (item.status === 'downloading') {
            hasChanges = true;
            const stepIncrement = Math.random() * 8 + 6;
            const newProgress = Math.min(100, item.progress + stepIncrement);
            const downloaded = Number(((item.totalSizeMb * newProgress) / 100).toFixed(1));
            const speed = Number((Math.random() * 3.5 + 4.2).toFixed(1));

            if (newProgress >= 100) {
              if (settings.enableWindowsNotifications) {
                addToast({
                  type: 'success',
                  title: 'Tải video hoàn tất (Không Watermark)',
                  message: `${item.title.slice(0, 45)}... đã lưu vào thư mục.`,
                  filePath: item.filePath,
                  actionText: 'Mở file',
                  onAction: () => {
                    const matched = videos.find((v) => v.id === item.videoId) || SEED_DOUYIN_VIDEOS[0];
                    setPreviewVideo(matched);
                  },
                });
              }

              return {
                ...item,
                progress: 100,
                downloadedMb: item.totalSizeMb,
                speedMbS: 0,
                status: 'completed' as const,
                completedAt: Date.now(),
              };
            }

            return {
              ...item,
              progress: Math.floor(newProgress),
              downloadedMb: downloaded,
              speedMbS: speed,
              status: (newProgress > 85 ? 'processing_nowm' : 'downloading') as DownloadItem['status'],
            };
          }
          return item;
        });

        return hasChanges ? updated : prev;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [videos, settings.enableWindowsNotifications]);

  // Initiate Download
  const handleStartDownload = (
    video: DouyinVideo,
    format: '1080p_nowm' | '2k_nowm' | '720p_nowm' | 'audio_mp3' = settings.defaultQuality
  ) => {
    const task = createDownloadTask(video, format, settings.downloadFolder);
    task.status = 'downloading';
    setDownloads((prev) => [task, ...prev]);

    // Also download actual audio/video file link to user's computer
    try {
      const a = document.createElement('a');
      a.href = task.downloadUrl;
      a.download = task.filePath.split('\\').pop() || 'douyin_nowatermark.mp4';
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      // Ignored
    }

    addToast({
      type: 'info',
      title: 'Đã thêm tác vụ tải xuống',
      message: `Đang bóc tách và tải "${video.title.slice(0, 35)}..." không chứa watermark.`,
    });
  };

  // Download all selected
  const handleDownloadSelected = () => {
    if (selectedIds.size === 0) return;

    const selectedVideos = videos.filter((v) => selectedIds.has(v.id));
    selectedVideos.forEach((v) => {
      handleStartDownload(v, settings.defaultQuality);
    });

    addToast({
      type: 'info',
      title: 'Bắt đầu tải hàng loạt',
      message: `Đã đưa ${selectedVideos.length} video Douyin vào hàng đợi tải không logo.`,
    });

    setSelectedIds(new Set());
    setActiveTab('downloads');
  };

  // Download queue controls
  const handlePauseTask = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'paused', speedMbS: 0 } : d))
    );
  };

  const handleResumeTask = (id: string) => {
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'downloading' } : d))
    );
  };

  const handleCancelTask = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  const handlePauseAll = () => {
    setDownloads((prev) =>
      prev.map((d) => (d.status === 'downloading' ? { ...d, status: 'paused', speedMbS: 0 } : d))
    );
  };

  const handleResumeAll = () => {
    setDownloads((prev) =>
      prev.map((d) => (d.status === 'paused' ? { ...d, status: 'downloading' } : d))
    );
  };

  const handleClearCompleted = () => {
    setDownloads((prev) => prev.filter((d) => d.status !== 'completed'));
  };

  const handleDeleteCompletedItem = (id: string) => {
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        if (activeTab === 'search') {
          e.preventDefault();
          handleSelectAll();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        if (selectedIds.size > 0) {
          e.preventDefault();
          handleDownloadSelected();
        }
      } else if (e.key === 'F5') {
        e.preventDefault();
        handlePerformSearch(searchQuery);
      } else if (e.key === 'Escape') {
        handleDeselectAll();
        setPreviewVideo(null);
        setIsDirectUrlModalOpen(false);
        setIsSettingsOpen(false);
        setIsFolderBrowserOpen(false);
        setIsAboutOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab, selectedIds, searchQuery]);

  const activeDownloads = downloads.filter((d) => d.status === 'downloading' || d.status === 'processing_nowm');
  const completedDownloads = downloads.filter((d) => d.status === 'completed');
  const totalSpeed = activeDownloads.reduce((acc, curr) => acc + curr.speedMbS, 0);

  const getTabTitle = (tab: NavTab): string => {
    switch (tab) {
      case 'search':
        return 'Tìm kiếm Douyin theo từ khóa';
      case 'direct_url':
        return 'Trích xuất link Douyin trực tiếp';
      case 'downloads':
        return 'Quản lý tiến trình tải xuống';
      case 'completed':
        return 'Thư viện video đã tải về';
      case 'settings':
        return 'Cài đặt hệ thống';
      default:
        return 'Trang chính';
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} h-screen w-screen flex flex-col bg-neutral-200 dark:bg-[#121212] overflow-hidden`}>
      {/* Windows 11 Desktop Application Outer Window Container */}
      <div
        className={`flex-1 flex flex-col overflow-hidden bg-white dark:bg-[#202020] transition-all duration-200 ${
          isMaximized ? 'w-full h-full' : 'm-2 sm:m-4 rounded-xl shadow-2xl border border-neutral-300 dark:border-[#404040]'
        }`}
      >
        {/* Windows 11 Title Bar */}
        <TitleBar
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          isMaximized={isMaximized}
          onToggleMaximize={() => setIsMaximized(!isMaximized)}
          onMinimize={() => {
            setIsMinimized(true);
            setTimeout(() => setIsMinimized(false), 2000);
            addToast({
              type: 'info',
              title: 'Cửa sổ đã thu nhỏ vào Taskbar',
              message: 'Douyin Downloader Pro vẫn đang chạy ngầm trong khay hệ thống Windows.',
            });
          }}
          onClose={() => {
            addToast({
              type: 'info',
              title: 'Đang thoát ứng dụng',
              message: 'Tất cả cấu hình tải video đã được tự động lưu.',
            });
          }}
          activeTabTitle={getTabTitle(activeTab)}
        />

        {/* Windows Menu Bar & Ribbon Command Toolbar */}
        <MenuBar
          selectedCount={selectedIds.size}
          totalCount={videos.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onOpenDirectUrlModal={() => setIsDirectUrlModalOpen(true)}
          onDownloadSelected={handleDownloadSelected}
          onPauseAll={handlePauseAll}
          onResumeAll={handleResumeAll}
          onOpenFolder={() => setIsFolderBrowserOpen(true)}
          onRefresh={() => handlePerformSearch(searchQuery)}
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
        />

        {/* Main Work Area: Sidebar + Workspace View */}
        <div className="flex-1 flex overflow-hidden">
          {/* Windows 11 Left Navigation Rail */}
          <NavigationRail
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            downloadCount={activeDownloads.length}
            completedCount={completedDownloads.length}
          />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col bg-neutral-100/50 dark:bg-[#1a1a1a] overflow-hidden">
            {activeTab === 'search' && (
              <>
                {/* Search Bar & Filters Header */}
                <SearchHeader
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onPerformSearch={handlePerformSearch}
                  filters={filters}
                  onFilterChange={setFilters}
                  resultCount={videos.length}
                  isLoading={isLoading}
                />

                {/* Video Results Area */}
                <div className="flex-1 overflow-y-auto">
                  {viewMode === 'grid' ? (
                    <VideoGridView
                      videos={videos}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onPreviewVideo={setPreviewVideo}
                      onDownloadVideo={handleStartDownload}
                    />
                  ) : (
                    <VideoTableView
                      videos={videos}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onPreviewVideo={setPreviewVideo}
                      onDownloadVideo={handleStartDownload}
                    />
                  )}
                </div>
              </>
            )}

            {activeTab === 'direct_url' && (
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-xl bg-white dark:bg-[#252525] p-6 rounded-xl border border-neutral-200 dark:border-[#383838] shadow-md text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[#0067c0]/10 dark:bg-[#60cdff]/10 text-[#0067c0] dark:text-[#60cdff] flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-100">
                    Trích xuất Video Douyin Không Watermark
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 mb-5 max-w-md mx-auto">
                    Dán bất kỳ link chia sẻ nào từ Douyin Trung Quốc hoặc Aweme ID để hệ thống tự động bóc tách logo watermark và lấy video 1080p/4K nguyên bản.
                  </p>
                  <button
                    onClick={() => setIsDirectUrlModalOpen(true)}
                    className="px-5 py-2.5 bg-[#0067c0] hover:bg-[#1879c9] text-white rounded-lg font-medium text-xs shadow-md transition-all active:scale-95"
                  >
                    + Mở hộp thoại dán Link Douyin
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'downloads' && (
              <DownloadManagerView
                downloads={downloads}
                onPause={handlePauseTask}
                onResume={handleResumeTask}
                onCancel={handleCancelTask}
                onOpenFolder={() => setIsFolderBrowserOpen(true)}
                onOpenFile={(item) => {
                  const matched = videos.find((v) => v.id === item.videoId) || SEED_DOUYIN_VIDEOS[0];
                  setPreviewVideo(matched);
                }}
                onClearCompleted={handleClearCompleted}
                onPauseAll={handlePauseAll}
                onResumeAll={handleResumeAll}
              />
            )}

            {activeTab === 'completed' && (
              <CompletedView
                completedItems={completedDownloads}
                downloadFolder={settings.downloadFolder}
                onOpenFile={(item) => {
                  const matched = videos.find((v) => v.id === item.videoId) || SEED_DOUYIN_VIDEOS[0];
                  setPreviewVideo(matched);
                }}
                onOpenFolder={() => setIsFolderBrowserOpen(true)}
                onDeleteItem={handleDeleteCompletedItem}
              />
            )}

            {activeTab === 'settings' && (
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="max-w-2xl bg-white dark:bg-[#252525] rounded-xl border border-neutral-200 dark:border-[#383838] p-6 shadow-sm">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-4 pb-2 border-b border-neutral-200 dark:border-[#383838]">
                    Cài đặt ứng dụng trên Windows
                  </h2>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Thư mục lưu trữ video:
                      </label>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 p-2 bg-neutral-100 dark:bg-[#303030] rounded font-mono text-[11px] truncate">
                          {settings.downloadFolder}
                        </div>
                        <button
                          onClick={() => setIsFolderBrowserOpen(true)}
                          className="px-3 py-2 bg-[#0067c0] text-white rounded font-medium text-xs"
                        >
                          Chọn thư mục khác
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        Chất lượng tải mặc định:
                      </label>
                      <select
                        value={settings.defaultQuality}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultQuality: e.target.value as typeof settings.defaultQuality,
                          })
                        }
                        className="w-full p-2 bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] rounded text-neutral-800 dark:text-neutral-100"
                      >
                        <option value="1080p_nowm">Full HD 1080p Không Watermark (Khuyên dùng)</option>
                        <option value="2k_nowm">2K / 4K Ultra HD Không Watermark</option>
                        <option value="720p_nowm">HD 720p Tiết kiệm dung lượng</option>
                        <option value="audio_mp3">Chỉ tải file âm thanh gốc MP3</option>
                      </select>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          addToast({
                            type: 'success',
                            title: 'Cài đặt hệ thống',
                            message: 'Đã lưu mọi thiết lập cấu hình của ứng dụng.',
                          });
                        }}
                        className="px-4 py-2 bg-[#0067c0] hover:bg-[#1879c9] text-white rounded font-medium"
                      >
                        Lưu cài đặt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Windows Status Bar */}
        <StatusBar
          totalVideos={videos.length}
          selectedCount={selectedIds.size}
          activeDownloadsCount={activeDownloads.length}
          totalSpeed={totalSpeed}
          downloadFolder={settings.downloadFolder}
        />
      </div>

      {/* Modals & Dialogs */}
      {previewVideo && (
        <VideoPreviewModal
          video={previewVideo}
          onClose={() => setPreviewVideo(null)}
          onDownload={handleStartDownload}
        />
      )}

      <DirectUrlModal
        isOpen={isDirectUrlModalOpen}
        onClose={() => setIsDirectUrlModalOpen(false)}
        onDownloadParsed={handleStartDownload}
      />

      <FolderBrowserDialog
        isOpen={isFolderBrowserOpen}
        currentPath={settings.downloadFolder}
        onSelectPath={(path) => {
          setSettings((prev) => ({ ...prev, downloadFolder: path }));
          addToast({
            type: 'info',
            title: 'Đã cập nhật thư mục lưu trữ',
            message: `Video Douyin sẽ được lưu vào: ${path}`,
          });
        }}
        onClose={() => setIsFolderBrowserOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onSaveSettings={(newSettings) => {
          setSettings(newSettings);
          addToast({
            type: 'success',
            title: 'Cài đặt đã lưu',
            message: 'Các cấu hình tải xuống và thông báo đã được áp dụng.',
          });
        }}
        onOpenFolderBrowser={() => setIsFolderBrowserOpen(true)}
        onClose={() => setIsSettingsOpen(false)}
      />

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />

      {/* Windows 11 Action Center Notification Toasts */}
      <WindowsToast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
