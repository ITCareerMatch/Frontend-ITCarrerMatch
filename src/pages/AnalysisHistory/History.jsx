import React from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiTarget, FiFileText, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { fadeInUp, staggerContainer, getScoreBadge } from './helpers';

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
        const badge = getScoreBadge(score);

        return (
          <motion.div
            key={item.id}
            variants={fadeInUp}
            className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg hover:border-blue-200/80 transition-all group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  badge.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                  badge.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                  'bg-rose-50 text-rose-600'
                }`}>
                  <FiTarget size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">
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

              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                  badge.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  badge.color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-rose-50 text-rose-700 border-rose-100'
                }`}>
                  {score} Poin
                </div>
                <button
                  onClick={() => handleViewDetail(item.id)}
                  className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Lihat Detail"
                >
                  <FiEye size={16} />
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