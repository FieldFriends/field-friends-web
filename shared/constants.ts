export const HttpMethods = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
} as const;

export const HttpStatusCodes = {
  BadRequest: 400,
  Unauthorized: 401,
} as const;

export const HeaderKeys = {
  ContentType: 'Content-Type',
  Authorization: 'Authorization',
} as const;

export const ContentTypes = {
  Json: 'application/json',
} as const;

export const AuthorizationSchemes = {
  Bearer: 'Bearer',
} as const;

export const TurnstileConstants = {
  VerifyUrl: 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
} as const;

export const SupabaseAuthEvents = {
  InitialSession: 'INITIAL_SESSION',
  SignedIn: 'SIGNED_IN',
  SignedOut: 'SIGNED_OUT',
} as const;

export const SupabaseRoles = {
  Authenticated: 'authenticated',
} as const;

export const AppStatusErrors = {
  NotFound: 'NOT_FOUND',
  DatabaseError: 'DB_ERROR',
  ValidationError: 'VALIDATION_ERROR',
  UnknownError: 'UNKNOWN_ERROR',
} as const;

export const UnsubscribeConstants = {
  Action: 'unsubscribe',
} as const;

export const JwtConstants = {
  Algorithm: 'RS256',
} as const;