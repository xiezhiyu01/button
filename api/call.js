// api/call.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name } = await req.json();
  if (!name) return res.status(400).json({ error: 'Missing name' });

  // 查询当前点击数
  const { data, error: readError } = await supabase
    .from('calls')
    .select('count')
    .eq('name', name)
    .single();

  const newCount = data ? data.count + 1 : 1;

  // 插入或更新
  const { error: writeError } = await supabase
    .from('calls')
    .upsert(
      [{ name, count: newCount }],
      { onConflict: 'name' }  // 依赖 name 是 unique
    );

  if (writeError) return res.status(500).json({ error: writeError });
  return res.status(204).end(); // 无反馈（保持神秘）
}
