import { PrismaClient, Role, ProjectStatus } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clean existing records to avoid duplicates on re-run
  console.log("🧹 Cleaning existing tables...");
  await prisma.auditLog.deleteMany({});
  await prisma.contactInquiry.deleteMany({});
  await prisma.systemSetting.deleteMany({});
  await prisma.faq.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.businessDivision.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Seed default Super Admin
  console.log("👤 Seeding system users...");
  const hashedPassword = await bcrypt.hash("MedicxusAdmin2026!", 10);
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@medicxus.com",
      username: "admin",
      password: hashedPassword,
      name: "Super Admin",
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Seeded default Super Admin user: ${adminUser.username}`);

  // 3. Seed Business Divisions
  console.log("📂 Seeding business divisions...");
  const devEducation = await prisma.businessDivision.create({
    data: {
      title: "Care Institute of Health Sciences",
      slug: "care-institute",
      description: "World-class healthcare education programs designed to shape the next generation of medical professionals with international standards.",
      icon: "🎓",
      iconColor: "icon-blue",
      sortOrder: 1,
    },
  });

  const devHealthcare = await prisma.businessDivision.create({
    data: {
      title: "Medicxus Diagnostic",
      slug: "medicxus-diagnostic",
      description: "Advanced diagnostic services combining precision technology with compassionate patient care for accurate and timely results.",
      icon: "🏥",
      iconColor: "icon-teal",
      sortOrder: 2,
    },
  });

  const devConsultancy = await prisma.businessDivision.create({
    data: {
      title: "Study Abroad Next Project",
      slug: "study-abroad-mbbs",
      description: "Guiding aspiring doctors to the world's finest medical universities with end-to-end admission and visa support.",
      icon: "🌍",
      iconColor: "icon-amber",
      sortOrder: 3,
      targetUrl: "https://study-abroad-wg4o.vercel.app/",
    },
  });

  const devITServices = await prisma.businessDivision.create({
    data: {
      title: "Hospital Management System",
      slug: "healthcare-it-solutions",
      description: "Hospital management, lab software, web development, and digital marketing — purpose-built for healthcare operations.",
      icon: "💻",
      iconColor: "icon-purple",
      sortOrder: 4,
      targetUrl: "https://lightcoral-chimpanzee-457948.hostingersite.com/frontend/login.php",
    },
  });
  console.log("✅ Seeded business divisions successfully.");

  // 4. Seed Dynamic Projects under IT Services (Healthcare Technology Suite)
  console.log("💼 Seeding project listings...");
  const projectsData = [
    {
      title: "Hospital Management Software",
      slug: "hospital-management-software",
      description: "End-to-end HMS for patient records, billing, appointments and clinical workflows.",
      thumbnailUrl: "/assets/project-hms.jpg",
      targetUrl: "https://hms.medicxus.com",
      status: ProjectStatus.ACTIVE,
      category: "IT Services",
      sortOrder: 1,
    },
    {
      title: "Lab Management Software",
      slug: "lab-management-software",
      description: "Complete LIMS for sample tracking, reporting, and quality control.",
      thumbnailUrl: "/assets/project-lims.jpg",
      targetUrl: "https://lims.medicxus.com",
      status: ProjectStatus.ACTIVE,
      category: "IT Services",
      sortOrder: 2,
    },
    {
      title: "Website Development",
      slug: "website-development",
      description: "Professional, SEO-optimized healthcare websites built for conversion.",
      thumbnailUrl: "/assets/project-web.jpg",
      targetUrl: "https://web.medicxus.com",
      status: ProjectStatus.ACTIVE,
      category: "IT Services",
      sortOrder: 3,
    },
    {
      title: "Digital Marketing",
      slug: "digital-marketing",
      description: "Healthcare-focused campaigns across social, search, and performance channels.",
      thumbnailUrl: "/assets/project-marketing.jpg",
      targetUrl: "https://marketing.medicxus.com",
      status: ProjectStatus.ACTIVE,
      category: "IT Services",
      sortOrder: 4,
    },
    {
      title: "Healthcare Projects",
      slug: "healthcare-projects",
      description: "Custom digital transformation projects for hospitals and health networks.",
      thumbnailUrl: "/assets/project-healthcare.jpg",
      targetUrl: "https://healthcare.medicxus.com",
      status: ProjectStatus.ACTIVE,
      category: "IT Services",
      sortOrder: 5,
    },
    {
      title: "IT Infrastructure",
      slug: "it-infrastructure",
      description: "Cloud, networking and IT support tailored for healthcare environments.",
      thumbnailUrl: "/assets/project-infra.jpg",
      targetUrl: "https://infra.medicxus.com",
      status: ProjectStatus.ACTIVE,
      category: "IT Services",
      sortOrder: 6,
    },
  ];

  for (const proj of projectsData) {
    await prisma.project.create({
      data: {
        ...proj,
        divisionId: devITServices.id,
        seoTitle: `${proj.title} - Medicxus Group`,
        seoDescription: proj.description,
      },
    });
  }
  console.log("✅ Seeded project portfolio entries.");

  // 5. Seed System Settings (Global SEO metadata config)
  console.log("⚙️ Seeding system settings...");
  await prisma.systemSetting.create({
    data: {
      key: "global_seo",
      value: JSON.stringify({
        title: "Medicxus Group",
        description: "Empowering Healthcare. Transforming Lives.",
      }),
    },
  });
  console.log("✅ Seeded global SEO configuration settings.");

  // 6. Seed FAQs
  console.log("❓ Seeding FAQs...");
  const faqs = [
    {
      question: "What core sectors does Medicxus Group operate in?",
      answer: "Medicxus Group is a diversified healthcare conglomerate operating across four key pillars: Health Sciences Education, Advanced Diagnostics, International Medical University Consultancy (Study Abroad MBBS), and Healthcare IT Solutions.",
      sortOrder: 1,
    },
    {
      question: "Are your IT solutions custom-built for medical organizations?",
      answer: "Yes, our complete suite of software—including Hospital Management Software (HMS), Laboratory Information Management Systems (LIMS), and secure telemedicine platforms—is engineered strictly according to healthcare industry compliance and operations.",
      sortOrder: 2,
    },
    {
      question: "How does the Study Abroad MBBS project guide students?",
      answer: "We provide end-to-end advisory services for aspiring doctors, which includes choosing top-ranked accredited medical universities globally, securing admissions, processing student visas, and ensuring post-arrival hosting.",
      sortOrder: 3,
    },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }
  console.log("✅ Seeded default FAQs.");

  // 7. Seed Testimonials
  console.log("🌟 Seeding testimonials...");
  await prisma.testimonial.create({
    data: {
      authorName: "Dr. Rajesh Kumar",
      role: "Chief Medical Officer",
      company: "City Health Hospital",
      content: "Medicxus Diagnostic and their Laboratory Software completely transformed our patient reporting pipeline. The precision, integration, and reliability of their solutions are unmatched in South Asia.",
      rating: 5,
      avatarUrl: "/assets/avatar-doctor.jpg",
      isApproved: true,
    },
  });
  console.log("✅ Seeded default testimonials.");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
