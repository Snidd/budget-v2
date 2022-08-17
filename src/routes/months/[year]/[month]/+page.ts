import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
	try {
		const test = await trpc(fetch).query('months:list');
		const month = await trpc(fetch).query('months:getByMonthAndYear', {
			month: params.month,
			year: params.year
		});
		console.log({ month });
		return { month: month };
	} catch (err) {
		throw error(500, String(err));
	}
};
