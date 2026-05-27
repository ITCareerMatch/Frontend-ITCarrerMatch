import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { 
  FiMail, FiPhone, FiBriefcase, FiXCircle, 
  FiCheckCircle, FiTrash2, FiPlus, FiChevronDown, 
  FiChevronUp, FiBell, FiTrendingUp, FiChevronRight,
  FiDownload
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill, BsFileText, BsPersonCircle } from 'react-icons/bs';

// Animasi Konfigurasi Reusable
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

// --- KOMPONEN INPUT FORM REUSABLE ---
const FormInput = ({ label, icon: Icon, ...props }) => (
  <div className="text-left">
    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
        {Icon && <Icon size={16} />}
      </div>
      <input 
        {...props} 
        className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800" 
      />
    </div>
  </div>
);

export default function CvEditor() {

  // State Utama untuk Data CV (Bisa diedit)
  const [cvData, setCvData] = useState({
    profile: {
      fullName: 'Budi Santoso',
      email: 'budi.santoso@email.com',
      phone: '+62 812 3456 7890',
      summary: 'Frontend Engineer dengan pengalaman 3 tahun membangun aplikasi web modern menggunakan React, Tailwind CSS, dan Next.js. Memiliki semangat tinggi untuk optimasi performa dan kolaborasi tim lintas fungsi.'
    },
    experience: [
      { id: 1, title: 'Senior Frontend Engineer', company: 'TechNusa Solutions', dates: 'Jan 2021 - Sekarang', achievements: 'Bertanggung jawab atas pengembangan backend perusahaan menggunakan React & Tailwind. Memimpin tim 3 orang.' },
      { id: 2, title: 'Junior Web Developer', company: 'DigitalNusantara', dates: 'Jun 2019 - Des 2020', achievements: 'Mengembangkan fitur UI baru untuk platform e-commerce.' }
    ],
    skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'Next.js', 'PostgreSQL']
  });

  // State UI
  const [openSections, setOpenSections] = useState({
    profile: true,
    experience: true
  });
  const [activeTab, setActiveTab] = useState('preview');

  // State untuk efek animasi hitung maju dari 0 ke 68
  const [animatedScore, setAnimatedScore] = useState(0);
  const targetScore = 68;

  // --- POP UP SWEETALERT SAAT PERTAMA MASUK ---
  useEffect(() => {
    Swal.fire({
      title: 'Fitur dalam Pengembangan',
      text: 'Fitur AI CV Editor interaktif ini masih dalam tahap pengembangan akhir dan akan segera hadir dengan fungsionalitas pengeditan resume otomatis penuh.',
      icon: 'info',
      confirmButtonText: 'Saya Mengerti',
      confirmButtonColor: '#0f172a', // Slate-900 agar matching dengan tema premium
      background: '#ffffff',
      customClass: {
        popup: 'rounded-3xl border border-slate-200/60 shadow-xl font-sans',
        title: 'text-slate-900 font-extrabold tracking-tight text-xl',
        htmlContainer: 'text-slate-500 font-semibold text-sm leading-relaxed',
        confirmButton: 'px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider'
      }
    });
  }, []);

  // --- EFEK HITUNG MAJU DAN PUTARAN SECTOR PROGRESS (0-68) ---
  useEffect(() => {
    if (activeTab === 'insights') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimatedScore(0); // Reset ke 0 saat beralih tab agar animasi terulang kembali
      let startValue = 0;
      const duration = 1200; // Total waktu animasi berjalan (1.2 detik)
      const fps = 60; // Menggunakan standar mulus 60 frame per detik
      const step = targetScore / (duration / (1000 / fps));
      
      const counter = setInterval(() => {
        startValue += step;
        if (startValue >= targetScore) {
          setAnimatedScore(targetScore);
          clearInterval(counter);
        } else {
          setAnimatedScore(Math.floor(startValue));
        }
      }, 1000 / fps);
      
      return () => clearInterval(counter);
    }
  }, [activeTab]);

  // --- FUNGSI HANDLER ---
  const handleProfileChange = (field, value) => {
    setCvData(prev => ({
      ...prev,
      profile: { ...prev.profile, [field]: value }
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // --- FUNGSI UNDUH PDF ---
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50/30 flex flex-col print:bg-white print:h-auto selection:bg-blue-500/10 selection:text-blue-600">

      {/* --- MAIN CONTENT (Layout Split Editor) --- */}
      <main className="flex-1 flex flex-col lg:flex-row print:block">
        
        {/* KOLOM KIRI: FORM INTERAKTIF (Sembunyikan saat print) */}
        <aside className="w-full lg:w-1/2 p-6 flex flex-col bg-white shadow-sm border-r border-slate-200/50 print:hidden overflow-y-auto max-h-[calc(100vh-5rem)]">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2 tracking-tight text-left">
            <BsFileText className="text-blue-600"/> Edit Detail CV
          </h2>
          
          <div className="space-y-4 pb-20">
            {/* Accordion 1: Detail Profil */}
            <div className="border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                onClick={() => toggleSection('profile')} 
                className="w-full flex items-center justify-between p-4.5 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BsPersonCircle className="text-blue-600" size={16}/>
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">Detail Profil</span>
                </div>
                {openSections.profile ? <FiChevronUp className="text-slate-500" /> : <FiChevronDown className="text-slate-500" />}
              </button>
              
              <AnimatePresence>
                {openSections.profile && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 space-y-4 border-t border-slate-200/60 bg-white">
                      <FormInput label="Nama Lengkap" icon={BsPersonCircle} placeholder="Budi Santoso" value={cvData.profile.fullName} onChange={(e) => handleProfileChange('fullName', e.target.value)} />
                      <FormInput label="Email" icon={FiMail} placeholder="nama@email.com" value={cvData.profile.email} onChange={(e) => handleProfileChange('email', e.target.value)} />
                      <FormInput label="Nomor Telepon" icon={FiPhone} placeholder="+62 8..." value={cvData.profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} />
                      <div className="text-left">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ringkasan Profesional</label>
                        <textarea 
                          rows="4" 
                          className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-slate-50/50 focus:bg-white transition-all text-slate-800" 
                          value={cvData.profile.summary} 
                          onChange={(e) => handleProfileChange('summary', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Accordion 2: Pengalaman Kerja */}
            <div className="border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
              <button 
                onClick={() => toggleSection('experience')} 
                className="w-full flex items-center justify-between p-4.5 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FiBriefcase className="text-blue-600" size={16}/>
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">Pengalaman Kerja</span>
                </div>
                {openSections.experience ? <FiChevronUp className="text-slate-500" /> : <FiChevronDown className="text-slate-500" />}
              </button>
              
              <AnimatePresence>
                {openSections.experience && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 space-y-6 border-t border-slate-200/60 bg-white">
                      {cvData.experience.map((exp, index) => (
                        <div key={exp.id} className="border border-slate-200/60 p-5 rounded-2xl space-y-4 relative bg-slate-50/30 text-left">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-black text-slate-400 text-[10px] uppercase tracking-wider">Pengalaman {index + 1}</span>
                            <button className="text-slate-400 hover:text-rose-600 transition-colors p-1 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 cursor-pointer"><FiTrash2 size={16}/></button>
                          </div>
                          <FormInput label="Posisi / Jabatan" icon={FiBriefcase} value={exp.title} onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)} />
                          <FormInput label="Perusahaan" icon={FiCheckCircle} value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                          <FormInput label="Periode Tanggal" icon={FiBriefcase} value={exp.dates} onChange={(e) => handleExperienceChange(exp.id, 'dates', e.target.value)} />
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pencapaian & Tugas</label>
                            <textarea 
                              rows="3" 
                              className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm font-semibold bg-white transition-all text-slate-800" 
                              value={exp.achievements} 
                              onChange={(e) => handleExperienceChange(exp.id, 'achievements', e.target.value)}
                            />
                          </div>
                        </div>
                      ))}
                      <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 text-slate-500 font-bold py-3.5 rounded-2xl hover:bg-slate-50 hover:text-slate-800 hover:border-slate-400 transition-all text-xs uppercase tracking-wider cursor-pointer">
                        <FiPlus /> Tambah Pengalaman Baru
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sticky Bottom Bar (Sembunyikan saat print) */}
          <div className="mt-auto pt-4 border-t border-slate-100 bg-white sticky bottom-0 flex gap-3 relative z-10 shrink-0">
             <button className="w-1/2 bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-wider cursor-pointer border border-slate-200">
               Simpan Draft
             </button>
             <button className="w-1/2 bg-slate-900 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 shadow-md transition-all flex justify-center items-center gap-2 text-xs uppercase tracking-wider cursor-pointer">
               <BsStars className="text-amber-400" /> Scan Ulang AI
             </button>
          </div>
        </aside>

        {/* ========================================== */}
        {/* KOLOM KANAN: PREVIEW & AI INSIGHTS */}
        {/* ========================================== */}
        <section className="w-full lg:w-1/2 flex flex-col p-6 overflow-y-auto bg-slate-50/30 print:p-0 print:w-full print:bg-white print:overflow-visible">
          
          {/* Header Tabs & Tombol Download (Sembunyikan saat print) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden shrink-0">
            <div className="flex bg-white/70 backdrop-blur-md p-1 rounded-2xl border border-slate-200/60 shadow-sm w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('preview')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'preview' ? 'bg-white text-slate-900 shadow-md border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <BsFileText className="inline mr-2" /> Live Preview
              </button>
              <button 
                onClick={() => setActiveTab('insights')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'insights' ? 'bg-white text-slate-900 shadow-md border border-slate-200/60' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <BsLightbulbFill className={`inline mr-2 ${activeTab === 'insights' ? 'text-amber-500 animate-pulse' : ''}`} /> AI Insights (3)
              </button>
            </div>

            {/* Tombol Simpan & Unduh PDF */}
            {activeTab === 'preview' && (
              <button 
                onClick={handleDownloadPDF} 
                className="w-full sm:w-auto bg-slate-900 text-white font-bold px-5 py-2.5 rounded-2xl hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <FiDownload size={16} /> Unduh PDF
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'preview' ? (
               /* --- LIVE PREVIEW CV (FORMAT ATS FRIENDLY) --- */
               <motion.div 
                 key="preview-panel"
                 initial="hidden"
                 animate="visible"
                 variants={fadeInUp}
                 className="bg-white rounded-3xl shadow-xl shadow-slate-200/30 border border-slate-200/60 aspect-[1/1.4] w-full max-w-[700px] mx-auto overflow-hidden flex flex-col p-8 sm:p-12 text-slate-900 print:max-w-none print:shadow-none print:border-none print:aspect-auto print:h-screen print:m-0 print:p-4 text-left"
               >
                  {/* Header: Nama dan Kontak */}
                  <div className="text-center border-b-2 border-slate-800 pb-4 mb-5">
                    <h1 className="font-extrabold text-3xl sm:text-4xl uppercase tracking-wider mb-2 text-slate-900">{cvData.profile.fullName}</h1>
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 flex justify-center items-center flex-wrap gap-x-2 gap-y-1">
                      <span>{cvData.profile.phone}</span>
                      <span className="text-slate-300">|</span>
                      <span>{cvData.profile.email}</span>
                    </p>
                  </div>

                  {/* Ringkasan Profesional */}
                  <div className="mb-5">
                    <h2 className="font-extrabold text-xs uppercase tracking-widest border-b border-slate-200 mb-3 pb-1 text-slate-900">Professional Summary</h2>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-800 text-justify font-medium">
                      {cvData.profile.summary}
                    </p>
                  </div>

                  {/* Pengalaman Kerja */}
                  <div className="mb-5">
                    <h2 className="font-extrabold text-xs uppercase tracking-widest border-b border-slate-200 mb-3 pb-1 text-slate-900">Work Experience</h2>
                    <div className="space-y-4">
                      {cvData.experience.map(exp => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-baseline mb-1">
                            <h3 className="font-extrabold text-xs sm:text-sm text-slate-900">{exp.title}</h3>
                            <span className="text-[11px] font-bold text-slate-600">{exp.dates}</span>
                          </div>
                          <p className="text-xs font-bold italic text-slate-700 mb-1.5">{exp.company}</p>
                          
                          <ul className="list-disc list-outside ml-4 text-xs sm:text-sm leading-relaxed text-slate-800 text-justify font-medium">
                            <li>{exp.achievements}</li>
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keahlian (Skills) */}
                  <div className="mb-5">
                    <h2 className="font-extrabold text-xs uppercase tracking-widest border-b border-slate-200 mb-3 pb-1 text-slate-900">Skills</h2>
                    <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                      <span className="font-bold text-slate-900">Core Competencies: </span> 
                      {cvData.skills.join(', ')}
                    </p>
                  </div>

               </motion.div>
            ) : (
              /* --- AI INSIGHTS TAB (Sembunyikan saat print) --- */
              <motion.div 
                key="insights-panel"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                className="space-y-6 max-w-[600px] mx-auto w-full pb-10 print:hidden text-left"
              >
                {/* --- CHROME-LEVEL ANIMATED GAUGE SCORE (Efek hitung maju & sapu sirkular) --- */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-slate-200/60 shadow-lg shadow-slate-200/30 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Container Sirkular Progresif */}
                  <div className="w-40 h-40 mx-auto flex flex-col items-center justify-center mb-6 relative bg-white rounded-full shadow-sm">
                    {/* Ring Path Lingkaran SVG */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 160 160">
                      {/* Cincin Latar Belakang */}
                      <circle 
                        className="text-slate-100" 
                        strokeWidth="10" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="70" 
                        cx="80" 
                        cy="80" 
                      />
                      {/* Cincin Progres Utama (Menyapu menyinkronkan animatedScore) */}
                      <motion.circle 
                        className="text-emerald-500" 
                        strokeWidth="10" 
                        strokeDasharray="440" 
                        strokeDashoffset={440 - (440 * animatedScore) / 100} 
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="70" 
                        cx="80" 
                        cy="80" 
                        style={{ 
                          filter: "drop-shadow(0px 0px 6px rgba(16, 185, 129, 0.35))",
                          transition: "stroke-dashoffset 0.08s ease-out" 
                        }}
                      />
                    </svg>
                    
                    {/* Nilai Skor Hitung Maju Tengah */}
                    <div className="relative z-10 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black text-slate-950 leading-none tracking-tight">{animatedScore}</span>
                      <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">dari 100</span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/5 text-emerald-700 rounded-xl text-xs font-black border border-emerald-500/10 shadow-sm uppercase tracking-wider">
                    <FiTrendingUp /> Cukup Baik, Perlu Peningkatan!
                  </div>
                </div>

                {/* AI Improvement suggestions */}
                <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-4">
                   <h4 className="font-extrabold text-slate-900 mb-2 text-sm uppercase tracking-wider flex items-center gap-2"><BsLightbulbFill className="text-amber-500"/> Saran Perbaikan AI (3)</h4>
                   <div className="border border-rose-500/10 rounded-2xl overflow-hidden shadow-sm">
                     <div className="p-4 bg-rose-500/5 text-xs font-bold text-rose-800 flex justify-between items-center border-b border-rose-500/10 uppercase tracking-wider">
                       <span>Pengalaman Kerja (Penting)</span> <FiChevronDown size={16}/>
                     </div>
                     <div className="p-5 space-y-4 bg-white">
                        <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">AI mendeteksi gaya bahasa pencapaian Anda berkarakter pasif. Ubah kata kerja awal menjadi aktif untuk menonjolkan kepemimpinan Anda.</p>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                          <p className="flex gap-2 text-slate-400 line-through text-xs font-semibold italic"><FiXCircle className="text-rose-400 shrink-0 mt-0.5" size={15}/> "Bertanggung jawab atas pengembangan backend perusahaan..."</p>
                        </div>
                        <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          <p className="flex gap-2 text-emerald-800 text-xs font-bold"><FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={15}/> "Merancang dan mengimplementasikan arsitektur backend perusahaan..."</p>
                        </div>
                     </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

    </div>
  );
}