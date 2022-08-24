import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { handleAuth, supabaseServerClient } from '@supabase/auth-helpers-sveltekit';
import { router } from '$lib/server/trpc';
import { createContext } from '$lib/server/trpc';
import { createTRPCHandle } from 'trpc-sveltekit';

export const handle: Handle = sequence(
	...handleAuth({
		// the logout handler
		logout: { returnTo: '/' }
	}),
	async ({ event, resolve }) => {
		if (event.url.pathname.indexOf('/api/auth/') > -1) {
			return new Response('OK', { status: 200 });
		}
		event.locals.serverClient = supabaseServerClient(event.locals.accessToken || '');

		const response = await createTRPCHandle({
			url: '/trpc',
			router,
			createContext,
			event,
			resolve
		});

		return response;
	}
);
