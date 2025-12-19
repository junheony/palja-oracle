'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { PaljaResult } from '@/app/reading/page';

interface ReadingResultProps {
  result: PaljaResult;
  onReset: () => void;
}

const elementColors: Record<string, string> = {
  wood: '#228B22',
  fire: '#FF4500',
  earth: '#DAA520',
  metal: '#C0C0C0',
  water: '#1E90FF',
};

const elementEmojis: Record<string, string> = {
  wood: '🌲',
  fire: '🔥',
  earth: '🌍',
  metal: '⚔️',
  water: '💧',
};

const elementKorean: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
};

export default function ReadingResult({ result, onReset }: ReadingResultProps) {
  const [copied, setCopied] = useState(false);

  const shareToTwitter = () => {
    const text = `I'm ${result.archetype.name} ${result.archetype.emoji}

${result.archetype.meme}

🔮 What's your PALJA?

palja-oracle.vercel.app

#PALJA #CryptoFortune #BOKBI`;

    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyResult = () => {
    const text = `${result.archetype.name} ${result.archetype.emoji}
${result.archetype.meme}
Four Pillars: ${result.pillars.year.pillar} ${result.pillars.month.pillar} ${result.pillars.day.pillar} ${result.pillars.hour.pillar}
palja-oracle.vercel.app`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="oracle-card p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <p className="text-palja-gold-light opacity-70 text-sm tracking-widest mb-2">
          YOUR DEGEN TYPE
        </p>
        <div className="text-6xl mb-4">{result.archetype.emoji}</div>
        <h2 className="font-serif-kr text-3xl gold-glow mb-2">
          {result.archetype.name}
        </h2>
        <p className="text-palja-gold-light opacity-80 text-sm italic">
          "{result.archetype.meme}"
        </p>
      </motion.div>

      {/* Four Pillars */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-black/30 rounded-xl p-4 mb-6"
      >
        <p className="text-center text-palja-gold-light text-xs tracking-widest mb-3">
          FOUR PILLARS 四柱
        </p>
        <div className="grid grid-cols-4 gap-2 text-center">
          {['year', 'month', 'day', 'hour'].map((pillar, i) => {
            const p = result.pillars[pillar as keyof typeof result.pillars];
            return (
              <div key={pillar} className="space-y-1">
                <p className="text-palja-gold opacity-50 text-xs">
                  {['年', '月', '日', '時'][i]}
                </p>
                <p className="font-serif-kr text-2xl text-palja-gold gold-glow">
                  {p.pillar}
                </p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Element Distribution */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <p className="text-center text-palja-gold-light text-xs tracking-widest mb-3">
          ELEMENTAL BALANCE 五行
        </p>
        <div className="flex justify-between items-end h-24 px-4">
          {Object.entries(result.elements).map(([element, count]) => (
            <div key={element} className="flex flex-col items-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: count * 20 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-8 rounded-t-lg mb-2"
                style={{ backgroundColor: elementColors[element] }}
              />
              <span className="text-lg">{elementEmojis[element]}</span>
              <span className="text-xs text-palja-gold opacity-60">
                {elementKorean[element]}
              </span>
              <span className="text-xs text-palja-gold-light">{count}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Day Master & Zodiac */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-4 mb-6"
      >
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-palja-gold-light text-xs opacity-60 mb-1">DAY MASTER</p>
          <p className="font-serif-kr text-xl text-palja-gold">
            {result.dayMaster.cn} {result.dayMaster.element.toUpperCase()}
          </p>
        </div>
        <div className="bg-black/20 rounded-lg p-3 text-center">
          <p className="text-palja-gold-light text-xs opacity-60 mb-1">ZODIAC</p>
          <p className="font-serif-kr text-xl text-palja-gold">
            {result.zodiac}
          </p>
        </div>
      </motion.div>

      {/* Oracle Advice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-black/30 rounded-xl p-4 mb-6 border border-palja-gold/20"
      >
        <p className="text-center text-palja-gold-light text-sm leading-relaxed">
          "{result.archetype.advice}"
        </p>
        <p className="text-center text-palja-gold opacity-40 text-xs mt-2">
          — The Oracle
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <button
          onClick={shareToTwitter}
          className="btn-oracle w-full flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Share on Twitter
        </button>

        <button
          onClick={copyResult}
          className="btn-oracle-outline w-full"
        >
          {copied ? '✓ Copied!' : 'Copy Result'}
        </button>

        <button
          onClick={onReset}
          className="w-full text-palja-gold opacity-60 hover:opacity-100 transition text-sm tracking-wider"
        >
          ← Read Another PALJA
        </button>
      </motion.div>

      {/* Footer */}
      <p className="text-center text-palja-gold opacity-30 text-xs mt-6 tracking-wider">
        This is PALJA, not financial advice. 팔자소관.
      </p>
    </div>
  );
}
