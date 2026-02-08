const days = [
  {
    day: 1,
    title: 'First Day on the Job',
    subtitle: 'Welcome to FINPOP Compliance Division',
    description: 'Review merchant applications. Check documents for red flags. Make your call: Approve, Reject, or Request More Docs.',
    timerSeconds: null, // no timer on day 1 (tutorial)
    merchantCount: 3,
  },
  {
    day: 2,
    title: 'Volume Picks Up',
    subtitle: 'More applications. Less time to think.',
    description: 'The CEO wants faster onboarding. But cutting corners means letting fraudsters in.',
    timerSeconds: 180, // 3 minutes
    merchantCount: 5,
  },
  {
    day: 3,
    title: 'Red Flags Everywhere',
    subtitle: 'The fraud ring is getting creative.',
    description: 'Complex cases are piling up. Pay attention to details — the fakes are getting better.',
    timerSeconds: 210, // 3.5 minutes
    merchantCount: 7,
  },
  {
    day: 4,
    title: 'The Pressure Cooker',
    subtitle: 'Revenue vs. Risk. Choose wisely.',
    description: 'Cash reserves are low. The board wants growth. But one bad merchant could cost everything.',
    timerSeconds: 210, // 3.5 minutes
    merchantCount: 8,
  },
  {
    day: 5,
    title: 'Audit Day',
    subtitle: 'Every decision will be reviewed.',
    description: 'The external auditor is watching. Consistency and accuracy matter more than ever.',
    timerSeconds: 180, // 3 minutes
    merchantCount: 6,
  },
];

export function getDayConfig(day) {
  return days.find(d => d.day === day);
}

export default days;
