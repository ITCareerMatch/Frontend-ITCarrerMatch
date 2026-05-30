import React from 'react';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';

/**
 * DangerZone Component - Account deletion section
 */
export default function DangerZone({ isDeleting, onDeleteAccount }) {
  return (
    <div className="bg-white rounded-2xl border border-rose-200/60 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-rose-100 bg-rose-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
            <FiAlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-rose-900">Zona Berbahaya</h3>
            <p className="text-xs text-rose-600/80 mt-0.5">Tindakan yang tidak dapat dibatalkan</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm mb-1">Hapus Akun</p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Menghapus akun akan permanently menghapus semua data Anda, termasuk riwayat analisis dan preferensi. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <button
            onClick={onDeleteAccount}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-xl hover:bg-rose-100 transition-colors border border-rose-200 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isDeleting ? (
              <>
                <span className="w-4 h-4 border-2 border-rose-300 border-t-rose-600 rounded-full animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <FiTrash2 size={16} />
                Hapus Akun
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}