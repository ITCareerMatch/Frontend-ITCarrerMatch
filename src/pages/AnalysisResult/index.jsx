import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
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
 *   → GuestMode (locked UI dengan blur) → User login/register
 *
 * FLOW B: Guest → Login → Claim Session
 *   GuestMode → Login → POST /cv/claim → task_id → Poll /cv/status/{task_id}
 *   → AuthenticatedMode (unlocked dengan data asli)
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
// claiming    - Claiming session after login
// guest_locked - Guest sees preview with locked UI
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
  const hasInitializedRef = useRef(false);

  // Check for saved result synchronously on mount (before any state updates)
  // This prevents the loading/polling flicker when navigating back
  const initialSavedResult = useMemo(() => CVStorage.getResult(), []);

  // UI States - Initialize with saved result if available to prevent loading flicker
  const [viewState, setViewState] = useState(initialSavedResult ? 'result' : 'loading');
  const [taskResult, setTaskResult] = useState(initialSavedResult);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  // If we have initial saved result, clear it and use it immediately
  useEffect(() => {
    if (initialSavedResult && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      console.log('[Init] Using pre-loaded saved result');
      setTaskResult(initialSavedResult);
      setViewState('result');
      CVStorage.clearResult();
    }
  }, [initialSavedResult]);

  // ===============================
  // POLLING FUNCTION
  // ===============================
  const pollTask = useCallback(async (taskId) => {
    let attempts = 0;
    const MAX = 30;

    setViewState('polling');
    setCurrentStep(0);

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
          setTaskResult(result?.result || null);
          // Save result to storage for later access (e.g., when navigating back from job detail)
          CVStorage.saveResult(result?.result || null);
          CVStorage.clear(); // Clear session storage but keep result
          setViewState('result');
          return;
        }

        if (status === 'failed') {
          setViewState('failed');
          setError(result?.result?.message || 'Analisis CV gagal.');
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
  // CLAIM & POLL FUNCTION (FLOW B)
  // ===============================
  const claimAndPoll = useCallback(async (tempToken) => {
    setViewState('claiming');
    setCurrentStep(0);

    try {
      const taskId = await claimCVSession(token, tempToken);

      if (taskId) {
        CVStorage.clear();
        await pollTask(taskId);
        // Update URL untuk bookmark
        window.history.replaceState(null, '', `/analisis-result?mode=authenticated&taskId=${taskId}`);
      } else {
        throw new Error('Server tidak mengembalikan task_id');
      }
    } catch (err) {
      console.error('[claimAndPoll] Error:', err.message);
      setError(err.message);
      setViewState('failed');
    }
  }, [token, pollTask]);

  // ===============================
  // MAIN LOADING EFFECT
  // ===============================
  useEffect(() => {
    // Skip if we already have a result (either from initial load or from polling)
    if (taskResult) {
      console.log('[loadData] taskResult already exists, skipping...');
      return;
    }

    // Skip if we already initialized from saved result
    if (hasInitializedRef.current) {
      console.log('[loadData] Already initialized from saved result, skipping...');
      return;
    }

    const loadData = async () => {
      // Parse URL params
      const params = new URLSearchParams(location.search);
      const mode = params.get('mode');
      const taskIdParam = params.get('taskId');
      const tempTokenParam = params.get('tempToken');

      // Skip jika viewState bukan 'loading' (sedang diproses)
      // Ini mencegah overwrite state saat ada proses yang sedang berjalan
      if (viewState !== 'loading') {
        console.log('[loadData] viewState is', viewState, '- skipping...');
        return;
      }

      try {
        // FLOW C: Authenticated NewAnalysis - langsung polling dengan taskId dari URL
        if (mode === 'authenticated' && taskIdParam && isLoggedIn) {
          await pollTask(taskIdParam);
          return;
        }

        // FLOW B: Ada tempToken di URL dan user sudah login → langsung claim
        if (tempTokenParam && isLoggedIn) {
          await claimAndPoll(tempTokenParam);
          return;
        }

        // Cek apakah ada guest session yang sudah di-claim di CVStorage
        const guestSession = CVStorage.getGuestSession();

        // FLOW B (legacy): Ada guest session di storage dan user sudah login → claim it
        if (isLoggedIn && guestSession?.temp_token) {
          await claimAndPoll(guestSession.temp_token);
          return;
        }

        // FLOW A: Guest sees locked preview (ada tempToken di URL atau di storage)
        if (tempTokenParam || guestSession?.temp_token) {
          setViewState('guest_locked');
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
  }, [token, location.search, isLoggedIn, navigate, pollTask, claimAndPoll, taskResult, viewState]);

  // ===============================
  // HANDLERS
  // ===============================
  const handleLoginClick = () => {
    // Navigate ke login dengan tempToken di URL jika ada
    const params = new URLSearchParams(location.search);
    const tempToken = params.get('tempToken');
    if (tempToken) {
      navigate(`/login?redirect=/analisis-result&tempToken=${tempToken}`);
    } else {
      navigate('/login?redirect=/analisis-result');
    }
  };

  const handleRetry = () => {
    CVStorage.clear();
    CVStorage.clearResult();
    if (isLoggedIn) {
      navigate('/analisis-baru');
    } else {
      navigate('/cek-skor');
    }
  };

  const handleBack = () => {
    CVStorage.clear();
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

  if (viewState === 'polling' || viewState === 'claiming') {
    return <PollingScreen currentStep={currentStep} isAuthenticated={isLoggedIn} isClaiming={viewState === 'claiming'} />;
  }

  if (viewState === 'failed') {
    return <FailedScreen error={error} onRetry={handleRetry} />;
  }

  if (viewState === 'guest_locked') {
    return (
      <GuestMode
        onLoginClick={handleLoginClick}
        onBack={handleBack}
      />
    );
  }

  // ===============================
  // RESULT LAYOUT (Authenticated - Data dari polling)
  // ===============================
  return (
    <AuthenticatedMode
      taskResult={taskResult}
      viewState={viewState}
      onBackClick={handleBack}
    />
  );
}