import { z } from "zod";

export const enrollmentSchema = z.object({
  studentEmail: z.string().min(1, "Student Email is required"),
  courseId: z.string().min(1, "Course ID is required"),
});

export type EnrollmentSchema = z.infer<typeof enrollmentSchema>;
