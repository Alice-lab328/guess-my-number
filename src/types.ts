export type GameScreen = 'HOME' | 'LOBBY' | 'SET_SECRET' | 'GAME' | 'RESULTS';

export interface Player {
  id: string;
  nickname: string;
  avatar: string;
  isHost: boolean;
  secretNumber?: string;
}

export interface Guess {
  number: string;
  matches: number;
}

export interface GameState {
  screen: GameScreen;
  roomId: string;
  me: Player | null;
  partner: Player | null;
  myGuesses: Guess[];
  partnerGuesses: Guess[];
  winner: string | null; // player id
  round: number;
  startTime: number;
}
