// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rjlbamigkgdltlqgdhak.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJqbGJhbWlna2dkbHRscWdkaGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjY0MzAsImV4cCI6MjA2NzA0MjQzMH0.nj1-dKqS0LGy7JMhwKaOasbLqz0VJqiPdUnr06jA8gs';

export const supabase = createClient(supabaseUrl, supabaseKey);
