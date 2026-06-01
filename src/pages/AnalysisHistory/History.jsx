/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiFileText, FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { fadeInUp, staggerContainer } from './helpers';

/**
 * Get initials from job title (first 2 characters)
 */
const getInitials = (title) => {
  if (!title) return 'CV';
  const cleaned = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const words = cleaned.split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return cleaned.substring(0, 2).toUpperCase();
};

/**
 * Mini Animated Score Ring - Circular progress ring 0-100%
 */
function MiniScoreRing({ score, size = 52, strokeWidth = 4 }) {
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
    if (s >= 80) return '#10b981'; // emerald
    if (s >= 60) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
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

export default function History({
  history,
  currentPage,
  totalPages,
  totalItems,
  onPageChange
}) {
  const navigate = useNavigate();

  const handleViewDetail = (analysisId) => {
    navigate(`/riwayat/${analysisId}`);
  };

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
          <FiFileText size={24} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 mb-2">Belum Ada Riwayat Analisis</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Anda belum memiliki riwayat analisis CV. Mulai dengan menganalisis CV baru.
        </p>
        <button
          onClick={() => navigate('/analisis-baru')}
          className="bg-slate-900 text-white font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors"
        >
          <FiTarget className="inline mr-2" />Mulai Analisis Baru
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-4"
    >
      {history.map((item) => {
        const score = Math.round(item.match_score || 0);

        return (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between gap-4">
              {/* Left side - Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-sm shadow-sm">
                  {getInitials(item.job_title_snapshot)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 mb-0.5 line-clamp-1">
                    {item.job_title_snapshot || 'Analisis CV'}
                  </h3>
                  {item.company_snapshot && (
                    <p className="text-xs text-slate-500 mb-1">{item.company_snapshot}</p>
                  )}
                  <p className="text-xs text-slate-400 font-medium">
                    {new Date(item.analyzed_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              {/* Right side - Score Ring & Button */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-5 shrink-0">
                <MiniScoreRing score={score} size={52} strokeWidth={4} />

                <button
                  onClick={() => handleViewDetail(item.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition-colors group-hover:bg-blue-600 cursor-pointer"
                >
                  Lihat Detail
                  <FiArrowRight size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft size={18} />
          </button>
          <span className="text-sm font-bold text-slate-500">
            Halaman {currentPage} dari {totalPages} ({totalItems} total)
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronRight size={18} />
          </button>
        </div>
      )}
    </motion.div>
  );
}