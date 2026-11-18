export type SkillGroup = {
  category: string;
  items: string[];
};

// Working, professional-level skills — things I use day to day.
export const workingSkills: SkillGroup[] = [
  {
    category: "Front-end",
    items: ["HTML5", "CSS3", "JavaScript"],
  },
  {
    category: "Back-end",
    items: ["PHP"],
  },
  {
    category: "Database",
    items: ["SQL", "MySQL", "Database design"],
  },
  {
    category: "Development",
    items: ["Responsive web applications", "UI implementation"],
  },
  {
    category: "Deployment",
    items: ["Web hosting", "Domain configuration", "Deployment"],
  },
  {
    category: "Productivity",
    items: ["Microsoft Word", "Microsoft Excel"],
  },
];

// Explicitly NOT at professional proficiency yet — learning in public.
export const learningSkills: SkillGroup[] = [
  {
    category: "Programming",
    items: ["Python"],
  },
  {
    category: "AI",
    items: ["Microsoft Azure AI"],
  },
  {
    category: "Machine Learning",
    items: ["Machine learning fundamentals"],
  },
];

export const emergingFocus = [
  {
    title: "Python",
    status: "Learning",
    note: "Working through fundamentals and small scripting projects — automation, data handling, and groundwork for AI work.",
  },
  {
    title: "Microsoft Azure AI",
    status: "Learning",
    note: "Exploring Azure's AI services as the cloud platform for future intelligent-systems projects.",
  },
  {
    title: "Machine Learning",
    status: "Exploring",
    note: "Studying ML concepts with a concrete target in mind: OCR and automated assessment (see the exam-marking concept below), not ML for its own sake.",
  },
];

export const emergingProjects = [
  {
    title: "AI-assisted exam marking — concept",
    kind: "Concept / early design",
    description:
      "A Python system that reads scanned exam papers and marks them against a marking scheme — handling messy handwriting and crossed-out answers, and showing allocated marks directly on the paper. Still at the design stage: the open problem right now is handling thousands of papers without reprocessing each one, and whether it needs dedicated scanning hardware rather than a standard printer/scanner.",
    stage: "concept",
  },
];

// Completed, verifiable credentials — kept separate from the courses still
// in progress below. The underlying certificate PDF is served from
// /public/documents so "View certificate" links to the real file rather
// than a claim with nothing behind it.
export const credentials = [
  {
    title: "Microsoft Azure AI Essentials: Workloads and Machine Learning on Azure",
    issuer: "LinkedIn Learning",
    date: "September 2026",
    duration: "3h 23m",
    topSkills: ["Machine Learning", "Azure AI Foundry", "Artificial Intelligence (AI)"],
    fileHref: "/documents/azure-ai-essentials-certificate.pdf",
  },
];

// A course actually in progress right now, with real per-skill XP pulled
// straight from the Coursera skills tracker — not a polished "proficiency"
// claim, just an honest, small-numbers snapshot of where things stand.
export const courseProgress = {
  title: "Crash Course on Python",
  platform: "Coursera",
  currentModule: "Basic Python Syntax — Week 2",
  href: "https://www.coursera.org/learn/python-crash-course/home/module/2",
  skills: [
    { name: "Foundational Programming", xp: 243, max: 1000 },
    { name: "Statistical Modeling and Inference", xp: 38, max: 1200 },
    { name: "System Security and Automation Management", xp: 23, max: 700 },
    { name: "Systematic Debugging, Testing & Quality Assurance", xp: 16, max: 700 },
    { name: "Machine Learning Foundations", xp: 10, max: 500 },
    { name: "Scripting and API Automation for IT Operations", xp: 9, max: 600 },
    { name: "Automation Scripting for IT Ops & System Management", xp: 6, max: 400 },
    { name: "Data Cleaning and Preparation", xp: 3, max: 500 },
    { name: "Work Planning and Professional Execution", xp: 2, max: 700 },
  ],
};
