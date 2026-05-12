import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiMapPin, FiFilter, FiBookmark, FiClock, 
  FiBriefcase, FiDollarSign, FiCheckCircle, FiFileText, FiXCircle
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function JobList() {
  const navigate = useNavigate();
  
  // Cek status login dari localStorage
  const isLoggedIn = !!localStorage.getItem('access_token');

  // State untuk data lowongan
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data dari Backend
  // Fungsi untuk mengambil data dari Backend
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/jobs`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const result = await response.json();
        
        if (result.success) {
          setJobs(result.data);
        } else {
          setError("Gagal memuat data lowongan.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Koneksi ke server gagal. Pastikan Server menyala.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-20">
      
      {/* --- NAVBAR --- */}
      <header className="flex justify-between items-center py-4 px-8 md:px-16 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <FiFileText size={18} />
          </div>
          ITCareerMatch
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a onClick={() => navigate('/')} className="hover:text-blue-600 cursor-pointer">Cara Kerja</a>
          <a href="#fitur" className="hover:text-blue-600 transition-colors">Fitur AI</a>
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer text-blue-600">Daftar Lowongan</a>
          {!isLoggedIn && <a onClick={() => navigate('/login')} className="hover:text-blue-600 cursor-pointer">Masuk</a>}
        </nav>
        {isLoggedIn ? (
          <button onClick={() => navigate('/dashboard')} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
            Dashboard Saya
          </button>
        ) : (
          <button onClick={() => navigate('/cek-skor')} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
            Cek Skor CV
          </button>
        )}
      </header>

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
              <input type="text" placeholder="Posisi atau kata kunci..." className="w-full bg-transparent outline-none text-gray-700 text-sm"/>
            </div>
            <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
              Cari Pekerjaan
            </button>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 pt-10 flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR FILTER */}
        <aside className="w-full lg:w-1/4 space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Tipe Pekerjaan</h3>
            <div className="space-y-3">
              {['fulltime', 'parttime', 'contract', 'freelance'].map((type, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* CTA untuk login jika belum login */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><BsStars size={20}/></div>
              <h4 className="font-bold text-gray-900 mb-2">AI Job Match</h4>
              <p className="text-xs text-gray-500 mb-6">Login untuk melihat lowongan yang paling cocok dengan CV kamu.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-white text-blue-600 border border-blue-200 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Login Sekarang
              </button>
            </div>
          )}
        </aside>

        {/* DAFTAR LOWONGAN */}
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
              jobs.map((job) => (
                <div key={job?.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                        {job?.title.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 
                            className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer" 
                            onClick={() => navigate(`/detail/${job?.id}`)}
                          >
                            {job?.title}
                          </h3>
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
                      <span className="text-gray-400 flex items-center gap-1">
                        <FiClock/> {new Date(job?.created_at).toLocaleDateString('id-ID')}
                      </span>
                      {isLoggedIn ? (
                        <span className="font-bold flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-600">
                          <FiCheckCircle/> 85% Cocok
                        </span>
                      ) : (
                        <span className="text-blue-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate('/cek-skor')}>
                          <BsStars/> Cek Kecocokan CV
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => navigate(isLoggedIn ? `/detail/${job?.id}` : '/cek-skor')} 
                      className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      Lihat Detail &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}