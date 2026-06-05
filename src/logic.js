// ═══════════════════════════════════════════
// Pure logic extracted from index.html for testability
// ═══════════════════════════════════════════

// ─── UTILS ─────────────────────────────────
export function formatBig(n) {
  if (n >= 1e12) return (n / 1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return Math.round(n).toString();
}

// ─── WORLD SATURATION ──────────────────────
export const WORLD_POP = 8_000_000_000;
export const RECRUIT_FACTOR = 5;
export const MAX_LEVELS = 20;

export function computeWorldData(recruitFactor = RECRUIT_FACTOR, maxLevels = MAX_LEVELS) {
  const d = [];
  let t = 1;
  for (let l = 1; l <= maxLevels; l++) {
    const a = Math.pow(recruitFactor, l);
    t += a;
    d.push({ level: l, atLevel: a, total: t });
  }
  return d;
}

export function computeSaturationLevel(wData, worldPop = WORLD_POP) {
  for (let i = 0; i < wData.length; i++) {
    if (wData[i].total >= worldPop) return i + 1;
  }
  return wData.length;
}

// ─── PYRAMID ───────────────────────────────
export function computePyramidStats(factor, levels) {
  const rows = [];
  for (let l = 0; l <= levels; l++) rows.push(Math.pow(factor, l));
  const atLevel = rows[levels];
  let below = 0;
  for (let l = levels + 1; l <= levels + 3; l++) below += Math.pow(factor, l);
  let total = 0;
  for (let l = 0; l <= levels; l++) total += rows[l];
  const abovePct = ((total - atLevel) / total * 100).toFixed(1);
  return { rows, atLevel, below, total, abovePct };
}

// ─── INVESTMENT CALCULATOR ─────────────────
export function calcInvestment(monthly, years, rate = 0.07) {
  const months = years * 12;
  const mr = rate / 12;
  const fv = monthly * ((Math.pow(1 + mr, months) - 1) / mr);
  const spent = monthly * months;
  return { fv: Math.round(fv), spent, diff: Math.round(fv - spent) };
}

// ─── QUIZ LOGIC ────────────────────────────
export const quizData = [
  { company: 'Herbalife', type: 'Nutrition / Weight Loss', topEarnerPct: 0.5, medianIncome: 300, netLossPct: 73,
    question: 'What percentage of Herbalife members make a meaningful annual income (over $5,000)?',
    options: ['About 35%', 'About 12%', 'Less than 1%', 'About 5%'], correct: 2 },
  { company: 'Amway', type: 'Consumer Products (The Oldest Major MLM)', topEarnerPct: 0.26, medianIncome: 207, netLossPct: 99,
    question: 'The FTC examined Amway\'s income distribution. What did the average "Business Owner" earn annually?',
    options: ['$8,400', '$3,200', '$780', '$207'], correct: 3 },
  { company: 'LuLaRoe', type: 'Leggings / Fashion MLM', topEarnerPct: 0.01, medianIncome: 0, netLossPct: 80,
    question: 'LuLaRoe required consultants to buy large upfront inventory. What happened to most of it?',
    options: ['Sold at full price', 'Sold at a steep discount', 'Returned to LuLaRoe', 'Sat unsold in garages'], correct: 3 },
  { company: 'Monat', type: 'Hair Care / Beauty', topEarnerPct: 0.5, medianIncome: 183, netLossPct: 67,
    question: 'Monat\'s income disclosure shows the median "Market Partner" earns what annually?',
    options: ['$4,200', '$1,800', '$750', '$183'], correct: 3 },
  { company: 'Nu Skin', type: 'Anti-Aging / Skincare', topEarnerPct: 0.5, medianIncome: 89, netLossPct: 90,
    question: 'Nu Skin calls its top rank "Brand Representatives." What percentage of all distributors reach this level?',
    options: ['About 8%', 'About 3%', 'Less than 0.5%', 'About 15%'], correct: 2 },
  { company: 'Primerica', type: 'Financial Products / Insurance MLM', topEarnerPct: 0.3, medianIncome: 520, netLossPct: 84,
    question: 'Primerica sells life insurance through an MLM model. What do they call their sales force?',
    options: ['"Independent Business Owners"', '"Financial Representatives"', '"Licensed Life Coaches"', '"Market Partners"'], correct: 1 },
  { company: 'Arbonne', type: 'Vegan Skincare / Wellness', topEarnerPct: 0.03, medianIncome: 742, netLossPct: 86,
    question: 'Arbonne\'s pitch is "Be your own boss." What do they actually require to stay "Active" each month?',
    options: ['Sell $150 in products to customers', 'Buy $150 in products yourself', 'Recruit 2 new members', 'Attend 1 team training call'], correct: 1 },
];

export function scoreQuizAnswer(questionIndex, answerIndex) {
  const q = quizData[questionIndex];
  if (!q) return null;
  return { correct: answerIndex === q.correct, correctAnswer: q.correct };
}

export function computeQuizFinalMessage(score, total) {
  const pct = Math.round(score / total * 100);
  let msg;
  if (pct >= 80) msg = 'You can see through the machine. Share this with someone who needs to see it.';
  else if (pct >= 50) msg = 'You\'re starting to see it. Go back and look at the income disclosure numbers — they\'re all public record.';
  else msg = 'The system is designed to be hard to see. That\'s the whole point. Go through it again.';
  return { pct, msg };
}

// ─── SOCIAL COST CALCULATOR ────────────────
export function calcSocialCost({ close, acquaint, months, msgs }) {
  const total = close + acquaint;
  const closePitched = Math.min(Math.round(close * 0.72), close);
  const acquaintPitched = Math.min(Math.round(acquaint * 0.62), acquaint);
  const pitched = closePitched + acquaintPitched;
  const lostClose = Math.round(closePitched * 0.42);
  const totalMsgs = months * msgs;
  const awkward = Math.round(months * 1.5);
  const estNetLoss = Math.round(months * 280);
  return { total, closePitched, acquaintPitched, pitched, lostClose, totalMsgs, awkward, estNetLoss };
}

// ─── QUICKSAND DEBT CALCULATOR ─────────────
export const qsItems = [
  { label: 'Starter kit / buy-in', min: 200, max: 3000, val: 800, unit: '$' },
  { label: 'Monthly product minimums × 12', min: 50, max: 400, val: 150, unit: '$/mo' },
  { label: 'Training calls / subscriptions × 12', min: 0, max: 200, val: 49, unit: '$/mo' },
  { label: 'Conference / event tickets', min: 0, max: 1500, val: 400, unit: '$/yr' },
  { label: 'Motivational books, CDs, pods', min: 0, max: 500, val: 120, unit: '$/yr' },
  { label: 'Printing, websites, biz tools', min: 0, max: 400, val: 80, unit: '$/yr' },
];

export function computeQuicksandTotal(values) {
  let total = 0;
  qsItems.forEach((item, i) => {
    const v = values[i] !== undefined ? values[i] : item.val;
    total += item.unit === '$/mo' ? v * 12 : item.unit === '$/yr' ? v : v;
  });
  return total;
}

// ─── RESCUE TOOL CALCULATIONS ──────────────
export const mlmData = {
  'Herbalife':      { medianIncome: 300, netLossPct: 73, category: 'nutrition', minMonthly: 150 },
  'Amway':          { medianIncome: 207, netLossPct: 99, category: 'household', minMonthly: 100 },
  'LuLaRoe':        { medianIncome: 0,   netLossPct: 80, category: 'clothing',  minMonthly: 200 },
  'Monat':          { medianIncome: 183, netLossPct: 67, category: 'haircare',  minMonthly: 84 },
  'Nu Skin':        { medianIncome: 89,  netLossPct: 90, category: 'skincare',  minMonthly: 100 },
  'Primerica':      { medianIncome: 520, netLossPct: 84, category: 'financial', minMonthly: 25 },
  'Arbonne':        { medianIncome: 742, netLossPct: 86, category: 'skincare',  minMonthly: 150 },
  'doTERRA':        { medianIncome: 220, netLossPct: 78, category: 'oils',      minMonthly: 100 },
  'Young Living':   { medianIncome: 190, netLossPct: 80, category: 'oils',      minMonthly: 100 },
  'Mary Kay':       { medianIncome: 180, netLossPct: 99, category: 'cosmetics', minMonthly: 225 },
  'Avon':           { medianIncome: 130, netLossPct: 87, category: 'cosmetics', minMonthly: 40 },
  'Rodan + Fields': { medianIncome: 880, netLossPct: 76, category: 'skincare',  minMonthly: 80 },
  'Tupperware':     { medianIncome: 120, netLossPct: 94, category: 'kitchen',   minMonthly: 0 },
  'Pampered Chef':  { medianIncome: 150, netLossPct: 88, category: 'kitchen',   minMonthly: 0 },
  'Isagenix':       { medianIncome: 210, netLossPct: 90, category: 'nutrition', minMonthly: 150 },
  'Beachbody / BODi': { medianIncome: 260, netLossPct: 82, category: 'fitness', minMonthly: 38 },
  '4Life':          { medianIncome: 170, netLossPct: 91, category: 'nutrition', minMonthly: 100 },
  'ACN':            { medianIncome: 400, netLossPct: 79, category: 'telecom',   minMonthly: 0 },
};

export const retailMarkup = {
  nutrition: 3.2, household: 2.8, clothing: 2.5, haircare: 3.5,
  skincare: 4.0, financial: 1.2, oils: 4.5, cosmetics: 3.0,
  kitchen: 2.0, fitness: 2.2, telecom: 1.1
};

export const levelMultiplier = [0, 0.12, 0.28, 0.55, 0.82, 1.0];

export function computeRescueReport({
  mlmName,
  months,
  hrsWeek,
  buyin,
  events,
  training,
  closeP,
  damaged,
  selectedLevel,
  monthlyMlm,
  monthlyRetail,
}) {
  const mInfo = mlmData[mlmName] || { medianIncome: 200, netLossPct: 82 };
  const monthlyTraining = training;
  const totalMonthly = monthlyMlm + monthlyTraining;

  // MONEY
  const totalSpent = Math.round(buyin + (totalMonthly * months) + events);
  const retailEquiv = Math.round((monthlyRetail * months) + buyin * 0.1);
  const overpaid = Math.max(totalSpent - retailEquiv, 0);
  const grossIncome = Math.round(mInfo.medianIncome * (months / 12) * levelMultiplier[selectedLevel]);
  const netLoss = Math.max(totalSpent - grossIncome, 0);
  const investedVal = Math.round(totalMonthly * ((Math.pow(1 + 0.07 / 12, months) - 1) / (0.07 / 12)));

  // TIME
  const totalHours = Math.round(hrsWeek * (months * 4.33));
  const sellHours = Math.round(totalHours * 0.35);
  const recruitHrs = Math.round(totalHours * 0.25);
  const contentHrs = Math.round(totalHours * 0.25);
  const adminHrs = Math.round(totalHours * 0.15);
  const minWageVal = Math.round(totalHours * 12);
  const skillDays = Math.round(totalHours / 8);

  // SOCIAL
  const totalPitched = Math.round(closeP * 0.7 + closeP * 0.3);
  const awkwardMoments = Math.round(months * 1.8);
  const msgsSent = Math.round(months * 4.33 * (hrsWeek > 20 ? 18 : 10));

  return {
    totalSpent, retailEquiv, overpaid, grossIncome, netLoss, investedVal,
    totalHours, sellHours, recruitHrs, contentHrs, adminHrs, minWageVal, skillDays,
    totalPitched, awkwardMoments, msgsSent, totalMonthly, mInfo,
  };
}
