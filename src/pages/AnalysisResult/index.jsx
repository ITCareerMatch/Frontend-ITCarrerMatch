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

  // UI States
  const [viewState, setViewState] = useState('loading');
  const [taskResult, setTaskResult] = useState(null); // Data dari /cv/status/{task_id}
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
    setCurrentStep(0);

    const poll = async () => {
      if (attempts >= MAX) {
        setViewState('failed');
        setError('Waktu tunggu habis. Silakan coba lagi.');
        return;
      }

      try {
        console.log(`[pollTask] Attempt ${attempts + 1}: Checking status for taskId:`, taskId);
        const result = await checkCVStatus(token, taskId);
        console.log(`[pollTask] Response:`, result);

        const status = result?.status;
        setCurrentStep(Math.min(attempts, 4));

        if (status === 'completed') {
          console.log(`[pollTask] Analysis completed! Result:`, result?.result);
          // Simpan result dari polling
          setTaskResult(result?.result || null);
          setViewState('result');
          // Clear storage after getting result
          CVStorage.clear();
          return;
        }

        if (status === 'failed') {
          console.log(`[pollTask] Analysis failed:`, result?.result);
          setViewState('failed');
          setError(result?.result?.message || 'Analisis CV gagal.');
          return;
        }

        console.log(`[pollTask] Still processing... status:`, status);
        attempts++;
        pollingRef.current = setTimeout(poll, 3000);
      } catch (err) {
        console.error(`[pollTask] Error on attempt ${attempts + 1}:`, err.message);
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
      console.log(`[claimAndPoll] Claiming session with tempToken:`, tempToken);
      // POST /cv/claim dengan temp_token
      // claimCVSession sudah return task_id langsung
      const taskId = await claimCVSession(token, tempToken);
      console.log(`[claimAndPoll] Got taskId:`, taskId);

      if (taskId) {
        // Clear storage sebelum navigate
        CVStorage.clear();

        // Navigate ke URL dengan taskId
        navigate(`/analisis-result?mode=authenticated&taskId=${taskId}`, { replace: true });

        // Poll status dengan task_id yang didapat dari claim
        await pollTask(taskId);
      } else {
        throw new Error('Server tidak mengembalikan task_id');
      }
    } catch (err) {
      console.error('[claimAndPoll] Error:', err.message);
      setError(err.message);
      setViewState('failed');
    }
  }, [token, pollTask, navigate]);

  // ===============================
  // MAIN LOADING EFFECT
  // ===============================
  useEffect(() => {
    const loadData = async () => {
      setViewState('loading');

      // Parse URL params
      const params = new URLSearchParams(location.search);
      const mode = params.get('mode');
      const taskIdParam = params.get('taskId');
      const tempTokenParam = params.get('tempToken');

      try {
        // FLOW C: Authenticated NewAnalysis - langsung polling dengan taskId dari URL
        if (mode === 'authenticated' && taskIdParam && isLoggedIn) {
          await pollTask(taskIdParam);
          return;
        }

        // FLOW B: Ada tempToken di URL dan user sudah login → langsung claim
        if (tempTokenParam && isLoggedIn) {
          // claimAndPoll akan navigate ke URL dengan taskId
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
  }, [token, location.search, isLoggedIn, navigate, pollTask, claimAndPoll]);

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
      taskResult={taskResult} // Kirim result dari polling, bukan dari storage
      onBackClick={handleBack}
    />
  );
}
