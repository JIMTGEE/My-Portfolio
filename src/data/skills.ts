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
