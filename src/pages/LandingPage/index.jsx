import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
// Import Ikon dari react-icons
import { FiCheckCircle, FiShield, FiZap, FiFileText, FiTarget, FiTrendingUp, FiClock, FiUploadCloud, FiSearch, FiBriefcase, FiMessageSquare, FiActivity, FiUsers, FiMenu, FiX, FiGithub, FiMail } from 'react-icons/fi';
import { BsArrowRight, BsStars, BsFillChatDotsFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

export default function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!session || !!localStorage.getItem('access_token');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-16 border-b border-gray-100 bg-white sticky top-0 z-50">
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-15 h-15 object-contain" />
          </div>
          ITCareerMatch
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a href="#cara-kerja" className="hover:text-blue-600 transition-colors cursor-pointer">Cara Kerja</a>
          <a href="#fitur" className="hover:text-blue-600 transition-colors cursor-pointer">Fitur AI</a>
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer">Daftar Lowongan</a>
          <a onClick={() => navigate('/tentang-kami')} className="hover:text-blue-600 transition-colors cursor-pointer">Tentang Kami</a>
        </nav>

        {/* Tombol Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Aksi Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors cursor-pointer"
            >
              Ke Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="hover:text-blue-600 text-sm font-bold transition-colors cursor-pointer mr-2">
              Masuk
            </button>
          )}
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors cursor-pointer flex items-center gap-2"
          >
            <BsStars /> Cek Skor CV
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {mobileMenuOpen && (
        <div className="fixed md:hidden inset-x-0 top-[73px] z-40 bg-white border-b border-gray-100 px-8 py-6 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"> 
          <div className="flex flex-col gap-5 text-sm font-bold text-gray-700 items-start bg-white">
            <a href="#cara-kerja" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Cara Kerja</a>
            <a href="#fitur" onClick={() => setMobileMenuOpen(false)} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Fitur AI</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate('/lowongan'); }} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Daftar Lowongan</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate('/tentang-kami'); }} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Tentang Kami</a>
            <div className="flex flex-col gap-3 pt-2 w-full">
              {isLoggedIn ? (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }} className="w-full bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-200 transition-colors">Ke Dashboard</button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 bg-gray-50">Masuk</button>
              )}
              <button onClick={() => { setMobileMenuOpen(false); navigate('/cek-skor'); }} className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"><BsStars /> Cek Skor CV</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO SECTION --- */}
      <section className="pt-16 pb-12 px-8 md:px-16 lg:flex items-center justify-between gap-12 max-w-7xl mx-auto">
        <div className="lg:w-1/2 mb-10 lg:mb-0 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-6 border border-blue-100">
            <BsStars size={16} />
            Dipercaya oleh 10.000+ pencari kerja di Indonesia
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Cek Skor CV-mu <br /> dalam <span className="text-blue-600">10 Detik</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
            Upload CV, masukkan target lowongan, dan biarkan AI menganalisis kecocokan Anda secara instan. Tanpa perlu login.
          </p>
          
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 mb-8 cursor-pointer"
          >
            Cek Skor CV Gratis <BsArrowRight size={20} />
          </button>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-2"><FiCheckCircle className="text-green-500" /> Gratis tanpa registrasi</span>
            <span className="flex items-center gap-2"><FiShield className="text-gray-400" /> Data aman & privat</span>
            <span className="flex items-center gap-2"><FiZap className="text-yellow-500" /> Hasil instan 10 detik</span>
          </div>
        </div>

        {/* Hero Image Right Side */}
        <div className="lg:w-1/2 relative z-0">
          <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/2,7] border border-gray-200">
             <img src="/images/hero-image.png" alt="CV and Laptop" className="w-full h-full object-cover" />
          </div>
          
          {/* Floating Badge 1 (Score) */}
          <div className="absolute top-10 -left-6 bg-white p-3 pr-6 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
            <div className="bg-green-100 p-2.5 rounded-full text-green-600">
              <FiCheckCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Skor: 85/100</p>
              <p className="text-[10px] text-green-600 font-semibold">Sangat Cocok!</p>
            </div>
          </div>
          
          {/* Floating Badge 2 (AI Suggestion) */}
          <div className="absolute top-4 -right-4 bg-white p-3 pr-5 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3">
            <div className="bg-purple-100 p-2.5 rounded-full text-purple-600">
              <BsStars size={18} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-medium leading-tight">AI Summary</p>
              <p className="text-sm font-bold text-gray-900 leading-tight">3 Saran Ditemukan</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/30">
        <div className="max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-full text-blue-600"><FiFileText size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">10,842+</h3>
              <p className="text-xs text-gray-500">CV Dianalisis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-full text-green-600"><FiTarget size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-xs text-gray-500">Akurasi AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-full text-purple-600"><FiTrendingUp size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">3.2x</h3>
              <p className="text-xs text-gray-500">Lebih Banyak Interview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-yellow-50 p-3 rounded-full text-yellow-600"><FiClock size={24} /></div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">&lt; 10 dtk</h3>
              <p className="text-xs text-gray-500">Waktu Analisis</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CARA KERJA (3 Langkah) --- */}
      <section id="cara-kerja" className="py-24 max-w-7xl mx-auto px-8 md:px-16 text-center">
        <div className="inline-block px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Cara Kerja</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">3 Langkah Mudah</h2>
        <p className="text-gray-500 mb-16 max-w-lg mx-auto text-sm">Dari upload CV hingga dapat rekomendasi lowongan, semua hanya dalam hitungan menit.</p>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Garis background Desktop */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-[1px] bg-gray-200 -z-10"></div>
          
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left relative z-10 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                <FiUploadCloud size={24} />
              </div>
              <span className="text-4xl font-extrabold text-gray-100">01</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload CV</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Membantu anda jika sudah memiliki CV, Tinggal upload file CV anda.</p>
            <div className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded"><FiCheckCircle/> Mendukung PDF & DOCX</div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left relative z-10 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                <FiTarget size={24} />
              </div>
              <span className="text-4xl font-extrabold text-gray-100">02</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Upload CV Manual</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">Isi data secara manual, deskripsikan Keahlian dan Pengalaman Anda.</p>
            <div className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded"><FiCheckCircle/> Lebih Simple | Tanpa Harus Upload CV</div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-left relative z-10 hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-orange-400 text-white rounded-xl flex items-center justify-center shadow-lg shadow-orange-200">
                <FiActivity size={24} />
              </div>
              <span className="text-4xl font-extrabold text-gray-100">03</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Lihat Skor & Analisis</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">AI memindai CV dalam hitungan detik. Lihat skor kecocokan, skill gap, dan saran perbaikan.</p>
            <div className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded"><FiCheckCircle/> Hasil data real-time</div>
          </div>
        </div>
      </section>

      {/* --- FITUR UNGGULAN --- */}
      <section id="fitur" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-8 md:px-16 text-center">
          <div className="inline-block px-4 py-1.5 bg-purple-50 text-purple-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Fitur Unggulan</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Semua yang Anda Butuhkan</h2>
          <p className="text-gray-500 mb-16 max-w-lg mx-auto text-sm">Teknologi AI terdepan untuk memaksimalkan peluang karir Anda.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6"><FiSearch size={20}/></div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Analisis CV Mendalam</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Skill Match, Skill Gap, dan saran perbaikan kalimat berbasis AI agar CV lebih profesional dan relevan.</p>
              <div className="text-[10px] text-gray-400">Lebih detail dari ulasan manual</div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6"><FiBriefcase size={20}/></div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Rekomendasi Lowongan</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Temukan lowongan yang paling cocok dengan profil Anda, lengkap dengan skor kecocokan real-time.</p>
              <div className="text-[10px] text-gray-400">500+ lowongan tersedia</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center mb-6"><FiMessageSquare size={20}/></div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Chatbot AI Assistant</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Tanya apa saja — dari revisi kalimat profesional hingga tips wawancara. Tersedia kapan saja.</p>
              <div className="text-[10px] text-gray-400">Respons instan 24/7</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6"><FiTrendingUp size={20}/></div>
              <h3 className="text-base font-bold text-gray-900 mb-2">CV Score Tracking</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Pantau peningkatan skor CV Anda setiap kali melakukan perbaikan. Lihat progresnya secara visual.</p>
              <div className="text-[10px] text-gray-400">Rata-rata +20 poin peningkatan</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mb-6"><FiShield size={20}/></div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Privasi Terjamin</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Data CV Anda dienkripsi dan tidak pernah dibagikan ke pihak ketiga. Aman dan terlindungi.</p>
              <div className="text-[10px] text-gray-400">Enkripsi end-to-end</div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer">
              <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center mb-6"><FiUsers size={20}/></div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Komunitas Karir</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">Bergabung dengan ribuan pencari kerja Indonesia. Berbagi tips, pengalaman, dan dukungan bersama.</p>
              <div className="text-[10px] text-gray-400">10.000+ anggota aktif</div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONI --- */}
      <section className="py-24 max-w-7xl mx-auto px-8 md:px-16 text-center">
         <div className="inline-block px-4 py-1.5 bg-yellow-50 text-yellow-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Testimoni</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Kata Mereka yang Sudah Berhasil</h2>
        <p className="text-gray-500 mb-16 text-sm">Ribuan pencari kerja Indonesia sudah merasakan manfaatnya.</p>

        <div className="grid md:grid-cols-3 gap-6 text-left ">
          <div className="p-8 border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex gap-1 text-yellow-400 mb-4"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <p className="text-gray-600 text-sm italic mb-6">"Skor CV saya naik dari 62 ke 91 setelah menerapkan semua saran AI. Langsung dapat interview di 3 perusahaan!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">DP</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Dian Permata</p>
                <p className="text-xs text-gray-500">Product Manager, Shopee</p>
              </div>
            </div>
          </div>

          <div className="p-8 border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex gap-1 text-yellow-400 mb-4"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <p className="text-gray-600 text-sm italic mb-6">"Fitur Skill Gap sangat membantu. Saya jadi tahu persis skill apa yang perlu dipelajari untuk posisi impian."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">RA</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Rizky Aditya</p>
                <p className="text-xs text-gray-500">Backend Engineer, Google</p>
              </div>
            </div>
          </div>

          <div className="p-8 border border-gray-100 rounded-2xl shadow-sm bg-white hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex gap-1 text-yellow-400 mb-4"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <p className="text-gray-600 text-sm italic mb-6">"Chatbot AI-nya seperti punya career coach pribadi. Dia bantu saya rewrite semua bullet points jadi lebih powerful."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">SM</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Sari Melati</p>
                <p className="text-xs text-gray-500">UI/UX Designer, BUMN</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED COMPANIES --- */}
      <section className="py-10 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 mb-6 uppercase tracking-wider font-semibold px-8 md:px-16">Pengguna kami telah berhasil diterima di perusahaan-perusahaan ternama</p>
        <div className="flex flex-wrap justify-center gap-5 md:gap-5 px-8 md:px-16">
          <div className="border-t bg-gray-100 p-1 rounded-[15px] w-50 h-25 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"><img src="/images/dbs-logo.png" alt="DBS" className="h-10" /></div>
          <div className="border-t bg-gray-100 p-1 rounded-[15px] w-50 h-25 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"><img src="/images/gojek-logo.png" alt="Gojek" className="h-10" /></div>
          <div className="border-t bg-gray-100 p-1 rounded-[15px] w-50 h-25 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"><img src="/images/shopee-logo.png" alt="Shopee" className="h-13" /></div>
          <div className="border-t bg-gray-100 p-1 rounded-[15px] w-50 h-25 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"><img src="/images/dicoding-logo.png" alt="Dicoding" className="h-9" /></div>
          <div className="border-t bg-gray-100 p-1 rounded-[15px] w-50 h-25 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"><img src="/images/bumn-logo.png" alt="BUMN" className="h-8" /></div>
          <div className="border-t bg-gray-100 p-1 rounded-[15px] w-50 h-25 flex items-center justify-center hover:shadow-lg transition-shadow cursor-pointer"><img src="/images/google-logo.png" alt="Google" className="h-10" /></div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-16 px-8 md:px-16 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-semibold mb-6 backdrop-blur-sm">
            <FiZap /> Mulai perjalanan karir Anda sekarang
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Siap Meningkatkan Peluang Kerja Anda?</h2>
          <p className="text-blue-100 mb-10 max-w-2xl mx-auto relative z-10 text-sm md:text-base">
            Upload CV sekarang dan lihat seberapa cocok Anda dengan lowongan impian. Gratis, tanpa registrasi.
          </p>
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-white text-blue-700 px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-blue-50 hover:shadow-lg transition-colors shadow-lg relative z-10 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            Cek Skor CV Sekarang <BsArrowRight />
          </button>
          
          <div className="flex justify-center gap-6 mt-8 text-xs text-blue-200 relative z-10">
            <span className="flex items-center gap-1"><FiCheckCircle/> 100% Gratis</span>
            <span className="flex items-center gap-1"><FiShield/> Privasi Aman</span>
            <span className="flex items-center gap-1"><FiZap/> Hasil Instan</span>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-gray-100 pt-16 pb-8 px-8 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-gray-900 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <FiFileText size={18} />
              </div>
              ITCareerMatch
            </div>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
              Platform analisis CV berbasis AI untuk membantu pencari kerja Indonesia mendapatkan pekerjaan impian.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Fitur</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <li className="hover:text-blue-600 cursor-pointer">Analisis CV</li>
              <li className="hover:text-blue-600 cursor-pointer">Rekomendasi Lowongan</li>
              <li className="hover:text-blue-600 cursor-pointer">AI Career Assistant</li>
              <li className="hover:text-blue-600 cursor-pointer">CV Builder</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm">Kontak</h4>
            <ul className="space-y-3 text-xs text-gray-500 font-medium">
              <div>
                <a href="https://github.com/ITCareerMatch" className="ml-4 hover:text-blue-600 transition-colors"><FiGithub size={16} className="inline-block mr-1" />ITCareerMatch</a>
              </div>
              <div>
                <a href="mailto:cc26-psu088@example.com" className="ml-4 hover:text-blue-600 transition-colors"><FiMail size={16} className="inline-block mr-1" />CC26-PSU088</a>
              </div>
            </ul>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 border-t border-gray-100 pt-8 font-medium">
          &copy; 2026 ITCareerMatch. Capstone Team - CC26-PSU088.
        </div>
      </footer>

      {/* --- FLOATING CHATBOT BUTTON --- */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-colors z-50">
        <BsFillChatDotsFill size={24} />
      </button>

    </div>
  );
}