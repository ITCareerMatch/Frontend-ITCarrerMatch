import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  fetchJobRecommendations,
  claimCVSession,
  checkCVStatus
} from '../../services/api';
import CVStorage from '../../services/cvStorage';

// Components
import PollingScreen from './components/PollingScreen';
import FailedScreen from './components/FailedScreen';
import GuestMode from './components/GuestMode';
import AuthenticatedMode from './components/AuthenticatedMode';

/**
 * AnalysisResult Page
 *
 * Alur aplikasi:
 *
 * FLOW A: Guest Preview (Tanpa Login)
 *   /cek-skor → POST /cv/preview → Simpan temp_token → navigate /analisis-result?mode=guest
 *   → GuestMode (locked) → User login/register
 *
 * FLOW B: Guest → Login → Claim Session
 *   GuestMode → Login → POST /cv/claim → task_id → Poll /cv/status/{task_id}
 *   → AuthenticatedMode (unlocked)
 *
 * FLOW C: User Login → Analisis Baru
 *   /analisis-baru → POST /cv/analyze → task_id → navigate /analisis-result?mode=authenticated&taskId={task_id}
 *   → Poll /cv/status/{task_id} → AuthenticatedMode (unlocked)
 */

// ===============================
// VIEW STATES
// ===============================
// loading     - Initial loading state
// polling     - Polling task status (authenticated)
// auth_claiming - Claiming session after login
// guest_locked - Guest sees preview with lock
// result      - Showing complete result (authenticated)
// failed      - Error occurred

export default function AnalysisResult() {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth state
  const token = localStorage.getItem('access_token');
  const isLoggedIn = !!token;

  // Refs
  const pollingRef = useRef(null);

  // UI States
  const [viewState, setViewState] = useState('loading');
  const [data, setData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  // ===============================
  // POLLING FUNCTION
  // ===============================
  const pollTask = useCallback(async (taskId) => {
    let attempts = 0;
    const MAX = 30;

    setViewState('polling');

    const poll = async () => {
      if (attempts >= MAX) {
        setViewState('failed');
        setError('Waktu tunggu habis. Silakan coba lagi.');
        return;
      }

      try {
        const result = await checkCVStatus(token, taskId);
        const status = result?.status;
        setCurrentStep(Math.min(attempts, 4));

        if (status === 'completed') {
          const cvId = result?.result?.cv_id;
          const analysisData = result?.result || {};
          setData(analysisData);

          // Fetch job recommendations based on cv_id
          if (cvId) {
            try {
              const recs = await fetchJobRecommendations(token, cvId);
              setRecommendedJobs(Array.isArray(recs) ? recs : []);
            } catch (recErr) {
              console.warn('Failed to fetch recommendations:', recErr);
            }
          }

          setViewState('result');
          return;
        }

        if (status === 'failed') {
          setViewState('failed');
          setError('Analisis CV gagal.');
          return;
        }

        attempts++;
        pollingRef.current = setTimeout(poll, 3000);
      } catch (err) {
        console.warn(`Poll ${attempts}:`, err.message);
        attempts++;
        pollingRef.current = setTimeout(poll, 3000);
      }
    };

    poll();
  }, [token]);

  // ===============================
  // CLAIM & POLL FUNCTION
  // ===============================
  const claimAndPoll = useCallback(async (tempToken, preview) => {
    setViewState('auth_claiming');
    setCurrentStep(0);

    try {
      const taskId = await claimCVSession(token, tempToken);

      if (taskId) {
        // Mark as claimed
        CVStorage.markAsClaimed();
        // Poll for task status
        await pollTask(taskId);
      } else {
        // No taskId, show preview as result
        setData(preview);
        setViewState('result');
      }
    } catch (err) {
      console.error('Claim session error:', err);
      // Fallback: show preview
      setData(preview);
      setViewState('result');
    }
  }, [token, pollTask]);

  // ===============================
  // SIMULATE GUEST PREVIEW
  // ===============================
  const showGuestPreview = useCallback((preview) => {
    setViewState('polling');
    setCurrentStep(0);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      setCurrentStep(Math.min(step, 4));

      if (step >= 4) {
        clearInterval(interval);
        setPreviewData(preview);
        setViewState('guest_locked');
      }
    }, 1500);
  }, []);

  // ===============================
  // MAIN LOADING EFFECT
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      setViewState('loading');

      // Check for authenticated task via query param
      const params = new URLSearchParams(location.search);
      const mode = params.get('mode');
      const taskIdParam = params.get('taskId');

      try {
        // FLOW C: Authenticated NewAnalysis with query param
        if (mode === 'authenticated' && taskIdParam && isLoggedIn) {
          await pollTask(taskIdParam);
          return;
        }

        // Check CVStorage for guest session
        const storageData = CVStorage.getGuestPreview();

        if (storageData && isLoggedIn) {
          // FLOW B: Guest session claimed after login
          if (storageData.temp_token) {
            await claimAndPoll(storageData.temp_token, storageData.preview);
          } else {
            // Already claimed, show preview
            setData(storageData.preview);
            setViewState('result');
          }
          return;
        }

        if (storageData && !isLoggedIn) {
          // FLOW A: Guest sees preview
          showGuestPreview(storageData.preview);
          return;
        }

        // Check legacy sessionStorage for backward compatibility
        const legacySession = sessionStorage.getItem('guest_cv_result');
        if (legacySession) {
          const parsed = JSON.parse(legacySession);

          if (isLoggedIn) {
            const tempToken = parsed?.temp_token;
            const previewD = parsed?.preview || parsed?.data || parsed;
            if (tempToken) {
              await claimAndPoll(tempToken, previewD);
            } else {
              setData(previewD);
              setViewState('result');
            }
          } else {
            const previewD = parsed?.preview || parsed?.data || parsed;
            showGuestPreview(previewD);
          }
          return;
        }

        // No data found - redirect
        if (isLoggedIn) {
          navigate('/dashboard');
        } else {
          navigate('/cek-skor');
        }

      } catch (err) {
        console.error('loadData error:', err);
        setError(err.message);
        setViewState('failed');
      }
    };

    loadData();
  }, [token, location.search, isLoggedIn, navigate, pollTask, claimAndPoll, showGuestPreview]);

  // ===============================
  // HANDLERS
  // ===============================
  const handleLoginClick = () => {
    navigate('/login?redirect=/analisis-result');
  };

  const handleRetry = () => {
    CVStorage.clear();
    sessionStorage.removeItem('guest_cv_result');
    if (isLoggedIn) {
      navigate('/analisis-baru');
    } else {
      navigate('/cek-skor');
    }
  };

  const handleBack = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  // ===============================
  // RENDER STATES
  // ===============================
  if (viewState === 'loading') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Memuat...</p>
      </div>
    );
  }

  if (viewState === 'polling' || viewState === 'auth_claiming') {
    return <PollingScreen currentStep={currentStep} isAuthenticated={isLoggedIn} isClaiming={viewState === 'auth_claiming'} />;
  }

  if (viewState === 'failed') {
    return <FailedScreen error={error} onRetry={handleRetry} />;
  }

  if (viewState === 'guest_locked') {
    return (
      <GuestMode
        previewData={previewData}
        onLoginClick={handleLoginClick}
        onRegisterClick={() => navigate('/register?redirect=/analisis-result')}
      />
    );
  }

  // ===============================
  // RESULT LAYOUT (Authenticated)
  // ===============================
  return (
    <AuthenticatedMode
      data={data}
      recommendedJobs={recommendedJobs}
      onBackClick={handleBack}
    />
  );
}
