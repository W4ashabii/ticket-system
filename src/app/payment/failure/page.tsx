'use client';

import { motion } from 'framer-motion';
import { XCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaymentFailure() {
  const searchParams = useSearchParams();
  const [transactionId, setTransactionId] = useState<string>('');

  useEffect(() => {
    const txId = searchParams.get('transaction_uuid') || searchParams.get('transactionId');
    if (txId) {
      setTransactionId(txId);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <XCircle className="h-24 w-24 text-red-600 mx-auto" />
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-black mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Payment Failed
        </motion.h1>

        <motion.p
          className="text-gray-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Unfortunately, your payment could not be processed. Please try again or contact support if the problem persists.
        </motion.p>

        {transactionId && (
          <motion.div
            className="bg-gray-50 rounded-lg p-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-black">{transactionId}</p>
          </motion.div>
        )}

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Link href="/">
            <motion.button
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors btn-hover flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="h-4 w-4" />
              <span>Back to Events</span>
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
