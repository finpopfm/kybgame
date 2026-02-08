// Share card utility — generates a shareable text/image for results
// Using native Web Share API with clipboard fallback

export async function shareScore({ grade, funTitle, score }) {
  const text = [
    `🎮 FINPOP: Pass the KYB`,
    ``,
    `Grade: ${grade} — "${funTitle}"`,
    `📊 Accuracy: ${score.accuracy}%`,
    `🕵️ Fraudsters caught: ${score.fraudstersCaught}/${score.totalFraudsters}`,
    `⚡ Speed: ${score.speedRating}`,
    ``,
    `Can you beat my score?`,
    `🎵 finpop.fm`,
  ].join('\n');

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'FINPOP: Pass the KYB',
        text,
      });
      return true;
    } catch {
      return false;
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
