import type { InferQueryInput } from '$lib/client/trpc';
import trpc from '$lib/client/trpc';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

type ExpenseInput = InferQueryInput<'incomes:list'>;

export const load: PageLoad = async ({ fetch, url }) => {
	try {
		let orderBy: ExpenseInput = 'category';
		const orderByInput = url.searchParams.get('orderBy');
		if (orderByInput !== null && orderByInput !== undefined && orderByInput !== 'undefined') {
			orderBy = orderByInput as ExpenseInput;
		}
		const expenses = await trpc(fetch).query('incomes:list', orderBy);

		return { expenses: expenses, orderBy: orderBy };
	} catch (err) {
		throw error(500, String(err));
	}
};
