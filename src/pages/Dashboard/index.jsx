import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  FiMapPin, FiBriefcase, FiClock, FiCheckCircle, 
  FiActivity, FiTarget, FiPlusCircle, FiArrowRight, FiFileText, FiShield, FiAlertCircle
} from 'react-icons/fi';
import { BsStars, BsLightningChargeFill } from 'react-icons/bs';
import { fetchUserProfile, fetchJobRecommendations, fetchAnalysisHistory } from '../../services/api';

// Konfigurasi animasi seragam
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
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

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // State untuk Rekomendasi
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [jobsError, setJobsError] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);

  // State untuk Riwayat Analisis
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  // Paginasi Klien (Frontend-side pagination)
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Disesuaikan agar layout grid lebih seimbang
  const totalPages = Math.max(1, Math.ceil(jobRecommendations.length / itemsPerPage));

  // 1. Load Data Paralel (Profil, Rekomendasi, Riwayat)
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      // Fetch Profile
      try {
        const profileData = await fetchUserProfile(token);
        setProfile(profileData);
      } catch (err) {
        console.error('Gagal memuat profil:', err);
      } finally {
        setProfileLoading(false);
      }

      // Fetch Jobs
      try {
        const jobsData = await fetchJobRecommendations(token);
        setJobRecommendations(Array.isArray(jobsData) ? jobsData : (jobsData?.data || []));
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setJobsError('AI kami sedang memproses kualifikasi Anda. Mohon tunggu sejenak atau muat ulang halaman.');
      } finally {
        setJobsLoading(false);
      }

      // Fetch History
      try {
        const historyData = await fetchAnalysisHistory(token, 1, 5); // Ambil 5 terbaru
        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error('Gagal memuat riwayat:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Fungsi dinamis untuk nama sapaan
  const getProfileDisplayName = () => {
    if (!profile) return 'Pengguna';
    if (profile.name) return profile.name;
    if (profile.email) return profile.email.split('@')[0]; // Fallback ke nama email
    return 'Pengguna';
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentJobs = jobRecommendations.slice(startIndex, startIndex + itemsPerPage);
  const latestScore = history.length > 0 ? Math.round(history[0].match_score || history[0].score || 0) : 0;

  // Visual Helper: Kategori Kesehatan CV (CV Health Gauge)
  const getCvHealthBadge = (score) => {
    if (score >= 80) return { label: 'Sangat Siap Kerja', color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' };
    if (score >= 60) return { label: 'Cukup Kompetitif', color: 'text-amber-500 bg-amber-500/5 border-amber-500/10' };
    return { label: 'Butuh Optimasi Segera', color: 'text-rose-500 bg-rose-500/5 border-rose-500/10' };
  };

  const cvHealth = getCvHealthBadge(latestScore);

  return (
    <div className="max-w-7xl mx-auto pb-10 selection:bg-blue-500/10 selection:text-blue-600 animate-fadeIn">
      
      {/* 1. HEADER / BANNER SELAMAT DATANG (Cyber Dawn Style) */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-950 rounded-3xl p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl border border-slate-900 relative overflow-hidden"
      >
        {/* Vercel-style Dot Matrix Grid & Glowing Blobs */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />
        <div className="absolute -bottom-32 left-10 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 w-full md:w-2/3 mb-6 md:mb-0 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full text-xs font-semibold mb-5 backdrop-blur-md border border-white/10">
            <BsStars className="text-amber-300" /> 
            {profileLoading ? 'Menyelaraskan profil...' : 'Workspace Karir Anda'}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
            Halo, {getProfileDisplayName()}! 👋
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed font-medium">
            {jobRecommendations.length > 0 
              ? `AI kami telah memetakan kompetensi dan menemukan ${jobRecommendations.length} peluang karir yang paling relevan dengan CV Anda.` 
              : 'Sempurnakan kualitas CV Anda di editor dan temukan peluang kerja terbaik yang menanti di depan mata.'}
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
           <button 
             onClick={() => navigate('/analisis-baru')} 
             className="w-full md:w-auto bg-white text-slate-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
           >
             <FiPlusCircle size={18} /> Analisis CV Baru
           </button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================== */}
        {/* KOLOM KIRI (70%): STATISTIK & LOWONGAN      */}
        {/* ========================================== */}
        <div className="lg:w-2/3 flex flex-col gap-8">
          
          {/* STATISTIK CEPAT (Quick Stats) */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-center">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-3"><FiBriefcase size={18} /></div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Rekomendasi Kerja</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{jobsLoading ? '-' : jobRecommendations.length} <span className="text-xs font-semibold text-slate-400">Peluang</span></h3>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-center">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mb-3"><FiActivity size={18} /></div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Skor CV Terakhir</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{historyLoading ? '-' : latestScore} <span className="text-xs font-semibold text-slate-400">/ 100</span></h3>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-white/70 backdrop-blur-md p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col justify-center col-span-2 sm:col-span-1">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center mb-3"><FiTarget size={18} /></div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Analisis</p>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{historyLoading ? '-' : history.length} <span className="text-xs font-semibold text-slate-400">Dokumen</span></h3>
            </motion.div>
          </motion.div>

          {/* BARU: CV QUALITY HEALTH METER (Sangat Menarik & Interaktif) */}
          {!historyLoading && history.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200/60 shadow-sm p-6 relative overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">Kesehatan Kualifikasi CV Anda</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Analisis instan berdasarkan skor kualifikasi pindaian terakhir Anda.</p>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${cvHealth.color}`}>
                  {cvHealth.label}
                </div>
              </div>

              {/* Bilah kemajuan horizontal */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${latestScore}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${latestScore >= 80 ? 'from-emerald-500 to-teal-400' : latestScore >= 60 ? 'from-amber-500 to-orange-400' : 'from-rose-500 to-red-400'}`}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold leading-relaxed mt-2 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                <FiAlertCircle className="text-blue-500 shrink-0" size={16} />
                <span>
                  {latestScore >= 80 
                    ? "CV Anda sangat kuat! Siap bersaing di bursa kerja industri digital nasional. Teruskan pertahanan." 
                    : latestScore >= 60 
                      ? "Cukup baik, namun beberapa keahlian kunci masih terlewat. Gunakan menu Editor untuk menambahkan kompetensi yang direkomendasikan AI." 
                      : "Kualitas resume Anda masih jauh di bawah standar ATS. Sangat disarankan untuk segera mengoptimalkan struktur kalimat di menu Editor."}
                </span>
              </div>
            </motion.div>
          )}

          {/* DAFTAR REKOMENDASI LOWONGAN */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <BsLightningChargeFill className="text-amber-500 animate-pulse" /> Top Matches Untuk Anda
              </h3>
              {jobRecommendations.length > itemsPerPage && (
                <button onClick={() => navigate('/daftar-lowongan')} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Lihat Semua <FiArrowRight />
                </button>
              )}
            </div>

            {jobsLoading ? (
              <div className="rounded-3xl p-16 bg-white border border-slate-200/60 shadow-sm flex flex-col items-center justify-center text-slate-500">
                 <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                 <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Menyinkronkan peluang kerja...</p>
              </div>
            ) : jobsError ? (
              <div className="rounded-3xl p-8 bg-amber-500/5 border border-amber-500/10 shadow-sm flex items-start gap-4 text-amber-800">
                 <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 shrink-0"><FiActivity size={22} /></div>
                 <div className="text-left">
                   <h4 className="font-extrabold text-base mb-1">Sedang Memproses Analisis CV</h4>
                   <p className="text-xs sm:text-sm leading-relaxed opacity-90">{jobsError}</p>
                   <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition-all shadow-md">
                     Muat Ulang Sekarang
                   </button>
                 </div>
              </div>
            ) : jobRecommendations.length === 0 ? (
              <div className="rounded-3xl p-12 bg-white border border-slate-200/60 shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 border border-slate-100"><FiBriefcase size={24}/></div>
                <h4 className="font-bold text-slate-900 mb-2">Belum Ada Rekomendasi</h4>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed font-semibold">Coba lakukan analisis CV baru di atas agar asisten AI kami dapat memetakan keahlian dan menemukan lowongan yang sesuai.</p>
              </div>
            ) : (
              <>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={staggerContainer}
                  className="grid sm:grid-cols-2 gap-5"
                >
                  {currentJobs.map((job) => (
                    <motion.div 
                      key={job.job_id}
                      variants={fadeInUp}
                      whileHover={{ y: -4 }}
                      onClick={() => navigate(`/dashboard/detail/${job.job_id}`)}
                      className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 hover:border-blue-200/80 transition-all cursor-pointer flex flex-col h-full group relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors" />

                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3.5 items-center">
                          <div className="w-11 h-11 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center shrink-0 font-black text-lg shadow-inner group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                             {job.job_title?.substring(0, 1).toUpperCase()}
                          </div>
                          <div className="text-left min-w-0">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">{job.job_title}</h4>
                            <p className="text-[11px] font-semibold text-slate-400 line-clamp-1 mt-1">{job.company}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                         <span className="bg-emerald-500/5 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-lg border border-emerald-500/10 shadow-sm uppercase tracking-wide">
                          {Math.round(job.match_score || 0)}% Match
                         </span>
                         <span className="bg-slate-50 text-slate-500 text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-slate-200/60 flex items-center gap-1">
                          <FiMapPin /> {job.city || 'Indonesia'}
                         </span>
                      </div>

                      <div className="mt-auto pt-4 border-t border-slate-100 text-left text-xs text-slate-500 leading-relaxed line-clamp-2">
                        <strong className="text-slate-700 font-bold">Kecocokan: </strong>{job.ai_insight || 'Kompetensi Anda sesuai dengan kualifikasi.'}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Kontrol Paginasi Sisi Klien */}
                {jobRecommendations.length > itemsPerPage && (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl p-3.5 shadow-sm">
                    <p className="text-xs text-slate-500 font-bold px-2">Halaman {page} dari {totalPages}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        Mundur
                      </button>
                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
                      >
                        Maju
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN (30%): RIWAYAT & INFO WIDGET   */}
        {/* ========================================== */}
        <div className="lg:w-1/3 flex flex-col gap-6 text-left shrink-0">
          
          {/* RIWAYAT ANALISIS (Timeline Style) */}
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm relative overflow-hidden">
            <h3 className="font-extrabold text-slate-900 mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <FiClock className="text-indigo-500" /> Riwayat Analisis
            </h3>

            <div className="space-y-4">
              {historyLoading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-slate-50 rounded-2xl border border-slate-100"></div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 border border-slate-100"><FiFileText size={18} /></div>
                  <p className="text-xs text-slate-500 font-semibold">Belum ada riwayat analisis berkas.</p>
                </div>
              ) : (
                history.slice(0, 3).map((scan, idx) => {
                  const score = Math.round(scan.match_score || scan.score || 0);
                  const isGood = score >= 75;
                  
                  return (
                    <div
                      key={scan.id || idx}
                      onClick={() => navigate(`/analisis-result`, { state: { analysisId: scan.id } })}
                      className="group flex flex-col p-4 rounded-2xl border border-slate-200/60 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-pointer relative overflow-hidden bg-white"
                    >
                      {/* Bar Progress Indicator di bawah kartu riwayat */}
                      <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full">
                        <div className={`h-full ${isGood ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${score}%` }}></div>
                      </div>

                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors line-clamp-1 pr-2">
                          {scan.job_title || scan.job_title_snapshot || 'Analisis CV Umum'}
                        </p>
                        <span className={`text-xs font-black ${isGood ? 'text-emerald-600' : 'text-amber-500'}`}>
                          {score}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">
                        {scan.created_at ? new Date(scan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru saja'}
                      </p>
                    </div>
                  )
                })
              )}
            </div>

            {history.length > 3 && (
              <button 
                onClick={() => navigate('/analisis-baru')}
                className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors uppercase tracking-wider"
              >
                Lihat Semua Riwayat
              </button>
            )}
          </div>

          {/* WIDGET TIPS AI (Glow Violet-Indigo Accent) */}
          <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-6 rounded-3xl border border-slate-800 shadow-xl text-white relative overflow-hidden">
            {/* Background glow overlay */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="font-bold text-sm mb-3.5 flex items-center gap-2 uppercase tracking-wider relative z-10">
              <BsStars className="text-amber-300" /> Tips Lolos ATS AI
            </h3>
            <ul className="space-y-3.5 relative z-10">
              <li className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-semibold">
                <FiCheckCircle className="text-blue-400 shrink-0 mt-0.5" />
                Gunakan *keyword* deskripsi kualifikasi keahlian yang persis sama dengan yang tertera di rincian lowongan kerja.
              </li>
              <li className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed font-semibold">
                <FiCheckCircle className="text-blue-400 shrink-0 mt-0.5" />
                Hindari penggunaan tabel kompleks atau gambar berat pada dokumen PDF agar sistem parser teks AI bekerja sempurna.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}