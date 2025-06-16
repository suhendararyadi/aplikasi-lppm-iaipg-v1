// lib/supabase/admin.ts
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// PENTING: Client ini digunakan untuk operasi level admin dan hanya boleh digunakan di server.
// Client ini memerlukan environment variable SUPABASE_SERVICE_ROLE_KEY.
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in .env.local');
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
