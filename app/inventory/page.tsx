'use client';
import { FormEvent } from 'react';
import { useStore, GownStatus } from '@/lib/store';

const STATUSES: GownStatus[] = ['Available', 'Reserved', 'Rented out', 'Cleaning', 'Repair'];

export default function Inventory() {
  const { gowns, addGown, setGownStatus } = useStore();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    addGown({
      code: String(f.get('code')), name: String(f.get('name')), size: String(f.get('size')),
      color: String(f.get('color')), occasion: String(f.get('occasion')),
      price: Number(f.get('price')), deposit: Number(f.get('deposit')),
    });
    e.currentTarget.reset();
  }

  return (
    <div className="wrap">
      <h1>Inventory</h1>
      <form className="f" onSubmit={onSubmit}>
        <label>Code<input name="code" placeholder="SR-004" required /></label>
        <label>Name<input name="name" required /></label>
        <label>Size<input name="size" required /></label>
        <label>Color<input name="color" required /></label>
        <label>Occasion<input name="occasion" required /></label>
        <label>Rental price (₱)<input name="price" type="number" min="0" required /></label>
        <label>Deposit (₱)<input name="deposit" type="number" min="0" required /></label>
        <button className="btn">Add gown</button>
      </form>
      <div className="table-scroll">
        <table>
          <thead><tr><th>Code</th><th>Gown</th><th>Size</th><th>Occasion</th><th>Price</th><th>Deposit</th><th>Status</th></tr></thead>
          <tbody>
            {gowns.map((g) => (
              <tr key={g.id}>
                <td>{g.code}</td><td>{g.name} <span className="muted">({g.color})</span></td><td>{g.size}</td><td>{g.occasion}</td>
                <td>₱{g.price.toLocaleString()}</td><td>₱{g.deposit.toLocaleString()}</td>
                <td>
                  <select aria-label={`Status of ${g.code}`} value={g.status} onChange={(e) => setGownStatus(g.id, e.target.value as GownStatus)}>
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
