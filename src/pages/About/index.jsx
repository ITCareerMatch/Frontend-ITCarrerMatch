import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFileText, FiTarget, FiHeart, FiGithub, FiLinkedin, FiMenu, FiX, FiMonitor, FiCpu, FiCloud, FiAward, FiInstagram } from 'react-icons/fi';
import { BsStars, BsArrowRight } from 'react-icons/bs';
import useAuth from '../../context/useAuth';

export default function About() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = !!session || !!localStorage.getItem('access_token');

  // Data Tim Capstone CC26-PSU088
  const teamMembers = [
    { id: 'CDCC284D6Y2328', name: 'Chardinal Martin B.', role: 'Data Scientist', img: '/profile/foto_chardinal.png', ig: 'https://www.instagram.com/chardinal_01/', linkedin:'https://www.linkedin.com/in/chardinal-martin-butarbutar/', github:'https://github.com/chardinal' },
    { id: 'CDCC284D6X0604', name: 'Nadhia Della P. S.', role: 'Data Scientist', img: '/profile/foto_della.jpg', ig:'https://www.instagram.com/nadhiadellaa?igsh=cmhzdWNkYnlsZDFr', linkedin:'https://www.linkedin.com/in/nadhiadellapuspita?utm_source=share_via&utm_content=profile&utm_medium=member_android', github:'https://github.com/NadhiaDella' },
    { id: 'CFCC284D6X2831', name: 'Mutiara Angelita M.', role: 'Full Stack Developer', img: '/profile/foto_angel.jpg', ig:'https://www.instagram.com/mutiangell_', linkedin:'https://www.linkedin.com/in/mutiangel', github:'https://github.com/kaenjie' },
    { id: 'CFCC614D6Y0867', name: 'Ahmad Sefriadi', role: 'Full Stack Developer', img: '/profile/foto_asep.jpg', ig:'https://www.instagram.com/sefriadiahmad', linkedin:'https://www.linkedin.com/in/sefriadiahmad', github:'https://github.com/sefriadiahmad' },
    { id: 'CACC012D6Y0477', name: 'M. Arifbillah Kamil', role: 'AI Engineer', img: '/profile/foto_abbil.jpg', ig:'https://www.instagram.com/arifbillahkamil', linkedin:'https://www.linkedin.com/in/arifbillahkamil', github:'https://github.com/ArifbillahKamil' },
    { id: 'CACC715D6Y0952', name: 'Ulil Noor Absor', role: 'AI Engineer', img: '/profile/foto_ulil.jpg', ig:'https://www.instagram.com/ulil_na/', linkedin:'https://www.linkedin.com/in/ulil-noor-absor', github:'https://github.com/ulillearn' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      
      {/* --- NAVBAR --- */}
      <header className="flex justify-between items-center py-4 px-6 md:px-12 lg:px-16 border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          <div>
            <img src="/images/logo-itcareermatch.png" alt="ITCareerMatch Logo" className="w-15 h-15 object-contain" />
          </div>
          ITCareerMatch
        </div>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
          <a onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors cursor-pointer">Beranda</a>
          <a onClick={() => navigate('/lowongan')} className="hover:text-blue-600 transition-colors cursor-pointer">Daftar Lowongan</a>
          <a className="text-blue-600 font-bold transition-colors cursor-pointer">Tentang Kami</a>
        </nav>

        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <button onClick={() => navigate('/dashboard')} className="bg-white text-gray-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 border border-gray-200 shadow-sm transition-colors cursor-pointer">Ke Dashboard</button>
          ) : (
            <button onClick={() => navigate('/login')} className="hover:text-blue-600 text-sm font-bold transition-colors cursor-pointer mr-2">Masuk</button>
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
        <div className="fixed md:hidden inset-x-0 top-[73px] z-40 bg-white border-b border-gray-100 px-8 py-6 shadow-xl"> 
          <div className="flex flex-col gap-5 text-sm font-bold text-gray-700">
            <a onClick={() => { setMobileMenuOpen(false); navigate('/'); }} className="block hover:text-blue-600 pb-3 border-b border-gray-50">Beranda</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate('/lowongan'); }} className="block hover:text-blue-600 pb-3 border-b border-gray-50">Daftar Lowongan</a>
            <a onClick={() => { setMobileMenuOpen(false); navigate('/tentang-kami'); }} className="block text-blue-600 pb-3 border-b border-gray-50">Tentang Kami</a>
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

      {/* --- HERO SECTION --- */}
      <section className="pt-20 pb-16 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold mb-6 border border-blue-100">
          <BsStars size={16} /> Capstone Project CC26-PSU088
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mb-6 tracking-tight">
          Menjembatani Talenta Hebat <br className="hidden md:block" /> dengan <span className="text-blue-600">Peluang Tepat</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Kami percaya bahwa setiap individu memiliki potensi besar. ITCareerMatch dibangun untuk memastikan tidak ada talenta yang terbuang hanya karena masalah format CV.
        </p>
      </section>

      {/* --- THE STORY / LATAR BELAKANG --- */}
      <section className="py-16 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center"><FiTarget size={24}/></div>
            <h2 className="text-3xl font-bold text-gray-900">Mengapa Kami Membangun Ini?</h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              Sistem rekrutmen modern saat ini sangat bergantung pada <strong>ATS (Applicant Tracking System)</strong>. Ironisnya, banyak kandidat brilian di Indonesia yang ditolak oleh sistem ini bukan karena mereka kurang mampu, melainkan karena format CV yang tidak dapat dibaca oleh mesin.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Sebagai proyek akhir (Capstone), kami menggabungkan teknologi Kecerdasan Buatan (AI), Cloud Computing, dan pengembangan aplikasi modern untuk menciptakan solusi nyata. ITCareerMatch tidak hanya menganalisis, tetapi juga mendidik para pencari kerja tentang cara menonjol di mata sistem rekrutmen.
            </p>
          </div>
          <div className="md:w-1/2 w-full">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
               <FiHeart size={48} className="text-blue-300 mb-6 relative z-10" />
               <h3 className="text-2xl font-bold mb-4 relative z-10">Visi Kami</h3>
               <p className="text-blue-100 leading-relaxed relative z-10 text-sm">
                 Menjadi platform kecerdasan buatan terdepan yang mendemokratisasi akses karir bagi seluruh talenta digital di Indonesia, memastikan kesetaraan peluang melalui optimalisasi profil yang cerdas.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- TECH STACK (BARU Ditambahkan) --- */}
      <section className="py-24 max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-4">Teknologi di Balik Layar</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto">Sinergi antara tiga disiplin ilmu utama (Learning Paths) untuk menghadirkan platform yang cepat, cerdas, dan andal.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6"><FiMonitor size={24}/></div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Web & Mobile Frontend</h3>
            <p className="text-sm text-gray-500 mb-4">Membangun antarmuka yang responsif, modern, dan ramah pengguna dengan prinsip UI/UX terbaik.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">React.js</span>
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">Tailwind CSS</span>
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">Vite</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6"><FiCpu size={24}/></div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Machine Learning & AI</h3>
            <p className="text-sm text-gray-500 mb-4">Menganalisis teks CV dan mencocokkannya dengan deskripsi pekerjaan menggunakan model NLP canggih.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">Python</span>
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">TensorFlow</span>
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">NLP / LLM</span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6"><FiCloud size={24}/></div>
            <h3 className="font-bold text-gray-900 mb-3 text-lg">Cloud Computing</h3>
            <p className="text-sm text-gray-500 mb-4">Infrastruktur backend yang kokoh, penyimpanan data yang aman, dan penerapan API yang *scalable*.</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">Node.js</span>
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">Google Cloud Platform</span>
              <span className="bg-gray-50 text-gray-600 text-xs px-3 py-1 rounded-full font-medium border border-gray-100">Supabase</span>
            </div>
          </div>
        </div>
      </section>

      {/* --- MEET THE TEAM --- */}
      <section className="py-24 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Tim Pengembang</h2>
        <p className="text-gray-500 mb-16 max-w-xl mx-auto text-sm">
          Bertemu dengan enam pemikir kreatif dari cohort CC26-PSU088 yang mewujudkan proyek ini menjadi nyata.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group">
              <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 mb-6 p-1 border-2 border-dashed border-gray-200 group-hover:border-blue-500 transition-colors">
                {/* Ganti src ini dengan foto asli jika sudah ada */}
                <img src={member.img} alt={member.name} className="w-full h-full rounded-full object-cover" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">{member.role}</p>
              <div className="flex justify-center gap-4">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors"><FiLinkedin size={18}/></a>
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-900 hover:text-white transition-colors"><FiGithub size={18}/></a>
                <a href={member.ig} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-colors"><FiInstagram size={18}/></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- APRESIASI / ACKNOWLEDGMENT (BARU Ditambahkan) --- */}
      <section className="py-12 bg-gray-50 border-t border-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <FiAward className="mx-auto text-yellow-500 mb-4" size={32} />
          <h3 className="font-bold text-gray-900 mb-2">Didukung Penuh Oleh</h3>
          <p className="text-sm text-gray-500 mb-6">Proyek ini merupakan bagian dari tugas akhir (Capstone Project) pada program bergengsi yang diselenggarakan oleh:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <img src="/images/dbs-logo.png" alt="DBS Foundation " className="h-15 object-contain" />
            <img src="/images/dicoding-logo.png" alt="Dicoding Indonesia" className="h-15 object-contain" />
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto mb-12">
        <div className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Penasaran dengan Hasilnya?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto relative z-10 text-sm">
            Cobalah platform yang kami bangun ini. Unggah CV Anda dan biarkan AI kami memberikan ulasan objektif secara instan.
          </p>
          <button 
            onClick={() => navigate('/cek-skor')}
            className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg relative z-10 flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            Mulai Cek Skor CV <BsArrowRight />
          </button>
        </div>
      </section>

      <footer className="py-8 bg-gray-50 border-t border-gray-100">
        <div className="text-center text-xs text-gray-400 border-gray-100 font-medium">
          &copy; 2026 ITCareerMatch. Capstone Team - CC26-PSU088.
        </div>
      </footer>
      
    </div>
  );
}