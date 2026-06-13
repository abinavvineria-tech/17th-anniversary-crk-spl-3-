class LilyHoverProvider {
  constructor() {
    this.docCache = new Map();
  }

  provideHover(text, offset, word, ast) {
    if (!word) return null;

    const hoverDocs = {
      'bloom': '🌸 **bloom**\n\nAwaken the bloom within.\n\n```lily\nbloom(cookie)\n```\n\n*"Let the light of friendship bloom within you."*\n— Pure Vanilla Cookie',
      'ancient': '🏛️ **ancient**\n\nAncient Cookie power keyword.\n\nUsed to access ancient-level abilities and artifacts from the ancient heroes of the Cookie Kingdom.',
      'wish': '🌟 **wish**\n\nMake a wish upon a star.\n\n```lily\nwish("for peace and harmony")\n```\n\n*"Every wish carries the light of hope."*\n— White Lily Cookie',
      'friend': '💚 **friend**\n\nThe power of friendship.\n\n```lily\nfriend PureVanilla {\n    // friendship powers\n}\n```\n\n*"Friendship is the greatest magic of all."*\n— Pure Vanilla Cookie',
      'heal': '💚 **heal**\n\nHeal and restore.\n\n```lily\nheal(cookie, 100)\n```\n\n*"Even the deepest wounds can be healed with love."*\n— Pure Vanilla Cookie',
      'iflight': '✨ **iflight**\n\nIlluminate the path forward.\n\nUsed for conditional enlightenment and discovery.',
      'moonpath': '🌙 **moonpath**\n\nWalk the moonpath.\n\n```lily\nmoonpath {\n    // dreams and starlight\n}\n```\n\n*"The moonpath leads to the deepest dreams."*\n— Moonlight Cookie',
      'repeat': '🔄 **repeat**\n\nRepeat the cycle.\n\n```lily\nrepeat 17 times {\n    // anniversary magic\n}\n```',
      'timeflow': '⏳ **timeflow**\n\nFlow through time.\n\n```lily\ntimeflow {\n    await bloom(cookie)\n}\n```\n\n*"Time flows like a river through the Cookie Kingdom."*\n— Timekeeper Cookie',
      'await': '⏳ **await**\n\nAwait a timeflow operation.\n\nMust be used within a `timeflow` block.\n\n```lily\ntimeflow {\n    await wish("for happiness")\n}\n```',
      'anniversary': '🎉 **anniversary**\n\nCelebrate the 17th Anniversary of Cookie Run!\n\n*"Seventeen years of sweetness!"*\n\nSpecial keyword that unlocks celebration modes.',
      'kingdom': '🏰 **Kingdom**\n\nThe Cookie Kingdom realm.\n\n```lily\nclass Kingdom {\n    // kingdom building\n}\n```',
      'cookie': '🍪 **Cookie**\n\nThe base class for all Cookies.\n\n```lily\nclass Cookie {\n    fn bake()\n    fn decorate()\n}\n```\n\n*"Every Cookie has a story to tell."*',
      'dragon': '🐉 **Dragon**\n\nDragon class for legendary dragon Cookies.\n\n```lily\nclass Dragon {\n    fn breathe_fire()\n}\n```',
      'pure': '✨ **Pure**\n\nPure type modifier. Represents untainted, original essence.\n\nAssociated with Pure Vanilla Cookie and the ancient light.',
      'legendary': '🌊 **Legendary**\n\nLegendary Cookie classification.\n\nSea Fairy, Moonlight, Wind Archer, and more belong to this category.',
      'beast': '🔥 **Beast**\n\nBeast Cookie classification.\n\nShadow Milk, Burning Spice, Eternal Sugar, Silent Salt, and Mystic Flour.',
      'let': '📦 **let**\n\nDeclare a mutable variable.\n\n```lily\nlet x = 17\nx = 42  // mutable\n```',
      'const': '📦 **const**\n\nDeclare an immutable constant.\n\n```lily\nconst ANNIVERSARY = 17\n```',
      'fn': '⚡ **fn**\n\nDefine a function.\n\n```lily\nfn greet(name: string) {\n    return "Hello, " + name\n}\n```',
      'class': '🏛️ **class**\n\nDefine a class.\n\n```lily\nclass Cookie {\n    fn bake() { }\n}\n```',
      'import': '📥 **import**\n\nImport a module.\n\n```lily\nimport friendship from "friendship.core"\n```',
      'match': '🔀 **match**\n\nPattern matching.\n\n```lily\nmatch cookie.type {\n    "ancient" => ancient_power()\n    "legendary" => legendary_power()\n    _ => normal_power()\n}\n```',
      'struct': '🏗️ **struct**\n\nDefine a struct.\n\n```lily\nstruct CookieStats {\n    hp: int\n    attack: int\n    defense: int\n}\n```',
      'trait': '🔷 **trait**\n\nDefine a trait (interface).\n\n```lily\ntrait Bakes {\n    fn bake() -> Cookie\n}\n```',
      'async': '⚡ **async**\n\nAsync function modifier.\n\n```lily\nasync fn fetch_data() {\n    // async operations\n}\n```',
    };

    if (hoverDocs[word]) {
      return hoverDocs[word];
    }

    if (word.endsWith('()')) {
      const funcName = word.slice(0, -2);
      const funcDoc = hoverDocs[funcName];
      if (funcDoc) {
        return funcDoc;
      }
    }

    if (ast) {
      for (const node of ast.body) {
        if (node.name === word) {
          switch (node.type) {
            case 'FunctionDeclaration':
              return `⚡ **${word}**\n\n*Function*\n\nDefined at line ${node.start.line + 1}`;
            case 'ClassDeclaration':
              return `🏛️ **${word}**\n\n*Class*\n\nDefined at line ${node.start.line + 1}`;
            case 'VariableDeclaration':
              return `📦 **${word}**\n\n*${node.kind === 'const' ? 'Constant' : 'Variable'}*\n\nDefined at line ${node.start.line + 1}`;
          }
        }
      }
    }

    return null;
  }
}

module.exports = { LilyHoverProvider };
