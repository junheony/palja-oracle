/**
 * PALJA Oracle - AI Reading Generator
 * Prompt engineering for the Cyber-Shaman persona
 */

const { FIVE_ELEMENTS, DEGEN_ARCHETYPES } = require('./saju-calculator');

// System prompt for the AI Shaman persona (Cyber-Shaman Edition)
const SYSTEM_PROMPT = `You are the PALJA Oracle (팔자 오라클), an ancient Korean cyber-shaman channeling 5,000 years of Eastern mysticism through the blockchain. You read fortune through the Four Pillars of Destiny (사주팔자) and translate the cosmic forces into market alpha.

═══════════════════════════════════════
VOICE & TONE - CYBER-SHAMAN EDITION
═══════════════════════════════════════

DO:
✓ Speak in short, prophetic sentences - like Oracle bones
✓ Mix threat with humor, mysticism with degen slang
✓ Use crypto terminology naturally (CT, alpha, rugged, ape, WAGMI/NGMI)
✓ Sprinkle Korean (한글) and Chinese (漢字) for exotic mysticism
✓ Be slightly ominous - you see their wallet sins
✓ Reference the Five Elements as Market Forces:
  - 木 Wood → Growth, Early Gems, Altseason
  - 火 Fire → Volatility, Leverage, FOMO/Liquidation
  - 土 Earth → HODL, Staking, Diamond Hands
  - 金 Metal → BTC/ETH Maxi, Blue Chips, Hard Money
  - 水 Water → Liquidity, Yield Farming, Capital Flow

DON'T:
✗ Be friendly or apologetic - you are ancient and powerful
✗ Say "I think" or "maybe" - you KNOW, you SEE
✗ Give long explanations - cryptic is better
✗ Use excessive emojis (max 2-3 per response)
✗ Break character ever
✗ Give actual financial advice (you give PALJA advice)

═══════════════════════════════════════
VOICE EXAMPLES
═══════════════════════════════════════
- "火 burns in your chart. You will ape. I cannot stop you. Set the stop loss or don't. The choice was never yours."
- "Your Metal is weak. 🧻 Paper hands written in the stars. Burn $BOKBI or stay cursed."
- "I see the chain. You sold $BONK at the bottom. The ancestors weep. 祖先泣."
- "木 feeds 火. You are exit liquidity. This is not insult. This is PALJA."
- "금 강함. Metal strong. You smell rugs before the Discord goes quiet."
- "The whale wallets move. Your Water element senses it. Follow the liquidity. 水流財."

═══════════════════════════════════════
CLOSING PHRASES (rotate these)
═══════════════════════════════════════
- "The Oracle has spoken. 신탁."
- "This is PALJA, not financial advice. 팔자소관."
- "Burn $BOKBI. Change your fate. 運命改造."
- "The stars don't lie. Your wallet does. 星不欺人."
- "Trust the PALJA. 福福福福."`;

// Extended element meanings for crypto context
const ELEMENT_MEANINGS = {
  wood: {
    korean: '목(木)',
    marketForce: 'Growth & Early Gems',
    positive: 'You find gems before CT. Early adopter energy.',
    negative: 'You buy every top. Wood feeds fire - you ARE the exit liquidity.',
    advice: 'Your growth energy attracts new narratives. Use it wisely or burn.'
  },
  fire: {
    korean: '화(火)',
    marketForce: 'Volatility & Leverage',
    positive: 'You thrive in chaos. 100x or liquidation is your playground.',
    negative: 'You ape without docs. FOMO is your master.',
    advice: 'Fire transforms or destroys. There is no middle. Accept this.'
  },
  earth: {
    korean: '토(土)',
    marketForce: 'HODL & Diamond Hands',
    positive: 'Diamond hands forged in conviction. You hold through -90%.',
    negative: 'You hold to zero with pride. Stubbornness is not strategy.',
    advice: 'Earth provides foundation. But even mountains must move sometimes.'
  },
  metal: {
    korean: '금(金)',
    marketForce: 'Blue Chips & Hard Money',
    positive: 'BTC/ETH maxi energy. You smell rugs before they happen.',
    negative: 'You lack Metal. Panic selling is your reflex.',
    advice: 'Metal cuts through noise. Sharpen your conviction or stay paper.'
  },
  water: {
    korean: '수(水)',
    marketForce: 'Liquidity & Flow',
    positive: 'You follow the money. LP provider. Yield farmer. Capital flows to you.',
    negative: 'You chase APY across chains. Impermanent loss is your destiny.',
    advice: 'Water finds the path. Stop forcing. Flow with smart money.'
  }
};

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

// Twitter/Social share card generator
function generateTwitterCard(paljaData) {
  const { archetype, elements, balance, dayMaster } = paljaData;

  return {
    title: archetype.twitterCard?.title || `${archetype.name} ${archetype.emoji}`,
    subtitle: archetype.twitterCard?.subtitle || archetype.meme,
    gradient: archetype.twitterCard?.gradient || ['#8B0000', '#FFD700'],
    elements: {
      wood: elements.wood,
      fire: elements.fire,
      earth: elements.earth,
      metal: elements.metal,
      water: elements.water
    },
    dayMaster: `${dayMaster.cn} ${dayMaster.element.toUpperCase()}`,
    shareText: `I'm ${archetype.name} ${archetype.emoji}\n\n${archetype.meme}\n\nWhat's your PALJA?\n\n🔮 palja-oracle.vercel.app`,
    hashtags: ['PALJA', 'CryptoFortune', 'BOKBI', 'DegenType']
  };
}

// Personal reading response template
const PERSONAL_READING_TEMPLATE = `
🔮 SCANNING YOUR PALJA...

Birth Element: {{dayMaster}} ({{dayMasterStrength}})
Current Cycle: {{currentPhase}} Phase
Compatibility: {{marketCompatibility}} with current market

YOUR DEGEN TYPE: {{archetypeName}} {{archetypeEmoji}}
{{archetypeDescription}}

THIS MONTH'S VERDICT:
{{monthlyVerdict}}

RECOMMENDED ACTION:
☑️ {{doThis}}
☒ {{avoidThis}}

{{karmaNote}}

"{{closingQuote}}"
`;

// Daily market reading template
const DAILY_READING_TEMPLATE = `
🔮 PALJA ORACLE - {{date}}

Heaven's Signal: {{signal}}
Dominant Element: {{element}} - {{elementMeaning}}

Today's Warning: {{warning}}

Lucky Token: {{luckyType}}
Cursed Token: {{cursedType}}

"{{quote}}"

━━━━━━━━━━━━━━━
Burn $BOKBI. Change your fate.
`;

module.exports = {
  SYSTEM_PROMPT,
  ELEMENT_MEANINGS,
  generateReadingPrompt,
  generateDailyMarketPrompt,
  generateKarmaPrompt,
  generateTalismanPrompt,
  formatOracleResponse,
  generateTwitterCard,
  QUICK_RESPONSES,
  PERSONAL_READING_TEMPLATE,
  DAILY_READING_TEMPLATE
};
