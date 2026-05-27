import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiFileText, FiTarget, FiHeart, FiGithub, FiLinkedin, 
  FiMenu, FiX, FiMonitor, FiCpu, FiCloud, FiAward, FiInstagram 
} from 'react-icons/fi';
import { BsStars, BsArrowRight } from 'react-icons/bs';
import useAuth from '../../context/useAuth';

// Animasi Konfigurasi Reusable
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
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

export default function About() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isLoggedIn = !!session || !!localStorage.getItem('access_token');

  // State untuk efek mengetik teks berputar
  const [typedText, setTypedText] = useState('');
  const words = ["Peluang Tepat", "Karir Impian", "Masa Depan"];

  // Deteksi scroll untuk memperbarui style navbar secara dinamis
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

  // Efek Mengetik Berputar (looping typewriter)
  useEffect(() => {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      const currentWord = words[wordIdx];
      if (!isDeleting) {
        setTypedText(currentWord.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentWord.length) {
          isDeleting = true;
          timer = setTimeout(type, 2000); // Jeda 2 detik saat kata lengkap terketik
        } else {
          timer = setTimeout(type, 120); // Kecepatan mengetik karakter
        }
      } else {
        setTypedText(currentWord.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer = setTimeout(type, 500); // Jeda singkat sebelum mengetik kata berikutnya
        } else {
          timer = setTimeout(type, 60); // Kecepatan menghapus karakter
        }
      }
    };

    type();
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Data Tim Capstone CC26-PSU088 (Tetap Dipertahankan)
  const teamMembers = [
    { id: 'CDCC284D6Y2328', name: 'Chardinal Martin B.', role: 'Data Scientist', img: '/profile/foto_chardinal.png', ig: 'https://www.instagram.com/chardinal_01/', linkedin:'https://www.linkedin.com/in/chardinal-martin-butarbutar/', github:'https://github.com/chardinal' },
    { id: 'CDCC284D6X0604', name: 'Nadhia Della P. S.', role: 'Data Scientist', img: '/profile/foto_della.jpg', ig:'https://www.instagram.com/nadhiadellaa?igsh=cmhzdWNkYnlsZDFr', linkedin:'https://www.linkedin.com/in/nadhiadellapuspita?utm_source=share_via&utm_content=profile&utm_medium=member_android', github:'https://github.com/NadhiaDella' },
    { id: 'CFCC284D6X2831', name: 'Mutiara Angelita M.', role: 'Full Stack Developer', img: '/profile/foto_angel.jpg', ig:'https://www.instagram.com/mutiangell_', linkedin:'https://www.linkedin.com/in/mutiangel', github:'https://github.com/kaenjie' },
    { id: 'CFCC614D6Y0867', name: 'Ahmad Sefriadi', role: 'Full Stack Developer', img: '/profile/foto_asep.jpg', ig:'https://www.instagram.com/sefriadiahmad', linkedin:'https://www.linkedin.com/in/sefriadiahmad', github:'https://github.com/sefriadiahmad' },
    { id: 'CACC012D6Y0477', name: 'M. Arifbillah Kamil', role: 'AI Engineer', img: '/profile/foto_abbil.jpg', ig:'https://www.instagram.com/arifbillahkamil', linkedin:'https://www.linkedin.com/in/arifbillahkamil', github:'https://github.com/ArifbillahKamil' },
    { id: 'CACC715D6Y0952', name: 'Ulil Noor Absor', role: 'AI Engineer', img: '/profile/foto_ulil.jpg', ig:'https://www.instagram.com/ulil_na/', linkedin:'https://www.linkedin.com/in/ulil-noor-absor', github:'https://github.com/ulillearn' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.22] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* --- FIXED NAVBAR --- */}
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
        <div className="flex items-center gap-3 font-bold text-xl text-slate-900 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6" />
          </div>
          <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
            ITCareerMatch
          </span>
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
          <a onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors cursor-pointer tracking-tight">Beranda</a>
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer tracking-tight">Daftar Lowongan</a>
          <a className="text-blue-600 font-extrabold transition-colors cursor-pointer tracking-tight">Tentang Kami</a>
        </nav>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button onClick={() => navigate('/dashboard')} className="bg-white text-slate-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-slate-50 border border-slate-200 shadow-sm transition-all cursor-pointer hover:border-slate-300 active:scale-95">Ke Dashboard</button>
          ) : (
            <button onClick={() => navigate('/login')} className="hover:text-blue-600 text-sm font-bold transition-colors cursor-pointer mr-2">Masuk</button>
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
            <div className="flex flex-col gap-4 text-sm font-bold text-slate-700">
              <a onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="block hover:text-blue-600 pb-3 border-b border-slate-50">Beranda</a>
              <a onClick={() => { setMobileMenuOpen(false); navigate('/lowongan'); }} className="block hover:text-blue-600 pb-3 border-b border-slate-50">Daftar Lowongan</a>
              <a onClick={() => { setMobileMenuOpen(false); navigate('/tentang-kami'); }} className="block text-blue-600 pb-3 border-b border-slate-50">Tentang Kami</a>
              <div className="flex flex-col gap-3 pt-2 w-full">
                  {isLoggedIn ? (
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }} className="w-full bg-slate-50 text-slate-700 px-4 py-3 rounded-xl border border-slate-200 transition-colors font-bold">Ke Dashboard</button>
                  ) : (
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center text-slate-700 px-4 py-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 font-bold">Masuk</button>
                  )}
                  <button onClick={() => { setMobileMenuOpen(false); navigate('/analisis-baru'); }} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-all flex justify-center items-center gap-2 font-bold"><BsStars /> Cek Skor CV</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-500/5 text-blue-600 rounded-full text-xs font-bold mb-6 border border-blue-500/10"
        >
          <BsStars size={14} className="text-blue-600 animate-pulse" /> Capstone Project CC26-PSU088
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.12] mb-6 tracking-tight"
        >
          Menjembatani Talenta Hebat <br className="hidden md:block" /> dengan <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block min-w-[280px]">
            {typedText}
            <span className="text-blue-600 animate-pulse font-light ml-0.5">|</span>
          </span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          Kami percaya setiap individu memiliki potensi besar. ITCareerMatch dibangun untuk memastikan kesetaraan kualifikasi talenta digital dari kendala teknis format penulisan resume.
        </motion.p>
      </section>

      {/* --- THE STORY / LATAR BELAKANG --- */}
      <section className="py-20 bg-slate-50/50 border-y border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <div className="w-11 h-11 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center"><FiTarget size={20}/></div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mengapa Kami Membangun Ini?</h2>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              Sistem rekrutmen modern saat ini sangat bergantung pada **ATS (Applicant Tracking System)**. Ironisnya, banyak kandidat bertalenta di Indonesia yang tertolak bukan karena kurang kompeten, melainkan akibat penulisan berkas yang tidak ramah mesin pembaca resume.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm font-medium">
              Sebagai proyek akhir (Capstone), kami berkolaborasi mensinergikan pilar Machine Learning, Cloud Computing, dan Web Development untuk memecahkan hambatan tersebut dengan menghadirkan visualisasi kesesuaian keahlian yang cerdas dan transparan bagi para pencari kerja.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
               <FiHeart size={44} className="text-indigo-400 mb-6 relative z-10" />
               <h3 className="text-xl font-bold mb-3 relative z-10 tracking-tight">Visi Kami</h3>
               <p className="text-slate-400 leading-relaxed relative z-10 text-xs sm:text-sm font-medium">
                 Menjadi platform optimalisasi berkas karir berbasis kecerdasan buatan terdepan yang mendemokratisasi kelayakan lamaran bagi seluruh talenta digital di Indonesia.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK --- */}
      <section className="py-24 max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Teknologi di Balik Layar</h2>
          <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">Kolaborasi harmonis tiga disiplin keahlian kurikulum teknologi untuk menciptakan performa platform yang andal.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center mb-6"><FiMonitor size={20}/></div>
            <h3 className="font-bold text-slate-900 mb-3 text-base tracking-tight">Web & Mobile Frontend</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed font-medium">Membangun interaksi antarmuka yang responsif, minimalis, dan intuitif menggunakan kaidah tata desain terbaik.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">React.js</span>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">Tailwind CSS</span>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">Vite</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-xl flex items-center justify-center mb-6"><FiCpu size={20}/></div>
            <h3 className="font-bold text-slate-900 mb-3 text-base tracking-tight">Machine Learning & AI</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed font-medium">Ekstraksi semantik keahlian resume dan penyesuaian kriteria lowongan menggunakan rekayasa model NLP canggih.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">Python</span>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">TensorFlow</span>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">NLP / LLM</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 p-8 rounded-3xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center mb-6"><FiCloud size={20}/></div>
            <h3 className="font-bold text-slate-900 mb-3 text-base tracking-tight">Cloud Computing</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-5 leading-relaxed font-medium">Perancangan arsitektur server yang aman, ketersediaan database berlatensi rendah, serta skalabilitas API mikro.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">Node.js</span>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">GCP</span>
              <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200/60 uppercase tracking-wider">Supabase</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MEET THE TEAM (Fixed Z-Index Stacked Portrait Card with Correct Zoom Hover) --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Tim Pengembang</h2>
        <p className="text-slate-500 mb-16 max-w-xl mx-auto text-sm sm:text-base font-medium">
          Bertemu dengan enam spesialis dari tim pengembang *cohort* CC26-PSU088 yang mewujudkan platform ini.
        </p>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {teamMembers.map((member, idx) => (
            <motion.div 
              key={idx} 
              variants={fadeInUp}
              className="relative rounded-3xl aspect-[4/5] overflow-hidden group border border-slate-200/60 shadow-md cursor-pointer bg-slate-100"
            >
              {/* Foto Profil Utama Portrait (z-0 - Melakukan Zoom In yang Mulus saat Di-hover) */}
              <img 
                src={member.img} 
                alt={member.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 z-0" 
              />
              
              {/* Glow efek halus di belakang kartu saat kursor diarahkan (z-10) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Gradasi Gelap Awal di bagian bawah (z-10) */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent transition-opacity duration-500 group-hover:opacity-0 z-10" />

              {/* Tampilan Nama Awal di Bagian Bawah (z-20 - Default State) */}
              <div className="absolute bottom-6 left-6 right-6 text-left transition-all duration-500 ease-out group-hover:translate-y-5 group-hover:opacity-0 z-20">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight leading-tight">{member.name}</h3>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mt-1">{member.role}</p>
              </div>

              {/* TAMPILAN DETAIL LENGKAP (z-30 - Gradasi semi transparan agar foto zoom-in di belakangnya tetap terlihat) */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-950/10 flex flex-col justify-between p-7 text-left opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-[0.16,1,0.3,1] z-30">
                
                {/* Informasi Anggota */}
                <div className="space-y-3">
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{member.role}</p>
                  <h3 className="text-xl font-extrabold text-white tracking-tight leading-tight">{member.name}</h3>
                  <span className="inline-block text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
                    ID: {member.id}
                  </span>
                </div>
                
                {/* Sosial Media di bagian bawah panel detail */}
                <div className="flex gap-2.5 pt-5 border-t border-white/10">
                  <motion.a 
                    whileHover={{ y: -3, scale: 1.05 }}
                    href={member.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white border border-white/10 transition-colors"
                  >
                    <FiLinkedin size={16}/>
                  </motion.a>
                  <motion.a 
                    whileHover={{ y: -3, scale: 1.05 }}
                    href={member.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white border border-white/10 transition-colors"
                  >
                    <FiGithub size={16}/>
                  </motion.a>
                  <motion.a 
                    whileHover={{ y: -3, scale: 1.05 }}
                    href={member.ig} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-pink-400 border border-white/10 transition-colors"
                  >
                    <FiInstagram size={16}/>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- APRESIASI / ACKNOWLEDGMENT --- */}
      <section className="py-16 bg-slate-50/50 border-t border-slate-200/60 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <FiAward className="mx-auto text-amber-500 mb-4" size={28} />
          <h3 className="font-extrabold text-slate-900 mb-2 tracking-tight">Didukung Penuh Oleh</h3>
          <p className="text-xs text-slate-500 mb-8 font-medium leading-relaxed">Proyek tugas akhir ini direalisasikan di bawah bimbingan serta fasilitas program inkubasi terkemuka dari:</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-60 hover:opacity-100 transition-opacity duration-300">
            <img src="/images/dbs-logo.png" alt="DBS Foundation" className="h-10 object-contain" />
            <img src="/images/dicoding-logo.png" alt="Dicoding Indonesia" className="h-10 object-contain" />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.08] pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 relative z-10 tracking-tight">Ingin Menguji Kualitas CV Anda?</h2>
          <p className="text-slate-400 mb-10 max-w-md mx-auto relative z-10 text-xs sm:text-sm font-medium leading-relaxed">
            Dapatkan evaluasi resume Anda secara objektif menggunakan alat deteksi kecerdasan buatan kami.
          </p>
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-white text-slate-950 px-6 py-3.5 rounded-2xl font-bold text-xs hover:bg-slate-50 transition-colors shadow-lg relative z-10 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            Mulai Cek Skor CV <BsArrowRight size={14} />
          </button>
        </div>
      </section>

      <footer className="py-8 bg-slate-50 border-t border-slate-100 text-center">
        <div className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          &copy; 2026 ITCareerMatch. Capstone Team - CC26-PSU088.
        </div>
      </footer>
      
    </div>
  );
}