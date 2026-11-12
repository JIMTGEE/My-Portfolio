export type Project = {
  slug: string;
  name: string;
  category: "Business" | "Education" | "Institutional" | "Commerce";
  role: string;
  status: "Live" | "In development";
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  image: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "believe-travel-consult",
    name: "Believe Travel Consult",
    category: "Business",
    role: "Web Developer",
    status: "Live",
    summary:
      "A travel, recruitment, visa and relocation consultancy platform — public marketing site plus an admin dashboard for managing content, applications and client documents.",
    problem:
      "Believe Travel Consult needed a public-facing site that could take in Ghana Card, passport, birth-certificate and pre-screening applications directly, plus an admin side that staff without a technical background could actually run day to day.",
    approach:
      "Built the public site in PHP/MySQL, then rebuilt the admin dashboard onto a shared admin_header.php / admin_footer.php architecture so every admin page looks and behaves consistently. Added DataTables and AJAX toggles for managing blog posts, offers and messages, TinyMCE for rich content editing, and drag-and-drop image uploads. Built three public application forms — passport, birth certificate, and pre-screening — each a single self-contained PHP page that submits via AJAX straight into its own MySQL table, with uploaded documents organized by form type on the server.",
    outcome:
      "Staff can publish offers and respond to messages without touching code, and applicants can submit documents without phone calls or email back-and-forth. The offers page also moved off a third-party placeholder-image service onto a tiered image system (uploaded photo → Pexels search → Picsum → CSS placeholder), so listings always render cleanly even before a real photo is uploaded.",
    technologies: ["PHP", "MySQL", "JavaScript", "AJAX", "TinyMCE", "DataTables"],
    liveUrl: "https://believetc.com",
    githubUrl: "https://github.com/JIMTGEE/BelieveTC",
    image: "/projects/believetc.svg",
    featured: true,
  },
  {
    slug: "queenspa-school",
    name: "Queenest Paradise Montessori (QPMC)",
    category: "Education",
    role: "Web Developer",
    status: "Live",
    summary:
      "A full school management system for Queenest Paradise Montessori Complex — admissions, academics, attendance, fees, and a teacher-facing student diagnosis tool.",
    problem:
      "A growing Montessori school needed one system to run admissions, record attendance and grades, track fee payments accurately, and give teachers a fast way to flag which students needed attention — without juggling spreadsheets.",
    approach:
      "Built out the school's PHP/MySQL system end to end: an admissions pipeline, academic records, and an attendance page redesigned around a clean binary present/absent toggle with a minimal schema instead of a heavier status model. Tracked down and fixed a SUM(DISTINCT amount) SQL bug in fee_payments.php that was producing incorrect fee totals. Currently building a teacher-portal 'Student Diagnosis' page: a one-student-at-a-time view combining academic performance and behavior/conduct notes into an auto-generated risk flag — On Track, Needs Attention, or At Risk — with the criteria list deliberately trimmed down so it stays usable in practice, not just complete on paper.",
    outcome:
      "The school runs admissions, attendance and fee tracking on one system instead of scattered spreadsheets, with fee totals now calculating correctly and a lightweight early-warning tool for teachers taking shape.",
    technologies: ["PHP", "MySQL", "JavaScript", "HTML/CSS"],
    liveUrl: "https://qpmcedu.com",
    githubUrl: "https://github.com/JIMTGEE/QPMCEDU",
    image: "/projects/qpmcedu.svg",
    featured: true,
  },
  {
    slug: "edusync",
    name: "EduSync",
    category: "Education",
    role: "Web Developer",
    status: "Live",
    summary:
      "A PHP-based school administration platform covering admissions, applications and day-to-day school operations.",
    problem:
      "Schools running admissions and day-to-day administration on paper or spreadsheets needed a single web-based system to handle both.",
    approach:
      "Built as a PHP/MySQL application with an admissions pipeline, an online application form, a contact workflow, and a small internal API layer for the admin side — following the same practical, form-and-database-first approach used on the QPMC and Believe Travel Consult systems.",
    outcome:
      "A working admissions and administration platform, showcased as one of NerdSpring's delivered systems.",
    technologies: ["PHP", "MySQL", "JavaScript"],
    githubUrl: "https://github.com/JIMTGEE/EDUSYNC",
    image: "/projects/edusync.svg",
  },
  {
    slug: "transnow",
    name: "TransNow",
    category: "Business",
    role: "Web Developer",
    status: "Live",
    summary:
      "A recruitment / job-board platform connecting employers and job seekers, with employer accounts, listings, and messaging.",
    problem:
      "Employers and job seekers needed a straightforward place to post and find work — listings, applications, and direct messaging, without the overhead of a generic job board.",
    approach:
      "Built in PHP/MySQL with separate employer and seeker areas, job and job-detail pages, authentication, an internal messaging system, and an admin back office to oversee listings and accounts.",
    outcome:
      "A functioning job-board platform, now showcased as one of NerdSpring's delivered products.",
    technologies: ["PHP", "MySQL", "JavaScript"],
    liveUrl: "https://trnasnow.com",
    githubUrl: "https://github.com/JIMTGEE/TRANSNOW",
    image: "/projects/transnow.svg",
  },
  {
    slug: "ciug",
    name: "CIUG — Confucius Institute at the University of Ghana",
    category: "Institutional",
    role: "Web Developer",
    status: "Live",
    summary:
      "A multi-language institutional website for the Confucius Institute at the University of Ghana, covering programs, testing, and scholarships.",
    problem:
      "An academic institute needed a credible public website covering its Chinese-language programs, HSK testing information, scholarship pathways to study in China, and cultural events — built for search visibility from the start.",
    approach:
      "Built as a static, multi-language site (with a dedicated /en/ structure) with full SEO scaffolding: XML sitemaps for pages, images and video, robots.txt, and structured page content for each program and testing track.",
    outcome:
      "A clean, fast, SEO-ready institutional site that doesn't depend on a database or server-side runtime to stay online.",
    technologies: ["HTML5", "CSS3", "JavaScript", "SEO/sitemaps"],
    liveUrl: "https://ci-ug.com",
    githubUrl: "https://github.com/JIMTGEE/CIUG",
    image: "/projects/ciug.svg",
  },
  {
    slug: "bless-mall-ghana",
    name: "Bless Mall Ghana",
    category: "Commerce",
    role: "Web Developer",
    status: "Live",
    summary:
      "An e-commerce storefront for imported goods, with cart, checkout, Paystack payments, and SMS order notifications.",
    problem:
      "A Ghana-based import/retail business needed a real online storefront — browsing by category, cart and checkout, online payment, and order notifications — not just a product catalogue.",
    approach:
      "Built in PHP/MySQL with category browsing, cart and checkout flows, account and address management, and server-side integrations for Paystack (payments) and an SMS API (order notifications), configured through environment-variable-backed settings so credentials stay out of the codebase.",
    outcome:
      "A working storefront that can take real payments and notify customers by SMS, deployed on the client's own hosting.",
    technologies: ["PHP", "MySQL", "Paystack API", "SMS API"],
    liveUrl: "https://blessmallgh.com",
    githubUrl: "https://github.com/JIMTGEE/BLESS-MALL",
    image: "/projects/blessmall.svg",
  },
  {
    slug: "nerdspring",
    name: "NerdSpring",
    category: "Business",
    role: "Co-founder & Web Developer",
    status: "Live",
    summary:
      "The studio I co-founded and ran through 2025–2026 — websites, web apps, management systems and digital solutions, built on the same PHP/MySQL foundations as the projects above.",
    problem:
      "Co-founding a technology studio meant it needed its own credible public presence, showcasing the systems it had actually delivered rather than generic agency copy.",
    approach:
      "Built the studio's own site and used it to present the real delivered work — including EduSync and TransNow — alongside the services the studio offered.",
    outcome:
      "A studio site that served as a portfolio for the systems built under the NerdSpring name. The partnership behind it ended in 2026; that work now continues under JIHOPE.",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "https://nerd-spring.com",
    image: "/projects/nerdspring.svg",
    featured: false,
  },
  {
    slug: "jihope",
    name: "JIHOPE",
    category: "Business",
    role: "Founder & Web Developer",
    status: "Live",
    summary:
      "My own web & software studio, launched in 2026 after NerdSpring — a parallax-driven marketing site plus the services and delivery model behind it.",
    problem:
      "After NerdSpring ended, I needed a studio of my own: a credible, modern public presence that reflects how I actually want to deliver work going forward.",
    approach:
      "Designed and built the JIHOPE site myself — dark navy/electric-blue visual identity, a multi-layer parallax hero, and sections covering services, process, pricing and real case studies (including Believe Travel Consult and the Queenest Paradise Montessori system above).",
    outcome:
      "A live studio site I run myself, and the home base for everything I build next.",
    technologies: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "https://jihope.tech",
    githubUrl: "https://github.com/JIMTGEE/jihope-tech",
    image: "/projects/jihope.svg",
    featured: true,
  },
];

export const projectCategories = [
  "All",
  "Business",
  "Education",
  "Institutional",
  "Commerce",
] as const;
