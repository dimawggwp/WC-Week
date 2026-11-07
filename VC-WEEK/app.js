/* Polus Bank — interactive prototype. All data is synthetic. No APIs, no databases. */
(() => {
'use strict';

/* ============ utils ============ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = (n, d = 0) => Number(n).toLocaleString('ru-RU', { minimumFractionDigits: d, maximumFractionDigits: d });
const kzt = (n, d = 0) => fmt(n, d) + ' ₸';
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const rnd = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const uid = () => Math.random().toString(36).slice(2, 8).toUpperCase();
const pad2 = n => String(n).padStart(2, '0');
const dt = ts => { const d = new Date(ts); return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()}`; };
const tm = ts => { const d = new Date(ts); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
let USD = 449.18;

/* ============ icons ============ */
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  pie: '<path d="M21 12a9 9 0 1 1-9-9v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12z"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  out: '<path d="M12 19V5M5 12l7-7 7 7"/>',
  in: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  back: '<path d="m15 18-6-6 6-6"/>',
  chev: '<path d="m9 6 6 6-6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
  warn: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M12 8v13M3 12h18M12 8S10 3 7.5 4.5 9 8 12 8zm0 0s2-5 4.5-3.5S15 8 12 8z"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  doc: '<path d="M6 2h9l5 5v15H6z"/><path d="M14 2v6h6M9 13h8M9 17h6"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
  apple: '<path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-3.9zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z"/>',
  logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h11"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  store: '<path d="M3 9 5 4h14l2 5M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 13v8h14v-8"/>',
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

/* ============ market (synthetic) ============ */
const ASSETS = {
  KZT: { name: 'Тенге', color: '#0B0B0B', price: 1, dec: 0, ch: 0, lbl: '₸' },
  GOLD: { name: 'Polus Gold (1 г)', color: '#8FC400', price: 58635, dec: 4, ch: 0.09, lbl: 'Au' },
  BTC: { name: 'Bitcoin', color: '#F7931A', price: 34160588, dec: 6, ch: 0.56, lbl: '₿' },
  ETH: { name: 'Ethereum', color: '#627EEA', price: 1008557, dec: 4, ch: 0.81, lbl: 'Ξ' },
  SOL: { name: 'Solana', color: '#9945FF', price: 40476, dec: 3, ch: 0.47, lbl: 'S' },
  USDT: { name: 'Tether USD', color: '#26A17B', price: 448.79, dec: 2, ch: 0.03, lbl: '₮' },
  TON: { name: 'Toncoin', color: '#0098EA', price: 494.1, dec: 2, ch: 0.98, lbl: 'T' },
};
const EXTRA = [
  ['BNB', 'BNB', '#F0B90B', 311991, 0.61, ['binance coin']],
  ['XRP', 'XRP', '#23292F', 530, -0.94, ['ripple', 'рипл']],
  ['DOGE', 'Dogecoin', '#C2A633', 32.36, 0.18, ['доги', 'дож']],
  ['ADA', 'Cardano', '#0033AD', 82.88, 0.47, ['кардано']],
  ['TRX', 'TRON', '#EB0029', 142.97, 0.09, ['трон']],
  ['AVAX', 'Avalanche', '#E84142', 3741.67, 0.66, ['аваланч']],
  ['LINK', 'Chainlink', '#2A5ADA', 4878, 0.85, ['чейнлинк']],
  ['DOT', 'Polkadot', '#E6007A', 408.12, -1.52, ['полкадот']],
  ['USD', 'Доллар США', '#3E8E00', 449.18, 0, ['dollar', 'доллар'], 'fiat'],
  ['EUR', 'Евро', '#1F4FBF', 501.25, 0, ['euro', 'евро'], 'fiat'],
  ['RUB', 'Российский рубль', '#7A7A7A', 5.5, 0, ['рубль', 'ruble'], 'fiat'],
  ['CNY', 'Китайский юань', '#C8102E', 67.18, 0, ['юань', 'yuan'], 'fiat'],
];
const ALIASES = { GOLD: ['золото', 'gold', 'au', 'pgold'], BTC: ['биткоин', 'биткойн', 'bitcoin'], ETH: ['эфир', 'ethereum', 'эфириум'], SOL: ['solana', 'солана'], USDT: ['tether', 'тезер', 'usdt'], TON: ['toncoin', 'тон'], KZT: ['тенге', 'tenge'] };
EXTRA.forEach(([s, n, c, p, ch, al, kind]) => { ASSETS[s] = { name: n, color: c, price: p, dec: 2, ch, lbl: s[0], extra: 1, kind }; ALIASES[s] = al; });
Object.values(ASSETS).forEach(a => { a.base = a.price; a.open = a.price / (1 + a.ch / 100); });
const HIST = {};
Object.keys(ASSETS).forEach((s, i) => {
  const r = rnd(i * 97 + 13); const a = ASSETS[s]; let v = a.open; const arr = [];
  for (let k = 0; k < 48; k++) { v = v * (1 + (r() - 0.48) * 0.006) + (a.price - v) * (k / 48) * 0.15; arr.push(v); }
  arr.push(a.price); HIST[s] = arr;
});
let goldSeries = (() => { const r = rnd(777); const arr = []; let v = 55600; for (let i = 0; i < 90; i++) { v = v * (1 + (r() - 0.47) * 0.006); arr.push(v); } const k = ASSETS.GOLD.price / arr[arr.length - 1]; return arr.map(x => x * k); })();
const CG = { BTC: 'bitcoin', ETH: 'ethereum', SOL: 'solana', USDT: 'tether', TON: 'the-open-network', BNB: 'binancecoin', XRP: 'ripple', DOGE: 'dogecoin', ADA: 'cardano', TRX: 'tron', AVAX: 'avalanche-2', LINK: 'chainlink', DOT: 'polkadot', GOLD: 'pax-gold' };
const OZ = 31.1035; // грамм в тройской унции: GOLD = цена PAXG (1 унция) / 31,1035
let MKT = { src: 'loading', ts: 0 };
const srcLabel = () => MKT.src === 'live' ? `Реальные курсы · CoinGecko и ExchangeRate-API · обновлено в ${tm(MKT.ts)}` : MKT.src === 'loading' ? 'Загружаем реальные курсы…' : 'Нет связи с источником курсов: показаны последние сохранённые котировки';
const getJSON = (u, ms = 9000) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return fetch(u, { signal: c.signal }).then(r => { clearTimeout(t); if (!r.ok) throw new Error(r.status); return r.json(); }); };
function setPx(k, p, ch, hist) {
  const a = ASSETS[k]; if (!a || !(p > 0)) return;
  a.price = p; a.base = p; a.ch = ch || 0; a.open = p / (1 + a.ch / 100);
  HIST[k] = hist && hist.length > 5 ? [...hist, p] : [...(HIST[k] || []).slice(-59), p];
}
async function loadMarket() {
  try {
    const fx = await getJSON('https://open.er-api.com/v6/latest/USD');
    if (fx && fx.rates && fx.rates.KZT) { USD = fx.rates.KZT; [['USD', 1], ['EUR', fx.rates.EUR], ['RUB', fx.rates.RUB], ['CNY', fx.rates.CNY]].forEach(([k, r]) => { if (r) setPx(k, USD / r, 0); }); }
    const d = await getJSON(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${Object.values(CG).join(',')}&sparkline=true&price_change_percentage=24h`);
    d.forEach(c => {
      const k = Object.keys(CG).find(x => CG[x] === c.id); if (!k || !c.current_price) return;
      const f = k === 'GOLD' ? USD / OZ : USD; const sp = (c.sparkline_in_7d && c.sparkline_in_7d.price) || []; const step = Math.max(1, Math.ceil(sp.length / 60));
      setPx(k, c.current_price * f, c.price_change_percentage_24h, sp.filter((_, i) => i % step === 0).map(v => v * f));
    });
    MKT = { src: 'live', ts: Date.now() };
    if (!loadMarket.gold) {
      loadMarket.gold = 1;
      getJSON('https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=90&interval=daily').then(g => { if (g.prices && g.prices.length > 10) { goldSeries = g.prices.map(x => x[1] * USD / OZ); goldSeries[goldSeries.length - 1] = ASSETS.GOLD.price; if (S.route === 'gold' && !$('.overlay')) rerender(); } }).catch(() => {});
    }
  } catch (e) { MKT = { src: MKT.ts ? 'live' : 'offline', ts: MKT.ts }; }
  refreshLive();
}
const OTC = { spread: 0.003, fee: 0.005, cb: 0.005, cardCbGold: 0.01, cardCbKzt: 0.005, p2pCb: 0.003, sellerFee: 0.005, tax: 0.04 };

/* ============ partners ============ */
const PARTNERS = {
  polus: { name: 'Polus', full: 'Polus Custody', bg: '#0B0B0B', fg: '#C3F53C', t: 'P' },
  binance: { name: 'Binance', full: 'Binance Kazakhstan', bg: '#F0B90B', fg: '#0B0B0B', t: 'BN', hold: { BTC: 0.012, USDT: 820, SOL: 0 } },
  okx: { name: 'OKX', full: 'OKX Kazakhstan', bg: '#111', fg: '#fff', t: 'OK', hold: { SOL: 6.5, ETH: 0.35 } },
  bybit: { name: 'Bybit', full: 'Bybit Kazakhstan', bg: '#1B1D24', fg: '#F7A600', t: 'BY', hold: { BTC: 0.004, USDT: 300 } },
  tonkeeper: { name: 'Tonkeeper', full: 'Tonkeeper', bg: '#0098EA', fg: '#fff', t: 'TK', hold: { TON: 240, USDT: 50 } },
};
const NET = { BTC: 'Bitcoin', ETH: 'Ethereum (ERC-20)', SOL: 'Solana', USDT: 'Tron (TRC-20)', TON: 'TON', GOLD: 'Polus Ledger', KZT: 'Банковский счёт' };
const NETFEE = { BTC: 0.00002, ETH: 0.0004, SOL: 0.001, USDT: 1, TON: 0.05, GOLD: 0 };

/* ============ P2P (synthetic sellers) ============ */
const SELLERS = [
  { id: 's1', name: 'GoldHouse_KZ', rating: 4.92, deals: 2384, done: 98.7, online: 'Онлайн', ip: true, banks: ['Polus', 'Kaspi'] },
  { id: 's2', name: 'AltynTrade', rating: 4.81, deals: 641, done: 96.2, online: 'Онлайн', ip: true, banks: ['Polus', 'Halyk'] },
  { id: 's3', name: 'NomadMetal', rating: 4.95, deals: 9341, done: 99.1, online: '1 мин назад', ip: true, banks: ['Polus', 'Freedom'] },
  { id: 's4', name: 'SaryArqa_OTC', rating: 4.88, deals: 1205, done: 97.4, online: 'Онлайн', ip: true, banks: ['Polus'] },
  { id: 's5', name: 'Bereke_Exchange', rating: 4.63, deals: 208, done: 94.1, online: '5 мин назад', ip: true, banks: ['Polus', 'Kaspi'] },
];
const ORDERS0 = [ // k = цена продавца относительно рыночной (цены живые)
  { id: 'o1', s: 's1', a: 'GOLD', side: 'sell', k: 0.9914, min: 200000, max: 500000, qty: 42.5 },
  { id: 'o2', s: 's2', a: 'GOLD', side: 'sell', k: 1.0052, min: 0, max: 100000, qty: 8.2 },
  { id: 'o3', s: 's3', a: 'GOLD', side: 'sell', k: 0.9974, min: 50000, max: 250000, qty: 19.0 },
  { id: 'o4', s: 's4', a: 'GOLD', side: 'sell', k: 0.9871, min: 500000, max: 3000000, qty: 120 },
  { id: 'o5', s: 's5', a: 'GOLD', side: 'sell', k: 1.012, min: 2000, max: 60000, qty: 3.1 },
  { id: 'o6', s: 's1', a: 'USDT', side: 'sell', k: 1.0023, min: 85000, max: 600000, qty: 1200 },
  { id: 'o7', s: 's3', a: 'USDT', side: 'sell', k: 1.0014, min: 300000, max: 1400000, qty: 3000 },
  { id: 'o8', s: 's5', a: 'USDT', side: 'sell', k: 1.005, min: 5000, max: 90000, qty: 170 },
  { id: 'o9', s: 's4', a: 'GOLD', side: 'buy', k: 0.9845, min: 100000, max: 900000, qty: 30 },
  { id: 'o10', s: 's2', a: 'GOLD', side: 'buy', k: 0.9802, min: 10000, max: 150000, qty: 6 },
  { id: 'o11', s: 's3', a: 'USDT', side: 'buy', k: 0.9969, min: 50000, max: 800000, qty: 1500 },
];
const oPrice = o => o.k ? ASSETS[o.a].price * o.k : oPrice(o);
const REVIEWS0 = {
  s1: [{ st: 5, t: 'Счёт от ИП пришёл сразу, токены разблокировались за 2 минуты.', d: '05.11.2026' }, { st: 5, t: 'Лучшая цена на крупную сумму.', d: '01.11.2026' }],
  s2: [{ st: 5, t: 'Удобно для маленьких сумм.', d: '04.11.2026' }, { st: 4, t: 'Немного ждал подтверждения.', d: '29.10.2026' }],
  s3: [{ st: 5, t: 'Быстро и прозрачно.', d: '06.11.2026' }],
  s4: [{ st: 5, t: 'Хорошая цена от 500 тыс.', d: '02.11.2026' }],
  s5: [{ st: 4, t: 'Ок, но цена выше рынка.', d: '30.10.2026' }],
};

/* ============ state ============ */
const KEY = 'polus-demo-v2';
const now = Date.now();
const H = 3600e3, D = 24 * H;
const fresh = () => ({
  route: 'onboarding', params: {}, ob: 0, phone: '', auth: false, hide: false, role: 'user',
  connected: { polus: true, binance: true, okx: true, bybit: false, tonkeeper: false },
  polus: { KZT: 450000, GOLD: 3.4215, SOL: 1.2, USDT: 0 },
  partner: JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(PARTNERS).filter(([k]) => k !== 'polus').map(([k, v]) => [k, v.hold])))),
  cbGold: 0.1832, cbMode: 'gold',
  card: null,
  txs: [
    { id: 'T9F2A1', ts: now - 3 * H, type: 'cashback', title: 'Кэшбэк золотом', a: 'GOLD', amt: 0.0031, net: 'Polus Ledger', fee: 0, st: 'done', note: '1% с покупки по карте' },
    { id: 'T7KD20', ts: now - 5 * H, type: 'buy', title: 'Покупка GOLD (OTC)', a: 'GOLD', amt: 1.7123, kzt: -100000, net: 'Polus Ledger', fee: 500, feeU: 0.98, st: 'done', rate: 58374 },
    { id: 'T5QX88', ts: now - 1 * D - 2 * H, type: 'in', title: 'Перевод с Binance', a: 'USDT', amt: 200, net: 'Tron (TRC-20)', fee: 1, st: 'done', src: 'binance' },
    { id: 'T4LM31', ts: now - 1 * D - 6 * H, type: 'out', title: 'Вывод на банковскую карту', a: 'KZT', amt: -75000, net: 'Банковский счёт', fee: 225, st: 'done' },
    { id: 'T3PP07', ts: now - 2 * D, type: 'p2p', title: 'P2P: покупка у NomadMetal', a: 'GOLD', amt: 1.2, kzt: -69660, net: 'Polus Ledger', fee: 0, st: 'done', rate: 58050 },
    { id: 'T2SO44', ts: now - 3 * D, type: 'in', title: 'Перевод с OKX', a: 'SOL', amt: 1.2, net: 'Solana', fee: 0.001, st: 'done', src: 'okx' },
    { id: 'T1TP00', ts: now - 4 * D, type: 'topup', title: 'Пополнение с карты', a: 'KZT', amt: 500000, net: 'Банковский счёт', fee: 0, st: 'done' },
  ],
  orders: ORDERS0, reviews: REVIEWS0, myReviews: {},
  seller: null,
  m: { onboard: false, login: false, activated: false, firstBuy: false, cbChosen: null, sessions: 1, deals: 0 },
  chat: [],
});
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
try { if (S.auth) { S.m.sessions = (S.m.sessions || 0) + 1; } } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
let stack = [];

/* ============ balances ============ */
function holdings() { // [{a, src, amt, val}]
  const out = [];
  Object.entries(S.polus).forEach(([a, amt]) => { if (amt > 1e-9) out.push({ a, src: 'polus', amt, val: amt * ASSETS[a].price }); });
  Object.entries(S.partner).forEach(([src, h]) => { if (!S.connected[src]) return; Object.entries(h).forEach(([a, amt]) => { if (amt > 1e-9) out.push({ a, src, amt, val: amt * ASSETS[a].price }); }); });
  return out;
}
function byAsset() {
  const m = {}; holdings().forEach(h => { (m[h.a] ||= { a: h.a, amt: 0, val: 0, src: [] }); m[h.a].amt += h.amt; m[h.a].val += h.val; m[h.a].src.push(h); });
  return Object.values(m).sort((x, y) => y.val - x.val);
}
const total = () => holdings().reduce((s, h) => s + h.val, 0);
const total24 = () => holdings().reduce((s, h) => s + h.amt * ASSETS[h.a].open, 0);
const assetAmt = a => holdings().filter(h => h.a === a).reduce((s, h) => s + h.amt, 0);
const money = v => S.hide ? '•••••• ₸' : kzt(v);
function debit(a, amt) { // take from Polus first, then partners (via partner API)
  let left = amt; const used = [];
  const take = (obj, src) => { const have = obj[a] || 0; const t = Math.min(have, left); if (t > 0) { obj[a] = +(have - t).toFixed(8); left -= t; used.push(src); } };
  take(S.polus, 'polus');
  Object.keys(S.partner).forEach(p => { if (left > 1e-12 && S.connected[p]) take(S.partner[p], p); });
  return used;
}
const credit = (a, amt) => { S.polus[a] = +((S.polus[a] || 0) + amt).toFixed(8); };
const addTx = t => { S.txs.unshift({ id: 'T' + uid(), ts: Date.now(), st: 'done', fee: 0, ...t }); };

/* ============ components ============ */
const FLAG = { USD: '🇺🇸', EUR: '🇪🇺', RUB: '🇷🇺', CNY: '🇨🇳' };
const coin = (a, sm) => { const x = ASSETS[a] || { color: '#333', lbl: '?' }; const isG = a === 'GOLD'; const cls = 'coin' + (sm ? ' sm' : '');
  if (CG[a] && !isG) return `<div class="${cls}" style="background:#fff"><img src="assets/coins/${a}.png" alt="${a}" loading="lazy" onerror="this.parentNode.style.background='${x.color}';this.parentNode.textContent='${x.lbl}'"></div>`;
  if (FLAG[a]) return `<div class="${cls}" style="background:#F4F4F1;font-size:${sm ? 16 : 20}px">${FLAG[a]}</div>`; return `<div class="coin${sm ? ' sm' : ''}" style="background:${isG ? '#0B0B0B' : x.color};color:${isG ? '#C3F53C' : '#fff'}">${x.lbl}</div>`; };
const exBadge = (id, cls = 'ex') => { const p = PARTNERS[id]; return `<div class="${cls}" style="background:${p.bg};color:${p.fg}">${p.t}</div>`; };
const chg = (c, cls = '') => `<span class="${c >= 0 ? 'up' : 'down'} ${cls}">${c >= 0 ? '+' : ''}${fmt(c, 2)}%</span>`;
const chOf = a => (ASSETS[a].price / ASSETS[a].open - 1) * 100;
const priceTxt = a => { const p = ASSETS[a].price; return kzt(p, p < 100 ? 2 : p < 10000 ? 1 : 0); };
function spark(arr, color = '#0B0B0B', w = 320, h = 120, fill = true, cls = 'spark') {
  const mn = Math.min(...arr), mx = Math.max(...arr), r = mx - mn || 1;
  const pts = arr.map((v, i) => [i / (arr.length - 1) * w, h - 6 - (v - mn) / r * (h - 12)]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const gid = 'g' + Math.random().toString(36).slice(2, 7);
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${fill ? `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".22"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${w} ${h} L0 ${h}Z" fill="url(#${gid})"/>` : ''}<path d="${d}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}
const top = (title, opts = {}) => `<div class="top"><div class="l">${opts.noBack ? '' : `<button class="ibtn" data-act="back" aria-label="Назад">${ic('back')}</button>`}<h2>${title}</h2></div>${opts.right || ''}</div>`;
const note = (txt, kind = '', icon = 'info') => `<div class="note ${kind}">${ic(icon)}<div>${txt}</div></div>`;
const kv = (k, v, cls = '') => `<div class="kv ${cls}"><span class="k">${k}</span><span class="v">${v}</span></div>`;
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const NAVR = ['home', 'portfolio', 'p2p', 'card', 'profile'];
const SNAVR = ['sHome', 'sOrders', 'sDeals', 'sTax', 'sProfile'];
const snav = () => `<nav class="nav">${[['sHome', 'home', 'Главная'], ['sOrders', 'doc', 'Ордера'], ['sDeals', 'swap', 'Сделки'], ['sTax', 'chart', 'Налоги'], ['sProfile', 'user', 'Профиль']].map(([r, i, l]) => `<button data-go="${r}" data-root="1" class="${S.route === r ? 'on' : ''}">${ic(i)}${l}</button>`).join('')}</nav>`;
const nav = () => `<nav class="nav">${[['home', 'home', 'Главная'], ['portfolio', 'pie', 'Портфель'], ['p2p', 'users', 'P2P'], ['card', 'card', 'Карта'], ['profile', 'user', 'Профиль']].map(([r, i, l]) => `<button data-go="${r}" data-root="1" class="${S.route === r ? 'on' : ''}">${ic(i)}${l}</button>`).join('')}</nav>`;

/* ============ screens ============ */
const V = {};

V.onboarding = () => {
  const slides = [
    { art: `<div class="orb"><img src="assets/logo.jpg" alt="Polus"></div>`, h: 'Все активы<br>в одном месте', p: 'Тенге, криптовалюта и золото, плюс балансы подключённых бирж Binance, OKX, Bybit и Tonkeeper. Один экран, один итог.' },
    { art: `<div class="orb"><div class="au">Au</div></div>`, h: 'Кэшбэк<br>золотом', p: 'За покупки по карте и покупку криптовалюты кэшбэк приходит токенами GOLD, каждый равен 1 грамму золота.', d: 'Стоимость GOLD следует за ценой золота и может как расти, так и снижаться. Это не депозит, доходность не гарантируется.' },
    { art: `<div class="orb" style="background:radial-gradient(circle at 35% 30%,#fff,#E9E9E4 50%,#8C8C86)">${ic('shield').replace('<svg', '<svg style="width:96px;height:96px;color:#0B0B0B"')}</div>`, h: 'Цена, комиссия<br>и хранение видны', p: 'Перед каждой операцией видны котировка, комиссия, срок действия цены и место хранения актива. Подтверждение через PIN, защита от мошенников 24/7.' },
  ];
  const s = slides[S.ob];
  return `<div class="ob"><div class="art">${s.art}</div><div class="dotsn">${slides.map((_, i) => `<i class="${i === S.ob ? 'on' : ''}"></i>`).join('')}</div><h1>${s.h}</h1><p>${s.p}</p>${s.d ? `<div class="disc">${s.d}</div>` : ''}<div style="margin-top:26px" class="btns">${S.ob < 2 ? `<button class="btn ghost" style="background:#1A1A1A;color:#fff;border-color:#2A2A2A" data-act="obSkip">Пропустить</button><button class="btn lime" data-act="obNext">Далее</button>` : `<button class="btn lime" data-act="obNext">Начать</button>`}</div></div>`;
};

const roleCard = (r, h, t, i) => `<div class="role"><div class="row"><div class="coin" style="background:${r === 'user' ? '#C3F53C' : '#fff'};color:#0B0B0B">${ic(i).replace('<svg', '<svg style="width:20px;height:20px"')}</div><div class="grow"><div class="b" style="font-size:18px">${h}</div></div></div><div class="small" style="color:#A8A8A2;margin-top:8px;line-height:1.45">${t}</div><div class="btns" style="margin-top:14px"><button class="btn ${r === 'user' ? 'lime' : ''}" style="${r === 'user' ? '' : 'background:#fff;color:#0B0B0B'}" data-go="login" data-role="${r}" data-mode="login">Войти</button><button class="btn" style="background:#1A1A1A;color:#fff;border:1px solid #333" data-go="login" data-role="${r}" data-mode="reg">Регистрация</button></div></div>`;
const codesNote = () => `<div class="note" style="margin-top:16px;background:#1A1A1A;color:#CFCFC9">${ic('info')}<div>Тестовый режим. Код из SMS: <b style="color:#C3F53C">1234</b> · PIN: любые 4 цифры (<b>0000</b> = ошибка)</div></div>`;
V.welcome = () => `<div class="scr dark nonav"><div class="top"><img src="assets/logo.jpg" style="width:44px;border-radius:12px" alt=""><span class="pill" style="background:#1A1A1A;color:#C3F53C">Тестовый режим</span></div>
  <h1 style="font-size:30px;font-weight:800;margin-top:12px;line-height:1.1">Как вы хотите<br>войти в Polus?</h1><p style="color:#A8A8A2;margin-top:8px">Роль можно сменить позже в профиле.</p>
  ${roleCard('user', 'Я клиент', 'Храню активы, покупаю золото и крипту, плачу картой и получаю кэшбэк золотом.', 'user')}
  ${roleCard('seller', 'Я продавец P2P', 'Продаю GOLD и USDT по своей цене как ИП. Ордера, сделки, налоги в одном кабинете.', 'store')}
  ${codesNote()}</div>`;
const LT = { 'user-login': ['Вход для клиента', 'По номеру телефона. Без паролей и seed-фраз.'], 'user-reg': ['Регистрация клиента', 'Телефон, SMS-код и PIN. Займёт минуту.'], 'seller-login': ['Вход для продавца', 'Кабинет ИП: ордера, сделки, налоги.'], 'seller-reg': ['Регистрация продавца', 'Телефон, затем данные ИП и проверка KYC.'] };
V.login = p => { const [h, t] = LT[`${p.role || 'user'}-${p.mode || 'login'}`]; return `<div class="scr dark nonav">${top('', { right: `<span class="pill" style="background:#1A1A1A;color:#C3F53C">${p.role === 'seller' ? 'Продавец' : 'Клиент'}</span>` })}
  <h1 style="font-size:30px;font-weight:800;margin-top:10px">${h}</h1><p style="margin-top:8px;color:#A8A8A2">${t}</p>
  <label class="field"><span style="color:#A8A8A2">Номер телефона</span><input class="input big" style="background:#1A1A1A;border-color:#2A2A2A;color:#fff" inputmode="numeric" placeholder="+7 7__ ___ __ __" data-in="phone" value="${esc(S.phone)}" autofocus></label>
  <div style="margin-top:24px"><button class="btn lime" data-act="sendCode" id="sendc" ${S.phone.replace(/\D/g, '').length === 11 ? '' : 'disabled'}>Получить код</button></div>
  <p class="tiny" style="color:#8A8A85;margin-top:16px;line-height:1.5">${p.mode === 'reg' ? 'Регистрируясь, вы принимаете условия обслуживания.' : 'Нет аккаунта? Вернитесь назад и выберите «Регистрация».'} Прототип: SMS не отправляется, номер не сохраняется на сервере.</p></div>`; };

V.code = p => `<div class="scr dark nonav">${top('Код из SMS')}<p style="color:#A8A8A2">Отправили на номер ${maskPhone()}</p>
  <div class="note lime" style="margin-top:16px;color:#0B0B0B">${ic('info')}<div>Тестовый код: <b>1234</b>. Любой другой код покажет ошибку.</div></div>
  <label class="field"><input class="input big ${p.err ? 'err' : ''}" style="background:#1A1A1A;border-color:${p.err ? '#E5484D' : '#2A2A2A'};color:#fff;letter-spacing:.5em;text-align:center" maxlength="4" inputmode="numeric" data-in="code" autofocus></label>
  ${p.err ? `<div class="err-t">Неверный код. Осталось попыток: ${3 - p.err}</div>` : ''}
  <p class="small" style="color:#8A8A85;margin-top:14px">Отправить ещё раз через 0:59</p></div>`;

V.regUser = () => `<div class="scr nonav">${top('Создание аккаунта')}
  <div class="gold-w"><div class="b" style="font-size:18px">Добро пожаловать в Polus</div><div class="small" style="margin-top:6px;line-height:1.5">Последний шаг: примите условия и придумайте PIN для подтверждения операций.</div></div>
  <label class="field"><span>Как к вам обращаться (необязательно)</span><input class="input" id="ru-nick" placeholder="Имя или никнейм"></label>
  <div class="card stack small" style="margin-top:14px">
    <label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" id="ru-1" style="width:20px;height:20px;accent-color:#0B0B0B">Принимаю условия обслуживания и политику конфиденциальности</label>
    <label class="row" style="gap:10px;cursor:pointer"><input type="checkbox" id="ru-2" style="width:20px;height:20px;accent-color:#0B0B0B">Понимаю: GOLD и криптовалюта не депозит, их стоимость может снижаться</label>
  </div>
  <div id="ru-err"></div>
  <button class="btn lime" style="margin-top:14px" data-act="ruGo">Придумать PIN и войти</button></div>`;

const maskPhone = () => { const d = S.phone.replace(/\D/g, ''); return d.length >= 4 ? `+7 ••• ••• •• ${d.slice(-2)}` : '+7 •••'; };

V.home = () => {
  const t = total(), t0 = total24(), c = (t / t0 - 1) * 100;
  const ba = byAsset();
  const legend = ba.slice(0, 6);
  const goldAmt = assetAmt('GOLD');
  return `<div class="scr">
  <div class="top"><div class="l"><div class="avatar"><img src="assets/logo.jpg" alt=""></div><div><div class="tiny muted">Добрый день</div><div class="b">Polus</div></div></div><div class="row" style="gap:8px"><button class="ibtn" data-go="rates" aria-label="Курсы">${ic('search')}</button><button class="ibtn" data-go="support" aria-label="Поддержка">${ic('chat')}</button></div></div>
  <div class="hero">
    <div class="lbl">Все активы <button data-act="hide" style="color:#A8A8A2" aria-label="Скрыть">${ic(S.hide ? 'eyeoff' : 'eye').replace('<svg', '<svg style="width:16px;height:16px"')}</button></div>
    <div class="bal num" data-total>${money(t)}</div>
    <div class="small">${chg(c)} <span style="color:#8A8A85">за 24 ч · ${S.hide ? '•••' : (c >= 0 ? '+' : '') + kzt(t - t0)}</span></div>
    <div class="bar">${ba.map(x => `<i style="width:${x.val / t * 100}%;background:${x.a === 'GOLD' ? '#C3F53C' : ASSETS[x.a].color === '#0B0B0B' ? '#FFFFFF' : ASSETS[x.a].color}"></i>`).join('')}</div>
    <div class="legend">${legend.map(x => `<span><b style="background:${x.a === 'GOLD' ? '#C3F53C' : x.a === 'KZT' ? '#fff' : ASSETS[x.a].color}"></b>${x.a === 'GOLD' ? 'Золото' : x.a} ${fmt(x.val / t * 100, 0)}%</span>`).join('')}</div>
  </div>
  <div class="qa">
    <button data-go="otc" data-side="buy" data-a="GOLD"><i>${ic('plus')}</i>Купить</button>
    <button data-go="withdraw"><i>${ic('out')}</i>Вывести</button>
    <button data-go="p2p" data-root="1"><i>${ic('users')}</i>P2P</button>
    <button data-go="topup"><i>${ic('in')}</i>Пополнить</button>
  </div>
  <div class="sec"><div class="sec-h"><h3>Откуда баланс</h3><a data-go="partners">Управлять</a></div>
    <div class="src-row">${sourceTotals().map(s => `<button class="src" data-go="${s.id === 'polus' ? 'portfolio' : 'partner'}" data-id="${s.id}" ${s.id === 'polus' ? 'data-root="1"' : ''}>${exBadge(s.id)}<span>${PARTNERS[s.id].name}</span><span class="muted">${fmt(s.val / t * 100, 0)}%</span></button>`).join('')}
    ${Object.keys(PARTNERS).some(k => !S.connected[k]) ? `<button class="src add" data-go="partners">${ic('plus').replace('<svg', '<svg style="width:16px;height:16px"')}Подключить</button>` : ''}</div>
  </div>
  <div class="sec"><div class="gold-w" data-go="gold" style="cursor:pointer">
    <div class="between"><span class="b">Ваше золото</span><span class="pill dark">Кэшбэк ${S.cbMode === 'gold' ? 'в золоте' : 'в тенге'}</span></div>
    <div class="big num" style="margin-top:8px">${S.hide ? '•••' : fmt(goldAmt, 4)} г</div>
    <div class="small num">≈ ${money(goldAmt * ASSETS.GOLD.price)} · из них кэшбэк ${fmt(S.cbGold, 4)} г</div>
    <div class="tiny" style="margin-top:8px;opacity:.7">Цена следует за золотом: может расти и снижаться. Не депозит.</div>
  </div></div>
  <div class="sec"><div class="sec-h"><h3>Активы</h3><a data-go="portfolio" data-root="1">Все</a></div><div class="card list">${ba.slice(0, 4).map(assetRow).join('')}</div></div>
  <div class="sec"><div class="sec-h"><h3>Последние операции</h3><a data-go="history">История</a></div><div class="card list">${S.txs.slice(0, 3).map(txRow).join('')}</div></div>
  </div>`;
};
function sourceTotals() { const m = {}; holdings().forEach(h => { m[h.src] = (m[h.src] || 0) + h.val; }); return Object.entries(m).map(([id, val]) => ({ id, val })).sort((a, b) => b.val - a.val); }
const assetRow = x => `<div class="li" data-go="${x.a === 'GOLD' ? 'gold' : 'asset'}" data-a="${x.a}">${coin(x.a)}<div class="grow"><div class="t">${x.a === 'GOLD' ? 'Золото GOLD' : ASSETS[x.a].name}</div><div class="s">${x.src.map(s => PARTNERS[s.src].name).join(' · ')}</div></div><div class="r"><div class="t num">${money(x.val)}</div><div class="s num">${S.hide ? '•••' : fmt(x.amt, x.a === 'KZT' ? 0 : ASSETS[x.a].dec)} ${x.a === 'GOLD' ? 'г' : x.a}</div></div></div>`;
const TXI = { buy: 'plus', sell: 'swap', in: 'in', out: 'out', cashback: 'gift', p2p: 'users', card: 'card', topup: 'in', transfer: 'swap', fail: 'x' };
const txRow = t => { const pos = t.amt > 0; return `<div class="li" data-act="tx" data-id="${t.id}"><div class="coin" style="background:${t.st === 'failed' ? '#FDECEC' : t.type === 'cashback' ? '#C3F53C' : '#F4F4F1'};color:${t.st === 'failed' ? '#E5484D' : '#0B0B0B'}">${ic(t.st === 'failed' ? 'x' : TXI[t.type] || 'swap').replace('<svg', '<svg style="width:18px;height:18px"')}</div><div class="grow"><div class="t" style="font-size:14px">${esc(t.title)}</div><div class="s">${dt(t.ts)}, ${tm(t.ts)} · ${t.net}</div></div><div class="r"><div class="t num ${t.st === 'failed' ? 'muted' : pos ? 'up' : ''}" style="font-size:14px">${t.st === 'failed' ? '' : pos ? '+' : ''}${t.a === 'KZT' ? kzt(t.amt) : fmt(t.amt, ASSETS[t.a].dec) + ' ' + t.a}</div><div class="s">${t.st === 'failed' ? 'Отклонено' : t.st === 'pending' ? 'В обработке' : 'Выполнено'}</div></div></div>`; };

V.portfolio = () => {
  const ba = byAsset(), t = total();
  const st = sourceTotals();
  return `<div class="scr">${top('Портфель', { noBack: true, right: `<button class="ibtn" data-go="history">${ic('clock')}</button>` })}
  <div class="card"><div class="muted small">Стоимость портфеля</div><div class="num" style="font-size:30px;font-weight:800;margin-top:2px" data-total>${money(t)}</div>
  <div class="bar" style="margin:14px 0 6px">${st.map(s => `<i style="width:${s.val / t * 100}%;background:${PARTNERS[s.id].bg === '#111' ? '#555' : PARTNERS[s.id].bg === '#0B0B0B' ? '#C3F53C' : PARTNERS[s.id].bg}"></i>`).join('')}</div>
  <div class="list" style="margin-top:8px">${st.map(s => `<div class="li" data-go="${s.id === 'polus' ? 'custody' : 'partner'}" data-id="${s.id}">${exBadge(s.id)}<div class="grow"><div class="t">${PARTNERS[s.id].full}</div><div class="s">${s.id === 'polus' ? 'Кастодиальное хранение Polus' : 'Партнёр МФЦА · подключено через API'}</div></div><div class="r"><div class="t num">${money(s.val)}</div><div class="s">${fmt(s.val / t * 100, 1)}%</div></div></div>`).join('')}</div></div>
  <div class="sec"><div class="sec-h"><h3>По активам</h3></div><div class="card list">${ba.map(assetRow).join('')}</div></div>
  <div class="sec">${note('Активы на биржах-партнёрах хранятся у партнёра, Polus показывает баланс через API и может переводить по вашему подтверждению. Активы в Polus хранятся на раздельных клиентских кошельках у кастодиана. <a class="link" data-go="custody" style="text-decoration:underline">Подробнее о хранении</a>')}</div>
  </div>`;
};

V.custody = () => `<div class="scr nonav">${top('Как хранятся активы')}
  <div class="card stack">
    <div class="row">${exBadge('polus')}<div class="grow"><div class="b">Polus Custody</div><div class="small muted">Тенге, GOLD и криптовалюта, купленные в Polus</div></div></div>
    ${kv('Тенге', 'Банковский счёт клиента')}${kv('Криптовалюта', 'Раздельные кошельки, холодное хранение ≥ 90%')}${kv('GOLD', '1 токен = 1 г золота 999,9 в хранилище')}${kv('Аудит резервов', 'Ежемесячно, отчёт в приложении')}
  </div>
  <div class="card stack">
    <div class="b">Партнёрские биржи</div>
    <div class="small muted" style="line-height:1.5">Активы остаются на бирже. Polus получает доступ только к просмотру и переводам на ваш счёт в Polus. Вывод на сторонние адреса через Polus запрещён.</div>
  </div>
  <div class="sec">${note('Модель хранения в прототипе является гипотезой и требует проверки регулятором (АФСА / МФЦА). Токен GOLD не депозит, на него не распространяется гарантирование вкладов.', 'amber', 'warn')}</div>
</div>`;

V.asset = p => {
  const a = p.a, A = ASSETS[a], x = byAsset().find(z => z.a === a);
  return `<div class="scr nonav">${top(A.name)}
  <div class="row">${coin(a)}<div class="grow"><div class="num" style="font-size:28px;font-weight:800" data-lp="${a}">${priceTxt(a)}</div><div class="small" data-lc="${a}">${chg(chOf(a))} за 24 ч</div></div></div>
  <div class="card" style="margin-top:14px;padding:12px 4px" data-chart="${a}">${spark(HIST[a], chOf(a) >= 0 ? '#5E9E00' : '#E5484D')}</div>
  <div class="tiny muted" style="margin-top:6px" data-src>${srcLabel()}</div>
  ${x ? `<div class="sec"><div class="sec-h"><h3>Ваш баланс: ${fmt(x.amt, A.dec)} ${a}</h3></div><div class="card list">${x.src.map(s => `<div class="li">${exBadge(s.src)}<div class="grow"><div class="t">${PARTNERS[s.src].full}</div><div class="s">${s.src === 'polus' ? 'Хранение в Polus' : 'На бирже-партнёре'}</div></div><div class="r"><div class="t num">${fmt(s.amt, A.dec)}</div><div class="s num">${money(s.val)}</div></div></div>`).join('')}</div></div>` : ''}
  ${a !== 'KZT' && !A.extra ? `<div class="btns" style="margin-top:20px"><button class="btn" data-go="otc" data-side="buy" data-a="${a}">Купить</button><button class="btn ghost" data-go="otc" data-side="sell" data-a="${a}">Продать</button></div>` : ''}
  </div>`;
};

V.rates = p => `<div class="scr nonav">${top('Курсы валют')}
  <input class="input" placeholder="Поиск: SOL, Solana, золото, евро…" data-in="rq" value="${esc(p.q || '')}" autofocus>
  <div class="tiny muted" style="margin:8px 2px 0" data-src>${srcLabel()}</div>
  <div id="rates-list" style="margin-top:12px">${ratesList(p.q || '')}</div></div>`;
function ratesList(q) {
  q = q.trim().toLowerCase();
  const keys = Object.keys(ASSETS).filter(k => k !== 'KZT').filter(k => !q || k.toLowerCase().includes(q) || ASSETS[k].name.toLowerCase().includes(q) || (ALIASES[k] || []).some(al => al.includes(q)));
  if (!keys.length) return `<div class="card" style="text-align:center;padding:30px"><div class="b">Ничего не нашли</div><div class="small muted" style="margin-top:6px">Попробуйте тикер (BTC) или название (Bitcoin)</div></div>`;
  const hero = q && keys.length <= 2 ? keys[0] : null;
  return (hero ? `<div class="card" style="margin-bottom:12px" data-go="${hero === 'GOLD' ? 'gold' : 'asset'}" data-a="${hero}"><div class="row">${coin(hero)}<div class="grow"><div class="b">${ASSETS[hero].name} · ${hero}</div><div class="small muted">${ASSETS[hero].kind === 'fiat' ? 'Фиатная валюта' : hero === 'GOLD' ? 'Токенизированное золото' : 'Криптовалюта'}</div></div></div><div class="num" style="font-size:30px;font-weight:800;margin-top:12px" data-lp="${hero}">${priceTxt(hero)}</div><div class="small num muted" data-lu="${hero}">≈ $${fmt(ASSETS[hero].price / USD, 2)} · <span data-lc="${hero}">${chg(chOf(hero))}</span></div><div style="margin-top:10px">${spark(HIST[hero], chOf(hero) >= 0 ? '#5E9E00' : '#E5484D', 320, 90)}</div></div>` : '') +
    `<div class="card list">${keys.map(k => `<div class="li" data-go="${k === 'GOLD' ? 'gold' : 'asset'}" data-a="${k}">${coin(k, 1)}<div class="grow"><div class="t">${k}</div><div class="s">${ASSETS[k].name}</div></div>${spark(HIST[k], chOf(k) >= 0 ? '#5E9E00' : '#E5484D', 80, 30, false, 'spark sm')}<div class="r" style="min-width:96px"><div class="t num" data-lp="${k}">${priceTxt(k)}</div><div class="s" data-lc="${k}">${chg(chOf(k))}</div></div></div>`).join('')}</div>`;
}

V.gold = () => {
  const g = assetAmt('GOLD'), A = ASSETS.GOLD;
  const c90 = (A.price / goldSeries[0] - 1) * 100;
  return `<div class="scr nonav">${top('Золото GOLD', { right: `<span class="pill soft">1 GOLD = 1 г</span>` })}
  <div class="card"><div class="muted small">Цена за 1 г</div><div class="num" style="font-size:30px;font-weight:800" data-lp="GOLD">${priceTxt('GOLD')}</div><div class="small">${chg(c90)} <span class="muted">за 90 дней (история, не прогноз)</span></div><div class="tiny muted" style="margin-top:4px" data-src>${srcLabel()}</div>
  <div style="margin-top:10px">${spark(goldSeries, '#7DB300')}</div></div>
  <div class="card"><div class="between"><div><div class="muted small">У вас</div><div class="num" style="font-size:24px;font-weight:800">${fmt(g, 4)} г</div></div><div class="r" style="text-align:right"><div class="muted small">Эквивалент</div><div class="num b" style="font-size:18px">${money(g * A.price)}</div></div></div>
  ${kv('Получено кэшбэком', `${fmt(S.cbGold, 4)} г`)}${kv('Хранение', 'Polus Custody, физическое золото 999,9')}${kv('Комиссия за хранение', '0 ₸')}</div>
  <div class="btns" style="margin-top:14px"><button class="btn lime" data-go="otc" data-side="buy" data-a="GOLD">Купить</button><button class="btn ghost" data-go="otc" data-side="sell" data-a="GOLD">Продать</button></div>
  <button class="btn ghost" style="margin-top:10px" data-go="p2p" data-root="1">${ic('users')}Купить дешевле на P2P</button>
  <div class="sec"><div class="sec-h"><h3>Как работает кэшбэк золотом</h3></div><div class="card stack small" style="line-height:1.5">
    <div class="row"><span class="pill lime">1%</span><span>с покупок по цифровой карте Polus</span></div>
    <div class="row"><span class="pill lime">0,5%</span><span>с покупки криптовалюты и GOLD (OTC)</span></div>
    <div class="row"><span class="pill lime">0,3%</span><span>с покупок на P2P-рынке</span></div>
    <div class="muted">Кэшбэк считается в тенге и сразу конвертируется в GOLD по текущей цене. Купили золото и получили бонус золотом.</div>
  </div></div>
  <div class="sec">${note('<b>Важно.</b> GOLD не является депозитом и не приносит процентов. Его стоимость меняется вместе с рыночной ценой золота: может вырасти или снизиться. Прошлая динамика не гарантирует будущий результат.', 'amber', 'warn')}</div>
  </div>`;
};

/* ---- OTC ---- */
let Q = null; // {a, side, price, exp}
const newQuote = (a, side) => { const m = ASSETS[a].price; Q = { a, side, mid: m, price: side === 'buy' ? m * (1 + OTC.spread) : m * (1 - OTC.spread), exp: Date.now() + 15000 }; };
V.otc = p => {
  const a = p.a || 'GOLD', side = p.side || 'buy';
  if (!Q || Q.a !== a || Q.side !== side) newQuote(a, side);
  const list = ['GOLD', 'BTC', 'ETH', 'SOL', 'USDT', 'TON'];
  return `<div class="scr nonav">${top('Обмен по котировке', { right: `<span class="pill">OTC</span>` })}
  <div class="seg"><button class="${side === 'buy' ? 'on' : ''}" data-act="otcSide" data-v="buy">Купить</button><button class="${side === 'sell' ? 'on' : ''}" data-act="otcSide" data-v="sell">Продать</button></div>
  <div class="chips" style="margin-top:12px">${list.map(k => `<button class="chip ${k === a ? 'on' : ''}" data-act="otcAsset" data-v="${k}">${k === 'GOLD' ? 'Золото' : k}</button>`).join('')}</div>
  <label class="field"><span>${side === 'buy' ? 'Сумма в тенге' : `Количество ${a === 'GOLD' ? 'GOLD (г)' : a}`}</span><input class="input big num" inputmode="decimal" data-in="otc" value="${esc(p.v || '')}" placeholder="0"></label>
  <div class="small muted" style="margin-top:6px">${side === 'buy' ? `Доступно: ${kzt(S.polus.KZT)}` : `Доступно: ${fmt(assetAmt(a), ASSETS[a].dec)} ${a}`} <a class="link" data-act="otcMax" style="color:#0B0B0B;text-decoration:underline">Макс</a></div>
  <div class="chips" style="margin-top:10px">${(side === 'buy' ? [10000, 50000, 100000, 300000] : []).map(v => `<button class="chip" data-act="otcPreset" data-v="${v}">${fmt(v)} ₸</button>`).join('')}</div>
  <div class="card" style="margin-top:14px" id="otc-q"></div>
  <div style="margin-top:14px"><button class="btn" id="otc-go" data-act="otcConfirm" disabled>Продолжить</button></div>
  <div style="margin-top:12px">${note(a === 'GOLD' ? 'Стоимость GOLD может снижаться. Это не депозит и не инвестиционный продукт с гарантированным доходом.' : 'Криптовалюта волатильна: стоимость может значительно измениться за короткое время.', 'amber', 'warn')}</div>
  </div>`;
};
function otcCalc() {
  const p = S.params, a = p.a || 'GOLD', side = p.side || 'buy';
  const v = parseFloat(String(p.v || '').replace(',', '.').replace(/\s/g, '')) || 0;
  if (!Q) newQuote(a, side);
  if (side === 'buy') {
    const fee = v * OTC.fee, net = v - fee, qty = net / Q.price, cb = v * OTC.cb / ASSETS.GOLD.price;
    return { a, side, v, fee, qty, cb, total: v, feeU: fee / ASSETS.USDT.price, err: v > S.polus.KZT ? 'funds' : v > 0 && v < 1000 ? 'min' : null };
  }
  const gross = v * Q.price, fee = gross * OTC.fee, recv = gross - fee;
  return { a, side, v, fee, qty: v, recv, total: recv, feeU: fee / ASSETS.USDT.price, err: v > assetAmt(a) + 1e-9 ? 'funds' : v > 0 && gross < 1000 ? 'min' : null };
}
function otcUpdate() {
  const el = $('#otc-q'); if (!el) return;
  const c = otcCalc(), A = ASSETS[c.a], left = Math.max(0, Math.ceil((Q.exp - Date.now()) / 1000));
  const unit = c.a === 'GOLD' ? 'г' : c.a;
  el.innerHTML = `<div class="between"><span class="b">Котировка</span><span class="pill ${left <= 5 ? 'amber' : 'soft'}">${ic('clock').replace('<svg', '<svg style="width:13px;height:13px"')} цена фиксирована ${left} с</span></div>
    ${kv('Курс 1 ' + unit, kzt(Q.price, Q.price < 10000 ? 2 : 0))}
    ${kv('Рыночная цена', kzt(Q.mid, Q.mid < 10000 ? 2 : 0) + ` <span class="muted tiny">спред ${OTC.spread * 100}%</span>`)}
    ${kv('Комиссия Polus 0,5%', `${kzt(c.fee)} <span class="muted tiny">≈ ${fmt(c.feeU, 2)} USDT</span>`)}
    ${c.side === 'buy' ? kv('Вы получите', `${fmt(c.qty, A.dec)} ${unit}`, 'total') + kv('Кэшбэк золотом 0,5%', `<span class="up">+${fmt(c.cb, 4)} г GOLD</span>`) + kv('Хранение', 'Polus Custody') : kv('Вы получите', kzt(c.recv), 'total') + kv('Зачисление', 'Счёт KZT в Polus, мгновенно')}
    ${c.err === 'funds' ? `<div class="err-t">Недостаточно средств. ${c.side === 'buy' ? '<a class="link" data-go="topup" style="color:#E5484D;text-decoration:underline">Пополнить баланс</a>' : ''}</div>` : c.err === 'min' ? '<div class="err-t">Минимальная сумма операции: 1 000 ₸</div>' : ''}`;
  const b = $('#otc-go'); if (b) b.disabled = !(c.v > 0);
}
setInterval(() => { if (S.route === 'otc' && Q) { if (Date.now() > Q.exp) { newQuote(Q.a, Q.side); toast('Котировка обновлена'); } otcUpdate(); } }, 1000);

/* ---- withdraw / topup ---- */
V.withdraw = p => {
  const tab = p.tab || 'fiat';
  return `<div class="scr nonav">${top('Вывод средств')}
  <div class="seg"><button class="${tab === 'fiat' ? 'on' : ''}" data-act="wTab" data-v="fiat">На карту / счёт</button><button class="${tab === 'crypto' ? 'on' : ''}" data-act="wTab" data-v="crypto">Криптовалюта</button></div>
  ${tab === 'fiat' ? `
  <div class="card list" style="margin-top:12px">
    <div class="li" data-act="wDest" data-v="card">${ic('card')}<div class="grow"><div class="t">Карта другого банка</div><div class="s">•• •• (номер скрыт в прототипе)</div></div><span class="pill ${(p.dest || 'card') === 'card' ? 'lime' : ''}">${(p.dest || 'card') === 'card' ? 'Выбрано' : ''}</span></div>
    <div class="li" data-act="wDest" data-v="iban">${ic('doc')}<div class="grow"><div class="t">Банковский счёт</div><div class="s">IBAN скрыт в прототипе</div></div><span class="pill ${p.dest === 'iban' ? 'lime' : ''}">${p.dest === 'iban' ? 'Выбрано' : ''}</span></div>
  </div>
  <label class="field"><span>Сумма, ₸ · доступно ${kzt(S.polus.KZT)}</span><input class="input big num" inputmode="numeric" data-in="w" value="${esc(p.v || '')}" placeholder="0"></label>
  <div class="card" style="margin-top:12px" id="w-q"></div>` : `
  <div class="chips" style="margin-top:12px">${['USDT', 'BTC', 'SOL', 'TON', 'ETH'].map(k => `<button class="chip ${(p.a || 'USDT') === k ? 'on' : ''}" data-act="wAsset" data-v="${k}">${k}</button>`).join('')}</div>
  <label class="field"><span>Получатель</span><div class="input" style="display:flex;align-items:center;gap:8px;color:#6E6E69">${ic('lock').replace('<svg', '<svg style="width:16px;height:16px"')} Адрес из адресной книги (скрыт в прототипе)</div></label>
  <label class="field"><span>Количество · доступно ${fmt(assetAmt(p.a || 'USDT'), ASSETS[p.a || 'USDT'].dec)}</span><input class="input big num" inputmode="decimal" data-in="w" value="${esc(p.v || '')}" placeholder="0"></label>
  <div class="card" style="margin-top:12px" id="w-q"></div>`}
  <label class="row" style="margin-top:14px;font-size:13px;gap:10px;cursor:pointer"><input type="checkbox" id="w-ack" style="width:20px;height:20px;accent-color:#0B0B0B"> Меня никто не торопит и не просит перевести деньги «для безопасности» или «сотруднику банка»</label>
  <div style="margin-top:14px"><button class="btn" data-act="wGo">Вывести</button></div></div>`;
};
function wCalc() {
  const p = S.params, tab = p.tab || 'fiat', v = parseFloat(String(p.v || '').replace(',', '.').replace(/\s/g, '')) || 0;
  if (tab === 'fiat') { const fee = Math.max(100, v * 0.003); return { tab, v, fee, recv: v - fee, a: 'KZT', err: v > S.polus.KZT ? 'Недостаточно средств' : v > 0 && v < 1000 ? 'Минимум 1 000 ₸' : v > 2000000 ? 'Превышен суточный лимит 2 000 000 ₸' : null }; }
  const a = p.a || 'USDT', fee = NETFEE[a]; return { tab, a, v, fee, recv: v - fee, err: v > assetAmt(a) + 1e-9 ? 'Недостаточно средств' : v > 0 && v <= fee ? 'Сумма меньше комиссии сети' : null };
}
function wUpdate() {
  const el = $('#w-q'); if (!el) return; const c = wCalc();
  el.innerHTML = c.tab === 'fiat' ? `${kv('Комиссия 0,3% (мин. 100 ₸)', kzt(c.fee))}${kv('Получатель получит', kzt(Math.max(0, c.recv)), 'total')}${kv('Срок', 'До 15 минут')}${c.err ? `<div class="err-t">${c.err}</div>` : ''}`
    : `${kv('Сеть', NET[c.a])}${kv('Комиссия сети', `${fmt(c.fee, ASSETS[c.a].dec)} ${c.a}`)}${kv('Получатель получит', `${fmt(Math.max(0, c.recv), ASSETS[c.a].dec)} ${c.a}`, 'total')}${kv('Задержка для нового адреса', '24 ч (защита)')}${c.err ? `<div class="err-t">${c.err}</div>` : ''}`;
}
V.topup = p => `<div class="scr nonav">${top('Пополнение')}
  <div class="card list"><div class="li">${ic('card')}<div class="grow"><div class="t">С карты любого банка РК</div><div class="s">Мгновенно · без комиссии</div></div><span class="pill lime">Выбрано</span></div></div>
  <label class="field"><span>Сумма, ₸</span><input class="input big num" inputmode="numeric" data-in="tp" value="${esc(p.v || '')}" placeholder="0"></label>
  <div class="chips" style="margin-top:10px">${[50000, 100000, 250000, 500000].map(v => `<button class="chip" data-act="tpPreset" data-v="${v}">${fmt(v)} ₸</button>`).join('')}</div>
  <div style="margin-top:16px">${note('Тестовое пополнение: реальные деньги не списываются.')}</div>
  <div style="margin-top:14px"><button class="btn lime" data-act="tpGo">Пополнить</button></div></div>`;

/* ---- result ---- */
V.result = p => `<div class="scr nonav"><div class="result"><div class="ic ${p.ok ? '' : 'err'}">${ic(p.ok ? 'check' : 'x')}</div><h2>${p.h}</h2><p>${p.t || ''}</p></div>
  ${p.rows ? `<div class="card" style="margin-top:22px">${p.rows}</div>` : ''}
  ${p.cb ? `<div class="gold-w" style="margin-top:12px"><div class="row"><span style="font-size:26px">✦</span><div><div class="b">+${p.cb} г GOLD кэшбэком</div><div class="small" style="opacity:.75">Уже на вашем золотом балансе</div></div></div></div>` : ''}
  <div class="stack" style="margin-top:22px">${p.ok ? `<button class="btn" data-go="${S.role === 'seller' ? 'sHome' : 'home'}" data-root="1">На главную</button>${p.txid ? `<button class="btn ghost" data-act="tx" data-id="${p.txid}">Детали операции</button>` : ''}` : `${p.fix ? `<button class="btn" data-go="${p.fix}">${p.fixT}</button>` : ''}<button class="btn ghost" data-act="back">Назад</button><button class="btn ghost" data-go="support">Написать в поддержку</button>`}</div></div>`;

/* ---- history ---- */
V.history = p => {
  const f = p.f || 'all';
  const F = { all: () => 1, in: t => t.amt > 0 && t.type !== 'cashback', out: t => t.amt < 0 || t.type === 'out', cashback: t => t.type === 'cashback', p2p: t => t.type === 'p2p', card: t => t.type === 'card' };
  const list = S.txs.filter(F[f]);
  const groups = {}; list.forEach(t => { (groups[dt(t.ts)] ||= []).push(t); });
  return `<div class="scr nonav">${top('История операций')}
  <div class="chips">${[['all', 'Все'], ['in', 'Поступления'], ['out', 'Списания'], ['cashback', 'Кэшбэк'], ['p2p', 'P2P'], ['card', 'Карта']].map(([k, l]) => `<button class="chip ${k === f ? 'on' : ''}" data-act="hf" data-v="${k}">${l}</button>`).join('')}</div>
  ${Object.entries(groups).map(([d, ts]) => `<div class="sec" style="margin-top:16px"><div class="small muted b" style="margin-bottom:8px">${d === dt(Date.now()) ? 'Сегодня' : d}</div><div class="card list">${ts.map(txRow).join('')}</div></div>`).join('') || `<div class="card" style="margin-top:14px;text-align:center" class="muted">Операций нет</div>`}
  </div>`;
};
function txSheet(id) {
  const t = S.txs.find(x => x.id === id); if (!t) return;
  const amt = t.a === 'KZT' ? kzt(t.amt) : `${fmt(t.amt, ASSETS[t.a].dec)} ${t.a}`;
  sheet(`<h3>${esc(t.title)}</h3><div class="num" style="font-size:28px;font-weight:800;margin:6px 0 4px" class="${t.amt > 0 ? 'up' : ''}">${t.amt > 0 ? '+' : ''}${amt}</div>
    <span class="pill ${t.st === 'failed' ? 'red' : t.st === 'pending' ? 'amber' : 'soft'}">${t.st === 'failed' ? 'Отклонено' : t.st === 'pending' ? 'В обработке' : 'Выполнено'}</span>
    <div style="margin-top:14px">${kv('Дата', dt(t.ts))}${kv('Время', tm(t.ts))}${kv('Сеть / канал', t.net)}${kv('Валюта', t.a === 'GOLD' ? 'GOLD (1 г золота)' : t.a)}${t.kzt ? kv('Сумма в тенге', kzt(t.kzt)) : ''}${t.rate ? kv('Курс', kzt(t.rate, 0)) : ''}${kv('Комиссия', t.fee ? (t.a === 'KZT' || t.type === 'buy' || t.type === 'p2p' ? kzt(t.fee) : fmt(t.fee, ASSETS[t.a].dec) + ' ' + t.a) + (t.feeU ? ` (${fmt(t.feeU, 2)} USDT)` : '') : '0 ₸')}${t.src ? kv('Источник', PARTNERS[t.src].full) : ''}${t.note ? kv('Комментарий', esc(t.note)) : ''}${kv('ID операции', t.id)}${kv('Адрес / реквизиты', '<span class="muted">скрыты в прототипе</span>')}</div>
    <div class="btns" style="margin-top:16px"><button class="btn ghost" data-act="close">Закрыть</button><button class="btn ghost" data-act="dispute" data-id="${t.id}">Оспорить</button></div>`);
}

/* ---- partners ---- */
V.partners = () => `<div class="scr nonav">${top('Биржи-партнёры')}
  ${note('Подтверждённые партнёры МФЦА. Подключение даёт Polus доступ только к просмотру балансов и переводам на ваш счёт в Polus. Ключи и seed-фразы мы не запрашиваем.', 'lime', 'shield')}
  <div class="card list" style="margin-top:12px">${Object.keys(PARTNERS).filter(k => k !== 'polus').map(k => { const on = S.connected[k]; const v = on ? Object.entries(S.partner[k]).reduce((s, [a, n]) => s + n * ASSETS[a].price, 0) : 0; return `<div class="li" ${on ? `data-go="partner" data-id="${k}"` : `data-act="connect" data-id="${k}"`}>${exBadge(k)}<div class="grow"><div class="t">${PARTNERS[k].full}</div><div class="s">${on ? 'Подключено · ' + money(v) : 'Подтверждённый партнёр МФЦА'}</div></div>${on ? `<span class="pill soft">${ic('check').replace('<svg', '<svg style="width:12px;height:12px"')} Активно</span>` : `<span class="pill dark">Подключить</span>`}</div>`; }).join('')}</div>
  <div class="sec"><div class="sec-h"><h3>Что может Polus после подключения</h3></div><div class="card stack small">
    <div class="row">${ic('check').replace('<svg', '<svg style="width:18px;height:18px;color:#5E9E00"')}<span>Показывать балансы в общем портфеле</span></div>
    <div class="row">${ic('check').replace('<svg', '<svg style="width:18px;height:18px;color:#5E9E00"')}<span>Переводить активы на ваш счёт в Polus по вашему PIN</span></div>
    <div class="row">${ic('x').replace('<svg', '<svg style="width:18px;height:18px;color:#E5484D"')}<span>Выводить средства на сторонние адреса</span></div>
    <div class="row">${ic('x').replace('<svg', '<svg style="width:18px;height:18px;color:#E5484D"')}<span>Торговать без вашего подтверждения</span></div>
  </div></div></div>`;
V.partner = p => {
  const k = p.id, P2 = PARTNERS[k], h = S.partner[k] || {};
  return `<div class="scr nonav">${top(P2.full)}
  <div class="card"><div class="row">${exBadge(k)}<div class="grow"><div class="b">${P2.full}</div><div class="small muted">Подключено через API · только чтение и переводы в Polus</div></div></div></div>
  <div class="sec"><div class="sec-h"><h3>Балансы на бирже</h3></div><div class="card list">${Object.entries(h).filter(([, n]) => n > 0).map(([a, n]) => `<div class="li">${coin(a)}<div class="grow"><div class="t">${a}</div><div class="s">${NET[a]}</div></div><div class="r"><div class="t num">${fmt(n, ASSETS[a].dec)}</div><div class="s num">${money(n * ASSETS[a].price)}</div></div></div>`).join('') || '<div class="muted small">Пусто</div>'}</div></div>
  <div class="stack" style="margin-top:16px"><button class="btn" data-act="pTransfer" data-id="${k}">${ic('swap')}Перевести в Polus</button><button class="btn ghost" data-act="disconnect" data-id="${k}">Отключить</button></div></div>`;
};

/* ---- P2P ---- */
V.p2p = p => {
  const side = p.side || 'buy', a = p.a || 'GOLD';
  const budget = parseFloat(String(p.b || '').replace(/\s/g, '')) || 0;
  const want = side === 'buy' ? 'sell' : 'buy';
  let list = S.orders.filter(o => o.a === a && o.side === want && o.active !== false && o.s !== 'me');
  list.sort((x, y) => side === 'buy' ? oPrice(x) - oPrice(y) : oPrice(y) - oPrice(x));
  const fits = o => !budget || (budget >= o.min && budget <= o.max);
  const best = budget ? list.find(fits) : null;
  if (budget) list = [...list.filter(fits), ...list.filter(o => !fits(o))];
  const otcPrice = ASSETS[a].price * (1 + (side === 'buy' ? 1 : -1) * OTC.spread);
  return `<div class="scr">
  <div class="top"><h2>P2P-рынок</h2><button class="btn sm" ${S.seller ? 'data-act="toSeller"' : 'data-go="sellerReg"'}>${ic('store').replace('<svg', '<svg style="width:16px;height:16px"')}${S.seller ? 'Кабинет' : 'Стать продавцом'}</button></div>
  <div class="seg"><button class="${side === 'buy' ? 'on' : ''}" data-act="p2pSide" data-v="buy">Купить</button><button class="${side === 'sell' ? 'on' : ''}" data-act="p2pSide" data-v="sell">Продать</button></div>
  <div class="row" style="margin-top:12px;gap:8px"><div class="chips">${['GOLD', 'USDT'].map(k => `<button class="chip ${k === a ? 'on' : ''}" data-act="p2pAsset" data-v="${k}">${k === 'GOLD' ? 'Золото' : k}</button>`).join('')}</div><input class="input" style="height:40px;flex:1;border-radius:999px;font-size:14px" placeholder="Мой бюджет, ₸" inputmode="numeric" data-in="p2pb" value="${esc(p.b || '')}"></div>
  <div class="note lime" style="margin-top:12px">${ic('shield')}<div>Только верифицированные продавцы с ИП. Токены продавца блокируются в эскроу Polus до оплаты. Отзыв можно оставить только после сделки.</div></div>
  ${best ? `<div class="small" style="margin-top:12px"><b>Лучшая цена для ${kzt(budget)}:</b> ${kzt(best.price)} · выгода против OTC <span class="up b">${kzt(Math.abs(otcPrice - best.price) * budget / best.price)}</span></div>` : budget ? `<div class="err-t" style="margin-top:12px">Нет ордеров под эту сумму. Измените бюджет.</div>` : ''}
  <div class="card" style="margin-top:12px">${list.map(o => { const s = SELLERS.find(x => x.id === o.s) || { name: 'Вы', rating: 5, deals: 0, done: 100, online: 'Онлайн' }; const r = sellerRating(o.s); const ok = fits(o); return `<div class="ord ${best && best.id === o.id ? 'best' : ''} ${budget && !ok ? 'dim' : ''}">
    <div class="between"><div class="row" style="gap:8px"><span class="nm" data-act="sellerInfo" data-id="${o.s}" style="cursor:pointer">${esc(s.name)}</span><span class="pill soft tiny">ИП ✓</span></div><span class="tiny muted">● ${s.online}</span></div>
    <div class="tiny muted" style="margin-top:3px">Сделок: ${fmt(s.deals + (S.m.dealsBy?.[o.s] || 0))} (${fmt(s.done, 1)}%) · <span class="stars">★</span> ${fmt(r, 2)}</div>
    <div class="between"><div><div class="pr num">${kzt(oPrice(o), a === 'USDT' ? 2 : 0)} <span class="tiny muted">за 1 ${a === 'GOLD' ? 'г' : a}</span></div><div class="small muted">Лимит ${fmt(o.min)}–${fmt(o.max)} ₸ · Доступно ${fmt(o.qty, a === 'GOLD' ? 2 : 0)} ${a === 'GOLD' ? 'г' : a}</div></div>
    <button class="btn sm ${side === 'buy' ? 'lime' : ''}" data-act="p2pOpen" data-id="${o.id}">${side === 'buy' ? 'Купить' : 'Продать'}</button></div>
    ${best && best.id === o.id ? '<div class="tiny b" style="margin-top:6px;color:#3E5A00">✦ Лучшая цена под ваш бюджет</div>' : ''}</div>`; }).join('') || '<div class="muted small">Ордеров нет</div>'}</div>
  <div class="tiny muted" style="margin-top:10px">Рыночная цена OTC: ${kzt(otcPrice, a === 'USDT' ? 2 : 0)}. Комиссия Polus для покупателя 0 ₸, для продавца 0,5% в USDT.</div>
  </div>`;
};
const sellerRating = id => { const s = SELLERS.find(x => x.id === id); if (!s) return 5; const extra = (S.myReviews[id] || []); return (s.rating * s.deals + extra.reduce((a, r) => a + r.st, 0)) / (s.deals + extra.length); };
function sellerSheet(id) {
  const s = SELLERS.find(x => x.id === id); if (!s) return;
  const revs = [...(S.myReviews[id] || []).map(r => ({ ...r, mine: 1 })), ...(S.reviews[id] || [])];
  sheet(`<h3>${esc(s.name)}</h3><div class="row" style="gap:6px;flex-wrap:wrap"><span class="pill soft">ИП верифицирован</span><span class="pill soft">KYC пройден</span><span class="pill">${s.online}</span></div>
  <div class="mgrid" style="margin-top:14px"><div class="metric"><div class="tiny muted">Рейтинг</div><div class="v">${fmt(sellerRating(id), 2)}</div><div class="stars small">${stars(sellerRating(id))}</div></div><div class="metric"><div class="tiny muted">Успешных сделок</div><div class="v">${fmt(s.deals)}</div><div class="small muted">${fmt(s.done, 1)}% завершено</div></div></div>
  <div class="sec" style="margin-top:16px"><div class="sec-h"><h3>Отзывы</h3><span class="tiny muted">только после сделки</span></div>
  ${revs.map(r => `<div style="padding:10px 0;border-top:1px solid #E6E6E1"><div class="between"><span class="stars small">${stars(r.st)}</span><span class="tiny muted">${r.d}</span></div><div class="small" style="margin-top:4px">${esc(r.t || 'Без комментария')}</div><div class="tiny" style="color:#3E5A00;margin-top:4px">✓ Подтверждённая сделка${r.mine ? ' · ваш отзыв' : ''}</div></div>`).join('')}</div>
  <button class="btn ghost" style="margin-top:12px" data-act="close">Закрыть</button>`);
}
function p2pOpen(id) {
  const o = S.orders.find(x => x.id === id), s = SELLERS.find(x => x.id === o.s) || { name: 'Вы' }, side = S.params.side || 'buy';
  const b = parseFloat(String(S.params.b || '').replace(/\s/g, '')) || o.min || 10000;
  const unit = o.a === 'GOLD' ? 'г' : o.a;
  sheet(`<h3>${side === 'buy' ? 'Купить' : 'Продать'} ${o.a === 'GOLD' ? 'золото' : o.a}</h3><div class="small muted">у ${esc(s.name)} · ${kzt(oPrice(o), o.a === 'USDT' ? 2 : 0)} за 1 ${unit}</div>
  <label class="field"><span>Сумма, ₸ (лимит ${fmt(o.min)}–${fmt(o.max)})</span><input class="input big num" inputmode="numeric" id="p2p-amt" value="${Math.min(Math.max(b, o.min), o.max)}"></label>
  <div id="p2p-calc" style="margin-top:10px"></div>
  <div class="steps small" style="margin-top:14px"><div class="st"><b>1. Эскроу</b><div class="s">Токены продавца блокируются в Polus</div></div><div class="st"><b>2. Счёт от ИП</b><div class="s">Продавец выставляет счёт на оплату</div></div><div class="st"><b>3. Оплата</b><div class="s">Вы оплачиваете с баланса Polus</div></div><div class="st"><b>4. Получение</b><div class="s">Токены переходят вам, затем отзыв</div></div></div>
  <button class="btn lime" id="p2p-start" data-act="p2pStart" data-id="${id}">Начать сделку</button>`);
  const calc = () => {
    const v = parseFloat($('#p2p-amt').value.replace(/\s/g, '')) || 0, q = v / oPrice(o), otc = ASSETS[o.a].price * (1 + (side === 'buy' ? 1 : -1) * OTC.spread);
    const bad = v < o.min || v > o.max, nf = side === 'buy' ? v > S.polus.KZT : q > assetAmt(o.a);
    $('#p2p-calc').innerHTML = `<div class="card" style="padding:12px 14px">${kv(side === 'buy' ? 'Вы получите' : 'Вы отдадите', `${fmt(q, o.a === 'GOLD' ? 4 : 2)} ${unit}`)}${kv('Комиссия для вас', '0 ₸')}${side === 'buy' && o.a !== 'USDT' ? kv('Кэшбэк 0,3%', `<span class="up">+${fmt(v * OTC.p2pCb / ASSETS.GOLD.price, 4)} г GOLD</span>`) : ''}${kv('Выгода против OTC', `<span class="up">${kzt(Math.abs(otc - oPrice(o)) * q)}</span>`)}</div>${bad ? `<div class="err-t">Сумма вне лимита ордера: ${fmt(o.min)}–${fmt(o.max)} ₸</div>` : nf ? `<div class="err-t">Недостаточно средств на балансе</div>` : ''}`;
    $('#p2p-start').disabled = bad || nf || !v;
  };
  $('#p2p-amt').addEventListener('input', calc); calc();
}
let DEAL = null;
V.deal = () => {
  if (!DEAL) return V.p2p({});
  const d = DEAL, o = d.o, s = SELLERS.find(x => x.id === o.s) || { name: 'Покупатель' }, unit = o.a === 'GOLD' ? 'г' : o.a;
  const steps = [['Токены заблокированы в эскроу', `${fmt(d.q, 4)} ${unit} продавца удерживает Polus`], ['Счёт от ИП выставлен', `Счёт № ${d.inv} · реквизиты ИП скрыты в прототипе`], ['Оплата', d.step > 2 ? `Оплачено ${kzt(d.v)} с баланса Polus` : 'Оплатите счёт в течение 15 минут'], ['Продавец подтвердил', 'Токены разблокированы и зачислены вам'], ['Сделка завершена', 'Оставьте отзыв о продавце']];
  return `<div class="scr nonav">${top('Сделка #' + d.id, { right: `<span class="pill ${d.step >= 4 ? 'soft' : 'amber'}">${d.step >= 4 ? 'Завершена' : 'В процессе'}</span>` })}
  <div class="card"><div class="between"><div><div class="small muted">${d.side === 'buy' ? 'Покупка' : 'Продажа'} у ${esc(s.name)}</div><div class="num" style="font-size:24px;font-weight:800">${fmt(d.q, 4)} ${unit}</div></div><div style="text-align:right"><div class="small muted">Сумма</div><div class="num b">${kzt(d.v)}</div></div></div>${kv('Цена', kzt(d.price, o.a === 'USDT' ? 2 : 0))}${kv('Комиссия для вас', '0 ₸')}</div>
  <div class="card"><div class="steps">${steps.map((st, i) => `<div class="st ${i < d.step ? 'done' : i === d.step ? 'act' : ''}"><b>${st[0]}</b><div class="s">${st[1]}</div></div>`).join('')}</div>
  ${d.step === 0 || d.step === 1 || d.step === 3 ? '<div class="spin" style="margin:6px auto 0;width:28px;height:28px;border-width:3px"></div>' : ''}</div>
  ${d.step === 2 ? `<div style="margin-top:14px"><button class="btn lime" data-act="dealPay">Оплатить счёт ${kzt(d.v)}</button></div>` : ''}
  ${d.step >= 4 && !d.reviewed ? `<div class="card" style="margin-top:14px;text-align:center"><div class="b">Как прошла сделка?</div><div class="small muted">Отзыв доступен только участникам завершённой сделки</div><div class="star-in">${[1, 2, 3, 4, 5].map(i => `<button class="${i <= (d.st || 0) ? 'on' : ''}" data-act="rate" data-v="${i}">★</button>`).join('')}</div><textarea class="input" style="height:80px;padding:12px" placeholder="Комментарий (необязательно)" id="rev-t"></textarea><button class="btn" style="margin-top:10px" data-act="revSend" ${d.st ? '' : 'disabled'}>Отправить отзыв</button></div>` : ''}
  ${d.reviewed ? `<div style="margin-top:14px">${note('Спасибо! Отзыв учтён в рейтинге продавца.', 'lime', 'check')}</div><button class="btn" style="margin-top:12px" data-go="home" data-root="1">На главную</button>` : ''}
  ${d.step < 4 ? `<button class="btn ghost" style="margin-top:12px" data-act="dispute" data-id="${d.id}">Открыть спор</button><div class="tiny muted" style="margin-top:8px;text-align:center">При споре токены остаются в эскроу до решения поддержки</div>` : ''}
  </div>`;
};
function dealTick() {
  if (!DEAL) return; const d = DEAL;
  const go = (ms, fn) => setTimeout(() => { if (DEAL === d) { fn(); if (S.route === 'deal') render(); } }, ms);
  if (d.step === 0) go(1300, () => { d.step = 1; dealTick(); });
  else if (d.step === 1) go(1500, () => { d.step = 2; });
  else if (d.step === 3) go(1800, () => { d.step = 4; finishDeal(d); });
}
function finishDeal(d) {
  const o = d.o;
  if (d.side === 'buy') { S.polus.KZT -= d.v; credit(o.a, d.q); const cb = o.a !== 'USDT' ? d.v * OTC.p2pCb / ASSETS.GOLD.price : 0; if (cb) { credit('GOLD', cb); S.cbGold += cb; } addTx({ type: 'p2p', title: `P2P: покупка у ${(SELLERS.find(x => x.id === o.s) || {}).name}`, a: o.a, amt: d.q, kzt: -d.v, net: 'Polus Ledger', rate: d.price }); if (cb) addTx({ type: 'cashback', title: 'Кэшбэк золотом за P2P', a: 'GOLD', amt: cb, net: 'Polus Ledger', note: '0,3% от суммы сделки' }); }
  else { debit(o.a, d.q); S.polus.KZT += d.v; addTx({ type: 'p2p', title: `P2P: продажа`, a: o.a, amt: -d.q, kzt: d.v, net: 'Polus Ledger', rate: d.price }); }
  o.qty = Math.max(0, o.qty - d.q);
  S.m.firstBuy = true; S.m.deals = (S.m.deals || 0) + 1; S.m.dealsBy ||= {}; S.m.dealsBy[o.s] = (S.m.dealsBy[o.s] || 0) + 1; save();
}

/* ---- seller ---- */
V.sellerReg = p => `<div class="scr nonav">${top('Стать продавцом')}
  <div class="gold-w"><div class="b" style="font-size:18px">Зарабатывайте на P2P</div><div class="small" style="margin-top:6px;line-height:1.5">Создавайте ордера по своей цене, получайте лояльных клиентов. Polus обеспечивает эскроу, счета от ИП и налоговый учёт.</div></div>
  <div class="sec">${note('Продавец — официальное лицо: нужны полные данные и ИП для прозрачных счетов на оплату. В прототипе данные не сохраняются и не отправляются.', 'amber', 'info')}</div>
  <label class="field"><span>ФИО</span><input class="input" id="sr-name" placeholder="Как в удостоверении"></label>
  <label class="field"><span>ИИН</span><input class="input" id="sr-iin" inputmode="numeric" maxlength="12" placeholder="12 цифр"></label>
  <label class="field"><span>Наименование ИП</span><input class="input" id="sr-ip" placeholder="ИП «…»"></label>
  <label class="field"><span>БИН / ИИН ИП</span><input class="input" id="sr-bin" inputmode="numeric" maxlength="12" placeholder="12 цифр"></label>
  <label class="field"><span>IBAN для расчётов</span><input class="input" id="sr-iban" placeholder="KZ… (20 символов)" maxlength="20"></label>
  <div class="card" style="margin-top:14px"><div class="b">Правила продавца</div><div class="small muted" style="line-height:1.55;margin-top:6px">• Завершать сделку в течение 15 минут после оплаты<br>• Выставлять счета только от своего ИП<br>• Не уводить покупателя из приложения<br><b style="color:#E5484D">Нарушение:</b> эскроу возвращается покупателю, вывод средств продавца блокируется, информация передаётся биржам-партнёрам (Binance, OKX, Bybit, Tonkeeper) для ограничения аккаунта.</div>
  <label class="row" style="margin-top:12px;font-size:13px;gap:10px;cursor:pointer"><input type="checkbox" id="sr-ok" style="width:20px;height:20px;accent-color:#0B0B0B"> Принимаю правила и санкции</label></div>
  <div id="sr-err"></div>
  <div style="margin-top:14px"><button class="btn lime" data-act="srGo">Отправить на проверку</button></div>
  <button class="btn ghost" style="margin-top:10px" data-act="srDemo">Заполнить тестовыми данными</button></div>`;
/* ---- seller app ---- */
const SST = ['Выставить счёт', 'Ждём оплату', 'Оплачено: проверьте', 'Завершена'];
const SSTC = ['amber', '', 'lime', 'soft'];
function mkDeal(o, step = 0, ago = 0) {
  const pr = oPrice(o); let v = Math.round((o.min + Math.random() * (Math.min(o.max, o.qty * pr) - o.min)) / 1000) * 1000; v = Math.max(v, o.min || 5000);
  return { id: uid(), oid: o.id, buyer: 'Покупатель •• ' + (1000 + Math.floor(Math.random() * 8999)), a: o.a, price: pr, v, q: v / pr, cost: ASSETS[o.a].price * 0.985, step, ts: Date.now() - ago };
}
function ensureSeller() {
  if (S.seller) return;
  const o1 = { id: 'm1', s: 'me', a: 'GOLD', side: 'sell', k: 0.996, min: 20000, max: 300000, qty: 12 };
  const o2 = { id: 'm2', s: 'me', a: 'USDT', side: 'sell', k: 1.003, min: 10000, max: 400000, qty: 900 };
  S.orders = S.orders.filter(o => o.s !== 'me').concat([o1, o2]);
  const done1 = { ...mkDeal(o1, 3, 26 * H), rev: { st: 5, t: 'Счёт пришёл сразу, всё прозрачно' } }, done2 = { ...mkDeal(o2, 3, 50 * H), rev: { st: 5, t: 'Быстро' } };
  S.seller = { name: 'GoldPoint_KZ', turnover: 4820000, income: 86400, dealsN: 37, rating: 4.97, done: 99.2, inv: { GOLD: 24.5, USDT: 1800 }, kzt: 1250000, dl: [mkDeal(o1, 0, 2 * 60e3), mkDeal(o2, 2, 6 * 60e3), done1, done2], taxSent: false };
}
const newSeller = () => ({ name: 'Мой P2P-магазин', turnover: 0, income: 0, dealsN: 0, rating: 0, done: 100, inv: { GOLD: 10, USDT: 500 }, kzt: 0, dl: [], taxSent: false });
const dealRow = d => `<div class="li" data-go="sDeal" data-id="${d.id}">${coin(d.a)}<div class="grow"><div class="t">${esc(d.buyer)}</div><div class="s">${fmt(d.q, 4)} ${d.a === 'GOLD' ? 'г' : d.a} · ${kzt(d.v)} · ${tm(d.ts)}</div></div><span class="pill ${SSTC[d.step]}">${SST[d.step]}</span></div>`;
const unitOf = a => a === 'GOLD' ? 'г' : a;

V.sHome = () => {
  const s = S.seller, act = s.dl.filter(d => d.step < 3);
  return `<div class="scr">
  <div class="top"><div class="l"><div class="avatar"><img src="assets/logo.jpg" alt=""></div><div><div class="tiny muted">Кабинет продавца</div><div class="b">${esc(s.name)} <span class="pill soft tiny">ИП ✓</span></div></div></div><button class="ibtn" data-go="support" aria-label="Поддержка">${ic('chat')}</button></div>
  <div class="hero"><div class="lbl">Доход за ноябрь</div><div class="bal num">${kzt(s.income)}</div><div class="small" style="color:#A8A8A2">Оборот ${kzt(s.turnover)} · ${s.dealsN} сделок</div>
  <div class="row" style="margin-top:14px;gap:8px">${s.rating ? `<span class="pill lime">★ ${fmt(s.rating, 2)}</span>` : '<span class="pill lime">Новый продавец</span>'}<span class="pill" style="background:#1A1A1A;color:#fff">${fmt(s.done, 1)}% сделок завершено</span></div></div>
  <div class="qa"><button data-go="sOrders" data-root="1"><i>${ic('plus')}</i>Ордер</button><button data-go="sDeals" data-root="1"><i>${ic('swap')}</i>Сделки</button><button data-go="sTax" data-root="1"><i>${ic('doc')}</i>Налоги</button><button data-act="toUser"><i>${ic('user')}</i>Как клиент</button></div>
  <div class="sec"><div class="sec-h"><h3>Активные сделки</h3><a data-go="sDeals" data-root="1">Все</a></div>${act.length ? `<div class="card list">${act.map(dealRow).join('')}</div>` : '<div class="card small muted">Нет активных сделок. Разместите ордер, и покупатели появятся.</div>'}</div>
  <div class="sec"><div class="sec-h"><h3>Запасы для продажи</h3></div><div class="card list">${Object.entries(s.inv).map(([a, n]) => `<div class="li">${coin(a)}<div class="grow"><div class="t">${a === 'GOLD' ? 'Золото GOLD' : a}</div><div class="s">Рынок <span data-lp="${a}">${priceTxt(a)}</span></div></div><div class="r"><div class="t num">${fmt(n, a === 'GOLD' ? 4 : 2)} ${unitOf(a)}</div><div class="s num">${kzt(n * ASSETS[a].price)}</div></div></div>`).join('')}<div class="li"><div class="coin" style="background:#0B0B0B;color:#C3F53C">₸</div><div class="grow"><div class="t">Тенге</div><div class="s">Расчётный счёт ИП в Polus</div></div><div class="t num">${kzt(s.kzt)}</div></div></div></div>
  <div class="sec"><div class="note red">${ic('warn')}<div><b>Правила продавца.</b> Завершайте сделку за 15 минут после оплаты. Нарушение: эскроу возвращается покупателю, вывод средств блокируется, данные передаются биржам-партнёрам (Binance, OKX, Bybit, Tonkeeper) для ограничения аккаунта.</div></div></div></div>`;
};
V.sOrders = () => {
  const my = S.orders.filter(o => o.s === 'me'), inv = S.seller.inv;
  return `<div class="scr">${top('Мои ордера', { noBack: true })}
  <div class="card">${my.map(o => `<div class="ord"><div class="between"><span class="nm">${o.side === 'sell' ? 'Продажа' : 'Покупка'} ${o.a === 'GOLD' ? 'золота' : o.a}</span><button class="toggle ${o.active !== false ? 'on' : ''}" data-act="ordToggle" data-id="${o.id}" aria-label="Активен"></button></div><div class="pr num">${kzt(oPrice(o), o.a === 'USDT' ? 2 : 0)} <span class="tiny muted">за 1 ${unitOf(o.a)}${o.k ? ` · ${o.k >= 1 ? '+' : ''}${fmt((o.k - 1) * 100, 1)}% к рынку` : ''}</span></div><div class="small muted">Лимит ${fmt(o.min)}–${fmt(o.max)} ₸ · ${fmt(o.qty, 2)} ${unitOf(o.a)} · ${o.active !== false ? 'виден покупателям' : 'на паузе'}</div></div>`).join('') || '<div class="small muted">Пока нет ордеров. Создайте первый.</div>'}</div>
  <div class="card" style="margin-top:12px"><div class="b">Новый ордер на продажу</div>
    <div class="chips" style="margin-top:10px">${['GOLD', 'USDT'].map(k => `<button class="chip ${(S.params.na || 'GOLD') === k ? 'on' : ''}" data-act="naSet" data-v="${k}">${k === 'GOLD' ? 'Золото' : k}</button>`).join('')}</div>
    <label class="field"><span>Цена за 1 ${unitOf(S.params.na || 'GOLD')}, ₸ · рынок <span data-lp="${S.params.na || 'GOLD'}">${priceTxt(S.params.na || 'GOLD')}</span></span><input class="input num" id="no-price" inputmode="decimal" value="${(ASSETS[S.params.na || 'GOLD'].price * 0.995).toFixed((S.params.na || 'GOLD') === 'USDT' ? 2 : 0)}"></label>
    <div class="btns"><label class="field" style="flex:1"><span>Мин, ₸</span><input class="input num" id="no-min" inputmode="numeric" value="20000"></label><label class="field" style="flex:1"><span>Макс, ₸</span><input class="input num" id="no-max" inputmode="numeric" value="150000"></label></div>
    <label class="field"><span>Объём · в запасе ${fmt(inv[S.params.na || 'GOLD'] || 0, 4)} ${unitOf(S.params.na || 'GOLD')}</span><input class="input num" id="no-qty" inputmode="decimal" value="${(S.params.na || 'GOLD') === 'GOLD' ? 2 : 200}"></label>
    <div id="no-err"></div>
    <button class="btn" style="margin-top:12px" data-act="ordCreate">Разместить ордер</button>
    <div class="tiny muted" style="margin-top:8px">Цена должна быть в пределах ±5% от рынка, это защита от манипуляций. Объём блокируется в эскроу на время сделки.</div></div></div>`;
};
V.sDeals = () => {
  const dl = [...S.seller.dl].sort((a, b) => (a.step === 3) - (b.step === 3) || b.ts - a.ts);
  return `<div class="scr">${top('Сделки', { noBack: true })}${dl.length ? `<div class="card list">${dl.map(dealRow).join('')}</div>` : '<div class="card small muted">Сделок пока нет</div>'}
  <div class="sec">${note('Покупатель оплачивает счёт вашего ИП. Токены отпускаются только после того, как вы подтвердите поступление денег.', 'lime', 'shield')}</div></div>`;
};
V.sDeal = p => {
  const d = S.seller.dl.find(x => x.id === p.id); if (!d) return V.sDeals();
  const u = unitOf(d.a);
  const steps = [['Покупатель открыл сделку', `${fmt(d.q, 4)} ${u} заблокировано в эскроу`], ['Счёт от вашего ИП', d.step >= 1 ? `Счёт № INV-${d.id} отправлен покупателю` : 'Выставьте счёт на оплату'], ['Оплата покупателя', d.step >= 2 ? `Покупатель отметил оплату ${kzt(d.v)}` : 'Ожидаем, до 15 минут'], ['Токены отпущены', d.step >= 3 ? 'Сделка завершена' : 'После проверки поступления']];
  return `<div class="scr nonav">${top('Сделка #' + d.id, { right: `<span class="pill ${SSTC[d.step]}">${SST[d.step]}</span>` })}
  <div class="card"><div class="between"><div><div class="small muted">${esc(d.buyer)} покупает</div><div class="num" style="font-size:24px;font-weight:800">${fmt(d.q, 4)} ${u}</div></div><div style="text-align:right"><div class="small muted">К оплате</div><div class="num b">${kzt(d.v)}</div></div></div>
  ${kv('Цена', kzt(d.price, d.a === 'USDT' ? 2 : 0))}${kv('Себестоимость (ср. цена закупки)', kzt(d.cost, d.a === 'USDT' ? 2 : 0))}${kv('Ваш доход', `<span class="up">${kzt(Math.max(0, d.v - d.q * d.cost))}</span>`)}${kv('Комиссия Polus 0,5%', `${kzt(d.v * OTC.sellerFee)} <span class="tiny muted">в USDT</span>`)}</div>
  <div class="card"><div class="steps">${steps.map((st, i) => `<div class="st ${i <= d.step ? 'done' : i === d.step + 1 ? 'act' : ''}"><b>${st[0]}</b><div class="s">${st[1]}</div></div>`).join('')}</div>${d.step === 1 ? '<div class="spin" style="margin:6px auto 0;width:28px;height:28px;border-width:3px"></div>' : ''}</div>
  ${d.step === 0 ? `<button class="btn lime" style="margin-top:14px" data-act="sInvoice" data-id="${d.id}">${ic('doc')}Выставить счёт от ИП</button>` : ''}
  ${d.step === 2 ? `<div style="margin-top:14px">${note('Проверьте, что деньги действительно пришли на счёт ИП. Не отпускайте токены по скриншоту.', 'amber', 'warn')}</div><button class="btn lime" style="margin-top:12px" data-act="sRelease" data-id="${d.id}">Деньги получены: отпустить токены</button><button class="btn ghost" style="margin-top:10px" data-act="dispute" data-id="${d.id}">Деньги не пришли: открыть спор</button>` : ''}
  ${d.step === 3 ? (d.rev ? `<div class="card" style="margin-top:12px"><div class="between"><span class="b">Отзыв покупателя</span><span class="stars">${stars(d.rev.st)}</span></div><div class="small" style="margin-top:6px">${esc(d.rev.t)}</div><div class="tiny" style="color:#3E5A00;margin-top:4px">✓ Подтверждённая сделка</div></div>` : `<div class="card small muted" style="margin-top:12px">Ждём отзыв покупателя…</div>`) : ''}
  </div>`;
};
V.sTax = () => {
  const s = S.seller, fee = s.turnover * OTC.sellerFee, tax = s.income * OTC.tax;
  return `<div class="scr">${top('Налоги и учёт', { noBack: true })}
  <div class="card"><div class="b">Ноябрь 2026</div>${kv('Оборот продаж', kzt(s.turnover))}${kv('Доход (разница цен)', kzt(s.income))}${kv('Комиссия Polus 0,5%', `${kzt(fee)} <span class="tiny muted">в USDT</span>`)}${kv('Налог ИП 4% от дохода', kzt(tax))}${kv('Чистая прибыль', `<span class="up">${kzt(s.income - fee - tax)}</span>`, 'total')}</div>
  <div class="card"><div class="b">По кварталам</div>${[['IV кв. (текущий)', s.turnover, s.income], ['III кв.', 9840000, 162000], ['II кв.', 6120000, 98500]].map(([q, t, i]) => kv(q, `${kzt(t)} · налог ${kzt(i * OTC.tax)}`)).join('')}</div>
  <div class="card"><div class="between"><div><div class="b">Отчётность в налоговую</div><div class="small muted">Счета-фактуры и оборот за период</div></div><span class="pill ${s.taxSent ? 'soft' : 'amber'}">${s.taxSent ? 'Отправлено' : 'Не отправлено'}</span></div>${s.taxSent ? `<div class="small muted" style="margin-top:8px">Квитанция № ${s.taxSent} · ${dt(Date.now())}</div>` : `<button class="btn" style="margin-top:12px" data-act="taxSend">Отправить отчёт (имитация)</button>`}</div>
  ${note('Ставка 4% указана для упрощённой декларации (тестовое значение, уточните у налогового консультанта). Отчёт собирается автоматически по всем сделкам.', '', 'doc')}
  <button class="btn ghost" style="margin-top:12px" data-act="csv">${ic('doc')}Скачать отчёт (CSV)</button></div>`;
};
V.sProfile = () => {
  const s = S.seller, revs = s.dl.filter(d => d.rev);
  return `<div class="scr">${top('Профиль продавца', { noBack: true })}
  <div class="card row"><div class="avatar" style="width:56px;height:56px;border-radius:18px"><img src="assets/logo.jpg" alt=""></div><div class="grow"><div class="b" style="font-size:17px">${esc(s.name)}</div><div class="small muted">ИП «•••••» · БИН скрыт · ${maskPhone()}</div></div></div>
  <div class="row" style="gap:6px;flex-wrap:wrap;margin-top:10px"><span class="pill soft">ИП верифицирован</span><span class="pill soft">KYC пройден</span><span class="pill soft">IBAN подтверждён</span></div>
  <div class="sec"><div class="sec-h"><h3>Рейтинг ${s.rating ? fmt(s.rating, 2) : '—'}</h3><span class="tiny muted">только по реальным сделкам</span></div><div class="card">${revs.length ? revs.map(d => `<div style="padding:8px 0"><div class="between"><span class="stars small">${stars(d.rev.st)}</span><span class="tiny muted">${dt(d.ts)}</span></div><div class="small">${esc(d.rev.t)}</div></div>`).join('') : '<div class="small muted">Отзывов пока нет</div>'}</div></div>
  <div class="card list" style="margin-top:12px">
    <div class="li" data-act="rules"><div class="coin sm" style="background:#F4F4F1;color:#0B0B0B">${ic('shield').replace('<svg', '<svg style="width:16px;height:16px"')}</div><div class="grow t" style="font-size:15px">Правила и санкции</div>${ic('chev').replace('<svg', '<svg style="width:18px;height:18px;color:#B0B0AA"')}</div>
    <div class="li" data-go="support"><div class="coin sm" style="background:#F4F4F1;color:#0B0B0B">${ic('chat').replace('<svg', '<svg style="width:16px;height:16px"')}</div><div class="grow t" style="font-size:15px">Поддержка</div>${ic('chev').replace('<svg', '<svg style="width:18px;height:18px;color:#B0B0AA"')}</div>
    <div class="li" data-act="toUser"><div class="coin sm" style="background:#C3F53C;color:#0B0B0B">${ic('user').replace('<svg', '<svg style="width:16px;height:16px"')}</div><div class="grow t" style="font-size:15px">Перейти в приложение клиента</div>${ic('chev').replace('<svg', '<svg style="width:18px;height:18px;color:#B0B0AA"')}</div>
  </div>
  <div class="btns" style="margin-top:14px"><button class="btn ghost" data-act="reset">${ic('refresh')}Сбросить демо</button><button class="btn ghost" data-act="logout">${ic('logout')}Выйти</button></div></div>`;
};

/* ---- card ---- */
const pcard = (c, small) => `<div class="pcard ${c.design} ${c.frozen ? 'frozen' : ''}" ${small ? 'style="max-width:260px;margin:0 auto"' : ''}><div class="between"><img class="pc-logo" src="assets/logo.jpg" alt=""><span class="b" style="font-size:13px;opacity:.8">Polus · Virtual</span></div><div class="pc-chip"></div><div class="between"><span class="pc-num num">•••• ${c.last}</span><span class="b" style="font-size:14px">POLUS</span></div>${c.frozen ? '<div class="frost">❄ Заморожена</div>' : ''}</div>`;
V.card = p => {
  if (!S.card) {
    const d = p.d || 'black';
    return `<div class="scr">${top('Цифровая карта', { noBack: true })}
    ${pcard({ design: d, last: '••••' })}
    <div class="designs">${['black', 'lime', 'white'].map(x => `<button class="${x === d ? 'on' : ''}" data-act="cardDesign" data-v="${x}" style="background:${x === 'black' ? '#0B0B0B' : x === 'lime' ? '#C3F53C' : '#fff'};border-color:${x === d ? '#0B0B0B' : '#E6E6E1'}" aria-label="${x}"></button>`).join('')}</div>
    <div class="card stack" style="margin-top:14px"><div class="row"><span class="pill lime">1%</span><span class="small">Кэшбэк золотом за каждую покупку</span></div><div class="row"><span class="pill">0 ₸</span><span class="small">Выпуск и обслуживание</span></div><div class="row"><span class="pill">${ic('apple').replace('<svg', '<svg style="width:12px;height:12px" fill="currentColor"')} Pay</span><span class="small">Сразу добавляется в Apple Pay</span></div><div class="row"><span class="pill">₸</span><span class="small">Списание с тенгового баланса Polus</span></div></div>
    <button class="btn lime" style="margin-top:14px" data-act="cardIssue" data-v="${d}">Выпустить карту за 10 секунд</button></div>`;
  }
  const c = S.card;
  return `<div class="scr">${top('Цифровая карта', { noBack: true, right: c.applePay ? `<span class="pill dark">${ic('apple').replace('<svg', '<svg style="width:12px;height:12px" fill="currentColor"')} Pay ✓</span>` : '' })}
  ${pcard(c)}
  <div class="between" style="margin-top:12px"><div><div class="small muted">Доступно</div><div class="b num" style="font-size:20px">${money(S.polus.KZT)}</div></div><span class="pill ${c.frozen ? 'red' : 'soft'}">${c.frozen ? 'Заморожена' : 'Активна'}</span></div>
  <div class="qa" style="grid-template-columns:repeat(4,1fr)">
    <button data-act="${c.applePay ? 'noop' : 'applePay'}"><i style="${c.applePay ? '' : 'background:#0B0B0B;border-color:#0B0B0B;color:#fff'}">${ic('apple').replace('<svg', '<svg fill="currentColor" stroke="none"')}</i>${c.applePay ? 'В Wallet' : 'Apple Pay'}</button>
    <button data-act="freeze"><i style="background:#fff;border-color:#E6E6E1">${ic('snow')}</i>${c.frozen ? 'Разморозить' : 'Заморозить'}</button>
    <button data-act="cardReq"><i style="background:#fff;border-color:#E6E6E1">${ic('eye')}</i>Реквизиты</button>
    <button data-act="limits"><i style="background:#fff;border-color:#E6E6E1">${ic('lock')}</i>Лимиты</button>
  </div>
  <div class="sec"><div class="sec-h"><h3>Кэшбэк по карте</h3></div>
    <div class="radio ${S.cbMode === 'gold' ? 'on' : ''}" data-act="cb" data-v="gold"><span class="pill lime">1%</span><div class="grow"><div class="b">Золотом (GOLD)</div><div class="small muted">Копится в граммах, цена следует за золотом</div></div></div>
    <div class="radio ${S.cbMode === 'kzt' ? 'on' : ''}" data-act="cb" data-v="kzt"><span class="pill">0,5%</span><div class="grow"><div class="b">Тенге</div><div class="small muted">Классический кэшбэк на баланс</div></div></div>
  </div>
  <div class="sec"><div class="sec-h"><h3>Тестовая покупка</h3><span class="tiny muted">симуляция оплаты</span></div><div class="card list">
    ${[['Кофейня', 1800, '☕'], ['Супермаркет', 12450, '🛒'], ['Такси', 2300, '🚕'], ['Электроника', 489000, '💻']].map(([n, v, e]) => `<div class="li" data-act="pay" data-n="${n}" data-v="${v}"><div class="coin" style="background:#F4F4F1;font-size:18px">${e}</div><div class="grow"><div class="t">${n}</div><div class="s">Apple Pay · кэшбэк ${S.cbMode === 'gold' ? fmt(v * OTC.cardCbGold / ASSETS.GOLD.price, 4) + ' г' : kzt(v * OTC.cardCbKzt)}</div></div><div class="t num">${kzt(v)}</div></div>`).join('')}
  </div></div></div>`;
};

/* ---- support ---- */
const BOT = {
  start: { t: 'Здравствуйте! Я помощник Polus, специалисты на связи 24/7. Что случилось?', o: [['scam', '🚨 Подозрение на мошенничество'], ['p2p', 'Проблема со сделкой P2P'], ['transfer', 'Не пришёл перевод'], ['gold', 'Вопрос о GOLD']] },
  scam: { t: 'Сначала обезопасим средства. Что произошло?', o: [['scam_call', 'Звонил «сотрудник банка»'], ['scam_p2p', 'Продавец/покупатель обманул'], ['scam_card', 'Неизвестное списание по карте']] },
  scam_call: { t: '⚠️ Polus никогда не звонит с просьбой перевести деньги или назвать код. Положите трубку. Рекомендую сразу:', o: [['do_freeze', 'Заморозить карту'], ['do_lock', 'Выйти на всех устройствах'], ['do_case', 'Создать обращение']] },
  scam_p2p: { t: 'Средства по активной сделке остаются в эскроу и не уйдут продавцу без подтверждения. Открываю спор: специалист проверит переписку и платёж. Если нарушение подтвердится, продавец получит блокировку вывода и ограничения на биржах-партнёрах.', o: [['do_case', 'Открыть спор'], ['start', 'Другой вопрос']] },
  scam_card: { t: 'Заморозьте карту, после этого операции по ней будут отклоняться. Затем создадим обращение на возврат (chargeback).', o: [['do_freeze', 'Заморозить карту'], ['do_case', 'Создать обращение']] },
  p2p: { t: 'В P2P деньги защищены эскроу: токены продавца заблокированы до завершения. Если продавец не подтверждает 15 минут после оплаты, сделка автоматически уходит в спор.', o: [['do_case', 'Открыть спор'], ['start', 'Назад']] },
  transfer: { t: 'Переводы с бирж-партнёров обычно приходят за 1–10 минут, в зависимости от сети. Статус видно в Истории операций. Проверить последнюю операцию?', o: [['do_hist', 'Открыть историю'], ['do_case', 'Создать обращение']] },
  gold: { t: '1 GOLD = 1 грамм золота 999,9 на хранении. Цена меняется вместе с рынком золота: может расти и снижаться. GOLD не депозит, процентов не начисляется. Продать можно в любой момент по котировке.', o: [['start', 'Другой вопрос']] },
};
V.support = () => `<div class="scr nonav" style="padding-bottom:90px">${top('Поддержка 24/7', { right: '<span class="pill soft">● Онлайн</span>' })}
  <div class="note red" style="margin-bottom:12px">${ic('shield')}<div><b>Антискам.</b> Сотрудники Polus не просят коды, PIN и переводы «на безопасный счёт».</div></div>
  <div class="chat" id="chat">${S.chat.map(m => `<div class="msg ${m.me ? 'me' : 'bot'}">${m.t}</div>`).join('')}</div>
  <div id="chat-opts" class="chips" style="flex-wrap:wrap;margin-top:10px">${(BOT[S.chatNode || 'start'].o || []).map(([k, l]) => `<button class="chip" data-act="bot" data-v="${k}">${l}</button>`).join('')}</div>
  </div><div class="chat-in"><div class="row" style="gap:8px"><input class="input" style="height:46px" placeholder="Напишите сообщение…" id="chat-t"><button class="ibtn" style="background:#0B0B0B;color:#C3F53C;border-color:#0B0B0B;flex-shrink:0" data-act="chatSend">${ic('out')}</button></div></div>`;

/* ---- profile ---- */
V.profile = () => `<div class="scr">${top('Профиль', { noBack: true })}
  <div class="card row"><div class="avatar" style="width:56px;height:56px;border-radius:18px"><img src="assets/logo.jpg" alt=""></div><div class="grow"><div class="b" style="font-size:17px">${esc(S.nick || 'Клиент Polus')}</div><div class="small muted">${maskPhone()} · данные скрыты</div></div><span class="pill soft">Базовый</span></div>
  <div class="card list" style="margin-top:12px">
    ${[['go', 'history', 'clock', 'История операций'], ['go', 'rates', 'chart', 'Курсы валют'], ['go', 'partners', 'link', 'Биржи-партнёры'], ['go', 'gold', 'gift', 'Золото и кэшбэк'], S.seller ? ['act', 'toSeller', 'store', 'Кабинет продавца'] : ['go', 'sellerReg', 'store', 'Стать продавцом'], ['go', 'custody', 'lock', 'Хранение активов'], ['act', 'security', 'shield', 'Безопасность'], ['go', 'support', 'chat', 'Поддержка и антискам']].map(([t, r, i, l]) => `<div class="li" data-${t}="${r}"><div class="coin sm" style="background:#F4F4F1;color:#0B0B0B">${ic(i).replace('<svg', '<svg style="width:16px;height:16px"')}</div><div class="grow t" style="font-size:15px">${l}</div>${ic('chev').replace('<svg', '<svg style="width:18px;height:18px;color:#B0B0AA"')}</div>`).join('')}
  </div>
  <div class="btns" style="margin-top:14px"><button class="btn ghost" data-act="reset">${ic('refresh')}Сбросить демо</button><button class="btn ghost" data-act="logout">${ic('logout')}Выйти</button></div>
  <div class="tiny muted" style="text-align:center;margin-top:14px">Polus Bank · прототип v2 · балансы тестовые, курсы реальные</div></div>`;

/* ============ sheet / toast / pin ============ */
function sheet(html) { $('#sheet-root').innerHTML = `<div class="overlay" data-act="ovl"><div class="sheet"><div class="grab"></div>${html}</div></div>`; }
const close = () => { $('#sheet-root').innerHTML = ''; };
let toastT;
function toast(t) { $('#toast').innerHTML = `<div class="toast"><i>✓</i>${t}</div>`; clearTimeout(toastT); toastT = setTimeout(() => { $('#toast').innerHTML = ''; }, 2600); }
let PIN = { buf: '', cb: null, tries: 0 };
function pin(title, cb, ptxt) {
  PIN = { buf: '', cb, tries: 0, ptxt };
  sheet(`<h3 style="text-align:center">${title}</h3><div class="small muted" style="text-align:center">Введите PIN-код. Тест: любые 4 цифры, <b>0000</b> = ошибка</div><div class="dots" id="dots">${'<i></i>'.repeat(4)}</div><div id="pin-err" style="text-align:center;min-height:20px"></div><div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 'face', 0, 'del'].map(k => `<button data-act="pin" data-k="${k}">${k === 'del' ? '⌫' : k === 'face' ? '<span style="font-size:13px">Face ID</span>' : k}</button>`).join('')}</div>`);
}
function pinKey(k) {
  if (k === 'del') PIN.buf = PIN.buf.slice(0, -1);
  else if (k === 'face') PIN.buf = '1111';
  else if (PIN.buf.length < 4) PIN.buf += k;
  $$('#dots i').forEach((d, i) => d.classList.toggle('on', i < PIN.buf.length));
  if (PIN.buf.length === 4) {
    if (PIN.buf === '0000') { PIN.tries++; const d = $('#dots'); d.classList.add('shake'); $('#pin-err').innerHTML = `<span class="err-t">Неверный PIN. Осталось попыток: ${3 - PIN.tries}</span>`; setTimeout(() => { PIN.buf = ''; d.classList.remove('shake'); $$('#dots i').forEach(x => x.classList.remove('on')); }, 450); return; }
    const cb = PIN.cb, pt = PIN.ptxt; setTimeout(() => { processing(cb, pt); }, 150);
  }
}
function processing(cb, txt) { txt = txt || 'Проводим операцию…'; sheet(`<div style="text-align:center;padding:30px 0"><div class="spin"></div><div class="b">${txt}</div><div class="small muted" style="margin-top:6px">Проверка безопасности и подписание</div></div>`); setTimeout(() => { close(); cb(); }, 1200); }

/* ============ router ============ */
function go(route, params = {}, push = true) {
  if (push && S.route !== route) stack.push({ route: S.route, params: S.params });
  if (stack.length > 30) stack.shift();
  S.route = route; S.params = params; save(); render(true);
}
function back() { const p = stack.pop(); if (p) { S.route = p.route; S.params = p.params; render(true); } else go(!S.auth ? 'welcome' : S.role === 'seller' ? 'sHome' : 'home', {}, false); }
function render(scrollTop) {
  const app = $('#app'); const prev = $('.scr', app); const y = prev ? prev.scrollTop : 0;
  const fn = V[S.route] || V.home;
  app.innerHTML = fn(S.params || {}) + (NAVR.includes(S.route) ? nav() : SNAVR.includes(S.route) ? snav() : '');
  const sc = $('.scr', app); if (sc && !scrollTop) sc.scrollTop = y;
  if (S.route === 'otc') otcUpdate();
  if (S.route === 'withdraw') wUpdate();
  if (S.route === 'support') { if (!S.chat.length) botSay('start'); const c = $('.scr'); c.scrollTop = c.scrollHeight; }
}
const rerender = () => render(false);

/* ============ actions ============ */
const A = {
  back, close,
  ovl: (d, el, e) => { if (e.target === el) close(); },
  noop: () => {},
  obNext: () => { if (S.ob < 2) { S.ob++; rerender(); } else { S.m.onboard = true; go('welcome', {}, false); } },
  obSkip: () => { S.m.onboard = true; go('welcome', {}, false); },
  sendCode: () => go('code', { role: S.params.role || 'user', mode: S.params.mode || 'login' }),
  hide: () => { S.hide = !S.hide; save(); rerender(); },
  tx: d => txSheet(d.id),
  otcSide: d => { S.params = { ...S.params, side: d.v, v: '' }; Q = null; rerender(); },
  otcAsset: d => { S.params = { ...S.params, a: d.v, v: '' }; Q = null; rerender(); },
  otcPreset: d => { S.params.v = d.v; $('[data-in="otc"]').value = d.v; otcUpdate(); },
  otcMax: () => { const side = S.params.side || 'buy'; const v = side === 'buy' ? Math.floor(S.polus.KZT) : +assetAmt(S.params.a || 'GOLD').toFixed(6); S.params.v = String(v); $('[data-in="otc"]').value = v; otcUpdate(); },
  otcConfirm: () => {
    const c = otcCalc(); const A2 = ASSETS[c.a], unit = c.a === 'GOLD' ? 'г' : c.a;
    if (c.err === 'funds') { addTx({ type: c.side, title: `${c.side === 'buy' ? 'Покупка' : 'Продажа'} ${c.a}: отклонено`, a: c.side === 'buy' ? 'KZT' : c.a, amt: c.side === 'buy' ? -c.v : -c.v, net: 'Polus Ledger', st: 'failed', note: 'Недостаточно средств' }); save(); return go('result', { ok: 0, h: 'Недостаточно средств', t: c.side === 'buy' ? `Для покупки нужно ${kzt(c.v)}, на балансе ${kzt(S.polus.KZT)}. Деньги не списаны.` : `У вас ${fmt(assetAmt(c.a), A2.dec)} ${c.a}. Операция не проведена.`, fix: c.side === 'buy' ? 'topup' : '', fixT: 'Пополнить баланс' }); }
    if (c.err) return toast('Проверьте сумму');
    if (Date.now() > Q.exp) { newQuote(Q.a, Q.side); otcUpdate(); return toast('Цена обновилась, проверьте условия'); }
    const lockQ = { ...Q };
    sheet(`<h3>Подтвердите ${c.side === 'buy' ? 'покупку' : 'продажу'}</h3><div class="small muted">Цена зафиксирована, осталось <span data-cd>${Math.ceil((Q.exp - Date.now()) / 1000)}</span> с</div>
      <div style="margin-top:12px">${c.side === 'buy' ? kv('Списание', kzt(c.v)) + kv('Курс', kzt(lockQ.price, lockQ.price < 10000 ? 2 : 0)) + kv('Комиссия Polus', `${kzt(c.fee)} (${fmt(c.feeU, 2)} USDT)`) + kv('Получите', `${fmt(c.qty, A2.dec)} ${unit}`, 'total') + kv('Кэшбэк', `+${fmt(c.cb, 4)} г GOLD`) : kv('Продаёте', `${fmt(c.v, A2.dec)} ${unit}`) + kv('Курс', kzt(lockQ.price, lockQ.price < 10000 ? 2 : 0)) + kv('Комиссия Polus', `${kzt(c.fee)} (${fmt(c.feeU, 2)} USDT)`) + kv('Получите', kzt(c.recv), 'total')}</div>
      <div style="margin-top:12px">${note(c.a === 'GOLD' ? 'GOLD не депозит. Стоимость может как вырасти, так и снизиться.' : 'Цена криптовалюты может сильно меняться.', 'amber', 'warn')}</div>
      <label class="row" style="margin-top:12px;font-size:13px;gap:10px;cursor:pointer"><input type="checkbox" id="risk" style="width:20px;height:20px;accent-color:#0B0B0B" onchange="document.getElementById('cf').disabled=!this.checked"> Понимаю риски и условия операции</label>
      <button class="btn" id="cf" style="margin-top:14px" disabled data-act="otcDo">Подтвердить</button>`);
  },
  otcDo: () => {
    const c = otcCalc(); const unit = c.a === 'GOLD' ? 'г' : c.a;
    pin('Подтверждение операции', () => {
      let txid;
      if (c.side === 'buy') {
        S.polus.KZT -= c.v; credit(c.a, c.qty); credit('GOLD', c.cb); S.cbGold += c.cb;
        addTx({ type: 'buy', title: `Покупка ${c.a === 'GOLD' ? 'GOLD' : c.a} (OTC)`, a: c.a, amt: c.qty, kzt: -c.v, net: 'Polus Ledger', fee: c.fee, feeU: c.feeU, rate: Q.price }); txid = S.txs[0].id;
        addTx({ type: 'cashback', title: 'Кэшбэк золотом', a: 'GOLD', amt: c.cb, net: 'Polus Ledger', note: '0,5% с покупки ' + c.a });
        S.m.firstBuy = true;
      } else {
        const used = debit(c.a, c.v); S.polus.KZT += c.recv;
        addTx({ type: 'sell', title: `Продажа ${c.a} (OTC)`, a: c.a, amt: -c.v, kzt: c.recv, net: 'Polus Ledger', fee: c.fee, feeU: c.feeU, rate: Q.price, note: used.length > 1 || used[0] !== 'polus' ? 'Списано через API: ' + used.map(u => PARTNERS[u].name).join(', ') : '' }); txid = S.txs[0].id;
      }
      save(); Q = null;
      go('result', { ok: 1, h: c.side === 'buy' ? 'Покупка выполнена' : 'Продажа выполнена', t: c.side === 'buy' ? `${fmt(c.qty, ASSETS[c.a].dec)} ${unit} зачислено в Polus Custody` : `${kzt(c.recv)} зачислено на счёт`, cb: c.side === 'buy' ? fmt(c.cb, 4) : '', txid, rows: kv('Курс', kzt(S.txs.find(t => t.id === txid).rate, 0)) + kv('Комиссия', `${kzt(c.fee)} · ${fmt(c.feeU, 2)} USDT`) + kv('Дата и время', `${dt(Date.now())}, ${tm(Date.now())}`) });
    });
  },
  wTab: d => { S.params = { tab: d.v }; rerender(); },
  wDest: d => { S.params.dest = d.v; rerender(); },
  wAsset: d => { S.params.a = d.v; S.params.v = ''; rerender(); },
  wGo: () => {
    const c = wCalc();
    if (!c.v) return toast('Введите сумму');
    if (c.err) { addTx({ type: 'out', title: 'Вывод: отклонено', a: c.a, amt: -c.v, net: c.tab === 'fiat' ? 'Банковский счёт' : NET[c.a], st: 'failed', note: c.err }); save(); return go('result', { ok: 0, h: 'Вывод не выполнен', t: c.err + '. Средства не списаны.', fix: c.tab === 'fiat' ? 'topup' : '', fixT: 'Пополнить' }); }
    if (!$('#w-ack').checked) return sheet(`<h3>Проверка безопасности</h3>${note('Если кто-то по телефону или в мессенджере просит вас срочно перевести деньги, это мошенники. Polus никогда так не делает.', 'red', 'warn')}<div class="small muted" style="margin-top:10px">Отметьте подтверждение на экране вывода, чтобы продолжить.</div><div class="btns" style="margin-top:14px"><button class="btn ghost" data-act="close">Понятно</button><button class="btn red" data-go="support">Меня обманывают</button></div>`);
    pin('Подтверждение вывода', () => {
      if (c.tab === 'fiat') { S.polus.KZT -= c.v; addTx({ type: 'out', title: c.dest === 'iban' ? 'Вывод на банковский счёт' : 'Вывод на банковскую карту', a: 'KZT', amt: -c.v, net: 'Банковский счёт', fee: c.fee }); }
      else { debit(c.a, c.v); addTx({ type: 'out', title: `Вывод ${c.a} на внешний кошелёк`, a: c.a, amt: -c.v, net: NET[c.a], fee: c.fee, st: 'pending', note: 'Новый адрес: задержка 24 ч' }); }
      save(); go('result', { ok: 1, h: c.tab === 'fiat' ? 'Вывод отправлен' : 'Вывод в обработке', t: c.tab === 'fiat' ? `${kzt(c.recv)} поступят в течение 15 минут` : 'Для нового адреса действует защитная задержка 24 часа. Отменить можно в истории.', txid: S.txs[0].id });
    });
  },
  tpPreset: d => { S.params.v = d.v; $('[data-in="tp"]').value = d.v; },
  tpGo: () => { const v = parseFloat(String(S.params.v || '').replace(/\s/g, '')) || 0; if (v < 1000) return toast('Минимум 1 000 ₸'); processing(() => { S.polus.KZT += v; addTx({ type: 'topup', title: 'Пополнение с карты', a: 'KZT', amt: v, net: 'Банковский счёт' }); S.m.activated = true; save(); go('result', { ok: 1, h: 'Баланс пополнен', t: `+${kzt(v)} на счёт Polus`, txid: S.txs[0].id }); }, 'Пополняем…'); },
  hf: d => { S.params.f = d.v; rerender(); },
  connect: d => {
    const P2 = PARTNERS[d.id];
    sheet(`<div class="row">${exBadge(d.id)}<div><h3 style="margin:0">Подключить ${P2.name}</h3><div class="small muted">Подтверждённый партнёр МФЦА</div></div></div>
    <div class="card stack small" style="margin-top:14px"><div class="b">Polus запрашивает доступ:</div><div class="row">${ic('check').replace('<svg', '<svg style="width:18px;height:18px;color:#5E9E00"')}Просмотр балансов</div><div class="row">${ic('check').replace('<svg', '<svg style="width:18px;height:18px;color:#5E9E00"')}Переводы только на ваш счёт Polus</div><div class="row">${ic('x').replace('<svg', '<svg style="width:18px;height:18px;color:#E5484D"')}Вывод на сторонние адреса — запрещён</div></div>
    <div style="margin-top:12px">${note('Вы будете перенаправлены в приложение биржи для подтверждения (в прототипе имитация). Отозвать доступ можно в любой момент.')}</div>
    <button class="btn lime" style="margin-top:14px" data-act="connectDo" data-id="${d.id}">Перейти в ${P2.name} и подтвердить</button>`);
  },
  connectDo: d => { sheet(`<div style="text-align:center;padding:24px 0">${exBadge(d.id).replace('class="ex"', 'class="ex" style="margin:0 auto;width:64px;height:64px;font-size:20px;border-radius:18px;background:' + PARTNERS[d.id].bg + ';color:' + PARTNERS[d.id].fg + '"')}<div class="spin"></div><div class="b">Подтверждение в ${PARTNERS[d.id].name}…</div><div class="small muted">Проверяем верификацию аккаунта</div></div>`); setTimeout(() => { S.connected[d.id] = true; S.m.activated = true; save(); close(); const v = Object.entries(S.partner[d.id]).reduce((s, [a, n]) => s + n * ASSETS[a].price, 0); toast(`${PARTNERS[d.id].name} подключён · +${kzt(v)} в портфеле`); rerender(); }, 1800); },
  disconnect: d => { S.connected[d.id] = false; save(); toast(`${PARTNERS[d.id].name} отключён`); back(); },
  pTransfer: d => {
    const h = S.partner[d.id]; const opts = Object.entries(h).filter(([, n]) => n > 0);
    if (!opts.length) return toast('Нет активов для перевода');
    const a0 = opts[0][0];
    sheet(`<h3>Перевод из ${PARTNERS[d.id].name} в Polus</h3><div class="chips" style="margin-top:10px" id="pt-chips">${opts.map(([a]) => `<button class="chip ${a === a0 ? 'on' : ''}" data-act="ptA" data-v="${a}" data-id="${d.id}">${a}</button>`).join('')}</div>
    <label class="field"><span id="pt-av">Доступно: ${fmt(h[a0], ASSETS[a0].dec)} ${a0}</span><input class="input big num" id="pt-amt" inputmode="decimal" value="${+(h[a0] / 2).toFixed(4)}"></label><div id="pt-q" class="card" style="margin-top:10px"></div>
    <button class="btn" style="margin-top:12px" data-act="ptGo" data-id="${d.id}">Перевести</button>`);
    S._pt = a0; ptCalc(d.id); $('#pt-amt').addEventListener('input', () => ptCalc(d.id));
  },
  ptA: d => { S._pt = d.v; $$('#pt-chips .chip').forEach(c => c.classList.toggle('on', c.dataset.v === d.v)); $('#pt-av').textContent = `Доступно: ${fmt(S.partner[d.id][d.v], ASSETS[d.v].dec)} ${d.v}`; $('#pt-amt').value = +(S.partner[d.id][d.v] / 2).toFixed(4); ptCalc(d.id); },
  ptGo: d => { const a = S._pt, v = parseFloat($('#pt-amt').value.replace(',', '.')) || 0; if (v <= NETFEE[a]) return toast('Сумма меньше комиссии сети'); if (v > S.partner[d.id][a] + 1e-9) return toast('Недостаточно средств на бирже'); pin('Подтверждение перевода', () => { S.partner[d.id][a] = +(S.partner[d.id][a] - v).toFixed(8); credit(a, v - NETFEE[a]); addTx({ type: 'in', title: `Перевод с ${PARTNERS[d.id].name}`, a, amt: v - NETFEE[a], net: NET[a], fee: NETFEE[a], src: d.id }); save(); go('result', { ok: 1, h: 'Перевод выполнен', t: `${fmt(v - NETFEE[a], ASSETS[a].dec)} ${a} зачислено в Polus Custody`, txid: S.txs[0].id, rows: kv('Сеть', NET[a]) + kv('Комиссия сети', `${NETFEE[a]} ${a}`) + kv('Источник', PARTNERS[d.id].full) }); }); },
  p2pSide: d => { S.params = { ...S.params, side: d.v }; rerender(); },
  p2pAsset: d => { S.params = { ...S.params, a: d.v }; rerender(); },
  p2pOpen: d => p2pOpen(d.id),
  sellerInfo: d => sellerSheet(d.id),
  p2pStart: d => { const o = S.orders.find(x => x.id === d.id); const v = parseFloat($('#p2p-amt').value.replace(/\s/g, '')); close(); DEAL = { id: uid(), o, v, price: oPrice(o), q: v / oPrice(o), step: 0, side: S.params.side || 'buy', inv: 'PB-' + uid() }; go('deal', {}); dealTick(); },
  dealPay: () => pin('Оплата счёта ИП', () => { DEAL.step = 3; render(); dealTick(); }),
  rate: d => { DEAL.st = +d.v; const t = $('#rev-t')?.value || ''; render(); if ($('#rev-t')) $('#rev-t').value = t; },
  revSend: () => { const t = $('#rev-t').value.trim(); const id = DEAL.o.s; (S.myReviews[id] ||= []).unshift({ st: DEAL.st, t, d: dt(Date.now()) }); DEAL.reviewed = true; save(); render(); toast('Отзыв опубликован'); },
  dispute: d => { close(); S.chat.push({ me: 1, t: `Хочу оспорить операцию #${d.id}` }); botSay('scam_p2p'); go('support', {}); },
  srDemo: () => { $('#sr-name').value = 'Тестовый Продавец'; $('#sr-iin').value = '000000000000'; $('#sr-ip').value = 'ИП «Тест»'; $('#sr-bin').value = '000000000000'; $('#sr-iban').value = 'KZ000000000000000000'; $('#sr-ok').checked = true; },
  srGo: () => {
    const e = []; if ($('#sr-name').value.trim().split(/\s+/).length < 2) e.push('Укажите фамилию и имя'); if (!/^\d{12}$/.test($('#sr-iin').value)) e.push('ИИН: 12 цифр'); if ($('#sr-ip').value.trim().length < 3) e.push('Укажите название ИП'); if (!/^\d{12}$/.test($('#sr-bin').value)) e.push('БИН/ИИН ИП: 12 цифр'); if (!/^KZ\w{18}$/i.test($('#sr-iban').value)) e.push('IBAN: KZ + 18 символов'); if (!$('#sr-ok').checked) e.push('Примите правила продавца');
    if (e.length) { $('#sr-err').innerHTML = `<div class="note red" style="margin-top:12px">${ic('warn')}<div>${e.join('<br>')}</div></div>`; return; }
    processing(() => { S.orders = S.orders.filter(o => o.s !== 'me'); S.seller = newSeller(); S.auth = true; S.role = 'seller'; stack = []; save(); go('sHome', {}, false); toast('Верификация пройдена · создайте первый ордер'); }, 'Проверяем ИП и KYC…');
  },
  ordToggle: d => { const o = S.orders.find(x => x.id === d.id); o.active = o.active === false; save(); rerender(); },
  naSet: d => { S.params.na = d.v; rerender(); },
  ordCreate: () => {
    const a = S.params.na || 'GOLD';
    const pr = parseFloat($('#no-price').value.replace(',', '.')), mn = +$('#no-min').value, mx = +$('#no-max').value, q = parseFloat($('#no-qty').value.replace(',', '.'));
    const m = ASSETS[a].price; let err = '';
    if (Math.abs(pr / m - 1) > 0.05) err = `Цена вне диапазона ±5% от рынка (${kzt(m * 0.95, a === 'USDT' ? 2 : 0)}–${kzt(m * 1.05, a === 'USDT' ? 2 : 0)})`; else if (!(mn >= 0 && mx > mn)) err = 'Проверьте лимиты: «Макс» должен быть больше «Мин»'; else if (!(q > 0) || q > (S.seller.inv[a] || 0)) err = `Недостаточно ${a} в запасе для блокировки в эскроу`;
    if (err) { $('#no-err').innerHTML = `<div class="err-t">${err}</div>`; return; }
    const o = { id: 'm' + uid(), s: 'me', a, side: 'sell', k: pr / m, min: mn, max: mx, qty: q };
    S.orders.push(o); save(); rerender(); toast('Ордер размещён и виден покупателям');
    setTimeout(() => { if (!S.seller || !S.orders.includes(o) || o.active === false) return; S.seller.dl.unshift(mkDeal(o)); save(); toast('Новая сделка по вашему ордеру'); if (['sHome', 'sDeals'].includes(S.route)) rerender(); }, 4000);
  },
  sInvoice: d => { const x = S.seller.dl.find(z => z.id === d.id); processing(() => { x.step = 1; save(); rerender(); toast('Счёт от ИП отправлен покупателю'); setTimeout(() => { x.step = 2; save(); if (S.route === 'sDeal' || S.route === 'sHome' || S.route === 'sDeals') rerender(); toast('Покупатель отметил оплату'); }, 2500); }, 'Формируем счёт…'); },
  sRelease: d => { const s = S.seller, x = s.dl.find(z => z.id === d.id); pin('Отпустить токены покупателю', () => {
    x.step = 3; s.inv[x.a] = Math.max(0, (s.inv[x.a] || 0) - x.q); s.kzt += x.v; s.turnover += x.v; s.income += Math.max(0, x.v - x.q * x.cost); s.dealsN++;
    const o = S.orders.find(z => z.id === x.oid); if (o) o.qty = Math.max(0, o.qty - x.q);
    save(); rerender(); toast('Токены отпущены · деньги на счёте ИП');
    setTimeout(() => { x.rev = { st: 5, t: 'Всё прозрачно, счёт от ИП, быстро отпустил токены' }; const r = s.dl.filter(z => z.rev); s.rating = r.reduce((a, z) => a + z.rev.st, 0) / r.length * 0.3 + (s.rating || 5) * 0.7; save(); if (S.route === 'sDeal') rerender(); toast('Покупатель оставил отзыв ★★★★★'); }, 1800);
  }, 'Отпускаем токены…'); },
  taxSend: () => processing(() => { S.seller.taxSent = 'KGD-' + uid(); save(); rerender(); toast('Отчёт отправлен (имитация)'); }, 'Отправляем отчёт…'),
  rules: () => sheet(`<h3>Правила и санкции</h3><div class="small" style="line-height:1.6;margin-top:8px">• Завершать сделку в течение 15 минут после оплаты<br>• Выставлять счета только от своего ИП<br>• Не уводить покупателя из приложения<br>• Не отпускать токены без поступления денег</div><div style="margin-top:12px">${note('<b>Нарушение:</b> эскроу возвращается покупателю, вывод средств продавца блокируется до решения спора, информация передаётся биржам-партнёрам для ограничения аккаунта.', 'red', 'warn')}</div><button class="btn ghost" style="margin-top:12px" data-act="close">Понятно</button>`),
  csv: () => { const rows = [['Дата', 'Тип', 'Актив', 'Количество', 'Сумма KZT', 'Комиссия']].concat(S.txs.map(t => [dt(t.ts) + ' ' + tm(t.ts), t.title, t.a, t.amt, t.kzt || '', t.fee || 0])); const blob = new Blob(['﻿' + rows.map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(';')).join('\n')], { type: 'text/csv;charset=utf-8' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'polus-seller-report.csv'; a.click(); toast('Отчёт сформирован'); },
  cardDesign: d => { S.params.d = d.v; rerender(); },
  cardIssue: d => processing(() => { S.card = { design: d.v, last: String(1000 + Math.floor(Math.random() * 8999)), frozen: false, applePay: false }; save(); rerender(); A.applePay(); }, 'Выпускаем карту…'),
  applePay: () => sheet(`<div style="background:#0B0B0B;color:#fff;border-radius:22px;padding:18px;margin:-2px 0 0"><div class="row" style="justify-content:center;gap:6px;font-weight:800;font-size:18px">${ic('apple').replace('<svg', '<svg style="width:20px;height:20px" fill="#fff" stroke="none"')}Wallet</div><div style="margin:16px auto 0;max-width:240px">${pcard(S.card, 1)}</div><div class="small" style="text-align:center;color:#A8A8A2;margin-top:14px">Добавить карту Polus •••• ${S.card.last} в Apple Wallet?</div></div><button class="btn" style="margin-top:14px" data-act="applePayDo">Добавить в Apple Pay</button><button class="btn ghost" style="margin-top:8px" data-act="close">Позже</button>`),
  applePayDo: () => processing(() => { S.card.applePay = true; save(); rerender(); toast('Карта добавлена в Apple Pay'); }, 'Добавляем в Wallet…'),
  freeze: () => { S.card.frozen = !S.card.frozen; save(); rerender(); toast(S.card.frozen ? 'Карта заморожена' : 'Карта разморожена'); },
  cardReq: () => pin('Показать реквизиты', () => sheet(`<h3>Реквизиты карты</h3>${kv('Номер', '•••• •••• •••• ' + S.card.last)}${kv('Срок', '••/••')}${kv('CVV', '•••')}<div style="margin-top:12px">${note('В прототипе реквизиты не показываются. В продукте: показ на 30 секунд и запрет скриншота.')}</div><button class="btn ghost" style="margin-top:12px" data-act="close">Закрыть</button>`)),
  limits: () => sheet(`<h3>Лимиты карты</h3>${kv('Покупки в день', '1 000 000 ₸')}${kv('Онлайн-покупки', 'Включены')}${kv('Покупки за рубежом', 'Выключены')}${kv('Снятие наличных', 'Недоступно (виртуальная)')}<button class="btn ghost" style="margin-top:14px" data-act="close">Готово</button>`),
  cb: d => { S.cbMode = d.v; S.m.cbChosen = d.v; save(); rerender(); toast(d.v === 'gold' ? 'Кэшбэк будет начисляться золотом' : 'Кэшбэк будет начисляться в тенге'); },
  pay: d => {
    const v = +d.v;
    if (S.card.frozen) { addTx({ type: 'card', title: `${d.n}: отклонено`, a: 'KZT', amt: -v, net: 'Карта Polus', st: 'failed', note: 'Карта заморожена' }); save(); return go('result', { ok: 0, h: 'Оплата отклонена', t: 'Карта заморожена. Разморозьте её, чтобы снова платить.', fix: 'card', fixT: 'К карте' }); }
    if (v > S.polus.KZT) { addTx({ type: 'card', title: `${d.n}: отклонено`, a: 'KZT', amt: -v, net: 'Карта Polus', st: 'failed', note: 'Недостаточно средств' }); save(); return go('result', { ok: 0, h: 'Недостаточно средств', t: `Покупка на ${kzt(v)} отклонена, на балансе ${kzt(S.polus.KZT)}. Деньги не списаны.`, fix: 'topup', fixT: 'Пополнить' }); }
    processing(() => {
      S.polus.KZT -= v; addTx({ type: 'card', title: d.n, a: 'KZT', amt: -v, net: 'Карта Polus · Apple Pay' });
      let cbTxt;
      if (S.cbMode === 'gold') { const g = v * OTC.cardCbGold / ASSETS.GOLD.price; credit('GOLD', g); S.cbGold += g; addTx({ type: 'cashback', title: 'Кэшбэк золотом', a: 'GOLD', amt: g, net: 'Polus Ledger', note: '1% с покупки: ' + d.n }); cbTxt = `+${fmt(g, 4)} г GOLD`; }
      else { const k = v * OTC.cardCbKzt; S.polus.KZT += k; addTx({ type: 'cashback', title: 'Кэшбэк в тенге', a: 'KZT', amt: k, net: 'Polus', note: '0,5% с покупки: ' + d.n }); cbTxt = `+${kzt(k, 2)}`; }
      save(); rerender(); toast(`Оплачено ${kzt(v)} · кэшбэк ${cbTxt}`);
    }, 'Apple Pay…');
  },
  bot: d => { const lbl = $(`[data-act="bot"][data-v="${d.v}"]`)?.textContent; if (lbl) S.chat.push({ me: 1, t: esc(lbl) }); botDo(d.v); },
  chatSend: () => { const t = $('#chat-t').value.trim(); if (!t) return; S.chat.push({ me: 1, t: esc(t) }); const l = t.toLowerCase(); const k = /скам|мошен|обман|украл|звонил/.test(l) ? 'scam' : /сделк|p2p|продав/.test(l) ? 'p2p' : /золот|gold/.test(l) ? 'gold' : /перевод|не приш/.test(l) ? 'transfer' : null; if (k) botSay(k); else { S.chat.push({ t: 'Передал ваш вопрос специалисту, ответ в течение 5 минут. А пока могу помочь с частыми вопросами:' }); S.chatNode = 'start'; } save(); rerender(); },
  security: () => sheet(`<h3>Безопасность</h3>${[['Вход по Face ID', 1], ['Подтверждение операций PIN-кодом', 1], ['Задержка 24 ч для новых адресов', 1], ['Уведомления о каждой операции', 1], ['Блок переводов при звонке (антискам)', 1]].map(([l, on]) => `<div class="between" style="padding:12px 0;border-top:1px solid #E6E6E1"><span class="small b">${l}</span><span class="toggle ${on ? 'on' : ''}"></span></div>`).join('')}${kv('Активные устройства', '1 (это устройство)')}<button class="btn ghost" style="margin-top:12px" data-act="close">Готово</button>`),
  reset: () => { try { localStorage.removeItem(KEY); } catch (e) {} S = fresh(); stack = []; DEAL = null; Q = null; render(true); toast('Демо сброшено'); },
  logout: () => { S.auth = false; S.route = 'welcome'; stack = []; save(); render(true); },
  ruGo: () => { if (!$('#ru-1').checked || !$('#ru-2').checked) { $('#ru-err').innerHTML = '<div class="err-t" style="margin-top:10px">Отметьте оба пункта, чтобы продолжить</div>'; return; } S.nick = $('#ru-nick').value.trim().slice(0, 24); pin('Придумайте PIN-код', () => { S.auth = true; S.role = 'user'; stack = []; save(); go('home', {}, false); toast('Аккаунт создан · подключите биржу или пополните баланс'); }, 'Создаём аккаунт…'); },
  toSeller: () => { close(); S.role = 'seller'; S.auth = true; ensureSeller(); stack = []; go('sHome', {}, false); },
  toUser: () => { close(); S.role = 'user'; stack = []; go('home', {}, false); },
  pin: d => pinKey(d.k),
};
function ptCalc(id) { const a = S._pt, v = parseFloat(($('#pt-amt') || {}).value?.replace(',', '.')) || 0; $('#pt-q').innerHTML = kv('Сеть', NET[a]) + kv('Комиссия сети', `${NETFEE[a]} ${a}`) + kv('Комиссия Polus', '0 ₸') + kv('Зачислим', `${fmt(Math.max(0, v - NETFEE[a]), ASSETS[a].dec)} ${a}`, 'total') + kv('Время', '1–10 мин'); }
function botSay(k) { S.chatNode = k; S.chat.push({ t: BOT[k].t }); }
function botDo(k) {
  if (k === 'do_freeze') { if (S.card) { S.card.frozen = true; S.chat.push({ t: '✅ Карта заморожена. Все операции по ней будут отклоняться.' }); } else S.chat.push({ t: 'У вас пока нет карты Polus, по карте операций не было.' }); S.chatNode = 'scam_after'; }
  else if (k === 'do_lock') { S.chat.push({ t: '✅ Все сессии, кроме текущей, завершены. Рекомендую сменить PIN.' }); S.chatNode = 'scam_after'; }
  else if (k === 'do_case') { S.chat.push({ t: `📋 Обращение <b>#PB-${uid()}</b> создано. Специалист подключится в течение 5 минут. Спорные средства заморожены до решения.` }); S.chatNode = 'scam_after'; }
  else if (k === 'do_hist') { save(); return go('history', {}); }
  else botSay(k);
  save(); rerender();
}
BOT.scam_after = { t: '', o: [['do_case', 'Создать обращение'], ['do_freeze', 'Заморозить карту'], ['start', 'Другой вопрос']] };

function codeOk() {
  const { role = 'user', mode = 'login' } = S.params; S.m.login = true; stack = [];
  if (role === 'user' && mode === 'reg') return go('regUser', {}, false);
  if (role === 'seller' && mode === 'reg') return go('sellerReg', { reg: 1 }, false);
  S.auth = true; S.role = role;
  if (role === 'seller') { ensureSeller(); go('sHome', {}, false); } else go('home', {}, false);
  setTimeout(() => toast(role === 'seller' ? 'Вход в кабинет продавца' : 'Добро пожаловать в Polus'), 300);
}
/* ============ events ============ */
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act],[data-go]'); if (!el) return;
  if (el.dataset.act) { const f = A[el.dataset.act]; if (f) f(el.dataset, el, e); return; }
  if (el.dataset.go) {
    const { go: r, root, ...rest } = el.dataset;
    close(); if (root) stack = [];
    if (r === 'otc') Q = null;
    go(r, { ...rest }, !root);
  }
});
document.addEventListener('input', e => {
  const k = e.target.dataset.in; if (!k) return; const v = e.target.value;
  if (k === 'phone') { let d = v.replace(/\D/g, ''); if (d && d[0] !== '7') d = '7' + d; d = d.slice(0, 11); const f = d ? '+7 ' + [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)].filter(Boolean).join(' ') : ''; e.target.value = f; S.phone = f; $('#sendc').disabled = d.length !== 11; }
  if (k === 'code' && v.length === 4) { if (v === '1234') codeOk(); else { const n = (S.params.err || 0) + 1; go('code', { ...S.params, err: Math.min(n, 2) }, false); } }
  if (k === 'otc') { S.params.v = v; otcUpdate(); }
  if (k === 'w') { S.params.v = v; wUpdate(); }
  if (k === 'tp') S.params.v = v;
  if (k === 'rq') { S.params.q = v; $('#rates-list').innerHTML = ratesList(v); }
  if (k === 'p2pb') { const d = v.replace(/\D/g, ''); S.params.b = d; clearTimeout(window._pb); window._pb = setTimeout(() => { rerender(); const i = $('[data-in="p2pb"]'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 400); }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'chat-t') A.chatSend(); });
document.addEventListener('change', e => { if (e.target.id === 'risk') $('#cf').disabled = !e.target.checked; });

/* demo shortcuts (desktop side panel) */
$$('[data-demo]').forEach(b => b.addEventListener('click', () => {
  const k = b.dataset.demo; close(); stack = [];
  if (k === 'onboarding') { S.ob = 0; S.auth = false; go('onboarding', {}, false); return; }
  if (k === 'welcome') { S.auth = false; go('welcome', {}, false); return; }
  S.auth = true; S.m.onboard = S.m.login = true; if (!S.phone) S.phone = '+7 777 000 00 47';
  if (k === 'seller') { S.role = 'seller'; if (S.seller && !S.seller.dealsN) S.seller = null; ensureSeller(); go('sHome', {}, false); return; }
  S.role = 'user';
  const map = { home: ['home'], partners: ['partners'], otc: ['otc', { side: 'buy', a: 'GOLD' }], p2p: ['p2p', { b: '150000' }], card: ['card'], support: ['support'], rates: ['rates', { q: 'Solana' }] };
  const [r, p] = map[k]; if (r === 'otc') Q = null; if (r !== 'home') stack.push({ route: 'home', params: {} }); go(r, p || {}, false);
}));

/* ============ live prices (real) ============ */
function refreshLive() {
  $$('[data-lp]').forEach(el => { const k = el.dataset.lp; const old = el.textContent; el.textContent = priceTxt(k); if (old !== el.textContent) { el.classList.remove('blink'); void el.offsetWidth; el.classList.add('blink'); } });
  $$('[data-lc]').forEach(el => { const k = el.dataset.lc; el.innerHTML = chg(chOf(k)) + (S.route === 'asset' ? ' за 24 ч' : ''); });
  $$('[data-lu]').forEach(el => { const k = el.dataset.lu; el.innerHTML = `≈ $${fmt(ASSETS[k].price / USD, 2)} · <span data-lc="${k}">${chg(chOf(k))}</span>`; });
  $$('[data-total]').forEach(el => { el.textContent = money(total()); });
  $$('[data-chart]').forEach(el => { const k = el.dataset.chart; el.innerHTML = spark(HIST[k], chOf(k) >= 0 ? '#5E9E00' : '#E5484D'); });
  $$('[data-src]').forEach(el => { el.textContent = srcLabel(); });
  const typing = document.activeElement && /INPUT|TEXTAREA/.test(document.activeElement.tagName);
  if (S.route === 'rates' && $('#rates-list')) $('#rates-list').innerHTML = ratesList(S.params.q || '');
  else if (!typing && !$('.overlay') && ['home', 'portfolio', 'gold', 'asset', 'p2p', 'sHome', 'sOrders'].includes(S.route)) rerender();
}
loadMarket();
setInterval(loadMarket, 60000);

/* ============ boot ============ */
if (!S.auth && !['onboarding', 'welcome', 'login', 'code', 'regUser', 'sellerReg'].includes(S.route)) S.route = 'onboarding';
if (S.auth && S.role === 'seller') ensureSeller();
if (S.route === 'deal' && !DEAL) S.route = 'p2p';
if (S.route === 'result') S.route = 'home';
render(true);
})();
