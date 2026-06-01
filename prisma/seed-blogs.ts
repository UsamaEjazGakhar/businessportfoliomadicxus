import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("📝 Seeding blog posts...");

  const blogs = [
    {
      title: "The Evolution of Hospital Management Systems",
      slug: "the-evolution-of-hospital-management-systems",
      author: "Dr. Bilal Siddiqui",
      category: "Healthcare Technology",
      content:
        "Hospital Management Systems (HMS) have undergone a remarkable transformation over the past two decades. From paper-based record keeping to fully integrated digital platforms, the evolution has been driven by the need for efficiency, accuracy, and better patient outcomes. Modern HMS solutions now incorporate AI-powered diagnostics, real-time bed management, automated billing workflows, and telemedicine integration. At Medicxus, we are at the forefront of this revolution, building systems that not only streamline operations but also enhance the quality of care delivered to patients across South Asia.",
      status: "Published",
      publishedAt: new Date("2026-05-15"),
      readTime: "5 min read",
    },
    {
      title: "Guiding Medical Students: Preparing for MBBS Abroad",
      slug: "guiding-medical-students-preparing-for-mbbs-abroad",
      author: "Prof. Sarah Khan",
      category: "Education Consultancy",
      content:
        "Pursuing an MBBS degree abroad is an exciting yet challenging journey for medical students. The process involves careful selection of accredited universities, understanding visa requirements, preparing for entrance examinations, and adapting to a new cultural environment. Our Study Abroad MBBS Project at Medicxus provides comprehensive guidance at every step — from shortlisting universities in countries like China, Russia, Georgia, and the Philippines, to managing documentation, securing scholarships, and arranging post-arrival support. This article covers essential tips and strategies for aspiring doctors looking to study medicine internationally.",
      status: "Draft",
      publishedAt: null,
      readTime: "8 min read",
    },
    {
      title: "Why Automation is Critical for Modern Diagnostics Labs",
      slug: "why-automation-is-critical-for-modern-diagnostics-labs",
      author: "Engr. Usman Ghafoor",
      category: "Diagnostics / Lab Automation",
      content:
        "In an era where diagnostic accuracy can mean the difference between life and death, laboratory automation has become indispensable. Automated sample processing, barcode-driven tracking, and digital report generation reduce human error and dramatically improve turnaround times. At Medicxus Diagnostic, our LIMS (Laboratory Information Management System) integrates seamlessly with analyzers and hospital networks to deliver results faster and more reliably. This article explores the key benefits of lab automation and why every modern diagnostics facility should invest in it.",
      status: "Published",
      publishedAt: new Date("2026-05-10"),
      readTime: "4 min read",
    },
  ];

  for (const blog of blogs) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug: blog.slug },
    });
    if (!existing) {
      await prisma.blogPost.create({ data: blog });
      console.log(`  ✅ Created: ${blog.title}`);
    } else {
      console.log(`  ⏭️  Skipped (already exists): ${blog.title}`);
    }
  }

  console.log("🎉 Blog seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Blog seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
