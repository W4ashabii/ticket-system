'use client';

import { motion } from 'framer-motion';
import { XCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function PaymentFailureContent() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    const txId = searchParams.get('transaction_uuid') || searchParams.get('transactionId');
    if (txId) {
      setTransactionId(txId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center px-4 relative overflow-hidden">
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
      </div>
      
      <motion.div
        className="max-w-md w-full text-center relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8 
        }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2 
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <XCircle className="h-24 w-24 text-[var(--text-primary)] mx-auto" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-[var(--text-primary)] mb-6 gradient-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.4 
          }}
        >
          Payment Failed
        </motion.h1>

        <motion.p
          className="text-[var(--text-tertiary)] mb-8 text-lg leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.6 
          }}
        >
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </motion.p>

        {transactionId && (
          <motion.div
            className="card-elevated p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.8 
            }}
          >
            <p className="text-sm text-[var(--text-quaternary)] mb-2 font-semibold">Transaction ID</p>
            <p className="font-mono text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] p-2 rounded-lg">{transactionId}</p>
          </motion.div>
        )}

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 1 
          }}
        >
          <Link href="/">
            <motion.button
              className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-3 group"
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
              whileTap={{ 
                scale: 0.95,
                transition: { type: "spring", stiffness: 400, damping: 25 }
              }}
            >
              <motion.div
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              </motion.div>
              <span>Back to Events</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function PaymentFailure() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  );
}
