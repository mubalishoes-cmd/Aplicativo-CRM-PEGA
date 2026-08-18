import { useState, useEffect } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabaseClient';

// Cuida de verificar a sessão atual e ouvir mudanças de login/logout.
// O componente que usa este hook não precisa saber como o Supabase Auth funciona.
export function useAuth() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, authLoading };
}
