/**
 * CV Storage Service
 * Unified storage for CV analysis data
 * Handles both guest preview and authenticated sessions
 */

const STORAGE_KEY = 'cv_analysis_session';

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
  }
};

export default CVStorage;