import { useState } from 'react';
import { motion } from 'motion/react';
import { Icons } from '../icons';

interface SetSecretScreenProps {
  onConfirm: (secret: string) => void;
}

export const SetSecretScreen = ({ onConfirm }: SetSecretScreenProps) => {
  const [secret, setSecret] = useState('');

  const handleNumberClick = (num: string) => {
    if (secret.length < 4) {
      setSecret(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setSecret(prev => prev.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md z-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full bg-surface-bright/60 backdrop-blur-xl rounded-xl p-8 flex flex-col items-center relative bubbly-shadow border border-white/20"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-2 tracking-tight">
            Pick your secret number 🔒
          </h1>
          <p className="text-secondary font-medium opacity-80 text-sm">
            Your partner won’t see this
          </p>
        </div>

        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map(i => (
            <div 
              key={i}
              className={`w-16 h-20 rounded-lg bg-surface-container-highest flex items-center justify-center text-4xl font-bold text-primary border-4 transition-all ${
                secret.length === i ? 'border-primary-container' : 'border-transparent'
              }`}
            >
              {secret[i] || '-'}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 w-full mb-10">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button 
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-16 rounded-full bg-surface-container-low text-primary font-bold text-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <button className="h-16 rounded-full flex items-center justify-center text-secondary-dim opacity-50">
            <Icons.X size={24} />
          </button>
          <button 
            onClick={() => handleNumberClick('0')}
            className="h-16 rounded-full bg-surface-container-low text-primary font-bold text-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
          >
            0
          </button>
          <button 
            onClick={handleDelete}
            className="h-16 rounded-full flex items-center justify-center text-secondary-dim hover:text-primary transition-colors"
          >
            <Icons.Delete size={32} />
          </button>
        </div>

        <button 
          onClick={() => secret.length === 4 && onConfirm(secret)}
          disabled={secret.length !== 4}
          className="w-full bg-primary-container text-on-primary-container font-extrabold text-xl py-5 rounded-full hover:scale-105 active:scale-95 transition-all bubbly-shadow uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>

        <div className="absolute -top-4 -right-4">
          <img 
            alt="Romantic decor" 
            className="w-12 h-12 rounded-full object-cover border-4 border-white shadow-lg rotate-12"
            src="https://picsum.photos/seed/heart/100/100"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="bg-surface-container-low p-6 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
            <Icons.Lock size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-primary">Fully Private</h3>
            <p className="text-sm text-on-surface-variant">Numbers are encrypted for both of you.</p>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 rounded-lg flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <Icons.Wand2 size={24} fill="currentColor" />
          </div>
          <div>
            <h3 className="font-bold text-secondary">Playful Hint</h3>
            <p className="text-sm text-on-surface-variant">You can choose to reveal one digit later.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
