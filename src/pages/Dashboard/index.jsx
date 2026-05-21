import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';
import { fetchUserProfile, fetchJobRecommendations } from '../../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  // State untuk Rekomendasi
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [jobsError, setJobsError] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);
  
  // Paginasi Klien (Frontend-side pagination)
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(jobRecommendations.length / itemsPerPage));

  // 1. Load Profil User
  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      try {
        const data = await fetchUserProfile(token);
        setProfile(data);
      } catch (err) {
        setProfileError(err.message || 'Gagal memuat profil pengguna.');
      } finally {
        setProfileLoading(false);
      }
    };

    if (token) loadProfile();
    else setProfileError('Token tidak tersedia. Silakan login kembali.');
  }, [token]);

  // 2. Load Rekomendasi (Hanya dieksekusi 1x saat komponen dimuat)
  useEffect(() => {
    const loadJobs = async () => {
      setJobsLoading(true);
      setJobsError(null);

      try {
        // PERBAIKAN: Sesuai Swagger, API ini TIDAK membutuhkan parameter page & limit
        const data = await fetchJobRecommendations(token);
        
        // Asumsi API mengembalikan array data langsung atau object { data: [...] }
        // Sesuaikan dengan struktur respons backend Anda
        setJobRecommendations(Array.isArray(data) ? data : (data?.data || []));
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        // Jika error 400 muncul, kemungkinan AI belum selesai memproses CV
        setJobsError('AI kami sedang memproses CV Anda. Mohon tunggu sejenak atau muat ulang halaman.');
      } finally {
        setJobsLoading(false);
      }
    };

    if (token) loadJobs();
  }, [token]);

  const getProfileDisplayName = () => {
    if (!profile) return 'Pengguna';
    return profile.name || profile.full_name || profile.email || 'Pengguna';
  };

  const renderProfileSection = () => {
    if (profileLoading) return <p className="text-sm text-blue-100">Memuat profil...</p>;
    if (profileError) return <p className="text-sm text-red-100">{profileError}</p>;

    return (
      <>
        <h2 className="text-3xl font-bold mb-2">Halo, {getProfileDisplayName()}! 👋</h2>
        <p className="text-blue-100">
          {jobRecommendations.length > 0 
            ? `AI kami telah menemukan ${jobRecommendations.length} lowongan yang cocok untuk Anda.` 
            : 'Menganalisis peluang karir Anda...'}
        </p>
      </>
    );
  };

  // Logika Paginasi Sisi Klien (Memotong array 20 data menjadi 10 per halaman)
  const startIndex = (page - 1) * itemsPerPage;
  const currentJobs = jobRecommendations.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 mb-6 md:mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-white/20">
            <BsStars className="text-yellow-300" /> {profileLoading ? 'Memuat profil...' : `Member sejak: ${profile?.created_at ? new Date(profile.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '-'}`}
          </div>
          {renderProfileSection()}
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0">
           <p className="text-sm font-medium text-blue-100 mb-1">Status Profil</p>
           <div className="text-xl font-bold text-white flex items-center justify-center gap-2">
             <FiCheckCircle className="text-green-300" /> Aktif
           </div>
        </div>
      </div>

      {/* Bagian Rekomendasi Lowongan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" /> Rekomendasi Lowongan
          </h3>
          <p className="text-sm text-gray-500">Disesuaikan dengan keahlian pada CV Anda.</p>
        </div>
      </div>

      {jobsLoading ? (
        <div className="rounded-2xl p-10 bg-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-gray-500">
           <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
           <p className="font-semibold">Mencari lowongan terbaik...</p>
        </div>
      ) : jobsError ? (
        <div className="rounded-2xl p-8 bg-blue-50 border border-blue-100 shadow-sm flex items-start gap-4 text-blue-800">
           <div className="p-3 bg-blue-100 rounded-full text-blue-600 shrink-0"><BsStars size={24} /></div>
           <div>
             <h4 className="font-bold text-lg mb-1">Sedang Memproses Analisis CV</h4>
             <p className="text-sm leading-relaxed">{jobsError}</p>
             <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors">
               Muat Ulang Sekarang
             </button>
           </div>
        </div>
      ) : jobRecommendations.length === 0 ? (
        <div className="rounded-2xl p-8 bg-white border border-gray-100 shadow-sm text-center text-gray-500">
          Belum ada lowongan yang sesuai saat ini.
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            {currentJobs.map((job) => (
              <div 
                key={job.job_id}
                onClick={() => navigate(`/detail/${job.job_id}`)}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0 font-bold text-lg text-blue-600">
                       {job.job_title?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.job_title}</h4>
                      <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap border border-green-100">
                    {Math.round(job.match_score || 0)}% Match
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-4 bg-gray-50 p-3 rounded-xl border border-gray-100 line-clamp-2">
                  <span className="font-bold text-gray-700">Insight AI: </span>{job.ai_insight || 'Cocok dengan profil Anda.'}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2 text-xs">
                   <div className="flex items-center gap-2">
                     <FiCheckCircle className="text-green-500 shrink-0" />
                     <span className="text-gray-600 line-clamp-1">Skill match: <span className="font-semibold text-gray-800">{(job.skill_match || []).join(', ')}</span></span>
                   </div>
                   {job.skill_gap?.length > 0 && (
                     <div className="flex items-center gap-2">
                       <div className="w-3.5 h-3.5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 font-bold text-[10px]">!</div>
                       <span className="text-gray-600 line-clamp-1">Skill gap: <span className="font-semibold text-gray-800">{job.skill_gap.join(', ')}</span></span>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>

          {/* Kontrol Paginasi Sisi Klien */}
          {jobRecommendations.length > itemsPerPage && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
              <p className="text-sm text-gray-500 font-medium">Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, jobRecommendations.length)} dari {jobRecommendations.length} Rekomendasi</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  Sebelumnya
                </button>
                <div className="px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-lg">
                  {page}
                </div>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}