'use client';
import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Gown } from '@/lib/types';

export default function Inquiry() {
  const [gowns, setGowns] = useState<Gown[]>([]);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    supabase.from('gowns').select('*').order('code').then(({ data }) => setGowns((data ?? []) as Gown[]));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const { error } = await supabase.rpc('submit_inquiry', {
      p_name: String(f.get('customer')), p_phone: String(f.get('phone')),
      p_event_date: String(f.get('eventDate')), p_gown_id: String(f.get('gownId')),
    });
    if (error) setMsg({ ok: false, text: 'Sorry, we could not send that. Please check your details and try again.' });
    else { setMsg({ ok: true, text: 'Thank you! We received your inquiry and will contact you soon.' }); form.reset(); }
  }

  return (
    <div className="wrap">
      <h1>Ask about a gown</h1>
      <p className="muted">Tell us the gown and your event date. We will confirm availability and set up a fitting.</p>
      <form className="f" onSubmit={onSubmit}>
        <label>Your name<input name="customer" maxLength={100} required /></label>
        <label>Phone<input name="phone" type="tel" minLength={5} maxLength={30} required /></label>
        <label>Event date<input name="eventDate" type="date" required /></label>
        <label>Gown
          <select name="gownId" required>
            {gowns.map((g) => <option key={g.id} value={g.id}>{g.name} (size {g.size})</option>)}
          </select>
        </label>
        <button className="btn">Send inquiry</button>
      </form>
      {msg && <p role="status" className={msg.ok ? 'ok' : 'err'}>{msg.text}</p>}
    </div>
  );
}
