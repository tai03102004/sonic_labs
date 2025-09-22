import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";
import enrollmentRoute from "../../routes/enrollment.route";
import authRoute from "../../routes/auth.route";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/enrollments", enrollmentRoute);

const prisma = new PrismaClient();

describe("Enrollment Endpoints", () => {
  let authToken: string;
  let courseId: string;

  beforeAll(async () => {
    await prisma.$connect();

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "adminpass",
    });

    authToken = loginResponse.body.token;
  });

  beforeEach(async () => {
    const course = await prisma.course.create({
      data: {
        title: "Test Course",
        description: "Test Description",
        code: "TEST101",
        difficulty: "Beginner",
      },
    });
    courseId = course.id;
  });

  afterEach(async () => {
    await prisma.enrollment.deleteMany();
    await prisma.course.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/enrollments", () => {
    it("should enroll student successfully (201)", async () => {
      const enrollmentData = {
        studentEmail: "student@test.com",
        courseId,
      };

      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(enrollmentData);

      expect(response.status).toBe(201);
      expect(response.body.studentEmail).toBe(enrollmentData.studentEmail);
      expect(response.body.courseId).toBe(courseId);
    });

    it("should return 409 for duplicate enrollment", async () => {
      const enrollmentData = {
        studentEmail: "student@test.com",
        courseId,
      };

      // First enrollment
      await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(enrollmentData);

      // Duplicate enrollment
      const response = await request(app)
        .post("/api/enrollments")
        .set("Authorization", `Bearer ${authToken}`)
        .send(enrollmentData);

      expect(response.status).toBe(409);
      expect(response.body.error).toContain("already enrolled");
    });
  });

  describe("GET /api/enrollments/students", () => {
    it("should return student enrollments", async () => {
      const studentEmail = "student@test.com";

      await prisma.enrollment.create({
        data: { studentEmail, courseId },
      });

      const response = await request(app)
        .get("/api/enrollments/students")
        .query({ email: studentEmail });

      expect(response.status).toBe(200);
      expect(response.body.studentEmail).toBe(studentEmail);
      expect(response.body.totalEnrollments).toBe(1);
      expect(response.body.enrollments).toHaveLength(1);
    });

    it("should return empty list for non-enrolled student", async () => {
      const response = await request(app)
        .get("/api/enrollments/students")
        .query({ email: "new@test.com" });

      expect(response.status).toBe(200);
      expect(response.body.totalEnrollments).toBe(0);
    });
  });
});
