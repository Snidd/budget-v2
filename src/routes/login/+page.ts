import type { InferQueryInput } from '$lib/client/trpc';
import trpc from '$lib/client/trpc';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, url }) => {
	try {
		return { currentUser: undefined };
	} catch (err) {
		throw error(500, String(err));
	}
};
