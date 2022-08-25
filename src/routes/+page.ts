import trpc from '$lib/client/trpc';
import type { PageLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const currentUser = await trpc(fetch).query('user:get');
		return { currentUser };
	} catch (err) {
		return { currentUser: undefined };
	}
};
