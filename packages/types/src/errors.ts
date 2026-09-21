/**
 * Error types for API responses
 */

export type ErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "CONFLICT"
  | "INTERNAL_SERVER_ERROR"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT_EXCEEDED";

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  timestamp: Date;
}

export interface ValidationError extends ApiError {
  code: "VALIDATION_ERROR";
  details: {
    fields: {
      field: string;
      issue: string;
    }[];
  };
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }

  toJSON(): ApiError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date(),
    };
  }
}
