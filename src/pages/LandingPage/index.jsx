import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
// Import Ikon dari react-icons
import { 
  FiCheckCircle, FiShield, FiZap, FiFileText, FiTarget, 
  FiTrendingUp, FiClock, FiUploadCloud, FiSearch, FiBriefcase, 
  FiMessageSquare, FiActivity, FiUsers, FiMenu, FiX, FiGithub, FiMail 
} from 'react-icons/fi';
import { BsArrowRight, BsStars, BsFillChatDotsFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';

// Animasi Konfigurasi Reusable
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = !!session || !!localStorage.getItem('access_token');

  // State untuk efek mengetik hero text berputar
  const [typedHeroText, setTypedHeroText] = useState('');
  const heroPhrases = ["dalam 10 detik", "secara instan", "dengan cerdas"];

  // Daftar logo perusahaan untuk marquee
  const partnerLogos = [
    { src: "/images/dbs-logo.png", alt: "DBS", h: "h-10" },
    { src: "/images/gojek-logo.png", alt: "Gojek", h: "h-7" },
    { src: "/images/shopee-logo.png", alt: "Shopee", h: "h-8" },
    { src: "/images/dicoding-logo.png", alt: "Dicoding", h: "h-7" },
    { src: "/images/bumn-logo.png", alt: "BUMN", h: "h-6" },
    { src: "/images/google-logo.png", alt: "Google", h: "h-7" }
  ];

  // Deteksi scroll untuk memperbarui style navbar secara halus
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek Mengetik Berputar Hero
  useEffect(() => {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      const currentWord = heroPhrases[wordIdx];
      if (!isDeleting) {
        setTypedHeroText(currentWord.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentWord.length) {
          isDeleting = true;
          timer = setTimeout(type, 2000); // Jeda kata saat selesai diketik
        } else {
          timer = setTimeout(type, 110); // Kecepatan mengetik
        }
      } else {
        setTypedHeroText(currentWord.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % heroPhrases.length;
          timer = setTimeout(type, 500); // Jeda singkat sebelum mengetik kata baru
        } else {
          timer = setTimeout(type, 55); // Kecepatan menghapus
        }
      }
    };

    type();
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler scroll animasi halus ke ID target
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Offset height untuk navbar melayang (80px / 5rem)
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 overflow-x-hidden relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Dekorasi Grid Vercel & Radial Glow di Latar Belakang */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-purple-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* --- NAVBAR (Fixed dengan Transisi Style Premium) --- */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`flex justify-between items-center h-20 px-6 md:px-12 lg:px-16 fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/60 shadow-md shadow-slate-100/30' 
            : 'bg-white/40 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        {/* Logo */}
        <div 
          className="flex items-center gap-3 font-bold text-xl text-slate-900 cursor-pointer group" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6" />
          </div>
          <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
            ITCareerMatch
          </span>
        </div>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <a onClick={(e) => handleScrollTo(e, 'cara-kerja')} className="hover:text-blue-600 transition-colors cursor-pointer tracking-tight">Cara Kerja</a>
          <a onClick={(e) => handleScrollTo(e, 'fitur')} className="hover:text-blue-600 transition-colors cursor-pointer tracking-tight">Fitur AI</a>
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer tracking-tight">Daftar Lowongan</a>
          <a onClick={() => navigate('/tentang-kami')} className="hover:text-blue-600 transition-colors cursor-pointer tracking-tight">Tentang Kami</a>
        </nav>

        {/* Tombol Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Aksi Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 border border-slate-200 shadow-sm transition-all cursor-pointer hover:border-slate-300 active:scale-95"
            >
              Ke Dashboard
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors cursor-pointer mr-2"
            >
              Masuk
            </button>
          )}
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-2xl text-sm font-bold hover:opacity-95 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <BsStars /> Cek Skor CV
          </button>
        </div>
      </motion.header>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed md:hidden inset-x-0 top-20 z-40 bg-white border-b border-slate-200/60 px-8 py-6 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
          > 
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-700 items-start bg-white">
              <a onClick={(e) => handleScrollTo(e, 'cara-kerja')} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-slate-50 pb-3">Cara Kerja</a>
              <a onClick={(e) => handleScrollTo(e, 'fitur')} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-slate-50 pb-3">Fitur AI</a>
              <a onClick={() => { setMobileMenuOpen(false); navigate('/lowongan'); }} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-slate-50 pb-3">Daftar Lowongan</a>
              <a onClick={() => { setMobileMenuOpen(false); navigate('/tentang-kami'); }} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-slate-50 pb-3">Tentang Kami</a>
              <div className="flex flex-col gap-3 pt-3 w-full">
                {isLoggedIn ? (
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }} className="w-full bg-slate-50 text-slate-700 px-4 py-3 rounded-xl border border-slate-200 transition-colors font-bold">Ke Dashboard</button>
                ) : (
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 font-bold">Masuk</button>
                )}
                <button onClick={() => { setMobileMenuOpen(false); navigate('/cek-skor'); }} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl transition-all flex justify-center items-center gap-2 font-bold"><BsStars /> Cek Skor CV</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 md:px-12 lg:flex items-center justify-between gap-12 max-w-7xl mx-auto relative">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:w-1/2 mb-12 lg:mb-0 relative z-10"
        >
          {/* Badge */}
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/5 text-blue-600 rounded-full text-xs font-semibold mb-6 border border-blue-500/10"
          >
            <BsStars size={14} className="text-blue-600 animate-pulse" />
            Dipercaya oleh 10.000+ pencari kerja di Indonesia
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.08] mb-6 tracking-tight"
          >
            Cek Skor CV-mu <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block min-w-[320px]">
              {typedHeroText}
              <span className="text-blue-600 animate-pulse font-light ml-0.5">|</span>
            </span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-base sm:text-lg text-slate-600 mb-8 max-w-lg leading-relaxed font-medium"
          >
            Upload CV, masukkan target lowongan, dan biarkan AI menganalisis kecocokan Anda secara instan. Tanpa perlu login.
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <button 
              onClick={() => navigate('/cek-skor')}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/15 hover:shadow-slate-900/25 transition-all flex items-center justify-center gap-2 mb-8 cursor-pointer"
            >
              Cek Skor CV Gratis <BsArrowRight size={18} />
            </button>
          </motion.div>
          
          {/* Trust Indicators */}
          <motion.div 
            variants={fadeInUp}
            className="flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm text-slate-500 font-semibold"
          >
            <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-500" /> Gratis tanpa registrasi</span>
            <span className="flex items-center gap-2"><FiShield className="text-slate-400" /> Data aman & privat</span>
            <span className="flex items-center gap-2"><FiZap className="text-amber-500" /> Hasil instan & akurat</span>
          </motion.div>
        </motion.div>

        {/* Hero Image Right Side with premium shadow and floating widgets */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="lg:w-1/2 relative z-0"
        >
          <div className="bg-slate-50 rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] border border-slate-200/60 p-2">
             <img src="/images/hero-image.png" alt="CV and Laptop" className="w-full h-full object-cover rounded-2xl" />
          </div>
          
          {/* Floating Badge 1 (Score) */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 -left-4 bg-white/90 backdrop-blur-md p-3.5 pr-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
              <FiCheckCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-tight">Skor: 85/100</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Sangat Cocok!</p>
            </div>
          </motion.div>
          
          {/* Floating Badge 2 (AI Suggestion) */}
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute -bottom-4 right-6 bg-white/90 backdrop-blur-md p-3.5 pr-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3"
          >
            <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-600">
              <BsStars size={16} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight">AI Summary</p>
              <p className="text-xs font-bold text-slate-900 leading-tight mt-0.5">3 Saran Perbaikan</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 border-y border-slate-200/60 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-600 shrink-0"><FiFileText size={22} /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">10.842+</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">CV Dianalisis</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-600 shrink-0"><FiTarget size={22} /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">95%</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Akurasi AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-600 shrink-0"><FiTrendingUp size={22} /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">3,2x</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Lebih Banyak Interview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-600 shrink-0"><FiClock size={22} /></div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 leading-none">&lt; 10 dtk</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Waktu Analisis</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CARA KERJA (3 Langkah) --- */}
      <section id="cara-kerja" className="py-24 max-w-7xl mx-auto px-8 md:px-16 text-center relative">
        <div className="inline-block px-3.5 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Cara Kerja</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">3 Langkah Mudah</h2>
        <p className="text-slate-500 mb-16 max-w-lg mx-auto text-sm sm:text-base font-medium">Dari unggah CV hingga mendapatkan rekomendasi lowongan, semua tersaji instan.</p>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 relative"
        >
          {/* Garis penghubung desktop */}
          <div className="hidden md:block absolute top-1/2 left-20 right-20 h-[1px] bg-slate-200/80 -z-10"></div>
          
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm text-left relative z-10 transition-all cursor-pointer group hover:shadow-xl hover:border-blue-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <FiUploadCloud size={20} />
              </div>
              <span className="text-4xl font-extrabold text-slate-100 select-none group-hover:text-blue-50 transition-colors">01</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unggah CV</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Jika sudah memiliki CV, tinggal unggah file format digital Anda.</p>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><FiCheckCircle className="text-emerald-500" /> PDF & DOCX</div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm text-left relative z-10 transition-all cursor-pointer group hover:shadow-xl hover:border-indigo-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <FiTarget size={20} />
              </div>
              <span className="text-4xl font-extrabold text-slate-100 select-none group-hover:text-indigo-50 transition-colors">02</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Unggah Manual</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">Atau isi data secara manual, deskripsikan keahlian dan pengalaman kerja.</p>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><FiCheckCircle className="text-emerald-500" /> Lebih Praktis</div>
          </motion.div>

          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-slate-200/60 shadow-sm text-left relative z-10 transition-all cursor-pointer group hover:shadow-xl hover:border-purple-200"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10">
                <FiActivity size={20} />
              </div>
              <span className="text-4xl font-extrabold text-slate-100 select-none group-hover:text-purple-50 transition-colors">03</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Analisis & Skor</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">AI memindai data dan menyajikan skor kecocokan beserta tips gap keahlian.</p>
            <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><FiCheckCircle className="text-emerald-500" /> Hasil Real-Time</div>
          </motion.div>
        </motion.div>
      </section>

      {/* --- FITUR UNGGULAN --- */}
      <section id="fitur" className="py-24 bg-slate-50/50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <div className="inline-block px-3.5 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Fitur Unggulan</div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Semua yang Anda Butuhkan</h2>
          <p className="text-slate-500 mb-16 max-w-lg mx-auto text-sm sm:text-base font-medium">Teknologi AI terdepan untuk memaksimalkan peluang karir digital Anda.</p>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-120px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
          >
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mb-6"><FiSearch size={18}/></div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Analisis CV Mendalam</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Ulasan detail kecocokan kompetensi (*Skill Match* & *Gap*) serta kalimat perbaikan otomatis dari kecerdasan AI.</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Pindai Otomatis</div>
            </motion.div>
            
            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center mb-6"><FiBriefcase size={18}/></div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Rekomendasi Lowongan</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Dapatkan pencocokan instan dengan ratusan lowongan digital yang paling sesuai dengan latar belakang Anda.</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Peluang Karir Akurat</div>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center mb-6"><FiMessageSquare size={18}/></div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Chatbot AI Assistant</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Konsultasi karir 24/7. Tanyakan revisi kalimat CV, persiapan wawancara, hingga tips negosiasi gaji.</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Konsultan Pribadi</div>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mb-6"><FiTrendingUp size={18}/></div>
              <h3 className="text-base font-bold text-slate-900 mb-2">CV Score Tracking</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Pantau riwayat peningkatan kualitas resume Anda secara visual dari waktu ke waktu di dasbor akun.</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Rata-rata Naik +20 Poin</div>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 bg-cyan-500/10 text-cyan-600 rounded-xl flex items-center justify-center mb-6"><FiShield size={18}/></div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Privasi Terjamin</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Data pribadi Anda sepenuhnya aman. Dokumen dienkripsi ketat dan tidak akan pernah dibagikan ke pihak ketiga.</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Enkripsi Aman</div>
            </motion.div>

            <motion.div variants={fadeInUp} whileHover={{ y: -4 }} className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
              <div className="w-10 h-10 bg-rose-500/10 text-rose-600 rounded-xl flex items-center justify-center mb-6"><FiUsers size={18}/></div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Komunitas Karir</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">Terhubung dengan ribuan sesama rekan bertalenta untuk bertukar wawasan, informasi lowongan, dan portofolio.</p>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">10K+ Anggota Aktif</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- TESTIMONI --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="inline-block px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Testimoni</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Kata Mereka yang Sudah Berhasil</h2>
        <p className="text-slate-500 mb-16 text-sm sm:text-base font-medium">Banyak pencari kerja Indonesia yang telah terbantu menyempurnakan portofolio mereka.</p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="p-8 border border-slate-200/60 rounded-3xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-1 text-amber-400 mb-4"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">"Skor CV saya naik drastis setelah memperbaiki penulisan sesuai rekomendasi AI. Langsung dipanggil wawancara di salah satu agensi digital besar!"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">DP</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Dian Permata</p>
                <p className="text-[10px] text-slate-400 font-semibold">Product Specialist</p>
              </div>
            </div>
          </div>

          <div className="p-8 border border-slate-200/60 rounded-3xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-1 text-amber-400 mb-4"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">"Fitur analisis Gap-nya membukakan mata saya tentang apa saja kualifikasi penting yang tertinggal di berkas saya sebelumnya."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">RA</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Rizky Aditya</p>
                <p className="text-[10px] text-slate-400 font-semibold">Backend Engineer</p>
              </div>
            </div>
          </div>

          <div className="p-8 border border-slate-200/60 rounded-3xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex gap-1 text-amber-400 mb-4"><FaStar/><FaStar/><FaStar/><FaStar/><FaStar/></div>
            <p className="text-slate-600 text-sm italic mb-6 leading-relaxed">"Asisten karir bertenaga AI di sini sangat responsif. Sangat terbantu saat menyusun ringkasan profil profesional yang lebih menjual."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">SM</div>
              <div>
                <p className="text-sm font-bold text-slate-900">Sari Melati</p>
                <p className="text-[10px] text-slate-400 font-semibold">Junior UX Researcher</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TRUSTED COMPANIES (Infinite Smooth Scrolling Marquee) --- */}
      <section className="py-12 border-t border-slate-200/60 text-center bg-slate-50/30 overflow-hidden relative">
        <p className="text-[11px] text-slate-400 mb-8 uppercase tracking-widest font-bold px-6">Pengguna kami tersebar dan sukses berkarya di berbagai sektor industri</p>
        
        <div className="relative w-full overflow-hidden py-2 select-none">
          {/* Edge shadow gradients to make the fade look incredibly premium */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50/90 to-transparent z-10 pointer-events-none" />

          {/* Marquee loop element */}
          <div className="flex gap-8 w-max animate-marquee whitespace-nowrap">
            {/* Set Pertama */}
            <div className="flex gap-8 items-center shrink-0">
              {partnerLogos.map((logo, index) => (
                <div key={index} className="bg-white px-6 py-4 rounded-2xl w-44 h-16 flex items-center justify-center border border-slate-200/60 shadow-sm grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all duration-300">
                  <img src={logo.src} alt={logo.alt} className={`${logo.h} object-contain`} />
                </div>
              ))}
            </div>
            {/* Set Kedua (Duplikasi persis agar transisi seamless tanpa jeda) */}
            <div className="flex gap-8 items-center shrink-0" aria-hidden="true">
              {partnerLogos.map((logo, index) => (
                <div key={`dup-${index}`} className="bg-white px-6 py-4 rounded-2xl w-44 h-16 flex items-center justify-center border border-slate-200/60 shadow-sm grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all duration-300">
                  <img src={logo.src} alt={logo.alt} className={`${logo.h} object-contain`} />
                </div>
              ))}
            </div>
          </div>
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

      {/* --- FOOTER (Diperbarui dengan Logo Sinkron) --- */}
      <footer className="border-t border-slate-200/60 pt-16 pb-8 px-8 md:px-16 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            
            {/* Logo Footer yang Sinkron dengan Navbar */}
            <div 
              className="flex items-center gap-3 font-bold text-lg text-slate-900 mb-4 cursor-pointer group w-max" 
              onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
                <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6" />
              </div>
              <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
                ITCareerMatch
              </span>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed max-w-sm font-medium mt-3">
              Platform analisis CV berbasis AI untuk membantu pencari kerja Indonesia mendapatkan pekerjaan impian.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm">Fitur</h4>
            <ul className="space-y-3 text-xs text-slate-500 font-medium">
              <li className="hover:text-blue-600 cursor-pointer">Analisis CV</li>
              <li className="hover:text-blue-600 cursor-pointer">Rekomendasi Lowongan</li>
              <li className="hover:text-blue-600 cursor-pointer">AI Career Assistant</li>
              <li className="hover:text-blue-600 cursor-pointer">CV Builder</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm">Kontak</h4>
            <ul className="space-y-3 text-xs text-slate-500 font-medium">
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
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all z-50 cursor-pointer">
        <BsFillChatDotsFill size={22} className="animate-pulse" />
      </button>

      {/* Penambahan Keyframes CSS Marquee khusus untuk kehalusan tak terbatas */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

    </div>
  );
}