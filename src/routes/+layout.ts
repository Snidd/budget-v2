import type { InferQueryInput, InferQueryOutput } from '$lib/client/trpc';
import trpc from '$lib/client/trpc';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

type MonthOutput = InferQueryOutput<'months:list'>;

export const load: LayoutLoad = async ({ fetch, url }) => {
	try {
		const months = await trpc(fetch).query('months:list');
		return { months: months };
	} catch (err) {
		throw error(500, String(err));
	}
};
