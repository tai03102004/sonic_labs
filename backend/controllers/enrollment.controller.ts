import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};
/**
 * Enroll a student in a course.
 *
 * @param studentEmail - The email of the student enrolling in the course.
 * @param courseId - The ID of the course to enroll the student in.
 * @returns A Promise that resolves to the created enrollment record.
 */
export async function enrollCourse(req: Request, res: Response) {
  try {
    const { courseId } = req.body;
    const userIdHeader = req.headers[HEADER.CLIENT_ID];
    const userId = Array.isArray(userIdHeader) ? userIdHeader[0] : userIdHeader;
    if (!userId) {
      return res.status(400).json({ error: "Missing client ID in headers" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    const studentEmail = user?.email;
    if (!studentEmail) {
      return res.status(404).json({ error: "User not found" });
    }
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentEmail_courseId: {
          studentEmail: studentEmail,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      return res
        .status(409)
        .json({ error: "Student already enrolled in this course" });
    }
    const enrollment = await prisma.enrollment.create({
      data: {
        studentEmail: studentEmail,
        courseId: course.id,
      },
      include: {
        Course: true,
      },
    });
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get all enrollments for a specific student.
 *
 * @returns A Promise that resolves to an array of enrollment records for the specified student.
 */
export async function getStudentEnrollments(req: Request, res: Response) {
  try {
    const { email } = req.query;
    if (typeof email !== "string" || !email) {
      return res
        .status(400)
        .json({ error: "Invalid or missing email parameter" });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentEmail: email },
      include: { Course: true },
      orderBy: { enrolledAt: "desc" },
    });

    res.json({
      studentEmail: email,
      totalEnrollments: enrollments.length,
      enrollments,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
