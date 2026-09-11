import { NextResponse } from 'next/server';

import {
  API_ERROR_STATUS,
  type ApiError,
  type ApiErrorCode,
  type ApiSuccess,
} from '@/types/api';

/** Build a typed success response. */
export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json<ApiSuccess<T>>({ success: true, data }, init);
}

/**
 * Build a typed error response.
 *
 * `details` is intended for validation issues. Never pass an Error object or a
 * stack trace — those must not cross the network boundary.
 */
export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown,
) {
  return NextResponse.json<ApiError>(
    { success: false, error: { code, message, details } },
    { status: API_ERROR_STATUS[code] },
  );
}
