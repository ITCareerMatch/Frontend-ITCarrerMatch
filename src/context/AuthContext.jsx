import React, { useEffect, useState } from 'react';
import AuthContext from './authContext';
import { supabase } from '../lib/supabase';

const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('access_token');
    return token ? { access_token: token } : null;
  });
  const [loading, setLoading] = useState(() => {
    return !localStorage.getItem('access_token');
  });

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (mounted) {
          setSession(data?.session ?? null);
          setLoading(false);
        }
      } catch {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (mounted) {
        setSession(newSession ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;