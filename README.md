# Sarah's Gown Rental

Next.js (App Router, TypeScript). Data is stored in the browser's localStorage, so no database is needed to start.

    npm install
    npm run dev      # http://localhost:3000

Pages: `/` homepage (gowns from Supabase), `/inquiry`, `/login`, `/admin`.
Rental flow: Inquiry, Fitting, Reservation, Payment, Alteration, Pickup, Rental period, Return, Inspection, Cleaning, Available again.
Gown status updates automatically as a rental moves through these stages.

## Supabase
Copy `.env.local.example` to `.env.local` and fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
Import the client with `import { supabase } from '@/lib/supabase'`. Restart `npm run dev` after changing env vars.

## Admin
1. Supabase > Authentication > Users > Add user (tick auto-confirm), and turn OFF "Allow new users to sign up" in Sign In / Providers.
2. Allow that email to edit data (SQL editor): `insert into public.admins (email) values ('you@example.com');` (lowercase)
3. Sign in at `/login`, then use `/admin`, `/admin/inventory`, `/admin/rentals`.
Gown photos upload to the public `gown-images` storage bucket.
