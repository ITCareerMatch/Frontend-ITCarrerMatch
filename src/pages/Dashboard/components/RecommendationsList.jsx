import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiTarget, FiPlusCircle, FiChevronRight, FiArrowRight, FiArrowRightCircle } from 'react-icons/fi';
import { BsLightningChargeFill } from 'react-icons/bs';

/**
 * Mini Animated Score Ring for Dashboard JobCard
 */
function MiniScoreRing({ score, size = 48, strokeWidth = 4 }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    const duration = 1200;
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
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-black text-slate-700">{animatedScore}%</span>
      </div>
    </div>
  );
}

/**
 * RecommendationsList Component - Job recommendations on dashboard
 * Jobs sudah di-sort berdasarkan match_score tertinggi di Dashboard
 */
export default function RecommendationsList({
  jobs,
  loading,
  onNavigate,
  onViewAll,
  onAnalyze
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white shrink-0">
            <BsLightningChargeFill size={18} className="sm:w-5 sm:h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm sm:text-base">Rekomendasi Kerja</h2>
            <p className="text-[10px] sm:text-xs text-slate-500">Berdasarkan profil & CV Anda</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          Lihat Semua
          <FiChevronRight size={14} className="sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-slate-400">
            <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-xs sm:text-sm font-medium">Memuat rekomendasi...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTarget size={24} className="sm:w-7 sm:h-7 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 mb-2 text-sm sm:text-base">Belum Ada Rekomendasi</h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-4 max-w-xs mx-auto">
              Analisis CV terlebih dahulu untuk mendapatkan rekomendasi kerja yang sesuai.
            </p>
            <button
              onClick={onAnalyze}
              className="bg-slate-900 text-white font-bold px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs hover:bg-slate-800 transition-colors"
            >
              <FiPlusCircle className="inline mr-1.5 sm:mr-2" />Analisis CV Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.job_id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
                onClick={() => onNavigate(`/dashboard/detail/${job.job_id}`)}
              >
                {/* Animated Score Ring - smaller on mobile */}
                <MiniScoreRing score={job.match_score || 0} size={44} strokeWidth={3} />

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.job_title || 'Lowongan'}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{job.company || 'Perusahaan'}</p>

                  {/* Tags - stack on very small screens */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mt-1.5 text-[10px] sm:text-xs">
                    {job.location && (
                      <span className="text-slate-400 truncate max-w-[80px] sm:max-w-none">{job.location}</span>
                    )}
                    {job.skill_match_count > 0 && (
                      <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded whitespace-nowrap">
                        {job.skill_match_count} skill
                      </span>
                    )}
                    {job.skill_gap_count > 0 && (
                      <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded whitespace-nowrap">
                        {job.skill_gap_count} perlu dikembangkan
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow icon - hidden on very small screens */}
                <div className="hidden sm:flex items-center shrink-0">
                  <FiArrowRightCircle size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
