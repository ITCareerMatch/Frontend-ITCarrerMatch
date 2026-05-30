/**
 * CV Storage Service
 * Unified storage for CV analysis data
 * Handles both guest preview and authenticated sessions
 */

const STORAGE_KEY = 'cv_analysis_session';

/**
 * Storage structure:
 * {
 *   temp_token: string,        // For guest session claiming
 *   preview: object,           // Preview data from /cv/preview
 *   mode: 'guest' | 'authenticated',
 *   saved_at: timestamp
 * }
 */

export const CVStorage = {
  /**
   * Save guest preview data to sessionStorage
   * @param {object} data - { temp_token, preview }
   */
  saveGuestPreview(data) {
    const payload = {
      temp_token: data.temp_token,
      preview: data.preview,
      mode: 'guest',
      saved_at: Date.now()
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },

  /**
   * Get guest preview data from sessionStorage
   * @returns {object|null} Stored data or null
   */
  getGuestPreview() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  /**
   * Save authenticated analysis task ID
   * @param {string} taskId - Task ID from analyzeCV()
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
    const data = this.getGuestPreview();
    return data !== null && data.mode === 'guest' && !!data.temp_token;
  },

  /**
   * Check if there's a pending authenticated task
   * @returns {boolean}
   */
  hasAuthenticatedTask() {
    return this.getAuthenticatedTask() !== null;
  },

  /**
   * Remove only the temp_token (after claiming)
   * Keeps preview data for display
   */
  markAsClaimed() {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      delete data.temp_token;
      data.claimed_at = Date.now();
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore errors
    }
  }
};

export default CVStorage;