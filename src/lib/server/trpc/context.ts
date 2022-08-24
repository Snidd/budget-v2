import * as trpc from '@trpc/server';
import type { inferAsyncReturnType } from '@trpc/server';
import { auth } from '../lucia';
import type { CreateContextFn } from 'trpc-sveltekit/dist/types';
import type { Router } from '@trpc/server/dist/declarations/src/router';

export const context = async (event: any) => {
	console.log('authenticating request');
	try {
		const user = await auth.validateRequest(event.request);
		console.log({ user });
		return {
			event,
			user
		};
	} catch (err) {
		return {
			event,
			user: undefined
		};
	}
};

export type Context = inferAsyncReturnType<typeof context>;
