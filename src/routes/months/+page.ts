import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	try {
		return { example: [] };
	} catch (err) {
		throw error(500, String(err));
	}
};
