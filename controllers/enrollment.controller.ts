import { Request, Response } from "express";

/**
 * Enroll a student in a course.
 *
 * @param studentEmail - The email of the student enrolling in the course.
 * @param courseId - The ID of the course to enroll the student in.
 * @returns A Promise that resolves to the created enrollment record.
 */
export async function enrollCourse(req: Request, res: Response) {}

/**
 * Get all enrollments for a specific student.
 *
 * @returns A Promise that resolves to an array of enrollment records for the specified student.
 */
export async function getStudentEnrollments(req: Request, res: Response) {}
