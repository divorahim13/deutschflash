import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zxguvfhzbvosghduyipk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4Z3V2Zmh6YnZvc2doZHV5aXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyODg2NDMsImV4cCI6MjA5MTg2NDY0M30.-csy2P3Iz3G7MFOl2cXnpXV15LU_1kWfD-fkTycRccU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const { data, error } = await supabase.from('cards').select('*').limit(1);
  console.log('Error:', error);
  console.log('Data:', data);
}

testQuery();
