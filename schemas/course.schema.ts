import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
});

export type CourseSchema = z.infer<typeof courseSchema>;
