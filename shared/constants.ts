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

export const Algorithms = {
  SHA256: 'sha256',
  SHA512: 'sha512',
  AES_256_GCM: 'aes-256-gcm',
  ML_KEM_1024: 'ml-kem-1024',
  HMAC_SHA256: 'HmacSHA256',
} as const;

export const Encodings = {
  Hex: 'hex',
  Base64: 'base64',
  Utf8: 'utf8',
} as const;

export const KeyFormats = {
  Pem: 'pem',
  Der: 'der',
} as const;

export const KeyTypes = {
  Spki: 'spki',
  Pkcs8: 'pkcs8',
  RawSeed: 'raw-seed',
} as const;

export const CryptoConfig = {
  MlKemSeedLength: 64,
  Scrypt: {
    KeyLength: 32,
    Cost: 16384,
    BlockSize: 8,
    Parallelization: 1,
    /**
     * 1024 * 1024 * 32. 32MB.
     */
    MaxMem: 33554432,
  },
  Session: {
    AesKeyLength: 32,
    HashLength: 64,
    EncryptionDelimiter: ':',
    HkdfInfo: 'FieldFriends_HybridKEM_Session_v1',
  },
} as const;

export const ZeptoMailConfig = {
  HeaderDelimiter: ';',
  FieldDelimiter: '=',

  /**
   * 5 minutes in milliseconds.
   */
  AcceptableDurationMs: 300000,
  Fields: {
    Timestamp: 'ts',
    Signature: 's',
    SigningAlgorithm: 's-algorithm',
  },
} as const;