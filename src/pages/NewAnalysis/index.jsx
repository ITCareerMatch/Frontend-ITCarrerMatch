import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUploadCloud, FiEdit2, FiRefreshCw, FiZap,
  FiCheckCircle, FiShield, FiFileText, FiTarget, FiBriefcase
} from 'react-icons/fi';
import { BsStars, BsLightbulbFill } from 'react-icons/bs';
import { analyzeCV, checkCVStatus, fetchAnalysisHistory } from '../../services/api';

export default function NewAnalysis() {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');

  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  
  // State baru untuk input manual
  const [pengalaman, setPengalaman] = useState('');
  const [keahlian, setKeahlian] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [taskId, setTaskId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Fetch analysis history on mount
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const data = await fetchAnalysisHistory(token, 1, 10);
        setHistory(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [token, navigate]);

  // Handle file change dengan Validasi 1MB
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1024 * 1024) {
        setError('Ukuran file maksimal adalah 1MB untuk menghemat beban server.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  // Poll for analysis status
  useEffect(() => {
    if (!taskId || !token) return;

    let intervalId;

    const poll = async () => {
      try {
        const result = await checkCVStatus(token, taskId);

        if (result.status === 'completed') {
          clearInterval(intervalId);
          setIsAnalyzing(false);
          setTaskId(null);
          
          const analysisId = result.data?.id || result.data?.analysis_id || result.analysis_id;
          navigate('/analisis-result', { state: { analysisId: analysisId } });
        } else if (result.status === 'failed') {
          clearInterval(intervalId);
          setIsAnalyzing(false);
          setError('Analisis gagal. Silakan coba lagi.');
          setTaskId(null);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    };

    intervalId = setInterval(poll, 3000);
    return () => clearInterval(intervalId);
  }, [taskId, token, navigate]);

  // Start analysis
  const handleStartAnalysis = async () => {
    // Validasi berdasarkan Tab Aktif
    if (activeTab === 'upload' && !file) {
      setError('Mohon pilih file CV terlebih dahulu');
      return;
    }

    if (activeTab === 'manual' && (pengalaman.trim().length < 5 || keahlian.trim().length < 5)) {
      setError('Mohon lengkapi data pengalaman dan keahlian Anda.');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      let result;
      if (activeTab === 'upload') {
        // Panggil analyzeCV dengan file (Manual dikosongkan)
        result = await analyzeCV(token, file, null);
      } else {
        // Gabungkan teks manual
        const manualData = `Pengalaman Kerja:\n${pengalaman}\n\nDaftar Keahlian:\n${keahlian}`;
        // Panggil analyzeCV dengan manualData (File dikosongkan)
        result = await analyzeCV(token, null, manualData);
      }
      
      setTaskId(result.task_id);
    } catch (err) {
      setError(err.message || 'Gagal memulai analisis. Silakan coba lagi.');
      setIsAnalyzing(false);
      console.error('Analysis error:', err);
    }
  };

  // Logika pengecekan validasi form untuk mematikan tombol
  const isFormValid = activeTab === 'upload' 
    ? !!file 
    : (pengalaman.trim().length >= 5 && keahlian.trim().length >= 5);

  return (
    <div className="max-w-7xl mx-auto pb-12 font-sans text-gray-800">
      
      {/* --- HEADER --- */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <BsStars size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Analisis Baru</h1>
          <p className="text-sm text-gray-500">Upload CV baru untuk analisis ulang secara instan</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* KOLOM KIRI (Area Input Utama) */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
              <div className="flex items-center gap-2 bg-white pr-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">1</div>
                <span className="text-sm font-bold text-gray-900">Data CV</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">2</div>
                <span className="text-sm font-medium text-gray-400">Analisis AI</span>
              </div>
              <div className="flex items-center gap-2 bg-white pl-4">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-sm">3</div>
                <span className="text-sm font-medium text-gray-400">Hasil Penuh</span>
              </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex bg-gray-50 p-1.5 rounded-xl border border-gray-200 mb-8">
              <button 
                onClick={() => { setActiveTab('upload'); setError(''); }} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'upload' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FiUploadCloud size={18}/> Unggah File
              </button>
              <button 
                onClick={() => { setActiveTab('manual'); setError(''); }} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold transition-all ${activeTab === 'manual' ? 'bg-white text-indigo-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FiEdit2 size={18}/> Isi Manual
              </button>
            </div>

            {/* Konten Tab */}
            <div className="mb-8">
              {activeTab === 'upload' ? (
                <div>
                  <label className="border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 hover:border-indigo-300 transition-colors cursor-pointer group block">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                      className="hidden"
                    />
                    {file ? (
                      <div className="flex items-center gap-3">
                        <FiFileText className="text-indigo-600" size={32} />
                        <div className="text-left">
                          <p className="text-sm font-bold text-gray-900">{file.name}</p>
                          <p className="text-xs text-green-600 flex items-center gap-1"><FiCheckCircle /> Siap dianalisis</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <FiUploadCloud size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Drag & Drop CV baru di sini</h3>
                        <p className="text-sm text-gray-500 mb-6">atau klik untuk memilih file</p>
                        <div className="flex gap-3 text-xs font-semibold text-gray-400">
                          <span className="bg-gray-100 px-3 py-1 rounded-md">PDF</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-md">DOCX</span>
                          <span className="bg-gray-100 px-3 py-1 rounded-md">Maks 1MB</span>
                        </div>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Pengalaman Kerja</label>
                    <textarea
                      rows="5"
                      value={pengalaman}
                      onChange={(e) => setPengalaman(e.target.value)}
                      placeholder="Contoh: 3 tahun sebagai Frontend Developer di PT ABC..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Daftar Keahlian</label>
                    <textarea
                      rows="3"
                      value={keahlian}
                      onChange={(e) => setKeahlian(e.target.value)}
                      placeholder="Contoh: React, TypeScript, Node.js, Figma..."
                      className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-gray-50 focus:bg-white transition-colors"
                    ></textarea>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              onClick={handleStartAnalysis}
              disabled={isAnalyzing || !isFormValid}
              className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2 ${isAnalyzing || !isFormValid ? 'bg-indigo-300 text-white cursor-not-allowed shadow-none' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'}`}
            >
              {isAnalyzing ? (
                <><FiRefreshCw className="animate-spin" size={20} /> Memproses Analisis AI...{taskId && ` (ID: ${taskId})`}</>
              ) : (
                <><FiZap size={20} /> Mulai Analisis Penuh</>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Hasil analisis akan menampilkan seluruh skor dan saran secara lengkap.
            </p>

          </div>
        </div>

        {/* KOLOM KANAN (Widget Tambahan) */}
        <div className="lg:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Scan Terakhir</h3>
            <p className="text-xs text-gray-500 mb-5">Klik untuk lihat hasil analisis</p>

            <div className="space-y-4">
              {loadingHistory ? (
                <p className="text-sm text-gray-500">Memuat riwayat...</p>
              ) : history && history.length > 0 ? (
                history.slice(0, 3).map((scan, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/analisis-result`, { state: { analysisId: scan.id } })}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-100">
                        <FiTarget size={18}/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{scan.job_title || 'Analisis CV'}</p>
                        <p className="text-xs text-gray-500">{new Date(scan.created_at).toLocaleDateString('id-ID')} · Skor: {Math.round(scan.score || scan.match_score || 0)}</p>
                      </div>
                    </div>
                    <FiRefreshCw className="text-gray-300 group-hover:text-indigo-600 transition-colors shrink-0" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">Belum ada analisis sebelumnya</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-md relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
             <h3 className="font-bold mb-4 relative z-10">Real-time Scan</h3>
             <ul className="space-y-3 text-sm text-indigo-50 relative z-10">
               <li className="flex items-center gap-2"><FiZap className="text-indigo-200 shrink-0"/> Skor kecocokan instan (0-100)</li>
               <li className="flex items-center gap-2"><FiCheckCircle className="text-indigo-200 shrink-0"/> Skill Match & Gap analysis</li>
               <li className="flex items-center gap-2"><BsStars className="text-indigo-200 shrink-0"/> Saran perbaikan kalimat AI</li>
               <li className="flex items-center gap-2"><FiBriefcase className="text-indigo-200 shrink-0"/> Rekomendasi lowongan baru</li>
             </ul>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><BsLightbulbFill className="text-yellow-500"/> Tips</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2"><FiCheckCircle className="text-green-500 shrink-0 mt-0.5"/> <span>Pastikan CV Anda menggunakan format yang bersih (ATS-Friendly) agar mudah dibaca AI.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}