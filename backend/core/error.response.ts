import { Response } from "express";
import { StatusCodes } from "../utils/statusCodes";
import { ReasonPhrases } from "../utils/reasonPhrases";

// Define error response interface
export interface ErrorResponseData {
  message: string;
  status: number;
  statusCode: number;
  stack?: string;
  timestamp: string;
  path?: string;
}

// Define error options interface
export interface ErrorOptions {
  message?: string;
  statusCode?: number;
  cause?: Error;
}

// Constants with proper typing
const StatusCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

const ReasonStatusCode = {
  BAD_REQUEST: "Bad Request Error",
  UNAUTHORIZED: "Unauthorized Error",
  FORBIDDEN: "Forbidden Error",
  NOT_FOUND: "Not Found Error",
  CONFLICT: "Conflict Request Error",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity Error",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
} as const;

// Base Error Response class
export class ErrorResponse extends Error {
  public readonly status: number;
  public readonly statusCode: number;
  public readonly timestamp: string;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = StatusCode.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);

    this.name = this.constructor.name;
    this.status = statusCode;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.isOperational = isOperational;

    // Maintain proper stack trace (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Method to send error response
  send(
    res: Response,
    includeStack: boolean = false
  ): Response<ErrorResponseData> {
    const errorResponse: ErrorResponseData = {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      path: res.req?.path,
    };

    if (includeStack && process.env.NODE_ENV === "development") {
      errorResponse.stack = this.stack;
    }

    return res.status(this.statusCode).json(errorResponse);
  }

  // Method to get error data without sending
  getData(includeStack: boolean = false): ErrorResponseData {
    const errorData: ErrorResponseData = {
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };

    if (includeStack && process.env.NODE_ENV === "development") {
      errorData.stack = this.stack;
    }

    return errorData;
  }
}

// Specific Error Classes
export class BadRequestError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.BAD_REQUEST,
    statusCode: number = StatusCode.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

export class UnauthorizedError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.UNAUTHORIZED,
    statusCode: number = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.FORBIDDEN,
    statusCode: number = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message: string = ReasonPhrases.NOT_FOUND,
    statusCode: number = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

export class ConflictError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.CONFLICT,
    statusCode: number = StatusCode.CONFLICT
  ) {
    super(message, statusCode);
  }
}

export class UnprocessableEntityError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.UNPROCESSABLE_ENTITY,
    statusCode: number = StatusCode.UNPROCESSABLE_ENTITY
  ) {
    super(message, statusCode);
  }
}

export class InternalServerError extends ErrorResponse {
  constructor(
    message: string = ReasonStatusCode.INTERNAL_SERVER_ERROR,
    statusCode: number = StatusCode.INTERNAL_SERVER_ERROR
  ) {
    super(message, statusCode, false); // Not operational
  }
}

// Legacy export names (for backward compatibility)
export const ConflictRequestError = ConflictError;
export const AuthRequestError = UnauthorizedError;

// Default export (optional)
export default {
  ErrorResponse,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  UnprocessableEntityError,
  InternalServerError,
  // Legacy names
  ConflictRequestError,
  AuthRequestError,
};
