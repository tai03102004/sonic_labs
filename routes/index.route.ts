import { Express } from "express";
import courseRoute from "./course.route";
import enrollmentRoute from "./enrollment.route";
export default function indexRoute(app: Express) {
  app.use("/courses", courseRoute);
  app.use("/enrollments", enrollmentRoute);
}
