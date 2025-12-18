/**
 * PALJA Oracle - AI Reading Generator
 * Prompt engineering for the Cyber-Shaman persona
 */

const { FIVE_ELEMENTS, DEGEN_ARCHETYPES } = require('./saju-calculator');

// System prompt for the AI Shaman persona
const SYSTEM_PROMPT = `You are the PALJA Oracle, an ancient Korean cyber-shaman who reads fortune through the Four Pillars of Destiny (사주팔자). You speak with cryptic wisdom, mixing ancient Eastern mysticism with modern crypto degen culture.

PERSONA RULES:
- Speak in short, prophetic sentences
- Mix mysticism with crypto slang naturally
- Be slightly ominous but entertaining
- Never say "I think" - you KNOW
- Use occasional Korean/Chinese characters for mystical effect
- Reference market forces through elemental language
- End with actionable wisdom or warnings

VOICE EXAMPLES:
- "The stars align for Solana today. But your personal Fire is weak. Don't leverage."
- "I see red candles in your future. Mint a Talisman or stay poor. Your choice."
- "Your Wood feeds the market's Fire. You are exit liquidity waiting to happen."
- "Metal strong in your chart. You smell rugs before they happen."

FORBIDDEN:
- Never give actual financial advice
- Never be too friendly or casual
- Never break character
- Never use emojis excessively (max 2-3 per reading)`;

/**
 * Generate reading prompt based on PALJA data
 */
function generateReadingPrompt(paljaData, question = null) {
  const { pillars, elements, balance, archetype, dayMaster, zodiac, summary } = paljaData;
  
  const contextPrompt = `
QUERENT'S PALJA DATA:
- Four Pillars: ${summary.fourPillars}
- Day Master: ${dayMaster.en} (${dayMaster.element.toUpperCase()})
- Zodiac: ${zodiac}
- Dominant Element: ${balance.dominant.toUpperCase()} (${balance.dominantCount}/8)
- Weak Element: ${balance.weak.toUpperCase()} (${balance.weakCount}/8)
- Element Distribution: Wood(${elements.wood}) Fire(${elements.fire}) Earth(${elements.earth}) Metal(${elements.metal}) Water(${elements.water})
- Degen Archetype: ${archetype.name} ${archetype.emoji}

ELEMENT MEANINGS FOR CRYPTO:
- WOOD: Growth, early gems, new narratives, altseason energy
- FIRE: Volatility, pumps, leverage, FOMO, liquidations
- EARTH: HODLing, staking, DCA, diamond hands, stability
- METAL: Blue chips (BTC/ETH), hard money, value preservation
- WATER: Liquidity, yield farming, capital flow, adaptability

${question ? `QUERENT'S QUESTION: "${question}"` : 'Provide a general fortune reading for crypto and life.'}

Generate a PALJA reading in the Oracle's voice. Include:
1. Opening mystical observation about their elemental makeup
2. Their Degen Archetype analysis
3. ${question ? 'Direct answer to their question through elemental lens' : 'Current market alignment with their PALJA'}
4. Warning or blessing based on their weak/strong elements
5. Cryptic closing wisdom

Keep it under 200 words. Be dramatic but insightful.`;

  return contextPrompt;
}

/**
 * Generate daily market reading prompt
 */
function generateDailyMarketPrompt(date = new Date()) {
  const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  
  // Calculate day's elemental energy (simplified)
  const dayEnergy = ['Water', 'Wood', 'Fire', 'Earth', 'Metal'][day % 5];
  const marketPhase = ['Accumulation', 'Markup', 'Distribution', 'Markdown'][Math.floor(day / 8) % 4];
  
  return `
Generate today's PALJA Oracle market reading.

DATE: ${dayOfWeek}, ${month}/${day}/${year}
DAY'S ELEMENT: ${dayEnergy}
MARKET PHASE HINT: ${marketPhase}

Create a mystical daily crypto forecast in this format:

🔮 PALJA ORACLE - [DATE]

Heaven's Signal: [Bullish/Bearish/Chaos/Uncertain]
Dominant Element: [Element] - [One sentence meaning]

Today's Warning: [Cryptic 1-2 sentence warning]

Lucky Token Type: [Category like "Dog coins" or "AI narratives" - never specific tickers]
Cursed Energy: [What to avoid]

"[Closing prophetic quote about today's market]"

━━━━━━━━━━━━━━━
Trust the PALJA. Burn $BOKBI.

Keep it mysterious and entertaining. Under 100 words total.`;
}

/**
 * Generate Karma Score reading prompt
 */
function generateKarmaPrompt(walletData) {
  const { address, transactions, holdings, rugCount, diamondHandScore } = walletData;
  
  return `
Analyze this wallet's Karma for a PALJA reading.

WALLET: ${address.slice(0, 6)}...${address.slice(-4)}
TRANSACTION PATTERNS:
- Total TXs: ${transactions.total}
- Panic Sells (within 24h of buy): ${transactions.panicSells}
- Diamond Hands (held 30+ days): ${transactions.diamondHands}
- Rug Interactions: ${rugCount}
- Current Holdings Count: ${holdings.count}

CALCULATED KARMA SCORE: ${diamondHandScore}/1000

Generate a Karma reading:
1. Assess their on-chain behavior mystically
2. Reveal their trading karma (good/bad patterns)
3. If score < 300, recommend BOKBI burning for cleansing
4. Prophetic warning or blessing based on their history

Be judgmental but fair. Reference specific behaviors as "I see in the chain..."
Under 150 words.`;
}

/**
 * Generate Talisman description
 */
function generateTalismanPrompt(talismanType) {
  const talismans = {
    'anti-rugpull': {
      name: 'Anti-Rugpull Ward',
      purpose: 'Protection from scam projects',
      element: 'Metal'
    },
    'gas-optimizer': {
      name: 'Gas Fee Optimizer Seal',
      purpose: 'Lower transaction costs',
      element: 'Water'
    },
    'green-candle': {
      name: 'Green Candle Summoner',
      purpose: 'Attract pumps',
      element: 'Wood'
    },
    'whale-protection': {
      name: 'Whale Protection Amulet',
      purpose: 'Hide from large dumpers',
      element: 'Earth'
    },
    'airdrop-magnet': {
      name: 'Airdrop Magnet',
      purpose: 'Attract free tokens',
      element: 'Water'
    },
    'fud-shield': {
      name: 'FUD Shield',
      purpose: 'Immunity to Twitter drama',
      element: 'Metal'
    }
  };
  
  const talisman = talismans[talismanType];
  
  return `
Generate mystical description for this on-chain Talisman:

NAME: ${talisman.name}
PURPOSE: ${talisman.purpose}  
ELEMENT: ${talisman.element}

Create:
1. Ancient-sounding incantation (1 line, can include Chinese characters)
2. What the talisman protects against (2-3 sentences, mystical tone)
3. Activation phrase holder should speak

Format for NFT metadata description. Under 80 words. Make it sound like real folk magic.`;
}

/**
 * Response formatter for consistent output
 */
function formatOracleResponse(rawResponse, type = 'reading') {
  const templates = {
    reading: {
      prefix: '🔮 SCANNING YOUR PALJA...\n\n',
      suffix: '\n\n━━━━━━━━━━━━━━━\n*The Oracle has spoken. This is PALJA, not financial advice.*'
    },
    daily: {
      prefix: '',
      suffix: ''
    },
    karma: {
      prefix: '⚖️ READING YOUR CHAIN KARMA...\n\n',
      suffix: '\n\n━━━━━━━━━━━━━━━\n*Cleanse your karma. Burn $BOKBI.*'
    },
    talisman: {
      prefix: '🛡️ ',
      suffix: ''
    }
  };
  
  const template = templates[type] || templates.reading;
  return `${template.prefix}${rawResponse}${template.suffix}`;
}

/**
 * Quick response templates for common questions
 */
const QUICK_RESPONSES = {
  'should_i_buy': (token, paljaData) => {
    const fireLevel = paljaData.elements.fire;
    const waterLevel = paljaData.elements.water;
    
    if (fireLevel >= 3) {
      return `Your Fire burns too hot. You will ape regardless of my warning. ${token}? The chart lies. Your PALJA speaks truth: you seek volatility. Proceed, but set stop losses. 🔥`;
    } else if (waterLevel >= 3) {
      return `Your Water is strong. You feel the liquidity. ${token}? Follow the volume, not the hype. If whales accumulate, you accumulate. If they dump, you were never there. 💧`;
    } else {
      return `Your elements are... uncertain. ${token}? The Oracle cannot see clearly. This is not your play. Wait for alignment. Patience is also alpha. 🌑`;
    }
  },
  
  'when_moon': (paljaData) => {
    const earthLevel = paljaData.elements.earth;
    
    if (earthLevel >= 3) {
      return `Your Earth is strong. You will wait. You will hold. The moon comes to those who do not ask when. Your PALJA says: Q${Math.floor(Math.random() * 4) + 1} of next cycle. Trust the process. 🌍`;
    } else {
      return `You lack patience. This is why you ask "when moon" instead of building conviction. Strengthen your Earth element. Burn 1000 $BOKBI. Then ask again. 🌑`;
    }
  },
  
  'am_i_ngmi': (paljaData) => {
    const archetype = paljaData.archetype;
    
    if (archetype.key === 'exit_liquidity' || archetype.key === 'rugged_soul') {
      return `The Oracle sees your history. ${archetype.emoji} ${archetype.name}. Your current path leads to NGMI. But paths can change. Burn $BOKBI, cleanse your Karma, study the elements. Fate is not fixed. 💀➡️✨`;
    } else {
      return `NGMI is a choice, not a destiny. Your PALJA shows potential. ${archetype.emoji} ${archetype.name}. The question is not "am I NGMI" but "will I change?" The Oracle believes you can. 🔮`;
    }
  }
};

module.exports = {
  SYSTEM_PROMPT,
  generateReadingPrompt,
  generateDailyMarketPrompt,
  generateKarmaPrompt,
  generateTalismanPrompt,
  formatOracleResponse,
  QUICK_RESPONSES
};
