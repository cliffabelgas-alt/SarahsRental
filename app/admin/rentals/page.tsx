'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { STAGES, Stage, FIELDS, STATUS_FOR, num } from '@/lib/stages';
import type { Gown } from '@/lib/types';

type Row = {
  id: string; event_date: string; stage: Stage; notes: Record<string, string>;
  customers: { full_name: string; phone: string } | null;
  gowns: { id: string; code: string; name: string; price: number; deposit: number } | null;
};

function Card({ r, onAdvance }: { r: Row; onAdvance: (r: Row, value: string) => void }) {
  const [value, setValue] = useState(r.notes[r.stage] ?? '');
  const f = FIELDS[r.stage];
  const price = Number(r.gowns?.price ?? 0);
  const balance = price - num(r.notes.Reservation) - num(r.notes.Payment);
  return (
    <article className="card rental">
      <h3>{r.customers?.full_name} <span className="muted">{r.customers?.phone}</span></h3>
      <p className="muted">
        {r.gowns ? `${r.gowns.code} ${r.gowns.name}` : ''} &middot; Event {r.event_date} &middot; Price ₱{price.toLocaleString()} &middot;
        Deposit ₱{Number(r.gowns?.deposit ?? 0).toLocaleString()} &middot; Balance due ₱{balance.toLocaleString()}
      </p>
      <div className="stepper" aria-label={`Stage: ${r.stage}`}>
        {STAGES.map((s, i) => <span key={s} className={i < STAGES.indexOf(r.stage) ? 'done' : s === r.stage ? 'now' : ''}>{s}</span>)}
      </div>
      {r.stage === 'Available again' ? <p><span className="pill">Done. Gown is available again.</span></p> : (
        <div className="row">
          {f && (
            <label>{f.label}
              {f.type === 'select' ? (
                <select value={value} onChange={(e) => setValue(e.target.value)}>
                  <option value="">Choose</option>{f.options!.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : <input type={f.type} value={value} onChange={(e) => setValue(e.target.value)} />}
            </label>
          )}
          <button className="btn" disabled={!!f?.required && !value} onClick={() => onAdvance(r, value)}>Complete {r.stage.toLowerCase()}</button>
        </div>
      )}
    </article>
  );
}

export default function AdminRentals() {
  const [rows, setRows] = useState<Row[]>([]);
  const [gowns, setGowns] = useState<Gown[]>([]);
  const [filter, setFilter] = useState('All');
  const [msg, setMsg] = useState('');

  const load = useCallback(async () => {
    const [r, g] = await Promise.all([
      supabase.from('rentals').select('id,event_date,stage,notes,customers(full_name,phone),gowns(id,code,name,price,deposit)').order('event_date'),
      supabase.from('gowns').select('*').order('code'),
    ]);
    if (r.error || g.error) setMsg((r.error ?? g.error)!.message);
    setRows((r.data ?? []) as unknown as Row[]); setGowns((g.data ?? []) as Gown[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function advance(r: Row, value: string) {
    const next = STAGES[STAGES.indexOf(r.stage) + 1];
    if (!next) return;
    const { error } = await supabase.from('rentals').update({ stage: next, notes: { ...r.notes, [r.stage]: value } }).eq('id', r.id);
    if (error) { setMsg(error.message); return; }
    const status = STATUS_FOR[next];
    if (status && r.gowns) await supabase.from('gowns').update({ status }).eq('id', r.gowns.id);
    load();
  }

  async function addRental(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const c = await supabase.from('customers').insert({ full_name: String(f.get('customer')), phone: String(f.get('phone')) }).select('id').single();
    if (c.error) { setMsg(c.error.message); return; }
    const r = await supabase.from('rentals').insert({ customer_id: c.data.id, gown_id: String(f.get('gownId')), event_date: String(f.get('eventDate')) });
    if (r.error) { setMsg(r.error.message); return; }
    setMsg(''); form.reset(); load();
  }

  const shown = rows.filter((r) => filter === 'All' || r.stage === filter);
  return (
    <div className="wrap">
      <h1>Rentals</h1>
      <h2>New rental</h2>
      <form className="f" onSubmit={addRental}>
        <label>Customer name<input name="customer" required /></label>
        <label>Phone<input name="phone" type="tel" required /></label>
        <label>Event date<input name="eventDate" type="date" required /></label>
        <label>Gown<select name="gownId" required>{gowns.map((g) => <option key={g.id} value={g.id}>{g.code} {g.name} ({g.status})</option>)}</select></label>
        <button className="btn">Add rental</button>
      </form>
      {msg && <p role="alert" className="err">{msg}</p>}
      <label style={{ maxWidth: 260, marginBottom: '1.5rem' }}>Show stage
        <select value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option>{STAGES.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      {shown.length === 0 && <p className="muted">No rentals here yet.</p>}
      {shown.map((r) => <Card key={`${r.id}-${r.stage}`} r={r} onAdvance={advance} />)}
    </div>
  );
}
