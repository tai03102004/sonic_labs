import { Express } from "express";
import {
  enrollCourse,
  getStudentEnrollments,
} from "../controllers/enrollment.controller";

export default function enrollmentRoute(app: Express) {
  app.post("/enrollments", enrollCourse);

  app.get("/students/:email/enrollments", getStudentEnrollments);
}
