import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url, params }) => {
	try {
		const monthParam = {
			month: params.month,
			year: params.year
		};
		const month = await trpc(fetch).query('months:getByMonthAndYear', monthParam);
		const expenses = await trpc(fetch).query('expenses:listByMonth', monthParam);

		return { month: month, expenses: expenses };
	} catch (err) {
		throw error(500, String(err));
	}
};
