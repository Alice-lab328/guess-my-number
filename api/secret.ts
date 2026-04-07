import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { room_id, player_id, secret } = req.body;

  const { data: room } = await supabase.from('rooms').select('*').eq('id', room_id).single();
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const updates: any = {};
  if (player_id === room.host_id) {
    updates.host_secret = secret;
    if (room.guest_secret) updates.status = 'GAME';
    else updates.status = 'SET_SECRET';
  } else if (player_id === room.guest_id) {
    updates.guest_secret = secret;
    if (room.host_secret) updates.status = 'GAME';
    else updates.status = 'SET_SECRET';
  } else {
    return res.status(403).json({ error: 'Player not in room' });
  }

  const { error } = await supabase.from('rooms').update(updates).eq('id', room_id);
  
  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ success: true, status: updates.status || room.status });
}
