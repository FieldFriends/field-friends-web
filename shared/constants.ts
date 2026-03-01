export const HttpMethods = {
  Get: 'GET',
  Post: 'POST',
  Put: 'PUT',
  Delete: 'DELETE',
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