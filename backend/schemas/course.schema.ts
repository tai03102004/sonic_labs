import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  code: z.string().min(1, "Code is required"),
  difficulty: z
    .enum(["Beginner", "Intermediate", "Advanced"])
    .default("Beginner"),
});

export type CourseSchema = z.infer<typeof courseSchema>;
