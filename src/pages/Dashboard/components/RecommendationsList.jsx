import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FiTarget, FiPlusCircle, FiChevronRight } from 'react-icons/fi';
import { BsLightningChargeFill } from 'react-icons/bs';

/**
 * RecommendationsList Component - Job recommendations on dashboard
 * API: GET /api/v1/jobs/recommendations?cv_id={cv_id}
 * Response: { success, data: [{ job_id, job_title, company, match_score, skill_match, skill_gap, ai_insight }] }
 * Requires cv_id dari analisis terakhir atau CV archives
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
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
            <BsLightningChargeFill size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Rekomendasi Kerja</h2>
            <p className="text-xs text-slate-500">Berdasarkan profil& CV Anda</p>
          </div>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Lihat Semua
          <FiChevronRight size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Memuat rekomendasi...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiTarget size={28} className="text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-700 mb-2">Belum Ada Rekomendasi</h3>
            <p className="text-sm text-slate-500 mb-4 max-w-xs mx-auto">
              Analisis CV terlebih dahulu untuk mendapatkan rekomendasi kerja yang sesuai.
            </p>
            <button
              onClick={onAnalyze}
              className="bg-slate-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:bg-slate-800 transition-colors"
            >
              <FiPlusCircle className="inline mr-2" />Analisis CV Sekarang
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <motion.div
                key={job.job_id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group"
                onClick={() => onNavigate(`/dashboard/detail/${job.job_id}`)}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center font-black text-slate-600 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 transition-colors text-lg shrink-0">
                  {job.job_title?.substring(0, 2).toUpperCase() || 'JB'}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.job_title || 'Lowongan'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{job.company || 'Perusahaan'}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                    {job.skill_match?.length > 0 && (
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">
                        {job.skill_match.length} skill cocok
                      </span>
                    )}
                    {job.skill_gap?.length > 0 && (
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded">
                        {job.skill_gap.length} skill perlu ditambahkan
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-black ${
                    job.match_score >= 80
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      : job.match_score >= 60
                      ? 'bg-amber-50 text-amber-700 border border-amber-100'
                      : 'bg-slate-50 text-slate-600 border border-slate-100'
                  }`}>
                    {Math.round(job.match_score || 0)}% Match
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}