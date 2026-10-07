// All site copy lives here. Edit this file to change text; no component code needed.

export const COMPANY = {
  name: "Setvion AI Solutions",
  tagline: "Building bridges with modern technology",
  email: "amruthkumar206@gmail.com",
  phone: "+44 7771 488177",
  phoneLabel: "07771 488177",
  linkedin: "", // e.g. "https://www.linkedin.com/company/setvion" - shows in the footer when set
};

// ---------------------------------------------------------------- Services
// `text` is the short version (home page); the rest powers the detailed Services page.
export const SERVICES = [
  {
    id: "ai",
    title: "AI & automation",
    text: "Chatbots, AI assistants and automated workflows that take repetitive work off your team.",
    intro:
      "Most businesses do not need \"an AI strategy\". They need the daily grind to shrink. We find the repetitive, rules-based work that eats your team's hours (answering the same questions, re-keying data, chasing approvals) and replace it with assistants and automations that are reliable, supervised and easy to understand.",
    gets: [
      "Customer-facing and internal AI chatbots trained on your own content",
      "Workflow automation across email, forms, spreadsheets, CRMs and finance tools",
      "Document processing: extracting, classifying and filing information automatically",
      "LLM features inside your existing software, with guardrails and human review where it matters",
    ],
    fits: ["Support teams answering repeat questions", "Admin-heavy back offices", "Sales teams qualifying and following up leads"],
    tags: ["AI chatbots", "Process automation", "LLM integration", "Custom AI tools"],
  },
  {
    id: "web",
    title: "Websites & apps",
    text: "Fast, mobile-first websites and custom web apps designed around your customers.",
    intro:
      "Your website is often the first impression and the hardest-working employee you have. We design and build fast, accessible, mobile-first sites, and go further when you need custom software: booking systems, customer portals, staff tools and multi-seller marketplaces, built to be owned and extended by you.",
    gets: [
      "Brand-aligned websites that load fast and rank well",
      "Online booking, payments and e-commerce, set up end to end",
      "Custom web apps and progressive web apps that work on any device",
      "Admin dashboards so your team can manage content and operations without a developer",
    ],
    fits: ["Service businesses taking bookings and payments", "Retailers moving online", "Teams running on spreadsheets that have outgrown them"],
    tags: ["Responsive design", "E-commerce", "Progressive web apps", "Custom web apps"],
  },
  {
    id: "data",
    title: "Data & reporting",
    text: "Clean, connected data and clear dashboards, so decisions are made with confidence.",
    intro:
      "Good decisions need numbers you can trust. We bring scattered data together, clean it, and present it in dashboards that answer real questions in seconds. From a single Power BI report to a full cloud data platform, we build what fits your size and grow it with you.",
    gets: [
      "Data pipelines that collect and tidy information from every system you use",
      "Cloud data platforms and warehouses, including migrations to modern platforms such as Databricks",
      "Power BI and web dashboards for sales, operations, staffing and finance",
      "Scheduled and real-time reporting so nobody builds the Monday report by hand",
    ],
    fits: ["Owners who want one view of the business", "Teams with data in many places", "Companies preparing to scale"],
    tags: ["Power BI dashboards", "Data pipelines", "Cloud data warehousing", "Real-time reporting"],
  },
  {
    id: "cloud",
    title: "Cloud & integration",
    text: "We connect the tools you already use so information flows without copy and paste.",
    intro:
      "Every business ends up with a patchwork of tools that do not talk to each other, and people become the glue. We connect them with secure, well-documented integrations and move workloads to the cloud sensibly, with cost, security and reliability designed in from the start.",
    gets: [
      "API integrations between your systems, so data enters once and flows everywhere",
      "Cloud setup and migration on Azure, AWS or Google Cloud",
      "Secure access, backups and monitoring, with costs kept predictable",
      "Clear documentation and handover, so you are never locked in to us",
    ],
    fits: ["Businesses re-keying data between tools", "Teams moving off ageing servers", "Firms with security or compliance questions"],
    tags: ["Azure", "AWS", "Google Cloud", "API integrations"],
  },
];

// ---------------------------------------------------------------- Process
export const PROCESS = [
  {
    title: "Discovery",
    text: "We learn your workflows and find where technology genuinely helps.",
    bullets: [
      "A focused conversation with you and the people who do the work",
      "We map how things run today and where time and money leak",
      "We tell you honestly what is worth building, and what is not",
    ],
    deliverable: "A short findings summary and recommended scope",
  },
  {
    title: "Proposal",
    text: "A clear plan, timeline and fixed price, agreed before we start.",
    bullets: [
      "Scope written in plain language, with what is in and out",
      "A milestone timeline with dates you can plan around",
      "A fixed price, so there are no surprise invoices",
    ],
    deliverable: "A written proposal you can approve or challenge",
  },
  {
    title: "Development",
    text: "Built in visible stages, so you see real progress every week.",
    bullets: [
      "Short build cycles ending in a working demo you can click through",
      "Your feedback shapes each stage before we move on",
      "Testing, security and performance handled as we go, not at the end",
    ],
    deliverable: "Weekly demos and a running staging version",
  },
  {
    title: "Delivery & support",
    text: "We launch, train your team and stay on hand afterwards.",
    bullets: [
      "A planned launch with data migrated and everything checked",
      "Hands-on training so your team is confident from day one",
      "Documentation, full ownership transfer and ongoing support options",
    ],
    deliverable: "A live system, documentation and everything you own",
  },
];

export const FAQ = [
  {
    q: "How do you price projects?",
    a: "Fixed price, agreed in writing before work starts. If the scope changes we discuss it first and agree the cost together, so you are never surprised by an invoice.",
  },
  {
    q: "Do we own what you build?",
    a: "Yes. Code, data, designs and documentation are handed over to you in full. We avoid proprietary lock-in, and you can take the work to another team at any time.",
  },
  {
    q: "We are not technical. Is that a problem?",
    a: "Not at all. It is the normal case. We explain every decision in plain language and you will never need to decode jargon to approve something.",
  },
  {
    q: "How long does a typical project take?",
    a: "A focused website or automation can take a few weeks; larger platforms take longer. You get a milestone timeline in the proposal, and a working demo every week along the way.",
  },
  {
    q: "What happens after launch?",
    a: "We train your team, hand over documentation and stay available. Support and improvement plans are optional, never a requirement.",
  },
];

// ---------------------------------------------------------------- Home
export const PRINCIPLES = [
  { title: "Straight talk, no jargon", text: "Plain answers to your questions, never confusing tech-speak." },
  { title: "Small enough to move fast", text: "Quick replies, with no waiting in a queue behind bigger clients." },
  { title: "Clear scope, fixed price", text: "You know the cost before we begin. No surprise invoices, ever." },
  { title: "Built to last", text: "Documented and handed over fully. Never a black box only we understand." },
];

// ---------------------------------------------------------------- About
export const MOTTO = "Building bridges with modern technology";

export const STATS = [
  { value: "24h", label: "Typical reply time" },
  { value: "100%", label: "Ownership handed to you" },
  { value: "0", label: "Surprise invoices" },
  { value: "4", label: "Clear stages on every project" },
];

export const MISSION = {
  mission: "To make enterprise-grade technology accessible, understandable and genuinely useful for growing businesses.",
  vision: "A world where no business is told it is too small for good technology.",
};

export const VALUES = [
  { title: "Clarity over complexity", text: "If we cannot explain it simply, we have not understood it well enough. You will always know what we are building, why, and what it costs." },
  { title: "Honesty first", text: "We will tell you when something is not worth building, when a simpler option exists, or when we are not the right fit. Trust is worth more than any single project." },
  { title: "You own it", text: "Code, data, designs and documentation are yours. We build to hand over, never to lock in." },
  { title: "Engineering craft", text: "The same standards large organisations rely on: tested, secure, documented and maintainable, applied at a scale that suits you." },
  { title: "Accountability", text: "Fixed scope, fixed price and visible weekly progress. We put our name to what we deliver and stand behind it." },
  { title: "Long-term partnership", text: "Launch day is a milestone, not the finish line. We stay close so your technology keeps pace with your business." },
];

export const PROMISES = [
  "A reply within one working day",
  "A fixed price before any work begins",
  "A working demo every week",
  "Plain-English documentation",
  "Everything handed over, fully yours",
];

export const PRODUCT = {
  name: "Setvion Workforce Manager",
  intro: "Born from a system we built for a client, now a ready-to-adapt product for any small or medium business that runs on its people.",
  features: [
    { title: "Sales history, tracked", text: "See how sales have moved over time instead of relying on memory or scattered records." },
    { title: "Compare staff performance", text: "See exactly which team members drive the most sales, side by side." },
    { title: "Expenses vs. revenue", text: "Monitor spending against income so real profit is always visible, not just turnover." },
    { title: "One BI dashboard", text: "Every number in one place, built for quick, confident decisions. No spreadsheets." },
  ],
};

// CLIENTS: every image dropped into frontend/src/clients/ shows up automatically.
// Name comes from the file name ("Cloud_Master.png" -> "Cloud Master"); override below if needed.
// Use square-ish logos, roughly 400-600px, PNG/JPG/WebP/SVG, with a little padding around the mark.
const CLIENT_NAME_OVERRIDES = {
  CloudMaster: "Cloud Master",
  CNU_Barbers: "CNU Barbers",
};
const logoFiles = import.meta.glob("./clients/*.{png,jpg,jpeg,webp,svg}", { eager: true, query: "?url", import: "default" });
export const CLIENTS = Object.entries(logoFiles)
  .map(([path, logo]) => {
    const key = path.split("/").pop().replace(/\.[^.]+$/, "");
    return { name: CLIENT_NAME_OVERRIDES[key] || key.replace(/[_-]+/g, " "), logo };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

// TESTIMONIALS: add real quotes here and the carousel appears on the homepage automatically.
// Example (delete the // to use):
// { quote: "They built exactly what we needed, and explained every step in plain English.", name: "Owner name", role: "Owner, CNU Barbers" },
export const TESTIMONIALS = [];

// Shown only at /?preview so you can see the carousel before real quotes exist. Never shown to visitors.
export const SAMPLE_TESTIMONIALS = [
  { quote: "Sample review: they explained every step in plain English and delivered exactly what was agreed, on the date they promised.", name: "Sample Name", role: "Owner, Sample Business" },
  { quote: "Sample review: our team saves hours every week since the automation went live. The weekly demos meant there were no surprises at launch.", name: "Sample Name", role: "Operations Manager, Sample Ltd" },
  { quote: "Sample review: finally a technology partner who tells you the truth about what is worth building. Fixed price, fully handed over, and still on hand when we have questions.", name: "Sample Name", role: "Director, Sample Co" },
];
