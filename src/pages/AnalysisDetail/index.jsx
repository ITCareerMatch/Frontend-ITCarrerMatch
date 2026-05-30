import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiCheckCircle, FiXCircle, FiBriefcase,
  FiClock, FiChevronRight, FiCopy, FiArrowLeft, FiXCircle as FiXCircleAlt
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAnalysisDetail, fetchJobRecommendations } from '../../services/api';
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
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobLoading, setJobLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!token) {
        navigate('/login');
        return;
      }

      setLoading(true);
      setError(null);
      setJobLoading(true);

      try {
        // 1. Ambil detail analisis
        const detail = await fetchAnalysisDetail(token, id);
        setData(detail);

        // 2. Ambil rekomendasi berdasarkan cv_id
        if (detail?.cv_id) {
          try {
            const recs = await fetchJobRecommendations(token, detail.cv_id);
            setRecommendedJobs(Array.isArray(recs) ? recs.slice(0, 5) : []);
          } catch (e) {
            console.warn('Gagal fetch rekomendasi:', e);
            setRecommendedJobs([]);
          }
        } else {
          // Fallback: tidak ada cv_id, kosongkan rekomendasi
          console.warn('Detail analisis tidak memiliki cv_id');
          setRecommendedJobs([]);
        }
      } catch (err) {
        console.error('Gagal memuat detail:', err);
        setError(err.message || 'Gagal memuat data analisis');
      } finally {
        setLoading(false);
        setJobLoading(false);
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
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
          >
            <FiArrowLeft size={18} />
            <span>Kembali</span>
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                {data.job_title_snapshot || 'Analisis CV'}
              </h1>
              {data.company_snapshot && (
                <p className="text-sm text-slate-500 font-medium mb-2">{data.company_snapshot}</p>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <FiClock size={12} />
                {formatDate(data.analyzed_at)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider ${
              scoreStatus.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
              scoreStatus.color === 'amber' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
              'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
              {scoreStatus.label}
            </div>
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="42" cx="50" cy="50" />
                <circle
                  className={`${score >= 80 ? 'text-emerald-500' : score >= 60 ? 'text-amber-500' : 'text-rose-500'}`}
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (score / 100) * 264}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="42"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{score}</span>
                <span className="text-[10px] text-slate-400 font-bold">POIN</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 mb-2">Skor Kecocokan</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                {score >= 80
                  ? 'CV Anda sangat cocok dengan standar industri. Skill dan pengalaman Anda relevan.'
                  : score >= 60
                  ? 'CV Anda cukup baik, namun ada celah kompetensi yang bisa diperbaiki.'
                  : 'CV membutuhkan perbaikan. Optimasi skill dan pengalaman diperlukan.'}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="text-xs text-slate-600 font-medium">{skillMatch.length} Skill Cocok</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                  <span className="text-xs text-slate-600 font-medium">{skillGap.length} Skill Kurang</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Skill Match */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                <FiCheckCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Skill Yang Cocok</h3>
                <p className="text-xs text-slate-400">{skillMatch.length} kompetensi teridentifikasi</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillMatch.length > 0 ? skillMatch.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                  {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                </span>
              )) : (
                <p className="text-xs text-slate-400 italic">Belum ada data</p>
              )}
            </div>
          </div>

          {/* Skill Gap */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
                <FiXCircle size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Skill Yang Kurang</h3>
                <p className="text-xs text-slate-400">{skillGap.length} kompetensi perlu dikembangkan</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillGap.length > 0 ? skillGap.map((skill, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100">
                  {typeof skill === 'string' ? skill : skill?.name || 'Skill'}
                </span>
              )) : (
                <p className="text-xs text-slate-400 italic">Tidak ada skill gap signifikan</p>
              )}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        {aiInsight && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 text-amber-400 rounded-lg flex items-center justify-center">
                    <BsStars size={16} />
                  </div>
                  <h3 className="font-bold text-white text-sm">Insight AI</h3>
                </div>
                <button
                  onClick={() => copyToClipboard(aiInsight)}
                  className="p-1.5 bg-white/10 text-white/70 hover:text-white rounded-lg hover:bg-white/20 transition-colors"
                  title="Salin insight"
                >
                  <FiCopy size={14} />
                </button>
              </div>
              <div className="text-slate-300 text-sm leading-relaxed">
                {Array.isArray(aiInsight) ? (
                  <ul className="space-y-1">
                    {aiInsight.map((insight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>{aiInsight}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rekomendasi Lowongan */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <FiBriefcase size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Lowongan Terkait</h3>
                <p className="text-xs text-slate-400">Berdasarkan profil analisis Anda</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/daftar-lowongan')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Lihat Semua <FiChevronRight size={14} />
            </button>
          </div>
          <div className="p-5">
            {jobLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : recommendedJobs.length > 0 ? (
              <div className="space-y-3">
                {recommendedJobs.map((job, idx) => (
                  <div
                    key={job.job_id || idx}
                    onClick={() => navigate(`/dashboard/detail/${job.job_id}`)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 font-bold text-xs shrink-0">
                      {job.job_title?.substring(0, 2).toUpperCase() || 'JB'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 text-sm line-clamp-1">{job.job_title}</p>
                      <p className="text-xs text-slate-500">{job.company}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      job.match_score >= 80
                        ? 'bg-emerald-50 text-emerald-700'
                        : job.match_score >= 60
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {Math.round(job.match_score || 0)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500">Belum ada rekomendasi lowongan</p>
                <button
                  onClick={() => navigate('/analisis-baru')}
                  className="mt-2 text-xs font-bold text-blue-600 hover:underline"
                >
                  Analisis CV baru untuk rekomendasi
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}