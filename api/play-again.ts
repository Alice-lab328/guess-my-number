import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { room_id } = req.body;
  
  await supabase.from('guesses').delete().eq('room_id', room_id);
  
  const { error } = await supabase.from('rooms').update({
    status: 'SET_SECRET',
    host_secret: null,
    guest_secret: null,
    winner_id: null,
    round: 1
  }).eq('id', room_id);

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json({ success: true });
}
