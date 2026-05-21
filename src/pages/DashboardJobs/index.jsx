import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiMapPin, FiFilter, FiBookmark, FiClock, 
  FiBriefcase, FiDollarSign, FiCheckCircle, FiArrowRight,
  FiX
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

  // --- 2. STATE UNTUK FILTER (PARAMS) ---
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    province: '',
    job_type: '',
    education_level: '',
    sort: 'latest', // Pseudo-sort (bisa diadaptasi jika backend mendukung order_by)
  });

  // State lokal untuk input teks (agar bisa di-debounce)
  const [searchInput, setSearchInput] = useState('');
  const [locationInput, setLocationInput] = useState('');

  // Debounce untuk Search Input
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput, city: locationInput, page: 1 }));
    }, 800); // Tunggu 800ms setelah user berhenti mengetik
    return () => clearTimeout(timer);
  }, [searchInput, locationInput]);

  // --- 3. EFEK UNTUK FETCHING API ---
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
          job_type: filters.job_type,
          education_level: filters.education_level
        });

        // Jika halaman > 1 (Muat lebih banyak), gabungkan array
        if (pagination.page > 1) {
          setJobs(prev => [...prev, ...(result.jobs || [])]);
        } else {
          setJobs(result.jobs || []);
        }
        
        if (result.pagination) {
            setPagination(prev => ({ ...prev, total: result.pagination.total }));
        }

      } catch (err) {
        setError(err.message || "Gagal mengambil daftar lowongan.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]); // Refetch saat filter berubah atau halaman bertambah

  // --- 4. HANDLER FILTER KLIK ---
  const handleCheckboxFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? '' : value, // Toggle filter
      page: 1 // Reset ke halaman 1 tiap kali filter berubah
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setLocationInput('');
    setFilters({ search: '', city: '', province: '', job_type: '', education_level: '', sort: 'latest' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Cek apakah ada filter yang aktif
  const hasActiveFilters = filters.search || filters.city || filters.job_type || filters.education_level;

  return (
    <div className="max-w-7xl mx-auto pb-12 font-sans text-gray-800">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Temukan Karir Impianmu <br className="hidden md:block"/>
            <span className="text-blue-600">Lebih Cepat & Tepat</span>
          </h1>
          <p className="text-gray-500 mb-10 max-w-2xl text-lg">
            Jelajahi ribuan lowongan pekerjaan terbaru dari perusahaan terkemuka. Gunakan AI kami untuk melihat seberapa cocok profilmu dengan posisi yang ada.
          </p>
      
      {/* --- SEARCH BAR AREA --- */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Eksplorasi Lowongan</h1>
          {hasActiveFilters && (
            <button onClick={handleClearFilters} className="text-sm font-bold text-red-500 hover:text-red-700 flex items-center gap-1">
              <FiX /> Hapus Filter
            </button>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors relative">
            <FiSearch className="text-gray-400 mr-3" size={20}/>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Posisi, kata kunci, atau nama perusahaan..." 
              className="w-full bg-transparent outline-none text-gray-700 text-sm"
            />
            {searchInput && <button onClick={() => setSearchInput('')} className="absolute right-4 text-gray-400 hover:text-gray-600"><FiX/></button>}
          </div>
          <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors relative">
            <FiMapPin className="text-gray-400 mr-3" size={20}/>
            <input 
              type="text" 
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              placeholder="Filter Kota atau Provinsi..." 
              className="w-full bg-transparent outline-none text-gray-700 text-sm"
            />
            {locationInput && <button onClick={() => setLocationInput('')} className="absolute right-4 text-gray-400 hover:text-gray-600"><FiX/></button>}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mr-2 shrink-0"><FiFilter/> Populer:</div>
          <button 
            onClick={() => handleCheckboxFilter('job_type', 'Remote')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 border transition-all ${filters.job_type === 'Remote' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Remote
          </button>
          <button 
            onClick={() => handleCheckboxFilter('education_level', 'S1')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 border transition-all ${filters.education_level === 'S1' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Lulusan S1
          </button>
          <button 
            onClick={() => handleCheckboxFilter('education_level', 'SMA/SMK')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium shrink-0 border transition-all ${filters.education_level === 'SMA/SMK' ? 'bg-blue-50 text-blue-600 border-blue-200 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            Lulusan SMA/SMK
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT (Sidebar Filter & List) --- */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTER (Kiri) */}
        <aside className="w-full lg:w-1/4 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Tipe Pekerjaan</h3>
            <div className="space-y-3">
              {['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Remote'].map((type, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filters.job_type === type}
                    onChange={() => handleCheckboxFilter('job_type', type)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm group-hover:text-gray-900 ${filters.job_type === type ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{type}</span>
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
                    checked={filters.education_level === edu}
                    onChange={() => handleCheckboxFilter('education_level', edu)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`text-sm group-hover:text-gray-900 ${filters.education_level === edu ? 'text-blue-600 font-bold' : 'text-gray-600'}`}>{edu}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Banner Edit CV */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
             <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><BsStars size={20}/></div>
             <h4 className="font-bold text-gray-900 mb-2">Tingkatkan Skor Anda</h4>
             <p className="text-xs text-gray-500 mb-4">Perbarui CV Anda di Editor untuk meningkatkan persentase kecocokan dengan lowongan.</p>
             <button onClick={() => navigate('/editor')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">Buka CV Editor</button>
          </div>
        </aside>

        {/* DAFTAR LOWONGAN (Kanan) */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">{pagination.total || jobs.length} Lowongan Ditemukan</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Urutkan:</span>
              <select 
                className="font-semibold text-gray-900 bg-transparent outline-none cursor-pointer"
                value={filters.sort}
                onChange={(e) => setFilters(prev => ({...prev, sort: e.target.value}))}
              >
                <option value="latest">Terbaru</option>
                <option value="salary">Gaji (Estimasi)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {jobs.length === 0 && !loading && !error ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4"><FiSearch size={24}/></div>
              <h3 className="font-bold text-gray-900 mb-2">Pencarian Tidak Ditemukan</h3>
              <p className="text-sm text-gray-500">Coba ubah kata kunci atau hapus beberapa filter pencarian.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                        {job.title?.substring(0, 1).toUpperCase() || 'J'}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer" onClick={() => navigate(`/detail/${job.id}`)}>
                            {job.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1 font-medium"><FiBriefcase className="text-gray-400"/> {job.company_name}</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                          <span className="flex items-center gap-1"><FiMapPin className="text-gray-400"/> {job.city || 'Indonesia'} {job.province ? `, ${job.province}` : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-5">
                    <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5 capitalize">
                      <FiBriefcase size={14}/> {job.job_type || 'Full-time'}
                    </span>
                    <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-1.5">
                      <FiDollarSign size={14}/> {job.salary_raw || 'Gaji Disembunyikan'}
                    </span>
                  </div>

                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="bg-white border border-gray-200 text-gray-500 text-xs px-2.5 py-1 rounded-md">{skill}</span>
                      ))}
                      {job.skills.length > 5 && <span className="bg-gray-50 text-gray-400 text-xs px-2.5 py-1 rounded-md">+{job.skills.length - 5}</span>}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-50 gap-4">
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-400 flex items-center gap-1"><FiClock/> {job.created_at ? new Date(job.created_at).toLocaleDateString('id-ID') : 'Terbaru'}</span>
                    </div>
                    <button onClick={() => navigate(`/detail/${job.id}`)} className="bg-blue-50 text-blue-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all text-center flex items-center justify-center gap-2">
                      Lihat Detail <FiArrowRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {loading && (
             <div className="text-center py-10">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-sm text-gray-500 font-medium">Memuat lowongan...</p>
             </div>
          )}

          {!loading && jobs.length > 0 && jobs.length < pagination.total && (
            <div className="mt-8 text-center">
              <button 
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="bg-white border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-sm flex items-center justify-center mx-auto gap-2"
              >
                Muat Lebih Banyak Lowongan <FiArrowRight size={18}/>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}