// Character dialogue lines triggered by game events
// Each character has: image, name, color, role

export const CHARACTERS = {
  luna: {
    name: 'LUNA',
    role: 'CEO',
    image: '/images/CEO.png',
    color: '#a855f7',
  },
  iris: {
    name: 'IRIS',
    role: 'CTO',
    image: '/images/CTO.png',
    color: '#3b82f6',
  },
  nova: {
    name: 'NOVA',
    role: 'CFO',
    image: '/images/CFO.png',
    color: '#ec4899',
  },
  vera: {
    name: 'VERA',
    role: 'COO',
    image: '/images/COO.png',
    color: '#8b5cf6',
  },
};

// Dialogue triggers
const dialogues = {
  // ===== DAY START =====
  dayStart: {
    1: [
      { character: 'vera', text: "Welcome to FINPOP Compliance. I'm VERA, your COO. Let's get you started." },
      { character: 'vera', text: "Your job: review merchant applications. Check company info, UBO details, and documents for red flags." },
      { character: 'vera', text: "Three buttons: APPROVE legit merchants, REJECT suspicious ones, REQUEST DOCS if something's missing." },
      { character: 'luna', text: "Hey! I'm Luna, CEO. We need good merchants onboarded ASAP. But no shortcuts on compliance!" },
    ],
    2: [
      { character: 'luna', text: "Morning! We've got 5 applications today. Investors want to see growth numbers." },
      { character: 'vera', text: "More volume today. Timer is on — but accuracy matters more than speed." },
      { character: 'iris', text: "I've seen some suspicious patterns in the pipeline. Stay sharp." },
    ],
    3: [
      { character: 'iris', text: "Alert: our fraud detection flagged unusual activity. Multiple applications from connected entities." },
      { character: 'vera', text: "7 applications. Some of them might look clean on the surface. Dig deeper." },
      { character: 'nova', text: "Every rejected merchant is lost revenue. But every approved fraudster costs us 10x more." },
    ],
    4: [
      { character: 'nova', text: "Cash reserves dropped 15% this week. We need revenue from new merchants." },
      { character: 'luna', text: "The board is watching. We need to onboard faster." },
      { character: 'vera', text: "I know there's pressure. But one compliance failure and we lose our payment license." },
      { character: 'iris', text: "Fraudsters love pressure. That's when mistakes happen. Take your time." },
    ],
    5: [
      { character: 'vera', text: "Today is audit day. An external auditor will review ALL your past decisions." },
      { character: 'luna', text: "This audit determines our license renewal. No pressure... okay, a lot of pressure." },
      { character: 'iris', text: "I'll be monitoring for any last-minute fraud attempts. They always try before audits." },
      { character: 'nova', text: "Your accuracy today will define the company's future. Make every decision count." },
    ],
  },

  // ===== CORRECT APPROVE =====
  correctApprove: [
    { character: 'luna', text: "Great call! Another legit merchant onboarded." },
    { character: 'vera', text: "Clean approval. Well reviewed." },
    { character: 'nova', text: "Revenue flowing. Love to see it." },
    { character: 'luna', text: "Smooth onboarding. This is what growth looks like." },
    { character: 'vera', text: "Documents check out. Good eye." },
  ],

  // ===== CORRECT REJECT =====
  correctReject: [
    { character: 'iris', text: "Caught one! That application had fraud written all over it." },
    { character: 'vera', text: "Good catch. Red flags confirmed." },
    { character: 'iris', text: "Another fraudster blocked. Our risk score just improved." },
    { character: 'vera', text: "Rejected for good reason. Compliance win." },
    { character: 'iris', text: "Nice. That one was trying to slip through." },
  ],

  // ===== CORRECT REQUEST =====
  correctRequest: [
    { character: 'vera', text: "Smart move. Better to ask than to guess." },
    { character: 'iris', text: "Requesting more docs is the right call when something feels off." },
    { character: 'vera', text: "Due diligence done right. We'll follow up with them." },
  ],

  // ===== WRONG: Approved a fraudster =====
  wrongApprove: [
    { character: 'iris', text: "Wait... I'm seeing red flags on that one. Did you check the UBO?" },
    { character: 'vera', text: "Hmm, that approval might come back to haunt us." },
    { character: 'nova', text: "If that turns out to be fraud, the chargeback costs will be brutal." },
    { character: 'iris', text: "That merchant's documents had inconsistencies. Review more carefully." },
  ],

  // ===== WRONG: Rejected a legit merchant =====
  wrongReject: [
    { character: 'luna', text: "That was a legitimate business... we just lost a customer." },
    { character: 'nova', text: "False rejection. That's revenue we won't get back." },
    { character: 'luna', text: "Their documents were clean. What made you reject?" },
    { character: 'vera', text: "Overly cautious. We need to balance risk with opportunity." },
  ],

  // ===== WRONG: Requested docs on clean merchant =====
  wrongRequest: [
    { character: 'luna', text: "Their docs were already complete. That delay cost us their trust." },
    { character: 'nova', text: "Unnecessary doc requests slow down our pipeline." },
  ],

  // ===== WRONG: Requested docs when should reject =====
  wrongRequestOnFraud: [
    { character: 'iris', text: "Don't request more docs from obvious fraudsters. Reject them outright." },
    { character: 'vera', text: "That one had clear red flags. A request just gives them time to fabricate more." },
  ],

  // ===== TIME PRESSURE =====
  timePressure: [
    { character: 'luna', text: "Clock is ticking! We need decisions faster." },
    { character: 'nova', text: "Time is money. Literally. Each delay costs us." },
    { character: 'vera', text: "Stay focused. Quick but careful." },
  ],

  // ===== STREAK =====
  streak3: [
    { character: 'luna', text: "Three in a row! You're on fire!" },
    { character: 'vera', text: "Nice streak. Keep this accuracy up." },
  ],
  streak5: [
    { character: 'iris', text: "5 correct calls in a row. Impressive pattern recognition." },
    { character: 'nova', text: "Flawless run. The board is going to love these numbers." },
  ],
};

export function getRandomDialogue(category) {
  const pool = dialogues[category];
  if (!pool || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getDayStartDialogues(day) {
  return dialogues.dayStart[day] || [];
}

export default dialogues;
