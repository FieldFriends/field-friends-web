import { supabaseAdmin } from "../_utils/supabase-admin";
import { appStateResponseSchema } from "../../shared/schemas/appStateSchema";
import { AppStatusErrors } from "../../shared/constants";
import { AppStatusResult, AppStatusSuccess, AppStatusFailure } from "../types/AppStatusResult";

/**
 * FriendDev: Fetch and parse the current app status from the DB safely.
 */
export const fetchAndValidateAppStatus = async (): Promise<AppStatusResult> => {
  try {
    const { data, error: dbError } = await supabaseAdmin
      .from('app_status')
      .select('currentState:current_state, roundStart:round_start, roundEnd:round_end')
      .maybeSingle();

    if (dbError) {
      console.error('API->_utils->DB_ERROR:', dbError);
      return new AppStatusFailure(AppStatusErrors.DatabaseError, dbError.message);
    }

    if (!data) {
      return new AppStatusFailure(AppStatusErrors.NotFound);
    }

    const parseResult = appStateResponseSchema.safeParse(data);

    if (!parseResult.success) {
      console.error('API->_utils->APP_STATE_SCHEMA_ERROR:', parseResult.error);

      return new AppStatusFailure(AppStatusErrors.ValidationError, parseResult.error);
    }

    return new AppStatusSuccess(parseResult.data);
  } catch (error) {
    console.error('API->_utils->UNKNOWN_ERROR:', error);

    return new AppStatusFailure(AppStatusErrors.UnknownError, error instanceof Error ? error : String(error));
  }
};
