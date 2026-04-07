import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Icons } from '../icons';
import { Player, Guess } from '../types';

interface GameScreenProps {
  me: Player;
  partner: Player;
  myGuesses: Guess[];
  partnerGuesses: Guess[];
  round: number;
  onGuess: (number: string) => void;
}

export const GameScreen = ({ me, partner, myGuesses, partnerGuesses, round, onGuess }: GameScreenProps) => {
  const [currentGuess, setCurrentGuess] = useState('');
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNumberInput = (num: string) => {
    if (currentGuess.length < 4) {
      setCurrentGuess(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setCurrentGuess(prev => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto gap-8 z-10">
      {/* Status Header Bar */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-high rounded-xl p-6 bubbly-shadow flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
      >
        <div className="flex items-center gap-4 z-10">
          <div className="relative">
            <img 
              alt={me.nickname} 
              className="w-14 h-14 rounded-full border-4 border-primary-container"
              src={me.avatar}
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h2 className="text-secondary font-bold text-lg">{me.nickname}</h2>
            <p className="text-on-surface-variant text-xs">{me.isHost ? 'Host' : 'Player'}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 z-10">
          <div className="bg-primary-container/40 text-on-primary-container px-6 py-2 rounded-full font-extrabold text-xl tracking-wide flex items-center gap-3 animate-pulse shadow-[0_0_20px_rgba(255,182,193,0.5)]">
            <Icons.Sparkles size={20} />
            Your Turn ✨
          </div>
          <p className="text-on-surface-variant text-sm font-medium">Round {round} • {formatTime(elapsed)} elapsed</p>
        </div>

        <div className="flex items-center gap-4 z-10">
          <div className="text-right">
            <h2 className="text-secondary font-bold text-lg">{partner.nickname}</h2>
            <p className="text-on-surface-variant text-xs">{partner.isHost ? 'Host' : 'Player'}</p>
          </div>
          <div className="relative">
            <img 
              alt={partner.nickname} 
              className="w-14 h-14 rounded-full border-4 border-surface-container-highest"
              src={partner.avatar}
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -left-1 bg-surface-dim w-4 h-4 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </motion.section>

      {/* Main Game Split Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Panel: Your Guesses */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <Icons.Brain className="text-primary" size={24} />
            <h3 className="text-primary font-black text-xl uppercase tracking-tighter">Your Guesses 🧠</h3>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 min-h-[400px]">
            {myGuesses.map((guess, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-surface-container rounded-full p-4 hover:scale-[1.02] transition-transform cursor-default"
              >
                <span className="font-bold text-2xl tracking-widest text-primary ml-4">
                  {guess.number.split('').join(' ')}
                </span>
                <div className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-1 rounded-full text-sm font-bold">
                  {guess.matches} matches {guess.matches === 4 ? '🤯' : guess.matches > 0 ? '🙂' : '😶'}
                </div>
              </motion.div>
            ))}
            <div className="border-2 border-dashed border-outline-variant rounded-full p-4 flex justify-center items-center opacity-30 mt-4">
              <span className="text-sm font-bold text-outline">Next Guess Slot</span>
            </div>
          </div>
        </section>

        {/* Right Panel: Their Guesses */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-2">
            <Icons.Eye className="text-secondary" size={24} />
            <h3 className="text-secondary font-black text-xl uppercase tracking-tighter">Their Guesses 👀</h3>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 min-h-[400px]">
            {partnerGuesses.map((guess, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between bg-surface-container rounded-full p-4"
              >
                <span className="font-bold text-2xl tracking-widest text-secondary ml-4">
                  {guess.number.split('').join(' ')}
                </span>
                <div className="flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-sm font-bold">
                  {guess.matches} matches 😃
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Input Area */}
      <section className="sticky bottom-10 z-40 max-w-2xl mx-auto w-full">
        <div className="bg-surface-bright/90 backdrop-blur-xl p-8 rounded-xl bubbly-shadow border border-white/50 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <label className="text-secondary font-bold text-sm tracking-widest uppercase">Enter your 4-digit guess</label>
            <div className="flex gap-4">
              {[0, 1, 2, 3].map(i => (
                <input 
                  key={i}
                  className="w-14 h-16 rounded-lg bg-surface-container-highest border-none text-center text-3xl font-black text-primary focus:ring-4 focus:ring-primary-container transition-all"
                  maxLength={1}
                  type="text"
                  value={currentGuess[i] || ''}
                  placeholder="•"
                  readOnly
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(num => (
              <button 
                key={num}
                onClick={() => handleNumberInput(num)}
                className="h-12 rounded-lg bg-surface-container text-primary font-bold hover:bg-primary-container transition-colors"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={handleDelete}
              className="col-span-5 h-12 rounded-lg bg-surface-container-highest text-secondary font-bold hover:bg-secondary-container transition-colors flex items-center justify-center"
            >
              <Icons.Delete size={20} />
            </button>
          </div>

          {myGuesses.length >= round ? (
            <button 
              disabled
              className="w-full py-5 rounded-full bg-surface-container-highest text-on-surface-variant font-black text-2xl tracking-widest shadow-lg flex items-center justify-center gap-3 cursor-wait"
            >
              <Icons.Eye size={24} />
              WAITING FOR PARTNER...
            </button>
          ) : (
            <button 
              onClick={() => {
                if (currentGuess.length === 4) {
                  onGuess(currentGuess);
                  setCurrentGuess('');
                }
              }}
              disabled={currentGuess.length !== 4}
              className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-dim text-white font-black text-2xl tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.Rocket size={24} fill="currentColor" />
              GUESS!
            </button>
          )}
        </div>
      </section>
    </div>
  );
};
