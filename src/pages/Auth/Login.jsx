import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiCheckCircle, FiZap, FiShield } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { FaStar } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data || !data.session) throw new Error('Login gagal, sesi tidak ditemukan.');

      // Simpan access token setelah login berhasil
      localStorage.setItem('access_token', data.session.access_token);
      console.log("Login berhasil, token disimpan.");
      
      navigate('/dashboard');
    } catch (error) {
      alert("Gagal login: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex font-sans bg-white overflow-hidden">
      
      {/* --- BAGIAN KIRI: BRANDING (Hanya tampil di Desktop) --- */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-purple-800 p-25 text-white flex-col justify-center relative overflow-hidden">
            {/* Dekorasi Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

            <div className="relative z-10 gap-2 flex flex-col items-start">
            <div className="flex items-center gap-2 font-bold text-2xl mb-5 cursor-pointer" onClick={() => navigate('/')}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-700 shadow-lg">
                <BsStars size={24} />
                </div>
                ITCareerMatch
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold mb-5 border border-white/20">
                <BsStars className="text-yellow-300" /> Analisis AI dalam 10 detik
            </div>

            <h1 className="text-3xl font-extrabold leading-tight mb-5">
                Buka Potensi Penuh <br /> CV Anda Sekarang!
            </h1>
            <p className="text-blue-100 text-lg max-w-md leading-relaxed mb-5">
                Bergabung dengan 10,000+ pencari kerja Indonesia yang sudah mendapatkan pekerjaan impian mereka.
            </p>

            <div className="grid gap-2 mb-5">
                <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-blue-300">
                    <FiCheckCircle size={20} color='white'/>
                </div>
                <span className="text-blue-100 text-lg leading-relaxed">Analisis CV mendalam dengan AI</span>
                </div>
                <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-yellow-300">
                    <FaStar size={20} color='white'/>
                </div>
                <span className="text-blue-100 text-lg leading-relaxed">Skor kecocokan instan untuk setiap lowongan</span>
                </div>
                <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-green-300">
                    <FiZap size={20} color='white'/>
                </div>
                <span className="text-blue-100 text-lg leading-relaxed">Saran perbaikan kalimat agar lebih profesional</span>
                </div>
                <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-purple-500">
                    <FiShield size={20} color='white'/>
                </div>
                <span className="text-blue-100 text-lg leading-relaxed">Data aman & privasi terlindungi</span>
                </div>
            </div>

            {/* Kartu Statistik */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <div className="text-3xl font-bold text-white mb-1">94%</div>
                <div className="text-sm text-blue-200 font-medium">Akurasi AI</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl">
                <div className="text-3xl font-bold text-green-300 mb-1">85<span className="text-lg text-blue-200">/100</span></div>
                <div className="text-sm text-blue-200 font-medium">Rata-rata Skor Awal</div>
                </div>
            </div>
            </div>

            <div className="relative z-10 text-sm text-blue-200 font-medium mt-12">
            &copy; 2026 Capstone Team - CC26-PSU088
            </div>
        </div>

      {/* --- PANEL KANAN (REVISI LOGIN) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50 flex-col">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang Kembali!</h2>
            <p className="text-slate-500">Masuk untuk melanjutkan analisis CV Anda.</p>
          </div>

        <div className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/60">
          <button type="button" className="w-full flex items-center justify-center gap-3 py-4 mb-6 border border-slate-200 rounded-2xl bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer">
            <FcGoogle size={20} />
            Masuk dengan Google
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-xs text-slate-400 uppercase tracking-[0.2em]">atau dengan email</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiMail size={18} />
                </div>
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <FiLock size={18} />
                </div>
                <input
                  type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-slate-50 focus:bg-white transition-all"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 cursor-pointer">
              Masuk →
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8">
            Belum punya akun? <button type="button" onClick={() => navigate('/register')} className="font-semibold text-blue-600 hover:underline cursor-pointer">Daftar</button>
          </p>
        </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            Dengan mendaftar, Anda menyetujui <a href="#" className="text-blue-600 hover:underline cursor-pointer">Ketentuan Layanan</a> dan <a href="#" className="text-blue-600 hover:underline cursor-pointer">Kebijakan Privasi</a> kami.
          </p>
      </div>
    </div>
  );
}