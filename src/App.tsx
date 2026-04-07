import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DecorativeBackground } from './components/DecorativeBackground';
import { HomeScreen } from './components/HomeScreen';
import { LobbyScreen } from './components/LobbyScreen';
import { SetSecretScreen } from './components/SetSecretScreen';
import { GameScreen } from './components/GameScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { GameState, Player, Guess } from './types';

export default function App() {
  const [state, setState] = useState<GameState>({
    screen: 'HOME',
    roomId: '',
    me: null,
    partner: null,
    myGuesses: [],
    partnerGuesses: [],
    winner: null,
    round: 1,
    startTime: 0,
  });

  // Real-time synchronization
  useEffect(() => {
    if (!state.roomId) return;

    const roomChannel = supabase
      .channel(`room-${state.roomId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${state.roomId}` },
        (payload) => {
          const room = payload.new as any;
          setState((prev) => {
            if (!prev.me) return prev;
            
            const isHost = prev.me.id === room.host_id;
            const newMe = { ...prev.me, secretNumber: isHost ? room.host_secret : room.guest_secret };
            
            let newPartner = prev.partner;
            if (isHost && room.guest_id) {
              newPartner = {
                id: room.guest_id,
                nickname: room.guest_nickname,
                avatar: room.guest_avatar,
                isHost: false,
                secretNumber: room.guest_secret
              };
            } else if (!isHost && room.host_id) {
               newPartner = {
                id: room.host_id,
                nickname: room.host_nickname,
                avatar: room.host_avatar,
                isHost: true,
                secretNumber: room.host_secret
               };
            }

            return {
              ...prev,
              screen: room.status,
              round: room.round,
              winner: room.winner_id,
              me: newMe,
              partner: newPartner,
              startTime: prev.startTime || Date.now()
            };
          });
        }
      )
      .subscribe();

    const guessesChannel = supabase
      .channel(`guesses-${state.roomId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'guesses', filter: `room_id=eq.${state.roomId}` },
        (payload) => {
          const guess = payload.new as any;
          setState((prev) => {
            if (guess.player_id === prev.me?.id) {
              return { ...prev, myGuesses: [...prev.myGuesses, { number: guess.number, matches: guess.matches }] };
            } else if (prev.partner && guess.player_id === prev.partner.id) {
              return { ...prev, partnerGuesses: [...prev.partnerGuesses, { number: guess.number, matches: guess.matches }] };
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(roomChannel);
      supabase.removeChannel(guessesChannel);
    };
  }, [state.roomId]);

  const handleStart = async (nickname: string, action: 'CREATE' | 'JOIN', joinRoomId?: string) => {
    const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`;
    const myId = Math.random().toString(36).substring(2, 9); // Simple local unique ID
    
    if (action === 'CREATE') {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host_id: myId, host_nickname: nickname, host_avatar: avatar })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      setState(prev => ({
        ...prev,
        screen: 'LOBBY',
        roomId: data.roomId,
        me: { id: myId, nickname, avatar, isHost: true }
      }));
    } else if (action === 'JOIN' && joinRoomId) {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: joinRoomId, guest_id: myId, guest_nickname: nickname, guest_avatar: avatar })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.error);

      // Load initial state for joiner
      const { data: existingGuesses } = await supabase.from('guesses').select('*').eq('room_id', joinRoomId).order('created_at', { ascending: true });
      
      const myG: Guess[] = [];
      const pG: Guess[] = [];
      if (existingGuesses) {
        existingGuesses.forEach(g => {
           if (g.player_id === myId) myG.push({ number: g.number, matches: g.matches });
           else pG.push({ number: g.number, matches: g.matches });
        });
      }

      setState(prev => ({
        ...prev,
        screen: data.room.status,
        roomId: joinRoomId,
        me: { id: myId, nickname, avatar, isHost: false, secretNumber: data.room.guest_secret },
        partner: {
          id: data.room.host_id,
          nickname: data.room.host_nickname,
          avatar: data.room.host_avatar,
          isHost: true,
          secretNumber: data.room.host_secret
        },
        myGuesses: myG,
        partnerGuesses: pG,
        round: data.room.round,
        winner: data.room.winner_id,
        startTime: Date.now()
      }));
    }
  };

  const handleStartGame = async () => {
    // Only host can start game after guest joins
    if (state.me?.isHost && state.partner) {
      await supabase.from('rooms').update({ status: 'SET_SECRET' }).eq('id', state.roomId);
    }
  };

  const handleConfirmSecret = async (secret: string) => {
    if (!state.me) return;
    const res = await fetch('/api/secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: state.roomId, player_id: state.me.id, secret })
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    // Realtime update handles screen change
  };

  const handleGuess = async (number: string) => {
    if (!state.me) return;
    const res = await fetch('/api/guess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: state.roomId, player_id: state.me.id, number })
    });
    const data = await res.json();
    if (!res.ok) alert(data.error);
  };

  const handlePlayAgain = async () => {
    await fetch('/api/play-again', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_id: state.roomId })
    });
    setState(prev => ({ ...prev, myGuesses: [], partnerGuesses: [] }));
  };

  const handleHome = () => {
    setState({
      screen: 'HOME',
      roomId: '',
      me: null,
      partner: null,
      myGuesses: [],
      partnerGuesses: [],
      winner: null,
      round: 1,
      startTime: 0,
    });
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Navbar />
      <DecorativeBackground />
      
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-24 relative">
        {state.screen === 'HOME' && <HomeScreen onStart={(n, a) => handleStart(n, a, state.roomId === '' ? prompt('Enter 4-character Room ID:') || '' : '')} />}
        {state.screen === 'LOBBY' && state.me && (
          <LobbyScreen 
            roomId={state.roomId} 
            me={state.me} 
            partner={state.partner} 
            onStartGame={handleStartGame} 
          />
        )}
        {state.screen === 'SET_SECRET' && <SetSecretScreen onConfirm={handleConfirmSecret} />}
        {state.screen === 'GAME' && state.me && state.partner && (
          <GameScreen 
            me={state.me} 
            partner={state.partner} 
            myGuesses={state.myGuesses} 
            partnerGuesses={state.partnerGuesses} 
            round={state.round} 
            onGuess={handleGuess} 
          />
        )}
        {state.screen === 'RESULTS' && state.me && state.partner && (
          <ResultsScreen 
            me={state.me} 
            partner={state.partner} 
            winner={state.winner} 
            onPlayAgain={handlePlayAgain} 
            onHome={handleHome} 
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
