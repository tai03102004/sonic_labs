import { Router } from "express";
import {
  enrollCourse,
  getStudentEnrollments,
} from "../controllers/enrollment.controller";

const router = Router();

/**
 * @swagger
 * /api/enrollments:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Enrollments]
 *     responses:
 *       201:
 *         description: Enrollment successful
 * /api/students/{email}/enrollments:
 *   get:
 *     summary: Get student enrollments
 *     tags: [Enrollments]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.post("/", enrollCourse);
router.get("/students/:email/enrollments", getStudentEnrollments);

export default router;
