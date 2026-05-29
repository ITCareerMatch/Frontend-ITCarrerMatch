import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiCheckCircle, FiZap, FiShield, FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
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

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State baru untuk cek password
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Ambil query parameter ?redirect= dari URL
  const queryParams = new URLSearchParams(location.search);
  const redirectTarget = queryParams.get('redirect') || '/dashboard';

  // --- Fungsi Login Email/Password ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data || !data.session) throw new Error('Login gagal, periksa kembali email dan password Anda.');

      localStorage.setItem('access_token', data.session.access_token);
      await supabase.auth.setSession(data.session);

      // Cek apakah ada pending profile update dari register
      const pendingProfile = localStorage.getItem('pending_profile_update');
      if (pendingProfile) {
        try {
          const profileData = JSON.parse(pendingProfile);
          // Update profile ke backend dengan field yang sesuai API
          const formData = new FormData();
          formData.append('name', profileData.name || '');
          formData.append('gender', profileData.gender || '');
          formData.append('birth_date', profileData.birth_date || '');
          formData.append('education_level', profileData.education_level || '');
          formData.append('experience_level', profileData.experience_level || '');

          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/profile`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${data.session.access_token}` },
            body: formData,
          });

          if (response.ok) {
            localStorage.removeItem('pending_profile_update');
          }
        } catch (profileErr) {
          console.warn('Gagal update profile awal:', profileErr);
          // Tetap lanjut ke redirect meskipun gagal update profile
        }
      }

      navigate(redirectTarget);
    } catch (error) {
      setErrorMsg(error.message === "Invalid login credentials" ? "Email atau password salah." : error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- FUNGSI BARU: Login dengan Google ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Arahkan kembali ke target setelah login Google berhasil
          redirectTo: `${window.location.origin}${redirectTarget}`
        }
      });
      if (error) throw error;
      // Catatan: Halaman akan otomatis di-redirect oleh Google, jadi tidak perlu setLoading(false) di sini
    } catch (error) {
      setErrorMsg("Google Login gagal: " + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* --- BAGIAN KIRI: BRANDING PREMIUM (Vibrant Blue-Indigo Gradient) --- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-900 p-20 text-white flex-col justify-between relative overflow-hidden">
        
        {/* Vercel-style Dot Matrix Grid Overlay & Radial Glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />

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
            className="text-blue-100 text-base leading-relaxed mb-8 font-medium"
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
              <div className="text-[10px] text-blue-100 font-bold uppercase tracking-wider mt-1">Akurasi Analisis AI</div>
            </div>
            <div className="bg-white/10 border border-white/10 p-4 rounded-2xl">
              <div className="text-2xl font-extrabold text-amber-300">85<span className="text-sm text-blue-200">/100</span></div>
              <div className="text-[10px] text-blue-100 font-bold uppercase tracking-wider mt-1">Rata-rata Skor Awal</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-blue-200 font-bold uppercase tracking-wider">
          &copy; 2026 Capstone Team - CC26-PSU088
        </div>
      </div>

      {/* --- PANEL KANAN (FORM LOGIN) --- */}
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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Selamat Datang Kembali!</h2>
          <p className="text-slate-500 text-sm font-medium">Masuk untuk melanjutkan analisis kelayakan CV Anda.</p>
        </div>

        {/* Form Container (Clean Vercel Style Card) */}
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200/60 shadow-xl shadow-slate-200/40">
          
          {/* Tombol Google Terintegrasi */}
          <button 
            type="button" 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-2xl bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <FcGoogle size={18} />
            {loading ? "Menghubungkan..." : "MASUK DENGAN GOOGLE"}
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
                
                {/* Modifikasi Tipe Input Berdasarkan State showPassword */}
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full pl-11 pr-12 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800"
                />
                
                {/* Tombol Cek Password (Eye Icon Toggle) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:shadow-slate-900/10 cursor-pointer disabled:bg-slate-300 text-xs uppercase tracking-wider"
            >
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 font-medium mt-6">
            Belum memiliki akun?{' '}
            <Link 
              to={`/register${redirectTarget !== '/dashboard' ? `?redirect=${redirectTarget}` : ''}`} 
              className="font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
        <p className="text-center text-[10px] text-slate-400 font-semibold mt-6 uppercase tracking-wider">Dengan masuk, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi.</p>
      </div>
    </div>
  );
}