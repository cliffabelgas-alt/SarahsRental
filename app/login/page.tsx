'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const { error } = await supabase.auth.signInWithPassword({ email: String(f.get('email')), password: String(f.get('password')) });
    if (error) setError(error.message); else router.push('/admin');
  }

  return (
    <div className="wrap" style={{ maxWidth: 440 }}>
      <h1>Admin login</h1>
      <form className="f" style={{ gridTemplateColumns: '1fr' }} onSubmit={onSubmit}>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
        <button className="btn">Sign in</button>
      </form>
      {error && <p role="alert" className="err">{error}</p>}
    </div>
  );
}
