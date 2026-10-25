export const GOWN_STATUSES = ['Available', 'Reserved', 'Rented out', 'Cleaning', 'Repair'] as const;
export type GownStatus = (typeof GOWN_STATUSES)[number];
export type Gown = {
  id: string; code: string; name: string; size: string; color: string; occasion: string;
  description: string | null; price: number; deposit: number; status: GownStatus;
  image_url: string | null; featured: boolean;
};
