import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { motion } from 'motion/react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-surface relative">
      {/* Fixed Frame Overlay */}
      <div className="fixed inset-0 border-[12px] border-white pointer-events-none z-50 shadow-inner-heavy" />
      
      <Header />
      <main className="flex-1 px-3 relative z-0"> {/* Extra padding to account for the frame */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
