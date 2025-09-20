import { Express } from "express";
import { listAllCourse, createCourse } from "../controllers/course.controller";

export default function courseRoute(app: Express) {
  app.get("/courses", listAllCourse);
  app.post("/courses", createCourse);
}
