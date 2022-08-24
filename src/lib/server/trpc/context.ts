import * as trpc from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { auth } from '../lucia';
import type { CreateContextFn } from 'trpc-sveltekit/dist/types';
import type { Router } from '@trpc/server/dist/declarations/src/router';

export const context = async (event: any) => {
	const user = await auth.validateRequest(event.request);

	return {
		event,
		user
	};
};

export type Context = inferAsyncReturnType<typeof context>;
