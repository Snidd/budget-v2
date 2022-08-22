import trpc from '$lib/client/trpc';
import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

function hasOwnProperty<T, K extends PropertyKey>(obj: T, prop: K): obj is T & Record<K, unknown> {
	return Object.prototype.hasOwnProperty.call(obj, prop);
}

export const load: PageLoad = async ({ fetch, url, params }) => {
	try {
		const monthParam = {
			month: params.month,
			year: params.year
		};
		const month = await trpc(fetch).query('months:getByMonthAndYear', monthParam);
		const expenses = await trpc(fetch).query('expenses:listByMonth', monthParam);

		if (month === null) {
			throw error(404, 'Den månaden finns inte?');
		}
		return { month: month, expenses: expenses };
	} catch (err) {
		if (hasOwnProperty(err, 'status')) {
			if (err.status === 404) {
				throw err;
			}
		}
		throw error(500, String(err));
	}
};
