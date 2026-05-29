import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom'; // Import untuk memindahkan modal foto ke tingkat bodi dokumen
import {
  FiMail, FiLock, FiBell, FiSave, FiCheckCircle,
  FiArrowRight, FiTrendingUp, FiFileText,
  FiCamera, FiEdit2, FiX, FiRefreshCw, FiUser,
  FiCalendar, FiHash, FiTrash2, FiAlertTriangle, FiZoomIn, FiUploadCloud,
  FiEye, FiEyeOff, FiBriefcase, FiMapPin
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

// Import fungsi API & Supabase
import { fetchUserProfile, updateUserProfile, deleteUserProfile } from '../../services/api';
import { supabase } from '../../lib/supabase';

// --- KOMPONEN BANTUAN ---
const ToggleSwitch = ({ active, onClick }) => (
  <div 
    onClick={onClick}
    className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${active ? 'bg-blue-600' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`}></div>
  </div>
);

// Konfigurasi animasi seragam
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

export default function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);

  // --- STATE LOADING & ERROR ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // State hapus akun disederhanakan murni menggunakan status loading API
  const [isDeleting, setIsDeleting] = useState(false);

  // --- STATE UNTUK DATA FORM ---
  const [profileData, setProfileData] = useState({
    id: '',
    name: '',
    email: '',
    gender: '',
    created_at: '',
    avatar_url: '',
    birth_date: '',
    education_level: '',
    experience_level: '',
    city: '',
    province: '',
    min_salary_expect: '',
    max_salary_expect: '',
    bio: '',
    skills_overview: ''
  });

  // --- FITUR BARU: STATE UNTUK CROP/SESUAIKAN FOTO ---
  const [showCropModal, setShowCropModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // State password yang diekspansi untuk konfirmasi kata sandi
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // State untuk mengecek visibilitas password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          created_at: data?.created_at || '',
          avatar_url: data?.avatar_url || '',
          birth_date: data?.birth_date || '',
          education_level: data?.education_level || '',
          experience_level: data?.experience_level || '',
          city: data?.city || '',
          province: data?.province || '',
          min_salary_expect: data?.min_salary_expect || '',
          max_salary_expect: data?.max_salary_expect || '',
          bio: data?.bio || '',
          skills_overview: data?.skills_overview || ''
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

  // Bersihkan memory saat modal ditutup
  useEffect(() => {
    if (!showCropModal && selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
      setZoom(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCropModal]);

  // --- HANDLER TEXT INPUT ---
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
      setPasswords({ newPassword: '', confirmPassword: '' }); 
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  };

  // --- HANDLER 1: MENGAMBIL FOTO & MEMBUKA MODAL CROP ---
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Ukuran Berkas Terlalu Besar',
        text: 'Batas ukuran foto profil maksimal adalah 2MB.',
        confirmButtonColor: '#0f172a'
      });
      return;
    }

    setSelectedImage(URL.createObjectURL(file));
    setShowCropModal(true);
    // Reset value input file agar bisa memilih file yang sama lagi jika dibatalkan
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- HANDLER 2: PROSES CROP CANVAS & UPLOAD FOTO (TERPISAH) ---
  const handleCropAndUpload = async () => {
    setIsUploadingAvatar(true);

    try {
      // 1. Buat Canvas Virtual untuk Crop
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 400; // Resolusi Output
      canvas.height = 400;

      const img = imgRef.current;
      
      // Logika untuk meniru efek CSS 'object-cover' + Zoom
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;
      let drawWidth, drawHeight;

      if (imgRatio > canvasRatio) {
          drawHeight = canvas.height;
          drawWidth = img.naturalWidth * (canvas.height / img.naturalHeight);
      } else {
          drawWidth = canvas.width;
          drawHeight = img.naturalHeight * (canvas.width / img.naturalWidth);
      }

      drawWidth *= zoom;
      drawHeight *= zoom;
      const offsetX = (canvas.width - drawWidth) / 2;
      const offsetY = (canvas.height - drawHeight) / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      // 2. Ekstrak Blob dari Canvas
      canvas.toBlob(async (blob) => {
        if (!blob) throw new Error("Gagal memproses gambar");

        const formData = new FormData();
        formData.append('avatar', blob, 'avatar.jpg');
        formData.append('name', profileData.name);
        formData.append('gender', profileData.gender);

        // 3. Panggil API
        const resultData = await updateUserProfile(token, formData);
        
        if (resultData && resultData.avatar_url) {
           setProfileData(prev => ({ ...prev, avatar_url: resultData.avatar_url }));
        }

        Swal.fire({
          icon: 'success',
          title: 'Pembaruan Berhasil',
          text: 'Foto Profil Anda berhasil diperbarui dengan aman!',
          confirmButtonColor: '#0f172a'
        });
        setShowCropModal(false);
        setIsUploadingAvatar(false);
      }, 'image/jpeg', 0.9);

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Gagal mengunggah foto: ' + err.message,
        confirmButtonColor: '#0f172a'
      });
      setIsUploadingAvatar(false);
    }
  };

  // --- HANDLER 3: SIMPAN INFORMASI PROFIL & KEAMANAN ---
  const handleSaveSection = async (section) => {
    setSaving(true);
    setError('');

    try {
      if (section === 'profile') {
        const formData = new FormData();
        formData.append('name', profileData.name || '');
        formData.append('gender', profileData.gender || '');
        formData.append('birth_date', profileData.birth_date || '');
        formData.append('education_level', profileData.education_level || '');
        formData.append('experience_level', profileData.experience_level || '');
        formData.append('city', profileData.city || '');
        formData.append('province', profileData.province || '');
        formData.append('min_salary_expect', profileData.min_salary_expect || '');
        formData.append('max_salary_expect', profileData.max_salary_expect || '');
        formData.append('bio', profileData.bio || '');
        formData.append('skills_overview', profileData.skills_overview || '');

        const resultData = await updateUserProfile(token, formData);

        if (resultData && resultData.avatar_url) {
           setProfileData(prev => ({ ...prev, avatar_url: resultData.avatar_url }));
        }

        Swal.fire({
          icon: 'success',
          title: 'Pembaruan Berhasil',
          text: 'Informasi data diri Anda berhasil diperbarui!',
          confirmButtonColor: '#0f172a'
        });
      } 
      else if (section === 'contact') {
        if (passwords.newPassword || passwords.confirmPassword) {
          
          // VALIDASI UTAMA: Konfirmasi sandi wajib sama
          if (passwords.newPassword !== passwords.confirmPassword) {
            throw new Error('Konfirmasi kata sandi tidak cocok dengan kata sandi baru.');
          }
          if (passwords.newPassword.length < 6) {
            throw new Error('Password minimal 6 karakter.');
          }
          
          const { error: authError } = await supabase.auth.updateUser({
            password: passwords.newPassword
          });
          
          if (authError) throw authError;
          Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: 'Kata sandi Anda berhasil diperbarui secara aman!',
            confirmButtonColor: '#0f172a'
          });
          setPasswords({ newPassword: '', confirmPassword: '' });
          setShowNewPassword(false);
          setShowConfirmPassword(false);
        } else {
          Swal.fire({
            icon: 'info',
            title: 'Informasi',
            text: 'Tidak ada perubahan keamanan yang dilakukan.',
            confirmButtonColor: '#0f172a'
          });
        }
      }

      setEditMode(prev => ({ ...prev, [section]: false }));

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Penyimpanan Gagal',
        text: err.message || 'Gagal menyimpan perubahan.',
        confirmButtonColor: '#0f172a'
      });
    } finally {
      setSaving(false);
    }
  };

  // --- HANDLER HAPUS AKUN (Menggunakan SweetAlert2 Konfirmasi Penuh secara Stabil) ---
  const triggerDeleteAccount = () => {
    Swal.fire({
      title: 'Hapus Akun Permanen?',
      text: `Apakah Anda yakin ingin menghapus akun ini? Segala data pelacakan karir yang berkaitan dengan akun ${profileData.email} tidak akan bisa dipulihkan kembali setelah akun berhasil dieliminasi.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48', // Warna Rose-600 bertema bahaya
      cancelButtonColor: '#64748b', // Warna Slate-500
      confirmButtonText: 'Ya, Hapus Permanen',
      cancelButtonText: 'Batal',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-3xl border border-slate-200/60 shadow-xl font-sans text-left p-6',
        title: 'text-slate-900 font-extrabold text-lg tracking-tight mb-2',
        htmlContainer: 'text-slate-500 font-semibold text-xs leading-relaxed',
        confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider',
        cancelButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsDeleting(true);
        try {
          await deleteUserProfile(token);
          await supabase.auth.signOut();
          localStorage.removeItem('access_token');
          
          await Swal.fire({
            icon: 'success',
            title: 'Akun Dihapus',
            text: 'Akun dan seluruh data Anda telah berhasil dihapus secara permanen.',
            confirmButtonColor: '#0f172a'
          });
          navigate('/');
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: 'Gagal menghapus akun: ' + err.message,
            confirmButtonColor: '#0f172a'
          });
          setIsDeleting(false);
        }
      }
    });
  };

  const getInputClass = (isEditing) => `w-full px-4 py-3 border rounded-xl outline-none text-sm transition-all duration-300 ${
    isEditing 
      ? 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 bg-white text-slate-800 font-semibold shadow-sm' 
      : 'border-transparent bg-slate-50/50 text-slate-500 cursor-not-allowed font-semibold'
  }`;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-24 select-none">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat profil Anda...</p>
      </div>
    );
  }

  const displayName = profileData.name || (profileData.email ? profileData.email.split('@')[0] : 'Pengguna Terdaftar');
  const avatarInitials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans text-slate-800 animate-fadeIn text-left select-none relative">
      
      {error && (
        <div className="mb-6 p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl text-xs font-bold flex items-center gap-2">
          <FiAlertTriangle className="shrink-0" /> {error}
        </div>
      )}

      {/* --- BAGIAN ATAS: BANNER FOTO ABSTRAK & BADGE MEMBER SEJAK --- */}
      <div className="mb-8 shadow-sm rounded-3xl bg-white border border-slate-200/60 relative overflow-hidden">
        
        {/* Banner Gambar Premium */}
        <div className="h-44 w-full relative overflow-hidden shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" 
            alt="Banner Geometric Abstract" 
            className="w-full h-full object-cover"
          />
          {/* Overlay gradasi gelap agar pendaran lencana terlihat sangat jelas */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/75" />
          
          {/* BADGE MEMBER SEJAK - Naik ke dalam Area Banner Gambar */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-2 text-center flex flex-col justify-center shadow-lg">
             <span className="text-[9px] font-black text-blue-300 uppercase tracking-widest leading-none">Member Sejak</span>
             <span className="text-xs sm:text-sm font-extrabold text-white mt-1 leading-none">{formatDate(profileData.created_at)}</span>
          </div>
        </div>
        
        {/* Detail Foto Avatar & Profil */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 mt--14">
            
            {/* INPUT AVATAR DENGAN MODAL CROP */}
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleAvatarSelect} 
            />
            <div 
              onClick={() => fileInputRef.current.click()}
              className="absolute -top-14 left-6 md:left-8 w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl border-4 border-white flex items-center justify-center text-3xl font-black shadow-md group cursor-pointer overflow-hidden transition-all duration-300"
            >
              {profileData.avatar_url ? (
                <img src={profileData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="font-extrabold tracking-tight">{avatarInitials}</span>
              )}
              
              {/* Hover Overlay Camera */}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FiCamera size={20} />
                <span className="text-[8px] font-bold uppercase tracking-widest mt-1 text-center leading-tight">Ubah<br/>Foto</span>
              </div>
            </div>

            <div className="mt-14 md:mt-0 md:ml-32 text-left">
              <h1 className="text-2xl font-extrabold text-slate-900 mb-1 capitalize tracking-tight">{displayName}</h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-400">
                {profileData.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ========================================== */}
        {/* KOLOM KIRI: FORM PENGATURAN & PROFIL */}
        {/* ========================================== */}
        <div className="lg:w-2/3 space-y-6">
          
          {/* SECTION 1: INFORMASI PROFIL */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Informasi Diri</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Ubah data identitas profil kualifikasi Anda.</p>
              </div>
              {!editMode.profile && (
                <button 
                  onClick={() => toggleEdit('profile', true)} 
                  className="text-blue-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 bg-blue-500/5 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-colors shrink-0 cursor-pointer border border-blue-500/10"
                >
                  <FiEdit2 size={14} /> Edit
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
                <input type="text" name="name" disabled={!editMode.profile} value={profileData.name} onChange={handleChange} className={getInputClass(editMode.profile)} placeholder="Contoh: Budi Santoso" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiUser size={14} /> Jenis Kelamin</label>
                <select
                  name="gender"
                  disabled={!editMode.profile}
                  value={profileData.gender}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile) + " cursor-pointer"}
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="male">Laki-Laki</option>
                  <option value="female">Perempuan</option>
                  <option value="other">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiCalendar size={14} /> Tanggal Lahir</label>
                <input
                  type="date"
                  name="birth_date"
                  disabled={!editMode.profile}
                  value={profileData.birth_date || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiBriefcase size={14} /> Pendidikan Terakhir</label>
                <select
                  name="education_level"
                  disabled={!editMode.profile}
                  value={profileData.education_level || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile) + " cursor-pointer"}
                >
                  <option value="">Pilih Pendidikan</option>
                  <option value="SMA">SMA / SMK</option>
                  <option value="D3">Diploma 3 (D3)</option>
                  <option value="S1">Sarjana (S1)</option>
                  <option value="S2">Magister (S2)</option>
                  <option value="S3">Doktor (S3)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiBriefcase size={14} /> Pengalaman Kerja</label>
                <select
                  name="experience_level"
                  disabled={!editMode.profile}
                  value={profileData.experience_level || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile) + " cursor-pointer"}
                >
                  <option value="">Pilih Pengalaman</option>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiMapPin size={14} /> Kota</label>
                <input
                  type="text"
                  name="city"
                  disabled={!editMode.profile}
                  value={profileData.city || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile)}
                  placeholder="Contoh: Jakarta"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiMapPin size={14} /> Provinsi</label>
                <input
                  type="text"
                  name="province"
                  disabled={!editMode.profile}
                  value={profileData.province || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile)}
                  placeholder="Contoh: DKI Jakarta"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bio / Ringkasan Profil</label>
                <textarea
                  name="bio"
                  disabled={!editMode.profile}
                  value={profileData.bio || ''}
                  onChange={handleChange}
                  rows="3"
                  className={getInputClass(editMode.profile) + " resize-none"}
                  placeholder="Ceritakan singkat tentang diri Anda..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Keahlian Teknis (pisahkan dengan koma)</label>
                <input
                  type="text"
                  name="skills_overview"
                  disabled={!editMode.profile}
                  value={profileData.skills_overview || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile)}
                  placeholder="React, Node.js, Python, Figma..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ekspektasi Gaji Minimum (IDR)</label>
                <input
                  type="number"
                  name="min_salary_expect"
                  disabled={!editMode.profile}
                  value={profileData.min_salary_expect || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile)}
                  placeholder="5000000"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ekspektasi Gaji Maksimum (IDR)</label>
                <input
                  type="number"
                  name="max_salary_expect"
                  disabled={!editMode.profile}
                  value={profileData.max_salary_expect || ''}
                  onChange={handleChange}
                  className={getInputClass(editMode.profile)}
                  placeholder="15000000"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiCalendar size={14} /> Tanggal Bergabung</label>
                  <input type="text" disabled value={formatDate(profileData.created_at)} className={getInputClass(false)} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiHash size={14} /> ID Akun</label>
                  <input type="text" disabled value={profileData.id} className={`${getInputClass(false)} text-[11px] font-mono`} />
                </div>
              </div>
            </div>

            {editMode.profile && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 animate-fadeIn">
                <button 
                  onClick={() => toggleEdit('profile', false)} 
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  <FiX size={15}/> Batal
                </button>
                <button 
                  onClick={() => handleSaveSection('profile')} 
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? <FiRefreshCw className="animate-spin" size={14}/> : <FiSave size={14}/>} 
                  {saving ? 'Menyimpan...' : 'Simpan Profil'}
                </button>
              </div>
            )}
          </motion.div>

          {/* SECTION 2: KONTAK & KEAMANAN (Dengan Eye-Toggle Cek Sandi Baru & Konfirmasi Sandi) */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Kata Sandi & Akses</h2>
                <p className="text-xs text-slate-400 font-semibold mt-1">Ubah kata sandi login sistem kualifikasi Anda.</p>
              </div>
              {!editMode.contact && (
                <button 
                  onClick={() => toggleEdit('contact', true)} 
                  className="text-blue-600 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 bg-blue-500/5 px-4 py-2 rounded-xl hover:bg-blue-500/10 transition-colors shrink-0 cursor-pointer border border-blue-500/10"
                >
                  <FiEdit2 size={14} /> Edit
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5"><FiMail size={14} /> Email Terdaftar</label>
                <input type="email" name="email" disabled={true} value={profileData.email} className={getInputClass(false)} />
              </div>

              {/* Pembaruan Keamanan Sandi Wajib Sama & Dual Eye-Toggle */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5"><FiLock size={14} /> Ganti Kata Sandi</h3>
                <div className="grid md:grid-cols-2 gap-4 max-w-2xl text-left">
                  {/* Kata Sandi Baru */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Kata Sandi Baru</label>
                    <div className="relative">
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        name="newPassword"
                        disabled={!editMode.contact} 
                        value={passwords.newPassword}
                        onChange={handlePasswordChange}
                        placeholder={editMode.contact ? "Masukkan Sandi Baru" : "••••••••"} 
                        className={getInputClass(editMode.contact) + " pr-11"} 
                      />
                      {editMode.contact && (
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showNewPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Konfirmasi Kata Sandi Baru */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Konfirmasi Kata Sandi</label>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword"
                        disabled={!editMode.contact} 
                        value={passwords.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder={editMode.contact ? "Ulangi Sandi Baru" : "••••••••"} 
                        className={getInputClass(editMode.contact) + " pr-11"} 
                      />
                      {editMode.contact && (
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                          {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {editMode.contact && (
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100 animate-fadeIn">
                <button 
                  onClick={() => toggleEdit('contact', false)} 
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50"
                >
                  <FiX size={15}/> Batal
                </button>
                <button 
                  onClick={() => handleSaveSection('contact')} 
                  disabled={saving || (!passwords.newPassword && !passwords.confirmPassword)}
                  className="px-5 py-2.5 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-md transition-colors text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 flex items-center gap-1.5"
                >
                  {saving ? <FiRefreshCw className="animate-spin" size={14}/> : <FiSave size={14}/>}
                  {saving ? 'Menyimpan...' : 'Simpan Sandi'}
                </button>
              </div>
            )}
          </motion.div>

          {/* SECTION 3: NOTIFIKASI */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -2 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-sm"
          >
            <div className="mb-6 flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center border border-blue-500/10"><FiBell size={18}/></div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">Preferensi Notifikasi</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Kelola saluran informasi keluar masuk data.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-50">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Surel kecocokan pekerjaan baru</h4>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-sm font-semibold leading-relaxed">Kirim ringkasan mingguan jika terdapat lowongan baru yang setara kualifikasi.</p>
                </div>
                <ToggleSwitch active={notifState.jobMatch} onClick={() => setNotifState(p => ({...p, jobMatch: !p.jobMatch}))} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Tips berkas karir mingguan</h4>
                  <p className="text-xs text-slate-400 mt-0.5 max-w-sm font-semibold leading-relaxed">Saran asisten karir optimasi parsing resume ATS-Friendly.</p>
                </div>
                <ToggleSwitch active={notifState.tips} onClick={() => setNotifState(p => ({...p, tips: !p.tips}))} />
              </div>
            </div>
          </motion.div>

          {/* SECTION 4: DANGER ZONE */}
          <div className="bg-rose-500/5 rounded-3xl p-6 md:p-8 border border-rose-500/10 shadow-sm mt-8">
            <div className="flex items-start gap-4 text-left">
              <div className="bg-rose-500/10 p-3 rounded-2xl text-rose-600 shrink-0 border border-rose-500/10">
                <FiAlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h2 className="text-base font-extrabold text-rose-800 uppercase tracking-wider">Zona Bahaya</h2>
                <p className="text-xs sm:text-sm text-rose-600 mb-6 leading-relaxed font-semibold">
                  Tindakan penghapusan ini bersifat mutlak dan permanen. Seluruh data profil diri, riwayat pindaian resume, dan pelacakan kelayakan lowongan Anda akan dieliminasi total dari sistem server.
                </p>
                {/* MODIFIKASI: Menggunakan SweetAlert2 Konfirmasi untuk Menghapus Akun secara Menyeluruh */}
                <button 
                  onClick={triggerDeleteAccount}
                  disabled={isDeleting}
                  className="bg-white text-rose-600 font-bold px-5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <FiTrash2 size={14}/> Hapus Akun Saya
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN: WIDGET CHAMPING & STRENGTH METER */}
        {/* ========================================== */}
        <div className="lg:w-1/3 space-y-6">
          
          {/* INTERACTIVE PROFILE COMPLETENESS METER */}
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider flex items-center gap-2">
              <BsStars className="text-blue-600" /> Kekuatan Profil Anda
            </h3>
            
            {/* Perhitungan Kekuatan Kelengkapan Secara Dinamis */}
            {(() => {
              // Distribusi score untuk 10 item (10% masing-masing)
              // Email sudah terverifikasi otomatis (saat register)
              let score = 10;
              let steps = [{ label: "Email Terverifikasi", done: true }];

              if (profileData.name && profileData.name.trim().length > 0) {
                score += 10;
                steps.push({ label: "Nama Lengkap", done: true });
              } else {
                steps.push({ label: "Nama Lengkap", done: false });
              }

              if (profileData.avatar_url && profileData.avatar_url.trim().length > 0) {
                score += 10;
                steps.push({ label: "Foto Profil", done: true });
              } else {
                steps.push({ label: "Foto Profil", done: false });
              }

              if (profileData.gender && profileData.gender.trim().length > 0) {
                score += 10;
                steps.push({ label: "Jenis Kelamin", done: true });
              } else {
                steps.push({ label: "Jenis Kelamin", done: false });
              }

              if (profileData.birth_date && profileData.birth_date.trim().length > 0) {
                score += 10;
                steps.push({ label: "Tanggal Lahir", done: true });
              } else {
                steps.push({ label: "Tanggal Lahir", done: false });
              }

              if (profileData.education_level && profileData.education_level.trim().length > 0) {
                score += 10;
                steps.push({ label: "Pendidikan", done: true });
              } else {
                steps.push({ label: "Pendidikan", done: false });
              }

              if (profileData.experience_level && profileData.experience_level.trim().length > 0) {
                score += 10;
                steps.push({ label: "Pengalaman Kerja", done: true });
              } else {
                steps.push({ label: "Pengalaman Kerja", done: false });
              }

              if (profileData.city && profileData.city.trim().length > 0) {
                score += 10;
                steps.push({ label: "Lokasi (Kota)", done: true });
              } else {
                steps.push({ label: "Lokasi (Kota)", done: false });
              }

              if (profileData.bio && profileData.bio.trim().length > 0) {
                score += 10;
                steps.push({ label: "Bio / Ringkasan", done: true });
              } else {
                steps.push({ label: "Bio / Ringkasan", done: false });
              }

              if (profileData.skills_overview && profileData.skills_overview.trim().length > 0) {
                score += 10;
                steps.push({ label: "Keahlian Teknis", done: true });
              } else {
                steps.push({ label: "Keahlian Teknis", done: false });
              }

              const isFullyComplete = score === 100;

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Progress Kelengkapan</span>
                    <span className={`font-black ${isFullyComplete ? 'text-emerald-600' : 'text-blue-600'}`}>{score}%</span>
                  </div>
                  
                  {/* Progress Bar dinamis */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${isFullyComplete ? 'from-emerald-500 to-teal-400' : 'from-blue-600 to-indigo-500'}`} 
                      style={{ width: `${score}%` }} 
                    />
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {steps.map((step, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-500">
                        <FiCheckCircle className={`shrink-0 ${step.done ? 'text-emerald-500' : 'text-slate-200'}`} size={16} />
                        <span className={step.done ? 'text-slate-400 line-through decoration-slate-300 opacity-60' : 'text-slate-600'}>{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>

          {/* Analisis CV Baru Sampingan */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden border border-slate-800">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
             <BsStars size={24} className="mb-4 text-amber-300 animate-pulse relative z-10" />
             <h3 className="font-bold text-base mb-1.5 relative z-10 tracking-tight">Analisis CV Baru</h3>
             <p className="text-xs text-slate-400 mb-6 leading-relaxed relative z-10 font-semibold">
               Evaluasi ulang berkas portofolio Anda untuk posisi karir berbeda guna menemukan peluang kerja digital yang paling cocok.
             </p>
             <button onClick={() => navigate('/analisis-baru')} className="bg-white text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors relative z-10 flex items-center gap-1.5 shadow-md cursor-pointer">
               Mulai Analisis <FiArrowRight size={14} />
             </button>
          </div>
        </div>

      </div>

      {/* --- MODAL 1: CROP & SESUAIKAN FOTO (Menggunakan createPortal agar menutupi Sidebar Dasbor) --- */}
      {showCropModal && createPortal(
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center border border-slate-200/60 animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-extrabold text-slate-950 uppercase tracking-wider">Sesuaikan Foto</h3>
              <button onClick={() => setShowCropModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer p-1.5 hover:bg-slate-50 rounded-xl"><FiX size={20}/></button>
            </div>
            
            <p className="text-xs text-slate-500 mb-5 font-semibold leading-relaxed">Geser slider di bawah untuk menyesuaikan wajah Anda di dalam lingkaran.</p>

            {/* PREVIEW CONTAINER (Double Glow Ring) */}
            <div className="relative w-44 h-44 mx-auto overflow-hidden rounded-full border-4 border-white shadow-lg shadow-blue-500/10 bg-slate-50 flex items-center justify-center mb-6 ring-4 ring-blue-500/5">
              <img 
                ref={imgRef}
                src={selectedImage} 
                alt="Crop Preview" 
                className="w-full h-full object-cover origin-center"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>

            {/* ZOOM SLIDER */}
            <div className="flex items-center gap-4 mb-8 px-2">
              <FiZoomIn className="text-blue-500 shrink-0" size={18}/>
              <input 
                type="range" 
                min="1" max="3" step="0.05" 
                value={zoom} 
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>

            <div className="flex flex-col gap-2.5">
              <button 
                onClick={handleCropAndUpload}
                disabled={isUploadingAvatar}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUploadingAvatar ? <FiRefreshCw className="animate-spin" size={14}/> : <FiUploadCloud size={14}/>}
                {isUploadingAvatar ? 'Mengunggah...' : 'Terapkan & Unggah'}
              </button>
              <button 
                onClick={() => setShowCropModal(false)}
                disabled={isUploadingAvatar}
                className="w-full bg-slate-50 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50 text-xs uppercase tracking-wider border border-slate-200"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}