const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ============================================================
// Interceptor Pattern: Helper function untuk request yang konsisten
// ============================================================

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' };

/**
 * Fungsi utama untuk melakukan API request dengan pola konsisten
 * @param {string} endpoint - Path API (tanpa base URL)
 * @param {Object} options - Options untuk fetch
 * @param {Object} options.token - Token autentikasi (optional)
 * @param {Object} options.body - Body request (optional)
 * @param {Object} options.queryParams - Query parameters (optional)
 * @param {boolean} options.isFormData - Apakah menggunakan FormData (optional)
 * @returns {Promise<Object>} - Response data dari API
 */

export async function apiRequest(endpoint, {
  token = null,
  body = null,
  queryParams = null,
  isFormData = false,
} = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`);

  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const headers = isFormData ? {} : { ...DEFAULT_HEADERS };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method: 'GET',
    headers,
  };

  if (body) {
    options.method = 'POST';
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url.toString(), options);
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || `Request gagal (HTTP ${response.status})`);
  }

  if (!result?.success) {
    throw new Error(result?.message || 'Respons API tidak berhasil');
  }

  return result;
}

// Legacy helper untuk backward compatibility
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

export async function updateUserProfile(token, formData) {
  if (!token) throw new Error('Missing access token');

  const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      // NOTE: Content-Type omitted for FormData - browser sets it automatically with boundary
    },
    body: formData,
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal memperbarui profil (HTTP ${response.status})`);
  if (!result || !result.success) throw new Error(result?.message || 'Respons pembaruan profil tidak berhasil');
  
  return result.data;
}

export async function deleteUserProfile(token) {
  const response = await fetch(`${API_BASE_URL}/api/v1/user/profile`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  });
  
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Gagal menghapus akun');
  }
  return result;
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

export async function fetchAllJobs(params = {}) {
  const {
    search = '', city = '', province = '',
    minSalary = '', maxSalary = '',
    minAge = '', maxAge = '',
    education_level = '', gender = '',
    job_type = '', work_system = '',
    page = 1, limit = 10
  } = params;

  const query = new URLSearchParams();
  if (search)          query.append('search', search);
  if (city)            query.append('city', city);
  if (province)        query.append('province', province);
  if (minSalary)       query.append('minSalary', String(minSalary));
  if (maxSalary)       query.append('maxSalary', String(maxSalary));
  if (minAge)          query.append('minAge', String(minAge));
  if (maxAge)          query.append('maxAge', String(maxAge));
  if (education_level) query.append('education_level', education_level);
  if (gender)          query.append('gender', gender);
  
  if (job_type)        query.append('job_type', job_type);
  if (work_system)     query.append('work_system', work_system);

  query.append('page', String(page));
  query.append('limit', String(limit));

  const response = await fetch(`${API_BASE_URL}/api/v1/jobs?${query.toString()}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil daftar lowongan (HTTP ${response.status})`);

  return {
    jobs: result.data || [],
    pagination: result.meta || result.pagination || { page, limit, total: 0 } 
  };
}

export async function fetchJobDetail(id) {
  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil detail pekerjaan (HTTP ${response.status})`);

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

/**
 * Ambil daftar arsip CV user
 * GET /api/v1/cv/archives
 */
export async function fetchCVArchives(token, page = 1, limit = 10) {
  if (!token) throw new Error('Missing access token');
  const query = new URLSearchParams({ page: String(page), limit: String(limit) });
  const response = await fetch(`${API_BASE_URL}/api/v1/cv/archives?${query.toString()}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil arsip CV (HTTP ${response.status})`);
  return result;
}

/**
 * Hapus arsip CV (cascades ke skills, analysis, storage)
 * DELETE /api/v1/cv/archives/{id}
 */
export async function deleteCVArchive(token, archiveId) {
  if (!token) throw new Error('Missing access token');
  const response = await fetch(`${API_BASE_URL}/api/v1/cv/archives/${archiveId}`, {
    method: 'DELETE',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal menghapus arsip CV (HTTP ${response.status})`);
  return result;
}