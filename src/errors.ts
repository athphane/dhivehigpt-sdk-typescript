export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Base error thrown for any non-2xx response from the DhivehiGPT API.
 */
export class DhivehiGPTError extends Error {
  /** HTTP status code returned by the API. */
  readonly status: number;
  /** Raw parsed JSON response body, when available. */
  readonly body: ApiErrorBody | undefined;

  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message);
    this.name = 'DhivehiGPTError';
    this.status = status;
    this.body = body;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when the API key is missing, invalid, or revoked (HTTP 401). */
export class AuthenticationError extends DhivehiGPTError {
  constructor(message: string, body?: ApiErrorBody) {
    super(message, 401, body);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when the API key team does not have enough credits (HTTP 403). */
export class InsufficientCreditsError extends DhivehiGPTError {
  constructor(message: string, body?: ApiErrorBody) {
    super(message, 403, body);
    this.name = 'InsufficientCreditsError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when the requested resource does not exist (HTTP 404). */
export class NotFoundError extends DhivehiGPTError {
  constructor(message: string, body?: ApiErrorBody) {
    super(message, 404, body);
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when the request body fails validation (HTTP 422). */
export class ValidationError extends DhivehiGPTError {
  /** Field-level validation error messages, keyed by field name. */
  get errors(): Record<string, string[]> | undefined {
    return this.body?.errors;
  }

  constructor(message: string, body?: ApiErrorBody) {
    super(message, 422, body);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown when the API key has exceeded 60 requests per minute (HTTP 429). */
export class RateLimitError extends DhivehiGPTError {
  constructor(message: string, body?: ApiErrorBody) {
    super(message, 429, body);
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown for any 5xx response, e.g. when the upstream speech provider fails (HTTP 500+). */
export class ServerError extends DhivehiGPTError {
  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message, status, body);
    this.name = 'ServerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorFromResponse(status: number, body: ApiErrorBody | undefined): DhivehiGPTError {
  const message = body?.message ?? `Request failed with status ${status}`;

  switch (status) {
    case 401:
      return new AuthenticationError(message, body);
    case 403:
      return new InsufficientCreditsError(message, body);
    case 404:
      return new NotFoundError(message, body);
    case 422:
      return new ValidationError(message, body);
    case 429:
      return new RateLimitError(message, body);
    default:
      if (status >= 500) {
        return new ServerError(message, status, body);
      }
      return new DhivehiGPTError(message, status, body);
  }
}
