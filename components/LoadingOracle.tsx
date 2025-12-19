'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const loadingMessages = [
  'Consulting the heavens...',
  'Reading the Four Pillars...',
  'Analyzing elemental balance...',
  'Channeling ancient wisdom...',
  'Decoding your destiny...',
  'The Oracle awakens...',
];

export default function LoadingOracle() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      {/* Spinning Oracle Symbol */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="text-8xl mb-8"
      >
        ☯️
      </motion.div>

      {/* Pulsing Fu symbols */}
      <div className="flex justify-center gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="font-serif-kr text-4xl text-palja-gold"
          >
            福
          </motion.span>
        ))}
      </div>

      {/* Loading message */}
      <motion.p
        key={messageIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-palja-gold-light tracking-wider text-lg"
      >
        {loadingMessages[messageIndex]}
      </motion.p>

      {/* Scanning line effect */}
      <div className="mt-8 w-64 mx-auto h-1 bg-palja-red-deep rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-palja-gold"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: '50%' }}
        />
      </div>
    </div>
  );
}
