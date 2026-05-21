import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiMapPin, FiBriefcase, FiClock, FiCheckCircle, 
  FiActivity, FiTarget, FiPlusCircle, FiArrowRight, FiFileText
} from 'react-icons/fi';
import { BsStars, BsLightningChargeFill } from 'react-icons/bs';
import { fetchUserProfile, fetchJobRecommendations, fetchAnalysisHistory } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // State untuk Rekomendasi
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [jobsError, setJobsError] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);

  // State untuk Riwayat Analisis
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  
  // Paginasi Klien (Frontend-side pagination)
  const [page, setPage] = useState(1);
  const itemsPerPage = 6; // Disesuaikan agar layout grid lebih seimbang
  const totalPages = Math.max(1, Math.ceil(jobRecommendations.length / itemsPerPage));

  // 1. Load Data Paralel (Profil, Rekomendasi, Riwayat)
  useEffect(() => {
    if (!token) return;

    const loadData = async () => {
      // Fetch Profile
      try {
        const profileData = await fetchUserProfile(token);
        setProfile(profileData);
      } catch (err) {
        console.error('Gagal memuat profil:', err);
      } finally {
        setProfileLoading(false);
      }

      // Fetch Jobs
      try {
        const jobsData = await fetchJobRecommendations(token);
        setJobRecommendations(Array.isArray(jobsData) ? jobsData : (jobsData?.data || []));
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setJobsError('AI kami sedang memproses kualifikasi Anda. Mohon tunggu sejenak atau muat ulang halaman.');
      } finally {
        setJobsLoading(false);
      }

      // Fetch History
      try {
        const historyData = await fetchAnalysisHistory(token, 1, 5); // Ambil 5 terbaru
        setHistory(Array.isArray(historyData) ? historyData : (historyData?.data || []));
      } catch (err) {
        console.error('Gagal memuat riwayat:', err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadData();
  }, [token]);

  // Fungsi dinamis untuk nama sapaan
  const getProfileDisplayName = () => {
    if (!profile) return 'Pengguna';
    if (profile.name) return profile.name;
    if (profile.email) return profile.email.split('@')[0]; // Fallback ke nama email
    return 'Pengguna';
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentJobs = jobRecommendations.slice(startIndex, startIndex + itemsPerPage);
  const latestScore = history.length > 0 ? Math.round(history[0].match_score || history[0].score || 0) : 0;

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* 1. HEADER / BANNER SELAMAT DATANG */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 rounded-3xl p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 w-full md:w-2/3 mb-6 md:mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-xs font-semibold mb-5 backdrop-blur-md border border-white/20">
            <BsStars className="text-yellow-300" /> 
            {profileLoading ? 'Meyelaraskan profil...' : 'Workspace Karir Anda'}
          </div>
          
          <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">
            Halo, {getProfileDisplayName()}! 👋
          </h2>
          <p className="text-blue-100 text-sm md:text-base max-w-lg leading-relaxed">
            {jobRecommendations.length > 0 
              ? `AI kami telah menemukan ${jobRecommendations.length} peluang karir yang sesuai dengan kompetensi Anda saat ini.` 
              : 'Tingkatkan skor CV Anda dan temukan peluang kerja terbaik yang menanti Anda.'}
          </p>
        </div>

        <div className="relative z-10 flex gap-4 w-full md:w-auto">
           <button 
             onClick={() => navigate('/analisis-baru')} 
             className="w-full md:w-auto bg-white text-blue-700 font-bold px-6 py-3.5 rounded-xl shadow-lg hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
           >
             <FiPlusCircle size={20} /> Analisis CV Baru
           </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ========================================== */}
        {/* KOLOM KIRI (70%): STATISTIK & LOWONGAN      */}
        {/* ========================================== */}
        <div className="lg:w-2/3 flex flex-col gap-8">
          
          {/* STATISTIK CEPAT (Quick Stats) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3"><FiBriefcase size={20} /></div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Rekomendasi Kerja</p>
              <h3 className="text-2xl font-black text-gray-900">{jobsLoading ? '-' : jobRecommendations.length} <span className="text-sm font-medium text-gray-400">Pekerjaan</span></h3>
            </div>
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3"><FiActivity size={20} /></div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Skor CV Terakhir</p>
              <h3 className="text-2xl font-black text-gray-900">{historyLoading ? '-' : latestScore} <span className="text-sm font-medium text-gray-400">/ 100</span></h3>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center col-span-2 sm:col-span-1">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3"><FiTarget size={20} /></div>
              <p className="text-xs text-gray-500 font-semibold mb-1">Total Analisis</p>
              <h3 className="text-2xl font-black text-gray-900">{historyLoading ? '-' : history.length} <span className="text-sm font-medium text-gray-400">Dokumen</span></h3>
            </div>
          </div>

          {/* DAFTAR REKOMENDASI LOWONGAN */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BsLightningChargeFill className="text-yellow-500" /> Top Matches Untuk Anda
              </h3>
              {jobRecommendations.length > itemsPerPage && (
                <button onClick={() => navigate('/daftar-lowongan')} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                  Lihat Semua <FiArrowRight />
                </button>
              )}
            </div>

            {jobsLoading ? (
              <div className="rounded-3xl p-12 bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-500">
                 <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                 <p className="font-semibold text-sm">Menyinkronkan peluang kerja dengan AI...</p>
              </div>
            ) : jobsError ? (
              <div className="rounded-3xl p-8 bg-orange-50 border border-orange-100 shadow-sm flex items-start gap-4 text-orange-800">
                 <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shrink-0"><FiActivity size={24} /></div>
                 <div>
                   <h4 className="font-bold text-lg mb-1">Sedang Memproses Analisis CV</h4>
                   <p className="text-sm leading-relaxed opacity-90">{jobsError}</p>
                   <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2.5 bg-orange-600 text-white text-sm font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-md">
                     Muat Ulang Sekarang
                   </button>
                 </div>
              </div>
            ) : jobRecommendations.length === 0 ? (
              <div className="rounded-3xl p-12 bg-white border border-gray-100 shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4"><FiBriefcase size={28}/></div>
                <h4 className="font-bold text-gray-900 mb-2">Belum Ada Rekomendasi</h4>
                <p className="text-sm text-gray-500 max-w-sm">Coba lakukan analisis CV baru agar AI kami dapat menemukan pekerjaan yang tepat untuk Anda.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-5">
                  {currentJobs.map((job) => (
                    <div 
                      key={job.job_id}
                      onClick={() => navigate(`/detail/${job.job_id}`)}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:border-blue-200 transition-all cursor-pointer flex flex-col h-full group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-3 items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 flex items-center justify-center shrink-0 font-black text-xl text-blue-600 shadow-inner">
                             {job.job_title?.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.job_title}</h4>
                            <p className="text-xs font-semibold text-gray-500 line-clamp-1">{job.company}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                         <span className="bg-green-50 text-green-700 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide border border-green-100">
                          {Math.round(job.match_score || 0)}% Match
                         </span>
                         <span className="bg-gray-50 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide border border-gray-100 flex items-center gap-1">
                          <FiMapPin /> {job.city || 'Indonesia'}
                         </span>
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-50 text-xs text-gray-500 leading-relaxed line-clamp-2">
                        <strong className="text-gray-700">Cocok karena: </strong>{job.ai_insight || 'Keahlian sesuai kriteria.'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Kontrol Paginasi Sisi Klien */}
                {jobRecommendations.length > itemsPerPage && (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                    <p className="text-xs text-gray-500 font-bold px-2">Halaman {page} dari {totalPages}</p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        Mundur
                      </button>
                      <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                      >
                        Maju
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* KOLOM KANAN (30%): RIWAYAT & INFO WIDGET   */}
        {/* ========================================== */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          
          {/* RIWAYAT ANALISIS */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FiClock className="text-indigo-500" /> Riwayat Analisis
              </h3>
            </div>

            <div className="space-y-4">
              {historyLoading ? (
                <div className="animate-pulse flex flex-col gap-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-2xl"></div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-3"><FiFileText size={20} /></div>
                  <p className="text-sm text-gray-500">Belum ada riwayat analisis.</p>
                </div>
              ) : (
                history.slice(0, 3).map((scan, idx) => {
                  const score = Math.round(scan.match_score || scan.score || 0);
                  const isGood = score >= 75;
                  
                  return (
                    <div
                      key={scan.id || idx}
                      onClick={() => navigate(`/analisis-result`, { state: { analysisId: scan.id } })}
                      className="group flex flex-col p-4 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer relative overflow-hidden"
                    >
                      {/* Bar Skor Background */}
                      <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full">
                        <div className={`h-full ${isGood ? 'bg-green-400' : 'bg-orange-400'}`} style={{ width: `${score}%` }}></div>
                      </div>

                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors line-clamp-1 pr-2">
                          {scan.job_title || scan.job_title_snapshot || 'Analisis CV Umum'}
                        </p>
                        <span className={`text-xs font-black ${isGood ? 'text-green-600' : 'text-orange-500'}`}>
                          {score}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {scan.created_at ? new Date(scan.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru saja'}
                      </p>
                    </div>
                  )
                })
              )}
            </div>

            {history.length > 3 && (
              <button className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors">
                Lihat Semua Riwayat
              </button>
            )}
          </div>

          {/* WIDGET TIPS AI */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-3xl border border-indigo-100/50 shadow-sm">
            <h3 className="font-bold text-indigo-900 mb-3 flex items-center gap-2">
              <BsStars className="text-purple-500" /> Tips Lolos ATS
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-indigo-800/80 leading-relaxed">
                <FiCheckCircle className="text-purple-500 shrink-0 mt-0.5" />
                Gunakan *keyword* yang sama persis dengan yang diminta di lowongan kerja.
              </li>
              <li className="flex items-start gap-2.5 text-sm text-indigo-800/80 leading-relaxed">
                <FiCheckCircle className="text-purple-500 shrink-0 mt-0.5" />
                Hindari desain tabel kompleks pada PDF agar teks mudah diekstrak oleh sistem.
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}