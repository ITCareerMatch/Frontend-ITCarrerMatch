/**
 * CV Storage Service
 * Unified storage for CV analysis data
 * Handles both guest preview and authenticated sessions
 *
 * OPTIMASI: Cache hasil analysis diikat dengan taskId.
 * Saat upload CV baru dengan taskId berbeda, cache lama tidak digunakan.
 */

const STORAGE_KEY = 'cv_analysis_session';
const RESULT_KEY = 'cv_analysis_result'; // Key untuk menyimpan hasil polling + taskId

/**
 * Storage structure for Guest:
 * {
 *   temp_token: string,        // For guest session claiming
 *   mode: 'guest',
 *   saved_at: timestamp
 * }
 *
 * Storage structure for Authenticated:
 * {
 *   task_id: string,          // For polling status
 *   mode: 'authenticated',
 *   saved_at: timestamp
 * }
 *
 * Result storage structure:
 * {
 *   task_id: string,          // Untuk validasi cache sesuai taskId
 *   result: object,            // Hasil analisis
 *   saved_at: timestamp
 * }
 */

export const CVStorage = {
  /**
   * Save guest preview temp_token
   * @param {string} tempToken - Temp token from /cv/preview
   */
  saveGuestTempToken(tempToken) {
    const payload = {
      temp_token: tempToken,
      mode: 'guest',
      saved_at: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },

  /**
   * Get guest session data
   * @returns {object|null} { temp_token, mode, saved_at } or null
   */
  getGuestSession() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);
      if (data.mode === 'guest' && data.temp_token) {
        return data;
      }
      return null;
    } catch {
      return null;
    }
  },

  /**
   * Save authenticated analysis task ID
   * @param {string} taskId - Task ID from /cv/analyze
   */
  saveAuthenticatedTask(taskId) {
    const payload = {
      task_id: taskId,
      mode: 'authenticated',
      saved_at: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },

  /**
   * Get authenticated task ID
   * @returns {string|null} Task ID or null
   */
  getAuthenticatedTask() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);
      return data.mode === 'authenticated' ? data.task_id : null;
    } catch {
      return null;
    }
  },

  /**
   * Clear all CV analysis session data
   */
  clear() {
    sessionStorage.removeItem(STORAGE_KEY);
  },

  /**
   * Check if there's a pending guest session
   * @returns {boolean}
   */
  hasGuestSession() {
    const data = this.getGuestSession();
    return data !== null && !!data.temp_token;
  },

  /**
   * Check if there's a pending authenticated task
   * @returns {boolean}
   */
  hasAuthenticatedTask() {
    return this.getAuthenticatedTask() !== null;
  },

  /**
   * Remove temp_token after claiming (called internally)
   * Used to mark that claim was successful
   */
  _markAsClaimed(taskId) {
    const payload = {
      task_id: taskId,
      mode: 'authenticated',
      claimed_at: Date.now(),
      saved_at: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },

  /**
   * Save analysis result after polling completes
   * @param {object} result - The complete analysis result from polling
   * @param {string} taskId - Task ID untuk validasi cache
   */
  saveResult(result, taskId = null) {
    const payload = {
      task_id: taskId,  // Simpan taskId untuk validasi
      result,
      saved_at: Date.now()
    };
    sessionStorage.setItem(RESULT_KEY, JSON.stringify(payload));
  },

  /**
   * Get saved analysis result dengan validasi taskId
   * @param {string|null} currentTaskId - TaskId saat ini (dari URL)
   * @returns {object|null} Saved result atau null jika tidak valid
   */
  getResult(currentTaskId = null) {
    const raw = sessionStorage.getItem(RESULT_KEY);
    if (!raw) return null;

    try {
      const data = JSON.parse(raw);

      // Check if result is less than 30 minutes old
      const age = Date.now() - (data.saved_at || 0);
      const MAX_AGE = 30 * 60 * 1000; // 30 minutes
      if (age > MAX_AGE) {
        sessionStorage.removeItem(RESULT_KEY);
        return null;
      }

      // VALIDASI TASK ID: Jika ada taskId saat ini, cek apakah cocok
      // Jika tidak cocok, cache tidak valid - hapus dan return null
      if (currentTaskId && data.task_id && data.task_id !== currentTaskId) {
        console.log(`[CVStorage] Cache miss: taskId berbeda (cache: ${data.task_id}, current: ${currentTaskId})`);
        sessionStorage.removeItem(RESULT_KEY);
        return null;
      }

      return data.result || null;
    } catch {
      return null;
    }
  },

  /**
   * Clear result only (keep session for navigation)
   */
  clearResult() {
    sessionStorage.removeItem(RESULT_KEY);
  },

  /**
   * Check if there's a saved result (tanpa validasi taskId)
   * @returns {boolean}
   */
  hasResult() {
    return this.getResult() !== null;
  }
};

export default CVStorage;