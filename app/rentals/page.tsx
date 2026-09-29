'use client';
import { useState } from 'react';
import { useStore, STAGES, Stage, Rental, Gown } from '@/lib/store';

type Field = { type: 'text' | 'date' | 'number' | 'select'; label: string; required: boolean; options?: string[] };
const FIELDS: Partial<Record<Stage, Field>> = {
  Inquiry: { type: 'text', label: 'Style, size and budget notes', required: false },
  Fitting: { type: 'date', label: 'Fitting appointment date', required: true },
  Reservation: { type: 'number', label: 'Reservation fee received (₱)', required: true },
  Payment: { type: 'number', label: 'Balance paid (₱)', required: true },
  Alteration: { type: 'text', label: 'Alterations done (pins, hem, straps)', required: false },
  Pickup: { type: 'date', label: 'Pickup date (rental period starts)', required: true },
  'Rental period': { type: 'date', label: 'Return due date', required: true },
  Return: { type: 'date', label: 'Date returned', required: true },
  Inspection: { type: 'select', label: 'Inspection result', required: true, options: ['No issues', 'Normal wear', 'Damage: deduct from deposit'] },
  Cleaning: { type: 'text', label: 'Cleaning and repair notes', required: false },
};

const num = (v?: string) => Number(v) || 0;

function RentalCard({ r, gown }: { r: Rental; gown?: Gown }) {
  const { setNote, advance } = useStore();
  const f = FIELDS[r.stage];
  const value = r.notes[r.stage] ?? '';
  const balance = gown ? gown.price - num(r.notes.Reservation) - num(r.notes.Payment) : 0;
  const last = r.stage === 'Available again';

  return (
    <article className="card rental">
      <h3>{r.customer} <span className="muted">{r.phone}</span></h3>
      <p className="muted">
        {gown ? `${gown.code} ${gown.name}` : 'Gown removed'} &middot; Event {r.eventDate}
        {gown && <> &middot; Price ₱{gown.price.toLocaleString()} &middot; Deposit ₱{gown.deposit.toLocaleString()} &middot; Balance due ₱{balance.toLocaleString()}</>}
      </p>
      <div className="stepper" aria-label={`Stage: ${r.stage}`}>
        {STAGES.map((s, i) => <span key={s} className={i < STAGES.indexOf(r.stage) ? 'done' : s === r.stage ? 'now' : ''}>{s}</span>)}
      </div>
      {last ? <p><span className="pill">Done. Gown is available again.</span></p> : (
        <div className="row">
          {f && (
            <label>{f.label}
              {f.type === 'select' ? (
                <select value={value} onChange={(e) => setNote(r.id, r.stage, e.target.value)}>
                  <option value="">Choose</option>
                  {f.options!.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : <input type={f.type} value={value} onChange={(e) => setNote(r.id, r.stage, e.target.value)} />}
            </label>
          )}
          <button className="btn" disabled={!!f?.required && !value} onClick={() => advance(r.id)}>
            Complete {r.stage.toLowerCase()}
          </button>
        </div>
      )}
    </article>
  );
}

export default function Rentals() {
  const { rentals, gowns, ready } = useStore();
  const [filter, setFilter] = useState('All');
  const shown = rentals.filter((r) => filter === 'All' || r.stage === filter);

  return (
    <div className="wrap">
      <h1>Rentals</h1>
      <label style={{ maxWidth: 260, marginBottom: '1.5rem' }}>Show stage
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>{STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      {ready && shown.length === 0 && <p className="muted">No rentals here yet. Start one from the Inquiry page.</p>}
      {shown.map((r) => <RentalCard key={r.id} r={r} gown={gowns.find((g) => g.id === r.gownId)} />)}
    </div>
  );
}
