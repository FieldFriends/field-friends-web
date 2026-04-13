import { z } from "zod";
import { AppStatusErrors } from '../../shared/constants.js';
import { AppStateResponse } from '../../shared/schemas/appStateSchema.js';

// FriendDev: Type representing the possible error states of fetching app status.
export type AppStatusErrorType = typeof AppStatusErrors[keyof typeof AppStatusErrors];

export type AppStatusSuccess = {
  success: true;
  data: AppStateResponse;
};

export type AppStatusFailure = {
  success: false;
  type: AppStatusErrorType;
  error?: z.ZodError | Error | string;
};

export type AppStatusResult = AppStatusSuccess | AppStatusFailure;

export const makeAppStatusSuccess = (data: AppStateResponse): AppStatusSuccess => ({
  success: true,
  data,
});

export const makeAppStatusFailure = (
  type: AppStatusErrorType,
  error?: z.ZodError | Error | string
): AppStatusFailure => ({
  success: false,
  type,
  error,
});
