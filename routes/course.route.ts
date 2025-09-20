import { Router } from "express";
import { listAllCourse, createCourse } from "../controllers/course.controller";
import { validate } from "../middlewares/validate.middleware";
import { courseSchema } from "../schemas/course.schema";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - difficulty
 *       properties:
 *         id:
 *           type: integer
 *           description: Course ID
 *         title:
 *           type: string
 *           description: Course title
 *         description:
 *           type: string
 *           description: Course description
 *         difficulty:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *           description: Course difficulty level
 *
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of courses
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Node.js Fundamentals"
 *               description:
 *                 type: string
 *                 example: "Learn the basics of Node.js"
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: "Beginner"
 *     responses:
 *       201:
 *         description: Course created successfully
 *       400:
 *         description: Invalid input
 */
router.get("/", listAllCourse);
router.post("/", validate(courseSchema), createCourse);

export default router;
