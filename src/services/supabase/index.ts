
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import env from '../../configs/vars';
const supabaseUrl: any = 'https://wnpukijoybwfgrpearge.supabase.co';
const supabaseKey: any = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InducHVraWpveWJ3ZmdycGVhcmdlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4MTE0MTYxOCwiZXhwIjoxOTk2NzE3NjE4fQ.FbASbStlBAL1QWq3GvU66r7vbnuhcOTcIdDEs3q8MgI';
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default supabase!;
