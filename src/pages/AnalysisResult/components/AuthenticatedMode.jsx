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
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={() => window.location.href = `/dashboard/detail/${job.job_id}`}
      className="bg-white border border-slate-200/60 rounded-2xl p-5 hover:shadow-xl hover:border-blue-200/80 transition-all cursor-pointer flex items-center gap-4"
    >
      {/* Animated Score Ring */}
      <MiniScoreRing score={job.match_score || 0} size={60} strokeWidth={5} />

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {job.job_title}
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">{job.company}</p>

        {/* Skill counts */}
        <div className="flex items-center gap-3 mt-2">
          {job.skill_match_count > 0 && (
            <span className="text-xs text-emerald-600 flex items-center gap-1">
              <FiCheckCircle size={12} />
              {job.skill_match_count} skill cocok
            </span>
          )}
          {job.skill_gap_count > 0 && (
            <span className="text-xs text-rose-600 flex items-center gap-1">
              <FiTarget size={12} />
              {job.skill_gap_count} skill perlu dikembangkan
            </span>
          )}
        </div>
      </div>

      {/* Arrow icon */}
      <motion.div
        whileHover={{ x: 4 }}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 group-hover:text-blue-500 transition-colors"
      >
        <FiArrowRight size={18} />
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
  const message = taskResult?.message || 'Analisis berhasil.';
  const cvId = taskResult?.cvId || null; // camelCase from backend
  const userAge = taskResult?.user_age || null;
  const jobsFiltered = taskResult?.jobs_filtered || 0;
  const skillsUpdated = taskResult?.skills_updated || 0;
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
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            onClick={onBackClick}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors cursor-pointer"
          >
            <FiArrowLeft size={18} /> Kembali
          </motion.button>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <Link
              to="/analisis-baru"
              className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer border border-blue-100"
            >
              + Analisis Baru
            </Link>
            <Link
              to="/dashboard"
              className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Dashboard
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Success Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold mb-6 border border-emerald-500/20"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <FiAward size={14} />
            </motion.div>
            Analisis CV Selesai
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight"
          >
            Hasil Analisis CV Anda
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed"
          >
            CV Anda telah dianalisis dan {recommendationsSaved} rekomendasi pekerjaan sudah tersedia.
          </motion.p>

          {/* Message Summary */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-slate-600 max-w-2xl mx-auto leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/50"
          >
            {message}
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-5 rounded-2xl border border-emerald-200/40 text-center"
          >
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
              <FiCheckCircle size={24} />
            </div>
            <div className="text-3xl font-black text-emerald-700 mb-1">{skillsUpdated}</div>
            <div className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Skill Updated</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 rounded-2xl border border-blue-200/40 text-center"
          >
            <div className="w-12 h-12 bg-blue-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
              <FiUsers size={24} />
            </div>
            <div className="text-3xl font-black text-blue-700 mb-1">{jobsFiltered}</div>
            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Lowongan Difilter</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-2xl border border-amber-200/40 text-center"
          >
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/20">
              <FiAward size={24} />
            </div>
            <div className="text-3xl font-black text-amber-700 mb-1">{recommendationsSaved}</div>
            <div className="text-xs text-amber-600 font-bold uppercase tracking-wider">Rekomendasi</div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-gradient-to-br from-purple-50 to-purple-100/50 p-5 rounded-2xl border border-purple-200/40 text-center"
          >
            <div className="w-12 h-12 bg-purple-500 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20">
              <FiCalendar size={24} />
            </div>
            <div className="text-3xl font-black text-purple-700 mb-1">{userAge || '-'}</div>
            <div className="text-xs text-purple-600 font-bold uppercase tracking-wider">Usia</div>
          </motion.div>
        </motion.div>

        {/* Recommendations Section */}
        {loadingRecommendations ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-8 text-center"
          >
            <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Memuat rekomendasi...</p>
          </motion.div>
        ) : recommendedJobs.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 10 }}
                  className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"
                >
                  <FiBriefcase size={22} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Rekomendasi Karir</h3>
                  <p className="text-xs text-slate-500">Lowongan paling cocok untuk Anda</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold">
                {recommendedJobs.length}+ lowongan
              </span>
            </div>

            <div className="p-6 grid sm:grid-cols-2 gap-4">
              {recommendedJobs.slice(0, 20).map((job, i) => (
                <JobCard key={job.job_id || i} job={job} index={i} />
              ))}
            </div>

            {recommendedJobs.length > 10 && (
              <div className="p-6 pt-0">
                <Link
                  to="/lowongan"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Lihat Semua {recommendedJobs.length}+ Rekomendasi
                </Link>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center"
          >
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBriefcase size={28} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mb-2">Belum Ada Rekomendasi</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">
              Selesaikan analisis CV baru untuk mendapatkan rekomendasi pekerjaan.
            </p>
            <Link
              to="/analisis-baru"
              className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              <FiZap size={18} />
              Analisis CV Baru
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
