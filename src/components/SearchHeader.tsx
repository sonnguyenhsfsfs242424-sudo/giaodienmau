/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown, Clock, Filter, Sparkles } from 'lucide-react';
import { SearchFilter } from '../utils/douyinDownloader';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPerformSearch: (query: string) => void;
  filters: SearchFilter;
  onFilterChange: (filters: SearchFilter) => void;
  resultCount: number;
  isLoading: boolean;
}

const POPULAR_KEYWORDS = [
  'Ẩm thực',
  'Biến hình',
  'Street Dance',
  'Cổ phong Hanfu',
  'Mèo cưng',
  'Du lịch phong cảnh',
  'Review công nghệ',
  'Võ thuật phim',
];

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onPerformSearch,
  filters,
  onFilterChange,
  resultCount,
  isLoading,
}) => {
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPerformSearch(localQuery);
  };

  const handleSelectKeyword = (kw: string) => {
    setLocalQuery(kw);
    onSearchChange(kw);
    onPerformSearch(kw);
  };

  const handleClear = () => {
    setLocalQuery('');
    onSearchChange('');
    onPerformSearch('');
  };

  return (
    <div className="w-full bg-white dark:bg-[#252525] border-b border-neutral-200 dark:border-[#333333] p-4 select-none">
      {/* Search Bar Input Container */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-4xl">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4 text-[#0067c0] dark:text-[#60cdff]" />
          </div>
          <input
            type="text"
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              onSearchChange(e.target.value);
            }}
            placeholder="Nhập từ khóa tìm kiếm video Douyin (VD: ẩm thực, biến hình, hot trend, review...) hoặc ID video..."
            className="w-full pl-9 pr-9 py-2 rounded-md bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] text-neutral-800 dark:text-neutral-100 text-xs sm:text-sm focus:outline-none focus:border-[#0067c0] dark:focus:border-[#60cdff] focus:ring-1 focus:ring-[#0067c0] dark:focus:ring-[#60cdff] placeholder-neutral-400 transition-all"
          />
          {localQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              title="Xóa nội dung tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-[#0067c0] hover:bg-[#1879c9] active:bg-[#005fb8] disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white font-medium text-xs sm:text-sm rounded-md shadow-2xs transition-all flex items-center space-x-1.5 active:scale-95"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>Tìm kiếm Douyin</span>
        </button>
      </form>

      {/* Popular Trending Suggestions */}
      <div className="flex items-center flex-wrap gap-1.5 mt-2.5 text-xs">
        <span className="text-neutral-500 dark:text-neutral-400 text-[11px] font-medium flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Gợi ý thịnh hành:</span>
        </span>
        {POPULAR_KEYWORDS.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => handleSelectKeyword(kw)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
              localQuery.toLowerCase() === kw.toLowerCase()
                ? 'bg-[#0067c0] text-white font-medium'
                : 'bg-neutral-100 dark:bg-[#333333] text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-[#404040]'
            }`}
          >
            {kw}
          </button>
        ))}
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-neutral-100 dark:border-[#303030] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort By Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px] flex items-center space-x-1">
              <ArrowUpDown className="w-3 h-3" />
              <span>Sắp xếp:</span>
            </span>
            <select
              value={filters.sort}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  sort: e.target.value as SearchFilter['sort'],
                })
              }
              className="bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#404040] rounded px-2 py-1 text-[11px] text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#0067c0]"
            >
              <option value="relevance">Độ liên quan cao nhất</option>
              <option value="digg">Nhiều lượt thích (Tim) nhất</option>
              <option value="latest">Mới cập nhật gần đây</option>
              <option value="share">Lượt chia sẻ nhiều nhất</option>
            </select>
          </div>

          {/* Duration Filter */}
          <div className="flex items-center space-x-1.5">
            <span className="text-neutral-500 dark:text-neutral-400 text-[11px] flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Thời lượng:</span>
            </span>
            <select
              value={filters.duration}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  duration: e.target.value as SearchFilter['duration'],
                })
              }
              className="bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#404040] rounded px-2 py-1 text-[11px] text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-[#0067c0]"
            >
              <option value="all">Tất cả thời lượng</option>
              <option value="short">Dưới 45 giây (Short)</option>
              <option value="medium">45 giây - 2 phút</option>
              <option value="long">Trên 2 phút (Long)</option>
            </select>
          </div>
        </div>

        {/* Result Counter & Status */}
        <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
          Hiển thị <span className="font-semibold text-neutral-800 dark:text-neutral-200">{resultCount}</span> video Douyin chuẩn không logo
        </div>
      </div>
    </div>
  );
};
