import React, { useState } from 'react';
import { 
  FiMail, FiPhone, FiBriefcase, FiXCircle, 
  FiCheckCircle, FiTrash2, FiPlus, FiChevronDown, 
  FiChevronUp, FiBell, FiTrendingUp, FiChevronRight,
  FiDownload // <-- Import ikon Download
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill, BsFileText, BsPersonCircle } from 'react-icons/bs';

// --- KOMPONEN INPUT FORM REUSABLE ---
const FormInput = ({ label, icon: Icon, ...props }) => (
  <div>
    <label className="block text-sm font-bold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        {Icon && <Icon size={18} />}
      </div>
      <input 
        {...props} 
        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" 
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
    // Tambahkan print:bg-white dan print:h-auto agar saat diprint background bersih
    <div className="min-h-screen bg-gray-100 flex flex-col print:bg-white print:h-auto">

      {/* --- MAIN CONTENT (Layout Split Editor) --- */}
      <main className="flex-1 flex flex-col md:flex-row print:block">
        
        {/* KOLOM KIRI: FORM INTERAKTIF (Sembunyikan saat print) */}
        <aside className="w-full md:w-1/2 p-6 flex flex-col bg-white shadow-md print:hidden overflow-y-auto max-h-screen">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2"><BsFileText className="text-blue-600"/> Edit Detail CV</h2>
          
          <div className="space-y-4 pb-20">
            {/* Accordion 1: Detail Profil */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('profile')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3"><BsPersonCircle className="text-blue-600"/><span className="font-bold text-sm">Detail Profil</span></div>
                {openSections.profile ? <FiChevronUp/> : <FiChevronDown/>}
              </button>
              
              {openSections.profile && (
                <div className="p-5 space-y-5 border-t border-gray-200 bg-white">
                  <FormInput label="Nama Lengkap" icon={BsPersonCircle} placeholder="Contoh: Budi Santoso" value={cvData.profile.fullName} onChange={(e) => handleProfileChange('fullName', e.target.value)} />
                  <FormInput label="Email" icon={FiMail} placeholder="nama@email.com" value={cvData.profile.email} onChange={(e) => handleProfileChange('email', e.target.value)} />
                  <FormInput label="Nomor Telepon" icon={FiPhone} placeholder="+62 8..." value={cvData.profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} />
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan Profesional</label>
                    <textarea rows="4" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors" value={cvData.profile.summary} onChange={(e) => handleProfileChange('summary', e.target.value)}></textarea>
                  </div>
                </div>
              )}
            </div>

            {/* Accordion 2: Pengalaman Kerja */}
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button onClick={() => toggleSection('experience')} className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3"><FiBriefcase className="text-blue-600"/><span className="font-bold text-sm">Pengalaman Kerja</span></div>
                {openSections.experience ? <FiChevronUp/> : <FiChevronDown/>}
              </button>
              
              {openSections.experience && (
                <div className="p-5 space-y-6 border-t border-gray-200 bg-white">
                  {cvData.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-100 p-5 rounded-xl space-y-4 relative bg-gray-50/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-500 text-xs uppercase">Pengalaman {index + 1}</span>
                        <button className="text-gray-400 hover:text-red-500 transition-colors"><FiTrash2 size={18}/></button>
                      </div>
                      <FormInput label="Posisi / Jabatan" icon={FiBriefcase} value={exp.title} onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)} />
                      <FormInput label="Perusahaan" icon={FiCheckCircle} value={exp.company} onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)} />
                      <FormInput label="Periode Tanggal" icon={FiBriefcase} value={exp.dates} onChange={(e) => handleExperienceChange(exp.id, 'dates', e.target.value)} />
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pencapaian & Tugas</label>
                        <textarea rows="3" className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white transition-colors" value={exp.achievements} onChange={(e) => handleExperienceChange(exp.id, 'achievements', e.target.value)}></textarea>
                      </div>
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-200 text-blue-600 font-bold py-3.5 rounded-xl hover:bg-blue-50 transition-colors text-sm cursor-pointer">
                    <FiPlus /> Tambah Pengalaman Baru
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div className="mt-auto pt-4 border-t border-gray-100 bg-white bottom-0 flex justify-between items-center gap-4 p-6 print:hidden">
             <button className="w-1/1 bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors flex justify-center items-center gap-2 cursor-pointer">
               Simpan Draft
             </button>
          </div>
        </aside>

        {/* ========================================== */}
        {/* KOLOM KANAN: PREVIEW & AI INSIGHTS */}
        {/* ========================================== */}
        {/* Tambahkan modifier print agar memenuhi layar saat PDF */}
        <section className="w-full md:w-1/2 flex flex-col p-6 overflow-y-auto bg-gray-50/50 print:p-0 print:w-full print:bg-white print:overflow-visible">
          
          {/* Header Tabs & Tombol Download (Sembunyikan saat print) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 print:hidden">
            <div className="flex bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm w-full sm:w-auto">
              <button onClick={() => setActiveTab('preview')} className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'preview' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}>
                <BsFileText className="inline mr-2" /> Live Preview
              </button>
              <button onClick={() => setActiveTab('insights')} className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'insights' ? 'bg-yellow-50 text-yellow-700 shadow-sm border border-yellow-200' : 'text-gray-500 hover:text-gray-700 cursor-pointer'}`}>
                <BsLightbulbFill className={`inline mr-2 ${activeTab === 'insights' ? 'text-yellow-500' : ''}`} /> AI Insights (3)
              </button>
            </div>

            {/* Tombol Simpan & Unduh PDF */}
            {activeTab === 'preview' && (
              <button 
                onClick={handleDownloadPDF} 
                className="w-full sm:w-auto bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <FiDownload size={18} />Unduh PDF
              </button>
            )}
          </div>

          {activeTab === 'preview' ? (
             /* --- LIVE PREVIEW CV (Kertas A4) --- */
             /* Hilangkan border, shadow, max-width saat print */
             <div className="bg-white rounded-lg shadow-md border border-gray-200 aspect-[1/1.4] w-full max-w-[600px] mx-auto relative overflow-hidden flex print:max-w-none print:shadow-none print:border-none print:aspect-auto print:h-screen print:m-0">
                
                {/* Sidebar CV (Kiri) */}
                <div 
                  className="w-1/3 bg-[#2A3B4C] text-white p-6 space-y-6" 
                  style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} // Memaksa warna background muncul saat print
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 mx-auto flex items-center justify-center font-bold text-2xl tracking-widest text-white shadow-inner">
                    {cvData.profile.fullName.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="space-y-3 text-[10px] break-words">
                    <p className="flex items-center gap-2 opacity-80"><FiMail className="shrink-0"/> {cvData.profile.email}</p>
                    <p className="flex items-center gap-2 opacity-80"><FiPhone className="shrink-0"/> {cvData.profile.phone}</p>
                  </div>
                  <div className="pt-4 border-t border-white/20">
                    <h4 className="font-bold mb-3 text-xs tracking-widest text-blue-200">KEAHLIAN</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {cvData.skills.map((s, index) => (
                        <span key={index} className="bg-white/10 border border-white/20 px-2 py-1 rounded text-[9px] font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Konten Utama CV (Kanan) */}
                <div className="w-2/3 p-8 space-y-6 text-gray-800">
                  <div className="border-b border-gray-200 pb-4">
                    <h1 className="font-black text-2xl uppercase text-gray-900 leading-none mb-1">{cvData.profile.fullName}</h1>
                    <p className="text-blue-600 font-bold text-sm tracking-widest uppercase">Software Engineer</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2 text-xs text-gray-400 tracking-widest uppercase">Profil</h4>
                    <p className="text-xs leading-relaxed text-gray-600 text-justify">{cvData.profile.summary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-3 text-xs text-gray-400 tracking-widest uppercase">Pengalaman</h4>
                    <div className="space-y-4">
                      {cvData.experience.map(exp => (
                        <div key={exp.id} className="relative pl-3 border-l-2 border-gray-200">
                          <div className="absolute w-2 h-2 bg-blue-500 rounded-full -left-[5px] top-1" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                          <p className="font-bold text-gray-900 text-sm leading-tight">{exp.title}</p>
                          <p className="text-blue-600 text-[10px] font-bold mb-1">{exp.company} <span className="text-gray-400 font-normal">| {exp.dates}</span></p>
                          <p className="text-xs text-gray-600 leading-relaxed text-justify">{exp.achievements}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
             </div>
          ) : (
            /* --- AI INSIGHTS TAB (Sembunyikan saat print) --- */
            <div className="space-y-6 max-w-[600px] mx-auto w-full pb-10 print:hidden">
              
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center relative overflow-hidden">
                <div className="w-40 h-40 mx-auto rounded-full border-[10px] border-gray-50 flex flex-col items-center justify-center mb-6 relative">
                    <div className="absolute inset-[-10px] rounded-full border-[10px] border-green-500" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 68%, 0 68%)' }}></div>
                    <span className="text-5xl font-black text-gray-900 leading-none">68</span>
                    <span className="text-sm font-medium text-gray-500">dari 100</span>
                </div>
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 rounded-full text-sm font-bold border border-green-100">
                  <FiTrendingUp /> Cukup Baik, Perlu Peningkatan!
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                 <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><BsLightbulbFill className="text-yellow-500"/> Saran Perbaikan AI (3)</h4>
                 
                 <div className="border border-red-100 rounded-2xl overflow-hidden shadow-sm">
                   <div className="p-4 bg-red-50 text-sm font-bold text-red-700 flex justify-between items-center border-b border-red-100">
                     <span>Pengalaman Kerja (Penting)</span> 
                     <FiChevronDown/>
                   </div>
                   <div className="p-5 space-y-4 bg-white">
                      <p className="text-sm text-gray-600 mb-2">AI mendeteksi kalimat Anda terlalu pasif. Gunakan struktur kalimat berorientasi hasil.</p>
                      <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="flex gap-2 text-gray-400 line-through text-xs italic"><FiXCircle className="text-red-400 shrink-0 mt-0.5"/> "Bertanggung jawab atas pengembangan backend perusahaan..."</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-xl border border-green-200">
                        <p className="flex gap-2 text-green-800 text-xs font-bold"><FiCheckCircle className="text-green-500 shrink-0 mt-0.5"/> "Merancang dan mengimplementasikan arsitektur backend yang melayani 100k+ request/detik..."</p>
                      </div>
                      <button className="w-full bg-blue-50 text-blue-600 font-bold text-xs py-2 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors">Terapkan Otomatis</button>
                   </div>
                 </div>

                 <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50 text-sm font-bold flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors">
                   <span className="text-gray-700">Ringkasan Profesional</span> <FiChevronRight className="text-gray-400"/>
                 </div>
              </div>

            </div>
          )}
        </section>
      </main>

    </div>
  );
}