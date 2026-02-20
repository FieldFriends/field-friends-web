import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '#api/_utils/supabase-admin';
import { httpInternalServerError, httpMethodNotAllowed, httpOk } from '#api/_utils/http';
import { z } from 'zod';
import { authenticateUser } from '#api/_utils/auth';
import { HttpMethods } from '#shared/constants';


// FriendDev: The contract for our response.
//					  Anything not in this scheme will either be stripped or cause an error.
const CheckStatusResponse = z.object({
	submitted: z.boolean()
});

// FriendDev: Allow user to check if they've submitted.
export default async function handler(request: VercelRequest, response: VercelResponse) {
	if (request.method !== HttpMethods.Get) {
		return httpMethodNotAllowed(response);
	}

	try {
		const user = await authenticateUser(request, response);

		if (!user || !user.email) {
			return;
		}

		const { count, error: dbError } = await supabaseAdmin
			.from('responses')
			// FriendDev: Use "head: true" to not request the response body to prevent any data being leaked.
			//						"count: 'exact'" gets the actual exact number of rows (and doesn't estimate).
			.select('user_id', { count: 'exact', head: true })
			.eq('user_id', user.id);

		if (dbError) {
			console.error('API->DB_ERROR:', dbError);

			return httpInternalServerError(response);
		}

		const hasSubmitted = (count !== null) && (count > 0);

		return httpOk(response, { submitted: hasSubmitted }, CheckStatusResponse);
	} catch (error) {
		console.error('API->ERROR:', error);

		return httpInternalServerError(response);
	}
}