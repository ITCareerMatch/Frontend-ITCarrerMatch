import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud, FiEdit2, FiFileText, FiCheckCircle,
  FiArrowLeft, FiZap, FiTarget, FiRefreshCw, FiShield, FiBriefcase, FiX,
  FiActivity
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';
import { uploadCV } from '../../services/api';
import CVStorage from '../../services/cvStorage';

// Animasi Konfigurasi Reusable
// eslint-disable-next-line no-unused-vars
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

// eslint-disable-next-line no-unused-vars
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function PreLoginFlow() {
  const navigate = useNavigate();
  
  // Pengecekan status login
  const isLoggedIn = !!localStorage.getItem('access_token');

  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  
  // State dipecah seperti di NewAnalysis
  const [pengalaman, setPengalaman] = useState('');
  const [keahlian, setKeahlian] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setError('Mohon maaf, ukuran file maksimal adalah 1MB untuk menghemat beban server.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    // Validasi berdasarkan Tab Aktif
    if (activeTab === 'upload' && !file) {
      setError('Mohon pilih file CV terlebih dahulu');
      return;
    }

    if (activeTab === 'manual' && (pengalaman.trim().length < 5 || keahlian.trim().length < 5)) {
      setError('Mohon lengkapi data pengalaman dan keahlian Anda.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let apiResult = null;

      if (activeTab === 'upload') {
        apiResult = await uploadCV(file, null);
      } else {
        // Menggabungkan teks agar terstruktur untuk backend
        const manualData = `Pengalaman Kerja:\n${pengalaman}\n\nDaftar Keahlian:\n${keahlian}`;
        apiResult = await uploadCV(null, manualData);
      }

      // Simpan temp_token ke CVStorage service
      const tempToken = apiResult?.temp_token;
      if (tempToken) {
        CVStorage.saveGuestTempToken(tempToken);
      }

      // Lanjut ke halaman hasil analisis dengan tempToken di URL
      navigate(`/analisis-result?mode=guest&tempToken=${tempToken}`); 

    } catch (err) {
      setError(err.message || 'Gagal memproses profil Anda. Silakan coba lagi.');
      console.error('CV API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Logika pengecekan validasi form untuk mematikan tombol
  const isFormValid = activeTab === 'upload' 
    ? !!file 
    : (pengalaman.trim().length >= 5 && keahlian.trim().length >= 5);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20 relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Dekorasi Grid Vercel & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.25] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* --- HEADER --- */}
      <header className="flex justify-between items-center h-20 px-6 md:px-12 lg:px-16 border-b border-slate-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3 font-bold text-xl text-slate-900 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl opacity-20 blur-md group-hover:opacity-40 transition-opacity duration-300"></div>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain relative rounded-2xl transition-transform duration-500 group-hover:rotate-6" />
          </div>
          <span className="bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent font-extrabold tracking-tight">
            ITCareerMatch
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-slate-900 text-white hover:bg-slate-800 px-4.5 py-2 rounded-2xl text-xs font-bold transition-colors cursor-pointer border border-slate-800 shadow-sm active:scale-95"
            >
              Ke Dashboard
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="bg-slate-50 text-slate-700 hover:text-slate-950 px-4.5 py-2 rounded-2xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60 shadow-sm active:scale-95"
            >
              Masuk
            </button>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10">
        
        {/* --- TOMBOL BATAL DI ATAS JUDUL UTAMA --- */}
        <motion.div 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <button 
            type="button" 
            onClick={() => navigate('/')} 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider group cursor-pointer"
          >
            <FiArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" /> Kembali ke Beranda
          </button>
        </motion.div>

        {/* --- PAGE TITLE --- */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-950/15 shrink-0 border border-slate-800">
            <BsStars size={22} className="text-amber-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">Analisis CV Instan</h1>
            <p className="text-sm text-slate-500 font-medium">Cek skor profil Anda sekarang, gratis tanpa registrasi.</p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* KOLOM KIRI (Area Input Utama) */}
          <div className="lg:w-2/3">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-lg shadow-slate-200/40"
            >
              
              {/* Progress Tracker (Premium Design) */}
              <div className="flex items-center justify-between mb-8 relative hidden sm:flex px-2 select-none">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
                <div className="flex items-center gap-2.5 bg-white pr-5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-md border border-slate-800">1</div>
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Input Data</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white px-5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200">2</div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Scan AI</span>
                </div>
                <div className="flex items-center gap-2.5 bg-white pl-5 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200">3</div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Hasil</span>
                </div>
              </div>

              {/* Toggle Tabs (Vercel Style) */}
              <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200 shadow-inner mb-8">
                <button 
                  onClick={() => { setActiveTab('upload'); setError(''); }} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'upload' ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 font-extrabold' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'}`}
                >
                  <FiUploadCloud size={16}/> Unggah File
                </button>
                <button 
                  onClick={() => { setActiveTab('manual'); setError(''); }} 
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${activeTab === 'manual' ? 'bg-white text-slate-900 shadow-md border border-slate-200/80 font-extrabold' : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'}`}
                >
                  <FiEdit2 size={16}/> Isi Manual
                </button>
              </div>

              {/* Konten Tab */}
              <div className="mb-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'upload' ? (
                    <motion.div
                      key="upload-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50/50 hover:border-slate-400 transition-colors cursor-pointer group block">
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept=".pdf"
                          className="hidden"
                        />
                        {file ? (
                          <div 
                            className="flex items-center gap-4 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm cursor-default" 
                            onClick={(e) => e.preventDefault()}
                          >
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600 border border-blue-100"><FiFileText size={22} /></div>
                            <div className="text-left flex-1 truncate">
                              <p className="font-bold text-sm text-slate-900 truncate">{file.name}</p>
                              <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1 mt-1 uppercase tracking-wider"><FiCheckCircle /> Siap dianalisis</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setFile(null);
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                            >
                              <FiX size={18} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="w-14 h-14 bg-slate-50 text-slate-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 group-hover:text-slate-800 group-hover:border-slate-300 transition-all border border-slate-200">
                              <FiUploadCloud size={24} />
                            </div>
                            <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">Drag & Drop CV Anda di sini</h3>
                            <p className="text-xs text-slate-500 mb-6 font-semibold">atau klik untuk memilih file</p>
                            <div className="flex gap-2.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                              <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">PDF</span>
                              <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">Maks 1MB</span>
                            </div>
                          </>
                        )}
                      </label>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="manual-tab"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Pengalaman Kerja</label>
                        <textarea
                          rows="5"
                          value={pengalaman}
                          onChange={(e) => setPengalaman(e.target.value)}
                          placeholder="Contoh: 3 tahun sebagai Frontend Developer di PT ABC..."
                          className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all resize-none font-semibold text-slate-700"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Daftar Keahlian</label>
                        <textarea
                          rows="3"
                          value={keahlian}
                          onChange={(e) => setKeahlian(e.target.value)}
                          placeholder="Contoh: React, TypeScript, Node.js, Figma..."
                          className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none text-sm bg-slate-50/50 focus:bg-white transition-all resize-none font-semibold text-slate-700"
                        ></textarea>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-600 flex items-center gap-2">
                  <FiTarget className="shrink-0 text-rose-500" size={16}/> {error}
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={loading || !isFormValid}
                className={`w-full font-bold py-4 rounded-2xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer text-sm ${loading || !isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'}`}
              >
                {loading ? (
                  <><FiRefreshCw className="animate-spin" size={18} /> Memproses Profil Anda...</>
                ) : (
                  <><FiZap size={18} /> Mulai Analisis Instan</>
                )}
              </button>
              <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wide">
                Tidak ada data yang disimpan secara permanen pada sesi guest ini.
              </p>

            </motion.div>
          </div>

          {/* KOLOM KANAN (Widget Tambahan) */}
          <div className="lg:w-1/3 space-y-6">
            
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden border border-slate-800">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
               <h3 className="font-bold mb-4 relative z-10 text-base flex items-center gap-2"><BsStars className="text-amber-400 animate-pulse"/> Yang Anda Dapatkan</h3>
               <ul className="space-y-3.5 text-xs text-slate-400 relative z-10 font-semibold">
                 <li className="flex items-center gap-3"><div className="bg-white/5 p-2 rounded-xl text-blue-400 border border-white/5"><FiZap size={14}/></div> Skor kecocokan instan (0-100)</li>
                 <li className="flex items-center gap-3"><div className="bg-white/5 p-2 rounded-xl text-emerald-400 border border-white/5"><FiCheckCircle size={14}/></div> Identifikasi Skill yang Cocok</li>
                 <li className="flex items-center gap-3"><div className="bg-white/5 p-2 rounded-xl text-rose-400 border border-white/5"><FiTarget size={14}/></div> Analisis Skill Gap (Kekurangan)</li>
                 <li className="flex items-center gap-3"><div className="bg-white/5 p-2 rounded-xl text-purple-400 border border-white/5"><FiBriefcase size={14}/></div> Intip Rekomendasi Lowongan</li>
               </ul>
            </div>

            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm">
              <h3 className="font-bold text-slate-950 text-sm mb-4 flex items-center gap-2"><BsLightbulbFill className="text-amber-400 shrink-0"/> Tips Optimalisasi</h3>
              <ul className="space-y-3 text-xs text-slate-500 font-medium">
                <li className="flex items-start gap-2"><FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5"/> <span>Gunakan format PDF satu kolom agar parser teks backend AI kami bekerja optimal.</span></li>
                <li className="flex items-start gap-2"><FiShield className="text-blue-500 shrink-0 mt-0.5"/> <span>Sertakan kata kunci keahlian yang relevan dengan posisi yang Anda incar.</span></li>
                <li className="flex items-start gap-2"><FiActivity className="text-rose-500 shrink-0 mt-0.5"/> <span>CV harus berupa dokumen PDF murni berbasis teks, bukan hasil scan gambar maupun format JPG/PNG yang dikonversi ke PDF.</span></li>
                <li className="flex items-start gap-2"><FiFileText className="text-purple-500 shrink-0 mt-0.5"/> <span>Hindari menggunakan tabel, kolom ganda, atau grafik yang dapat menghambat pembacaan teks oleh sistem.</span></li>
                <li className="flex items-start gap-2"><FiZap className="text-amber-500 shrink-0 mt-0.5"/> <span>Pastikan informasi input manual berisi pengalaman kerja (paragraf), dan keahlian (dipisahkan dengan koma) tersusun dengan rapi dan jelas.</span></li>
              </ul>
            </div>

            <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl flex items-start gap-3">
              <FiShield className="text-blue-600 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1 uppercase tracking-wide">Keamanan Terjamin</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Dokumen yang Anda unggah sebagai Guest tidak akan kami simpan secara permanen di database kami demi perlindungan privasi.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}