import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  const result = await prisma.course.createMany({
    data: [
      {
        title: "Intro to Node.js",
        description: "Basics of Node.js",
        difficulty: "Beginner",
      },
      {
        title: "Advanced SQL",
        description: "Deep dive into SQL",
        difficulty: "Intermediate",
      },
      {
        title: "FastAPI Crash Course",
        description: "Learn FastAPI quickly",
        difficulty: "Beginner",
      },
      {
        title: "System Design 101",
        description: "Scalable system architecture",
        difficulty: "Intermediate",
      },
    ],
  });

  console.log(`Created ${result.count} courses`);
}

main()
  .then(() => console.log("Seed data created successfully"))
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
