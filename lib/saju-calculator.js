/**
 * PALJA Oracle - Saju Calculator Engine
 * 사주팔자 (Four Pillars of Destiny) calculation
 */

// 천간 (Heavenly Stems) - 10 stems
const HEAVENLY_STEMS = [
  { ko: '갑', cn: '甲', en: 'Jia', element: 'wood', yin_yang: 'yang' },
  { ko: '을', cn: '乙', en: 'Yi', element: 'wood', yin_yang: 'yin' },
  { ko: '병', cn: '丙', en: 'Bing', element: 'fire', yin_yang: 'yang' },
  { ko: '정', cn: '丁', en: 'Ding', element: 'fire', yin_yang: 'yin' },
  { ko: '무', cn: '戊', en: 'Wu', element: 'earth', yin_yang: 'yang' },
  { ko: '기', cn: '己', en: 'Ji', element: 'earth', yin_yang: 'yin' },
  { ko: '경', cn: '庚', en: 'Geng', element: 'metal', yin_yang: 'yang' },
  { ko: '신', cn: '辛', en: 'Xin', element: 'metal', yin_yang: 'yin' },
  { ko: '임', cn: '壬', en: 'Ren', element: 'water', yin_yang: 'yang' },
  { ko: '계', cn: '癸', en: 'Gui', element: 'water', yin_yang: 'yin' }
];

// 지지 (Earthly Branches) - 12 branches
const EARTHLY_BRANCHES = [
  { ko: '자', cn: '子', en: 'Zi', animal: 'Rat', element: 'water', hour: [23, 1] },
  { ko: '축', cn: '丑', en: 'Chou', animal: 'Ox', element: 'earth', hour: [1, 3] },
  { ko: '인', cn: '寅', en: 'Yin', animal: 'Tiger', element: 'wood', hour: [3, 5] },
  { ko: '묘', cn: '卯', en: 'Mao', animal: 'Rabbit', element: 'wood', hour: [5, 7] },
  { ko: '진', cn: '辰', en: 'Chen', animal: 'Dragon', element: 'earth', hour: [7, 9] },
  { ko: '사', cn: '巳', en: 'Si', animal: 'Snake', element: 'fire', hour: [9, 11] },
  { ko: '오', cn: '午', en: 'Wu', animal: 'Horse', element: 'fire', hour: [11, 13] },
  { ko: '미', cn: '未', en: 'Wei', animal: 'Goat', element: 'earth', hour: [13, 15] },
  { ko: '신', cn: '申', en: 'Shen', animal: 'Monkey', element: 'metal', hour: [15, 17] },
  { ko: '유', cn: '酉', en: 'You', animal: 'Rooster', element: 'metal', hour: [17, 19] },
  { ko: '술', cn: '戌', en: 'Xu', animal: 'Dog', element: 'earth', hour: [19, 21] },
  { ko: '해', cn: '亥', en: 'Hai', animal: 'Pig', element: 'water', hour: [21, 23] }
];

// 오행 (Five Elements) with crypto meanings
const FIVE_ELEMENTS = {
  wood: {
    ko: '목',
    cn: '木',
    en: 'Wood',
    color: '#228B22',
    crypto_meaning: 'Growth & Early Gems',
    traits: ['growth', 'flexibility', 'creativity', 'expansion'],
    degen_trait: 'Early adopter energy. You find gems before CT.',
    market_force: 'Altseason. New narratives. 100x potential.'
  },
  fire: {
    ko: '화',
    cn: '火',
    en: 'Fire',
    color: '#FF4500',
    crypto_meaning: 'Volatility & Pumping',
    traits: ['passion', 'transformation', 'intensity', 'action'],
    degen_trait: 'You love leverage. High risk, high reward.',
    market_force: 'Pumps. FOMO. Liquidation cascades.'
  },
  earth: {
    ko: '토',
    cn: '土',
    en: 'Earth',
    color: '#DAA520',
    crypto_meaning: 'HODL & Staking',
    traits: ['stability', 'patience', 'nurturing', 'grounding'],
    degen_trait: 'Diamond hands. You stake and forget.',
    market_force: 'Accumulation. DCA. Long-term holds.'
  },
  metal: {
    ko: '금',
    cn: '金',
    en: 'Metal',
    color: '#C0C0C0',
    crypto_meaning: 'Blue Chips & Hard Money',
    traits: ['precision', 'discipline', 'value', 'strength'],
    degen_trait: 'BTC/ETH maxi energy. Quality over quantity.',
    market_force: 'Store of value. Flight to safety.'
  },
  water: {
    ko: '수',
    cn: '水',
    en: 'Water',
    color: '#1E90FF',
    crypto_meaning: 'Liquidity & Flow',
    traits: ['adaptability', 'wisdom', 'flow', 'depth'],
    degen_trait: 'You follow the money. LP provider. Yield farmer.',
    market_force: 'Liquidity flows. Capital rotation.'
  }
};

// Degen Archetypes based on element combinations (12 types - MBTI style shareability)
const DEGEN_ARCHETYPES = {
  'ascended': {
    name: 'The Ascended',
    condition: (elements) => {
      return Object.values(elements).every(v => v >= 1 && v <= 2);
    },
    description: 'Perfect balance across all elements. Generational wealth awaits.',
    emoji: '✨',
    meme: 'Top 1% PALJA. Born for this market.',
    advice: 'You are the 1%. The stars align for you.',
    twitterCard: {
      gradient: ['#FFD700', '#FFA500'],
      title: 'THE ASCENDED ✨',
      subtitle: 'Perfect elemental balance detected'
    }
  },
  'oracle': {
    name: 'The Oracle',
    condition: (elements) => {
      const values = Object.values(elements);
      const max = Math.max(...values);
      const min = Math.min(...values);
      return max - min <= 1 && max < 3;
    },
    description: 'Near-perfect balance. You see what others cannot.',
    emoji: '🔮',
    meme: 'Somehow always right. Trust the vision.',
    advice: 'Your PALJA is harmonious. The market whispers to you.',
    twitterCard: {
      gradient: ['#9B59B6', '#3498DB'],
      title: 'THE ORACLE 🔮',
      subtitle: 'Balanced PALJA - Market whispers to you'
    }
  },
  'sniper': {
    name: 'The Sniper',
    condition: (elements) => elements.metal >= 2 && elements.water >= 2,
    description: 'Metal + Water alignment. Early entry, clean exit.',
    emoji: '🎯',
    meme: 'Metal + Water = Alpha. You are the alpha.',
    advice: 'Trust your timing. You see entries others miss.',
    twitterCard: {
      gradient: ['#C0C0C0', '#1E90FF'],
      title: 'THE SNIPER 🎯',
      subtitle: 'Metal + Water = Pure Alpha Energy'
    }
  },
  'whale_whisperer': {
    name: 'The Whale Whisperer',
    condition: (elements) => elements.metal >= 2 && elements.fire >= 2,
    description: 'Metal + Fire. You read whale movements like scripture.',
    emoji: '🐋',
    meme: 'Reads the chain. Follows smart money.',
    advice: 'Your instincts are sharp. The whales speak to you.',
    twitterCard: {
      gradient: ['#C0C0C0', '#FF4500'],
      title: 'THE WHALE WHISPERER 🐋',
      subtitle: 'Metal + Fire - Reads the chain'
    }
  },
  'degen_lord': {
    name: 'The Degen Lord',
    condition: (elements) => elements.fire >= 2 && elements.water >= 2,
    description: 'Fire + Water opposition. 100x or liquidation. No middle ground.',
    emoji: '👑',
    meme: 'Leverage is my element. WAGMI or NGMI.',
    advice: 'You are built for volatility. Embrace the chaos.',
    twitterCard: {
      gradient: ['#FF4500', '#1E90FF'],
      title: 'THE DEGEN LORD 👑',
      subtitle: 'Fire + Water = 100x or Liquidation'
    }
  },
  'diamond_hand': {
    name: 'The Diamond Hand',
    condition: (elements) => elements.earth >= 3,
    description: 'Earth overload. You hold until zero... or infinity.',
    emoji: '💎',
    meme: 'Earth too strong. Diamond hands forged in conviction.',
    advice: 'Your conviction is unshakeable. This is your strength and weakness.',
    twitterCard: {
      gradient: ['#DAA520', '#8B4513'],
      title: 'THE DIAMOND HAND 💎',
      subtitle: 'Earth Dominant - Holds to infinity'
    }
  },
  'ape': {
    name: 'The Ape',
    condition: (elements) => elements.fire >= 3,
    description: 'Fire overload. You ape without reading docs.',
    emoji: '🦍',
    meme: 'Born to ape. Docs are for the weak.',
    advice: 'Your impulsiveness will either make or break you. Probably both.',
    twitterCard: {
      gradient: ['#FF4500', '#FF6347'],
      title: 'THE APE 🦍',
      subtitle: 'Fire Dominant - Born to Ape'
    }
  },
  'yield_farmer': {
    name: 'The Yield Farmer',
    condition: (elements) => elements.water >= 3,
    description: 'Water overload. You chase APY across every chain.',
    emoji: '🌾',
    meme: 'Liquidity addict. APY is my love language.',
    advice: 'Watch for impermanent loss. The pools call to you.',
    twitterCard: {
      gradient: ['#1E90FF', '#00CED1'],
      title: 'THE YIELD FARMER 🌾',
      subtitle: 'Water Dominant - Liquidity Addict'
    }
  },
  'bagholder': {
    name: 'The Bagholder',
    condition: (elements) => elements.earth >= 2 && elements.wood >= 2,
    description: 'Earth + Wood. You believe in "fundamentals" too much.',
    emoji: '💼',
    meme: 'Still holding ICP. "It\'s a long-term play."',
    advice: 'Sometimes the bags must be released. Learn to let go.',
    twitterCard: {
      gradient: ['#DAA520', '#228B22'],
      title: 'THE BAGHOLDER 💼',
      subtitle: 'Earth + Wood - Believes in Fundamentals'
    }
  },
  'exit_liquidity': {
    name: 'The Exit Liquidity',
    condition: (elements) => elements.wood >= 3,
    description: 'Wood overload. You buy every top with conviction.',
    emoji: '🚪',
    meme: 'Wood feeds the fire. Always buying ATH.',
    advice: 'Stop chasing green candles. The top is not your friend.',
    twitterCard: {
      gradient: ['#228B22', '#32CD32'],
      title: 'THE EXIT LIQUIDITY 🚪',
      subtitle: 'Wood Dominant - Buys Every Top'
    }
  },
  'paper_hand': {
    name: 'The Paper Hand',
    condition: (elements) => elements.metal < 1,
    description: 'Metal deficiency. Panic selling is written in your stars.',
    emoji: '🧻',
    meme: 'Certified Paper Hand. Sells at -5%.',
    advice: 'Burn $BOKBI to strengthen your resolve. You need Metal energy.',
    twitterCard: {
      gradient: ['#FFFFFF', '#E0E0E0'],
      title: 'THE PAPER HAND 🧻',
      subtitle: 'Metal Deficient - Panic Sells at -5%'
    }
  },
  'rugged_soul': {
    name: 'The Rugged Soul',
    condition: (elements) => elements.earth < 1,
    description: 'No Earth foundation. Rugs find you repeatedly.',
    emoji: '💀',
    meme: 'No foundation. Rugs are your destiny.',
    advice: 'Build stability. Avoid anon devs. Burn $BOKBI for protection.',
    twitterCard: {
      gradient: ['#2C2C2C', '#4A0000'],
      title: 'THE RUGGED SOUL 💀',
      subtitle: 'No Earth - Gets Rugged Repeatedly'
    }
  }
};

// Archetype priority order (check in this order for accurate matching)
const ARCHETYPE_PRIORITY = [
  'ascended',      // Perfect balance - rarest
  'oracle',        // Near-perfect balance
  'sniper',        // Metal + Water
  'whale_whisperer', // Metal + Fire
  'degen_lord',    // Fire + Water
  'diamond_hand',  // Earth >= 3
  'ape',           // Fire >= 3
  'yield_farmer',  // Water >= 3
  'bagholder',     // Earth + Wood
  'exit_liquidity', // Wood >= 3
  'paper_hand',    // Metal < 1
  'rugged_soul'    // Earth < 1
];

/**
 * Convert solar date to lunar date (simplified approximation)
 * For production, use a proper lunar calendar library
 */
function solarToLunar(year, month, day) {
  // This is a simplified version - real implementation needs lunar calendar data
  // For MVP, we'll use solar date calculations
  return { year, month, day };
}

/**
 * Calculate Year Pillar (년주)
 */
function getYearPillar(year) {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    pillar: `${HEAVENLY_STEMS[stemIndex].cn}${EARTHLY_BRANCHES[branchIndex].cn}`
  };
}

/**
 * Calculate Month Pillar (월주)
 */
function getMonthPillar(year, month) {
  // Month stem is derived from year stem
  const yearStemIndex = (year - 4) % 10;
  const monthStemBase = (yearStemIndex % 5) * 2;
  const stemIndex = (monthStemBase + month - 1) % 10;
  
  // Month branch: 寅 (Tiger) = month 1 (February in lunar calendar)
  const branchIndex = (month + 1) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    pillar: `${HEAVENLY_STEMS[stemIndex].cn}${EARTHLY_BRANCHES[branchIndex].cn}`
  };
}

/**
 * Calculate Day Pillar (일주)
 * Uses a simplified calculation based on Julian Day Number
 */
function getDayPillar(year, month, day) {
  // Calculate Julian Day Number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  
  const stemIndex = (jdn - 1) % 10;
  const branchIndex = (jdn - 1) % 12;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    pillar: `${HEAVENLY_STEMS[stemIndex].cn}${EARTHLY_BRANCHES[branchIndex].cn}`
  };
}

/**
 * Calculate Hour Pillar (시주)
 */
function getHourPillar(year, month, day, hour) {
  const dayPillar = getDayPillar(year, month, day);
  const dayStemIndex = HEAVENLY_STEMS.findIndex(s => s.cn === dayPillar.stem.cn);
  
  // Find branch based on hour
  let branchIndex = 0;
  for (let i = 0; i < EARTHLY_BRANCHES.length; i++) {
    const [start, end] = EARTHLY_BRANCHES[i].hour;
    if (start > end) { // Handles 23-1 case (Zi hour)
      if (hour >= start || hour < end) {
        branchIndex = i;
        break;
      }
    } else if (hour >= start && hour < end) {
      branchIndex = i;
      break;
    }
  }
  
  // Hour stem calculation
  const hourStemBase = (dayStemIndex % 5) * 2;
  const stemIndex = (hourStemBase + branchIndex) % 10;
  
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex],
    pillar: `${HEAVENLY_STEMS[stemIndex].cn}${EARTHLY_BRANCHES[branchIndex].cn}`
  };
}

/**
 * Calculate all Four Pillars
 */
function calculateFourPillars(year, month, day, hour = 12) {
  return {
    year: getYearPillar(year),
    month: getMonthPillar(year, month),
    day: getDayPillar(year, month, day),
    hour: getHourPillar(year, month, day, hour)
  };
}

/**
 * Analyze element distribution
 */
function analyzeElements(pillars) {
  const elements = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  
  // Count elements from all stems and branches
  Object.values(pillars).forEach(pillar => {
    elements[pillar.stem.element]++;
    elements[pillar.branch.element]++;
  });
  
  return elements;
}

/**
 * Determine dominant and weak elements
 */
function getElementBalance(elements) {
  const sorted = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  
  return {
    dominant: sorted[0][0],
    dominantCount: sorted[0][1],
    weak: sorted[sorted.length - 1][0],
    weakCount: sorted[sorted.length - 1][1],
    distribution: elements
  };
}

/**
 * Determine Degen Archetype (uses priority order for accurate matching)
 */
function getDegenArchetype(elements) {
  // Check archetypes in priority order
  for (const key of ARCHETYPE_PRIORITY) {
    const archetype = DEGEN_ARCHETYPES[key];
    if (archetype.condition(elements)) {
      return { key, ...archetype };
    }
  }

  // Default fallback (should rarely happen)
  return {
    key: 'degen',
    name: 'The Degen',
    description: 'A unique elemental combination. Your path is unwritten.',
    emoji: '🎲',
    meme: 'The Oracle cannot read you. You are the unknown variable.',
    advice: 'Forge your own destiny. The stars have no template for you.',
    twitterCard: {
      gradient: ['#8B0000', '#4A0000'],
      title: 'THE DEGEN 🎲',
      subtitle: 'Unknown Variable - Forge Your Own Path'
    }
  };
}

/**
 * Generate complete PALJA reading
 */
function generatePaljaReading(year, month, day, hour = 12) {
  const pillars = calculateFourPillars(year, month, day, hour);
  const elements = analyzeElements(pillars);
  const balance = getElementBalance(elements);
  const archetype = getDegenArchetype(elements);
  
  // Day Master (일간) - the most important element
  const dayMaster = pillars.day.stem;
  
  return {
    pillars,
    elements,
    balance,
    archetype,
    dayMaster,
    zodiac: pillars.year.branch.animal,
    summary: {
      fourPillars: `${pillars.year.pillar} ${pillars.month.pillar} ${pillars.day.pillar} ${pillars.hour.pillar}`,
      dominantElement: FIVE_ELEMENTS[balance.dominant],
      weakElement: FIVE_ELEMENTS[balance.weak],
      dayMasterElement: FIVE_ELEMENTS[dayMaster.element]
    }
  };
}

// Export for use in other modules
module.exports = {
  HEAVENLY_STEMS,
  EARTHLY_BRANCHES,
  FIVE_ELEMENTS,
  DEGEN_ARCHETYPES,
  ARCHETYPE_PRIORITY,
  calculateFourPillars,
  analyzeElements,
  getElementBalance,
  getDegenArchetype,
  generatePaljaReading
};
