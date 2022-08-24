import { createContext, router } from '$lib/server/trpc';
import { createTRPCHandle } from 'trpc-sveltekit';
import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

import { sequence } from '@sveltejs/kit/hooks';

const second: Handle = async ({ event, resolve }) => {
	const response = await createTRPCHandle({
		router,
		createContext: createContext,
		event,
		resolve
	});

	return response;
};

const first = auth.handleAuth;

export const handle = sequence(first, second);
