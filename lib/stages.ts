import type { GownStatus } from './types';

export const STAGES = ['Inquiry','Fitting','Reservation','Payment','Alteration','Pickup','Rental period','Return','Inspection','Cleaning','Available again'] as const;
export type Stage = (typeof STAGES)[number];

export type Field = { type: 'text' | 'date' | 'number' | 'select'; label: string; required: boolean; options?: string[] };
export const FIELDS: Partial<Record<Stage, Field>> = {
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

// Gown status that follows each stage. Inquiry and Fitting leave the gown untouched.
export const STATUS_FOR: Partial<Record<Stage, GownStatus>> = {
  Reservation: 'Reserved', Payment: 'Reserved', Alteration: 'Reserved', Pickup: 'Reserved',
  'Rental period': 'Rented out', Return: 'Rented out', Inspection: 'Cleaning', Cleaning: 'Cleaning', 'Available again': 'Available',
};
export const num = (v?: string) => Number(v) || 0;
