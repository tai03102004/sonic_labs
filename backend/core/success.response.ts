"use strict";

import { Response } from "express";

const StatusCode = {
  OK: 200,
  CREATED: 201,
} as const;

const ReasonStatusCode = {
  CREATED: "Created!",
  OK: "Success",
} as const;

interface SuccessResponseOptions {
  message?: string;
  status?: number;
  reasonStatusCode?: string;
  metadata?: Record<string, any>;
}

interface CreatedOptions {
  message?: string;
  status?: number;
  reasonStatusCode?: string;
  metadata?: Record<string, any>;
}

interface OKOptions {
  message?: string;
  metadata?: Record<string, any>;
}

export class SuccessResponse {
  public message: string;
  public reasonStatusCode: string;
  public metadata: Record<string, any>;
  public status: number;
  constructor({
    message = ReasonStatusCode.OK,
    status = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata = {},
  }: SuccessResponseOptions = {}) {
    this.message = message || reasonStatusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
    this.status = status;
  }
  send(res: Response, headers: Record<string, string> = {}) {
    return res.status(this.status).json({
      message: this.message,
      reasonStatusCode: this.reasonStatusCode,
      metadata: this.metadata,
      status: this.status,
    });
  }
}

export class OK extends SuccessResponse {
  constructor({ message, metadata }: OKOptions = {}) {
    super({
      message,
      metadata,
      status: StatusCode.OK,
      reasonStatusCode: ReasonStatusCode.OK,
    });
  }
}

export class Created extends SuccessResponse {
  constructor({
    message,
    status = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }: CreatedOptions = {}) {
    super({
      message,
      status,
      reasonStatusCode,
      metadata,
    });
  }
}

export default {
  SuccessResponse,
  OK,
  Created,
};
