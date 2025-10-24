'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple authentication (in production, use proper authentication)
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('adminAuth', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin/admin123');
    }
    
    setIsLoading(false);
  };

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1
    }
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const formVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.4
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute top-20 left-20 w-2 h-2 bg-[var(--text-quaternary)] rounded-full opacity-20"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-32 w-1 h-1 bg-[var(--text-tertiary)] rounded-full opacity-30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="absolute bottom-40 left-40 w-3 h-3 bg-[var(--text-secondary)] rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>


      <motion.div
        className="w-full max-w-md relative z-10"
        variants={cardVariants}
      >
        <motion.div
          className="card-glass p-8"
          whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300, damping: 20 }
          }}
        >
          {/* Header */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="h-16 w-16 text-[var(--text-primary)] mx-auto" />
            </motion.div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 gradient-text">
              Admin Login
            </h1>
            <p className="text-[var(--text-tertiary)]">
              Access the admin dashboard
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            variants={formVariants}
          >
            {/* Username Field */}
            <div>
              <label className="block text-sm text-[var(--text-tertiary)] mb-2 font-semibold">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-quaternary)]" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all duration-300"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm text-[var(--text-tertiary)] mb-2 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--text-quaternary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-[var(--border-medium)] rounded-lg bg-[var(--bg-elevated)] text-[var(--text-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all duration-300"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--text-quaternary)] hover:text-[var(--text-primary)] transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="p-3 bg-[var(--bg-quaternary)] border border-[var(--border-medium)] rounded-lg text-[var(--text-primary)] text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {error}
              </motion.div>
            )}

            {/* Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-3 group"
              whileHover={{ 
                scale: 1.02,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-[var(--text-inverse)] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  <span>Login</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Demo Credentials */}
          <motion.div
            className="mt-6 p-4 bg-[var(--bg-secondary)] border border-[var(--border-ultra-light)] rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p className="text-sm text-[var(--text-quaternary)] text-center">
              <strong>Demo Credentials:</strong><br />
              Username: <code className="bg-[var(--bg-tertiary)] px-2 py-1 rounded">admin</code><br />
              Password: <code className="bg-[var(--bg-tertiary)] px-2 py-1 rounded">admin123</code>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
