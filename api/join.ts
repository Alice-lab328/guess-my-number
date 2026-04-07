import { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { room_id, guest_id, guest_nickname, guest_avatar } = req.body;

  const { data: room, error: fetchError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', room_id)
    .single();

  if (fetchError || !room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  if (room.guest_id && room.guest_id !== guest_id) {
    return res.status(400).json({ error: 'Room is full' });
  }

  const { error: updateError } = await supabase
    .from('rooms')
    .update({
      guest_id,
      guest_nickname,
      guest_avatar,
    })
    .eq('id', room_id);

  if (updateError) {
    return res.status(500).json({ error: updateError.message });
  }

  res.status(200).json({ success: true, room });
}
