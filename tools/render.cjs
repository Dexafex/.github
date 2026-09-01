// Renders the organisation profile's images, light and dark, at twice their display size.
// Usage: NODE_PATH=<a node_modules holding playwright> node tools/render.cjs
// Every sentence on the images is the wording of dexafex.com; keep it that way when editing.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'profile', 'assets');
const svg = (name) => fs.readFileSync(path.join(__dirname, 'brand', name), 'utf8');

const themes = {
  light: {
    page: 'linear-gradient(135deg,#fffaf6 0%,#ffffff 55%,#fff3ec 100%)',
    glow: 'rgba(255,74,14,0.16)', ink: '#0e1633', muted: '#5b6478', faint: '#8a92a6',
    card: '#ffffff', cardLine: '#efe7e1', chip: 'rgba(255,74,14,0.08)', chipInk: '#c2370a',
    word: '#0e1633', markBox: '#04183d', shadow: '0 1px 2px rgba(14,22,51,.04),0 12px 32px -12px rgba(14,22,51,.14)',
    hair: '#ece4dd', ghostLine: '#d9d2cc', markRing: 'transparent',
  },
  dark: {
    page: 'linear-gradient(135deg,#0a0f1f 0%,#0c1226 55%,#1a0f0c 100%)',
    glow: 'rgba(255,90,30,0.22)', ink: '#f5f6fa', muted: '#a3abbf', faint: '#7c859b',
    card: 'rgba(255,255,255,0.035)', cardLine: 'rgba(255,255,255,0.09)', chip: 'rgba(255,106,48,0.14)', chipInk: '#ff8a5c',
    word: '#ffffff', markBox: '#04183d', shadow: '0 1px 0 rgba(255,255,255,.04) inset,0 16px 40px -16px rgba(0,0,0,.6)',
    hair: 'rgba(255,255,255,0.08)', ghostLine: 'rgba(255,255,255,0.18)', markRing: 'rgba(255,255,255,0.16)',
  },
};

const orange = '#ff4a0e';

const icon = {
  commodities: `<path d="M3 17h7l1.5-5h-10zM13 17h8l-1.5-5h-5zM7.5 10h9L15 5H9z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>`,
  indices: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>`,
  stocks: `<rect x="3" y="7" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" fill="none" stroke="currentColor" stroke-width="1.7"/>`,
  crypto: `<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9.5 7.5v9M9.5 8h4a2 2 0 0 1 0 4h-4m0 0h4.5a2 2 0 0 1 0 4H9.5M11 6v2M11 16v2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>`,
  spread: `<path d="M4 7h11M4 7l3-3M4 7l3 3M20 17H9M20 17l-3-3M20 17l-3 3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`,
  bolt: `<path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>`,
  percent: `<path d="M19 5 5 19" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="7" cy="7" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="17" cy="17" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/>`,
  shield: `<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="m8.8 12 2.3 2.3 4.3-4.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
};
const ico = (name, size = 22) => `<svg viewBox="0 0 24 24" width="${size}" height="${size}">${icon[name]}</svg>`;

function logo(t, height) {
  const mark = svg('dexafex-mark.svg').replace(/#04183d/g, t.markBox);
  const word = svg('dexafex-wordmark.svg').replace(/#04183d/g, t.word);
  return `<span class="logo" style="height:${height}px">${mark.replace('<svg ', `<svg height="${height}" `)}${word.replace('<svg ', `<svg height="${Math.round(height * 0.5)}" `)}</span>`;
}

const markets = [
  ['Gold', 'Commodities', 'Au', '#d4a017'],
  ['Euro', 'Forex', '€', '#2f6fe4'],
  ['Bitcoin', 'Crypto', 'BTC', '#f7931a'],
  ['Dow Jones', 'Indices', '30', '#c2410c'],
  ['Apple', 'Stocks', 'AAPL', '#334155'],
];

function sections(t) {
  return {
    hero: `
<div class="frame hero">
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="left">
    ${logo(t, 40)}
    <div class="eyebrow">Dexafex <span>·</span> on GitHub</div>
    <h1>Markets,<br>minus the <span class="u">noise.<svg viewBox="0 0 200 16" preserveAspectRatio="none"><path d="M3 11 C 50 3, 120 3, 197 9" stroke="${orange}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M14 14 C 70 9, 130 9, 186 13" stroke="${orange}" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/></svg></span></h1>
    <p class="sub">Trade forex, commodities, stocks, indices, and crypto with Dexafex.</p>
    <div class="chips"><span>Spreads from 0 pips</span><span>Commission-free on Pro and Standard</span><span>24/7 support</span></div>
  </div>
  <div class="right">
    <div class="watch">
      <div class="watch-head"><span class="dot"></span>Popular markets<span class="more">250+ instruments</span></div>
      ${markets.map(([n, c, s, col]) => `<div class="row"><span class="sym" style="background:${col}">${s}</span><span class="nm">${n}</span><span class="cat">${c}</span><span class="go">${ico('arrow', 16)}</span></div>`).join('')}
      <div class="watch-foot">On MetaTrader 5: desktop, web or mobile.</div>
    </div>
  </div>
</div>`,
    markets: `
<div class="frame grid4">
  ${[
    ['commodities', 'Commodities', '12', 'instruments', 'Gold, silver and oil'],
    ['indices', 'Indices', '13', 'indices', 'US, Europe and Asia'],
    ['stocks', 'Stocks', '166', 'shares', 'US and EU shares'],
    ['crypto', 'Crypto', '21', 'coins', 'Bitcoin, Ether and more'],
  ].map(([i, h, n, u, d]) => `<div class="card"><div class="ic">${ico(i)}</div><div class="k">${h}</div><div class="n">${n}<small>${u}</small></div><div class="d">${d}</div></div>`).join('')}
</div>`,
    why: `
<div class="frame grid4">
  ${[
    ['spread', 'Spreads from 0 pips', 'Tight pricing keeps more of every move in your strategy.'],
    ['bolt', 'Fast execution', 'Orders reach the market in fractions of a second.'],
    ['percent', 'No commission', 'Commission-free on Pro and Standard. Swap-free trading is available.'],
    ['shield', 'Client funds stay separate', 'Client funds are held apart from Dexafex operations.'],
  ].map(([i, h, d]) => `<div class="card why"><div class="ic">${ico(i)}</div><div class="h">${h}</div><div class="d">${d}</div></div>`).join('')}
</div>`,
    steps: `
<div class="frame steps">
  ${[
    ['Create your account', 'Under three minutes, email only.'],
    ['Fund it your way', 'Bank, card, or e-wallet.'],
    ['Trade 250+ instruments', 'On MetaTrader 5: desktop, web or mobile.'],
  ].map(([h, d], i) => `<div class="step"><div class="num">${i + 1}</div><div><div class="h">${h}</div><div class="d">${d}</div></div></div>${i < 2 ? '<div class="line"></div>' : ''}`).join('')}
</div>`,
    'btn-register': `<a class="btn solid">Open an account ${ico('arrow', 18)}</a>`,
    'btn-demo': `<a class="btn ghost">Try a free demo</a>`,
    'btn-site': `<a class="btn ghost">dexafex.com</a>`,
    signoff: `
<div class="frame signoff">
  <div class="glow g3"></div>
  ${logo(t, 30)}
  <div class="flex">That’s a flex.</div>
  <div class="d">Spreads, speed, and service that back it up — from your first trade.</div>
</div>`,
  };
}

function page(t, body) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Caveat:wght@600&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:transparent;font-family:Poppins,sans-serif;color:${t.ink};-webkit-font-smoothing:antialiased;padding:0}
#s{display:inline-block}
.frame{position:relative;width:1200px;border-radius:28px;overflow:hidden;background:${t.page};border:1px solid ${t.hair}}
.glow{position:absolute;border-radius:50%;filter:blur(70px);pointer-events:none}
.logo{display:inline-flex;align-items:center;gap:12px}
.logo svg{display:block}
.logo svg:first-child{border-radius:22%;box-shadow:0 0 0 1px ${t.markRing}}
.hero{height:520px;display:flex;padding:56px 60px}
.g1{width:520px;height:520px;right:-120px;top:-200px;background:${t.glow}}
.g2{width:360px;height:360px;left:-160px;bottom:-220px;background:${t.glow};opacity:.6}
.left{flex:1;position:relative;z-index:1;display:flex;flex-direction:column}
.eyebrow{margin-top:44px;color:${orange};font-weight:600;font-size:14px;letter-spacing:.08em}
.eyebrow span{opacity:.6;margin:0 6px}
h1{margin-top:14px;font-weight:600;font-size:74px;line-height:1.02;letter-spacing:-0.045em;color:${t.ink}}
h1 .u{position:relative;display:inline-block}
h1 .u svg{position:absolute;left:-2px;right:-6px;bottom:-8px;width:calc(100% + 8px);height:16px}
.sub{margin-top:26px;font-size:19px;line-height:1.5;color:${t.muted};max-width:470px}
.chips{margin-top:auto;display:flex;gap:10px;flex-wrap:wrap}
.chips span{background:${t.chip};color:${t.chipInk};font-weight:500;font-size:13.5px;padding:8px 14px;border-radius:999px}
.right{width:430px;position:relative;z-index:1;display:flex;align-items:center}
.watch{width:100%;background:${t.card};border:1px solid ${t.cardLine};border-radius:22px;box-shadow:${t.shadow};padding:22px 22px 18px;backdrop-filter:blur(6px)}
.watch-head{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:${t.muted};margin-bottom:10px}
.watch-head .dot{width:8px;height:8px;border-radius:50%;background:${orange};box-shadow:0 0 0 4px rgba(255,74,14,.15)}
.watch-head .more{margin-left:auto;color:${orange};font-weight:600;font-size:13px}
.row{display:flex;align-items:center;gap:14px;padding:12px 4px;border-top:1px solid ${t.hair}}
.row:first-of-type{border-top:0}
.sym{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;color:#fff;font-weight:700;font-size:12px;letter-spacing:-.02em;flex:none}
.nm{font-weight:600;font-size:16.5px}
.cat{margin-left:auto;font-size:12.5px;color:${t.faint};border:1px solid ${t.cardLine};border-radius:999px;padding:3px 10px}
.go{color:${t.faint};display:grid}
.watch-foot{margin-top:10px;padding-top:12px;border-top:1px solid ${t.hair};font-size:12.5px;color:${t.faint}}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:22px;background:${t.page}}
.card{background:${t.card};border:1px solid ${t.cardLine};border-radius:20px;padding:22px 22px 24px;box-shadow:${t.shadow}}
.ic{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:${t.chip};color:${orange}}
.card .k{margin-top:18px;font-size:13px;font-weight:600;letter-spacing:.06em;color:${t.faint};text-transform:uppercase}
.card .n{margin-top:4px;font-size:44px;font-weight:600;letter-spacing:-0.04em;line-height:1.1}
.card .n small{font-size:15px;font-weight:500;letter-spacing:0;color:${t.muted};margin-left:8px}
.card .d{margin-top:6px;font-size:14.5px;color:${t.muted};line-height:1.45}
.card.why .h{margin-top:18px;font-size:18px;font-weight:600;letter-spacing:-0.01em;line-height:1.3}
.card.why .d{margin-top:8px}
.steps{display:flex;align-items:center;padding:34px 40px;gap:0}
.step{display:flex;gap:16px;align-items:center;flex:none}
.step .d{white-space:nowrap}
.num{width:46px;height:46px;border-radius:50%;flex:none;display:grid;place-items:center;font-weight:600;font-size:18px;color:#fff;background:${orange};box-shadow:0 8px 20px -6px rgba(255,74,14,.55)}
.step .h{font-size:18px;font-weight:600;letter-spacing:-0.01em;margin-top:2px}
.step .d{font-size:14.5px;color:${t.muted};margin-top:4px;line-height:1.45}
.line{flex:1;height:0;border-top:2px dashed ${t.ghostLine};margin:0 22px}
.btn{display:inline-flex;align-items:center;gap:10px;height:52px;padding:0 26px;border-radius:14px;font-weight:600;font-size:17px;white-space:nowrap}
.btn.solid{background:${orange};color:#fff;box-shadow:0 10px 24px -10px rgba(255,74,14,.8)}
.btn.ghost{background:${t.card};color:${t.ink};border:1.5px solid ${t.cardLine}}
.signoff{height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.g3{width:500px;height:300px;left:350px;top:-160px;background:${t.glow}}
.signoff .logo{position:relative}
.flex{position:relative;font-family:Caveat,cursive;font-weight:600;font-size:44px;color:${orange};margin-top:6px;transform:rotate(-2deg)}
.signoff .d{position:relative;font-size:15px;color:${t.muted}}
</style></head><body><div id="s">${body}</div></body></html>`;
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  for (const [themeName, t] of Object.entries(themes)) {
    const ctx = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1300, height: 900 } });
    const p = await ctx.newPage();
    for (const [name, body] of Object.entries(sections(t))) {
      await p.setContent(page(t, body), { waitUntil: 'networkidle' });
      await p.evaluate(() => document.fonts.ready);
      const file = path.join(out, `${name}-${themeName}.png`);
      await p.locator('#s > *').first().screenshot({ path: file, omitBackground: true });
      console.log(path.relative(root, file));
    }
    await ctx.close();
  }
  await browser.close();
})();
