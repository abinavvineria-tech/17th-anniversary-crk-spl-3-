class CookieEncyclopedia {
  constructor() {
    this.entries = new Map();
    this.init();
  }

  init() {
    this.register('friendship.core', {
      title: '💚 Friendship Core',
      lore: 'Inspired by the friendship between Pure Vanilla Cookie and White Lily Cookie.',
      functions: [
        'friendship.bloom() - Awaken the friendship bond',
        'friendship.unity() - Unite all Cookies in harmony',
        'friendship.hope() - Spread hope across the kingdom'
      ],
      detail: 'The Friendship Core module embodies the purest magic in the Cookie Kingdom — the power of bonds between Cookies.'
    });

    this.register('kingdom.game', {
      title: '🏰 Kingdom Game',
      lore: 'Build and manage your own Cookie Kingdom.',
      functions: [
        'kingdom.build() - Construct buildings',
        'kingdom.defend() - Defend against threats',
        'kingdom.celebrate() - Host celebrations'
      ],
      detail: 'Manage resources, defend your realm, and celebrate the 17th Anniversary!'
    });

    this.register('vanilla.light', {
      title: '✨ Vanilla Light',
      lore: 'The pure light of Pure Vanilla Cookie, healing and illuminating the Cookie Kingdom.',
      functions: [
        'vanilla.light.heal() - Restore health',
        'vanilla.light.purify() - Remove curses',
        'vanilla.light.guide() - Guide lost souls'
      ],
      detail: 'Channel the healing light of Pure Vanilla Cookie, the ancient hero who saved the Cookie Kingdom.'
    });

    this.register('lily.wisdom', {
      title: '🌿 Lily Wisdom',
      lore: 'The ancient knowledge of White Lily Cookie, keeper of secrets and magic.',
      functions: [
        'lily.wisdom.seek() - Seek ancient knowledge',
        'lily.wisdom.reveal() - Reveal hidden truths',
        'lily.wisdom.teach() - Share wisdom'
      ],
      detail: 'Access the vast knowledge of White Lily Cookie, the brilliant scholar of the Cookie Kingdom.'
    });

    this.register('hollyberry.strength', {
      title: '🍇 Hollyberry Strength',
      lore: 'The unyielding strength of Hollyberry Cookie, protector of the kingdom.',
      functions: [
        'hollyberry.strength.charge() - Charge into battle',
        'hollyberry.strength.defend() - Shield allies',
        'hollyberry.strength.roar() - Battle cry'
      ],
      detail: 'Harness the mighty power of Hollyberry Cookie, the fearless queen of the Hollyberry Kingdom.'
    });

    this.register('cacao.night', {
      title: '🌑 Cacao Night',
      lore: 'The shadowy wisdom of Dark Cacao Cookie, ruler of the Dark Cacao Kingdom.',
      functions: [
        'cacao.night.shroud() - Shroud in darkness',
        'cacao.night.strike() - Strike from shadows',
        'cacao.night.judge() - Pass judgment'
      ],
      detail: 'Wield the dark power of Dark Cacao Cookie, the stern but fair king.'
    });

    this.register('cheese.treasury', {
      title: '🧀 Cheese Treasury',
      lore: 'The golden riches of Golden Cheese Cookie, the wealthiest in the kingdom.',
      functions: [
        'cheese.treasury.deposit() - Store riches',
        'cheese.treasury.withdraw() - Take riches',
        'cheese.treasury.invest() - Grow wealth'
      ],
      detail: 'Manage wealth with Golden Cheese Cookie, whose treasure knows no bounds.'
    });

    this.register('timekeeper.flow', {
      title: '⏳ Timekeeper Flow',
      lore: 'The temporal power of Timekeeper Cookie, master of time and space.',
      functions: [
        'timekeeper.flow.rewind() - Rewind time',
        'timekeeper.flow.pause() - Freeze moment',
        'timekeeper.flow.accelerate() - Speed up time'
      ],
      detail: 'Manipulate the fabric of time with Timekeeper Cookie, the guardian of the timeline.'
    });

    this.register('seafairy.ocean', {
      title: '🌊 Sea Fairy Ocean',
      lore: 'The deep magic of Sea Fairy Cookie, guardian of the ocean.',
      functions: [
        'seafairy.ocean.wave() - Summon waves',
        'seafairy.ocean.dream() - Ocean dreams',
        'seafairy.ocean.whisper() - Ocean whispers'
      ],
      detail: 'Command the seven seas with Sea Fairy Cookie, the legendary ocean guardian.'
    });

    this.register('moonlight.dreams', {
      title: '🌙 Moonlight Dreams',
      lore: 'The dreamy power of Moonlight Cookie, weaver of dreams and starlight.',
      functions: [
        'moonlight.dreams.sleep() - Enter dreams',
        'moonlight.dreams.starfall() - Call stars',
        'moonlight.dreams.awaken() - Awaken from dreams'
      ],
      detail: 'Navigate the dreamscape with Moonlight Cookie, the legendary dream weaver.'
    });

    this.register('windarcher.forest', {
      title: '🍃 Wind Archer Forest',
      lore: 'The swift power of Wind Archer Cookie, guardian of the forest.',
      functions: [
        'windarcher.forest.shoot() - Precision arrow',
        'windarcher.forest.gust() - Wind gust',
        'windarcher.forest.whistle() - Call the wind'
      ],
      detail: 'Master the winds with Wind Archer Cookie, the legendary forest guardian.'
    });

    this.register('frostqueen.winter', {
      title: '❄️ Frost Queen Winter',
      lore: 'The icy power of Frost Queen Cookie, ruler of eternal winter.',
      functions: [
        'frostqueen.winter.freeze() - Freeze enemies',
        'frostqueen.winter.blizzard() - Summon blizzard',
        'frostqueen.winter.snowfall() - Gentle snow'
      ],
      detail: 'Command the frozen north with Frost Queen Cookie, the legendary queen of ice.'
    });

    this.register('blackpearl.abyss', {
      title: '🦪 Black Pearl Abyss',
      lore: 'The mysterious power of Black Pearl Cookie, queen of the abyss.',
      functions: [
        'blackpearl.abyss.darkness() - Call darkness',
        'blackpearl.abyss.pearl() - Pearl of power',
        'blackpearl.abyss.current() - Deep current'
      ],
      detail: 'Explore the abyss with Black Pearl Cookie, the legendary deep sea queen.'
    });

    this.register('dragon.flame', {
      title: '🐉 Dragon Flame',
      lore: 'The ancient power of Dragon Cookies — Pitaya, Longan, Lychee, Lotus, and Ananas.',
      functions: [
        'dragon.flame.breathe() - Breathe fire',
        'dragon.flame.soar() - Take flight',
        'dragon.flame.roar() - Dragon roar'
      ],
      detail: 'Harness the primal power of dragons. Each dragon brings unique elemental strength.'
    });

    this.register('beast.power', {
      title: '👹 Beast Power',
      lore: 'The fearsome might of the Beast Cookies — Shadow Milk, Burning Spice, Eternal Sugar, Silent Salt, and Mystic Flour.',
      functions: [
        'beast.power.unleash() - Unleash beast power',
        'beast.power.dominate() - Dominate foes',
        'beast.power.transform() - Dark transformation'
      ],
      detail: 'Wield the dark power of the Beasts. With great power comes great responsibility.'
    });

    this.register('anniversary.celebration', {
      title: '🎉 17th Anniversary Celebration',
      lore: 'Celebrating 17 years of Cookie Run! A journey filled with sweetness, friendship, and magic.',
      functions: [
        'anniversary.celebration.fireworks() - Launch fireworks',
        'anniversary.celebration.feast() - Kingdom feast',
        'anniversary.celebration.memories() - Recall memories'
      ],
      detail: 'Join the grand celebration of 17 years of Cookie Run! From OvenBreak to Kingdom, the journey continues.'
    });
  }

  register(name, entry) {
    this.entries.set(name, entry);
  }

  lookup(word) {
    if (this.entries.has(word)) {
      const entry = this.entries.get(word);
      return `# ${entry.title}\n\n${entry.lore}\n\n**Provides:**\n\n${entry.functions.map(f => `- \`${f}\``).join('\n')}\n\n---\n\n${entry.detail}`;
    }

    const partialMatch = Array.from(this.entries.entries()).find(([key]) =>
      key.includes(word) || word.includes(key)
    );
    if (partialMatch) {
      return this.lookup(partialMatch[0]);
    }

    const cookieLookup = this.lookupCookie(word);
    if (cookieLookup) return cookieLookup;

    return null;
  }

  lookupCookie(name) {
    const cookies = {
      'PureVanilla': {
        title: '🍦 Pure Vanilla Cookie',
        lore: 'The ancient hero of the Cookie Kingdom, blessed with pure healing light.',
        detail: '**Category:** Ancient Cookie\n**Role:** Healer / Support\n**Signature:** Golden Cream Aura\n\nThe first and oldest of the Ancient Heroes, Pure Vanilla Cookie sacrificed everything to save the Cookie Kingdom. His healing light knows no bounds.'
      },
      'WhiteLily': {
        title: '🌿 White Lily Cookie',
        lore: 'The brilliant scholar and keeper of ancient knowledge.',
        detail: '**Category:** Ancient Cookie\n**Role:** Mage / Scholar\n**Signature:** Nature Green Aura\n\nWhite Lily Cookie\'s boundless curiosity and wisdom make her the greatest mind in the Cookie Kingdom.'
      },
      'Hollyberry': {
        title: '🍇 Hollyberry Cookie',
        lore: 'The fearless queen of the Hollyberry Kingdom.',
        detail: '**Category:** Ancient Cookie\n**Role:** Tank / Defender\n**Signature:** Hollyberry Crimson\n\nWith her mighty charge and unshakable spirit, Hollyberry Cookie protects the kingdom with joy and strength.'
      },
      'DarkCacao': {
        title: '🌑 Dark Cacao Cookie',
        lore: 'The stern king of the Dark Cacao Kingdom.',
        detail: '**Category:** Ancient Cookie\n**Role:** DPS / Leader\n**Signature:** Dark Cacao Night\n\nDark Cacao Cookie rules with wisdom and justice, wielding the power of darkness to protect his people.'
      },
      'GoldenCheese': {
        title: '🧀 Golden Cheese Cookie',
        lore: 'The wealthiest Cookie in the kingdom, with a heart of gold.',
        detail: '**Category:** Ancient Cookie\n**Role:** Ranged DPS\n**Signature:** Ancient Gold\n\nGolden Cheese Cookie\'s treasure vaults are legendary, but her true wealth lies in her growing kindness.'
      },
      'Timekeeper': {
        title: '⏳ Timekeeper Cookie',
        lore: 'The guardian of the timeline, master of temporal magic.',
        detail: '**Category:** Timekeeper\n**Role:** Time Mage\n**Signature:** Temporal Purple Aura\n\nTimekeeper Cookie watches over the flow of time itself, ensuring the balance of past, present, and future.'
      },
      'SeaFairy': {
        title: '🌊 Sea Fairy Cookie',
        lore: 'The legendary guardian of the ocean depths.',
        detail: '**Category:** Legendary Cookie\n**Role:** Mage\n**Signature:** Ocean Blue Aura\n\nSea Fairy Cookie\'s power ebbs and flows like the tides, carrying the dreams of the deep.'
      },
      'Moonlight': {
        title: '🌙 Moonlight Cookie',
        lore: 'The dream weaver who dances among the stars.',
        detail: '**Category:** Legendary Cookie\n**Role:** Support / Controller\n**Signature:** Moonlight Blue\n\nMoonlight Cookie guides lost souls through the dreamscape, where fantasies become reality.'
      },
      'WindArcher': {
        title: '🍃 Wind Archer Cookie',
        lore: 'The swift guardian of the Whispering Forest.',
        detail: '**Category:** Legendary Cookie\n**Role:** Ranged DPS\n**Signature:** Nature Green\n\nWind Archer Cookie\'s arrows ride the winds, striking true from across the kingdom.'
      },
      'FrostQueen': {
        title: '❄️ Frost Queen Cookie',
        lore: 'The sovereign of eternal winter and frozen beauty.',
        detail: '**Category:** Legendary Cookie\n**Role:** Mage / Controller\n**Signature:** Frost Queen Cyan\n\nFrost Queen Cookie\'s heart is as cold as her domain, but her power is breathtaking.'
      },
      'BlackPearl': {
        title: '🦪 Black Pearl Cookie',
        lore: 'The mysterious queen of the abyssal depths.',
        detail: '**Category:** Legendary Cookie\n**Role:** Mage\n**Signature:** Ocean Blue\n\nBlack Pearl Cookie rules the lightless depths, where ancient secrets lie buried.'
      },
      'ShadowMilk': {
        title: '🥛 Shadow Milk Cookie',
        lore: 'The deceptive Beast of deceit and shadows.',
        detail: '**Category:** Beast Cookie\n**Role:** Deceiver / Controller\n**Signature:** Crimson Aura\n\nShadow Milk Cookie\'s sweet appearance hides a dark and manipulative nature.'
      },
      'BurningSpice': {
        title: '🌶️ Burning Spice Cookie',
        lore: 'The raging Beast of fire and destruction.',
        detail: '**Category:** Beast Cookie\n**Role:** Berserker / DPS\n**Signature:** Crimson Aura\n\nBurning Spice Cookie brings the heat of a thousand suns, leaving ashes in their wake.'
      },
      'MysticFlour': {
        title: '🌾 Mystic Flour Cookie',
        lore: 'The enigmatic Beast of mystery and visions.',
        detail: '**Category:** Beast Cookie\n**Role:** Mystic / Support\n**Signature:** Mystic Flour Violet\n\nMystic Flour Cookie weaves fate itself, seeing all possible futures.'
      },
      'PitayaDragon': {
        title: '🐉 Pitaya Dragon Cookie',
        lore: 'The fiery dragon of unmatched strength.',
        detail: '**Category:** Dragon Cookie\n**Role:** Brawler\n**Signature:** Dragon Flame Aura\n\nPitaya Dragon Cookie\'s fiery breath can melt mountains and reshape valleys.'
      },
      'LonganDragon': {
        title: '🐉 Longan Dragon Cookie',
        lore: 'The ancient dragon of wisdom and foresight.',
        detail: '**Category:** Dragon Cookie\n**Role:** Sage / Mage\n**Signature:** Dragon Flame Aura\n\nLongan Dragon Cookie\'s ancient eyes have seen the rise and fall of civilizations.'
      },
    };

    const cookie = cookies[name];
    if (!cookie) return null;

    return `# ${cookie.title}\n\n${cookie.lore}\n\n---\n\n${cookie.detail}`;
  }

  browse() {
    const categories = {
      'Ancient Cookies': ['PureVanilla', 'WhiteLily', 'Hollyberry', 'DarkCacao', 'GoldenCheese'],
      'Legendary Cookies': ['SeaFairy', 'Moonlight', 'WindArcher', 'FrostQueen', 'BlackPearl'],
      'Beast Cookies': ['ShadowMilk', 'BurningSpice', 'MysticFlour'],
      'Dragon Cookies': ['PitayaDragon', 'LonganDragon'],
      'Special': ['Timekeeper']
    };

    console.log('📖 Cookie Encyclopedia');
    console.log('='.repeat(50));
    for (const [category, members] of Object.entries(categories)) {
      console.log(`\n${category}:`);
      members.forEach(m => console.log(`  🍪 ${m}`));
    }
    console.log('\n💡 Use: lily encyclopedia <name> for details');
  }
}

module.exports = { CookieEncyclopedia };
