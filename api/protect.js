// api/protect.js
import { createClient } from '@supabase/supabase-js';
import getRawBody from 'raw-body';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).end();

    const raw = await getRawBody(req);
    const { name } = JSON.parse(raw.toString() || '{}');
    if (!name) return res.status(400).json({ error: 'Missing name' });

    const TABLE = 'Calls_Boring'; 

    // 读出现有计数
    const { data, error: readError } = await supabase
      .from(TABLE)
      .select('count, protect')
      .eq('name', name)
      .single();

    if (readError && readError.code !== 'PGRST116') {
      console.log('read error:', readError);
      return res.status(500).json({ error: readError });
    }

    const newProtect = (data?.protect ?? 0) + 1;
    const currentCount = data?.count ?? 0;

    // 写回（upsert）
    const { error: writeError } = await supabase
      .from(TABLE)
      .upsert([{ name, count: currentCount, protect: newProtect }], { onConflict: 'name' });

    if (writeError) {
      console.log('write error:', writeError);
      return res.status(500).json({ error: writeError });
    }

    return res.status(204).end();
  } catch (e) {
    console.log('unexpected:', e);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
