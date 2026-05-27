import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCheckCircle, FiZap, FiShield, FiUser, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

// Konfigurasi animasi seragam
const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // State baru untuk konfirmasi sandi
  const [showPassword, setShowPassword] = useState(false); // State baru untuk cek sandi utama
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State baru untuk cek konfirmasi sandi
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get('redirect') || '/dashboard';

  // --- Fungsi Register Manual (Email/Password) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Validasi kesamaan password & konfirmasi password (WAJIB SAMA)
    if (password !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok dengan kata sandi utama.');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name, gender: gender }
        }
      });

      if (error) throw error;
      if (!data) throw new Error('Respons Supabase tidak valid.');

      // PENCEGAHAN AUTO-LOGIN: Bersihkan seluruh session lokal bawaan Supabase
      await supabase.auth.signOut();
      localStorage.removeItem('access_token');

      // Tampilkan SweetAlert2 secara wajib untuk semua pendaftaran sukses
      await Swal.fire({
        icon: 'success',
        title: 'Registrasi Berhasil',
        text: 'Akun Anda berhasil didaftarkan! Silakan masuk menggunakan email dan kata sandi baru Anda.',
        confirmButtonColor: '#3b82f6', // Matching dengan skema biru form
        background: '#ffffff',
        customClass: {
          popup: 'rounded-3xl border border-slate-200/60 shadow-xl font-sans',
          title: 'text-slate-900 font-extrabold text-lg tracking-tight',
          htmlContainer: 'text-slate-500 font-semibold text-xs leading-relaxed',
          confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider'
        }
      });

      // Alihkan secara aman ke halaman Login setelah tombol konfirmasi diklik
      navigate(`/login${redirectTarget !== '/dashboard' ? `?redirect=${redirectTarget}` : ''}`);

    } catch (error) {
      setErrorMsg("Gagal registrasi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI BARU: Daftar / Masuk dengan Google ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Arahkan kembali ke target setelah Google auth berhasil
          redirectTo: `${window.location.origin}${redirectTarget}`
        }
      });
      if (error) throw error;
    } catch (error) {
      setErrorMsg("Pendaftaran Google gagal: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* --- BAGIAN KIRI: BRANDING PREMIUM (Vibrant Purple-Indigo Gradient) --- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-800 via-indigo-700 to-slate-950 p-20 text-white flex-col justify-between relative overflow-hidden">
        
        {/* Vercel-style Dot Matrix Grid Overlay & Radial Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />

        {/* Logo Top */}
        <div className="relative z-10">
          <div 
            className="flex items-center gap-3 font-bold text-xl text-white cursor-pointer group w-max" 
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-white/20 opacity-20 blur-md group-hover:opacity-45 transition-opacity duration-300" />
              <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-10 h-10 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6 bg-white p-0.5" />
            </div>
            <span className="font-extrabold tracking-tight">
              ITCareerMatch
            </span>
          </div>
        </div>

        {/* Content Center (Staggered Entry via Framer Motion) */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-lg"
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 text-white rounded-full text-xs font-bold mb-6 border border-white/20"
          >
            <BsStars className="text-amber-300" /> Analisis AI dalam 10 detik
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            className="text-4xl font-extrabold leading-[1.12] mb-4 tracking-tight"
          >
            Buka Potensi Penuh <br />
            CV Anda Sekarang!
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-purple-100 text-base leading-relaxed mb-8 font-medium"
          >
            Bergabung dengan 10.000+ pencari kerja Indonesia yang sudah meningkatkan peluang mereka di mata rekruter.
          </motion.p>

          <motion.div variants={fadeInUp} className="space-y-4 mb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-white"><FiCheckCircle size={16} /></div>
              <span className="text-white text-sm font-semibold">Analisis CV mendalam dengan AI</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-amber-300"><FaStar size={14} /></div>
              <span className="text-white text-sm font-semibold">Skor kecocokan instan untuk setiap lowongan</span>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-emerald-300"><FiZap size={16} /></div>
              <span className="text-white text-sm font-semibold">Saran perbaikan kalimat agar lebih profesional</span>
            </div>
          </motion.div>

          {/* Mini Stats Card */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-white">94%</div>
              <div className="text-[10px] text-purple-100 font-bold uppercase tracking-wider mt-1">Akurasi Analisis AI</div>
            </div>
            <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-amber-300">85<span className="text-sm text-purple-200">/100</span></div>
              <div className="text-[10px] text-purple-100 font-bold uppercase tracking-wider mt-1">Rata-rata Skor Awal</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-purple-200 font-bold uppercase tracking-wider">
          &copy; 2026 Capstone Team - CC26-PSU088
        </div>
      </div>

      {/* --- PANEL KANAN (FORM DAFTAR) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-slate-50/50 flex-col overflow-y-auto relative z-20">
        
        {/* Tombol kembali */}
        <div className="w-full max-w-md mb-8">
          <button 
            type="button" 
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider group cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <FiArrowLeft size={16} className="transition-transform duration-300 group-hover:-translate-x-1" /> Kembali ke Beranda
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Buat Akun Gratis</h1>
          <p className="text-slate-500 text-sm font-medium">Buka evaluasi kelayakan portofolio CV Anda dalam 30 detik.</p>
        </div>

        {/* Form Container (Clean Vercel Style Card) */}
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40 text-left">
          
          {/* Tombol Google Terintegrasi */}
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-2xl bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <FcGoogle size={18} />
            {loading ? "Menghubungkan..." : "DAFTAR DENGAN GOOGLE"}
          </button>

          <div className="flex items-center gap-3.5 my-6">
            <div className="h-px bg-slate-100 flex-1" />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">atau email</span>
            <div className="h-px bg-slate-100 flex-1" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 text-rose-600 text-xs font-bold rounded-xl border border-rose-100 animate-fadeIn flex items-center gap-2">
                <FiShield size={14} /> {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><FiUser size={16} /></div>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Budi Santoso" 
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Email Akun</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><FiMail size={16} /></div>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="nama@email.com" 
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><FiLock size={16} /></div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Min. 8 Karakter" 
                  className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Kolom Baru: Konfirmasi Kata Sandi (WAJIB SAMA) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><FiLock size={16} /></div>
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Ulangi Kata Sandi" 
                  className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Jenis Kelamin</label>
              <select 
                required 
                value={gender} 
                onChange={(e) => setGender(e.target.value)} 
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-4 pr-10 text-xs font-bold text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all cursor-pointer"
              >
                <option disabled value="">Pilih Gender</option>
                <option value="male">Laki-Laki</option>
                <option value="female">Perempuan</option>
                <option value="other">Lainnya</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:shadow-slate-900/10 cursor-pointer disabled:bg-slate-300 text-xs uppercase tracking-wider"
            >
              {loading ? "Memproses..." : "Buat Akun Gratis"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            Sudah memiliki akun?{' '}
            <Link 
              to={`/login${redirectTarget !== '/dashboard' ? `?redirect=${redirectTarget}` : ''}`} 
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Masuk
            </Link>
          </p>
        </div>
        <p className="text-center text-[10px] text-slate-400 font-semibold mt-6 uppercase tracking-wider">Dengan mendaftar, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi.</p>
      </div>
    </div>
  );
}