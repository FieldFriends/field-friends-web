import { z } from "zod";
import { AppStatusErrors } from '../../shared/constants.js';
import { AppStateResponse } from '../../shared/schemas/appStateSchema.js';

// FriendDev: Type representing the possible error states of fetching app status.
export type AppStatusErrorType = typeof AppStatusErrors[keyof typeof AppStatusErrors];

export class AppStatusSuccess {
  readonly success = true as const;
  data: AppStateResponse;

  constructor(data: AppStateResponse) {
    this.data = data;
  }
}

export class AppStatusFailure {
  readonly success = false as const;
  type: AppStatusErrorType;
  error?: z.ZodError | Error | string;

  constructor(type: AppStatusErrorType, error?: z.ZodError | Error | string) {
    this.type = type;
    this.error = error;
  }
}

export type AppStatusResult = AppStatusSuccess | AppStatusFailure;
