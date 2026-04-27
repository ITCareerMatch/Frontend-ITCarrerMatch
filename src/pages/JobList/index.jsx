import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiMapPin, FiFilter, FiBookmark, FiClock, 
  FiBriefcase, FiDollarSign, FiCheckCircle, FiFileText
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function JobList() {
  const navigate = useNavigate();
  
  // Simulasi state login (ubah ke false untuk melihat tampilan sebelum login)
  const [isLoggedIn] = useState(false);

  // Data Dummy Lowongan Pekerjaan
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Engineer",
      company: "TechNusa",
      location: "Jakarta Selatan",
      type: "Remote (Full-time)",
      salary: "Rp 15.000.000 - Rp 25.000.000",
      skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
      posted: "2 hari yang lalu",
      isHot: true,
      match: 92
    },
    {
      id: 2,
      title: "Product Designer (UI/UX)",
      company: "KreatifDigital",
      location: "Bandung, Jawa Barat",
      type: "Hybrid",
      salary: "Rp 12.000.000 - Rp 18.000.000",
      skills: ["Figma", "Prototyping", "User Research", "Wireframing"],
      posted: "5 jam yang lalu",
      isHot: false,
      match: 88
    },
    {
      id: 3,
      title: "Backend Developer (Go)",
      company: "Fintech Maju",
      location: "Jakarta Pusat",
      type: "On-site",
      salary: "Rp 18.000.000 - Rp 28.000.000",
      skills: ["Golang", "PostgreSQL", "Microservices", "Docker"],
      posted: "1 minggu yang lalu",
      isHot: false,
      match: 75
    },
    {
      id: 4,
      title: "Data Analyst",
      company: "Dataina",
      location: "Surabaya, Jawa Timur",
      type: "Remote",
      salary: "Rp 10.000.000 - Rp 15.000.000",
      skills: ["Python", "SQL", "Tableau", "Data Visualization"],
      posted: "3 hari yang lalu",
      isHot: true,
      match: 85
    }
  ];

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
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer">Daftar Lowongan</a>
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
            Jelajahi ribuan lowongan pekerjaan terbaru dari perusahaan terkemuka. Gunakan AI kami untuk melihat seberapa cocok profilmu dengan posisi yang ada.
          </p>

          {/* Search Bar Utama */}
          <div className="bg-white border border-gray-200 p-2 rounded-2xl shadow-sm flex flex-col md:flex-row gap-2 max-w-4xl">
            <div className="flex-1 flex items-center px-4 py-2 bg-gray-50/50 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <FiSearch className="text-gray-400 mr-3" size={20}/>
              <input type="text" placeholder="Posisi, kata kunci, atau perusahaan..." className="w-full bg-transparent outline-none text-gray-700 text-sm"/>
            </div>
            <div className="hidden md:block w-px bg-gray-200 my-2"></div>
            <div className="flex-1 flex items-center px-4 py-2 bg-gray-50/50 rounded-xl border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-colors">
              <FiMapPin className="text-gray-400 mr-3" size={20}/>
              <input type="text" placeholder="Lokasi atau 'Remote'..." className="w-full bg-transparent outline-none text-gray-700 text-sm"/>
            </div>
            <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors cursor-pointer">
              Cari Pekerjaan
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mr-2 shrink-0"><FiFilter/> Filter:</div>
            <button className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-semibold shrink-0">Semua</button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0">Remote</button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0">Hybrid</button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0">On-site</button>
            <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0 flex items-center gap-1"><BsStars className="text-yellow-500"/> Paling Cocok</button>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT (Sidebar & Job List) --- */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 pt-10 flex flex-col lg:flex-row gap-10">
        
        {/* SIDEBAR FILTER (Kiri) */}
        <aside className="w-full lg:w-1/4 space-y-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Tipe Pekerjaan</h3>
            <div className="space-y-3">
              {['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Magang'].map((type, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Pengalaman</h3>
            <div className="space-y-3">
              {['Entry Level', 'Junior (1-3 Tahun)', 'Mid Level (3-5 Tahun)', 'Senior (5+ Tahun)', 'Manager'].map((exp, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{exp}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Promo AI Match (Hanya muncul jika belum login) */}
          {!isLoggedIn && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm"><BsStars size={20}/></div>
              <h4 className="font-bold text-gray-900 mb-2">AI Job Match</h4>
              <p className="text-xs text-gray-500 mb-6">Login untuk melihat lowongan yang paling cocok dengan CV kamu secara otomatis.</p>
              <button onClick={() => navigate('/login')} className="w-full bg-white text-blue-600 border border-blue-200 font-bold py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Login Sekarang
              </button>
            </div>
          )}
        </aside>

        {/* DAFTAR LOWONGAN (Kanan) */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">245 Lowongan Ditemukan</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Urutkan:</span>
              <select className="font-semibold text-gray-900 bg-transparent outline-none cursor-pointer">
                <option>Relevansi</option>
                <option>Terbaru</option>
                <option>Gaji Tertinggi</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow-sm shrink-0 ${job.id % 2 === 0 ? 'bg-purple-500' : job.id % 3 === 0 ? 'bg-green-500' : 'bg-blue-600'}`}>
                      {job.title.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer" onClick={() => navigate('/detail')}>{job.title}</h3>
                        {job.isHot && <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-red-100">HOT</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiBriefcase className="text-gray-400"/> <span>{job.company}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <FiMapPin className="text-gray-400"/> <span>{job.location}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 transition-colors"><FiBookmark size={20}/></button>
                </div>

                <div className="flex flex-wrap gap-3 mb-5">
                  <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5"><FiBriefcase/> {job.type}</span>
                  <span className="bg-gray-50 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-100 flex items-center gap-1.5"><FiDollarSign/> {job.salary}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="bg-white border border-gray-200 text-gray-500 text-xs px-2.5 py-1 rounded-md">{skill}</span>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400 flex items-center gap-1"><FiClock/> {job.posted}</span>
                    
                    {/* Tampilan Match AI */}
                    {isLoggedIn ? (
                      <span className={`font-bold flex items-center gap-1 px-2 py-1 rounded-md ${job.match > 80 ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'}`}>
                        <FiCheckCircle/> {job.match}% Cocok dengan Profil
                      </span>
                    ) : (
                      <span className="text-blue-600 font-semibold flex items-center gap-1 cursor-pointer hover:underline" onClick={() => navigate('/cek-skor')}>
                        <BsStars/> Cek Kecocokan CV
                      </span>
                    )}
                  </div>
                  <button onClick={() => navigate(isLoggedIn ? '/detail' : '/cek-skor')} className="text-blue-600 text-sm font-bold hover:text-blue-800 transition-colors flex items-center gap-1 cursor-pointer">
                    Lihat Detail &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="bg-white border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-sm cursor-pointer">
              Muat Lebih Banyak
            </button>
          </div>
        </div>

      </section>
    </div>
  );
}
