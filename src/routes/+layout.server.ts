// src/routes/layout.server.ts
import type { LayoutServerLoad } from '../../.svelte-kit/types/src/routes/$types';

export const load: LayoutServerLoad = async ({ locals }: { locals: App.Locals }) => {
	return locals.user
		? {
				session: {
					user: locals.user,
					accessToken: locals.accessToken,
					error: locals.error
				}
		  }
		: {};
};
