import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiMapPin, FiMenu, FiX, FiBriefcase, FiFilter,
  FiDollarSign, FiCheckCircle, FiFileText, FiXCircle, FiClock, FiArrowRight
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAllJobs } from '../../services/api';

export default function JobList() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');

  // --- 1. STATE UNTUK DATA & LOADING ---
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Jumlah item per halaman
  const [totalJobs, setTotalJobs] = useState(0);

  // --- 2. STATE UNTUK INPUT (LOKAL) & FILTER (API) ---
  const [inputs, setInputs] = useState({
    search: '',
    city: '',
    minSalary: '',
    maxSalary: '',
    job_type: '',
    education_level: '',
    sort: 'latest'
  });

  // State yang dikirim ke API (Diperbarui setelah debounce)
  const [filters, setFilters] = useState(inputs);

  // --- 3. DEBOUNCE EFFECT ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(inputs);
      setCurrentPage(1); // Reset halaman saat filter berubah
    }, 800);
    return () => clearTimeout(timer);
  }, [inputs]);

  // --- 4. FETCH API EFFECT ---
  useEffect(() => {
    const fetchJobsList = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllJobs({
          search: filters.search,
          city: filters.city,
          minSalary: filters.minSalary,
          maxSalary: filters.maxSalary,
          education_level: filters.education_level,
          page: currentPage,
          limit
        });

        setJobs(Array.isArray(result.jobs) ? result.jobs : []);
        if (result.pagination) {
          setTotalJobs(result.pagination.total || 0);
          setTotalPages(Math.ceil((result.pagination.total || 0) / limit) || 1);
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

  // --- 5. HANDLER FILTER ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxFilter = (type, value) => {
    setInputs(prev => ({
      ...prev,
      [type]: prev[type] === value ? '' : value
    }));
  };

  const handleClearFilters = () => {
    const emptyState = { search: '', city: '', minSalary: '', maxSalary: '', job_type: '', education_level: '', sort: 'latest' };
    setInputs(emptyState);
    setFilters(emptyState);
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(inputs).some(val => val !== '' && val !== 'latest');

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Gaji Disembunyikan';
    const fmt = (n) => `Rp ${(n / 1_000_000).toFixed(0)}jt`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `≥ ${fmt(min)}`;
    return `≤ ${fmt(max)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-20">
      
      {/* --- NAVBAR --- */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-16 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <div>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-15 h-15 object-contain" />
          </div>
          ITCareerMatch
        </div>
        
        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors cursor-pointer">Beranda</a>
          <a onClick={() => navigate('/lowongan')} className="text-blue-600 font-bold transition-colors cursor-pointer">Daftar Lowongan</a>
          <a onClick={() => navigate('/tentang-kami')} className="hover:text-blue-600 transition-colors cursor-pointer">Tentang Kami</a>
        </nav>
        
        {/* Tombol Mobile Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        
        {/* Aksi Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors cursor-pointer"
            >
              Ke Dashboard
            </button>
          ) : (
            <button onClick={() => navigate('/login')} className="hover:text-blue-600 text-sm font-bold transition-colors cursor-pointer mr-2">
              Masuk
            </button>
          )}
          <button 
            onClick={() => navigate('/analisis-baru')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-colors cursor-pointer flex items-center gap-2"
          >
            <BsStars /> Cek Skor CV
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {mobileMenuOpen && (
        <div className="fixed md:hidden inset-x-0 top-[73px] z-40 bg-white border-b border-gray-100 px-8 py-6 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto"> 
          <div className="flex flex-col gap-5 text-sm font-bold text-gray-700 items-start bg-white">
            <a onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Beranda</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate('/lowongan'); }} className="block text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Daftar Lowongan</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate('/tentang-kami'); }} className="block hover:text-blue-600 transition-colors cursor-pointer w-full border-b border-gray-50 pb-3">Tentang Kami</a>
            <div className="flex flex-col gap-3 pt-2 w-full">
              {isLoggedIn ? (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }} className="w-full bg-white text-gray-700 px-4 py-3 rounded-xl border border-gray-200 transition-colors">Dashboard</button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 bg-gray-50">Masuk</button>
              )}
              <button onClick={() => { setMobileMenuOpen(false); navigate('/analisis-baru'); }} className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"><BsStars /> Cek Skor CV</button>
            </div>
          </div>
        </div>
      )}

      {/* --- HERO & SEARCH SECTION --- */}
      <section className="bg-white pt-10 pb-12 px-6 md:px-12 lg:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Eksplorasi Karir Impianmu <br className="hidden md:block"/>
            <span className="text-blue-600">Tanpa Batasan</span>
          </h1>
          <p className="text-gray-500 mb-8 max-w-2xl text-lg">
            Temukan ribuan lowongan terbaru. Ketik posisi atau perusahaan yang kamu inginkan, dan biarkan AI kami membantu mencocokkannya dengan CV-mu.
          </p>
          
          <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-2 max-w-4xl relative">
            <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 ring-blue-100 transition-all relative">
              <FiSearch className="text-gray-400 mr-3 shrink-0" size={20}/>
              <input
                type="text"
                name="search"
                placeholder="Posisi, nama perusahaan, atau kata kunci (Misal: React)..."
                value={inputs.search}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none text-gray-700 text-sm"
              />
              {inputs.search && (
                <button onClick={() => handleInputChange({ target: { name: 'search', value: '' }})} className="absolute right-4 text-gray-400 hover:text-gray-600"><FiX /></button>
              )}
            </div>
            <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 ring-blue-100 transition-all relative">
              <FiMapPin className="text-gray-400 mr-3 shrink-0" size={20}/>
              <input
                type="text"
                name="city"
                placeholder="Filter Kota atau Provinsi..."
                value={inputs.city}
                onChange={handleInputChange}
                className="w-full bg-transparent outline-none text-gray-700 text-sm"
              />
              {inputs.city && (
                <button onClick={() => handleInputChange({ target: { name: 'city', value: '' }})} className="absolute right-4 text-gray-400 hover:text-gray-600"><FiX /></button>
              )}
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 mt-5 overflow-x-auto pb-2 scrollbar-hide max-w-4xl">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mr-2 shrink-0"><FiFilter/> Populer:</div>
            <button 
              onClick={() => handleCheckboxFilter('job_type', 'Remote')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 border transition-all ${inputs.job_type === 'Remote' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Remote
            </button>
            <button 
              onClick={() => handleCheckboxFilter('education_level', 'S1')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 border transition-all ${inputs.education_level === 'S1' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Lulusan S1
            </button>
            <button 
              onClick={() => handleCheckboxFilter('education_level', 'SMA/SMK')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 border transition-all ${inputs.education_level === 'SMA/SMK' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Lulusan SMA/SMK
            </button>
            {hasActiveFilters && (
              <button onClick={handleClearFilters} className="ml-auto text-sm font-bold text-red-500 hover:text-red-700 shrink-0">
                Reset Semua
              </button>
            )}
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-10 flex flex-col lg:flex-row gap-10">
        
        {/* --- SIDEBAR FILTER --- */}
        <aside className="w-full lg:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Tipe Pekerjaan</h3>
            <div className="space-y-3">
              {['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Remote'].map((type, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={inputs.job_type === type}
                    onChange={() => handleCheckboxFilter('job_type', type)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm group-hover:text-gray-900 ${inputs.job_type === type ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{type}</span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Pendidikan Minimal</h3>
            <div className="space-y-3">
              {['SMA/SMK', 'D3', 'S1', 'S2'].map((edu, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={inputs.education_level === edu}
                    onChange={() => handleCheckboxFilter('education_level', edu)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm group-hover:text-gray-900 ${inputs.education_level === edu ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{edu}</span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Gaji (IDR)</h3>
            <div className="space-y-3">
              <input type="number" name="minSalary" placeholder="Min. Gaji" value={inputs.minSalary} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="number" name="maxSalary" placeholder="Max. Gaji" value={inputs.maxSalary} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          {!isLoggedIn ? (
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-center text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm text-yellow-300 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20"><BsStars size={24}/></div>
                <h4 className="font-bold text-lg mb-2">Aktifkan AI Matcher</h4>
                <p className="text-xs text-blue-100 mb-6 leading-relaxed">Login sekarang untuk melihat persentase kecocokan CV kamu dengan setiap lowongan secara otomatis.</p>
                <button onClick={() => navigate('/login')} className="w-full bg-white text-blue-700 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-md cursor-pointer">Login / Daftar Gratis</button>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-3xl text-center">
               <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><BsStars size={20}/></div>
               <h4 className="font-bold text-gray-900 mb-2">Tingkatkan Skor Anda</h4>
               <p className="text-xs text-gray-500 mb-4">Perbarui CV Anda di Editor untuk meningkatkan persentase kecocokan.</p>
               <button onClick={() => navigate('/editor')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">Buka CV Editor</button>
            </div>
          )}
        </aside>

        {/* --- DAFTAR LISTING LOWONGAN --- */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900 text-lg">
               {loading ? 'Mencari...' : `${totalJobs || jobs?.length || 0} Lowongan Ditemukan`}
            </h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Urutkan:</span>
              <select 
                className="font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
                value={inputs.sort}
                onChange={(e) => handleInputChange({ target: { name: 'sort', value: e.target.value }})}
              >
                <option value="latest">Terbaru</option>
                <option value="salary">Gaji</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-gray-100">
                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-semibold text-gray-500">Menyinkronkan data lowongan...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-50 rounded-3xl border border-red-100 flex flex-col items-center">
                <div className="w-16 h-16 bg-white text-red-500 rounded-full flex items-center justify-center mb-4 shadow-sm"><FiXCircle size={32} /></div>
                <h3 className="font-bold text-red-800 mb-1">Terjadi Kesalahan</h3>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-5"><FiSearch size={32}/></div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h3>
                <p className="text-sm text-gray-500 max-w-sm">Maaf, tidak ada lowongan yang sesuai dengan filter Anda. Coba kurangi filter atau gunakan kata kunci lain.</p>
                <button onClick={handleClearFilters} className="mt-6 font-bold text-blue-600 bg-blue-50 px-6 py-2.5 rounded-xl hover:bg-blue-100 transition-colors">Reset Filter</button>
              </div>
            ) : (
              <>
                {jobs.map((job) => (
                  <div
                    key={job?.id}
                    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all group flex flex-col cursor-pointer"
                    onClick={() => navigate(`/detail/${job?.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl shadow-sm shrink-0">
                          {job?.title?.substring(0, 1).toUpperCase() || 'J'}
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                            {job?.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                            <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                              <FiBriefcase className="text-gray-400" /> {job?.company_name}
                            </span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full hidden sm:block"></span>
                            {/* ✅ Hanya city — province tidak ada di list response */}
                            <span className="flex items-center gap-1.5">
                              <FiMapPin className="text-gray-400" /> {job?.city || 'Indonesia'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {/* ✅ Salary dari salary_min / salary_max */}
                      <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-1.5">
                        <FiDollarSign size={14} className="-mr-0.5" />
                        {formatSalary(job?.salary_min, job?.salary_max)}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-5 border-t border-gray-50 gap-4 mt-auto">
                      <div className="flex items-center gap-3 text-xs">
                        {isLoggedIn ? (
                          <span className="font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-50 text-green-600 border border-green-100">
                            <FiCheckCircle /> Terhubung dengan CV Anda
                          </span>
                        ) : (
                          <span className="text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100 font-bold flex items-center gap-1.5">
                            <BsStars /> Tersedia AI Match
                          </span>
                        )}
                      </div>
                      <span className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:mr-1 transition-all">
                        Lihat Detail <FiArrowRight />
                      </span>
                    </div>
                  </div>
                ))}

                {/* Kontrol Paginasi */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-10 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <button 
                      disabled={currentPage === 1} 
                      onClick={() => { setCurrentPage(prev => Math.max(1, prev - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Sebelumnya
                    </button>
                    <span className="px-4 py-2 text-gray-600 text-sm font-medium">Halaman <strong className="text-gray-900">{currentPage}</strong> dari {totalPages}</span>
                    <button 
                      disabled={currentPage === totalPages} 
                      onClick={() => { setCurrentPage(prev => Math.min(totalPages, prev + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}