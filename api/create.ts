import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { host_id, host_nickname, host_avatar } = req.body;
  const roomId = Math.random().toString(36).substring(2, 6).toUpperCase();
  
  const { error } = await supabase.from('rooms').insert([{
    id: roomId,
    status: 'LOBBY',
    host_id,
    host_nickname,
    host_avatar,
  }]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ roomId });
}
