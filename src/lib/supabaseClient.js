import { createClient } from '@supabase/supabase-js';

// Create a .env file in the project root with these two values
// (find them in Supabase → Settings → API):
//
// VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
// VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
