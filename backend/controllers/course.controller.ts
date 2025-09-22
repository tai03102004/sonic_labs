import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildPrismaQuery } from "../utils/queryBuilder";

const prisma = new PrismaClient();

/**
 * List all available courses.
 * Return an array of course records.
 */
export async function listAllCourse(req: Request, res: Response) {
  // try {
  const query = buildPrismaQuery({
    ...req.query,
    filters: {
      ...(req.query.difficulty && { difficulty: req.query.difficulty }),
      ...(req.query.title && {
        title: { contains: req.query.title as string, mode: "insensitive" },
      }),
    },
  });
  const totalItems = await prisma.course.count({ where: query.where });
  const { pagination, ...queryWithoutPagination } = query;
  const courses = await prisma.course.findMany(queryWithoutPagination);

  res.json({
    data: courses,
    meta: {
      totalItems,
      totalPages: Math.ceil(totalItems / query.pagination.pageSize),
      currentPage: query.pagination.pageNum,
      pageSize: query.pagination.pageSize,
    },
  });
  // } catch (err) {
  //   res.status(500).json({ error: "Internal server error" });
  // }
}

/**
 * Create a new course.
 *
 * @param title - The title of the course.
 * @param description - A brief description of the course.
 * @returns A Promise that resolves to the created course record.
 */
export async function createCourse(req: Request, res: Response) {
  try {
    const { title, description, code, difficulty } = req.body;
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });
    if (existingCourse) {
      return res.status(409).json({ error: "Course code already exists" });
    }
    const course = await prisma.course.create({
      data: {
        title,
        description,
        code,
        difficulty,
      },
    });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
