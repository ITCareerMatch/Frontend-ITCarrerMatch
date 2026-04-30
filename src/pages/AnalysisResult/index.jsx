import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheckCircle, FiXCircle, FiBriefcase, FiChevronRight, 
  FiChevronDown, FiRefreshCw, FiMapPin, FiClock, FiTrendingUp, FiArrowRight
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';

export default function AnalysisResult() {
  const navigate = useNavigate();
  const [openInsight, setOpenInsight] = useState('profesional');

  // Data Dummy Rekomendasi Lowongan
  const jobRecommendations = [
    {
      id: 1, title: "Backend Engineer (Go)", company: "CloudTech Solutions", location: "Remote, Indonesia", type: "Full-time", posted: "1 hari lalu", matchScore: 95, matchedSkills: ["Golang", "REST API", "PostgreSQL"], missingSkills: ["Kubernetes"]
    },
    {
      id: 2, title: "Senior Backend Developer", company: "TechCorp Indonesia", location: "Jakarta, Indonesia", type: "Full-time", posted: "2 hari lalu", matchScore: 92, matchedSkills: ["Golang", "Docker", "Git"], missingSkills: ["gRPC"]
    },
    {
      id: 3, title: "Software Engineer", company: "DigitalNusantara", location: "Surabaya, Indonesia", type: "Contract", posted: "1 minggu lalu", matchScore: 85, matchedSkills: ["REST API", "PostgreSQL"], missingSkills: ["Microservices", "Kubernetes"]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto pb-12 font-sans text-gray-800">
      
      {/* --- BANNER HASIL ANALISIS --- */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 mb-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-blue-200 text-xs font-bold mb-2 uppercase tracking-wider">
            <BsStars /> Hasil Analisis Penuh
          </div>
          <h1 className="text-3xl font-bold mb-2">Skor CV Anda Cukup Baik! 👋</h1>
          <p className="text-sm text-blue-100 max-w-lg">
            AI kami telah memindai struktur, kata kunci, dan pengalaman di CV Anda. Lihat saran perbaikan di bawah untuk mencapai skor maksimal sebelum melamar pekerjaan.
          </p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 bg-white/10 backdrop-blur-md border border-white/20 px-8 py-5 rounded-2xl text-center shadow-inner">
          <p className="text-xs text-blue-200 font-bold uppercase tracking-widest mb-1">Skor CV</p>
          <div className="text-5xl font-black leading-none">75<span className="text-xl text-blue-200">/100</span></div>
        </div>
      </div>

      {/* --- KARTU STATISTIK RINGKAS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><FiCheckCircle size={24}/></div>
          <div><div className="text-2xl font-black text-gray-900 leading-none mb-1">5</div><div className="text-xs text-gray-500 font-bold uppercase">Kekuatan</div></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><FiXCircle size={24}/></div>
          <div><div className="text-2xl font-black text-gray-900 leading-none mb-1">4</div><div className="text-xs text-gray-500 font-bold uppercase">Kelemahan</div></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-500 flex items-center justify-center"><BsLightbulbFill size={24}/></div>
          <div><div className="text-2xl font-black text-gray-900 leading-none mb-1">3</div><div className="text-xs text-gray-500 font-bold uppercase">Saran AI</div></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center"><FiBriefcase size={24}/></div>
          <div><div className="text-2xl font-black text-gray-900 leading-none mb-1">12+</div><div className="text-xs text-gray-500 font-bold uppercase">Lowongan Cocok</div></div>
        </div>
      </div>

      {/* --- KONTEN ANALISIS (KIRI) & WIDGET (KANAN) --- */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        
        {/* KOLOM KIRI (Analisis Detail) */}
        <div className="lg:w-2/3 space-y-6">
          
          {/* Skill General Match */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FiCheckCircle className="text-green-500"/> Kekuatan Profil (Terdeteksi)</h3>
              <FiTrendingUp className="text-green-500" />
            </div>
            <p className="text-sm text-gray-500 mb-6">Keahlian utama yang berhasil diekstrak AI dari CV Anda dan memiliki nilai jual tinggi di pasar kerja saat ini.</p>
            <div className="flex flex-wrap gap-3">
              {['Golang', 'REST API', 'PostgreSQL', 'Docker', 'Git'].map((skill, i) => (
                <div key={i} className="flex items-center gap-2 border border-green-200 bg-green-50 px-4 py-2 rounded-xl text-sm">
                  <FiCheckCircle className="text-green-500"/> <span className="font-bold text-gray-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Gap (Berdasarkan Tren Pasar) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><FiXCircle className="text-red-500"/> Area Peningkatan (Skill Gap)</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Keahlian yang sering dicari oleh perusahaan untuk level Anda, namun belum tercantum jelas di CV.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="border border-red-100 bg-red-50/50 p-4 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-1">Kubernetes / Orkestrasi</h4>
                <p className="text-xs text-gray-600">Disarankan untuk mengambil sertifikasi dasar atau mencantumkan pengalaman deploy project.</p>
              </div>
              <div className="border border-orange-100 bg-orange-50/50 p-4 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-1">CI/CD Pipeline</h4>
                <p className="text-xs text-gray-600">Perusahaan saat ini sangat menyukai kandidat yang paham alur GitHub Actions/GitLab CI.</p>
              </div>
            </div>
          </div>

          {/* AI Insight Khusus Kalimat */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2"><BsLightbulbFill className="text-yellow-500"/> AI Insight (Penulisan CV)</h3>
            </div>
            <p className="text-sm text-gray-500 mb-6">Saran perbaikan kalimat agar CV terkesan lebih profesional dan terukur.</p>
            
            <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-4">
              <button onClick={() => setOpenInsight('profesional')} className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors">
                <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">Pengalaman Kerja</span>
                {openInsight === 'profesional' ? <FiChevronDown className="text-gray-500"/> : <FiChevronRight className="text-gray-500"/>}
              </button>
              {openInsight === 'profesional' && (
                <div className="p-6 bg-white space-y-5 border-t border-gray-100">
                  <div className="flex gap-4">
                    <FiXCircle className="text-red-500 shrink-0 mt-1" size={20}/>
                    <div className="bg-red-50 text-red-900 p-3 rounded-xl text-sm italic w-full border border-red-100">"Bertanggung jawab atas pengembangan backend"</div>
                  </div>
                  <div className="flex gap-4">
                    <FiCheckCircle className="text-green-500 shrink-0 mt-1" size={20}/>
                    <div className="bg-green-50 text-green-900 p-3 rounded-xl text-sm font-medium w-full border border-green-100">"Merancang dan mengimplementasikan arsitektur backend yang melayani 50k+ request/detik"</div>
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => navigate('/editor')} className="w-full bg-yellow-400 text-yellow-900 font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm">
              <BsLightbulbFill /> Perbaiki Kalimat di CV Editor
            </button>
          </div>

        </div>

        {/* KOLOM KANAN (Widget) */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold mb-5">Breakdown Skor CV</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-gray-600"><span>Pengalaman & Relevansi</span><span className="text-green-500">82%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-green-500 w-[82%] h-full rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-gray-600"><span>Kualitas Kalimat/Metrik</span><span className="text-yellow-500">60%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-yellow-500 w-[60%] h-full rounded-full"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold mb-1 text-gray-600"><span>Format (ATS-Friendly)</span><span className="text-purple-500">85%</span></div>
                <div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-purple-500 w-[85%] h-full rounded-full"></div></div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold mb-2 uppercase tracking-wider"><FiTrendingUp/> Potensi Peningkatan</div>
            <div className="text-5xl font-black mb-1">+18</div>
            <p className="text-xs text-indigo-100 mb-6 leading-relaxed">poin jika semua saran kalimat AI diterapkan di Editor.</p>
            <button onClick={() => navigate('/editor')} className="w-full bg-white text-indigo-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              Buka CV Editor
            </button>
          </div>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: REKOMENDASI LOWONGAN --- */}
      <div className="pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiBriefcase className="text-blue-600" /> Rekomendasi Lowongan
            </h2>
            <p className="text-sm text-gray-500 mt-1">Lowongan yang paling cocok dengan profil dan skor CV Anda saat ini.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobRecommendations.map((job) => (
            <div 
              key={job.id} 
              // Ketika di klik, akan masuk ke halaman Detail Job yang sesungguhnya!
              onClick={() => navigate('/detail')} 
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
            >
              {/* Efek hover border atas */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                     <FiBriefcase className="text-gray-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h4>
                    <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500 mb-6">
                <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
                <span className="flex items-center gap-1"><FiBriefcase /> {job.type}</span>
                <span className="flex items-center gap-1"><FiClock /> {job.posted}</span>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2 text-xs">
                 <div className="flex items-center justify-between mb-2">
                   <span className="font-bold text-gray-700">Kecocokan Profile:</span>
                   <span className="font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">{job.matchScore}%</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <FiCheckCircle className="text-green-500 shrink-0" />
                   <span className="text-gray-600 line-clamp-1">Match: <span className="font-semibold text-gray-800">{job.matchedSkills.join(', ')}</span></span>
                 </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
            <button className="text-blue-600 flex items-center gap-1 hover:text-blue-800 font-medium cursor-pointer">
                Learn More <FiArrowRight className="shrink-0" /> 
            </button>
        </div>
      </div>

    </div>
  );
}