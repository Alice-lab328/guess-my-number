import { motion } from 'motion/react';
import { Icons } from '../icons';
import { Player } from '../types';

interface LobbyScreenProps {
  roomId: string;
  me: Player;
  partner: Player | null;
  onStartGame: () => void;
}

export const LobbyScreen = ({ roomId, me, partner, onStartGame }: LobbyScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl z-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-primary mb-4 tracking-tight">
          Waiting for your partner<span className="inline-block animate-pulse">...</span>
        </h1>
        <div className="inline-flex items-center gap-3 bg-surface-container-high px-6 py-3 rounded-full">
          <span className="text-on-surface-variant font-semibold tracking-wider uppercase">
            Room ID: <span className="text-primary font-black">{roomId}</span>
          </span>
          <button 
            className="flex items-center justify-center p-1 hover:text-primary transition-colors"
            onClick={() => navigator.clipboard.writeText(roomId)}
          >
            <Icons.Copy size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        {/* Player 1 Card */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center gap-6 bubbly-shadow transform -rotate-1"
        >
          <div className="w-32 h-32 rounded-full bg-primary-container p-2 border-4 border-surface overflow-hidden">
            <img 
              alt={me.nickname} 
              className="w-full h-full object-cover rounded-full"
              src={me.avatar}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center">
            <div className="bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-bold mb-2 inline-block">
              {me.isHost ? 'HOST' : 'PLAYER'}
            </div>
            <h2 className="text-2xl font-bold text-on-surface">{me.nickname}</h2>
          </div>
        </motion.div>

        {/* Player 2 Card */}
        {partner ? (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center gap-6 bubbly-shadow transform rotate-1"
          >
            <div className="w-32 h-32 rounded-full bg-secondary-container p-2 border-4 border-surface overflow-hidden">
              <img 
                alt={partner.nickname} 
                className="w-full h-full object-cover rounded-full"
                src={partner.avatar}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-center">
              <div className="bg-secondary text-on-secondary px-4 py-1 rounded-full text-xs font-bold mb-2 inline-block">
                {partner.isHost ? 'HOST' : 'PLAYER'}
              </div>
              <h2 className="text-2xl font-bold text-on-surface">{partner.nickname}</h2>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface-container rounded-xl p-8 flex flex-col items-center justify-center gap-6 border-4 border-dashed border-outline-variant/30 transform rotate-1 relative overflow-hidden group"
          >
            <div className="w-32 h-32 rounded-full bg-surface-dim flex items-center justify-center">
              <Icons.UserPlus size={48} className="text-outline-variant" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-on-surface-variant">Waiting for partner...</p>
              <p className="text-sm text-outline mt-1">Share the Room ID to start!</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-16 text-center">
        <button 
          onClick={onStartGame}
          disabled={!partner}
          className={`font-black text-xl px-12 py-5 rounded-full shadow-lg flex items-center gap-3 transition-all ${
            partner 
              ? 'bg-primary text-on-primary hover:scale-105 active:scale-95' 
              : 'bg-surface-container-highest text-outline cursor-not-allowed'
          }`}
        >
          <Icons.PlayCircle size={24} />
          Start Game
        </button>
        <p className="text-on-surface-variant text-sm mt-4 font-medium italic">
          Both players must be in the room to begin
        </p>
      </div>
    </div>
  );
};
