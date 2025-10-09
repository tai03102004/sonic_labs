import { Router } from "express";
import { listAllCourse, createCourse } from "../controllers/course.controller";
import { validate } from "../middlewares/validate.middleware";
import { courseSchema } from "../schemas/course.schema";
import { authentication } from "services/apiKey.service";

const router = Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get courses with pagination, filtering, sorting, and field selection
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number (starts from 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *         description: Filter courses by difficulty
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search courses by title (case-insensitive, partial match)
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *           example: id,title,code
 *         description: Comma-separated list of fields to include in the response
 *     responses:
 *       200:
 *         description: List of courses with pagination metadata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     totalItems:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     pageSize:
 *                       type: integer
 *   post:
 *     summary: Create a new course (Protected)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *       - clientIdAuth: []
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
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "c1a2b3"
 *         title:
 *           type: string
 *           example: "Node.js Fundamentals"
 *         description:
 *           type: string
 *           example: "Learn the basics of Node.js"
 *         code:
 *           type: string
 *           example: "NODE101"
 *         difficulty:
 *           type: string
 *           example: "Beginner"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

router.get("/", listAllCourse);
router.post("/", authentication, validate(courseSchema), createCourse);

export default router;
