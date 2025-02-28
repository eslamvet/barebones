import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

//create supabase client without authentication
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
