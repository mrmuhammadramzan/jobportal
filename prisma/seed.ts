/**
 * prisma/seed.ts — RozeDesk database seed.
 *
 * Creates:
 *   1. Admin user        (admin@rozedesk.com / Admin@1234)
 *   2. Sample seeker     (seeker@example.com / Seeker@1234)
 *   3. Sample jobs       (6 listings across categories)
 *   4. Payment settings  (JazzCash + Easypaisa)
 *
 * Run: node node_modules\prisma\build\index.js db seed
 * Or:  ts-node prisma/seed.ts
 *
 * LESSON: Seed should be idempotent — use upsert everywhere so re-running is safe.
 */
import { PrismaClient } from "../rozedesk-app/src/generated/prisma";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱  Starting seed…");

  /* ── 1. Admin user ── */
  const adminHash = await bcrypt.hash("Admin@1234", 12);
  const admin     = await db.user.upsert({
    where:  { email: "admin@rozedesk.com" },
    update: {},
    create: {
      name:         "Super Admin",
      email:        "admin@rozedesk.com",
      passwordHash: adminHash,
      role:         "ADMIN",
    },
  });
  console.log(`  ✓ Admin:  ${admin.email}`);

  /* ── 2. Sample seeker ── */
  const seekerHash = await bcrypt.hash("Seeker@1234", 12);
  const seeker     = await db.user.upsert({
    where:  { email: "seeker@example.com" },
    update: {},
    create: {
      name:         "Ayesha Malik",
      email:        "seeker@example.com",
      passwordHash: seekerHash,
      role:         "SEEKER",
      profile: {
        create: {
          phone:        "+92 300 1234567",
          location:     "Lahore, Pakistan",
          summary:      "Experienced React Developer with 3 years of hands-on experience.",
          skills:       ["React", "TypeScript", "Node.js", "Tailwind CSS"],
          jobType:      "Full-time",
          desiredSalary:"80000",
          remotePref:   "Remote preferred",
        },
      },
    },
  });
  console.log(`  ✓ Seeker: ${seeker.email}`);

  /* ── 3. Sample jobs ── */
  const JOBS = [
    {
      title:       "React Developer",
      company:     "Systems Ltd",
      location:    "Lahore",
      type:        "Full-time",
      category:    "Technology",
      description: "We are looking for a skilled React Developer to join our growing engineering team. You will be responsible for building and maintaining high-quality web applications.\n\nYou will work closely with the product, design, and backend teams to deliver features that matter.",
      requirements:["3+ years React experience", "Strong TypeScript skills", "REST API integration", "Git & CI/CD"],
      benefits:    ["Competitive salary", "Remote-friendly", "Annual bonus", "Health insurance"],
      salaryMin:   80000,
      salaryMax:   130000,
      status:      "ACTIVE" as const,
    },
    {
      title:       "UI/UX Designer",
      company:     "Arbisoft",
      location:    "Remote",
      type:        "Full-time",
      category:    "Design",
      description: "Join our design team to create beautiful, functional interfaces. You will conduct user research, create wireframes, and deliver pixel-perfect designs.\n\nWe value designers who think about the whole user experience, not just aesthetics.",
      requirements:["3+ years UI/UX", "Figma proficiency", "User research skills", "Design systems"],
      benefits:    ["Fully remote", "Flexible hours", "MacBook provided", "Annual retreat"],
      salaryMin:   70000,
      salaryMax:   110000,
      status:      "ACTIVE" as const,
    },
    {
      title:       "Marketing Executive",
      company:     "Gaditek",
      location:    "Karachi",
      type:        "Full-time",
      category:    "Marketing",
      description: "Drive growth through digital marketing campaigns. You will manage social media, SEO/SEM, email marketing, and content strategies.\n\nIdeal candidate has experience in B2C marketing in the Pakistani market.",
      requirements:["2+ years digital marketing", "Google Ads certified", "Analytics proficiency", "Content strategy"],
      benefits:    ["Market salary", "Travel allowance", "Training budget", "Bonus structure"],
      salaryMin:   60000,
      salaryMax:   90000,
      status:      "ACTIVE" as const,
    },
    {
      title:       "Node.js Engineer",
      company:     "10Pearls",
      location:    "Islamabad",
      type:        "Full-time",
      category:    "Technology",
      description: "Build scalable backend services and APIs. You will architect microservices, integrate third-party APIs, and ensure high availability.\n\nExperience with cloud platforms (AWS/GCP) is a strong plus.",
      requirements:["4+ years Node.js", "PostgreSQL/MongoDB", "REST & GraphQL", "Docker/Kubernetes"],
      benefits:    ["Top-market salary", "Stock options", "Paid learning", "Medical coverage"],
      salaryMin:   100000,
      salaryMax:   160000,
      status:      "ACTIVE" as const,
    },
    {
      title:       "Product Manager",
      company:     "Netsol Technologies",
      location:    "Lahore",
      type:        "Full-time",
      category:    "Technology",
      description: "Define product strategy and roadmap for our fintech platform. You will work with stakeholders, engineers, and designers to ship features users love.\n\nMBA or equivalent experience in product management required.",
      requirements:["5+ years PM experience", "Agile/Scrum", "Data-driven mindset", "Fintech knowledge preferred"],
      benefits:    ["Excellent salary", "ESOP", "International exposure", "Leadership training"],
      salaryMin:   120000,
      salaryMax:   200000,
      status:      "ACTIVE" as const,
    },
    {
      title:       "Content Writer",
      company:     "Contour Software",
      location:    "Remote",
      type:        "Part-time",
      category:    "Marketing",
      description: "Create engaging blog posts, social media content, and email copy for our SaaS product.\n\nThis is a part-time remote role — ideal for writers who want flexibility and love technology topics.",
      requirements:["2+ years content writing", "SEO knowledge", "Tech industry interest", "Excellent English"],
      benefits:    ["Flexible hours", "Remote work", "Contract-based", "Growth opportunities"],
      salaryMin:   30000,
      salaryMax:   50000,
      status:      "ACTIVE" as const,
    },
  ];

  for (const job of JOBS) {
    const existing = await db.job.findFirst({ where: { title: job.title, company: job.company } });
    if (!existing) {
      await db.job.create({ data: job });
      console.log(`  ✓ Job:    ${job.title} @ ${job.company}`);
    } else {
      console.log(`  — Job:    ${job.title} @ ${job.company} (already exists)`);
    }
  }

  /* ── 4. Payment settings ── */
  const PAY_SETTINGS = [
    { method: "JazzCash",  phone: "03001234567", name: "RozeDesk Payments",  address: "Lahore, Pakistan", active: true },
    { method: "Easypaisa", phone: "03111234567", name: "RozeDesk Payments",  address: "Lahore, Pakistan", active: true },
  ];

  for (const ps of PAY_SETTINGS) {
    await db.paymentSetting.upsert({
      where:  { method: ps.method },
      update: {},
      create: ps,
    });
    console.log(`  ✓ Pay:    ${ps.method} → ${ps.phone}`);
  }

  console.log("\n✅  Seed complete.");
  console.log("   Admin login:  admin@rozedesk.com  /  Admin@1234");
  console.log("   Seeker login: seeker@example.com  /  Seeker@1234");
}

main()
  .catch(e => { console.error("❌  Seed failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
