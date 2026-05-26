import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiMapPin, FiFilter,
  FiBriefcase, FiDollarSign, FiArrowRight,
  FiX, FiXCircle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAllJobs } from '../../services/api';

export default function DashboardJobs() {
  const navigate = useNavigate();

  // --- 1. STATE UNTUK DATA & LOADING ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // --- 2. STATE UNTUK FILTER ---
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    education_level: '',
    job_type: '',   // hanya untuk UI, tidak dikirim ke API
    sort: 'latest', // hanya untuk UI, tidak dikirim ke API
  });

  // State lokal input teks (di-debounce sebelum masuk filters)
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // --- 3. DEBOUNCE SEARCH & LOCATION ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, city: locationInput }));
      setPagination(prev => ({ ...prev, page: 1 })); // ✅ reset ke halaman 1
    }, 800);
    return () => clearTimeout(timer);
  }, [searchInput, locationInput]);

  // --- 4. FETCH API ---
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllJobs({
          page: pagination.page,
          limit: pagination.limit,
          search: filters.search,
          city: filters.city,
          education_level: filters.education_level,
          // job_type & sort tidak ada di swagger — tidak dikirim ke API
        });

        // Append jika "Muat Lebih Banyak", replace jika filter/page baru
        if (pagination.page > 1) {
          setJobs(prev => [...prev, ...(result.jobs || [])]);
        } else {
          setJobs(result.jobs || []);
        }

        if (result.pagination) {
          setPagination(prev => ({ ...prev, total: result.pagination.total || 0 }));
        }

      } catch (err) {
        setError(err.message || 'Gagal mengambil daftar lowongan.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  // --- 5. HANDLER FILTER ---
  const handleCheckboxFilter = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? '' : value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setLocationInput('');
    setFilters({ search: '', city: '', job_type: '', education_level: '', sort: 'latest' });
    setPagination({ page: 1, limit: 10, total: 0 });
  }, []);

  const hasActiveFilters =
    filters.search || filters.city || filters.job_type || filters.education_level;

  // --- 6. FORMAT RUPIAH ---
  const formatRupiah = (number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(number);

  const handleNavigateToDetail = (jobId) => {
    navigate(`/detail/${jobId}`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 font-sans text-gray-800 animate-fadeIn">

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
        Temukan Karir Impianmu <br className="hidden md:block" />
        <span className="text-blue-600">Lebih Cepat & Tepat</span>
      </h1>
      <p className="text-gray-500 mb-10 max-w-2xl text-sm md:text-base leading-relaxed">
        Jelajahi ribuan lowongan pekerjaan terbaru dari perusahaan terkemuka. Gunakan AI kami
        untuk melihat seberapa cocok profilmu dengan posisi yang ada.
      </p>

      {/* --- SEARCH BAR --- */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 translate-x-1/3 -translate-y-1/2" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiSearch className="text-blue-500" /> Eksplorasi Lowongan
          </h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <FiX /> Reset
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 relative z-10">
          {/* Input Search */}
          <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 ring-blue-100 transition-all relative">
            <FiSearch className="text-gray-400 mr-3 shrink-0" size={20} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Posisi, kata kunci, atau nama perusahaan..."
              className="w-full bg-transparent outline-none text-gray-700 text-sm font-medium"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Input Kota */}
          <div className="md:w-1/3 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 ring-blue-100 transition-all relative">
            <FiMapPin className="text-gray-400 mr-3 shrink-0" size={20} />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Filter Kota..."
              className="w-full bg-transparent outline-none text-gray-700 text-sm font-medium"
            />
            {locationInput && (
              <button
                onClick={() => setLocationInput('')}
                className="absolute right-4 text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 mt-5 overflow-x-auto pb-2 scrollbar-hide relative z-10">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mr-2 shrink-0">
            <FiFilter /> Filter Cepat:
          </div>
          {/* 
            ⚠️  job_type tidak didukung API — tombol ini hanya memfilter tampilan UI.
            Jika backend nantinya support, uncomment job_type di fetchAllJobs call.
          */}
          <button
            onClick={() => handleCheckboxFilter('job_type', 'Remote')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.job_type === 'Remote'
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Remote
          </button>
          <button
            onClick={() => handleCheckboxFilter('education_level', 'S1')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.education_level === 'S1'
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            S1
          </button>
          <button
            onClick={() => handleCheckboxFilter('education_level', 'SMA/SMK')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.education_level === 'SMA/SMK'
                ? 'bg-blue-50 text-blue-600 border-blue-200'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            SMA/SMK
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR FILTER */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Tipe Pekerjaan
            </h3>
            <div className="space-y-3">
              {['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Remote'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.job_type === type}
                    onChange={() => handleCheckboxFilter('job_type', type)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm group-hover:text-gray-900 ${
                      filters.job_type === type ? 'text-blue-600 font-bold' : 'text-gray-600'
                    }`}
                  >
                    {type}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-gray-100 my-6" />

            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Pendidikan Minimal
            </h3>
            <div className="space-y-3">
              {['SMA/SMK', 'D3', 'S1', 'S2'].map((edu) => (
                <label key={edu} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.education_level === edu}
                    onChange={() => handleCheckboxFilter('education_level', edu)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span
                    className={`text-sm group-hover:text-gray-900 ${
                      filters.education_level === edu ? 'text-blue-600 font-bold' : 'text-gray-600'
                    }`}
                  >
                    {edu}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Banner Edit CV */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-6 rounded-3xl text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-40 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm relative z-10">
              <BsStars size={20} />
            </div>
            <h4 className="font-bold text-gray-900 mb-2 relative z-10">Tingkatkan Skor Anda</h4>
            <p className="text-xs text-gray-500 mb-5 relative z-10">
              Perbarui CV Anda di Editor untuk meningkatkan persentase kecocokan dengan lowongan.
            </p>
            <button
              onClick={() => navigate('/editor')}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-md shadow-blue-200 relative z-10 cursor-pointer"
            >
              Buka CV Editor
            </button>
          </div>
        </aside>

        {/* DAFTAR LOWONGAN */}
        <div className="w-full lg:w-3/4">

          {/* Header jumlah & sort */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">
              {loading && pagination.page === 1
                ? 'Mencari...'
                : `${pagination.total || jobs.length} Lowongan Ditemukan`}
            </h2>
            <div className="flex items-center gap-2 text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-gray-500 font-medium">Urutkan:</span>
              <select
                className="font-bold text-gray-900 bg-transparent outline-none cursor-pointer"
                value={filters.sort}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, sort: e.target.value }))
                }
              >
                <option value="latest">Terbaru</option>
                <option value="salary">Gaji Tertinggi</option>
              </select>
            </div>
          </div>

          {/* Banner Error */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl mb-6 text-sm font-medium flex items-center gap-2">
              <FiXCircle className="shrink-0" /> {error}
            </div>
          )}

          {/* Loading awal (page 1) */}
          {loading && pagination.page === 1 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
              <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-gray-500">Menyinkronkan data lowongan...</p>
            </div>

          ) : jobs.length === 0 && !error ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-5">
                  <FiSearch size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Maaf, tidak ada lowongan yang sesuai dengan filter Anda. Coba kurangi filter atau gunakan kata kunci lain.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 font-bold text-blue-600 bg-blue-50 px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  Reset Filter
                </button>
              </div>

          ) : (
            /* Daftar Job */
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleNavigateToDetail(job.id)}
                  className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all group cursor-pointer flex flex-col hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                        {job.title?.substring(0, 1).toUpperCase() || 'J'}
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1.5 font-bold text-gray-700">
                            <FiBriefcase className="text-gray-400" /> {job.company_name}
                          </span>
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block" />
                          {/* ✅ Hanya city — province tidak ada di list response */}
                          <span className="flex items-center gap-1.5">
                            <FiMapPin className="text-gray-400" /> {job.city || 'Indonesia'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ✅ Salary dari salary_min / salary_max — job_type & skills tidak ada di list */}
                  <div className="flex flex-wrap gap-2 mb-5 mt-1">
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-1.5 shadow-sm">
                      <FiDollarSign size={14} className="text-green-500 -mr-0.5" />
                      {job.salary_min > 0 && job.salary_max > 0
                        ? `${formatRupiah(job.salary_min)} – ${formatRupiah(job.salary_max)}`
                        : 'Gaji Kompetitif'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-5 border-t border-gray-50 gap-4 mt-auto">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                        <BsStars /> Analisis Kecocokan CV Tersedia
                      </span>
                    </div>
                    <button className="bg-white text-blue-600 border border-blue-100 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white shadow-sm">
                      Lihat Detail <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loading saat "Muat Lebih Banyak" (page > 1) */}
          {loading && pagination.page > 1 && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-bold">Memuat lebih banyak lowongan...</p>
            </div>
          )}

          {/* Tombol Muat Lebih Banyak */}
          {!loading && jobs.length > 0 && jobs.length < pagination.total && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="bg-white border border-gray-200 text-gray-700 font-bold px-8 py-3.5 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-sm flex items-center justify-center mx-auto gap-2 cursor-pointer"
              >
                Muat Lebih Banyak Lowongan <FiArrowRight size={18} />
              </button>
            </div>
          )}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-fadeIn { animation: fadeIn 0.4s cubic-bezier(0.4,0,0.2,1); }
          @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        `
      }} />
    </div>
  );
}