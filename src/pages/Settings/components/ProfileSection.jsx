import React from 'react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

// Helper: Convert ISO date to YYYY-MM-DD for input
const TO_INPUT_DATE_FORMAT = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

// Helper: Format date for display (Indonesian format)
const FORMAT_DATE_DISPLAY = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return null;
  }
};

/**
 * ProfileSection Component - Profile information form
 */
export default function ProfileSection({
  profileData,
  editMode,
  onToggleEdit,
  onChange,
  onSave,
  onCancel
}) {
  const inputClass = "w-full p-3 border border-slate-200 rounded-xl text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium";

  const fields = [
    { key: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'Masukkan nama lengkap' },
    { key: 'gender', label: 'Jenis Kelamin', type: 'select', options: ['', 'Laki-laki', 'Perempuan'] },
    { key: 'birth_date', label: 'Tanggal Lahir', type: 'date', isDate: true },
    { key: 'city', label: 'Kota', type: 'text', placeholder: 'Contoh: Jakarta' },
    { key: 'province', label: 'Provinsi', type: 'text', placeholder: 'Contoh: DKI Jakarta' },
    { key: 'min_salary_expect', label: 'Gaji Minimum (Rp)', type: 'number', placeholder: '5000000' },
    { key: 'max_salary_expect', label: 'Gaji Maksimum (Rp)', type: 'number', placeholder: '15000000' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Informasi Profil</h3>
          <p className="text-xs text-slate-500 mt-0.5">Data dasar akun Anda</p>
        </div>
        {!editMode.profile ? (
          <button
            onClick={() => onToggleEdit('profile')}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs rounded-xl hover:bg-blue-100 transition-colors"
          >
            <FiEdit2 size={14} /> Edit
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
              onClick={() => onSave('profile')}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FiSave size={14} /> Simpan
            </button>
          </div>
        )}
      </div>

      {/* Form */}
      <div className="p-5 space-y-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              {field.label}
            </label>
            {editMode.profile ? (
              field.type === 'select' ? (
                <select
                  name={field.key}
                  value={profileData[field.key] || ''}
                  onChange={onChange}
                  className={inputClass}
                >
                  <option value="">Pilih {field.label}</option>
                  {field.options.filter(o => o).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : field.isDate ? (
                <input
                  type="date"
                  name={field.key}
                  value={TO_INPUT_DATE_FORMAT(profileData[field.key])}
                  onChange={onChange}
                  className={inputClass}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.key}
                  value={profileData[field.key] || ''}
                  onChange={onChange}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              )
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700">
                {field.isDate ? (FORMAT_DATE_DISPLAY(profileData[field.key]) || <span className="text-slate-400 italic">Belum diisi</span>) : profileData[field.key] || <span className="text-slate-400 italic">Belum diisi</span>}
              </div>
            )}
          </div>
        ))}

        {/* Bio */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Bio / Deskripsi Diri
          </label>
          {editMode.profile ? (
            <textarea
              name="bio"
              value={profileData.bio || ''}
              onChange={onChange}
              rows={4}
              placeholder="Ceritakan tentang diri Anda..."
              className={`${inputClass} resize-none`}
            />
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 min-h-[80px]">
              {profileData.bio || <span className="text-slate-400 italic">Belum diisi</span>}
            </div>
          )}
        </div>

        {/* Skills Overview */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            Ringkasan Keahlian
          </label>
          {editMode.profile ? (
            <textarea
              name="skills_overview"
              value={profileData.skills_overview || ''}
              onChange={onChange}
              rows={3}
              placeholder="Contoh: JavaScript, React, Node.js, MongoDB..."
              className={`${inputClass} resize-none`}
            />
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-sm font-medium text-slate-700 min-h-[60px]">
              {profileData.skills_overview || <span className="text-slate-400 italic">Belum diisi</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}