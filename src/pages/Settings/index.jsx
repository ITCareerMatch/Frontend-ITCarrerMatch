import React, { useState, useEffect } from 'react';
import { 
  FiMail, FiLock, FiBell, FiSave, FiCheckCircle, 
  FiArrowRight, FiTrendingUp, FiFileText, 
  FiCamera, FiEdit2, FiX, FiRefreshCw, FiUser,
  FiCalendar, FiHash, FiTrash2, FiAlertTriangle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

// Import fungsi API & Supabase
import { fetchUserProfile, updateUserProfile, deleteUserProfile } from '../../services/api';
import { supabase } from '../../lib/supabase';

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
  const token = localStorage.getItem('access_token');

  // --- STATE LOADING & ERROR ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // --- STATE UNTUK HAPUS AKUN ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- STATE UNTUK DATA FORM ---
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    email: '',
    gender: '',
    created_at: ''
  });

  const [passwords, setPasswords] = useState({
    newPassword: ''
  });

  const [notifState, setNotifState] = useState({
    jobMatch: true,
    tips: true,
    updates: false
  });

  const [editMode, setEditMode] = useState({
    profile: false,
    contact: false
  });

  // --- FETCH DATA SAAT KOMPONEN DIMUAT ---
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await fetchUserProfile(token);
        
        setProfileData({
          id: data?.id || '',
          name: data?.name || '',
          email: data?.email || '',
          gender: data?.gender || '',
          created_at: data?.created_at || ''
        });
      } catch (err) {
        console.error("Gagal memuat profil:", err);
        setError('Gagal memuat data profil. Silakan muat ulang halaman.');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [token, navigate]);

  // --- HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  }

  const toggleEdit = (section, isEditing) => {
    setEditMode(prev => ({ ...prev, [section]: isEditing }));
    if (!isEditing && section === 'contact') {
      setPasswords({ newPassword: '' }); 
    }
  };

  const handleSaveSection = async (section) => {
    setSaving(true);
    setError('');

    try {
      if (section === 'profile') {
        const payload = {
          name: profileData.name,
          gender: profileData.gender
        };
        await updateUserProfile(token, payload);
        alert('Data Profil berhasil diperbarui!');
      } 
      else if (section === 'contact') {
        if (passwords.newPassword) {
          if (passwords.newPassword.length < 6) {
            throw new Error('Password minimal 6 karakter.');
          }
          const { error: authError } = await supabase.auth.updateUser({
            password: passwords.newPassword
          });
          
          if (authError) throw authError;
          alert('Kata sandi berhasil diperbarui secara aman!');
          setPasswords({ newPassword: '' });
        } else {
          alert('Tidak ada perubahan keamanan yang dilakukan.');
        }
      }

      setEditMode(prev => ({ ...prev, [section]: false }));

    } catch (err) {
      console.error(err);
      alert(err.message || 'Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  // --- HANDLER HAPUS AKUN ---
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // 1. Hapus data profil di backend
      await deleteUserProfile(token);
      
      // 2. Hapus sesi dan bersihkan storage lokal
      await supabase.auth.signOut();
      localStorage.removeItem('access_token');
      
      // 3. Arahkan ke beranda dengan pesan sukses
      alert('Akun dan semua data Anda telah berhasil dihapus secara permanen.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Gagal menghapus akun: ' + err.message);
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const getInputClass = (isEditing) => `w-full px-4 py-3 border rounded-xl outline-none text-sm transition-colors ${
    isEditing 
      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white text-gray-900' 
      : 'border-transparent bg-gray-50 text-gray-600 cursor-not-allowed'
  }`;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-gray-500">Memuat profil Anda...</p>
      </div>
    );
  }

  const displayName = profileData.name || (profileData.email ? profileData.email.split('@')[0] : 'Pengguna Terdaftar');
  const avatarInitials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans text-gray-800">
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* --- BAGIAN ATAS: BANNER & INFO SINGKAT --- */}
      <div className="mb-8 shadow-sm rounded-3xl bg-white border border-gray-100 relative">
        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-t-3xl w-full"></div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mt--12">
            <div className="absolute -top-12 left-6 md:left-8 w-24 h-24 bg-indigo-600 text-white rounded-2xl border-4 border-white flex items-center justify-center text-3xl font-bold shadow-md group cursor-pointer overflow-hidden">
              <span>{avatarInitials}</span>
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera size={24} />
                <span className="text-[10px] mt-1">Ubah Foto</span>
              </div>
            </div>
            <div className="mt-14 md:mt-0 md:ml-32">
              <h1 className="text-2xl font-bold text-gray-900 mb-1 capitalize">{displayName}</h1>
              <p className="text-sm text-gray-500">
                {profileData.email}
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
             <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 text-center flex flex-col justify-center">
               <span className="text-xs font-bold text-blue-600">Member Sejak</span>
               <span className="text-sm font-semibold text-gray-700">{formatDate(profileData.created_at)}</span>
             </div>
          </div>
        </div>
      </div>

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
                <p className="text-sm text-gray-500 mt-1">Data dasar yang digunakan sebagai referensi akun Anda.</p>
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                <input type="text" name="name" disabled={!editMode.profile} value={profileData.name} onChange={handleChange} className={getInputClass(editMode.profile)} placeholder="Contoh: Budi Santoso" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiUser className="text-gray-400"/> Jenis Kelamin</label>
                <select 
                  name="gender" 
                  disabled={!editMode.profile} 
                  value={profileData.gender} 
                  onChange={handleChange} 
                  className={getInputClass(editMode.profile)}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="male">Laki-Laki</option>
                  <option value="female">Perempuan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-5 pt-4 border-t border-gray-50">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiCalendar className="text-gray-400"/> Tanggal Bergabung</label>
                  <input type="text" disabled value={formatDate(profileData.created_at)} className={getInputClass(false)} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiHash className="text-gray-400"/> ID Akun</label>
                  <input type="text" disabled value={profileData.id} className={`${getInputClass(false)} text-xs`} />
                </div>
              </div>
            </div>

            {editMode.profile && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 animate-fadeIn">
                <button 
                  onClick={() => toggleEdit('profile', false)} 
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FiX size={18}/> Batal
                </button>
                <button 
                  onClick={() => handleSaveSection('profile')} 
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {saving ? <FiRefreshCw className="animate-spin" size={18}/> : <FiSave size={18}/>} 
                  {saving ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            )}
          </div>

          {/* SECTION 2: KONTAK & KEAMANAN */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Keamanan Akun</h2>
                <p className="text-sm text-gray-500 mt-1">Kelola email dan kata sandi untuk keamanan akses Anda.</p>
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FiMail className="text-gray-400"/> Email Akun (Terdaftar via Supabase)</label>
                <input type="email" name="email" disabled={true} value={profileData.email} className={getInputClass(false)} />
                <p className="text-xs text-gray-400 mt-2">Pembaruan email memerlukan verifikasi lebih lanjut dan saat ini dinonaktifkan.</p>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><FiLock className="text-gray-400"/> Ubah Kata Sandi</h3>
                <div className="space-y-4 max-w-md">
                  <input 
                    type="password" 
                    name="newPassword"
                    disabled={!editMode.contact} 
                    value={passwords.newPassword}
                    onChange={handlePasswordChange}
                    placeholder={editMode.contact ? "Masukkan Password Baru" : "••••••••"} 
                    className={getInputClass(editMode.contact)} 
                  />
                </div>
              </div>
            </div>

            {editMode.contact && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100 animate-fadeIn">
                <button 
                  onClick={() => toggleEdit('contact', false)} 
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <FiX size={18}/> Batal
                </button>
                <button 
                  onClick={() => handleSaveSection('contact')} 
                  disabled={saving || !passwords.newPassword}
                  className="px-6 py-2.5 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:bg-gray-400"
                >
                  {saving ? <FiRefreshCw className="animate-spin" size={18}/> : <FiSave size={18}/>}
                  {saving ? 'Menyimpan...' : 'Simpan Keamanan'}
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
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900">Tips & saran karir mingguan</h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">Newsletter mingguan dengan tips karir dan optimasi CV.</p>
                </div>
                <ToggleSwitch active={notifState.tips} onClick={() => setNotifState(p => ({...p, tips: !p.tips}))} />
              </div>
            </div>
          </div>

          {/* SECTION 4: DANGER ZONE (HAPUS AKUN) */}
          <div className="bg-red-50 rounded-3xl p-6 md:p-8 border border-red-100 shadow-sm mt-8">
            <div className="flex items-start gap-4">
              <div className="bg-red-100 p-3 rounded-full text-red-600 shrink-0">
                <FiAlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-700 mb-2">Zona Bahaya</h2>
                <p className="text-sm text-red-600 mb-6 leading-relaxed">
                  Tindakan ini tidak dapat dibatalkan. Semua data profil, riwayat analisis CV, dan rekomendasi pekerjaan Anda akan dihapus secara permanen dari sistem kami.
                </p>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="bg-white text-red-600 font-bold px-5 py-2.5 rounded-xl border border-red-200 hover:bg-red-600 hover:text-white transition-colors text-sm flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FiTrash2 size={16}/> Hapus Akun Saya
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN: WIDGET SAMPING */}
        {/* ========================================== */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-1/3 -translate-y-1/3"></div>
             <BsStars size={28} className="mb-4 text-indigo-200 relative z-10" />
             <h3 className="font-bold text-lg mb-2 relative z-10">Analisis CV Baru</h3>
             <p className="text-xs text-indigo-100 mb-6 leading-relaxed relative z-10">
               Coba posisi berbeda untuk melihat skor kecocokan yang baru dan dapatkan rekomendasi pekerjaan instan.
             </p>
             <button onClick={() => navigate('/analisis-baru')} className="bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors relative z-10 flex items-center gap-2 shadow-sm cursor-pointer">
               Mulai Analisis <FiArrowRight />
             </button>
          </div>
        </div>

      </div>

      {/* --- MODAL KONFIRMASI HAPUS AKUN --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 mx-auto">
              <FiAlertTriangle size={32} />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Hapus Akun Permanen?</h3>
            <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
              Anda yakin ingin menghapus akun ini? Segala data yang berkaitan dengan akun <strong>{profileData.email}</strong> tidak akan bisa dipulihkan kembali.
            </p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <FiRefreshCw className="animate-spin" size={18}/> : <FiTrash2 size={18}/>}
                {isDeleting ? 'Menghapus Akun...' : 'Ya, Hapus Permanen'}
              </button>
              <button 
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-full bg-white text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fadeIn { animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}