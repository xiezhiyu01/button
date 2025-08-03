import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      console.warn("Method not allowed:", req.method);
      return res.status(405).end();
    }

    console.log("Received request:", req.body);

    const { name } = req.body || {};
    if (!name) {
      console.error("Missing name in request body");
      return res.status(400).json({ error: 'Missing name' });
    }

    const { data, error: readError } = await supabase
      .from('calls')
      .select('count')
      .eq('name', name)
      .single();

    if (readError && readError.code !== 'PGRST116') {
      console.error("Supabase read error:", readError);
      return res.status(500).json({ error: readError });
    }

    const newCount = data ? data.count + 1 : 1;

    const { error: writeError } = await supabase
      .from('calls')
      .upsert([{ name, count: newCount }], { onConflict: 'name' });

    if (writeError) {
      console.error("Supabase write error:", writeError);
      return res.status(500).json({ error: writeError });
    }

    console.log(`Updated count for ${name}: ${newCount}`);
    return res.status(204).end();

  } catch (err) {
    console.error("Unexpected error in handler:", err);
    return res.status(500).json({ error: 'Unexpected server error' });
  }
}
