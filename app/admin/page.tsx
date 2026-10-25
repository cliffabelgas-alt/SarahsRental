'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { STAGES, Stage, num } from '@/lib/stages';

type R = { id: string; event_date: string; stage: Stage; notes: Record<string, string>; customers: { full_name: string } | null; gowns: { code: string; name: string; price: number } | null };
const peso = (n: number) => `₱${n.toLocaleString()}`;

export default function Dashboard() {
  const [rentals, setRentals] = useState<R[]>([]);
  const [gowns, setGowns] = useState<{ status: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      supabase.from('rentals').select('id,event_date,stage,notes,customers(full_name),gowns(code,name,price)'),
      supabase.from('gowns').select('status'),
    ]).then(([r, g]) => {
      if (r.error || g.error) setError((r.error ?? g.error)!.message);
      setRentals((r.data ?? []) as unknown as R[]);
      setGowns(g.data ?? []);
    });
  }, []);

  const active = rentals.filter((r) => r.stage !== 'Available again');
  const collected = rentals.reduce((s, r) => s + num(r.notes.Reservation) + num(r.notes.Payment), 0);
  const booked = active.reduce((s, r) => s + Number(r.gowns?.price ?? 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = active.filter((r) => r.event_date >= today).sort((a, b) => a.event_date.localeCompare(b.event_date)).slice(0, 8);

  return (
    <div className="wrap">
      <h1>Dashboard</h1>
      {error && <p role="alert" className="err">{error}</p>}
      <div className="stats">
        <div className="stat"><b>{gowns.length}</b>Gowns in inventory</div>
        <div className="stat"><b>{gowns.filter((g) => g.status === 'Available').length}</b>Available now</div>
        <div className="stat"><b>{active.length}</b>Active rentals</div>
        <div className="stat"><b>{peso(booked)}</b>Booked rental value</div>
        <div className="stat"><b>{peso(collected)}</b>Collected so far</div>
      </div>
      <h2>Rentals by stage</h2>
      <div className="table-scroll"><table>
        <thead><tr><th>Stage</th><th>Rentals</th></tr></thead>
        <tbody>{STAGES.map((s) => <tr key={s}><td>{s}</td><td>{rentals.filter((r) => r.stage === s).length}</td></tr>)}</tbody>
      </table></div>
      <h2 style={{ marginTop: '2rem' }}>Upcoming events</h2>
      {upcoming.length === 0 ? <p className="muted">No upcoming events.</p> : (
        <div className="table-scroll"><table>
          <thead><tr><th>Event date</th><th>Customer</th><th>Gown</th><th>Stage</th></tr></thead>
          <tbody>{upcoming.map((r) => (
            <tr key={r.id}><td>{r.event_date}</td><td>{r.customers?.full_name}</td><td>{r.gowns ? `${r.gowns.code} ${r.gowns.name}` : ''}</td><td>{r.stage}</td></tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
