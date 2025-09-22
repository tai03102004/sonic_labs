import { Express } from "express";
import courseRoute from "./course.route";
import enrollmentRoute from "./enrollment.route";
import authRoute from "./auth.route";

export default function indexRoute(app: Express) {
  app.use("/api/auth", authRoute);
  app.use("/api/courses", courseRoute);
  app.use("/api/enrollments", enrollmentRoute);
}
