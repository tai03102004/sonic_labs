import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * List all available courses.
 * Return an array of course records.
 */
export async function listAllCourse(req: Request, res: Response) {
  const courses = await prisma.course.findMany();
  res.json(courses);
}

/**
 * Create a new course.
 *
 * @param title - The title of the course.
 * @param description - A brief description of the course.
 * @returns A Promise that resolves to the created course record.
 */
export async function createCourse(req: Request, res: Response) {
  const { title, description, difficulty } = req.body;
  const course = await prisma.course.create({
    data: {
      title,
      description,
      difficulty,
    },
  });
  res.json(course);
}
