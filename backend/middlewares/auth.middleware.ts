import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | object;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Access token is missing or invalid" });
  }
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "secretkey",
    (err, user) => {
      if (err) {
        return res.status(403).json({ error: "Token is not valid" });
      }
      req.user = user;
      next();
    }
  );
};
