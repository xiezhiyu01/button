// api/call.js
import { createClient } from '@supabase/supabase-js';
import getRawBody from 'raw-body';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const config = {
  api: {
    bodyParser: false // ⛔️ 禁用自动解析，手动处理 JSON
  }
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      console.log('❌ Method not allowed:', req.method);
      return res.status(405).end();
    }

    const rawBody = await getRawBody(req);
    const { name } = JSON.parse(rawBody.toString());

    if (!name) {
      console.log('❌ Missing name');
      return res.status(400).json({ error: 'Missing name' });
    }

    const { data, error: readError } = await supabase
      .from('Calls_Boring')
      .select('count')
      .eq('name', name)
      .single();

    if (readError && readError.code !== 'PGRST116') {
      console.log('❌ Supabase read error:', readError);
      return res.status(500).json({ error: readError });
    }

    const newCount = data ? data.count + 1 : 1;

    const { error: writeError } = await supabase
      .from('calls')
      .upsert([{ name, count: newCount }], { onConflict: 'name' });

    if (writeError) {
      console.log('❌ Supabase write error:', writeError);
      return res.status(500).json({ error: writeError });
    }

    console.log(`✅ ${name} called, new count: ${newCount}`);
    return res.status(204).end();

  } catch (err) {
    console.log('🔥 Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
