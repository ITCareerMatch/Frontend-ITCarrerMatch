import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiCheckCircle, FiZap, FiShield } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { FcGoogle } from 'react-icons/fc';
import { FaLinkedin, FaStar } from 'react-icons/fa';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Menentukan tab default berdasarkan URL saat ini (/login atau /register)
  const isLogin = location.pathname === '/login';

  // Efek untuk mengubah tab jika user menavigasi lewat URL langsung
  const toggleAuth = (status) => {
    navigate(status ? '/login' : '/register', { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex font-sans bg-white">
      
      {/* --- BAGIAN KIRI: BRANDING (Hanya tampil di Desktop) --- */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-purple-800 p-12 text-white flex-col justify-between relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="relative z-10 gap-2 flex flex-col items-start">
          <div className="flex items-center gap-2 font-bold text-2xl mb-16 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-700 shadow-lg">
              <BsStars size={24} />
            </div>
            ITCareerMatch
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-white/20">
            <BsStars className="text-yellow-300" /> Analisis AI dalam 10 detik
          </div>

          <h1 className="text-3xl font-extrabold leading-tight mb-6">
            Buka Potensi Penuh <br /> CV Anda Sekarang!
          </h1>
          <p className="text-blue-100 text-lg max-w-md leading-relaxed mb-12">
            Bergabung dengan 10,000+ pencari kerja Indonesia yang sudah mendapatkan pekerjaan impian mereka.
          </p>

          <div className="grid gap-2 mb-10">
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
          &copy; 2026 Capstone Project - Coding Camp DBS Foundation
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORMULIR AUTENTIKASI --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 relative">
        
        {/* Tombol Kembali (Mobile Only) */}
        <button 
          onClick={() => navigate('/')} 
          className="lg:hidden absolute top-8 left-8 text-gray-500 hover:text-gray-900 font-medium text-sm flex items-center gap-2"
        >
          &larr; Kembali
        </button>

        <div className="w-full max-w-md">
          {/* Header Form */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Selamat Datang Kembali!' : 'Daftar Akun Baru'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isLogin 
                ? 'Masuk untuk melanjutkan analisis CV Anda.' 
                : 'Buat akun gratis untuk membuka hasil analisis lengkap.'}
            </p>
          </div>

          {/* Toggle Tabs (Login / Register) */}
          <div className="flex bg-gray-50 p-1 rounded-xl mb-8 border border-gray-200">
            <button 
              onClick={() => toggleAuth(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Masuk
            </button>
            <button 
              onClick={() => toggleAuth(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Daftar
            </button>
          </div>

          {/* Form Utama */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiMail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  placeholder="nama@email.com" 
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FiLock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  placeholder="Minimal 8 karakter" 
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Input Tambahan Khusus Register */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Ulangi Kata Sandi</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FiLock size={18} />
                  </div>
                  <input 
                    type="password" 
                    required
                    placeholder="Masukkan ulang kata sandi" 
                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Opsi Tambahan Bawah Form */}
            <div className="flex items-center justify-between mt-2">
              {!isLogin ? (
                <label className="flex items-start gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" required className="peer appearance-none w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 cursor-pointer transition-colors" />
                    <FiCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs text-gray-500 leading-tight">
                    Saya setuju dengan <a href="#" className="text-blue-600 hover:underline">Syarat</a> & <a href="#" className="text-blue-600 hover:underline">Ketentuan</a>
                  </span>
                </label>
              ) : (
                <>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input type="checkbox" className="peer appearance-none w-5 h-5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 checked:bg-blue-600 checked:border-blue-600 cursor-pointer transition-colors" />
                      <FiCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Ingat saya</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">Lupa kata sandi?</a>
                </>
              )}
            </div>

            {/* Tombol Utama */}
            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 mt-4"
            >
              {isLogin ? 'Masuk' : 'Daftar Sekarang'}
            </button>
          </form>

          {/* Garis Pemisah (Divider) */}
          <div className="flex items-center gap-4 my-8">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Atau lanjutkan dengan</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm">
              <FcGoogle size={20} /> Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm">
              <FaLinkedin size={20} className="text-[#0A66C2]" /> LinkedIn
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}