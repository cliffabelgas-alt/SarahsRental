'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export const STAGES = ['Inquiry','Fitting','Reservation','Payment','Alteration','Pickup','Rental period','Return','Inspection','Cleaning','Available again'] as const;
export type Stage = (typeof STAGES)[number];
export type GownStatus = 'Available' | 'Reserved' | 'Rented out' | 'Cleaning' | 'Repair';
export type Gown = { id: string; code: string; name: string; size: string; color: string; occasion: string; price: number; deposit: number; status: GownStatus };
export type Rental = { id: string; customer: string; phone: string; eventDate: string; gownId: string; stage: Stage; notes: Partial<Record<Stage, string>> };

// Gown status follows the rental stage. Inquiry and Fitting leave the gown untouched.
const STATUS_FOR: Partial<Record<Stage, GownStatus>> = {
  Reservation: 'Reserved', Payment: 'Reserved', Alteration: 'Reserved', Pickup: 'Reserved',
  'Rental period': 'Rented out', Return: 'Rented out', Inspection: 'Cleaning', Cleaning: 'Cleaning', 'Available again': 'Available',
};

const uid = () => Math.random().toString(36).slice(2, 8);
const SEED: Gown[] = [
  { id: 'g1', code: 'SR-001', name: 'Ivory Lace Ball Gown', size: 'M', color: 'Ivory', occasion: 'Wedding', price: 4500, deposit: 2000, status: 'Available' },
  { id: 'g2', code: 'SR-002', name: 'Midnight Satin Mermaid', size: 'S', color: 'Navy', occasion: 'Debut', price: 3500, deposit: 1500, status: 'Available' },
  { id: 'g3', code: 'SR-003', name: 'Blush Tulle A-line', size: 'L', color: 'Blush', occasion: 'Prom', price: 2800, deposit: 1200, status: 'Available' },
];

type Store = {
  ready: boolean; gowns: Gown[]; rentals: Rental[];
  addGown: (g: Omit<Gown, 'id' | 'status'>) => void;
  setGownStatus: (id: string, s: GownStatus) => void;
  addRental: (r: Omit<Rental, 'id' | 'stage' | 'notes'>) => void;
  setNote: (id: string, stage: Stage, v: string) => void;
  advance: (id: string) => void;
};
const Ctx = createContext<Store | null>(null);
export const useStore = () => { const c = useContext(Ctx); if (!c) throw new Error('StoreProvider missing'); return c; };

export function StoreProvider({ children }: { children: ReactNode }) {
  const [gowns, setGowns] = useState<Gown[]>(SEED);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('sarahs-rental');
      if (raw) { const d = JSON.parse(raw); setGowns(d.gowns); setRentals(d.rentals); }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) localStorage.setItem('sarahs-rental', JSON.stringify({ gowns, rentals }));
  }, [gowns, rentals, ready]);

  const setGownStatus = (id: string, s: GownStatus) => setGowns((p) => p.map((g) => (g.id === id ? { ...g, status: s } : g)));
  const store: Store = {
    ready, gowns, rentals, setGownStatus,
    addGown: (g) => setGowns((p) => [...p, { ...g, id: uid(), status: 'Available' }]),
    addRental: (r) => setRentals((p) => [...p, { ...r, id: uid(), stage: 'Inquiry', notes: {} }]),
    setNote: (id, stage, v) => setRentals((p) => p.map((r) => (r.id === id ? { ...r, notes: { ...r.notes, [stage]: v } } : r))),
    advance: (id) => {
      const r = rentals.find((x) => x.id === id);
      const next = r && STAGES[STAGES.indexOf(r.stage) + 1];
      if (!r || !next) return;
      setRentals((p) => p.map((x) => (x.id === id ? { ...x, stage: next } : x)));
      const s = STATUS_FOR[next];
      if (s) setGownStatus(r.gownId, s);
    },
  };
  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}
