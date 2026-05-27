import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiFilter,
  FiBriefcase, FiDollarSign, FiArrowRight,
  FiX, FiXCircle, FiCheckCircle, FiClock, FiInfo, FiFileText
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
  // eslint-disable-next-line no-unused-vars
  const isLoggedIn = !!localStorage.getItem('access_token');

  // State untuk efek mengetik teks berputar
  const [typedText, setTypedText] = useState('');
  const words = ["Lebih Cepat & Tepat", "Sesuai Keahlian", "Secara Otomatis"];

  // --- 1. STATE UNTUK DATA & LOADING ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination (Setiap halaman dibatasi 10 lowongan)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; 
  const [totalJobs, setTotalJobs] = useState(0);

  // --- 2. STATE UNTUK FILTER INSTAN (Diselaraskan persis dengan JobList) ---
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    province: '',
    minSalary: '',
    maxSalary: '',
    education_level: '',
    gender: '',
    job_type: '',
    work_system: '',
    sort: 'latest'
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

  // --- 3. DEBOUNCE SEARCH & LOCATION (Hanya untuk input teks mengetik) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput,
        city: locationInput
      }));
      setCurrentPage(1); // reset ke halaman 1 saat mengetik pencarian
    }, 600);
    return () => clearTimeout(timer);
  }, [searchInput, locationInput]);

  // --- 4. FETCH API ---
  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllJobs({
          search: filters.search || undefined,
          city: filters.city || undefined,
          province: filters.province || undefined,
          minSalary: filters.minSalary ? parseInt(filters.minSalary) : undefined,
          maxSalary: filters.maxSalary ? parseInt(filters.maxSalary) : undefined,
          education_level: filters.education_level || undefined,
          gender: filters.gender || undefined,
          job_type: filters.job_type || undefined,
          work_system: filters.work_system || undefined,
          page: currentPage,
          limit
        });

        // Ekstraksi data lowongan murni dan meta dari Swagger
        const jobsData = result?.jobs || result?.data || [];
        setJobs(Array.isArray(jobsData) ? jobsData : []);

        const paginationData = result?.pagination || result?.meta;
        if (paginationData) {
          const totalCount = paginationData.total || 0;
          setTotalJobs(totalCount);
          setTotalPages(Math.ceil(totalCount / limit) || 1);
        } else {
          const totalCount = result?.total || jobsData.length || 0;
          setTotalJobs(totalCount);
          setTotalPages(Math.ceil(totalCount / limit) || 1);
        }

      } catch (err) {
        setError(err.message || 'Gagal mengambil daftar lowongan.');
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [filters, currentPage, limit]);

  // --- 5. HANDLER INPUT & FILTER INSTAN ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset halaman ke 1 saat input gaji diubah
  };

  const handleCheckboxFilter = useCallback((type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? '' : value,
    }));
    setCurrentPage(1); // Reset halaman ke 1 saat filter sidebar dicentang
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setLocationInput('');
    setFilters({ 
      search: '', city: '', province: '', minSalary: '', maxSalary: '', 
      education_level: '', gender: '', job_type: '', work_system: '', sort: 'latest' 
    });
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = 
    filters.search || filters.city || filters.province || filters.minSalary || 
    filters.maxSalary || filters.education_level || filters.gender || 
    filters.job_type || filters.work_system;

  // --- LOGIKA PENGURUTAN DI SISI KLIEN (CLIENT-SIDE SORT) ---
  const getSortedJobs = () => {
    if (!Array.isArray(jobs)) return [];
    const jobsCopy = [...jobs];
    if (filters.sort === 'salary') {
      return jobsCopy.sort((a, b) => (b.salary_max || 0) - (a.salary_max || 0));
    }
    return jobsCopy.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  };

  const sortedJobs = getSortedJobs();

  // eslint-disable-next-line no-unused-vars
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
    <div className="max-w-7xl mx-auto pb-12 font-sans text-slate-800 animate-fadeIn">

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
            onClick={() => handleCheckboxFilter('work_system', 'remote')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.work_system === 'remote'
                ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            Remote
          </button>
          <button
            onClick={() => handleCheckboxFilter('education_level', 's1')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.education_level === 's1'
                ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            S1
          </button>
          <button
            onClick={() => handleCheckboxFilter('education_level', 'sma')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${
              filters.education_level === 'sma'
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
        <aside className="w-full lg:w-1/4 space-y-6 shrink-0 text-left">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm sticky top-24">
            
            {/* TIPE PEKERJAAN */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Tipe Pekerjaan
            </h3>
            <div className="space-y-2.5">
              {[
                { slug: 'penuh-waktu', label: 'Penuh Waktu' },
                { slug: 'kontrak', label: 'Kontrak' },
                { slug: 'magang', label: 'Magang' },
                { slug: 'paruh-waktu', label: 'Paruh Waktu' },
                { slug: 'freelance', label: 'Freelance' }
              ].map((item) => (
                <label key={item.slug} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.job_type === item.slug}
                    onChange={() => handleCheckboxFilter('job_type', item.slug)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span
                    className={`text-sm group-hover:text-slate-950 transition-colors ${
                      filters.job_type === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* SISTEM KERJA */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Sistem Kerja
            </h3>
            <div className="space-y-2.5">
              {[
                { slug: 'di-kantor', label: 'Kerja di Kantor' },
                { slug: 'remote', label: 'Remote / Dari Rumah' },
                { slug: 'hybrid', label: 'Hybrid' }
              ].map((item) => (
                <label key={item.slug} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.work_system === item.slug}
                    onChange={() => handleCheckboxFilter('work_system', item.slug)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span
                    className={`text-sm group-hover:text-slate-950 transition-colors ${
                      filters.work_system === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* PENDIDIKAN MINIMAL */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">
              Pendidikan Minimal
            </h3>
            <div className="space-y-2.5">
              {[
                { slug: 'sma', label: 'Minimal SMA/SMK' },
                { slug: 'd3', label: 'Minimal Diploma (D1-D4)' },
                { slug: 's1', label: 'Minimal Sarjana (S1)' },
                { slug: 's2', label: 'Minimal Pasca Sarjana (S2)' },
                { slug: 'semua', label: 'Semua Jenjang' }
              ].map((item) => (
                <label key={item.slug} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.education_level === item.slug}
                    onChange={() => handleCheckboxFilter('education_level', item.slug)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span
                    className={`text-sm group-hover:text-slate-950 transition-colors ${
                      filters.education_level === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'
                    }`}
                  >
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* PERSYARATAN GENDER */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">Gender</h3>
            <div className="space-y-2.5">
              {[
                { slug: 'laki-laki', label: 'Laki-laki saja' },
                { slug: 'perempuan', label: 'Perempuan saja' },
                { slug: 'semua', label: 'Tanpa Ketentuan' }
              ].map((item) => (
                <label key={item.slug} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.gender === item.slug}
                    onChange={() => handleCheckboxFilter('gender', item.slug)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                  />
                  <span className={`text-sm group-hover:text-slate-950 transition-colors ${filters.gender === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'}`}>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* GAJI MINIMAL & MAKSIMAL */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">Gaji (IDR)</h3>
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-slate-400 font-bold">Rp</div>
                <input type="number" name="minSalary" placeholder="Min. Gaji" value={filters.minSalary} onChange={handleInputChange} className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-4 ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-slate-400 font-bold">Rp</div>
                <input type="number" name="maxSalary" placeholder="Max. Gaji" value={filters.maxSalary} onChange={handleInputChange} className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-4 ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>

          {/* Banner Edit CV */}
          <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 p-6 rounded-3xl text-center shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-40 rounded-full translate-x-1/3 -translate-y-1/3" />
            <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border border-slate-100 relative z-10">
              <BsStars size={20} />
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
              {loading && currentPage === 1
                ? 'Mencari...'
                : `${totalJobs} Lowongan Ditemukan`}
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-slate-400">Urutkan:</span>
              <select
                className="font-bold text-slate-700 bg-transparent outline-none cursor-pointer"
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
          {loading && currentPage === 1 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Menyinkronkan lowongan...</p>
            </div>

          ) : sortedJobs.length === 0 && !error ? (
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
              {sortedJobs.map((job) => (
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
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block" />
                          <span className="flex items-center gap-1.5 font-medium">
                            <FiMapPin className="text-slate-400" /> {job.city || 'Indonesia'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* DATA PILAR PENTING */}
                  <div className="flex flex-wrap gap-2 mb-5 mt-1">
                    <span className="bg-emerald-500/5 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/10 flex items-center gap-1.5 shadow-sm">
                      <FiDollarSign size={13} className="text-emerald-500 shrink-0" />
                      {job.salary_raw || 'Gaji Kompetitif'}
                    </span>
                    {job.job_type && (
                      <span className="bg-slate-50 text-slate-500 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-slate-200/60 shadow-sm flex items-center gap-1.5">
                        <FiBriefcase size={12} className="text-slate-400 shrink-0" /> {job.job_type}
                      </span>
                    )}
                    {job.work_system && (
                      <span className="bg-blue-500/5 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-500/10 shadow-sm flex items-center gap-1.5 capitalize">
                        <FiInfo size={12} className="text-blue-500 shrink-0" /> {job.work_system}
                      </span>
                    )}
                    {job.education_level && (
                      <span className="bg-purple-500/5 text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-500/10 shadow-sm flex items-center gap-1.5">
                        <FiFileText size={12} className="text-purple-500 shrink-0" /> {job.education_level}
                      </span>
                    )}
                  </div>

                  {/* KEAHLIAN / SKILLS UTAMA */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5 text-left">
                      {job.skills.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className="bg-white border border-slate-200 text-slate-400 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-slate-400 text-[10px] font-extrabold px-2 py-1 bg-slate-50 rounded-lg border border-slate-200">
                          +{job.skills.length - 4} Lainnya
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-50 gap-4 mt-auto">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/5 text-blue-600 border border-blue-500/10 shadow-sm">
                        <BsStars /> Analisis Kecocokan CV Tersedia
                      </span>
                    </div>
                    
                    {/* TANGGAL RILIS LOWONGAN */}
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5"><FiClock /> {job.created_at ? new Date(job.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Kontrol Paginasi Halaman */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm">
              <button 
                disabled={currentPage === 1} 
                onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Sebelumnya
              </button>
              <span className="px-3 py-1 text-slate-500 text-xs font-bold">Halaman <strong className="text-slate-900">{currentPage}</strong> dari {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                Selanjutnya
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}