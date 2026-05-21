const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const buildHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export async function fetchUserProfile(token) {
  if (!token) throw new Error('Missing access token');
  const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.message || 'Gagal mengambil profil pengguna');
  if (!result.success) throw new Error(result.message || 'Respons profil tidak berhasil');
  return result.data;
}

export async function updateUserProfile(token, profileData) {
  if (!token) throw new Error('Missing access token');
  const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify(profileData),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal memperbarui profil (HTTP ${response.status})`);
  if (!result || !result.success) throw new Error(result?.message || 'Respons pembaruan profil tidak berhasil');
  return result.data;
}

// PERBAIKAN: Tidak perlu parameter page & limit (sesuai Swagger terbaru)
export async function fetchJobRecommendations(token) {
  if (!token) throw new Error('Missing access token');

  // Tidak ada penambahan query string page/limit
  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/recommendations`, {
    method: 'GET',
    headers: buildHeaders(token),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Gagal mengambil rekomendasi (HTTP ${response.status})`);
  }

  if (!result || !result.success) {
    throw new Error(result?.message || 'Respons lowongan tidak berhasil');
  }

  return result.data; // Mengembalikan array job rekomendasi langsung
}

// PERBAIKAN: Endpoint berubah jadi /preview dan mendukung input file ATAU manual (cv_data)
export async function uploadCV(file, manualText = null) {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  } else if (manualText) {
    formData.append('cv_data', JSON.stringify({ text: manualText }));
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/cv/preview`, {
    method: 'POST',
    body: formData,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal memproses CV (HTTP ${response.status})`);
  if (!result || !result.success) throw new Error(result?.message || 'Respons preview CV tidak berhasil');
  
  // Mengembalikan preview data sekaligus temp_token
  return result; 
}

// FUNGSI BARU: Untuk mengklaim CV Guest menjadi User terdaftar
export async function claimCVSession(token, tempToken) {
  if (!token) throw new Error('Missing access token');
  const response = await fetch(`${API_BASE_URL}/api/v1/cv/claim`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ temp_token: tempToken })
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || 'Gagal mengklaim sesi CV');
  return result.task_id;
}

export async function analyzeCV(token, file, manualText = null) {
  if (!token) throw new Error('Missing access token');
  const formData = new FormData();
  if (file) formData.append('file', file);
  else if (manualText) formData.append('cv_data', JSON.stringify({ text: manualText }));

  const response = await fetch(`${API_BASE_URL}/api/v1/cv/analyze`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal menganalisis CV (HTTP ${response.status})`);
  if (!result || !result.success) throw new Error(result?.message || 'Respons analisis CV tidak berhasil');
  return result.task_id;
}

export async function checkCVStatus(token, taskId) {
  if (!token) throw new Error('Missing access token');
  const response = await fetch(`${API_BASE_URL}/api/v1/cv/status/${taskId}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengecek status CV (HTTP ${response.status})`);
  if (!result || !result.success) throw new Error(result?.message || 'Respons status CV tidak berhasil');
  return { status: result.status, data: result.result };
}

// Sisa fungsi tetap sama
export async function fetchAllJobs(params = {}) {
  const { search = '', city = '', province = '', minSalary = '', maxSalary = '', minAge = '', maxAge = '', education_level = '', gender = '', page = 1, limit = 10 } = params;
  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (city) query.append('city', city);
  if (province) query.append('province', province);
  if (minSalary) query.append('minSalary', minSalary);
  if (maxSalary) query.append('maxSalary', maxSalary);
  if (minAge) query.append('minAge', minAge);
  if (maxAge) query.append('maxAge', maxAge);
  if (education_level) query.append('education_level', education_level);
  if (gender) query.append('gender', gender);
  query.append('page', String(page));
  query.append('limit', String(limit));

  const response = await fetch(`${API_BASE_URL}/api/v1/jobs?${query.toString()}`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil daftar lowongan (HTTP ${response.status})`);
  return { 
    jobs: result.data,
    pagination: result.meta || result.pagination 
  };
}

export async function fetchJobDetail(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${jobId}`, {
    method: 'GET',
    headers: buildHeaders(),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil detail lowongan (HTTP ${response.status})`);
  return result.data;
}

export async function fetchAnalysisHistory(token, page = 1, limit = 10) {
  if (!token) throw new Error('Missing access token');
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  const response = await fetch(`${API_BASE_URL}/api/v1/analysis/history?${query.toString()}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil riwayat analisis (HTTP ${response.status})`);
  return result.data;
}

export async function fetchAnalysisDetail(token, analysisId) {
  if (!token) throw new Error('Missing access token');
  const response = await fetch(`${API_BASE_URL}/api/v1/analysis/${analysisId}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil detail analisis (HTTP ${response.status})`);
  return result.data;
}