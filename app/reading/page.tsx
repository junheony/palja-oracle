'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ReadingForm from '@/components/ReadingForm';
import ReadingResult from '@/components/ReadingResult';
import LoadingOracle from '@/components/LoadingOracle';

type ReadingState = 'form' | 'loading' | 'result';

export interface PaljaResult {
  pillars: {
    year: { pillar: string; stem: any; branch: any };
    month: { pillar: string; stem: any; branch: any };
    day: { pillar: string; stem: any; branch: any };
    hour: { pillar: string; stem: any; branch: any };
  };
  elements: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  balance: {
    dominant: string;
    dominantCount: number;
    weak: string;
    weakCount: number;
  };
  archetype: {
    key: string;
    name: string;
    emoji: string;
    description: string;
    meme: string;
    advice: string;
    twitterCard: {
      gradient: string[];
      title: string;
      subtitle: string;
    };
  };
  dayMaster: {
    cn: string;
    en: string;
    element: string;
  };
  zodiac: string;
}

export default function ReadingPage() {
  const [state, setState] = useState<ReadingState>('form');
  const [result, setResult] = useState<PaljaResult | null>(null);

  const handleSubmit = async (birthData: { year: number; month: number; day: number; hour: number }) => {
    setState('loading');

    // Simulate API call - in production, this calls your backend
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Calculate PALJA (using the lib functions)
    const calculatedResult = calculatePalja(birthData);
    setResult(calculatedResult);
    setState('result');
  };

  const handleReset = () => {
    setState('form');
    setResult(null);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      {/* Header */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <span className="text-palja-gold hover:text-palja-gold-light transition font-serif-kr text-2xl">
            福
          </span>
        </Link>
      </div>
      <div className="fixed top-4 right-4 z-50">
        <ConnectButton />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {state === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
            <ReadingForm onSubmit={handleSubmit} />
          </motion.div>
        )}

        {state === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingOracle />
          </motion.div>
        )}

        {state === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg"
          >
            <ReadingResult result={result} onReset={handleReset} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="fixed bottom-4 text-center text-palja-gold opacity-40 text-sm tracking-wider">
        This is PALJA, not financial advice · 팔자소관
      </div>
    </main>
  );
}

// Client-side PALJA calculation (mirrors the lib/saju-calculator.js logic)
function calculatePalja(birthData: { year: number; month: number; day: number; hour: number }): PaljaResult {
  const { year, month, day, hour } = birthData;

  // Heavenly Stems
  const stems = [
    { ko: '갑', cn: '甲', en: 'Jia', element: 'wood' },
    { ko: '을', cn: '乙', en: 'Yi', element: 'wood' },
    { ko: '병', cn: '丙', en: 'Bing', element: 'fire' },
    { ko: '정', cn: '丁', en: 'Ding', element: 'fire' },
    { ko: '무', cn: '戊', en: 'Wu', element: 'earth' },
    { ko: '기', cn: '己', en: 'Ji', element: 'earth' },
    { ko: '경', cn: '庚', en: 'Geng', element: 'metal' },
    { ko: '신', cn: '辛', en: 'Xin', element: 'metal' },
    { ko: '임', cn: '壬', en: 'Ren', element: 'water' },
    { ko: '계', cn: '癸', en: 'Gui', element: 'water' },
  ];

  // Earthly Branches
  const branches = [
    { ko: '자', cn: '子', en: 'Zi', animal: 'Rat', element: 'water' },
    { ko: '축', cn: '丑', en: 'Chou', animal: 'Ox', element: 'earth' },
    { ko: '인', cn: '寅', en: 'Yin', animal: 'Tiger', element: 'wood' },
    { ko: '묘', cn: '卯', en: 'Mao', animal: 'Rabbit', element: 'wood' },
    { ko: '진', cn: '辰', en: 'Chen', animal: 'Dragon', element: 'earth' },
    { ko: '사', cn: '巳', en: 'Si', animal: 'Snake', element: 'fire' },
    { ko: '오', cn: '午', en: 'Wu', animal: 'Horse', element: 'fire' },
    { ko: '미', cn: '未', en: 'Wei', animal: 'Goat', element: 'earth' },
    { ko: '신', cn: '申', en: 'Shen', animal: 'Monkey', element: 'metal' },
    { ko: '유', cn: '酉', en: 'You', animal: 'Rooster', element: 'metal' },
    { ko: '술', cn: '戌', en: 'Xu', animal: 'Dog', element: 'earth' },
    { ko: '해', cn: '亥', en: 'Hai', animal: 'Pig', element: 'water' },
  ];

  // Calculate Year Pillar
  const yearStemIdx = (year - 4) % 10;
  const yearBranchIdx = (year - 4) % 12;
  const yearPillar = {
    stem: stems[yearStemIdx],
    branch: branches[yearBranchIdx],
    pillar: `${stems[yearStemIdx].cn}${branches[yearBranchIdx].cn}`,
  };

  // Calculate Month Pillar
  const monthStemBase = (yearStemIdx % 5) * 2;
  const monthStemIdx = (monthStemBase + month - 1) % 10;
  const monthBranchIdx = (month + 1) % 12;
  const monthPillar = {
    stem: stems[monthStemIdx],
    branch: branches[monthBranchIdx],
    pillar: `${stems[monthStemIdx].cn}${branches[monthBranchIdx].cn}`,
  };

  // Calculate Day Pillar (Julian Day Number)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  const dayStemIdx = (jdn - 1) % 10;
  const dayBranchIdx = (jdn - 1) % 12;
  const dayPillar = {
    stem: stems[dayStemIdx],
    branch: branches[dayBranchIdx],
    pillar: `${stems[dayStemIdx].cn}${branches[dayBranchIdx].cn}`,
  };

  // Calculate Hour Pillar
  const hourBranchIdx = Math.floor(((hour + 1) % 24) / 2);
  const hourStemBase = (dayStemIdx % 5) * 2;
  const hourStemIdx = (hourStemBase + hourBranchIdx) % 10;
  const hourPillar = {
    stem: stems[hourStemIdx],
    branch: branches[hourBranchIdx],
    pillar: `${stems[hourStemIdx].cn}${branches[hourBranchIdx].cn}`,
  };

  // Count elements
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(p => {
    elements[p.stem.element as keyof typeof elements]++;
    elements[p.branch.element as keyof typeof elements]++;
  });

  // Find dominant/weak
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const balance = {
    dominant: sorted[0][0],
    dominantCount: sorted[0][1],
    weak: sorted[sorted.length - 1][0],
    weakCount: sorted[sorted.length - 1][1],
  };

  // Determine archetype
  const archetype = getArchetype(elements);

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    elements,
    balance,
    archetype,
    dayMaster: dayPillar.stem,
    zodiac: yearPillar.branch.animal,
  };
}

// Archetype determination
function getArchetype(elements: { wood: number; fire: number; earth: number; metal: number; water: number }) {
  const archetypes = [
    {
      key: 'ascended',
      name: 'The Ascended',
      emoji: '✨',
      condition: () => Object.values(elements).every(v => v >= 1 && v <= 2),
      description: 'Perfect balance across all elements. Generational wealth awaits.',
      meme: 'Top 1% PALJA. Born for this market.',
      advice: 'You are the 1%. The stars align for you.',
      twitterCard: { gradient: ['#FFD700', '#FFA500'], title: 'THE ASCENDED ✨', subtitle: 'Perfect elemental balance detected' },
    },
    {
      key: 'oracle',
      name: 'The Oracle',
      emoji: '🔮',
      condition: () => { const v = Object.values(elements); return Math.max(...v) - Math.min(...v) <= 1 && Math.max(...v) < 3; },
      description: 'Near-perfect balance. You see what others cannot.',
      meme: 'Somehow always right. Trust the vision.',
      advice: 'Your PALJA is harmonious. The market whispers to you.',
      twitterCard: { gradient: ['#9B59B6', '#3498DB'], title: 'THE ORACLE 🔮', subtitle: 'Balanced PALJA - Market whispers to you' },
    },
    {
      key: 'sniper',
      name: 'The Sniper',
      emoji: '🎯',
      condition: () => elements.metal >= 2 && elements.water >= 2,
      description: 'Metal + Water alignment. Early entry, clean exit.',
      meme: 'Metal + Water = Alpha. You are the alpha.',
      advice: 'Trust your timing. You see entries others miss.',
      twitterCard: { gradient: ['#C0C0C0', '#1E90FF'], title: 'THE SNIPER 🎯', subtitle: 'Metal + Water = Pure Alpha Energy' },
    },
    {
      key: 'whale_whisperer',
      name: 'The Whale Whisperer',
      emoji: '🐋',
      condition: () => elements.metal >= 2 && elements.fire >= 2,
      description: 'Metal + Fire. You read whale movements like scripture.',
      meme: 'Reads the chain. Follows smart money.',
      advice: 'Your instincts are sharp. The whales speak to you.',
      twitterCard: { gradient: ['#C0C0C0', '#FF4500'], title: 'THE WHALE WHISPERER 🐋', subtitle: 'Metal + Fire - Reads the chain' },
    },
    {
      key: 'degen_lord',
      name: 'The Degen Lord',
      emoji: '👑',
      condition: () => elements.fire >= 2 && elements.water >= 2,
      description: 'Fire + Water opposition. 100x or liquidation. No middle ground.',
      meme: 'Leverage is my element. WAGMI or NGMI.',
      advice: 'You are built for volatility. Embrace the chaos.',
      twitterCard: { gradient: ['#FF4500', '#1E90FF'], title: 'THE DEGEN LORD 👑', subtitle: 'Fire + Water = 100x or Liquidation' },
    },
    {
      key: 'diamond_hand',
      name: 'The Diamond Hand',
      emoji: '💎',
      condition: () => elements.earth >= 3,
      description: 'Earth overload. You hold until zero... or infinity.',
      meme: 'Earth too strong. Diamond hands forged in conviction.',
      advice: 'Your conviction is unshakeable. This is your strength and weakness.',
      twitterCard: { gradient: ['#DAA520', '#8B4513'], title: 'THE DIAMOND HAND 💎', subtitle: 'Earth Dominant - Holds to infinity' },
    },
    {
      key: 'ape',
      name: 'The Ape',
      emoji: '🦍',
      condition: () => elements.fire >= 3,
      description: 'Fire overload. You ape without reading docs.',
      meme: 'Born to ape. Docs are for the weak.',
      advice: 'Your impulsiveness will either make or break you. Probably both.',
      twitterCard: { gradient: ['#FF4500', '#FF6347'], title: 'THE APE 🦍', subtitle: 'Fire Dominant - Born to Ape' },
    },
    {
      key: 'yield_farmer',
      name: 'The Yield Farmer',
      emoji: '🌾',
      condition: () => elements.water >= 3,
      description: 'Water overload. You chase APY across every chain.',
      meme: 'Liquidity addict. APY is my love language.',
      advice: 'Watch for impermanent loss. The pools call to you.',
      twitterCard: { gradient: ['#1E90FF', '#00CED1'], title: 'THE YIELD FARMER 🌾', subtitle: 'Water Dominant - Liquidity Addict' },
    },
    {
      key: 'bagholder',
      name: 'The Bagholder',
      emoji: '💼',
      condition: () => elements.earth >= 2 && elements.wood >= 2,
      description: 'Earth + Wood. You believe in "fundamentals" too much.',
      meme: 'Still holding ICP. "It\'s a long-term play."',
      advice: 'Sometimes the bags must be released. Learn to let go.',
      twitterCard: { gradient: ['#DAA520', '#228B22'], title: 'THE BAGHOLDER 💼', subtitle: 'Earth + Wood - Believes in Fundamentals' },
    },
    {
      key: 'exit_liquidity',
      name: 'The Exit Liquidity',
      emoji: '🚪',
      condition: () => elements.wood >= 3,
      description: 'Wood overload. You buy every top with conviction.',
      meme: 'Wood feeds the fire. Always buying ATH.',
      advice: 'Stop chasing green candles. The top is not your friend.',
      twitterCard: { gradient: ['#228B22', '#32CD32'], title: 'THE EXIT LIQUIDITY 🚪', subtitle: 'Wood Dominant - Buys Every Top' },
    },
    {
      key: 'paper_hand',
      name: 'The Paper Hand',
      emoji: '🧻',
      condition: () => elements.metal < 1,
      description: 'Metal deficiency. Panic selling is written in your stars.',
      meme: 'Certified Paper Hand. Sells at -5%.',
      advice: 'Burn $BOKBI to strengthen your resolve. You need Metal energy.',
      twitterCard: { gradient: ['#FFFFFF', '#E0E0E0'], title: 'THE PAPER HAND 🧻', subtitle: 'Metal Deficient - Panic Sells at -5%' },
    },
    {
      key: 'rugged_soul',
      name: 'The Rugged Soul',
      emoji: '💀',
      condition: () => elements.earth < 1,
      description: 'No Earth foundation. Rugs find you repeatedly.',
      meme: 'No foundation. Rugs are your destiny.',
      advice: 'Build stability. Avoid anon devs. Burn $BOKBI for protection.',
      twitterCard: { gradient: ['#2C2C2C', '#4A0000'], title: 'THE RUGGED SOUL 💀', subtitle: 'No Earth - Gets Rugged Repeatedly' },
    },
  ];

  for (const arch of archetypes) {
    if (arch.condition()) {
      return arch;
    }
  }

  // Default fallback
  return {
    key: 'degen',
    name: 'The Degen',
    emoji: '🎲',
    description: 'A unique elemental combination. Your path is unwritten.',
    meme: 'The Oracle cannot read you. You are the unknown variable.',
    advice: 'Forge your own destiny. The stars have no template for you.',
    twitterCard: { gradient: ['#8B0000', '#4A0000'], title: 'THE DEGEN 🎲', subtitle: 'Unknown Variable - Forge Your Own Path' },
  };
}
