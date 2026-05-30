import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud, FiEdit2, FiRefreshCw, FiZap,
  FiCheckCircle, FiShield, FiFileText, FiTarget, FiBriefcase, FiX,
  FiClock, FiChevronRight, FiActivity
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';
import { analyzeCV, fetchAnalysisHistory } from '../../services/api';

// Konfigurasi animasi seragam
// eslint-disable-next-line no-unused-vars
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

// Helper: Format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper: Get score status
const getScoreStatus = (score) => {
  if (score >= 80) return { label: 'Sangat Baik', color: 'emerald', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' };
  if (score >= 60) return { label: 'Cukup', color: 'amber', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' };
  return { label: 'Optimasi', color: 'rose', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100' };
};

export default function NewAnalysis() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);

  // State untuk input manual
  const [pengalaman, setPengalaman] = useState('');
  const [keahlian, setKeahlian] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch analysis history on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await fetchAnalysisHistory(token, 1, 10);
        // Response: { success, data: [...], meta: { page, limit, total } }
        const historyData = data?.data || [];
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  // Handle file change dengan Validasi 1MB
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setError('Ukuran file maksimal adalah 1MB untuk menghemat beban server.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  // BUG #2 FIX: FLOW C — User login analisis baru → /cv/analyze → polling /cv/status/:task_id
  const handleStartAnalysis = async () => {
    // Validasi berdasarkan Tab Aktif
    if (activeTab === 'upload' && !file) {
      setError('Mohon pilih file CV terlebih dahulu');
      return;
    }

    if (activeTab === 'manual' && (pengalaman.trim().length < 5 || keahlian.trim().length < 5)) {
      setError('Mohon lengkapi data pengalaman dan keahlian Anda.');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      let task_Id = null;

      if (activeTab === 'upload') {
        // Panggil /cv/analyze (bukan /cv/preview) — sesuai FLOW C arsitektur
        task_Id = await analyzeCV(token, file, null);
      } else {
        // Gabungkan teks manual terstruktur sebelum dikirim ke AI
        const manualData = `Pengalaman Kerja:\n${pengalaman}\n\nDaftar Keahlian:\n${keahlian}`;
        task_Id = await analyzeCV(token, null, manualData);
      }

      if (!task_Id) {
        throw new Error('Server tidak mengembalikan task_id. Silakan coba lagi.');
      }

      // Navigasi ke halaman hasil dengan membawa taskId untuk polling
      // Menggunakan query param ?mode=authenticated&taskId= untuk kejelasan routing
      // TIDAK menyimpan ke sessionStorage karena ini alur user terautentikasi (FLOW C)
      navigate(`/analisis-result?mode=authenticated&taskId=${task_Id}`);

    } catch (err) {
      setError(err.message || 'Gagal memproses analisis profil Anda. Silakan coba lagi.');
      setIsAnalyzing(false);
      console.error('Analysis error:', err);
    }
  };

  // Logika pengecekan validasi form untuk mematikan tombol
  const isFormValid = activeTab === 'upload'
    ? !!file
    : (pengalaman.trim().length >= 5 && keahlian.trim().length >= 5);

  return (
    <div className="max-w-7xl mx-auto pb-12 selection:bg-blue-500/10 selection:text-blue-600 animate-fadeIn">

      {/* --- PAGE HEADER --- */}
      <div className="flex items-center gap-4 mb-8 text-left">
        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-950/15 border border-slate-800">
          <BsStars size={22} className="text-amber-400 animate-pulse" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Analisis Baru</h1>
          <p className="text-sm text-slate-500 font-medium">Unggah CV baru Anda untuk mengevaluasi kelayakan karir secara menyeluruh.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* KOLOM KIRI (Area Input Utama) */}
        <div className="lg:w-2/3">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-slate-200/60 shadow-lg shadow-slate-200/30"
          >

            {/* Progress Tracker (Premium Design) */}
            <div className="flex items-center justify-between mb-8 relative hidden sm:flex px-2 select-none">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>
              <div className="flex items-center gap-2.5 bg-white pr-5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-md border border-slate-800">1</div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Data CV</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white px-5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200">2</div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Analisis AI</span>
              </div>
              <div className="flex items-center gap-2.5 bg-white pl-5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs border border-slate-200">3</div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Hasil Penuh</span>
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
                          className="flex items-center gap-4 bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm w-full max-w-sm cursor-default animate-fadeIn"
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
                          <h3 className="text-base font-bold text-slate-900 mb-1 tracking-tight">Drag & Drop CV baru Anda di sini</h3>
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
                    className="space-y-5 text-left"
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
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || !isFormValid}
              className={`w-full font-bold py-4 rounded-2xl shadow-md transition-all flex justify-center items-center gap-2 cursor-pointer text-sm ${isAnalyzing || !isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/10'}`}
            >
              {isAnalyzing ? (
                <><FiRefreshCw className="animate-spin" size={18} /> Mengirim ke Antrian AI...</>
              ) : (
                <><FiZap size={18} /> Mulai Analisis Penuh</>
              )}
            </button>
            <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wide">
              Hasil analisis akan menyajikan evaluasi skor, gap keahlian, dan rekomendasi lowongan secara terperinci.
            </p>

          </motion.div>
        </div>

        {/* KOLOM KANAN (Riwayat & Widget Tambahan) */}
        <div className="lg:w-1/3 space-y-6 text-left shrink-0">

          {/* DAFTAR RIWAYAT ANALISIS - INTERAKTIF */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white">
                  <FiActivity size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Riwayat Analisis</h3>
                  <p className="text-xs text-slate-400">Terakhir dianalisis</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/riwayat')}
                className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Lihat Semua
                <FiChevronRight size={14} />
              </button>
            </div>

            <div className="p-4">
              {loadingHistory ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FiTarget size={24} className="text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium mb-2">Belum ada analisis sebelumnya</p>
                  <p className="text-xs text-slate-400">Upload CV untuk memulai analisis pertama</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.slice(0, 4).map((item, idx) => {
                    const score = Math.round(item.match_score || 0);
                    const status = getScoreStatus(score);
                    return (
                      <motion.div
                        key={item.id || idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => navigate(`/riwayat/${item.id}`)}
                        className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${status.bg} ${status.text} border ${status.border}`}>
                          <FiTarget size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                            {item.job_title_snapshot || 'Analisis CV'}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400">{formatDate(item.analyzed_at)}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-xs text-slate-400">{item.company_snapshot?.length || 0} perusahaan</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-lg font-black ${status.color === 'emerald' ? 'text-emerald-600' : status.color === 'amber' ? 'text-amber-600' : 'text-rose-600'}`}>
                            {score}
                          </div>
                          <p className="text-[10px] text-slate-400">poin</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* REAL-TIME SCAN METRICS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-6 rounded-2xl border border-slate-700 text-white relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-4">
                 <BsStars className="text-amber-400" />
                 <h3 className="font-bold text-sm">Yang Anda Dapatkan</h3>
               </div>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-blue-400 shrink-0">
                     <FiZap size={16} />
                   </div>
                   <p className="text-xs text-slate-300">Skor kecocokan 0-100</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-emerald-400 shrink-0">
                     <FiCheckCircle size={16} />
                   </div>
                   <p className="text-xs text-slate-300">Analisis Skill Match & Gap</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-purple-400 shrink-0">
                     <FiFileText size={16} />
                   </div>
                   <p className="text-xs text-slate-300">Saran Perbaikan AI</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-amber-400 shrink-0">
                     <FiBriefcase size={16} />
                   </div>
                   <p className="text-xs text-slate-300">Top 20 Rekomendasi Kerja</p>
                 </div>
               </div>
             </div>
          </motion.div>

          {/* TIPS ATS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm"
          >
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <BsLightbulbFill className="text-amber-500" /> Tips Lolos ATS
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={14} />
                <p className="text-xs text-slate-600 leading-relaxed">Gunakan format PDF satu kolom agar parser teks backend AI kami bekerja optimal.</p>
              </div>
              <div className="flex items-start gap-2">
                <FiShield className="text-blue-500 shrink-0 mt-0.5" size={14} />
                <p className="text-xs text-slate-600 leading-relaxed">Sertakan kata kunci keahlian yang relevan dengan posisi yang Anda incar.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}