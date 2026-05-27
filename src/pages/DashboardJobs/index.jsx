import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiFilter,
  FiBriefcase, FiDollarSign, FiArrowRight,
  FiX, FiXCircle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAllJobs } from '../../services/api';

// Animasi Konfigurasi Reusable
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function DashboardJobs() {
  const navigate = useNavigate();

  // State untuk efek mengetik teks berputar
  const [typedText, setTypedText] = useState('');
  const words = ["Lebih Cepat & Tepat", "Sesuai Keahlian", "Secara Otomatis"];

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

  // --- Efek Mengetik Berputar ---
  useEffect(() => {
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let timer;

    const type = () => {
      const currentWord = words[wordIdx];
      if (!isDeleting) {
        setTypedText(currentWord.slice(0, charIdx + 1));
        charIdx++;
        if (charIdx === currentWord.length) {
          isDeleting = true;
          timer = setTimeout(type, 2000); // Jeda kata saat selesai diketik
        } else {
          timer = setTimeout(type, 110); // Kecepatan mengetik
        }
      } else {
        setTypedText(currentWord.slice(0, charIdx - 1));
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          wordIdx = (wordIdx + 1) % words.length;
          timer = setTimeout(type, 500); // Jeda singkat sebelum mengetik kata baru
        } else {
          timer = setTimeout(type, 65); // Kecepatan menghapus
        }
      }
    };

    type();
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    navigate(`/dashboard/detail/${jobId}`);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 selection:bg-blue-500/10 selection:text-blue-600 animate-fadeIn">

      {/* --- PAGE HEADER --- */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight text-left">
        Temukan Karir Impianmu <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent inline-block min-w-[280px]">
          {typedText}
          <span className="text-blue-600 animate-pulse font-light ml-0.5">|</span>
        </span>
      </h1>
      <p className="text-slate-500 mb-10 max-w-2xl text-sm md:text-base leading-relaxed font-medium text-left">
        Jelajahi ribuan lowongan pekerjaan terbaru dari perusahaan terkemuka. Gunakan AI kami
        untuk melihat seberapa cocok profilmu dengan posisi yang ada.
      </p>

      {/* --- SEARCH BAR --- */}
      <div className="bg-white/70 backdrop-blur-md p-6 md:p-8 rounded-3xl border border-slate-200/60 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
            <FiSearch className="text-blue-500" /> Eksplorasi Lowongan
          </h2>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <FiX /> Reset Filter
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3 relative z-10">
          {/* Input Search */}
          <div className="flex-1 flex items-center px-4 py-3 bg-slate-50/70 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 ring-blue-500/5 transition-all relative">
            <FiSearch className="text-slate-400 mr-3 shrink-0" size={18} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Posisi, kata kunci, atau nama perusahaan..."
              className="w-full bg-transparent outline-none text-slate-700 text-sm font-semibold"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-4 text-slate-400 hover:text-slate-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Input Kota */}
          <div className="md:w-1/3 flex items-center px-4 py-3 bg-slate-50/70 rounded-2xl border border-slate-200 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 ring-blue-500/5 transition-all relative">
            <FiMapPin className="text-slate-400 mr-3 shrink-0" size={18} />
            <input
              type="text"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Filter Kota..."
              className="w-full bg-transparent outline-none text-slate-700 text-sm font-semibold"
            />
            {locationInput && (
              <button
                onClick={() => setLocationInput('')}
                className="absolute right-4 text-slate-400 hover:text-slate-600"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-2.5 mt-5 overflow-x-auto pb-2 scrollbar-hide relative z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wide mr-2 shrink-0">
            <FiFilter /> Filter Cepat:
          </div>
          <button
            onClick={() => handleCheckboxFilter('job_type', 'Remote')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.job_type === 'Remote'
                ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Remote
          </button>
          <button
            onClick={() => handleCheckboxFilter('education_level', 'S1')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.education_level === 'S1'
                ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            S1
          </button>
          <button
            onClick={() => handleCheckboxFilter('education_level', 'SMA/SMK')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.education_level === 'SMA/SMK'
                ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            SMA/SMK
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR FILTER */}
        <aside className="w-full lg:w-1/4 space-y-6 shrink-0">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm sticky top-24">
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Tipe Pekerjaan
            </h3>
            <div className="space-y-2.5">
              {['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Remote'].map((type) => (
                <label key={type} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.job_type === type}
                    onChange={() => handleCheckboxFilter('job_type', type)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span
                    className={`text-sm group-hover:text-slate-950 transition-colors ${
                      filters.job_type === type ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'
                    }`}
                  >
                    {type}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Pendidikan Minimal
            </h3>
            <div className="space-y-2.5">
              {['SMA/SMK', 'D3', 'S1', 'S2'].map((edu) => (
                <label key={edu} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.education_level === edu}
                    onChange={() => handleCheckboxFilter('education_level', edu)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span
                    className={`text-sm group-hover:text-slate-950 transition-colors ${
                      filters.education_level === edu ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'
                    }`}
                  >
                    {edu}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Banner Edit CV */}
          <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 p-6 rounded-3xl text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-40 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="w-11 h-11 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border border-slate-100 relative z-10">
              <BsStars size={18} />
            </div>
            <h4 className="font-bold text-slate-900 mb-2 relative z-10 leading-tight">Tingkatkan Skor Anda</h4>
            <p className="text-xs text-slate-500 mb-5 relative z-10 leading-relaxed font-semibold">
              Perbarui CV Anda di Editor untuk meningkatkan persentase kecocokan dengan lowongan.
            </p>
            <button
              onClick={() => navigate('/editor')}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-2xl hover:bg-slate-800 transition-colors text-xs shadow-md relative z-10 cursor-pointer"
            >
              Buka CV Editor
            </button>
          </div>
        </aside>

        {/* DAFTAR LOWONGAN */}
        <div className="w-full lg:w-3/4">

          {/* Header jumlah & sort */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-extrabold text-slate-900 text-base">
              {loading && pagination.page === 1
                ? 'Mencari...'
                : `${pagination.total || jobs.length} Lowongan Ditemukan`}
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm">
              <span className="text-slate-400">Urutkan:</span>
              <select
                className="font-extrabold text-slate-700 bg-transparent outline-none cursor-pointer"
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
            <div className="p-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl mb-6 text-xs font-bold flex items-center gap-2">
              <FiXCircle className="shrink-0 text-rose-500" size={16} /> {error}
            </div>
          )}

          {/* Loading awal (page 1) */}
          {loading && pagination.page === 1 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menyinkronkan lowongan...</p>
            </div>

          ) : jobs.length === 0 && !error ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-5 border border-slate-100">
                  <FiSearch size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pencarian Tidak Ditemukan</h3>
                <p className="text-sm text-slate-500 max-w-sm font-medium leading-relaxed">
                  Maaf, tidak ada lowongan yang sesuai dengan kriteria filter Anda saat ini. Coba kurangi filter atau gunakan kata kunci lain.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-xs"
                >
                  Reset Filter
                </button>
              </div>

          ) : (
            /* Daftar Job dengan Animasi Stagger */
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-4"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={fadeInUp}
                  whileHover={{ y: -3 }}
                  onClick={() => handleNavigateToDetail(job.id)}
                  className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/20 hover:border-blue-200/80 transition-all group cursor-pointer flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-500 transition-colors" />

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4 text-left">
                      <div className="w-12 h-12 bg-gradient-to-tr from-slate-50 to-slate-100 border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner shrink-0 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                        {job.title?.substring(0, 1).toUpperCase() || 'J'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold flex-wrap">
                          <span className="flex items-center gap-1.5 font-bold text-slate-700">
                            <FiBriefcase className="text-slate-400" /> {job.company_name}
                          </span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block" />
                          <span className="flex items-center gap-1.5 font-medium">
                            <FiMapPin className="text-slate-400" /> {job.city || 'Indonesia'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 mt-1">
                    <span className="bg-emerald-500/5 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-500/10 flex items-center gap-1.5 shadow-sm">
                      <FiDollarSign size={13} className="text-emerald-500 shrink-0" />
                      {job.salary_min > 0 && job.salary_max > 0
                        ? `${formatRupiah(job.salary_min)} – ${formatRupiah(job.salary_max)}`
                        : 'Gaji Kompetitif'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-slate-100 gap-4 mt-auto">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-bold flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/5 text-blue-600 border border-blue-500/10 shadow-sm">
                        <BsStars /> Analisis Kecocokan CV Tersedia
                      </span>
                    </div>
                    <button className="bg-white text-blue-600 border border-blue-500/10 hover:border-blue-500 px-5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 group-hover:bg-blue-600 group-hover:text-white shadow-sm cursor-pointer">
                      Lihat Detail <FiArrowRight className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Loading saat "Muat Lebih Banyak" (page > 1) */}
          {loading && pagination.page > 1 && (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat lowongan...</p>
            </div>
          )}

          {/* Tombol Muat Lebih Banyak */}
          {!loading && jobs.length > 0 && jobs.length < pagination.total && (
            <div className="mt-10 text-center">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                className="bg-white border border-slate-200 text-slate-700 font-bold px-8 py-3.5 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors text-xs flex items-center justify-center mx-auto gap-2 cursor-pointer uppercase tracking-wider hover:border-slate-300"
              >
                Muat Lebih Banyak <FiArrowRight size={15} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}