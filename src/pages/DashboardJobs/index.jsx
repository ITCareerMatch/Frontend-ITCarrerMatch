import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSearch, FiMapPin, FiFilter, FiBookmark, FiClock, 
  FiBriefcase, FiDollarSign, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

export default function DashboardJobs() {
  const navigate = useNavigate();

  // Data Dummy Lowongan Pekerjaan (Sama seperti landing page, tapi semua ada Match Score)
  const jobs = [
    {
      id: 1, title: "Senior Frontend Engineer", company: "TechNusa", location: "Jakarta Selatan", type: "Remote", salary: "Rp 15.000.000 - 25.000.000", skills: ["React", "TypeScript", "Tailwind", "Next.js"], posted: "2 hari yang lalu", isHot: true, match: 92
    },
    {
      id: 2, title: "Product Designer (UI/UX)", company: "KreatifDigital", location: "Bandung, Jawa Barat", type: "Hybrid", salary: "Rp 12.000.000 - 18.000.000", skills: ["Figma", "Prototyping", "Research"], posted: "5 jam yang lalu", isHot: false, match: 88
    },
    {
      id: 3, title: "Backend Developer (Go)", company: "Fintech Maju", location: "Jakarta Pusat", type: "On-site", salary: "Rp 18.000.000 - 28.000.000", skills: ["Golang", "PostgreSQL", "Docker"], posted: "1 minggu yang lalu", isHot: false, match: 75
    },
    {
      id: 4, title: "Data Analyst", company: "Dataina", location: "Surabaya, Jawa Timur", type: "Remote", salary: "Rp 10.000.000 - 15.000.000", skills: ["Python", "SQL", "Tableau"], posted: "3 hari yang lalu", isHot: true, match: 85
    }
  ];

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
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Eksplorasi Lowongan</h1>
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
            <FiSearch className="text-gray-400 mr-3" size={20}/>
            <input type="text" placeholder="Posisi, kata kunci, atau perusahaan..." className="w-full bg-transparent outline-none text-gray-700 text-sm"/>
          </div>
          <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-colors">
            <FiMapPin className="text-gray-400 mr-3" size={20}/>
            <input type="text" placeholder="Lokasi atau 'Remote'..." className="w-full bg-transparent outline-none text-gray-700 text-sm"/>
          </div>
          <button className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors shrink-0">
            Cari Kerja
          </button>
        </div>

        {/* Quick Filters */}
        <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mr-2 shrink-0"><FiFilter/> Filter Cepat:</div>
          <button className="bg-blue-50 text-blue-600 border border-blue-100 px-4 py-1.5 rounded-full text-sm font-bold shrink-0 flex items-center gap-1.5"><BsStars className="text-yellow-500"/> Paling Cocok</button>
          <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0">Remote</button>
          <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0">Gaji Tertinggi</button>
          <button className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 px-4 py-1.5 rounded-full text-sm font-medium shrink-0">Terbaru</button>
        </div>
      </div>

      {/* --- MAIN CONTENT (Sidebar Filter & List) --- */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* SIDEBAR FILTER (Kiri) */}
        <aside className="w-full lg:w-1/4 space-y-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Tipe Pekerjaan</h3>
            <div className="space-y-3">
              {['Full-time', 'Part-time', 'Kontrak', 'Freelance', 'Magang'].map((type, i) => (
                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                </label>
              ))}
            </div>

            <div className="w-full h-px bg-gray-100 my-6"></div>

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
          
          {/* Banner Edit CV */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-6 rounded-3xl text-center">
             <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm"><BsStars size={20}/></div>
             <h4 className="font-bold text-gray-900 mb-2">Tingkatkan Skor Anda</h4>
             <p className="text-xs text-gray-500 mb-4">Perbarui CV Anda di Editor untuk meningkatkan persentase kecocokan dengan lowongan ini.</p>
             <button onClick={() => navigate('/editor')} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm">Buka CV Editor</button>
          </div>
        </aside>

        {/* DAFTAR LOWONGAN (Kanan) */}
        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-gray-900">245 Lowongan Ditemukan</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Urutkan:</span>
              <select className="font-semibold text-gray-900 bg-transparent outline-none cursor-pointer">
                <option>Paling Cocok (AI)</option>
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
                  <button className="text-gray-300 hover:text-blue-600 transition-colors"><FiBookmark size={22}/></button>
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

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-50 gap-4">
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-400 flex items-center gap-1"><FiClock/> {job.posted}</span>
                    
                    {/* Badge Match AI Selalu Tampil Karena Ini Dalam Dashboard */}
                    <span className={`font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg border ${job.match >= 85 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                      <FiCheckCircle/> {job.match}% Cocok dengan Profil
                    </span>
                  </div>
                  <button onClick={() => navigate('/detail')} className="bg-blue-50 text-blue-700 px-5 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors text-center">
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button className="bg-white border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition-colors text-sm">
              Muat Lebih Banyak Lowongan <FiArrowRight className="inline-block" size={18}/>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}