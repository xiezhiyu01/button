// api/summary.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('calls')
    .select('name, count');

  if (error) return res.status(500).json({ error });

  const total = data.reduce((sum, row) => sum + row.count, 0);
  const counts = Object.fromEntries(
    data.map(row => [row.name, row.count])
  );

  res.status(200).json({ total, by_user: counts });
}
