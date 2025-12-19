'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      {/* Header with wallet */}
      <div className="fixed top-4 right-4 z-50">
        <ConnectButton />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.2 }}
          className="text-palja-gold-light tracking-[0.4em] uppercase mb-4 text-sm md:text-base"
        >
          PALJA Oracle
        </motion.p>

        {/* Logo */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="font-serif-kr text-6xl md:text-8xl lg:text-9xl font-black gold-glow animate-glow-pulse mb-4"
        >
          福福福福
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.5 }}
          className="text-palja-gold-light tracking-widest mb-12 text-sm md:text-base"
        >
          "It's not alpha. It's PALJA."
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col md:flex-row gap-4 justify-center"
        >
          <Link href="/reading">
            <button className="btn-oracle text-lg px-8 py-4">
              Enter Oracle
            </button>
          </Link>
          <Link href="https://twitter.com/paljaoracle" target="_blank">
            <button className="btn-oracle-outline text-lg px-8 py-4">
              Twitter
            </button>
          </Link>
        </motion.div>

        {/* Degen types teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1 }}
          className="mt-16 text-sm"
        >
          <p className="mb-2 tracking-wider">12 DEGEN ARCHETYPES AWAIT</p>
          <div className="flex flex-wrap justify-center gap-3 text-2xl">
            <span title="The Ascended">✨</span>
            <span title="The Oracle">🔮</span>
            <span title="The Sniper">🎯</span>
            <span title="The Whale Whisperer">🐋</span>
            <span title="The Degen Lord">👑</span>
            <span title="The Diamond Hand">💎</span>
            <span title="The Ape">🦍</span>
            <span title="The Yield Farmer">🌾</span>
            <span title="The Bagholder">💼</span>
            <span title="The Exit Liquidity">🚪</span>
            <span title="The Paper Hand">🧻</span>
            <span title="The Rugged Soul">💀</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <div className="fixed bottom-4 text-center text-palja-gold opacity-40 text-sm tracking-wider">
        © 2025 PALJA Oracle · $BOKBI · Base
      </div>
    </main>
  );
}
