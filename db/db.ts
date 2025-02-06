import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase'; // Adjust path as needed
import { join } from 'path';

import 'dotenv/config'



import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js/driver';
import postgres from 'postgres';

config({ path: '.env' }); // or .env.local

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle({ client });
const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


// export async function getListings() {
//   const listings = await db.select().from(activeListings)
// }