import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Created, SuccessResponse } from "../core/success.response";
import { AccessService } from "../services/access.service";

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req.body Login", req.body);

  new SuccessResponse({
    metadata: await AccessService.login(req.body),
  }).send(res);
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("req.body Signup", req.body);
  new Created({
    message: "User created successfully!",
    metadata: await AccessService.signUp(req.body),
  }).send(res);
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  new SuccessResponse({
    message: "Logout successfully!",
    metadata: { success: await AccessService.logout((req as any).keyStore) },
  }).send(res);
};

export const handlerRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  new SuccessResponse({
    message: "Get access token successfully!",
    metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
  }).send(res);
};
