import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();
});

afterEach(async () => {
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});
