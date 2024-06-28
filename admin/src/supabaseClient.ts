import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://czavvhluawsifnoyvywv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6YXZ2aGx1YXdzaWZub3l2eXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5NjMzMDgsImV4cCI6MjAzMTUzOTMwOH0.bIL-wI_gzJj6cZGNidbpV8_TyxG6m7gXZF08AxFF3MU';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
