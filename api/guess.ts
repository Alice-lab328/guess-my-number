import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { room_id, player_id, number } = req.body;

  const { data: room } = await supabase.from('rooms').select('*').eq('id', room_id).single();
  if (!room) return res.status(404).json({ error: 'Room not found' });

  let secretToGuess = '';
  if (player_id === room.host_id) {
    secretToGuess = room.guest_secret;
  } else if (player_id === room.guest_id) {
    secretToGuess = room.host_secret;
  } else {
    return res.status(403).json({ error: 'Player not in room' });
  }

  if (!secretToGuess) return res.status(400).json({ error: 'Opponent secret not set' });

  const countS = new Array(10).fill(0);
  const countG = new Array(10).fill(0);
  for(let char of secretToGuess) countS[parseInt(char)]++;
  for(let char of number) countG[parseInt(char)]++;
  let matches = 0;
  for(let i=0; i<10; i++) matches += Math.min(countS[i], countG[i]);

  const { error: guessError } = await supabase.from('guesses').insert([{
    room_id,
    player_id,
    number,
    matches
  }]);

  if (guessError) return res.status(500).json({ error: guessError.message });

  if (number === secretToGuess) {
    await supabase.from('rooms').update({ status: 'RESULTS', winner_id: player_id }).eq('id', room_id);
    return res.status(200).json({ matches, winner: player_id });
  }

  const { data: guesses } = await supabase.from('guesses').select('*').eq('room_id', room_id);
  if (guesses) {
    const myGuesses = guesses.filter((g: any) => g.player_id === player_id).length;
    const partnerId = player_id === room.host_id ? room.guest_id : room.host_id;
    const partnerGuesses = guesses.filter((g: any) => g.player_id === partnerId).length;
    
    if (myGuesses > 0 && myGuesses === partnerGuesses) {
      await supabase.from('rooms').update({ round: myGuesses + 1 }).eq('id', room_id);
    }
  }

  res.status(200).json({ matches, winner: null });
}
