'use client';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Gown, GownStatus, GOWN_STATUSES } from '@/lib/types';

const blank = { code: '', name: '', size: '', color: '', occasion: '', description: '', price: '', deposit: '', featured: false };

export default function AdminInventory() {
  const [gowns, setGowns] = useState<Gown[]>([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState<Gown | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from('gowns').select('*').order('code');
    if (error) setMsg(error.message); else setGowns(data as Gown[]);
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof blank, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));
  function reset() { setForm(blank); setEditing(null); setFile(null); setFileKey((k) => k + 1); }
  function startEdit(g: Gown) {
    setEditing(g); setFile(null); setMsg('');
    setForm({ code: g.code, name: g.name, size: g.size, color: g.color, occasion: g.occasion, description: g.description ?? '', price: String(g.price), deposit: String(g.deposit), featured: g.featured });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg('');
    let image_url = editing?.image_url ?? null;
    if (file) {
      const path = `${crypto.randomUUID()}.${file.name.split('.').pop() || 'jpg'}`;
      const up = await supabase.storage.from('gown-images').upload(path, file, { contentType: file.type });
      if (up.error) { setMsg(up.error.message); setBusy(false); return; }
      image_url = supabase.storage.from('gown-images').getPublicUrl(path).data.publicUrl;
    }
    const row = {
      code: form.code.trim(), name: form.name.trim(), size: form.size.trim(), color: form.color.trim(), occasion: form.occasion.trim(),
      description: form.description.trim() || null, price: Number(form.price), deposit: Number(form.deposit), featured: form.featured, image_url,
    };
    const res = editing ? await supabase.from('gowns').update(row).eq('id', editing.id) : await supabase.from('gowns').insert(row);
    setBusy(false);
    if (res.error) { setMsg(res.error.message); return; }
    reset(); load();
  }

  async function setStatus(id: string, status: GownStatus) {
    const { error } = await supabase.from('gowns').update({ status }).eq('id', id);
    if (error) setMsg(error.message); else load();
  }
  async function remove(g: Gown) {
    if (!confirm(`Delete ${g.code} ${g.name}?`)) return;
    const { error } = await supabase.from('gowns').delete().eq('id', g.id);
    if (error) setMsg(error.message.includes('foreign key') ? 'This gown has rentals and cannot be deleted. Set its status to Repair instead.' : error.message);
    else load();
  }

  return (
    <div className="wrap">
      <h1>Inventory</h1>
      <h2>{editing ? `Edit ${editing.code}` : 'Add a gown'}</h2>
      <form className="f" onSubmit={onSubmit}>
        <label>Code<input value={form.code} onChange={(e) => set('code', e.target.value)} placeholder="SR-004" required /></label>
        <label>Name<input value={form.name} onChange={(e) => set('name', e.target.value)} required /></label>
        <label>Size<input value={form.size} onChange={(e) => set('size', e.target.value)} required /></label>
        <label>Color<input value={form.color} onChange={(e) => set('color', e.target.value)} required /></label>
        <label>Occasion<input value={form.occasion} onChange={(e) => set('occasion', e.target.value)} required /></label>
        <label>Rental price (₱)<input type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} required /></label>
        <label>Deposit (₱)<input type="number" min="0" value={form.deposit} onChange={(e) => set('deposit', e.target.value)} required /></label>
        <label>Description shown on homepage<textarea rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} /></label>
        <label>Photo<input key={fileKey} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>
        <label><span><input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} /> Show first on homepage</span></label>
        <div className="row">
          <button className="btn" disabled={busy}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Add gown'}</button>
          {editing && <button type="button" className="btn alt" onClick={reset}>Cancel</button>}
        </div>
      </form>
      {msg && <p role="alert" className="err">{msg}</p>}
      <div className="table-scroll"><table>
        <thead><tr><th>Photo</th><th>Code</th><th>Gown</th><th>Size</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>{gowns.map((g) => (
          <tr key={g.id}>
            <td>{g.image_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img className="thumb" src={g.image_url} alt={g.name} /> : <span className="muted">None</span>}</td>
            <td>{g.code}</td><td>{g.name}{g.featured && <> <span className="pill">Featured</span></>}<div className="muted">{g.occasion}, {g.color}</div></td>
            <td>{g.size}</td><td>₱{Number(g.price).toLocaleString()}<div className="muted">Deposit ₱{Number(g.deposit).toLocaleString()}</div></td>
            <td><select aria-label={`Status of ${g.code}`} value={g.status} onChange={(e) => setStatus(g.id, e.target.value as GownStatus)}>
              {GOWN_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></td>
            <td><div className="row"><button className="btn alt" onClick={() => startEdit(g)}>Edit</button><button className="btn alt" onClick={() => remove(g)}>Delete</button></div></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
