import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { SERVER_ENV } from '../../_utils/server-env.js';
import { KyselyDatabase } from './types.js';

/**
 * Initializes the Postgres connection pool for Kysely.
 */
const pool = new pg.Pool({
  connectionString: SERVER_ENV.SUPABASE_DATABASE_URL,
  // FriendDev: Limits the maximum number of concurrent database connections from this pool.
  //            Since Vercel serverless functions can spawn many concurrent instances,
  //            keeping this number low prevents exhausting the Supabase connection limit.
  max: 10,
});

/**
 * The Kysely database instance for executing queries.
 */
export const db = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    pool,
  }),
});
