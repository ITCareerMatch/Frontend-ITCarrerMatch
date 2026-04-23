import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiBriefcase, FiClock, FiCheckCircle } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function Dashboard() {
  const navigate = useNavigate();

  // Data dummy (Simulasi API backend)
  const jobRecommendations = [
    {
      id: 1,
      title: "Backend Engineer (Go)",
      company: "CloudTech Solutions",
      location: "Remote, Indonesia",
      type: "Full-time",
      posted: "1 hari lalu",
      matchScore: 95,
      matchText: "Sangat Cocok",
      matchedSkills: ["Golang", "REST API", "PostgreSQL", "+2"],
      missingSkills: ["Kubernetes"]
    },
    {
      id: 2,
      title: "Senior Backend Developer",
      company: "TechCorp Indonesia",
      location: "Jakarta, Indonesia",
      type: "Full-time",
      posted: "2 hari lalu",
      matchScore: 92,
      matchText: "Sangat Cocok",
      matchedSkills: ["Golang", "Docker", "Git", "+2"],
      missingSkills: ["gRPC", "CI/CD"]
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "DigitalNusantara",
      location: "Surabaya, Indonesia",
      type: "Contract",
      posted: "1 minggu lalu",
      matchScore: 85,
      matchText: "Cocok",
      matchedSkills: ["REST API", "PostgreSQL", "+2"],
      missingSkills: ["Microservices", "Kubernetes"]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Banner Selamat Datang */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 mb-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="relative z-10 mb-6 md:mb-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold mb-4 backdrop-blur-sm border border-white/20">
            <BsStars className="text-yellow-300" /> Analisis Terakhir: 3 Apr 2026
          </div>
          <h2 className="text-3xl font-bold mb-2">Halo, Budi Santoso! 👋</h2>
          <p className="text-blue-100">AI kami telah menemukan {jobRecommendations.length} lowongan yang sangat cocok dengan profil Anda.</p>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0">
           <p className="text-sm font-medium text-blue-100 mb-1">Skor CV Rata-rata</p>
           <div className="text-4xl font-bold text-white">75<span className="text-xl text-blue-200">/100</span></div>
        </div>
      </div>

      {/* Header Katalog */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiBriefcase className="text-blue-600" /> Rekomendasi Lowongan
          </h3>
          <p className="text-sm text-gray-500">Berdasarkan hasil pemindaian CV terakhir Anda.</p>
        </div>
        
        {/* Filter Sederhana */}
        <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm cursor-pointer">
          <option>Skor Tertinggi</option>
          <option>Terbaru</option>
        </select>
      </div>

      {/* Grid Katalog Lowongan (Menggunakan data dummy di atas) */}
      <div className="grid md:grid-cols-2 gap-6">
        {jobRecommendations.map((job) => (
          <div 
            key={job.id} 
            onClick={() => navigate('/detail')} // Arahkan ke halaman JobDetail (gambar yang Anda unggah)
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex flex-col h-full relative overflow-hidden"
          >
            {/* Efek hover border atas */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center shrink-0">
                   {/* Placeholder Logo Perusahaan */}
                   <FiBriefcase className="text-gray-400" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h4>
                  <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
                </div>
              </div>
              <div className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap">
                {job.matchScore}% Cocok
              </div>
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-gray-500 mb-6">
              <span className="flex items-center gap-1"><FiMapPin /> {job.location}</span>
              <span className="flex items-center gap-1"><FiBriefcase /> {job.type}</span>
              <span className="flex items-center gap-1"><FiClock /> {job.posted}</span>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-50 flex flex-col gap-2 text-xs">
               <div className="flex items-center gap-2">
                 <FiCheckCircle className="text-green-500 shrink-0" />
                 <span className="text-gray-600 line-clamp-1">Skill: <span className="font-semibold text-gray-800">{job.matchedSkills.join(', ')}</span></span>
               </div>
               {job.missingSkills.length > 0 && (
                 <div className="flex items-center gap-2">
                   <div className="w-3.5 h-3.5 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center shrink-0 font-bold text-[10px]">!</div>
                   <span className="text-gray-600 line-clamp-1">Kurang: <span className="font-semibold text-gray-800">{job.missingSkills.join(', ')}</span></span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}