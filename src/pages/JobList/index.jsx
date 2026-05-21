import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiSearch, FiMapPin, FiFilter, FiBookmark, FiClock, FiMenu, FiX,
  FiBriefcase, FiDollarSign, FiCheckCircle, FiFileText, FiXCircle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchAllJobs } from '../../services/api';

export default function JobList() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('access_token');

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchJobsList = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAllJobs({
          search: searchQuery,
          city,
          province,
          minSalary,
          maxSalary,
          page: currentPage,
          limit
        });

        setJobs(Array.isArray(result.jobs) ? result.jobs : []);
        if (result.pagination && result.pagination.total) {
          setTotalPages(Math.ceil(result.pagination.total / limit) || 1);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'Koneksi ke server gagal.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobsList();
  }, [searchQuery, city, province, minSalary, maxSalary, currentPage, limit]);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-20">
      {/* --- NAVBAR --- */}
      <header className="flex justify-between items-center py-4 px-8 md:px-16 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <FiFileText size={18} />
          </div>
          ITCareerMatch
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors cursor-pointer">Cara Kerja</a>
          <a onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors cursor-pointer">Fitur AI</a>
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer text-blue-600">Daftar Lowongan</a>
          {!isLoggedIn && (
            <button onClick={() => navigate('/login')} className="hover:text-blue-600 transition-colors cursor-pointer">Masuk</button>
          )}
        </nav>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn && (
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-100 transition-colors mr-2 cursor-pointer"
            >
              Dashboard
            </button>
          )}
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Cek Skor CV
          </button>
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      <div className={`${mobileMenuOpen ? 'fixed' : 'hidden'} md:hidden inset-x-0 top-16 z-40 bg-white border-b border-gray-100 px-8 py-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto`}> 
        <div className="flex flex-col gap-4 text-sm font-medium text-gray-700 items-center bg-white py-4">
          <a onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="block hover:text-blue-600 transition-colors">Cara Kerja</a>
          <a onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="block hover:text-blue-600 transition-colors">Fitur AI</a>
          <button onClick={() => { setMobileMenuOpen(false); navigate('/lowongan'); }} className="text-left hover:text-blue-600 transition-colors font-bold text-blue-600">Daftar Lowongan</button>
          <div className="flex flex-col gap-3 pt-2 w-full">
            {isLoggedIn ? (
              <button onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }} className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-100 transition-colors">Dashboard</button>
            ) : (
              <button onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} className="w-full text-center text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors border border-gray-100 bg-gray-50">Masuk</button>
            )}
            <button onClick={() => { setMobileMenuOpen(false); navigate('/cek-skor'); }} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Cek Skor CV</button>
          </div>
        </div>
      </div>

      {/* --- HERO & SEARCH SECTION --- */}
      <section className="bg-white pt-16 pb-12 px-8 md:px-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Temukan Karir Impianmu <br className="hidden md:block"/>
            <span className="text-blue-600">Lebih Cepat & Tepat</span>
          </h1>
          <p className="text-gray-500 mb-10 max-w-2xl text-lg">
            Jelajahi lowongan terbaru. Gunakan AI kami untuk melihat seberapa cocok profilmu dengan posisi yang ada.
          </p>
          <div className="bg-white border border-gray-200 p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-2 max-w-4xl">
            <div className="flex-1 flex items-center px-4 py-2 bg-gray-50/50 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <FiSearch className="text-gray-400 mr-3" size={20}/>
              <input
                type="text"
                placeholder="Posisi atau kata kunci..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent outline-none text-gray-700 text-sm"
              />
            </div>
            <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">Cari Pekerjaan</button>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 pt-10 flex flex-col lg:flex-row gap-10">
        <aside className="w-full lg:w-1/4 space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Lokasi</h3>
            <div className="space-y-3">
              <input type="text" placeholder="Kota" value={city} onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="text" placeholder="Provinsi" value={province} onChange={(e) => { setProvince(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Rentang Gaji</h3>
            <div className="space-y-3">
              <input type="number" placeholder="Gaji Min" value={minSalary} onChange={(e) => { setMinSalary(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              <input type="number" placeholder="Gaji Max" value={maxSalary} onChange={(e) => { setMaxSalary(e.target.value); setCurrentPage(1); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><BsStars size={20}/></div>
              <h4 className="font-bold text-gray-900 mb-2">AI Job Match</h4>
              <p className="text-xs text-gray-500 mb-6">Login untuk melihat lowongan yang paling cocok dengan CV kamu.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-white text-blue-600 border border-blue-200 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">Login Sekarang</button>
            </div>
          )}
        </aside>

        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">{jobs.length} Lowongan Ditemukan</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="flex flex-col items-center py-20">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Memuat lowongan...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <FiXCircle className="mx-auto text-red-500 mb-4" size={40} />
                <p className="text-gray-600 font-medium">{error}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <p className="text-gray-500">Belum ada lowongan yang tersedia saat ini.</p>
              </div>
            ) : (
              <>
                {jobs.map((job) => (
                  <div key={job?.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                          {job?.title?.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer" onClick={() => navigate(`/detail/${job?.id}`)}>{job?.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <FiBriefcase className="text-gray-400"/> <span>{job?.company_name}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <FiMapPin className="text-gray-400"/> <span>{job?.city}, {job?.province}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-blue-600 transition-colors"><FiBookmark size={20}/></button>
                    </div>
                    <div className="flex flex-wrap gap-3 mb-5">
                      <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5 capitalize"><FiBriefcase/> {job?.job_type}</span>
                      <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5"><FiDollarSign/> {job?.salary_raw}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job?.skills && job?.skills.map((skill, i) => (
                        <span key={i} className="bg-white border border-gray-200 text-gray-500 text-xs px-2.5 py-1 rounded-md">{skill}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-gray-400 flex items-center gap-1"><FiClock/> {job?.created_at ? new Date(job.created_at).toLocaleDateString('id-ID') : '-'}</span>
                        {isLoggedIn ? (
                          <span className="font-bold flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600"><FiCheckCircle/> AI Verified</span>
                        ) : (
                          <span className="text-blue-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate('/login')}><BsStars/> Cek Kecocokan CV</span>
                        )}
                      </div>
                      <button onClick={() => navigate(`/detail/${job?.id}`)} className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer">Lihat Detail &rarr;</button>
                    </div>
                  </div>
                ))}
                {/* Pagination Kontrol */}
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sebelumnya</button>
                  <span className="px-4 py-2 text-gray-700">Halaman {currentPage} dari {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Selanjutnya</button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}