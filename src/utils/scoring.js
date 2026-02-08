export function calculateScore(allDecisions) {
  const total = allDecisions.length;
  if (total === 0) return null;

  const correct = allDecisions.filter(d => d.correct).length;
  const accuracy = Math.round((correct / total) * 100);

  const fraudsters = allDecisions.filter(d => d.correctVerdict === 'reject');
  const fraudstersCaught = fraudsters.filter(d => d.verdict === 'reject').length;
  const totalFraudsters = fraudsters.length;

  const legitimateBlocked = allDecisions.filter(
    d => d.correctVerdict === 'approve' && d.verdict === 'reject'
  ).length;

  const approvedFraudsters = allDecisions.filter(
    d => d.correctVerdict === 'reject' && d.verdict === 'approve'
  ).length;

  const avgTimeMs = allDecisions.reduce((sum, d) => sum + d.timeSpent, 0) / total;
  const avgTimeSec = Math.round(avgTimeMs / 1000);

  let speedRating;
  if (avgTimeSec < 10) speedRating = 'Lightning';
  else if (avgTimeSec < 20) speedRating = 'Fast';
  else if (avgTimeSec < 35) speedRating = 'Steady';
  else if (avgTimeSec < 50) speedRating = 'Careful';
  else speedRating = 'Thorough';

  return {
    total,
    correct,
    accuracy,
    fraudstersCaught,
    totalFraudsters,
    legitimateBlocked,
    approvedFraudsters,
    avgTimeSec,
    speedRating,
  };
}

export function getGrade(accuracy) {
  if (accuracy >= 95) return 'A+';
  if (accuracy >= 90) return 'A';
  if (accuracy >= 80) return 'B';
  if (accuracy >= 70) return 'C';
  if (accuracy >= 55) return 'D';
  return 'F';
}

export function getGradeClass(grade) {
  if (grade.startsWith('A')) return 'a';
  if (grade === 'B') return 'b';
  if (grade === 'C') return 'c';
  if (grade === 'D') return 'd';
  return 'f';
}

export function getFunTitle(score, grade) {
  if (grade === 'A+' && score.approvedFraudsters === 0) return 'KYB Ninja';
  if (grade.startsWith('A')) return 'Compliance Queen';
  if (grade === 'B' && score.speedRating === 'Lightning') return 'Speed Auditor';
  if (grade === 'B') return 'Risk Analyst';
  if (grade === 'C') return 'Paper Pusher';
  if (grade === 'D' && score.approvedFraudsters > 2) return "Fraudster's Best Friend";
  if (grade === 'D') return 'Compliance Rookie';
  if (score.legitimateBlocked > 3) return 'The Blocker';
  return "The Auditor's Nightmare";
}
