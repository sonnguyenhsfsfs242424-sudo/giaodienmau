/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FolderOpen,
  Download,
  PlusCircle,
  PauseCircle,
  PlayCircle,
  RotateCw,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Settings,
  HelpCircle,
  CheckSquare,
  Square,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface MenuBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onOpenDirectUrlModal: () => void;
  onDownloadSelected: () => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onOpenFolder: () => void;
  onRefresh: () => void;
  viewMode: 'grid' | 'table';
  onChangeViewMode: (mode: 'grid' | 'table') => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeselectAll,
  onOpenDirectUrlModal,
  onDownloadSelected,
  onPauseAll,
  onResumeAll,
  onOpenFolder,
  onRefresh,
  viewMode,
  onChangeViewMode,
  onOpenSettings,
  onOpenAbout,
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <div ref={menuRef} className="w-full bg-neutral-50 dark:bg-[#252525] border-b border-neutral-200 dark:border-[#333333] select-none text-xs text-neutral-700 dark:text-neutral-200">
      {/* Classic Windows Top Menu Bar */}
      <div className="flex items-center px-1 py-0.5 border-b border-neutral-200/60 dark:border-[#2f2f2f] text-[12px] font-normal">
        {/* Tệp (File) */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('file')}
            className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors ${openMenu === 'file' ? 'bg-neutral-200 dark:bg-[#383838]' : ''}`}
          >
            Tệp (File)
          </button>
          {openMenu === 'file' && (
            <div className="absolute left-0 top-full mt-0.5 w-60 bg-white dark:bg-[#2c2c2c] rounded-md shadow-lg border border-neutral-200 dark:border-[#404040] py-1 z-50 text-[12px]">
              <button
                onClick={() => { onOpenDirectUrlModal(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Trích xuất URL Douyin</span>
                </span>
                <span className="text-[10px] opacity-70">Ctrl+N</span>
              </button>
              <button
                onClick={() => { onOpenFolder(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Mở thư mục tải về</span>
                </span>
                <span className="text-[10px] opacity-70">Ctrl+O</span>
              </button>
              <div className="my-1 border-t border-neutral-200 dark:border-[#3d3d3d]" />
              <button
                onClick={() => { onOpenSettings(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <Settings className="w-3.5 h-3.5" />
                  <span>Cài đặt hệ thống...</span>
                </span>
                <span className="text-[10px] opacity-70">Ctrl+,</span>
              </button>
            </div>
          )}
        </div>

        {/* Chỉnh sửa (Edit) */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('edit')}
            className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors ${openMenu === 'edit' ? 'bg-neutral-200 dark:bg-[#383838]' : ''}`}
          >
            Chỉnh sửa (Edit)
          </button>
          {openMenu === 'edit' && (
            <div className="absolute left-0 top-full mt-0.5 w-56 bg-white dark:bg-[#2c2c2c] rounded-md shadow-lg border border-neutral-200 dark:border-[#404040] py-1 z-50 text-[12px]">
              <button
                onClick={() => { onSelectAll(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span>Chọn tất cả</span>
                <span className="text-[10px] opacity-70">Ctrl+A</span>
              </button>
              <button
                onClick={() => { onDeselectAll(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span>Bỏ chọn</span>
                <span className="text-[10px] opacity-70">Esc</span>
              </button>
            </div>
          )}
        </div>

        {/* Xem (View) */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('view')}
            className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors ${openMenu === 'view' ? 'bg-neutral-200 dark:bg-[#383838]' : ''}`}
          >
            Xem (View)
          </button>
          {openMenu === 'view' && (
            <div className="absolute left-0 top-full mt-0.5 w-56 bg-white dark:bg-[#2c2c2c] rounded-md shadow-lg border border-neutral-200 dark:border-[#404040] py-1 z-50 text-[12px]">
              <button
                onClick={() => { onChangeViewMode('grid'); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Dạng lưới (Grid Cards)</span>
                </span>
                {viewMode === 'grid' && <span>✓</span>}
              </button>
              <button
                onClick={() => { onChangeViewMode('table'); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <List className="w-3.5 h-3.5" />
                  <span>Dạng bảng chi tiết (Details)</span>
                </span>
                {viewMode === 'table' && <span>✓</span>}
              </button>
              <div className="my-1 border-t border-neutral-200 dark:border-[#3d3d3d]" />
              <button
                onClick={() => { onRefresh(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Làm mới kết quả</span>
                </span>
                <span className="text-[10px] opacity-70">F5</span>
              </button>
            </div>
          )}
        </div>

        {/* Tải xuống (Downloads) */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('downloads')}
            className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors ${openMenu === 'downloads' ? 'bg-neutral-200 dark:bg-[#383838]' : ''}`}
          >
            Tải xuống (Downloads)
          </button>
          {openMenu === 'downloads' && (
            <div className="absolute left-0 top-full mt-0.5 w-64 bg-white dark:bg-[#2c2c2c] rounded-md shadow-lg border border-neutral-200 dark:border-[#404040] py-1 z-50 text-[12px]">
              <button
                onClick={() => { onDownloadSelected(); setOpenMenu(null); }}
                disabled={selectedCount === 0}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-between"
              >
                <span>Tải các video đã chọn ({selectedCount})</span>
                <span className="text-[10px] opacity-70">Ctrl+D</span>
              </button>
              <button
                onClick={() => { onPauseAll(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span>Tạm dừng tất cả tác vụ</span>
              </button>
              <button
                onClick={() => { onResumeAll(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span>Tiếp tục tất cả tác vụ</span>
              </button>
            </div>
          )}
        </div>

        {/* Trợ giúp (Help) */}
        <div className="relative">
          <button
            onClick={() => toggleMenu('help')}
            className={`px-2.5 py-1 rounded hover:bg-neutral-200 dark:hover:bg-[#383838] transition-colors ${openMenu === 'help' ? 'bg-neutral-200 dark:bg-[#383838]' : ''}`}
          >
            Trợ giúp (Help)
          </button>
          {openMenu === 'help' && (
            <div className="absolute left-0 top-full mt-0.5 w-56 bg-white dark:bg-[#2c2c2c] rounded-md shadow-lg border border-neutral-200 dark:border-[#404040] py-1 z-50 text-[12px]">
              <button
                onClick={() => { onOpenAbout(); setOpenMenu(null); }}
                className="w-full text-left px-3 py-1.5 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-600 flex items-center justify-between"
              >
                <span className="flex items-center space-x-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Giới thiệu phần mềm</span>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Windows 11 Fluent Ribbon / Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-1.5 gap-2">
        {/* Left Action Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          {/* Paste URL Direct */}
          <button
            onClick={onOpenDirectUrlModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-[#333333] hover:bg-neutral-100 dark:hover:bg-[#3d3d3d] border border-neutral-200 dark:border-[#424242] text-neutral-800 dark:text-neutral-100 font-medium shadow-2xs transition-all active:scale-95"
            title="Dán link video Douyin trực tiếp để bóc tách watermark"
          >
            <PlusCircle className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>+ Dán Link Trực Tiếp</span>
          </button>

          {/* Download Selected Videos */}
          <button
            onClick={onDownloadSelected}
            disabled={selectedCount === 0}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#0067c0] hover:bg-[#1879c9] active:bg-[#005fb8] disabled:bg-neutral-300 dark:disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-medium shadow-2xs transition-all active:scale-95"
            title="Tải hàng loạt video không logo"
          >
            <Download className="w-4 h-4" />
            <span>Tải Đã Chọn ({selectedCount})</span>
          </button>

          {/* Select / Deselect All */}
          {selectedCount < totalCount ? (
            <button
              onClick={onSelectAll}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#333333] transition-colors text-neutral-700 dark:text-neutral-300"
              title="Chọn tất cả video trong danh sách"
            >
              <CheckSquare className="w-3.5 h-3.5 text-neutral-500" />
              <span>Chọn tất cả ({totalCount})</span>
            </button>
          ) : (
            <button
              onClick={onDeselectAll}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#333333] transition-colors text-neutral-700 dark:text-neutral-300"
              title="Bỏ chọn tất cả"
            >
              <Square className="w-3.5 h-3.5 text-neutral-500" />
              <span>Bỏ chọn</span>
            </button>
          )}

          {/* Open Downloads Folder */}
          <button
            onClick={onOpenFolder}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#333333] transition-colors text-neutral-700 dark:text-neutral-300"
            title="Mở thư mục lưu trữ C:\Downloads\Douyin_NoWatermark"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Thư mục tải</span>
          </button>

          {/* Refresh List */}
          <button
            onClick={onRefresh}
            className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#333333] transition-colors text-neutral-600 dark:text-neutral-400"
            title="Làm mới kết quả (F5)"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action: View Switcher & Settings */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center bg-neutral-200/70 dark:bg-[#303030] p-0.5 rounded-md border border-neutral-300 dark:border-[#404040]">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`p-1 rounded flex items-center space-x-1 text-xs transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-[#3d3d3d] text-neutral-900 dark:text-white shadow-2xs font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Hiển thị dạng thẻ ảnh/video (Grid)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              className={`p-1 rounded flex items-center space-x-1 text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-[#3d3d3d] text-neutral-900 dark:text-white shadow-2xs font-medium'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Hiển thị dạng bảng chi tiết Windows Explorer (Details Table)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-[#333333] transition-colors text-neutral-700 dark:text-neutral-300"
            title="Cài đặt thư mục, chất lượng tải và proxy"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
