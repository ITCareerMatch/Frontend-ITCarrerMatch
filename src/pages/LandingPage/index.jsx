import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiShield, FiZap, FiFileText, FiTarget,
  FiTrendingUp, FiClock, FiUploadCloud, FiSearch, FiBriefcase,
  FiMessageSquare, FiActivity, FiUsers, FiGithub,
  FiArrowRight, FiInfo
} from 'react-icons/fi';
import { BsArrowRight, BsStars, BsFillChatDotsFill } from 'react-icons/bs';
import { FaStar } from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

// Animation configs
const fadeInUp = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();

  // State untuk efek mengetik hero text berputar
  const [typedHeroText, setTypedHeroText] = useState('');
  const heroPhrases = ["dalam 10 detik", "secara instan", "dengan cerdas"];

  // State untuk koordinat 3D Mouse Tilt pada Gambar Hero
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Daftar logo perusahaan untuk marquee
  const partnerLogos = [
    { src: "/images/dbs-logo.png", alt: "DBS", h: "h-10" },
    { src: "/images/gojek-logo.png", alt: "Gojek", h: "h-7" },
    { src: "/images/shopee-logo.png", alt: "Shopee", h: "h-8" },
    { src: "/images/dicoding-logo.png", alt: "Dicoding", h: "h-7" },
    { src: "/images/bumn-logo.png", alt: "BUMN", h: "h-6" },
    { src: "/images/google-logo.png", alt: "Google", h: "h-7" }
  ];

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

  // Handler 3D Mouse Tilt
  const handleMouseMove = (e) => {
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left - card.width / 2;
    const y = e.clientY - card.top - card.height / 2;
    setRotateX(-y / (card.height / 24));
    setRotateY(x / (card.width / 24));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 overflow-x-hidden relative selection:bg-blue-500/10 selection:text-blue-600">

      {/* Dekorasi Grid Vercel & Radial Glow di Latar Belakang */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent -z-10 pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute top-[800px] right-0 w-[400px] h-[400px] bg-purple-100/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* NAVBAR - Using reusable component */}
      <Navbar variant="transparent" />

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
        <div className="lg:w-1/2 relative z-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
          
          {/* 3D Tilt Wrapper Container */}
          <motion.div 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl border border-slate-200/50 p-2 bg-white/40 backdrop-blur-xl shrink-0"
            style={{ transformStyle: "preserve-3d", perspective: 1000 }}
          >
             <motion.img 
               src="/images/hero-image.png" 
               alt="CV and Laptop" 
               className="w-full h-full object-cover rounded-[1.75rem]" 
               style={{ transform: "translateZ(30px)" }}
             />
          </motion.div>
          
          {/* Floating Badge 1 (Organic Path Animation) */}
          <motion.div 
            animate={{ 
              y: [0, -12, 4, -8, 0],
              x: [0, 6, -4, 5, 0],
              rotate: [0, 2, -1, 1, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-12 -left-4 bg-white/90 backdrop-blur-md p-3.5 pr-6 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-10"
          >
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-600">
              <FiCheckCircle size={18} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 leading-none">Skor: 85/100</p>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Sangat Cocok!</p>
            </div>
          </motion.div>
          
          {/* Floating Badge 2 (Organic Path Animation) */}
          <motion.div 
            animate={{ 
              y: [0, 10, -6, 8, 0],
              x: [0, -5, 4, -6, 0],
              rotate: [0, -2, 1, -1, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute -bottom-4 right-6 bg-white/90 backdrop-blur-md p-3.5 pr-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 z-10"
          >
            <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-600">
              <BsStars size={16} className="animate-spin-slow" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold leading-tight">AI Summary</p>
              <p className="text-xs font-bold text-slate-900 leading-tight mt-0.5">3 Saran Perbaikan</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 border-y border-slate-200/60 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <FiFileText size={22} />, val: "10.842+", label: "CV Dianalisis", color: "text-blue-600 bg-blue-500/10" },
            { icon: <FiTarget size={22} />, val: "95%", label: "Akurasi AI", color: "text-emerald-600 bg-emerald-500/10" },
            { icon: <FiTrendingUp size={22} />, val: "3,2x", label: "Lebih Banyak Interview", color: "text-purple-600 bg-purple-500/10" },
            { icon: <FiClock size={22} />, val: "< 10 dtk", label: "Waktu Analisis", color: "text-amber-600 bg-amber-500/10" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white/80 backdrop-blur-md border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4 text-left"
            >
              <div className={`p-3 rounded-2xl ${stat.color} shrink-0`}>{stat.icon}</div>
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 leading-none tracking-tight">{stat.val}</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- CARA KERJA (Mewah dengan Efek Glowing Border) --- */}
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
          
          {[
            { icon: <FiUploadCloud size={20} />, step: "01", title: "Unggah CV", desc: "Jika sudah memiliki CV, tinggal unggah file format digital Anda.", badge: "PDF & DOCX", glowClass: "glow-card-blue" },
            { icon: <FiTarget size={20} />, step: "02", title: "Unggah Manual", desc: "Atau isi data secara manual, deskripsikan keahlian dan pengalaman kerja.", badge: "Lebih Praktis", glowClass: "glow-card-indigo" },
            { icon: <FiActivity size={20} />, step: "03", title: "Analisis & Skor", desc: "AI memindai data dan menyajikan skor kecocokan beserta tips gap keahlian.", badge: "Hasil Real-Time", glowClass: "glow-card-purple" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 shadow-sm text-left relative z-10 transition-all duration-300 group cursor-pointer hover-shine-effect ${item.glowClass}`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-105 transition-all duration-300">
                  {item.icon}
                </div>
                <span className="text-4xl font-black bg-gradient-to-br from-slate-400 to-slate-500 bg-clip-text text-transparent opacity-30 select-none group-hover:opacity-100 transition-all duration-300">
                  {item.step}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-200">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{item.desc}</p>
              <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wide bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100"><FiCheckCircle className="text-emerald-500" /> {item.badge}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- FITUR UNGGULAN (Mewah dengan Efek Glowing Border) --- */}
      <section id="fitur" className="py-24 bg-slate-50/50 border-y border-slate-200/60">
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
            {[
              { icon: <FiSearch size={18} />, title: "Analisis CV Mendalam", desc: "Ulasan detail kecocokan kompetensi (*Skill Match* & *Gap*) serta kalimat perbaikan otomatis dari kecerdasan AI.", label: "Pindai Otomatis", color: "from-blue-500/10 text-blue-600 border-blue-500/10", glowClass: "glow-card-blue" },
              { icon: <FiBriefcase size={18} />, title: "Rekomendasi Lowongan", desc: "Dapatkan pencocokan instan dengan ratusan lowongan digital yang paling sesuai dengan latar belakang Anda.", label: "Peluang Karir Akurat", color: "from-indigo-500/10 text-indigo-600 border-indigo-500/10", glowClass: "glow-card-indigo" },
              { icon: <FiMessageSquare size={18} />, title: "Chatbot AI Assistant", desc: "Konsultasi karir 24/7. Tanyakan revisi kalimat CV, persiapan wawancara, hingga tips negosiasi gaji.", label: "Konsultan Pribadi", color: "from-amber-500/10 text-amber-600 border-amber-500/10", glowClass: "glow-card-blue" },
              { icon: <FiTrendingUp size={18} />, title: "CV Score Tracking", desc: "Pantau riwayat peningkatan kualitas resume Anda secara visual dari waktu ke waktu di dasbor akun.", label: "Rata-rata Naik +20 Poin", color: "from-emerald-500/10 text-emerald-600 border-emerald-500/10", glowClass: "glow-card-purple" },
              { icon: <FiShield size={18} />, title: "Privasi Terjamin", desc: "Data pribadi Anda sepenuhnya aman. Dokumen dienkripsi ketat dan tidak akan pernah dibagikan ke pihak ketiga.", label: "Enkripsi Aman", color: "from-cyan-500/10 text-cyan-600 border-cyan-500/10", glowClass: "glow-card-indigo" },
              { icon: <FiUsers size={18} />, title: "Komunitas Karir", desc: "Terhubung dengan ribuan sesama rekan bertalenta untuk bertukar wawasan, informasi lowongan, dan portofolio.", label: "10K+ Anggota Aktif", color: "from-rose-500/10 text-rose-600 border-rose-500/10", glowClass: "glow-card-purple" }
            ].map((feat, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp} 
                whileHover={{ y: -6, scale: 1.02 }}
                className={`bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/50 shadow-sm transition-all duration-300 cursor-pointer flex flex-col justify-between group hover-shine-effect ${feat.glowClass}`}
              >
                <div>
                  <div className={`w-10 h-10 bg-gradient-to-tr ${feat.color} rounded-xl flex items-center justify-center mb-6 shadow-inner border group-hover:scale-105 transition-transform duration-300`}>
                    {feat.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors duration-200">{feat.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">{feat.desc}</p>
                </div>
                <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg w-max">{feat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- TESTIMONI --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <div className="inline-block px-3.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold mb-4 uppercase tracking-widest">Testimoni</div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Kata Mereka yang Sudah Berhasil</h2>
        <p className="text-slate-500 mb-16 text-sm sm:text-base font-medium">Banyak pencari kerja Indonesia yang telah terbantu menyempurnakan portofolio mereka.</p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          {[
            { quote: "Skor CV saya naik drastis setelah memperbaiki penulisan sesuai rekomendasi AI. Langsung dipanggil wawancara di salah satu agensi digital besar!", name: "Dian Permata", role: "Product Specialist", initials: "DP", rating: 5, glowClass: "glow-card-blue" },
            { quote: "Fitur analisis Gap-nya membukakan mata saya tentang apa saja kualifikasi penting yang tertinggal di berkas saya sebelumnya.", name: "Rizky Aditya", role: "Backend Engineer", initials: "RA", rating: 5, glowClass: "glow-card-indigo" },
            { quote: "Asisten karir bertenaga AI di sini sangat responsif. Sangat terbantu saat menyusun ringkasan profil profesional yang lebih menjual.", name: "Sari Melati", role: "Junior UX Researcher", initials: "SM", rating: 5, glowClass: "glow-card-purple" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-8 border border-slate-200/50 rounded-3xl shadow-sm bg-white/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 cursor-pointer relative overflow-hidden group hover-shine-effect ${item.glowClass}`}
            >
              {/* Kutipan raksasa di latar belakang */}
              <span className="absolute -top-6 -right-2 text-slate-100 font-serif text-[10rem] font-bold select-none pointer-events-none group-hover:text-blue-50/50 transition-colors duration-300">“</span>
              
              <div className="flex gap-1 text-amber-400 mb-5 relative z-10">
                {[...Array(item.rating)].map((_, i) => <FaStar key={i} size={14} style={{ filter: "drop-shadow(0px 0px 4px rgba(245,158,11,0.2))" }} />)}
              </div>
              <p className="text-slate-600 text-sm italic mb-8 leading-relaxed relative z-10 font-medium">{item.quote}</p>
              
              <div className="flex items-center gap-3.5 relative z-10 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-xs ring-4 ring-slate-50">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{item.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- TRUSTED COMPANIES (Infinite Marquee dijamin berjalan mulus) --- */}
      <section className="py-12 border-t border-slate-200/60 text-center bg-slate-50/30 overflow-hidden relative">
        <p className="text-[11px] text-slate-400 mb-8 uppercase tracking-widest font-bold px-6">Pengguna kami tersebar dan sukses berkarya di berbagai sektor industri</p>
        
        <div className="relative w-full overflow-hidden py-2 select-none">
          {/* Edge shadow gradients to make the fade look incredibly premium */}
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50/90 to-transparent z-10 pointer-events-none" />

          {/* Marquee loop */}
          <div className="flex gap-8 w-max animate-marquee whitespace-nowrap">
            <div className="flex gap-8 items-center shrink-0">
              {partnerLogos.map((logo, index) => (
                <div key={index} className="bg-white px-6 py-4 rounded-2xl w-44 h-16 flex items-center justify-center border border-slate-200/60 shadow-sm grayscale opacity-50 hover:grayscale-0 hover:opacity-100 cursor-pointer transition-all duration-300">
                  <img src={logo.src} alt={logo.alt} className={`${logo.h} object-contain`} />
                </div>
              ))}
            </div>
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
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.1] pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/5 rounded-full text-xs font-semibold mb-6 border border-white/10">
            <FiZap className="text-blue-400 animate-pulse" /> Mulai perjalanan karir Anda sekarang
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative z-10 tracking-tight">Siap Meningkatkan Peluang Kerja Anda?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto relative z-10 text-sm sm:text-base font-medium leading-relaxed">
            Upload CV sekarang juga dan ketahui tingkat kecocokan Anda dengan bidang pekerjaan tujuan secara instan.
          </p>
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] relative z-10 flex items-center justify-center gap-2 mx-auto cursor-pointer font-bold uppercase tracking-wider"
          >
            Cek Skor CV Sekarang <BsArrowRight />
          </button>
          
          <div className="flex justify-center gap-6 mt-8 text-[11px] text-slate-400 font-bold uppercase tracking-wide relative z-10">
            <span className="flex items-center gap-1.5"><FiCheckCircle className="text-emerald-500" /> 100% Gratis</span>
            <span className="flex items-center gap-1.5"><FiShield className="text-slate-400" /> Privasi Aman</span>
            <span className="flex items-center gap-1.5"><FiZap className="text-amber-500" /> Hasil Instan</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer variant="full" />

      {/* --- FLOATING CHATBOT BUTTON --- */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-all z-50 cursor-pointer">
        <BsFillChatDotsFill size={22} className="animate-pulse" />
      </button>

      {/* --- INLINE STYLE UNTUK SINKRONISASI ANIMASI MARQUEE & SAAS LENS-FLARE SWEEP --- */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes shine-sweep {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        .hover-shine-effect {
          position: relative;
          overflow: hidden;
        }
        .hover-shine-effect::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.25) 50%,
            rgba(255, 255, 255, 0) 100-percent
          );
          transform: skewX(-25deg);
          transition: none;
        }
        .hover-shine-effect:hover::after {
          animation: shine-sweep 1.2s ease-out;
        }

        .glow-card-blue:hover {
          border-color: rgba(59, 130, 246, 0.3) !important;
          box-shadow: 0 20px 40px -15px rgba(59, 130, 246, 0.12) !important;
        }
        .glow-card-indigo:hover {
          border-color: rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 20px 40px -15px rgba(99, 102, 241, 0.12) !important;
        }
        .glow-card-purple:hover {
          border-color: rgba(168, 85, 247, 0.3) !important;
          box-shadow: 0 20px 40px -15px rgba(168, 85, 247, 0.12) !important;
        }
      `}</style>

    </div>
  );
}