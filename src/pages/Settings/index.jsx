import React, { useState } from 'react';
import { 
  FiMail, FiPhone, FiMapPin, FiBriefcase, 
  FiLock, FiBell, FiSave, FiCheckCircle, 
  FiArrowRight, FiTrendingUp, FiFileText, 
  FiCamera, FiBook, FiEdit2, FiX
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

// --- KOMPONEN BANTUAN ---
const ToggleSwitch = ({ active, onClick }) => (
  <div 
    onClick={onClick}
    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${active ? 'bg-blue-600' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`}></div>
  </div>
);

export default function Settings() {
  const navigate = useNavigate();
  // --- STATE UNTUK DATA FORM ---
  const [profileData, setProfileData] = useState({
    name: 'Budi Santoso',
    role: 'Backend Engineer',
    location: 'Jakarta, Indonesia',
    summary: 'Backend Engineer berpengalaman dengan spesialisasi Golang dan microservices. Passionate tentang membangun sistem yang scalable dan reliable.',
    email: 'budi.santoso@email.com',
    phone: '+62 812-3456-7890',
    experience: '4',
    education: 'S1 Teknik Informatika — Universitas Indonesia'
  });

  const [notifState, setNotifState] = useState({
    jobMatch: true,
    tips: true,
    updates: false
  });

  // --- STATE UNTUK MODE EDIT PER BAGIAN ---
  const [editMode, setEditMode] = useState({
    profile: false,
    contact: false
  });

  // --- HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (section, isEditing) => {
    setEditMode(prev => ({ ...prev, [section]: isEditing }));
    // Note: Di aplikasi nyata, jika isEditing false (Batal), kita mereset state ke data awal database
  };

  const handleSaveSection = (section) => {
    // Simulasi penyimpanan data per bagian
    setEditMode(prev => ({ ...prev, [section]: false }));
    alert(`Data ${section === 'profile' ? 'Profil' : 'Kontak & Keamanan'} berhasil diperbarui!`);
  };

  // Fungsi dinamis untuk styling input berdasarkan mode edit
  const getInputClass = (isEditing) => `w-full px-4 py-3 border rounded-xl outline-none text-sm transition-colors ${
    isEditing 
      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' 
      : 'border-transparent bg-gray-50 text-gray-600 cursor-not-allowed'
  }`;

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans text-gray-800">
      
      {/* --- BAGIAN ATAS: BANNER & INFO SINGKAT --- */}
      <div className="mb-8 shadow-sm rounded-3xl bg-white border border-gray-100 relative">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-3xl w-full"></div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          
          {/* Avatar Interaktif */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mt--12">
            <div className="absolute -top-12 left-6 md:left-8 w-24 h-24 bg-indigo-600 text-white rounded-2xl border-4 border-white flex items-center justify-center text-3xl font-bold shadow-md group cursor-pointer overflow-hidden">
              <span>{profileData.name.substring(0, 2).toUpperCase()}</span>
              {/* Overlay Hover Ubah Foto */}
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera size={24} />
                <span className="text-[10px] mt-1">Ubah Foto</span>
              </div>
            </div>
            <div className="mt-14 md:mt-0 md:ml-32">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{profileData.name}</h1>
              <p className="text-sm text-gray-500">{profileData.role} · {profileData.location}</p>
            </div>
          </div>

          {/* Statistik Top */}
          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-blue-600">75</div>
              <div className="text-[10px] uppercase font-semibold text-gray-400 mt-1">Skor Terakhir</div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 text-center min-w-[100px]">
              <div className="text-2xl font-bold text-purple-600">4</div>
              <div className="text-[10px] uppercase font-semibold text-gray-400 mt-1">Total Analisis</div>
            </div>
          </div>
        </div>
      </div>

      {/* --- KONTEN UTAMA (LAYOUT GANDA) --- */}
      <div className="flex flex-col lg:flex-row gap-6 animate-fadeIn">
        
        {/* ========================================== */}
        {/* KOLOM KIRI: FORM PENGATURAN & PROFIL */}
        {/* ========================================== */}
        <div className="lg:w-2/3 space-y-6">
          
          {/* SECTION 1: INFORMASI PROFIL */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Informasi Profil</h2>
                <p className="text-sm text-gray-500 mt-1">Data ini akan digunakan sebagai referensi utama analisis CV.</p>
              </div>
              {!editMode.profile && (
                <button 
                  onClick={() => toggleEdit('profile', true)} 
                  className="text-blue-600 font-bold text-sm flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                >
                  <FiEdit2 size={16} /> Edit
                </button>
              )}
            </div>
            
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input type="text" name="name" disabled={!editMode.profile} value={profileData.name} onChange={handleChange} className={getInputClass(editMode.profile)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Posisi / Pekerjaan</label>
                  <input type="text" name="role" disabled={!editMode.profile} value={profileData.role} onChange={handleChange} className={getInputClass(editMode.profile)} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan Profil (Bio)</label>
                <textarea rows="3" name="summary" disabled={!editMode.profile} value={profileData.summary} onChange={handleChange} className={`${getInputClass(editMode.profile)} leading-relaxed resize-none`}></textarea>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiMapPin className="text-gray-400"/> Lokasi</label>
                  <input type="text" name="location" disabled={!editMode.profile} value={profileData.location} onChange={handleChange} className={getInputClass(editMode.profile)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiBriefcase className="text-gray-400"/> Pengalaman (Tahun)</label>
                  <input type="number" name="experience" disabled={!editMode.profile} value={profileData.experience} onChange={handleChange} className={getInputClass(editMode.profile)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiBook className="text-gray-400"/> Pendidikan Terakhir</label>
                <input type="text" name="education" disabled={!editMode.profile} value={profileData.education} onChange={handleChange} className={getInputClass(editMode.profile)} />
              </div>
            </div>

            {/* Tombol Aksi Muncul Saat Mode Edit */}
            {editMode.profile && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 animate-fadeIn">
                <button 
                  onClick={() => toggleEdit('profile', false)} 
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <FiX size={18}/> Batal
                </button>
                <button 
                  onClick={() => handleSaveSection('profile')} 
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <FiSave size={18}/> Simpan Profil
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: KONTAK & KEAMANAN */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Kontak & Keamanan</h2>
                <p className="text-sm text-gray-500 mt-1">Kelola email, nomor telepon, dan kata sandi akun Anda.</p>
              </div>
              {!editMode.contact && (
                <button 
                  onClick={() => toggleEdit('contact', true)} 
                  className="text-blue-600 font-bold text-sm flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                >
                  <FiEdit2 size={16} /> Edit
                </button>
              )}
            </div>
            
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiMail className="text-gray-400"/> Email Akun</label>
                  <input type="email" name="email" disabled={!editMode.contact} value={profileData.email} onChange={handleChange} className={getInputClass(editMode.contact)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiPhone className="text-gray-400"/> Nomor Telepon</label>
                  <input type="text" name="phone" disabled={!editMode.contact} value={profileData.phone} onChange={handleChange} className={getInputClass(editMode.contact)} />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiLock className="text-gray-400"/> Ubah Kata Sandi</h3>
                <div className="space-y-4">
                  <input type="password" disabled={!editMode.contact} placeholder={editMode.contact ? "Masukkan Password Saat Ini" : "••••••••"} className={getInputClass(editMode.contact) + " max-w-md"} />
                  <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                    <input type="password" disabled={!editMode.contact} placeholder={editMode.contact ? "Password Baru" : "••••••••"} className={getInputClass(editMode.contact)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Tombol Aksi Muncul Saat Mode Edit */}
            {editMode.contact && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 animate-fadeIn">
                <button 
                  onClick={() => toggleEdit('contact', false)} 
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <FiX size={18}/> Batal
                </button>
                <button 
                  onClick={() => handleSaveSection('contact')} 
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                >
                  <FiSave size={18}/> Simpan Keamanan
                </button>
              </div>
            )}
          </div>

          {/* SECTION 3: NOTIFIKASI */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <FiBell className="text-blue-500" size={24}/>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Preferensi Notifikasi</h2>
                <p className="text-sm text-gray-500">Atur informasi apa saja yang ingin Anda terima.</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Email lowongan baru yang cocok</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">Terima email saat ada lowongan yang sesuai profil Anda.</p>
                </div>
                <ToggleSwitch active={notifState.jobMatch} onClick={() => setNotifState(p => ({...p, jobMatch: !p.jobMatch}))} />
              </div>
              <div className="flex items-center justify-between pb-6 border-b border-gray-50">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Tips & saran karir mingguan</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">Newsletter mingguan dengan tips karir dan optimasi CV.</p>
                </div>
                <ToggleSwitch active={notifState.tips} onClick={() => setNotifState(p => ({...p, tips: !p.tips}))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Update fitur baru</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">Pemberitahuan saat ada pembaruan fitur di AI CV Reviewer.</p>
                </div>
                <ToggleSwitch active={notifState.updates} onClick={() => setNotifState(p => ({...p, updates: !p.updates}))} />
              </div>
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN: WIDGET KOSONG (Dipindah ke atas) */}
        {/* ========================================== */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* Achievement */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Achievement</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-center bg-green-50/50 border border-green-100 p-3 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0"><FiCheckCircle size={20}/></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">First Scan</p>
                  <p className="text-[10px] text-gray-500">CV pertama dianalisis</p>
                </div>
                <FiCheckCircle className="text-green-500 shrink-0"/>
              </div>
              <div className="flex gap-4 items-center bg-green-50/50 border border-green-100 p-3 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0"><FiTrendingUp size={20}/></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Score Up</p>
                  <p className="text-[10px] text-gray-500">Skor naik 10+ poin</p>
                </div>
                <FiCheckCircle className="text-green-500 shrink-0"/>
              </div>
              <div className="flex gap-4 items-center bg-green-50/50 border border-green-100 p-3 rounded-2xl">
                <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center shrink-0"><FiFileText size={20}/></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">CV Optimized</p>
                  <p className="text-[10px] text-gray-500">Terapkan 3+ saran AI</p>
                </div>
                <FiCheckCircle className="text-green-500 shrink-0"/>
              </div>
              <div className="flex gap-4 items-center bg-gray-50 border border-gray-100 p-3 rounded-2xl opacity-60">
                <div className="w-10 h-10 bg-gray-300 text-white rounded-xl flex items-center justify-center shrink-0"><FiBriefcase size={20}/></div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Job Hunter</p>
                  <p className="text-[10px] text-gray-500">Lihat 5+ detail lowongan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner Promo Ungu */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
             <BsStars size={28} className="mb-4 text-indigo-200 relative z-10" />
             <h3 className="font-bold text-lg mb-2 relative z-10">Analisis CV Baru</h3>
             <p className="text-xs text-indigo-100 mb-6 leading-relaxed relative z-10">
               Coba posisi berbeda untuk melihat skor kecocokan yang baru.
             </p>
             <button onClick={() => navigate('/analisis-baru')} className="bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors relative z-10 flex items-center gap-2 shadow-sm cursor-pointer">
               Mulai Analisis <FiArrowRight />
             </button>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn { animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}