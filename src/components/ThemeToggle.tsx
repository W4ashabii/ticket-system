'use client';

import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-ultra-light)] hover:border-[var(--border-medium)] transition-all duration-300 group"
      whileHover={{ 
        scale: 1.05,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        className="relative w-6 h-6"
        animate={{ rotate: theme === 'light' ? 0 : 180 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 20
        }}
      >
        {theme === 'light' ? (
          <Sun className="w-6 h-6 text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors duration-300" />
        ) : (
          <Moon className="w-6 h-6 text-[var(--text-primary)] group-hover:text-[var(--text-secondary)] transition-colors duration-300" />
        )}
      </motion.div>
      
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-[var(--accent-primary)] opacity-0"
        animate={{ 
          scale: [0, 1.5, 0],
          opacity: [0, 0.1, 0]
        }}
        transition={{ 
          duration: 0.6,
          ease: "easeOut"
        }}
        key={theme}
      />
    </motion.button>
  );
}