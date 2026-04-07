import { Icons } from '../icons';

export const Footer = () => {
  return (
    <footer className="w-full py-8 flex flex-col items-center gap-4 opacity-60 text-secondary font-sans text-sm bg-transparent mt-auto">
      <div className="flex gap-6">
        <a className="hover:text-tertiary transition-colors" href="#">Privacy</a>
        <a className="hover:text-tertiary transition-colors" href="#">Terms</a>
        <a className="hover:text-tertiary transition-colors" href="#">Support</a>
      </div>
      <p>Made with 💕 for couples</p>
    </footer>
  );
};
