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

export const AppQueryParams = {
  Resubmit: {
    key: 'resubmit',
    values: {
      True: 'true',
    },
  },
  Token: 'token',
} as const;

export const CryptoConstants = {
  AesAlgorithm: 'aes-256-gcm',
  EncryptionDelimiter: ':',
  EncodingFormat: 'hex',
  TextEncoding: 'utf8',
  AesKeyLength: 32,
  HashType: 'sha256',
} as const;

export const ZeptoMailSignatureConstants = {
  Algorithm: 'HmacSHA256',
  NodeAlgorithm: 'sha256',
  HeaderDelimiter: ';',
  FieldDelimiter: '=',

  /**
   * 5 minutes in milliseconds.
   */
  AcceptableDurationMs: 300000,
  EncodingFormat: 'base64',
  Fields: {
    Timestamp: 'ts',
    Signature: 's',
    SigningAlgorithm: 's-algorithm',
  },
} as const;