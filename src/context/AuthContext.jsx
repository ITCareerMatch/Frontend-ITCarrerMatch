import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// 1. Buat Context di sini dan langsung di-export
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext({ session: null, loading: true });

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('access_token');
    return token ? { access_token: token } : null;
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          if (data?.session) {
            setSession(data.session);
            localStorage.setItem('access_token', data.session.access_token);
          } else {
            setSession(null);
          }
          setLoading(false);
        }
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        if (mounted) setLoading(false);
      }
    };

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession ?? null);
        if (newSession) {
          localStorage.setItem('access_token', newSession.access_token);
        } else {
          localStorage.removeItem('access_token');
          sessionStorage.clear();
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {loading && !localStorage.getItem('access_token') ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50/50">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <div className="text-sm font-semibold text-gray-500">Menyelaraskan sesi...</div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;