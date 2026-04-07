import { useState } from 'react';
import { motion } from 'motion/react';
import { Icons } from '../icons';

interface HomeScreenProps {
  onStart: (nickname: string, action: 'CREATE' | 'JOIN') => void;
}

export const HomeScreen = ({ onStart }: HomeScreenProps) => {
  const [nickname, setNickname] = useState('');

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md z-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold text-primary tracking-tight mb-4 drop-shadow-sm">
          Guess My Number 💕
        </h1>
        <p className="text-xl md:text-2xl text-secondary font-medium tracking-wide">
          A cute game for two
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-surface-container-lowest rounded-xl p-8 bubbly-shadow relative border-none"
      >
        <div className="absolute -top-6 -right-6 text-tertiary-container rotate-[12deg] z-[-1]">
          <Icons.Heart size={48} fill="currentColor" />
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <label className="block px-4 text-sm font-bold text-on-surface-variant uppercase tracking-widest" htmlFor="nickname">
              Your Nickname
            </label>
            <input 
              className="w-full h-16 px-8 rounded-full bg-surface-container-highest border-none text-on-surface placeholder:text-outline-variant focus:ring-4 focus:ring-primary-container focus:bg-primary-container transition-all text-lg font-semibold outline-none"
              id="nickname"
              placeholder="Enter your cute name..."
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={() => nickname && onStart(nickname, 'CREATE')}
              disabled={!nickname}
              className="group w-full h-16 rounded-full bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-xl hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-3 bubbly-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.PlusCircle size={24} fill="currentColor" />
              Create Room
            </button>
            <button 
              onClick={() => nickname && onStart(nickname, 'JOIN')}
              disabled={!nickname}
              className="group w-full h-16 rounded-full bg-gradient-to-r from-secondary to-secondary-dim text-on-secondary font-bold text-xl hover:scale-[1.05] active:scale-[0.95] transition-all flex items-center justify-center gap-3 bubbly-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icons.UserPlus size={24} fill="currentColor" />
              Join Room
            </button>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-32 h-32 rounded-xl overflow-hidden rotate-[-3deg] bg-secondary-container p-2">
            <img 
              alt="Sweet minimal illustration of two hearts" 
              className="w-full h-full object-cover rounded-lg"
              src="https://picsum.photos/seed/love/200/200"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </motion.div>

      <div className="mt-16 w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container-low p-6 rounded-lg flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
            <Icons.Edit3 size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary">Pick a secret</h3>
            <p className="text-sm text-on-surface-variant">Choose a number between 1-100</p>
          </div>
        </div>
        <div className="bg-surface-container-high p-6 rounded-lg flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
            <Icons.MessageCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold text-secondary">Chat & Guess</h3>
            <p className="text-sm text-on-surface-variant">Give hints and find the match!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
