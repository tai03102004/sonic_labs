import { Router } from "express";
import { listAllCourse, createCourse } from "../controllers/course.controller";
import { validate } from "../middlewares/validate.middleware";
import { courseSchema } from "../schemas/course.schema";

const router = Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get courses with pagination and filtering
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, description, or code
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of courses per page
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Cursor for pagination
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: List of courses with pagination metadata
 *   post:
 *     summary: Create a new course (Protected)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - code
 *               - difficulty
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Node.js Fundamentals"
 *               description:
 *                 type: string
 *                 example: "Learn the basics of Node.js"
 *               code:
 *                 type: string
 *                 example: "NODE101"
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *                 example: "Beginner"
 *     responses:
 *       201:
 *         description: Course created successfully
 *       401:
 *         description: Authentication required
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.get("/", listAllCourse);
router.post("/", validate(courseSchema), createCourse);

export default router;
