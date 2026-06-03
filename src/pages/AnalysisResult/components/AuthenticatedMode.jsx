import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiTarget,
  FiBriefcase, FiArrowLeft,
  FiZap, FiAward, FiUsers, FiCalendar, FiArrowRight
} from 'react-icons/fi';
import { fetchJobRecommendations } from '../../../services/api';

/**
 * Mini Animated Score Ring for JobCard
 */
function MiniScoreRing({ score, size = 60, strokeWidth = 5 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [score]);

  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (s) => {
    if (s >= 80) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  const color = getScoreColor(score);

  return (
    <div className="relative shrink-0">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#f1f5f9"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-black text-slate-700">{animatedScore}%</span>
      </div>
    </div>
  );
}

/**
 * Job Card with Animated Score Ring
 */
function JobCard({ job, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ scale: 1.01, y: -2 }}
      onClick={() => window.location.href = `/dashboard/detail/${job.job_id}`}
      className="bg-white border border-slate-200/60 rounded-2xl p-3 sm:p-5 hover:shadow-lg hover:border-blue-200/80 transition-all cursor-pointer flex flex-row sm:flex-row items-center gap-3 sm:gap-4"
    >
      {/* Animated Score Ring - smaller on mobile */}
      <MiniScoreRing score={job.match_score || 0} size={48} strokeWidth={4} />

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
          {job.job_title}
        </h4>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{job.company}</p>
      </div>

      {/* Arrow icon - hidden on very small screens */}
      <motion.div
        whileHover={{ x: 4 }}
        className="hidden sm:block p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors shrink-0"
      >
        <FiArrowRight size={16} />
      </motion.div>
    </motion.div>
  );
}

/**
 * AuthenticatedMode Component (Unlocked)
 * Displays full analysis results for authenticated users
 * Data comes from polling /cv/status/{task_id}
 * Then fetches job recommendations based on cv_id
 */
export default function AuthenticatedMode({ taskResult, viewState, onBackClick }) {
  const token = localStorage.getItem('access_token');
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Extract data from taskResult polling response
  const cvId = taskResult?.cvId || null; // camelCase from backend
  const recommendationsSaved = taskResult?.recommendations_saved || 0;

  // Fetch job recommendations based on cv_id
  useEffect(() => {
    if (!token || !cvId || viewState !== 'result') return;

    const fetchRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const recs = await fetchJobRecommendations(token, cvId);
        setRecommendedJobs(Array.isArray(recs) ? recs : []);
      } catch (err) {
        console.warn('Failed to fetch recommendations:', err);
        setRecommendedJobs([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [cvId, token, viewState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-sans text-slate-800 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-4 py-5 sm:py-5 flex items-center justify-between gap-4">
          <motion.button
            onClick={onBackClick}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <FiArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Kembali</span>
          </motion.button>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <Link
              to="/analisis-baru"
              className="bg-blue-50 text-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100 whitespace-nowrap"
            >
              + Analisis Baru
            </Link>
            <Link
              to="/dashboard"
              className="bg-slate-950 text-white px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              Ke Dashboard
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          {/* Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] sm:text-xs font-bold mb-4 sm:mb-6 border border-emerald-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <FiAward size={12} className="sm:w-3.5 sm:h-3.5" />
            </motion.div>
            Analisis CV Selesai
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl md:text-4xl font-extrabold text-slate-900 mb-2 sm:mb-3 tracking-tight px-4"
          >
            Hasil Analisis CV Anda
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed px-4"
          >
            CV Anda telah dianalisis dan {recommendationsSaved} rekomendasi pekerjaan sudah tersedia.
          </motion.p>
        </motion.div>

        {/* Recommendations Section */}
        {loadingRecommendations ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 sm:p-8 text-center"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Memuat rekomendasi...</p>
          </motion.div>
        ) : recommendedJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0"
                >
                  <FiBriefcase size={20} className="sm:w-[22px] sm:h-[22px]" />
                </motion.div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-lg">Rekomendasi Kerja</h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">Lowongan paling cocok untuk Anda</p>
                </div>
              </div>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1 bg-blue-50 text-blue-600 rounded-xl text-[10px] sm:text-xs font-bold whitespace-nowrap">
                {recommendedJobs.length} lowongan tersedia
              </span>
            </div>

            <div className="p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {recommendedJobs.slice(0, 20).map((job, i) => (
                <JobCard key={job.job_id || i} job={job} index={i} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-8 sm:p-12 text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase size={24} className="sm:w-7 sm:h-7 text-slate-400" />
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-2">Belum Ada Rekomendasi</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-sm mx-auto">
              Selesaikan analisis CV baru untuk mendapatkan rekomendasi pekerjaan.
            </p>
            <Link
              to="/analisis-baru"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
              <FiZap size={16} className="sm:w-[18px] sm:h-[18px]" />
              Analisis CV Baru
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
