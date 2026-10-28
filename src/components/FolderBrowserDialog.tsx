/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Folder,
  FolderPlus,
  HardDrive,
  Monitor,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface FolderBrowserDialogProps {
  isOpen: boolean;
  currentPath: string;
  onSelectPath: (path: string) => void;
  onClose: () => void;
}

interface TreeNode {
  name: string;
  path: string;
  icon?: 'pc' | 'disk' | 'folder';
  children?: TreeNode[];
}

const TREE_DATA: TreeNode = {
  name: 'This PC',
  path: 'This PC',
  icon: 'pc',
  children: [
    {
      name: 'Local Disk (C:)',
      path: 'C:\\',
      icon: 'disk',
      children: [
        {
          name: 'Users',
          path: 'C:\\Users',
          children: [
            {
              name: 'Admin',
              path: 'C:\\Users\\Admin',
              children: [
                {
                  name: 'Downloads',
                  path: 'C:\\Users\\Admin\\Downloads',
                  children: [
                    {
                      name: 'Douyin_NoWatermark',
                      path: 'C:\\Users\\Admin\\Downloads\\Douyin_NoWatermark',
                    },
                    {
                      name: 'Video_Shorts',
                      path: 'C:\\Users\\Admin\\Downloads\\Video_Shorts',
                    },
                  ],
                },
                {
                  name: 'Videos',
                  path: 'C:\\Users\\Admin\\Videos',
                  children: [
                    {
                      name: 'Douyin_Archive_HD',
                      path: 'C:\\Users\\Admin\\Videos\\Douyin_Archive_HD',
                    },
                  ],
                },
                {
                  name: 'Desktop',
                  path: 'C:\\Users\\Admin\\Desktop',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'Data Disk (D:)',
      path: 'D:\\',
      icon: 'disk',
      children: [
        {
          name: 'Douyin_Kho_Video_4K',
          path: 'D:\\Douyin_Kho_Video_4K',
        },
      ],
    },
  ],
};

export const FolderBrowserDialog: React.FC<FolderBrowserDialogProps> = ({
  isOpen,
  currentPath,
  onSelectPath,
  onClose,
}) => {
  const [selected, setSelected] = useState(currentPath);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(
    new Set(['This PC', 'C:\\', 'C:\\Users', 'C:\\Users\\Admin', 'C:\\Users\\Admin\\Downloads'])
  );

  if (!isOpen) return null;

  const toggleExpand = (path: string) => {
    const next = new Set(expandedPaths);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    setExpandedPaths(next);
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    const isExpanded = expandedPaths.has(node.path);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selected === node.path;

    return (
      <div key={node.path} className="text-xs">
        <div
          onClick={() => {
            setSelected(node.path);
            if (hasChildren) toggleExpand(node.path);
          }}
          className={`flex items-center space-x-1 py-1 px-1.5 rounded cursor-pointer transition-colors ${
            isSelected
              ? 'bg-[#0067c0] text-white font-medium'
              : 'hover:bg-neutral-200 dark:hover:bg-[#353535] text-neutral-800 dark:text-neutral-200'
          }`}
          style={{ paddingLeft: `${depth * 14 + 6}px` }}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.path);
              }}
              className="p-0.5"
            >
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {node.icon === 'pc' ? (
            <Monitor className="w-3.5 h-3.5" />
          ) : node.icon === 'disk' ? (
            <HardDrive className="w-3.5 h-3.5 text-amber-500" />
          ) : (
            <Folder className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
          )}

          <span className="truncate">{node.name}</span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-md bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-neutral-300 dark:border-[#404040] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Title bar */}
        <div className="h-9 px-3 bg-neutral-100 dark:bg-[#1a1a1a] border-b border-neutral-200 dark:border-[#333333] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Folder className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              Chọn thư mục lưu trữ video Douyin
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-full flex items-center justify-center hover:bg-[#e81123] hover:text-white text-neutral-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tree Container */}
        <div className="p-3 text-xs space-y-3">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
            Chọn một thư mục đích trên máy tính Windows để lưu các video đã gỡ watermark:
          </div>

          <div className="h-56 overflow-y-auto bg-neutral-50 dark:bg-[#1e1e1e] border border-neutral-200 dark:border-[#383838] rounded-md p-2">
            {renderNode(TREE_DATA)}
          </div>

          {/* Selected Path display */}
          <div className="space-y-1">
            <div className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
              Thư mục đang chọn:
            </div>
            <div className="p-2 rounded bg-neutral-100 dark:bg-[#303030] border border-neutral-200 dark:border-[#404040] font-mono text-[11px] text-neutral-800 dark:text-neutral-100 truncate">
              {selected}
            </div>
          </div>
        </div>

        {/* Dialog footer */}
        <div className="p-3 bg-neutral-100 dark:bg-[#202020] border-t border-neutral-200 dark:border-[#333333] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const newFolder = `${selected}\\New_Folder`;
              setSelected(newFolder);
            }}
            className="px-2.5 py-1.5 rounded bg-white dark:bg-[#303030] border border-neutral-200 dark:border-[#444444] text-[11px] flex items-center space-x-1 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
            <span>Tạo thư mục mới</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                onSelectPath(selected);
                onClose();
              }}
              className="px-4 py-1.5 bg-[#0067c0] hover:bg-[#1879c9] text-white text-xs font-medium rounded shadow-xs"
            >
              OK (Chọn thư mục)
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-neutral-200 dark:bg-[#383838] hover:bg-neutral-300 text-neutral-700 dark:text-neutral-200 text-xs rounded"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
