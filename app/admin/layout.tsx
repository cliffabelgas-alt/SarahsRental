'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthGate from '@/components/AuthGate';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <AuthGate>
      <div className="admin-nav">
        <Link href="/admin">Dashboard</Link>
        <Link href="/admin/inventory">Inventory</Link>
        <Link href="/admin/rentals">Rentals</Link>
        <button className="btn alt" onClick={async () => { await supabase.auth.signOut(); router.push('/login'); }}>Sign out</button>
      </div>
      {children}
    </AuthGate>
  );
}
