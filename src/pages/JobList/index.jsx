import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiMapPin, FiBriefcase, FiFilter,
  FiDollarSign, FiFileText, FiXCircle, FiClock, FiArrowRight, FiMenu, FiInfo, FiCheckCircle, FiX
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAllJobs } from '../../services/api';
import Navbar from '../../components/layout/Navbar';

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

export default function JobList() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access_token');

  // State untuk efek mengetik "Tanpa Batasan"
  const [typedText, setTypedText] = useState('');
  const fullText = "Tanpa Batasan";

  // --- 1. STATE UNTUK DATA & LOADING ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; 
  const [totalJobs, setTotalJobs] = useState(0);

  // --- 2. STATE UNTUK FILTER INSTAN (Menjamin Kecepatan Pemrosesan) ---
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

  // State lokal khusus untuk input teks yang butuh debounce
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // --- Efek Mengetik "Tanpa Batasan" (Typewriter loop) ---
  useEffect(() => {
    let currentText = '';
    let isDeleting = false;
    let i = 0;
    let timer;

    const type = () => {
      if (!isDeleting) {
        currentText = fullText.slice(0, i + 1);
        setTypedText(currentText);
        i++;
        if (i === fullText.length) {
          isDeleting = true;
          timer = setTimeout(type, 2000);
        } else {
          timer = setTimeout(type, 130);
        }
      } else {
        currentText = fullText.slice(0, i - 1);
        setTypedText(currentText);
        i--;
        if (i === 0) {
          isDeleting = false;
          timer = setTimeout(type, 600);
        } else {
          timer = setTimeout(type, 60);
        }
      }
    };

    type();
    return () => clearTimeout(timer);
  }, []);

  // --- 3. DEBOUNCE EFFECT (Khusus Input Teks saja) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        search: searchInput,
        city: locationInput
      }));
      setCurrentPage(1); // Reset halaman ke 1 saat pencarian kata kunci berubah
    }, 600);
    return () => clearTimeout(timer);
  }, [searchInput, locationInput]);

  // --- 4. FETCH API EFFECT ---
  useEffect(() => {
    const fetchJobsList = async () => {
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
        console.error('Fetch error:', err);
        setError(err.message || 'Gagal mengambil data lowongan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobsList();
  }, [filters, currentPage, limit]);

  // --- 5. HANDLER FILTER INSTAN ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset halaman ke 1 saat filter gaji diisi
  };

  const handleCheckboxFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? '' : value
    }));
    setCurrentPage(1); // Reset halaman ke 1 saat filter dicentang
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setFilters({ 
      search: '', city: '', province: '', minSalary: '', maxSalary: '', 
      education_level: '', gender: '', job_type: '', work_system: '', sort: 'latest' 
    });
    setCurrentPage(1);
  };

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

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 pb-20 relative selection:bg-blue-500/10 selection:text-blue-600">
      
      {/* Dekorasi Grid & Radial Glow */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.22] -z-10 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-transparent -z-10 pointer-events-none" />

      {/* NAVBAR - Using reusable component */}
      <Navbar variant="landing" activeItem="/lowongan" />

      {/* --- HERO & SEARCH SECTION --- */}
      <section className="pt-32 pb-12 px-6 md:px-12 lg:px-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            Eksplorasi Karir Impianmu <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent inline-block min-w-[280px]">
              {typedText}<span className="text-blue-600 animate-pulse font-light ml-0.5">|</span>
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-slate-500 mb-8 max-w-2xl text-base font-medium"
          >
            Temukan lowongan pekerjaan terbaru secara akurat. Masukkan keahlian atau posisi yang ingin dituju, dan biarkan AI mencocokkannya dengan CV Anda.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="bg-white/70 backdrop-blur-md p-2.5 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-200 flex flex-col md:flex-row gap-3 max-w-4xl relative"
          >
            <div className="flex-1 flex items-center px-4 py-3 bg-slate-50/70 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 ring-blue-500/5 transition-all relative">
              <FiSearch className="text-slate-400 mr-3 shrink-0" size={18}/>
              <input
                type="text"
                name="search"
                placeholder="Posisi, nama perusahaan, atau kata kunci (Misal: React)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 text-sm font-semibold"
              />
              {searchInput && (
                <button onClick={() => setSearchInput('')} className="absolute right-4 text-slate-400 hover:text-slate-600"><FiX size={16}/></button>
              )}
            </div>
            <div className="md:w-1/3 flex items-center px-4 py-3 bg-slate-50/70 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 ring-blue-500/5 transition-all relative">
              <FiMapPin className="text-slate-400 mr-3 shrink-0" size={18}/>
              <input
                type="text"
                name="city"
                placeholder="Filter Kota (Misal: Sleman)..."
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full bg-transparent outline-none text-slate-700 text-sm font-semibold"
              />
              {locationInput && (
                <button onClick={() => setLocationInput('')} className="absolute right-4 text-slate-400 hover:text-slate-600"><FiX size={16}/></button>
              )}
            </div>
          </motion.div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2.5 mt-5 overflow-x-auto pb-2 scrollbar-hide max-w-4xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider mr-2 shrink-0"><FiFilter/> Populer:</div>
            {/* Filter Cepat Remote ( work_system = remote ) */}
            <button 
              onClick={() => handleCheckboxFilter('work_system', 'remote')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${filters.work_system === 'remote' ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Remote
            </button>
            <button 
              onClick={() => handleCheckboxFilter('education_level', 's1')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${filters.education_level === 's1' ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Lulusan S1
            </button>
            <button 
              onClick={() => handleCheckboxFilter('education_level', 'sma')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold shrink-0 border transition-all ${filters.education_level === 'sma' ? 'bg-blue-500/5 text-blue-600 border-blue-500/20 font-extrabold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Lulusan SMA/SMK
            </button>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="ml-auto text-xs font-bold text-red-500 hover:text-red-700 shrink-0 uppercase tracking-wider bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 transition-colors">
                Reset Semua
              </button>
            )}
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10 flex flex-col lg:flex-row gap-10">
        
        {/* --- SIDEBAR FILTER --- */}
        <aside className="w-full lg:w-1/4 space-y-6 shrink-0 text-left">
          <div className="bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/60 shadow-sm sticky top-24">
            
            {/* TIPE PEKERJAAN */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">Tipe Pekerjaan</h3>
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
                  <span className={`text-sm group-hover:text-slate-950 transition-colors ${filters.job_type === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'}`}>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* SISTEM KERJA */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">Sistem Kerja</h3>
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
                  <span className={`text-sm group-hover:text-slate-950 transition-colors ${filters.work_system === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'}`}>{item.label}</span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-slate-100 my-5" />

            {/* PENDIDIKAN MINIMAL */}
            <h3 className="font-extrabold text-slate-900 mb-4 text-xs uppercase tracking-wider">Pendidikan Minimal</h3>
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
                  <span className={`text-sm group-hover:text-slate-950 transition-colors ${filters.education_level === item.slug ? 'text-blue-600 font-bold' : 'text-slate-500 font-semibold'}`}>{item.label}</span>
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
        </aside>

        {/* --- DAFTAR LISTING LOWONGAN (Mengambil data penting dari payload) --- */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-extrabold text-slate-900 text-base">
               {loading ? 'Mencari...' : `${totalJobs} Lowongan Ditemukan`}
            </h2>
            <div className="flex items-center gap-2 text-xs font-bold bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-slate-400">Urutkan:</span>
              <select 
                className="font-extrabold text-slate-700 bg-transparent outline-none cursor-pointer"
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
              >
                <option value="latest">Terbaru</option>
                <option value="salary">Gaji</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-slate-200/60 shadow-sm">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Memuat lowongan...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-rose-50 rounded-3xl border border-rose-100 flex flex-col items-center p-6">
                <div className="w-14 h-14 bg-white text-rose-500 rounded-full flex items-center justify-center mb-4 shadow-sm border border-rose-100"><FiXCircle size={24} /></div>
                <h3 className="font-extrabold text-rose-800 mb-1">Gagal Sinkronisasi</h3>
                <p className="text-sm text-rose-600 font-medium max-w-sm">{error}</p>
              </div>
            ) : sortedJobs.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col items-center p-6">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-5 border border-slate-100"><FiSearch size={24}/></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Pencarian Tidak Ditemukan</h3>
                <p className="text-sm text-slate-500 max-w-sm font-medium leading-relaxed">Maaf, tidak ada lowongan yang sesuai dengan kriteria filter Anda saat ini. Coba kurangi filter atau gunakan kata kunci lain.</p>
                <button onClick={handleClearFilters} className="mt-6 font-bold text-blue-600 bg-blue-50 px-5 py-2.5 rounded-xl hover:bg-blue-100 transition-colors text-xs">Reset Filter</button>
              </div>
            ) : (
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-4"
              >
                {sortedJobs.map((job) => (
                  <motion.div
                    key={job?.id}
                    variants={fadeInUp}
                    whileHover={{ y: -3 }}
                    className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/30 hover:border-blue-200/80 transition-all group flex flex-col cursor-pointer text-left relative overflow-hidden"
                    onClick={() => navigate(`/detail/${job?.id}`)}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-slate-50 to-slate-100 border border-slate-200 text-slate-700 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner shrink-0 group-hover:from-blue-50 group-hover:to-indigo-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-colors">
                          {job?.title?.substring(0, 1).toUpperCase() || 'J'}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                            {job?.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 font-semibold">
                            <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                              <FiBriefcase className="text-slate-400" /> {job?.company_name}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
                            <span className="flex items-center gap-1.5 font-medium truncate">
                              <FiMapPin className="text-slate-400" /> {job?.location || `${job?.city || ''}, ${job?.province || ''}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* PILAR DATA PENTING LOWONGAN */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Gaji Raw */}
                      <span className="bg-emerald-500/5 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-emerald-500/10 flex items-center gap-1.5 shadow-sm">
                      <span className="text-emerald-500 shrink-0" />
                        {job?.salary_raw || 'Gaji Kompetitif'}
                      </span>
                      {/* Tipe Pekerjaan */}
                      {job?.job_type && (
                        <span className="bg-slate-50 text-slate-500 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200/60 shadow-sm flex items-center gap-1.5">
                          <FiBriefcase size={12} className="text-slate-400 shrink-0" /> {job.job_type}
                        </span>
                      )}
                      {/* Sistem Kerja */}
                      {job?.work_system && (
                        <span className="bg-blue-500/5 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-blue-500/10 shadow-sm flex items-center gap-1.5 capitalize">
                          <FiInfo size={12} className="text-blue-500 shrink-0" /> {job.work_system}
                        </span>
                      )}
                      {/* Pendidikan */}
                      {job?.education_level && (
                        <span className="bg-purple-500/5 text-purple-700 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-purple-500/10 shadow-sm flex items-center gap-1.5">
                          <FiFileText size={12} className="text-purple-500 shrink-0" /> {job.education_level}
                        </span>
                      )}
                    </div>

                    {/* KEAHLIAN/SKILLS UTAMA */}
                    {job?.skills && job.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
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

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-slate-100 gap-4 mt-auto">
                      <div className="flex items-center gap-3 text-xs">
                        {isLoggedIn ? (
                          <span className="font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/5 text-emerald-600 border border-emerald-500/10">
                            <FiCheckCircle className="text-emerald-500" /> Terhubung dengan CV
                          </span>
                        ) : (
                          <span className="text-purple-600 bg-purple-500/5 px-2.5 py-1 rounded-lg border border-purple-500/10 font-bold flex items-center gap-1.5">
                            <BsStars className="text-purple-500" /> AI Matcher Tersedia
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Kontrol Paginasi */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 p-4 bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/60 shadow-sm">
                    <button 
                      disabled={currentPage === 1} 
                      onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Sebelumnya
                    </button>
                    <span className="px-1 py-1 text-slate-500 text-xs font-bold">Halaman <strong className="text-slate-900">{currentPage}</strong> dari {totalPages}</span>
                    <button 
                      disabled={currentPage === totalPages} 
                      onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}