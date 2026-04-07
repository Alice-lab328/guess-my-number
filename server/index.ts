import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Create Room
app.post('/api/create', async (req, res) => {
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
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.json({ roomId });
});

// Join Room
app.post('/api/join', async (req, res) => {
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

  res.json({ success: true, room });
});

// Set Secret
app.post('/api/secret', async (req, res) => {
  const { room_id, player_id, secret } = req.body;

  const { data: room } = await supabase.from('rooms').select('*').eq('id', room_id).single();
  if (!room) return res.status(404).json({ error: 'Room not found' });

  const updates: any = {};
  if (player_id === room.host_id) {
    updates.host_secret = secret;
    if (room.guest_secret) updates.status = 'GAME'; // Both set
    else updates.status = 'SET_SECRET'; // Host set, waiting for guest
  } else if (player_id === room.guest_id) {
    updates.guest_secret = secret;
    if (room.host_secret) updates.status = 'GAME'; // Both set
    else updates.status = 'SET_SECRET'; // Guest set, waiting for host
  } else {
    return res.status(403).json({ error: 'Player not in room' });
  }

  const { error } = await supabase.from('rooms').update(updates).eq('id', room_id);
  
  if (error) return res.status(500).json({ error: error.message });

  res.json({ success: true, status: updates.status || room.status });
});

// Guess Number
app.post('/api/guess', async (req, res) => {
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

  // Calculate Matches (Ignorig position, handling duplicates)
  const countS = new Array(10).fill(0);
  const countG = new Array(10).fill(0);
  for(let char of secretToGuess) countS[parseInt(char)]++;
  for(let char of number) countG[parseInt(char)]++;
  let matches = 0;
  for(let i=0; i<10; i++) matches += Math.min(countS[i], countG[i]);

  // Save the guess
  const { error: guessError } = await supabase.from('guesses').insert([{
    room_id,
    player_id,
    number,
    matches
  }]);

  if (guessError) return res.status(500).json({ error: guessError.message });

  // Check Win Condition
  if (number === secretToGuess) {
    await supabase.from('rooms').update({ status: 'RESULTS', winner_id: player_id }).eq('id', room_id);
    return res.json({ matches, winner: player_id });
  }

  // Update Round Logic
  // Fetch guesses to check if both finished the round
  const { data: guesses } = await supabase.from('guesses').select('*').eq('room_id', room_id);
  if (guesses) {
    const myGuesses = guesses.filter((g: any) => g.player_id === player_id).length;
    const partnerId = player_id === room.host_id ? room.guest_id : room.host_id;
    const partnerGuesses = guesses.filter((g: any) => g.player_id === partnerId).length;
    
    // If both players have made equal number of guesses, round increments
    if (myGuesses > 0 && myGuesses === partnerGuesses) {
      await supabase.from('rooms').update({ round: myGuesses + 1 }).eq('id', room_id);
    }
  }

  res.json({ matches, winner: null });
});

// Reset for Play Again
app.post('/api/play-again', async (req, res) => {
  const { room_id } = req.body;
  
  // Clear secrets, guesses, reset to SET_SECRET
  await supabase.from('guesses').delete().eq('room_id', room_id);
  
  const { error } = await supabase.from('rooms').update({
    status: 'SET_SECRET',
    host_secret: null,
    guest_secret: null,
    winner_id: null,
    round: 1
  }).eq('id', room_id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Game server listening on port ${port}`);
});
