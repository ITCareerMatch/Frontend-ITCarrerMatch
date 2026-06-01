import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiClock, FiCheckCircle, FiTrendingUp, FiAlertCircle, FiFileText, FiChevronRight } from 'react-icons/fi';

/**
 * HistoryWidget Component - Recent analysis history card
 */

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

// Helper: Get CV health status
const getCvHealthStatus = (score) => {
  if (score >= 80) return { label: 'Sangat Siap', color: 'emerald', icon: <FiCheckCircle /> };
  if (score >= 60) return { label: 'Cukup Baik', color: 'amber', icon: <FiTrendingUp /> };
  return { label: 'Perlu Optimasi', color: 'rose', icon: <FiAlertCircle /> };
};

export default function HistoryWidget({ history, loading, onNavigate, onStartAnalysis }) {
  const colorClasses = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FiClock className="text-indigo-500" /> Riwayat Analisis
        </h3>
        <button
          onClick={onNavigate}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
        >
          Selengkapnya <FiChevronRight size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-slate-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FiFileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-500">Belum ada riwayat analisis</p>
            <button
              onClick={onStartAnalysis}
              className="mt-3 text-xs font-bold text-blue-600 hover:underline"
            >
              Mulai Analisis Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {history.slice(0, 4).map((item, idx) => {
              const score = Math.round(item.match_score || 0);
              const health = getCvHealthStatus(score);
              const colors = colorClasses[health.color];

              return (
                <div
                  key={item.id || idx}
                  onClick={() => onNavigate(`/riwayat/${item.id}`)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className={`w-10 h-10 ${colors.bg} ${colors.text} rounded-xl flex items-center justify-center shrink-0`}>
                    {health.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 line-clamp-1">
                      {item.job_title_snapshot || 'Analisis CV'}
                    </p>
                    {item.company_snapshot && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.company_snapshot}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {formatDate(item.analyzed_at)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-lg font-black text-slate-900">{score}</div>
                    <div className="text-[10px] text-slate-400">{health.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}