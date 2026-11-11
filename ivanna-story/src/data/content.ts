import { config } from './config';

const [name, miaa, mikuuu, yemiaa] = config.recipient.nicknames;
const owner = config.owner.name;

/** Every visible text of the story (except Bible verses and lyrics). */
export const content = {
  welcome: {
    eyebrow: 'A Little Story for You',
    lines: [
      { text: `Hi, ${name}...`, pause: 1500 },
      { text: `Or should I call you ${miaa}?`, pause: 1600 },
      { text: "I've been wanting to tell you something.", pause: 1500 },
      { text: 'And I think today is the right time.', pause: 900 },
    ],
    cta: 'Open My Little Story ♡',
  },

  letter: {
    title: 'A Letter for You',
    hint: 'Tap the envelope to open it',
    greeting: `Dear ${name},`,
    paragraphs: [
      'Aku nggak terlalu jago ngomongin perasaan, makanya aku bikin ini. Semoga kamu nggak keberatan baca sampai habis ya.',
      `Sejak kenal kamu, hari-hariku terasa agak beda. Bukan karena hal besar, tapi karena hal-hal kecil: cara kamu cerita, cara kamu ketawa, dan gimana ngobrol sama kamu selalu bikin aku senyum sendiri. Kamu itu spesial, ${miaa}, mungkin lebih dari yang kamu sadari.`,
      `Bisa kenal kamu itu sesuatu yang berarti banget buat aku. Kehadiranmu bikin hari yang biasa aja jadi terasa hangat. ${mikuuu}, kalau kamu lagi capek atau lagi nggak baik-baik aja, aku harap kamu tahu bahwa kamu sering bikin orang di sekitarmu merasa lebih tenang.`,
      `Jujur, aku suka sama kamu, ${yemiaa}. Bukan sekadar kagum sebentar. Aku suka sama kamu pelan-pelan, tulus, dan dari hati. Aku nggak mau pura-pura biasa aja lagi.`,
      'Apa pun jawabanmu nanti, aku cuma mau kamu tahu kalau ini jujur, dan aku berterima kasih kamu mau meluangkan waktu buat baca sampai sini.',
    ],
    signoff: owner,
    closing: "There's something I want to ask you...",
    showAll: 'Show everything',
    cta: 'Continue ♡',
  },

  verses: {
    title: 'A Little Reminder from God',
    next: 'Next verse',
    back: 'Back',
    closing:
      'Maybe some beautiful things in life are worth being grateful for, and knowing you is one of them.',
    cta: "There's One More Thing...",
  },

  confession: {
    dear: `Dear ${name}...`,
    question: 'Would you like to be someone special in my life?',
    sub: "I don't know what tomorrow holds, but I'd love to get to know you more and create beautiful memories together.",
    yes: "YES, I'D LOVE TO! ♡",
    no: 'NO, SORRY :(',
    yesThanks: `Thank you, ${name} ♡`,
    yesThanksSub: 'You just made my whole world a little brighter.',
    toasts: [
      'Eits, kok mau nolak? 🥺',
      'Hmm, coba pikir sekali lagi deh.',
      'Are you really sure? 🥹',
      'Wrong button, maybe? Hehe.',
      'The universe says... try again! ♡',
    ],
    settled: "Okay okay, I'll stop running. Choose whatever feels right to you ♡",
    decline: {
      title: `That's completely okay, ${name}.`,
      body: "Thank you for reading my little story, truly. No pressure and no hard feelings. I'm just glad I got to say it honestly.",
      back: 'Wait, let me think again ♡',
      leave: 'Close this page',
      farewell: `You can close this tab now. Take care, ${name} ♡`,
      backFromFarewell: 'Back to the question',
    },
  },

  cinematic: {
    skip: 'Skip',
    pauseHint: 'Use the music button to pause or resume the song',
  },

  wish: {
    heading: 'One Last Thing, My Dear...',
    subtitle: "Now it's your turn. Tell me something you'd like to say, or perhaps a little wish for us.",
    nameLabel: 'Your Name',
    answerLabel: 'Your Answer',
    answerValue: "YES / I'D LOVE TO",
    wishLabel: 'Your Wish',
    wishPlaceholder: 'If I could make one wish, it would be...',
    messageLabel: 'Your Message (optional)',
    messagePlaceholder: "There's something else I'd like to tell you...",
    submit: 'Send My Little Wish ♡',
    errors: {
      name: 'Please tell me your name.',
      wish: 'Please write a little wish first.',
      number: 'The WhatsApp number is not configured yet (see src/data/config.ts).',
    },
    sending: 'Preparing your little wish...',
    readyTitle: 'Your message is ready in WhatsApp ♡',
    readyBody:
      "WhatsApp only pre-fills the message. Please press Send inside WhatsApp so it reaches me.",
    blockedBody:
      "Your browser blocked the new tab. Tap the button below to open WhatsApp.",
    openWa: 'Open WhatsApp ♡',
    openWaAgain: 'Open WhatsApp again',
    done: "I've sent it",
  },

  thanks: {
    title: `Thank you, ${name}. ♡`,
    body: "Whatever happens next, I'm grateful that you took the time to read my little story.",
    signoff: `With love, ${owner}.`,
    replay: 'Replay Our Little Story',
  },
};
