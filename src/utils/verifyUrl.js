// Build and parse verify URLs with score data encoded in query params

// Uses hash routing (#/verify?...) for static hosting compatibility (GitHub Pages, etc.)
const ORIGIN = 'https://kyb.finpop.fm';

export function buildVerifyUrl(score, grade, funTitle) {
  const params = new URLSearchParams({
    g: grade,
    a: String(score.accuracy),
    f: String(score.fraudstersCaught),
    ft: String(score.totalFraudsters),
    fb: String(score.legitimateBlocked),
    fa: String(score.approvedFraudsters),
    s: score.speedRating,
    t: funTitle,
    c: String(score.correct),
    n: String(score.total),
  });
  return `${ORIGIN}/#/verify?${params.toString()}`;
}

export function parseVerifyParams() {
  // Parse from hash: #/verify?g=A&a=95&...
  const hash = window.location.hash;
  if (!hash.startsWith('#/verify')) return null;

  const qIndex = hash.indexOf('?');
  if (qIndex === -1) return null;

  const params = new URLSearchParams(hash.slice(qIndex + 1));
  const g = params.get('g');
  if (!g) return null;

  return {
    grade: g,
    funTitle: params.get('t') || 'Unknown',
    score: {
      accuracy: parseInt(params.get('a')) || 0,
      fraudstersCaught: parseInt(params.get('f')) || 0,
      totalFraudsters: parseInt(params.get('ft')) || 0,
      legitimateBlocked: parseInt(params.get('fb')) || 0,
      approvedFraudsters: parseInt(params.get('fa')) || 0,
      speedRating: params.get('s') || 'Unknown',
      correct: parseInt(params.get('c')) || 0,
      total: parseInt(params.get('n')) || 0,
    },
  };
}
