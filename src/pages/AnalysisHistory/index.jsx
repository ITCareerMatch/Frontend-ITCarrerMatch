import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FiClock, FiFileText, FiFilter } from 'react-icons/fi';
import { fetchAnalysisHistory, fetchCVArchives, deleteCVArchive } from '../../services/api';
import Swal from 'sweetalert2';
import History from './History';
import CvArchive from './CvArchive';

export default function AnalysisHistory() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem('access_token');

  // State untuk pagination - API menggunakan 1-based indexing
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(10);

  // State untuk data
  const [history, setHistory] = useState([]);
  const [cvArchives, setCvArchives] = useState([]);
  const [selectedCvId, setSelectedCvId] = useState(null); // Filter by specific CV
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  // Initialize tab from URL query parameter (default to 'history')
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'history'); // 'history' | 'archives'
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
        // Filter by selectedCvId jika user memilih CV tertentu
        const historyResult = await fetchAnalysisHistory(
          token,
          currentPage,
          pageSizeRef.current,
          selectedCvId
        );
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
  }, [token, currentPage, selectedCvId, navigate]);

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

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FiFileText className="inline mr-2" />Riwayat Analisis ({totalItems})
          </button>
          <button
            onClick={() => setActiveTab('archives')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'archives'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <FiFileText className="inline mr-2" />Arsip CV ({cvArchives.length})
          </button>
        </div>

        {/* Filter by CV dropdown */}
        {activeTab === 'history' && cvArchives.length > 0 && (
          <div className="flex items-center gap-2">
            <FiFilter className="text-slate-400" size={16} />
            <select
              value={selectedCvId || ''}
              onChange={(e) => {
                setSelectedCvId(e.target.value || null);
                setCurrentPage(1); // Reset to first page when filter changes
              }}
              className="px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua CV</option>
              {cvArchives.map((archive) => (
                <option key={archive.id} value={archive.id}>
                  {archive.file_name || `CV ${archive.id.substring(0, 8)}...`} ({archive.cv_source})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {activeTab === 'history' ? (
        <History
          history={history}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      ) : (
        <CvArchive
          cvArchives={cvArchives}
          onDeleteArchive={handleDeleteArchive}
        />
      )}
    </div>
  );
}