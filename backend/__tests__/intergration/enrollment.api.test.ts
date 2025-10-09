import request from "supertest";
import app from "../../index";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

describe("Enrollment API", () => {
  let token: string;
  let courseId: string;
  const studentEmail = "test@gmail.com";
  let enrollmentId: string;
  beforeAll(async () => {
    await prisma.enrollment.deleteMany({});
    await prisma.course.deleteMany({});
    // seed data or clean up
    const loginRes = await request(app).post("/api/auth/login").send({
      email: "admin@example.com",
      password: "adminpass",
    });
    token = loginRes.body.token;
    const course = await prisma.course.create({
      data: {
        title: "Integration Test Course",
        description: "Test",
        code: "COURSE_123",
      },
    });
    courseId = course.id;
  });

  afterAll(async () => {
    // clean up
    await prisma.enrollment.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.$disconnect();
  });

  // Test the POST /api/enrollments endpoint
  test("POST /api/enrollments - enroll in a course", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        studentEmail: studentEmail,
        courseId: courseId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.studentEmail).toBe(studentEmail);
    expect(res.body.courseId).toBe(courseId);
    enrollmentId = res.body.id;
  });

  // Test enrolling in the same course again (should fail)
  test("POST /api/enrollments - enroll in the 898same course again", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        studentEmail: studentEmail,
        courseId: courseId,
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Course not found");
  });

  // Test enrolling in a non-existent course (should fail)
  test("POST /api/enrollments - enroll in a non-existent course", async () => {
    const res = await request(app)
      .post("/api/enrollments")
      .set("Authorization", `Bearer ${token}`)
      .send({
        studentEmail: "test999@gmail.com",
        courseId: "999",
      });
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("Course not found");
  });

  // Test the GET /api/enrollments/students?email=studentEmail endpoint
  //   test("GET /api/enrollments/students?email=studentEmail - get student enrollments", async () => {
  //     const res = await request(app)
  //       .get("/api/enrollments/students")
  //       .query({ email: studentEmail });
  //     expect(res.statusCode).toBe(200);
  //     expect(res.body).toHaveProperty("studentEmail", studentEmail);
  //     expect(res.body.totalEnrollments).toBe(1);
  //     expect(res.body.enrollments).toHaveLength(1);
  //     expect(res.body.enrollments[0]).toHaveProperty("Course");
  //     expect(res.body.enrollments[0].Course.title).toBe(
  //       "Integration Test Course"
  //     );
  //   });
  test("GET /api/enrollments/students without email - should return 400", async () => {
    const res = await request(app).get("/api/enrollments/students");

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Invalid or missing email parameter");
  });
  test("GET /api/enrollments/students?email=nouser@get.com - should return empty", async () => {
    const res = await request(app).get(
      "/api/enrollments/students?email=nouser@get.com"
    );

    expect(res.statusCode).toBe(200);
    expect(res.body.totalEnrollments).toBe(0);
    expect(res.body.enrollments).toEqual([]);
  });
});
