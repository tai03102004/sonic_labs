import { Router } from "express";
import { listAllCourse, createCourse } from "../controllers/course.controller";

const router = Router();

/**
 * @swagger
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
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.get("/", listAllCourse);
router.post("/", createCourse);

export default router;
