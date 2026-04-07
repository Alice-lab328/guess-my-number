import { Icons } from '../icons';

export const Navbar = () => {
  return (
    <nav className="bg-background bg-gradient-to-b from-primary-container/20 to-transparent fixed top-0 left-0 right-0 z-50">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <span className="text-2xl font-black text-primary tracking-tight font-sans">
          Guess My Number 💕
        </span>
        <div className="flex items-center gap-4">
          <button className="text-primary hover:scale-110 transition-transform duration-200 active:scale-95">
            <Icons.HelpCircle size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};
