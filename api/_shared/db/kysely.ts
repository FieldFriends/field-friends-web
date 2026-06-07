import { Kysely, PostgresDialect, WithSchemaPlugin } from 'kysely';
import pg from 'pg';
import { SERVER_ENV } from '../../_utils/server-env.js';
import { KyselyDatabase } from './types.js';

/**
 * Configure pg driver to return timestamps as raw strings instead of Date objects.
 * This aligns the database output with our TypeScript interfaces and Zod schemas.
 */
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, (val) => val);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (val) => val);

/**
 * Initializes the Postgres connection pool for Kysely.
 */
const pool = new pg.Pool({
  connectionString: SERVER_ENV.SUPABASE_DATABASE_URL,

  /**
   * Limits the maximum number of concurrent database connections from this pool.
   * Since Vercel serverless functions can spawn many concurrent instances,
   * keeping this number low prevents exhausting the Supabase connection limit.
   */
  max: 10,
});

/**
 * The Kysely database instance for executing queries.
 */
export const db = new Kysely<KyselyDatabase>({
  dialect: new PostgresDialect({
    pool,
  }),
  plugins: [new WithSchemaPlugin('private_data')],
});
