import { Request, Response } from "express";

/**
 * List all available courses.
 * Return an array of course records.
 */
export async function listAllCourse(req: Request, res: Response) {}

/**
 * Create a new course.
 *
 * @param title - The title of the course.
 * @param description - A brief description of the course.
 * @returns A Promise that resolves to the created course record.
 */
export async function createCourse(req: Request, res: Response) {}
