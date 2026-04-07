import { motion } from 'motion/react';
import { Icons } from '../icons';
import { Player } from '../types';

interface ResultsScreenProps {
  me: Player;
  partner: Player;
  winner: string | null;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const ResultsScreen = ({ me, partner, winner, onPlayAgain, onHome }: ResultsScreenProps) => {
  const isWinner = winner === me.id;

  return (
    <div className="flex items-center justify-center p-6 relative z-10 w-full max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full frosted-candy rounded-xl p-8 md:p-12 text-center bubbly-shadow relative border border-white/40"
      >
        <div className="flex justify-center gap-4 mb-6">
          <Icons.Sparkles className="text-tertiary" size={40} />
          <Icons.Heart className="text-primary" size={40} fill="currentColor" />
          <Icons.Sparkles className="text-tertiary" size={40} />
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-primary mb-4 tracking-tight leading-tight">
          {isWinner ? 'You Win! 🎉💕' : 'So Close! 💖'}
        </h1>
        <p className="text-secondary text-lg font-medium mb-10">
          {isWinner ? 'Pure magic! You two are totally in sync.' : 'Better luck next time, lovebirds!'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-surface-container-low rounded-lg p-6 flex flex-col items-center justify-center">
            <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-2">Your number was</span>
            <span className="text-6xl font-black text-primary tracking-tighter">{me.secretNumber}</span>
          </div>
          <div className="bg-primary-container/30 rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute -top-2 -right-2 opacity-20 rotate-12">
              <Icons.Heart className="text-primary" size={64} fill="currentColor" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-on-primary-container mb-2">Partner's number was</span>
            <span className="text-6xl font-black text-on-primary-container tracking-tighter">{partner.secretNumber}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onPlayAgain}
            className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-tertiary to-tertiary-dim text-on-tertiary rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all bubbly-shadow flex items-center justify-center gap-2"
          >
            <Icons.RotateCcw size={24} />
            Play Again
          </button>
          <button 
            onClick={onHome}
            className="w-full sm:w-auto px-10 py-5 bg-secondary-container text-on-secondary-container rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Icons.Home size={24} />
            Back to Home
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-secondary opacity-70">
          <Icons.History size={16} />
          <span className="text-sm font-medium">New high score! Consecutive match streak: 3</span>
        </div>
      </motion.div>
    </div>
  );
};
