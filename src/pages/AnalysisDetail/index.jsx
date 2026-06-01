import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiXCircle, FiBriefcase,
  FiClock, FiChevronRight, FiCopy, FiArrowLeft, FiXCircle as FiXCircleAlt,
  FiActivity, FiBarChart2, FiTrendingUp, FiTarget
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAnalysisDetail, fetchAnalysisHistory } from '../../services/api';
import Swal from 'sweetalert2';

// Konfigurasi animasi seragam
// eslint-disable-next-line no-unused-vars
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

// Helper: Format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper: Get score status
const getScoreStatus = (score) => {
  if (score >= 80) return { label: 'Kompatibilitas Tinggi', color: 'emerald' };
  if (score >= 60) return { label: 'Kompatibilitas Sedang', color: 'amber' };
  return { label: 'Perlu Optimasi', color: 'rose' };
};

// Copy to clipboard
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(Array.isArray(text) ? text.join('\n') : text);
  Swal.fire({
    icon: 'success',
    title: 'Disalin!',
    text: 'Berhasil disalin ke clipboard',
    timer: 1500,
    showConfirmButton: false,
  });
};

export default function AnalysisDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  // DETEKSI apakah diakses dari dalam dashboard
  const isDashboard = location.pathname.startsWith('/riwayat');

  const [data, setData] = useState(null);
  const [relatedHistory, setRelatedHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);
      setHistoryLoading(true);

      try {
        // 1. Ambil detail analisis
        const detail = await fetchAnalysisDetail(token, id);
        setData(detail);

        // 2. Ambil riwayat analisis berdasarkan cv_id
        if (detail?.cv_id) {
          try {
            const history = await fetchAnalysisHistory(token, 1, 5, detail.cv_id);
            // Filter out current analysis and get related ones
            const related = (history?.data || []).filter(a => a.id !== id);
            setRelatedHistory(related.slice(0, 5));
          } catch (e) {
            console.warn('Gagal fetch riwayat:', e);
            setRelatedHistory([]);
          }
        } else {
          // Fallback: tidak ada cv_id, kosongkan riwayat
          console.warn('Detail analisis tidak memiliki cv_id');
          setRelatedHistory([]);
        }
      } catch (err) {
        console.error('Gagal memuat detail:', err);
        setError(err.message || 'Gagal memuat data analisis');
      } finally {
        setLoading(false);
        setHistoryLoading(false);
      }
    };

    loadData();
  }, [id, token, navigate]);

  // Fungsi navigasi mundur pintar
  const handleGoBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/riwayat');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.2] -z-10 pointer-events-none" />
        <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat detail analisis...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative p-6 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.2] -z-10 pointer-events-none" />
        <div className="w-16 h-16 bg-rose-500/5 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-rose-500/10">
          <FiXCircleAlt size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Analisis Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6 text-xs font-semibold max-w-xs leading-relaxed">
          {error || 'Riwayat analisis mungkin telah dihapus.'}
        </p>
        <button
          onClick={handleGoBack}
          className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white relative p-6 text-center">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-[0.2] -z-10 pointer-events-none" />
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mb-6">
          <FiCheckCircle size={28} />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Data Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6 text-xs">Analisis tidak ditemukan.</p>
        <button
          onClick={handleGoBack}
          className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  // Extract data dari response API
  // Response: { id, job_title_snapshot, company_snapshot, match_score, analyzed_at, skill_match, skill_gap, ai_insight }
  const score = Math.round(data?.match_score || 0);
  const scoreStatus = getScoreStatus(score);
  const skillMatch = Array.isArray(data?.skill_match) ? data.skill_match : [];
  const skillGap = Array.isArray(data?.skill_gap) ? data.skill_gap : [];
  const aiInsight = data?.ai_insight || '';

  return (
    <div className={`w-full relative selection:bg-blue-500/10 selection:text-blue-600 text-left ${!isDashboard ? 'bg-white' : ''}`}>

      {/* CSS untuk menyembunyikan sidebar saat diakses di luar dashboard */}
      {!isDashboard && (
        <style>{`
          aside { display: none !important; }
          header:not(.z-50) { display: none !important; }
          main {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100vw !important;
            min-height: 100vh !important;
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
              padding-left: 1.5rem !important;
              padding-right: 1.5rem !important;
            }
          }
        `}</style>
      )}

      {/* NAVBAR (hanya muncul jika diakses di luar dashboard) */}
      {!isDashboard && (
        <header className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-16 border-b border-gray-100 bg-white sticky top-0 z-50 shadow-sm mb-8">
          <div className="flex items-center gap-3 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-11 h-11 object-contain rounded-2xl" />
            <span className="inline-block tracking-tight text-base sm:text-lg">ITCareerMatch</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(token ? '/dashboard' : '/login')}
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100 shadow-sm whitespace-nowrap"
            >
              {token ? 'Dashboard' : 'Masuk'}
            </button>
          </div>
        </header>
      )}

      {/* CONTAINER UTAMA */}
      <motion.div
        initial="hidden"
        animate="visible"
        className={`detail-container space-y-6 ${isDashboard ? 'pb-6' : ''}`}
      >
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer hover:bg-slate-50 rounded-lg px-3 py-1"
          >
            <div className="w-5 h-5 rounded-full flex items-center justify-center transition-all group-hover:bg-slate-200">
              <FiArrowLeft size={18} />
            </div>
            <span>Kembali</span>
          </button>
        </div>

        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative"
        >
          {/* Background gradient accent */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`absolute top-0 left-0 h-1 w-full ${
              score >= 80 ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-transparent' :
              score >= 60 ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-transparent' :
              'bg-gradient-to-r from-rose-500 via-rose-400 to-transparent'
            }`}
          />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-1"
              >
                {data.job_title_snapshot || 'Analisis CV'}
              </motion.h1>
              {data.company_snapshot && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-sm text-slate-500 font-medium mb-2 flex items-center gap-2"
                >
                  <FiBriefcase size={14} />
                  {data.company_snapshot}
                </motion.p>
              )}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-xs text-slate-400 flex items-center gap-1.5"
              >
                <FiClock size={12} />
                {formatDate(data.analyzed_at)}
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-2"
            >
              <span className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
                scoreStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                scoreStatus.color === 'amber' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {scoreStatus.label}
              </span>

              {/* Tombol Lihat Lowongan */}
              {data?.job_id && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/dashboard/detail/${data.job_id}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md hover:shadow-lg cursor-pointer"
                >
                  <FiBriefcase size={14} />
                  Lihat Lowongan
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm overflow-hidden relative"
        >
          {/* Background decorative elements */}
          <div className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 ${
            score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
          }`} />

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            {/* Animated Ring Score */}
            <div className="relative w-32 h-32 shrink-0">
              {/* Glow effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.3, scale: 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                className={`absolute inset-0 rounded-full blur-xl ${
                  score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />

              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                {/* Animated progress circle */}
                <motion.circle
                  initial={{ strokeDashoffset: 251 }}
                  animate={{ strokeDashoffset: 251 - (score / 100) * 251 }}
                  transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                  className={`${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}
                  strokeWidth="10"
                  strokeDasharray="251"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>

              {/* Score text with animation */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-3xl font-black text-slate-900"
                >
                  {score}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="text-[10px] text-slate-400 font-bold uppercase tracking-wider"
                >
                  Poin
                </motion.span>
              </div>

              {/* Pulsing indicator */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                className={`absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                  score >= 80 ? 'bg-emerald-100 text-emerald-700' :
                  score >= 60 ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}
              >
                {score >= 80 ? 'Sangat Cocok' : score >= 60 ? 'Cukup Cocok' : 'Perlu Perbaikan'}
              </motion.div>
            </div>

            {/* Content */}
            <div className="flex-1 text-center md:text-left">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-bold text-slate-900 text-lg mb-2 flex items-center gap-2 justify-center md:justify-start"
              >
                <FiTarget className="text-blue-500" />
                Skor Kecocokan
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm text-slate-500 leading-relaxed mb-4"
              >
                {score >= 80
                  ? 'CV Anda sangat cocok dengan standar industri. Skill dan pengalaman Anda relevan.'
                  : score >= 60
                  ? 'CV Anda cukup baik, namun ada celah kompetensi yang bisa diperbaiki.'
                  : 'CV membutuhkan perbaikan. Optimasi skill dan pengalaman diperlukan.'}
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 justify-center md:justify-start"
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="w-3 h-3 bg-emerald-500 rounded-full flex items-center justify-center"
                  >
                    <FiCheckCircle size={10} className="text-white" />
                  </motion.span>
                  <span className="text-xs text-slate-600 font-medium">{skillMatch.length} Skill Cocok</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="w-3 h-3 bg-rose-500 rounded-full flex items-center justify-center"
                  >
                    <FiXCircle size={10} className="text-white" />
                  </motion.span>
                  <span className="text-xs text-slate-600 font-medium">{skillGap.length} Skill Kurang</span>
                </div>
              </motion.div>

              {/* Progress bar indicator */}
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: '100%' }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden"
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' :
                    score >= 60 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                    'bg-gradient-to-r from-rose-400 to-rose-600'
                  }`}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Skills Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
          }}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* Skill Match */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Skill Yang Cocok</h3>
                <p className="text-xs text-slate-400">{skillMatch.length} kompetensi teridentifikasi</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
              className="flex flex-wrap gap-2"
            >
              {skillMatch.length > 0 ? skillMatch.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 + 0.4, type: 'spring' }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100 cursor-default"
                >
                  {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                </motion.span>
              )) : (
                <p className="text-xs text-slate-400 italic">Belum ada data</p>
              )}
            </motion.div>
          </motion.div>

          {/* Skill Gap */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm relative overflow-hidden"
          >
            {/* Decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-600" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <FiXCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Skill Yang Kurang</h3>
                <p className="text-xs text-slate-400">{skillGap.length} kompetensi perlu dikembangkan</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
              }}
              className="flex flex-wrap gap-2"
            >
              {skillGap.length > 0 ? skillGap.map((skill, idx) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 + 0.4, type: 'spring' }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100 cursor-default"
                >
                  {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                </motion.span>
              )) : (
                <p className="text-xs text-slate-400 italic">Tidak ada skill gap signifikan</p>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* AI Insight */}
        {aiInsight && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-5 relative overflow-hidden"
          >
            {/* Animated background particles */}
            <motion.div
              animate={{
                y: [-20, 20, -20],
                x: [10, -10, 10],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl"
            />
            <motion.div
              animate={{
                y: [20, -20, 20],
                x: [-15, 15, -15],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl"
            />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center justify-between mb-3"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.6, type: 'spring', stiffness: 200 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-8 h-8 bg-white/10 text-amber-400 rounded-lg flex items-center justify-center">
                    <BsStars size={16} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Insight AI</h3>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => copyToClipboard(aiInsight)}
                  className="p-1.5 bg-white/10 text-white/70 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                  title="Salin insight"
                >
                  <FiCopy size={14} />
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-slate-300 text-sm leading-relaxed"
              >
                {Array.isArray(aiInsight) ? (
                  <ul className="space-y-2">
                    {aiInsight.map((insight, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-amber-400 mt-1 text-lg"
                        >
                          •
                        </motion.span>
                        <span>{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {aiInsight}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Riwayat Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FiActivity size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Riwayat Analysis</h3>
                <p className="text-xs text-slate-400">Analysis terkait dari CV yang sama</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/riwayat')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer transition-colors"
            >
              Lihat Semua <FiChevronRight size={14} />
            </button>
          </div>
          <div className="p-5">
            {historyLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : relatedHistory.length > 0 ? (
              <div className="space-y-3">
                {relatedHistory.map((item, idx) => {
                  const itemScore = Math.round(item.match_score || 0);

                  return (
                    <motion.div
                      key={item.id || idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      onClick={() => navigate(`/dashboard/analisis/${item.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs shrink-0 overflow-hidden">
                        {item.job_title_snapshot?.substring(0, 2).toUpperCase() || 'AN'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 text-sm line-clamp-1">{item.job_title_snapshot || 'Analisis'}</p>
                        <p className="text-xs text-slate-500">{item.company_snapshot || '-'}</p>
                      </div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                          itemScore >= 80
                            ? 'bg-emerald-50 text-emerald-700'
                            : itemScore >= 60
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {itemScore}%
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500">Belum ada riwayat analysis lain</p>
                <button
                  onClick={() => navigate('/analisis-baru')}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  Buat analysis baru
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}