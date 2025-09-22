import { courseSchema } from "../../schemas/course.schema";

describe("Course Schema Validation", () => {
  it("should validate a valid course", () => {
    const validCourse = {
      title: "Node.js Basics",
      description: "Learn Node.js fundamentals",
      code: "NODE101",
      difficulty: "Beginner",
    };

    const result = courseSchema.safeParse(validCourse);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(validCourse);
  });

  it("should reject course without required fields", () => {
    const invalidCourse = {
      description: "Missing title and code",
    };

    const result = courseSchema.safeParse(invalidCourse);
    expect(result.success).toBe(false);
    if (result.error) {
      expect(result.error.issues[0].message).toContain("Title is required");
    }
  });

  it("should reject invalid difficulty", () => {
    const invalidCourse = {
      title: "Test Course",
      description: "Test",
      code: "TEST101",
      difficulty: "Expert",
    };

    const result = courseSchema.safeParse(invalidCourse);
    expect(result.success).toBe(false);
    if (result.error) {
      expect(result.error.issues[0].path).toContain("difficulty");
    }
  });
});
