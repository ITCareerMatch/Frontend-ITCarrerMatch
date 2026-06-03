import React, { useState, useEffect, useRef, useCallback } from 'react';
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
 * OPTIMASI: Hasil analisis disimpan di sessionStorage selama 30 menit.
 * Saat user kembali ke halaman (dalam 30 menit), hasil langsung ditampilkan tanpa polling.
 * Polling hanya terjadi saat pertama kali halaman dimuat atau saat upload CV baru.
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
  const initRef = useRef(false);

  // CEK HASIL TERSIMPAN SEBELUM RENDER
  // Jika ada hasil (belum expired 30 menit), langsung tampilkan tanpa polling
  const savedResult = CVStorage.getResult();
  const hasSavedResult = savedResult !== null;

  // UI States - Jika ada saved result,langsung set ke 'result'
  const [viewState, setViewState] = useState(hasSavedResult ? 'result' : 'loading');
  const [taskResult, setTaskResult] = useState(savedResult);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearTimeout(pollingRef.current);
    };
  }, []);

  // MARKER: Jika ada saved result, jangan pernah poll
  // Ini mencegah polling terjadi meskipun ada perubahan state lain
  useEffect(() => {
    if (hasSavedResult && !initRef.current) {
      initRef.current = true;
      console.log('[Result] Using saved result (30 min cache)');
      setTaskResult(savedResult);
      setViewState('result');
    }
  }, [hasSavedResult, savedResult]);

  // ===============================
  // POLLING FUNCTION
  // ===============================
  const pollTask = useCallback(async (taskId) => {
    // JANGAN POLL JIKA SUDAH PUNYA HASIL
    if (CVStorage.getResult()) {
      console.log('[Poll] Aborted - result already exists');
      return;
    }

    let attempts = 0;
    const MAX = 30;

    setViewState('polling');
    setCurrentStep(0);

    const poll = async () => {
      // Double-check sebelum setiap polling attempt
      const currentSaved = CVStorage.getResult();
      if (currentSaved) {
        console.log('[Poll] Aborted mid-poll - result appeared');
        setTaskResult(currentSaved);
        setViewState('result');
        return;
      }

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
          const finalResult = result?.result || null;
          setTaskResult(finalResult);
          // Save result to storage
          CVStorage.saveResult(finalResult);
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
  // CLAIM & POLL FUNCTION
  // ===============================
  const claimAndPoll = useCallback(async (tempToken) => {
    // JANGAN CLAIM JIKA SUDAH PUNYA HASIL
    if (CVStorage.getResult()) {
      console.log('[Claim] Aborted - result already exists');
      return;
    }

    setViewState('claiming');
    setCurrentStep(0);

    try {
      const taskId = await claimCVSession(token, tempToken);

      if (taskId) {
        CVStorage.clear();
        await pollTask(taskId);
        window.history.replaceState(null, '', `/analisis-result?mode=authenticated&taskId=${taskId}`);
      } else {
        throw new Error('Server tidak mengembalikan task_id');
      }
    } catch (err) {
      console.error('[Claim] Error:', err.message);
      setError(err.message);
      setViewState('failed');
    }
  }, [token, pollTask]);

  // ===============================
  // MAIN LOADING EFFECT
  // ===============================
  useEffect(() => {
    // ========================================
    // BLOK UTAMA: JANGAN JALankan JIKA ADA HASIL
    // ========================================
    if (CVStorage.getResult()) {
      console.log('[Load] Skipped - result already cached');
      return;
    }

    // Jika sudah diinisialisasi, skip
    if (initRef.current) {
      return;
    }

    const loadData = async () => {
      initRef.current = true;

      // Double-check sebelum load
      if (CVStorage.getResult()) {
        console.log('[Load] Aborted after init check');
        return;
      }

      // Parse URL params
      const params = new URLSearchParams(location.search);
      const mode = params.get('mode');
      const taskIdParam = params.get('taskId');
      const tempTokenParam = params.get('tempToken');

      try {
        // FLOW C: Authenticated NewAnalysis
        if (mode === 'authenticated' && taskIdParam && isLoggedIn) {
          await pollTask(taskIdParam);
          return;
        }

        // FLOW B: TempToken di URL + user login
        if (tempTokenParam && isLoggedIn) {
          await claimAndPoll(tempTokenParam);
          return;
        }

        // Cek guest session di storage
        const guestSession = CVStorage.getGuestSession();

        // FLOW B (legacy): Guest session + user login
        if (isLoggedIn && guestSession?.temp_token) {
          await claimAndPoll(guestSession.temp_token);
          return;
        }

        // FLOW A: Guest sees locked preview
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
        console.error('[Load] Error:', err.message);
        setError(err.message);
        setViewState('failed');
      }
    };

    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // DEPENDENCY KOSONG - hanya jalan sekali saat mount

  // ===============================
  // HANDLERS
  // ===============================
  const handleLoginClick = () => {
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
  // JIKA SUDAH PUNYA HASIL, LANGSUNG TAMPILKAN
  if (viewState === 'result' && taskResult) {
    return (
      <AuthenticatedMode
        taskResult={taskResult}
        viewState={viewState}
        onBackClick={handleBack}
      />
    );
  }

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

  // Fallback
  return (
    <AuthenticatedMode
      taskResult={taskResult}
      viewState={viewState}
      onBackClick={handleBack}
    />
  );
}