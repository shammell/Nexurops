/**
 * API response types
 */

import { ApiError } from "./errors";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  metadata?: ApiMetadata;
}

export interface ApiMetadata {
  total?: number;
  page?: number;
  limit?: number;
  hasMore?: boolean;
}

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  metadata: Required<ApiMetadata>;
}

export interface HealthCheckResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: Date;
  services: {
    database: boolean;
    cache: boolean;
    external: boolean;
  };
  version: string;
}

/**
 * Success response builder
 */
export function success<T>(data: T, metadata?: ApiMetadata): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    metadata,
  };
}

/**
 * Error response builder
 */
export function error(err: ApiError): ApiResponse<null> {
  return {
    success: false,
    data: null,
    error: err,
  };
}

/**
 * Paginated response builder
 */
export function paginated<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
): ApiResponse<T[]> {
  return success(items, {
    total,
    page,
    limit,
    hasMore: page * limit < total,
  });
}
