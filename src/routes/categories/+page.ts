import trpc from '$lib/client/trpc';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const incomeCategories = await trpc(fetch).query('categories:list', true);
		const expenseCategories = await trpc(fetch).query('categories:list', false);
		return { incomeCategories: incomeCategories, expenseCategories: expenseCategories };
	} catch (err) {
		throw error(500, String(err));
	}
};
