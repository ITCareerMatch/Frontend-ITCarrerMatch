import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FiClock, FiTarget, FiFileText, FiBriefcase,
  FiChevronLeft, FiChevronRight, FiEye, FiTrash2
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAnalysisHistory, fetchCVArchives, deleteCVArchive } from '../../services/api';
import Swal from 'sweetalert2';

// Konfigurasi animasi seragam
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

// Helper: Format date
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper: Get score badge
const getScoreBadge = (score) => {
  if (score >= 80) return { label: 'Sangat Baik', color: 'emerald' };
  if (score >= 60) return { label: 'Cukup', color: 'amber' };
  return { label: 'Optimasi', color: 'rose' };
};

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  // State untuk pagination - API menggunakan 1-based indexing
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(10);

  // State untuk data
  const [history, setHistory] = useState([]);
  const [cvArchives, setCvArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('history'); // 'history' | 'archives'
  const pageSizeRef = useRef(pageSize);

  useEffect(() => {
    pageSizeRef.current = pageSize;
  }, [pageSize]);

  // Fetch data on mount and page change
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch history - API menggunakan 1-based indexing untuk page
        const historyResult = await fetchAnalysisHistory(token, currentPage, pageSizeRef.current);
        // Response: { success, data: [...], meta: { page, limit, total } }
        const historyData = historyResult?.data || [];
        setHistory(Array.isArray(historyData) ? historyData : []);
        setTotalItems(historyResult?.meta?.total || 0);

        // Fetch CV archives - Response: { success, data: [...] }
        const archivesResult = await fetchCVArchives(token);
        const archivesData = archivesResult?.data || [];
        setCvArchives(Array.isArray(archivesData) ? archivesData : []);
      } catch (err) {
        console.error('Error loading data:', err);
        // Handle 401 Unauthorized
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          localStorage.removeItem('access_token');
          navigate('/login');
          return;
        }
        setError(err.message || 'Terjadi kesalahan saat memuat data riwayat');
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: err.message || 'Terjadi kesalahan saat memuat data riwayat',
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, currentPage, navigate]);

  // Handle delete CV archive
  const handleDeleteArchive = async (archiveId) => {
    const result = await Swal.fire({
      title: 'Hapus CV Ini?',
      text: 'CV dan semua data analisis terkait akan dihapus permanen.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      try {
        await deleteCVArchive(token, archiveId);
        // Refresh archives
        const archivesResult = await fetchCVArchives(token);
        const archivesData = archivesResult?.data || [];
        setCvArchives(Array.isArray(archivesData) ? archivesData : []);
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'CV berhasil dihapus.',
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: err.message || 'Gagal menghapus CV',
        });
      }
    }
  };

  // Handle view analysis detail
  const handleViewDetail = (analysisId) => {
    navigate(`/riwayat/${analysisId}`);
  };

  // Calculate total pages - API uses 1-based indexing
  const totalPages = Math.ceil(totalItems / pageSizeRef.current) || 1;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat riwayat analisis...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 selection:bg-blue-500/10 selection:text-blue-600 animate-fadeIn">

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg border border-slate-800">
            <FiClock size={22} className="text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Riwayat Analisis</h1>
            <p className="text-sm text-slate-500 font-medium">
              {totalItems > 0 ? `${totalItems} analisis ditemukan` : 'Kelola dan lihat semua hasil analisis CV Anda'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FiTarget className="inline mr-2" />Riwayat Analisis ({totalItems})
        </button>
        <button
          onClick={() => setActiveTab('archives')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'archives'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FiFileText className="inline mr-2" />Arsip CV ({cvArchives.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'history' ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-4"
        >
          {history.length === 0 ? (
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
          ) : (
            history.map((item) => {
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
                          {formatDate(item.analyzed_at)}
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
            })
          )}

          {/* Pagination - API uses 1-based indexing */}
          {history.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronLeft size={18} />
              </button>
              <span className="text-sm font-bold text-slate-500">
                Halaman {currentPage} dari {totalPages} ({totalItems} total)
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="space-y-4"
        >
          {cvArchives.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FiFileText size={24} className="text-slate-400" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">Belum Ada Arsip CV</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                CV yang Anda upload akan tersimpan di sini.
              </p>
            </div>
          ) : (
            cvArchives.map((archive) => (
              <motion.div
                key={archive.id}
                variants={fadeInUp}
                className="bg-white rounded-2xl border border-slate-200/60 p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 shrink-0">
                      <FiFileText size={20} className="text-slate-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">{archive.file_name || 'CV Document'}</h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Diunggah: {formatDate(archive.uploaded_at)}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                          archive.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : archive.status === 'processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-100'
                            : 'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                          {archive.status || 'unknown'}
                        </span>
                        <span className="px-2 py-1 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100">
                          {archive.cv_source || 'unknown'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteArchive(archive.id)}
                      className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Hapus CV"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
