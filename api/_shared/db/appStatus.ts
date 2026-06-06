import { db } from './kysely.js';
import { AppState, AppStateResponseSchema } from '../../../shared/schemas/appStateSchema.js';
import { AppStatusResult, makeAppStatusSuccess } from '../../types/AppStatusResult.js';
import { AppStatusView } from './types.js';

/**
 * Fetches the application status from the database.
 * If the database query fails or no data is found, it logs the error
 * and defaults to returning a paused state.
 * @returns The parsed and validated application status result.
 */
export const getAppStatus = async (): Promise<AppStatusResult> => {
  try {
    const data: AppStatusView | undefined = await db
      .selectFrom('app_status')
      .select(['current_state', 'round_start', 'round_end'])
      .executeTakeFirst();

    if (!data) {
      console.error('API->_shared->db->appStatus: No data returned from app_status view.');

      // FriendDev: Default to paused if no data is found.
      return makeAppStatusSuccess({
        currentState: AppState.Paused,
        roundStart: null,
        roundEnd: null,
      });
    }

    const parseResult = AppStateResponseSchema.safeParse({
      currentState: data.current_state,
      roundStart: data.round_start,
      roundEnd: data.round_end,
    });

    if (!parseResult.success) {
      console.error('API->_shared->db->appStatus->APP_STATE_SCHEMA_ERROR:', parseResult.error);

      return makeAppStatusSuccess({
        currentState: AppState.Paused,
        roundStart: null,
        roundEnd: null,
      });
    }

    return makeAppStatusSuccess(parseResult.data);
  } catch (error) {
    console.error('API->_shared->db->appStatus->UNKNOWN_ERROR:', error);

    return makeAppStatusSuccess({
      currentState: AppState.Paused,
      roundStart: null,
      roundEnd: null,
    });
  }
};
