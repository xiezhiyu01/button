// api/totals.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    const TABLE = 'Calls_Boring'; 
    const { data, error } = await supabase
      .from(TABLE)
      .select('count, protect');

    if (error) return res.status(500).json({ error });

    let totalCall = 0, totalProtect = 0;
    for (const row of data || []) {
      totalCall += Number(row.count || 0);
      totalProtect += Number(row.protect || 0);
    }
    res.status(200).json({ call: totalCall, protect: totalProtect });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected server error' });
  }
}
