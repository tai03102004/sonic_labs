import request from "supertest";
import express from "express";
import { PrismaClient } from "@prisma/client";
import courseRoute from "../../routes/course.route";
import authRoute from "../../routes/auth.route";

const app = express();
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);

const prisma = new PrismaClient();

describe("Course Endpoints", () => {
  let authToken: string;

  beforeAll(async () => {
    await prisma.$connect();

    // Login to get token
    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "adminpass",
    });

    authToken = loginResponse.body.token;
  });

  afterEach(async () => {
    await prisma.course.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe("POST /api/courses", () => {
    it("should create course successfully (201)", async () => {
      const courseData = {
        title: "JavaScript Fundamentals",
        description: "Learn JS basics",
        code: "JS101",
        difficulty: "Beginner",
      };

      const response = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${authToken}`)
        .send(courseData);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(courseData);
    });

    it("should return 400 for missing title", async () => {
      const invalidData = {
        description: "Missing title",
        code: "TEST101",
        difficulty: "Beginner",
      };

      const response = await request(app)
        .post("/api/courses")
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain("title");
    });

    it("should return 401 without auth token", async () => {
      const response = await request(app)
        .post("/api/courses")
        .send({ title: "Test" });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/courses", () => {
    it("should return empty list initially", async () => {
      const response = await request(app).get("/api/courses");

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });
  });
});
