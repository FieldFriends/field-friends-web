import { supabaseAdmin } from '../_utils/supabase-admin.js';
import { appStateResponseSchema } from '../../shared/schemas/appStateSchema.js';
import { AppStatusErrors } from '../../shared/constants.js';
import { AppStatusResult, makeAppStatusSuccess, makeAppStatusFailure } from '../types/AppStatusResult.js';

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
      return makeAppStatusFailure(AppStatusErrors.DatabaseError, dbError.message);
    }

    if (!data) {
      return makeAppStatusFailure(AppStatusErrors.NotFound);
    }

    const parseResult = appStateResponseSchema.safeParse(data);

    if (!parseResult.success) {
      console.error('API->_utils->APP_STATE_SCHEMA_ERROR:', parseResult.error);

      return makeAppStatusFailure(AppStatusErrors.ValidationError, parseResult.error);
    }

    return makeAppStatusSuccess(parseResult.data);
  } catch (error) {
    console.error('API->_utils->UNKNOWN_ERROR:', error);

    return makeAppStatusFailure(AppStatusErrors.UnknownError, error instanceof Error ? error : String(error));
  }
};
