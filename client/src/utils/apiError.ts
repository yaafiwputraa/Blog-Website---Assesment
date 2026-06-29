import { isAxiosError } from "axios";

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorDetails {
  message: string;
  fieldErrors: FieldError[];
  status?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseFieldErrors(value: unknown): FieldError[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (!isRecord(item)) {
      return [];
    }

    const { field, message } = item;
    if (typeof field !== "string" || typeof message !== "string") {
      return [];
    }

    return [{ field, message }];
  });
}

export function getApiError(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): ApiErrorDetails {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data;

    if (isRecord(data)) {
      const message = typeof data.message === "string" ? data.message : fallback;
      return {
        message,
        fieldErrors: parseFieldErrors(data.errors),
        status,
      };
    }

    return {
      message: error.message || fallback,
      fieldErrors: [],
      status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || fallback,
      fieldErrors: [],
    };
  }

  return {
    message: fallback,
    fieldErrors: [],
  };
}

export function getErrorMessage(error: unknown, fallback?: string) {
  return getApiError(error, fallback).message;
}

export function fieldErrorMessage(fieldErrors: FieldError[], field: string) {
  return fieldErrors.find((error) => error.field === field)?.message;
}
