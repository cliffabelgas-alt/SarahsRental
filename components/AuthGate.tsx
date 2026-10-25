'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGate({ children }: { children: ReactNode }) {
  const [state, setState] = useState<'loading' | 'in' | 'out'>('loading');
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState(data.session ? 'in' : 'out'));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setState(s ? 'in' : 'out'));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (state === 'out') router.replace('/login'); }, [state, router]);

  if (state !== 'in') return <p className="wrap muted">Checking sign-in…</p>;
  return <>{children}</>;
}
