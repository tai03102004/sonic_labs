import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
/**
 * Enroll a student in a course.
 *
 * @param studentEmail - The email of the student enrolling in the course.
 * @param courseId - The ID of the course to enroll the student in.
 * @returns A Promise that resolves to the created enrollment record.
 */
export async function enrollCourse(req: Request, res: Response) {
  try {
    const { studentEmail, courseId } = req.body;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    console.log("Course", course);
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { studentEmail_courseId: { studentEmail, courseId: course.id } },
    });
    console.log("Existing Enrollment", existingEnrollment);
    if (existingEnrollment) {
      return res
        .status(409)
        .json({ error: "Student already enrolled in this course" });
    }
    const enrollment = await prisma.enrollment.create({
      data: {
        studentEmail,
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
