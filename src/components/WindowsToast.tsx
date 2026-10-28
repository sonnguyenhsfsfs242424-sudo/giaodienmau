/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info, FolderOpen } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
  filePath?: string;
  actionText?: string;
  onAction?: () => void;
}

interface WindowsToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const WindowsToast: React.FC<WindowsToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-9 right-4 z-50 flex flex-col space-y-2 pointer-events-none select-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white/95 dark:bg-[#282828]/95 backdrop-blur-md rounded-xl p-3.5 shadow-2xl border border-neutral-200 dark:border-[#404040] flex items-start space-x-3 text-xs animate-in slide-in-from-right duration-200"
        >
          {/* Toast Icon */}
          <div className="mt-0.5 shrink-0">
            {toast.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : toast.type === 'error' ? (
              <div className="w-6 h-6 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                {toast.title}
              </span>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5 line-clamp-2">
              {toast.message}
            </p>

            {toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  onDismiss(toast.id);
                }}
                className="mt-2 px-2.5 py-1 rounded bg-[#0067c0] hover:bg-[#1879c9] text-white text-[11px] font-medium flex items-center space-x-1"
              >
                <FolderOpen className="w-3 h-3" />
                <span>{toast.actionText || 'Xem kết quả'}</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
