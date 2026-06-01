import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiMapPin, FiBriefcase, FiDollarSign, FiClock,
  FiExternalLink, FiXCircle, FiInfo, FiMap, FiRefreshCw, FiTrendingUp, FiCheckCircle,
  FiTarget, FiLock, FiUnlock
} from 'react-icons/fi';
import { fetchJobDetail, fetchAnalysisHistory } from '../../services/api';

// Konfigurasi animasi seragam
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

export default function JobDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  
  // DETEKSI ID OTOMATIS
  const jobId = params.id || params.jobId || params.job_id || Object.values(params)[0];
  
  // Cek apakah diakses dari dalam dasbor secara aman melalui URL
  const isDashboard = location.pathname.startsWith('/dashboard');
  const isLoggedIn = !!localStorage.getItem('access_token');

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  useEffect(() => {
    const fetchJobAndAnalysis = async () => {
      try {
        if (!jobId) throw new Error("ID tidak ditemukan di URL");

        const response = await fetchJobDetail(jobId);

        const jobData = response?.data || response;

        if (!jobData || (!jobData.id && !jobData.title)) {
          throw new Error("Pekerjaan tidak ditemukan di server");
        }

        setJob(jobData);

        // Ambil data analysis jika user sudah login
        const token = localStorage.getItem('access_token');
        if (token) {
          setAnalysisLoading(true);
          try {
            const history = await fetchAnalysisHistory(token, 1, 20);
            const relatedAnalysis = (history?.data || []).find(a => a.job_id === jobId);
            if (relatedAnalysis) {
              setAnalysisData(relatedAnalysis);
            }
          } catch (e) {
            console.warn('Gagal fetch analysis:', e);
          } finally {
            setAnalysisLoading(false);
          }
        }

      } catch (error) {
        console.error('Error proses detail job:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobAndAnalysis();
  }, [jobId]);

  // Fungsi navigasi mundur pintar
  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(isLoggedIn ? '/dashboard' : '/lowongan');
    }
  };

  // Helper untuk format rentang usia secara cerdas (Fall-back ke age_note)
  const renderAgeRange = () => {
    if (job?.min_age && job?.max_age) return `${job.min_age} - ${job.max_age} tahun`;
    if (job?.min_age) return `Minimal ${job.min_age} tahun`;
    if (job?.max_age) return `Maksimal ${job.max_age} tahun`;
    if (job?.age_note) return job.age_note;
    return 'Tidak ada batasan usia';
  };

  // Helper: Get score status
  const getScoreStatus = (score) => {
    if (score >= 80) return { label: 'Kompatibilitas Tinggi', color: 'emerald' };
    if (score >= 60) return { label: 'Kompatibilitas Sedang', color: 'amber' };
    return { label: 'Perlu Optimasi', color: 'rose' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative select-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.2] -z-10 pointer-events-none" />
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menyiapkan rincian pekerjaan...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative p-6 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.2] -z-10 pointer-events-none" />
        <div className="w-16 h-16 bg-rose-500/5 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-rose-500/10">
          <FiXCircle size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Pekerjaan Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6 text-xs font-semibold max-w-xs leading-relaxed">
          {error || 'Lowongan pekerjaan mungkin telah ditutup atau tidak tersedia kembali.'}
        </p>
        <div className="text-center">
          <button
            onClick={handleGoBack}
            className="bg-white border border-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer text-xs uppercase tracking-wider"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full relative selection:bg-blue-500/10 selection:text-blue-600 text-left">
      
      {/* --- 1. INJEKSI CSS UNTUK MENYEMBUNYIKAN SIDEBAR DASBOR (Hanya aktif jika dibuka di luar dasbor) --- */}
      {!isDashboard && (
        <style>{`
          aside { display: none !important; }
          header:not(.z-50) { display: none !important; }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100vw !important;
            min-height: 100vh !important;
            background-color: rgb(248, 250, 252) !important;
          }
          .detail-container {
            padding-top: 1rem !important;
            padding-bottom: 4rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            max-width: 80rem !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
          @media (min-width: 640px) {
            .detail-container {
              padding-top: 1rem !important;
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
            }
          }
        `}</style>
      )}

      {/* --- 2. NAVBAR PERSIS PRELOGINFLOW (Hanya muncul jika diakses di luar dasbor) --- */}
      {!isDashboard && (
        <header className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-16 border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm mb-8">
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            <div>
              <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain" />
            </div>
            {/* Teks logo ITCareerMatch dibiarkan tetap muncul dengan ukuran responsif yang aman */}
            <span className="inline-block tracking-tight text-slate-900 text-base sm:text-lg">ITCareerMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(isLoggedIn ? '/dashboard' : '/login')} 
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100 shadow-sm whitespace-nowrap"
            >
              {isLoggedIn ? 'Dashboard' : 'Masuk'}
            </button>
          </div>
        </header>
      )}

      {/* --- 3. WRAPPER CONTAINER UTAMA --- */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className={`${isDashboard ? 'w-full' : 'detail-container'}`}
      >
        {/* Tombol kembali yang melayang di atas judul (Batal / Kembali) */}
        <div className="text-left mb-6">
          <button 
            onClick={handleGoBack} 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-wider group cursor-pointer"
          >
            <FiArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" /> Kembali ke Daftar
          </button>
        </div>

        {/* --- HERO JOB HEADER CARD --- */}
        <motion.div 
          variants={fadeInUp}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-lg shadow-slate-200/20 mb-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="flex gap-4 sm:gap-5 items-start text-left relative z-10 w-full lg:w-auto">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/15">
               <span className="text-lg sm:text-2xl font-black">{job?.title ? job.title.substring(0, 2).toUpperCase() : 'IT'}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-1.5 break-words">{job?.title}</h1>
              <p className="text-slate-700 font-bold text-xs sm:text-sm mb-4 flex items-center gap-1.5"><FiBriefcase className="text-slate-400 shrink-0"/> {job?.company_name}</p>
              <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg"><FiMapPin className="shrink-0" /> {job?.city || 'Remote'}{job?.province ? `, ${job.province}` : ''}</span>
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg"><FiBriefcase className="shrink-0" /> {job?.job_type || 'Full-Time'} ({job?.work_system || 'WFO'})</span>
                <span className="flex items-center gap-1 bg-emerald-500/5 text-emerald-700 px-2.5 py-1.5 rounded-lg border border-emerald-500/10 shadow-sm">
                  <FiDollarSign className="shrink-0" /> {job?.salary_raw || 'Gaji Kompetitif'}
                </span>
                <span className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-lg"><FiClock className="shrink-0" /> {job?.created_at ? new Date(job.created_at).toLocaleDateString('id-ID') : '-'}</span>
              </div>
            </div>
          </div>
          
          {/* Tombol Aksi Lamaran */}
          <div className="w-full lg:w-auto shrink-0 relative z-10 text-left">
            <button 
              onClick={() => window.open(job?.external_url, '_blank')} 
              className="w-full lg:w-auto bg-slate-900 text-white font-bold px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer shadow-md"
            >
              Lamar Pekerjaan Ini <FiExternalLink />
            </button>
          </div>
        </motion.div>

        {/* --- GRID 4-KOLOM KRITERIA KANDIDAT --- */}
        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <motion.div whileHover={{ y: -3 }} className="bg-white border border-slate-200/60 p-4 rounded-2xl text-left shadow-sm">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1.5">Pendidikan</p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">{job?.education_level || '-'}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-white border border-slate-200/60 p-4 rounded-2xl text-left shadow-sm">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1.5">Batasan Usia</p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight truncate">{renderAgeRange()}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-white border border-slate-200/60 p-4 rounded-2xl text-left shadow-sm">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1.5">Gender</p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight capitalize truncate">{job?.gender_required || '-'}</p>
          </motion.div>
          <motion.div whileHover={{ y: -3 }} className="bg-white border border-slate-200/60 p-4 rounded-2xl text-left shadow-sm">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mb-1.5">Lokasi Kerja</p>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight capitalize truncate">{job?.city || 'Remote'}</p>
          </motion.div>
        </motion.div>

        {/* --- ANALISIS CV CARD --- */}
        <motion.div variants={fadeInUp} className="mb-8">
          {analysisLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-xl animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-100 rounded w-1/3 mb-2 animate-pulse" />
                  <div className="h-3 bg-slate-100 rounded w-1/4 animate-pulse" />
                </div>
              </div>
            </div>
          ) : analysisData ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-6 relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 text-amber-400 rounded-xl flex items-center justify-center">
                      <FiTarget size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Skor Kecocokan CV</h3>
                      <p className="text-xs text-slate-400">Analisis dari CV Anda</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    getScoreStatus(analysisData.match_score).color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                    getScoreStatus(analysisData.match_score).color === 'amber' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-rose-500/20 text-rose-400'
                  }`}>
                    {getScoreStatus(analysisData.match_score).label}
                  </span>
                </div>

                {/* Score Ring */}
                <div className="flex items-center gap-6">
                  <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                      <motion.circle
                        initial={{ strokeDashoffset: 251 }}
                        animate={{ strokeDashoffset: 251 - (analysisData.match_score / 100) * 251 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={`${analysisData.match_score >= 80 ? 'text-emerald-400' : analysisData.match_score >= 60 ? 'text-amber-400' : 'text-rose-400'}`}
                        strokeWidth="8"
                        strokeDasharray="251"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-white">{Math.round(analysisData.match_score)}</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3">
                      {/* Skill Match */}
                      <div className="flex-1 min-w-[140px]">
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                          <FiCheckCircle size={15} className="text-emerald-400" /> Skill Cocok
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(analysisData.skill_match || []).length > 0 ? (
                            analysisData.skill_match.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-lg">
                                {typeof skill === 'string' ? skill : skill?.name || 'Tidak Ada Skill yang cocok'}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500">-</span>
                          )}
                        </div>
                      </div>

                      {/* Skill Gap */}
                      <div className="flex-1 min-w-[140px]">
                        <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                          <FiXCircle size={15} className="text-rose-400" /> Skill Kurang
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {(analysisData.skill_gap || []).length > 0 ? (
                            analysisData.skill_gap.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg">
                                {typeof skill === 'string' ? skill : skill?.name || 'Tidak Ada Skill yang kurang'}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-500">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insight */}
                {analysisData.ai_insight && (
                  <div className="mt-4 p-3 bg-white/5 rounded-xl">
                    <p className="text-[12px] text-slate-400 font-bold uppercase tracking-wider mb-1">Insight AI</p>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {Array.isArray(analysisData.ai_insight) ? analysisData.ai_insight.join(' ') : analysisData.ai_insight}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-200 rounded-2xl border border-slate-200 p-6 text-center relative overflow-hidden">
              {/* Lock icon decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/50 rounded-full blur-2xl" />

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm"
                >
                  <FiLock size={28} className="text-slate-400" />
                </motion.div>

                <h3 className="font-bold text-slate-700 text-sm mb-2">Skor Kecocokan Tertutup</h3>
                <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto leading-relaxed">
                  Silakan login dan cek skor Anda untuk melihat skor kecocokan CV terhadap lowongan ini
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3"
                >
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md cursor-pointer border border-blue-700/50"
                  >
                    <FiUnlock size={14} />
                    Login Sekarang
                  </button>
                  <button
                    onClick={() => navigate('/cek-skor')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors shadow-sm border border-slate-200 cursor-pointer"
                  >
                    <FiTarget size={14} />
                    Cek Skor
                  </button>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>

        {/* --- DUA KOLOM SPESIFIKASI --- */}
        <div className="flex flex-col lg:flex-row gap-8 text-left">
          
          {/* --- KOLOM KIRI --- */}
          <div className="w-full lg:w-2/3 space-y-8">
            <motion.div variants={fadeInUp} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/60 shadow-lg shadow-slate-200/20">
              <h3 className="font-extrabold text-slate-900 text-sm mb-4 uppercase tracking-wider">Persyaratan Pekerjaan</h3>
              <p className="text-sm text-slate-600 mb-8 leading-relaxed whitespace-pre-line font-medium">{job?.requirements || 'Tidak ada deskripsi persyaratan khusus dari perusahaan.'}</p>
              
              <div className="pt-6 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-950 mb-4 text-xs uppercase tracking-wider flex items-center gap-2"><FiCheckCircle className="text-blue-500" /> Skills Utama</h4>
                <div className="flex flex-wrap gap-2.5">
                  {job?.skills && job.skills.length > 0 ? (
                    job.skills.map((skill, index) => (
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        key={index} 
                        className="bg-white border border-slate-200 hover:border-blue-500/40 hover:text-blue-600 text-slate-500 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                      >
                        {skill}
                      </motion.span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 font-bold uppercase tracking-wider">Tidak ada keahlian khusus dicantumkan</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* --- KOLOM KANAN --- */}
          <div className="w-full lg:w-1/3 space-y-6">
            <motion.div variants={fadeInUp} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/20">
              <h3 className="font-extrabold text-slate-900 mb-5 text-sm uppercase tracking-wider">Rincian Pekerjaan</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2 uppercase tracking-wider"><FiTrendingUp className="text-blue-500" /> Gaji Minimal</span>
                  <span className="font-extrabold text-slate-900">{job?.salary_min > 0 ? `Rp ${job.salary_min.toLocaleString('id-ID')}` : '-'}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2 uppercase tracking-wider"><FiBriefcase className="text-blue-500" /> Gaji Maksimal</span>
                  <span className="font-extrabold text-slate-900">{job?.salary_max > 0 ? `Rp ${job.salary_max.toLocaleString('id-ID')}` : '-'}</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs sm:text-sm font-semibold">
                  <span className="text-slate-400 flex items-center gap-2 uppercase tracking-wider"><FiInfo className="text-blue-500" /> Sistem Kerja</span>
                  <span className="font-extrabold text-blue-600 bg-blue-500/5 px-3 py-1.5 rounded-lg capitalize border border-blue-500/10 shadow-sm">{job?.work_system || '-'}</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}