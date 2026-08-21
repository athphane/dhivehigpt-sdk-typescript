import { describe, expect, it } from 'vitest';
import {
  DhivehiGPTError,
  AuthenticationError,
  InsufficientCreditsError,
  NotFoundError,
  RateLimitError,
  ServerError,
  ValidationError,
  errorFromResponse,
} from '../src/errors.js';

describe('errorFromResponse', () => {
  it('creates the right subclass for each known status code', () => {
    expect(errorFromResponse(401, { message: 'x' })).toBeInstanceOf(AuthenticationError);
    expect(errorFromResponse(403, { message: 'x' })).toBeInstanceOf(InsufficientCreditsError);
    expect(errorFromResponse(404, { message: 'x' })).toBeInstanceOf(NotFoundError);
    expect(errorFromResponse(422, { message: 'x' })).toBeInstanceOf(ValidationError);
    expect(errorFromResponse(429, { message: 'x' })).toBeInstanceOf(RateLimitError);
    expect(errorFromResponse(500, { message: 'x' })).toBeInstanceOf(ServerError);
    expect(errorFromResponse(503, { message: 'x' })).toBeInstanceOf(ServerError);
  });

  it('falls back to the base error for unmapped status codes', () => {
    const error = errorFromResponse(418, { message: "I'm a teapot" });

    expect(error).toBeInstanceOf(DhivehiGPTError);
    expect(error).not.toBeInstanceOf(AuthenticationError);
    expect(error.status).toBe(418);
    expect(error.message).toBe("I'm a teapot");
  });

  it('uses a generic message when the body has none', () => {
    const error = errorFromResponse(400, undefined);

    expect(error.message).toBe('Request failed with status 400');
  });

  it('every error subclass preserves instanceof through the base class', () => {
    const error = new ValidationError('invalid', { message: 'invalid' });

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DhivehiGPTError);
    expect(error).toBeInstanceOf(ValidationError);
    expect(error.name).toBe('ValidationError');
  });
});
