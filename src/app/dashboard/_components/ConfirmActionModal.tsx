import React from 'react';

interface ConfirmActionModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ConfirmActionModal({
  title,
  message,
  confirmText = 'Eliminar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  isLoading = false
}: ConfirmActionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0f0f14] border border-red-500/20 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-red-500 text-2xl">warning</span>
          </div>
          <h2 className="text-lg font-bold text-white">{title}</h2>
        </div>
        
        <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
