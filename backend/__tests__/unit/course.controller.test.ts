import { Request, Response } from "express";
import { createCourse } from "../../controllers/course.controller";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    course: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

describe("Course Controller - Create Course", () => {
  let mockPrisma: any;
  // clear all mocks before each test
  beforeEach(() => {
    const { PrismaClient } = require("@prisma/client");
    mockPrisma = new PrismaClient();
    jest.clearAllMocks();
  });

  // Creat course Success
  test("Should create a new course successfully", async () => {
    const req = {
      body: {
        title: "Introduction to Testing",
        description: "Learn the basics of testing.",
        code: "TEST101",
        difficulty: "Beginner",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock data
    mockPrisma.course.findUnique.mockResolvedValue(null);
    mockPrisma.course.create.mockResolvedValue({
      id: 1,
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      difficulty: req.body.difficulty,
    });

    await createCourse(req as unknown as Request, res as unknown as Response);
    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
      where: { code: "TEST101" },
    });
    expect(mockPrisma.course.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        title: "Introduction to Testing",
      })
    );
  });

  // Create course Conflict
  test("Should return 409 if course code already exists", async () => {
    const req = {
      body: {
        title: "Introduction to Testing",
        description: "Learn the basics of testing.",
        code: "TEST101",
        difficulty: "Beginner",
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    // Mock data
    mockPrisma.course.findUnique.mockResolvedValue({
      id: 1,
      title: "Existing Course",
      description: "This course already exists.",
      code: "TEST101",
      difficulty: "Beginner",
    });
    await createCourse(req as unknown as Request, res as unknown as Response);
    expect(mockPrisma.course.findUnique).toHaveBeenCalledWith({
      where: { code: "TEST101" },
    });
    expect(mockPrisma.course.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      error: "Course code already exists",
    });
  });
});
