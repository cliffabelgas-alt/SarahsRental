'use client';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function Inquiry() {
  const { gowns, addRental } = useStore();
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    addRental({ customer: String(f.get('customer')), phone: String(f.get('phone')), eventDate: String(f.get('eventDate')), gownId: String(f.get('gownId')) });
    router.push('/rentals');
  }

  return (
    <div className="wrap">
      <h1>Customer inquiry</h1>
      <p className="muted">Record the customer and the gown they asked about. It starts a rental you can move through fitting, payment and return.</p>
      <form className="f" onSubmit={onSubmit}>
        <label>Customer name<input name="customer" required /></label>
        <label>Phone<input name="phone" type="tel" required /></label>
        <label>Event date<input name="eventDate" type="date" required /></label>
        <label>Gown
          <select name="gownId" required>
            {gowns.map((g) => <option key={g.id} value={g.id}>{g.code} {g.name} ({g.status})</option>)}
          </select>
        </label>
        <button className="btn">Save inquiry</button>
      </form>
    </div>
  );
}
