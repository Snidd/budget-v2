import type { InferQueryInput } from '$lib/client/trpc';
import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

type ExpenseInput = InferQueryInput<'incomes:list'>;

export const load: PageLoad = async ({ fetch, url }) => {
	try {
		const expenses = await trpc(fetch).query('expenses:listAll');
		return expenses;
	} catch (err) {
		throw error(500, String(err));
	}
};
