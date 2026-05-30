import React from 'react';
import { FiLock, FiEye, FiEyeOff, FiSave, FiX, FiEdit2 } from 'react-icons/fi';

/**
 * PasswordSection Component - Password change form
 */
export default function PasswordSection({
  passwords,
  showNewPassword,
  showConfirmPassword,
  editMode,
  onToggleEdit,
  onPasswordChange,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onSave,
  onCancel
}) {
  const inputClass = "w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium pr-10";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Kata Sandi</h3>
          <p className="text-xs text-slate-500 mt-0.5">Ubah kata sandi akun Anda</p>
        </div>
        {!editMode.contact ? (
          <button
            onClick={() => onToggleEdit('contact')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
          >
            <FiEdit2 size={14} /> Ubah
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-200 transition-colors"
            >
              <FiX size={14} /> Batal
            </button>
            <button
              onClick={() => onSave('contact')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FiSave size={14} /> Simpan
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="p-5 space-y-4">
        {/* New Password */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Kata Sandi Baru
          </label>
          <div className="relative">
            {editMode.contact ? (
              <>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={onPasswordChange}
                  placeholder="Minimal 8 karakter"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={onToggleNewPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-400">
                ••••••••
              </div>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative">
            {editMode.contact ? (
              <>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={onPasswordChange}
                  placeholder="Ulangi kata sandi baru"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={onToggleConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </>
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-400">
                ••••••••
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}