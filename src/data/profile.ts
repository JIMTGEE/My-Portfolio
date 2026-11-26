export const profile = {
  name: "Tohybu Tajudeen",
  shortName: "Tohybu",
  title: "Web Developer",
  tagline: "Web Developer & Technology Entrepreneur",
  positioning:
    "Software Developer · Web Solutions Architect · Technology Entrepreneur · AI & Machine Learning Enthusiast",
  location: "Accra, Ghana",
  availability: "Open to freelance & collaboration",
  heroHeadline: ["Building digital", "experiences.", "Engineering possibilities."],
  // A single, concrete line instead of the generic headline above — what
  // actually gets built, in the same language as the real project
  // categories in data/projects.ts (Business / Education / Institutional /
  // Commerce), not a marketing phrase that happens to scan well.
  heroTagline: "Building systems used by schools, businesses and institutions.",
  heroIntro:
    "I'm Tohybu Tajudeen, a web developer and technology entrepreneur based in Ghana. I build responsive websites, web applications, and database-driven systems — and I'm expanding into Python, Microsoft Azure AI, and machine learning, one real project at a time.",
  about: {
    kicker: "About",
    heading: "My journey in technology",
    // Bento-tile content for About.tsx — same substance as the original
    // four paragraphs, just split into named, individually-expandable
    // tiles instead of one unbroken block of text (see the doc's "stop
    // listing, start showing" / bento-grid feedback). `span` is the tile's
    // lg:col-span so the grid keeps its two-wide/one-wide rhythm.
    tiles: [
      {
        icon: "code",
        title: "Web development",
        teaser: "Business sites, school systems, travel and recruitment platforms — one real project at a time.",
        body: "My path into technology started with curiosity and a willingness to keep learning. Through web development I've worked on business websites, education platforms, travel and recruitment systems, and database-backed management tools — each one teaching me something new about how software actually gets used.",
        span: 2,
      },
      {
        icon: "rocket",
        title: "Entrepreneurship",
        teaser: "Co-founded NerdSpring, then built JIHOPE on my own terms.",
        body: "I co-founded NerdSpring and ran it as a technology business delivering websites, web apps and school management systems — a crash course in the entrepreneurial side of software: not just how it's built, but how it has to create real value for the people using it. That partnership ended in 2026, and I'm now building JIHOPE, my own web & software studio, carrying that experience forward on my own terms.",
        span: 1,
      },
      {
        icon: "graduation",
        title: "Teaching & travel",
        teaser: "French and coding logic at Queenest Paradise Montessori; travel ops at B.B.H Travel.",
        body: "Before web development, I taught French and introduced young students to programming logic at Queenest Paradise Montessori, and spent time in the travel industry at B.B.H Travel — both of which shaped how I explain technical things to non-technical people.",
        span: 1,
      },
      {
        icon: "brain",
        title: "AI & machine learning",
        teaser: "Expanding into Python, Azure AI and OCR-based automation — starting with exam marking at scale.",
        body: "My journey continues beyond web development. I'm expanding my knowledge of Python, Microsoft Azure AI, and machine learning, with a growing interest in intelligent systems, document automation, and OCR-based tools that solve problems I've actually run into — like marking exam papers at scale.",
        span: 2,
      },
    ],
  },
  githubUsername: "JIMTGEE",
  socials: {
    github: "https://github.com/JIMTGEE",
    linkedin: "https://www.linkedin.com/in/tohybu-tajudeen-694192283",
    // TODO (Tohybu): add your public contact email and (optional) WhatsApp
    // number — the Contact section and footer quietly omit either of these
    // while left blank rather than showing a dead link.
    email: "",
    whatsapp: "",
    jihope: "https://jihope.tech",
  },
  resumeNote:
    "A formal CV / resume link goes here once you share a PDF or LinkedIn export.",
};

export const languages = [
  { name: "English", level: "Fluent" },
  { name: "French", level: "Fluent" },
  { name: "Twi", level: "Basic" },
];

export const education = [
  {
    school: "Lycée Modern Aboisso",
    credential: "Baccalauréat, General Studies",
    period: "2021",
  },
  {
    school: "Collège Modern Aboisso",
    credential: "BEPC",
    period: "2018",
  },
  {
    school: "edX",
    credential: "Online professional training — web development, computer science & programming fundamentals",
    period: "2023 – Present",
  },
  {
    school: "StudySection",
    credential: "English Language Diploma Certificate (Advanced)",
    period: "July 2023",
    detail: "Pass · 26/50 (52%) · Intermediate",
    fileHref: "/documents/studysection-english-language-diploma.pdf",
  },
  {
    school: "StudySection",
    credential: "Computer Applications Diploma Certificate (Advanced)",
    period: "August 2026",
    detail: "Pass · 40/50 (80%) · Very Good",
    fileHref: "/documents/studysection-computer-applications-diploma.pdf",
  },
];

export const journey = [
  {
    org: "JIHOPE",
    role: "Founder & Web Developer",
    period: "2026 — Present",
    description:
      "Building JIHOPE, my own web & software studio, after NerdSpring wound down — taking the delivery experience from that partnership and applying it on my own terms: websites, web applications, and database-backed systems, built and shipped end to end.",
    href: "https://jihope.tech",
  },
  {
    org: "NerdSpring",
    role: "Co-founder & Web Developer",
    period: "2025 — 2026",
    description:
      "Co-founded a technology business delivering websites, web applications, school management systems, and digital solutions. Involved end-to-end: requirements gathering, development, database integration, deployment, and client-facing technical decisions. The partnership ended in 2026.",
    href: "https://nerd-spring.com",
  },
  {
    org: "Queenest Paradise Montessori",
    role: "French & Coding Instructor",
    period: "2024 — 2025",
    description:
      "Taught French and introduced students to basic programming concepts, logical thinking, and early web technologies.",
    href: "https://qpmcedu.com",
  },
  {
    org: "B.B.H Travel",
    role: "Travel Agency Assistant",
    period: "2022 — 2024",
    description:
      "Supported travel bookings, customer inquiries, documentation, and day-to-day administrative operations.",
    href: "",
  },
  {
    org: "edX",
    role: "Online Professional Training",
    period: "2023 — Present",
    description:
      "Continued, self-directed learning in web development, computer science fundamentals, and programming — the backbone of how I keep my working skills current.",
    href: "https://www.edx.org",
  },
];
