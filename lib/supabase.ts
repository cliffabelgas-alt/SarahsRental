import { createClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_ variables must be referenced literally (not via process.env[name])
// so Next.js can inline them into the browser bundle.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  throw new Error(
    'Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart `npm run dev`.'
  );
}

export const supabase = createClient(url, anonKey);
