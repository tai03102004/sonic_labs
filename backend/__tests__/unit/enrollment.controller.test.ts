import { Request, Response } from "express";
import { enrollCourse } from "../../controllers/enrollment.controller";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    course: {
      findUnique: jest.fn(),
    },
    enrollment: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("Course Controller - Enroll Course", () => {
  let mockPrisma: any;
  let res: Response;

  beforeEach(() => {
    const { PrismaClient } = require("@prisma/client");
    mockPrisma = new PrismaClient();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;
    jest.clearAllMocks();
  });

  // Course is not Found
  test("should return 404 if course not found", async () => {
    const req = {
      body: {
        studentEmail: "test@gmail.com",
        courseId: 1,
      },
    };
    mockPrisma.course.findUnique.mockResolvedValue(null);
    await enrollCourse(req as unknown as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Course not found" });
  });

  // Student already enrolled and course is found
  test("should return 409 if student already enrolled in the course", async () => {
    const req = {
      body: {
        studentEmail: "test@gmail.com",
        courseId: 1,
      },
    };
    mockPrisma.course.findUnique.mockResolvedValue({
      id: 1,
      title: "Test Course",
    });
    mockPrisma.enrollment.findUnique.mockResolvedValue({
      id: 10,
      studentEmail: "a@test.com",
      courseId: 1,
    });
    await enrollCourse(req as unknown as Request, res as unknown as Response);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Student already enrolled in this course",
    });
  });

  // Successful enrollment
  test("should enroll student successfully", async () => {
    const req = {
      body: { studentEmail: "a@test.com", courseId: 1 },
    } as Request;

    mockPrisma.course.findUnique.mockResolvedValue({
      id: 1,
      title: "Test Course",
    });
    mockPrisma.enrollment.findUnique.mockResolvedValue(null);
    mockPrisma.enrollment.create.mockResolvedValue({
      id: 100,
      studentEmail: "a@test.com",
      courseId: 1,
      Course: { id: 1, title: "Test Course" },
    });

    await enrollCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 100,
        studentEmail: "a@test.com",
      })
    );
  });

  // DB False
  test("should handle database errors gracefully", async () => {
    const req = {
      body: { studentEmail: "a@test.com", courseId: 1 },
    } as Request;
    mockPrisma.course.findUnique.mockRejectedValue(new Error("DB error"));
    await enrollCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
