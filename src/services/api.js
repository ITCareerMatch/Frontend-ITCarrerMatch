const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Legacy helper untuk backward compatibility
const buildHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

// ============================================================
// USER PROFILE
// ============================================================

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

// ============================================================
// CV ENDPOINTS
// ============================================================

/**
 * POST /api/v1/cv/preview
 * Preview CV untuk guest atau input manual
 * Returns: { success, temp_token, preview: { score, extracted_skills, skill_gap, ai_insight, summary } }
 */
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

  return result;
}

/**
 * POST /api/v1/cv/analyze
 * Full CV analysis untuk authenticated user
 * Returns: { success, task_id }
 */
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

  // Debug: log response untuk troubleshooting
  console.log('[analyzeCV] Response:', result);

  if (!response.ok) {
    throw new Error(result?.message || `Gagal menganalisis CV (HTTP ${response.status})`);
  }

  if (!result?.success) {
    throw new Error(result?.message || 'Respons analisis CV tidak berhasil');
  }

  if (!result?.task_id) {
    console.error('[analyzeCV] Missing task_id in response:', result);
    throw new Error('Server tidak mengembalikan task_id. Pastikan analisis CV berhasil diproses.');
  }

  return result.task_id;
}

/**
 * POST /api/v1/cv/claim
 * Claim preview session untuk authenticated user
 * Returns: { success, task_id }
 */
export async function claimCVSession(token, tempToken) {
  if (!token) throw new Error('Missing access token');

  const response = await fetch(`${API_BASE_URL}/api/v1/cv/claim`, {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify({ temp_token: tempToken })
  });
  const result = await response.json().catch(() => null);

  // Debug: log response untuk troubleshooting
  console.log('[claimCVSession] Response:', result);

  if (!response.ok) {
    if (response.status === 410) {
      throw new Error('Sesi preview telah kadaluarsa. Silakan upload ulang CV Anda.');
    }
    throw new Error(result?.message || 'Gagal mengklaim sesi CV');
  }
  if (!result?.success) throw new Error(result?.message || 'Respons klaim tidak berhasil');

  if (!result?.task_id) {
    console.error('[claimCVSession] Missing task_id in response:', result);
    throw new Error('Server tidak mengembalikan task_id. Silakan coba lagi atau hubungi support.');
  }

  return result.task_id;
}

/**
 * GET /api/v1/cv/status/{task_id}
 * Check status analisis CV
 * Returns: { success, status: 'processing'|'completed'|'failed', result: {...} }
 */
export async function checkCVStatus(token, taskId) {
  if (!token) throw new Error('Missing access token');

  const response = await fetch(`${API_BASE_URL}/api/v1/cv/status/${taskId}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengecek status CV (HTTP ${response.status})`);
  if (!result || !result.success) throw new Error(result?.message || 'Respons status CV tidak berhasil');

  return result;
}

/**
 * GET /api/v1/cv/archives
 * Ambil semua arsip CV user
 * Returns: { success, data: [...] }
 */
export async function fetchCVArchives(token, page = 1, limit = 10) {
  if (!token) throw new Error('Missing access token');

  const response = await fetch(`${API_BASE_URL}/api/v1/cv/archives?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil arsip CV (HTTP ${response.status})`);

  return result;
}

/**
 * DELETE /api/v1/cv/archives/{id}
 * Hapus arsip CV
 * Returns: { success }
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

// ============================================================
// JOBS & RECOMMENDATIONS
// ============================================================

/**
 * GET /api/v1/jobs/recommendations
 * Ambil top 20 rekomendasi pekerjaan berdasarkan cv_id
 * Returns: { success, data: [{ job_id, job_title, company, match_score, skill_match, skill_gap, ai_insight }] }
 */
export async function fetchJobRecommendations(token, cvId = null) {
  if (!token) throw new Error('Missing access token');

  let url = `${API_BASE_URL}/api/v1/jobs/recommendations`;
  if (cvId) {
    url += `?cv_id=${cvId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Gagal mengambil rekomendasi (HTTP ${response.status})`);
  }
  if (!result || !result.success) {
    throw new Error(result?.message || 'Respons rekomendasi tidak berhasil');
  }

  return result.data || [];
}

/**
 * GET /api/v1/jobs
 * Ambil daftar lowongan dengan filter
 */
export async function fetchAllJobs(params = {}) {
  const {
    search = '', city = '', province = '',
    minSalary = '', maxSalary = '',
    education_level = '', gender = '',
    job_type = '', work_system = '',
    page = 1, limit = 10
  } = params;

  const query = new URLSearchParams();
  if (search) query.append('search', search);
  if (city) query.append('city', city);
  if (province) query.append('province', province);
  if (minSalary) query.append('minSalary', String(minSalary));
  if (maxSalary) query.append('maxSalary', String(maxSalary));
  if (education_level) query.append('education_level', education_level);
  if (gender) query.append('gender', gender);
  if (job_type) query.append('job_type', job_type);
  if (work_system) query.append('work_system', work_system);
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

/**
 * GET /api/v1/jobs/{id}
 * Ambil detail lowongan
 */
export async function fetchJobDetail(id) {
  const response = await fetch(`${API_BASE_URL}/api/v1/jobs/${id}`, {
    method: 'GET',
    headers: buildHeaders(),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil detail pekerjaan (HTTP ${response.status})`);

  return result.data;
}

// ============================================================
// ANALYSIS
// ============================================================

/**
 * GET /api/v1/analysis/history
 * Ambil riwayat analisis dengan pagination
 * Optional: filter by cvId
 * Returns: { success, data: [...], meta: { page, limit, total } }
 */
export async function fetchAnalysisHistory(token, page = 1, limit = 10, cvId = null) {
  if (!token) throw new Error('Missing access token');

  let url = `${API_BASE_URL}/api/v1/analysis/history?page=${page}&limit=${limit}`;
  if (cvId) {
    url += `&cvId=${cvId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil riwayat analisis (HTTP ${response.status})`);

  // Normalize response untuk kemudahan parsing di komponen
  return {
    success: result?.success ?? false,
    data: result?.data || [],
    meta: result?.meta || { page, limit, total: 0 },
    pagination: {
      page: result?.meta?.page ?? page,
      limit: result?.meta?.limit ?? limit,
      total: result?.meta?.total ?? 0,
      totalPages: Math.ceil((result?.meta?.total ?? 0) / limit) || 1
    }
  };
}

/**
 * GET /api/v1/analysis/{id}
 * Ambil detail analisis
 * Returns: { success, data: { id, cv_id, match_score, skill_match, skill_gap, ai_insight, ... } }
 */
export async function fetchAnalysisDetail(token, analysisId) {
  if (!token) throw new Error('Missing access token');

  const response = await fetch(`${API_BASE_URL}/api/v1/analysis/${analysisId}`, {
    method: 'GET',
    headers: buildHeaders(token),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Gagal mengambil detail analisis (HTTP ${response.status})`);
  if (!result?.success) throw new Error(result?.message || 'Respons detail analisis tidak berhasil');

  // Return data with fallback for missing fields
  const data = result.data || {};

  return {
    id: data.id,
    cv_id: data.cv_id || null, // Might not be in response from backend
    user_id: data.user_id || null,
    job_id: data.job_id || null,
    job_title_snapshot: data.job_title_snapshot || '',
    company_snapshot: data.company_snapshot || '',
    match_score: data.match_score || 0,
    analyzed_at: data.analyzed_at || null,
    skill_match: data.skill_match || [],
    skill_gap: data.skill_gap || [],
    ai_insight: data.ai_insight || '',
    // skill_details from analysis_details table if available
    skill_details: data.skill_details || [],
  };
}

// ============================================================
// CHATBOT
// ============================================================

/**
 * POST /api/v1/chatbot/chat
 * Chat with AI chatbot for career guidance
 * Optional: attach user's CV for personalized responses (if token provided)
 */
export async function chatWithBot(token, message, history = []) {
  const response = await fetch(`${API_BASE_URL}/api/v1/chatbot/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history }),
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Chat failed (HTTP ${response.status})`);
  }

  return result;
}

/**
 * POST /api/v1/chatbot/tts
 * Convert text to speech (audio/wav)
 * Returns binary audio data (blob)
 */
export async function textToSpeech(token, text, voice = 'diana') {
  const response = await fetch(`${API_BASE_URL}/api/v1/chatbot/tts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ text, voice }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.message || `TTS failed (HTTP ${response.status})`);
  }

  // Return blob directly for audio
  return response.blob();
}

/**
 * GET /api/v1/chatbot/voices
 * Get list of available TTS voices
 */
export async function fetchAvailableVoices() {
  const response = await fetch(`${API_BASE_URL}/api/v1/chatbot/voices`, {
    method: 'GET',
  });

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Failed to fetch voices (HTTP ${response.status})`);
  }

  return result.voices || [];
}