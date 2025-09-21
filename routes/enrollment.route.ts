import { Router } from "express";
import {
  enrollCourse,
  getStudentEnrollments,
} from "../controllers/enrollment.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       required:
 *         - studentEmail
 *         - courseId
 *         - enrolledAt
 *       properties:
 *         id:
 *           type: integer
 *           description: Enrollment ID
 *         studentEmail:
 *           type: string
 *           description: Enrollment studentEmail
 *         courseId:
 *           type: string
 *           description: Enrollment courseId
 *         enrolledAt:
 *           type: string
 *           description: The date the student enrolled in the course
 *           format: date-time
 *
 * /api/enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentEmail
 *               - courseId
 *             properties:
 *               studentEmail:
 *                 type: string
 *                 example: "abc@gmail.com"
 *               courseId:
 *                 type: string
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Enrollment successful
 *       400:
 *         description: Invalid input
 *
 * /api/enrollments/students:
 *   get:
 *     summary: Get student enrollments
 *     tags: [Enrollments]
 *     parameters:
 *       - in: query
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of enrollments
 */

router.post("/", enrollCourse);
router.get("/students", getStudentEnrollments);

export default router;
