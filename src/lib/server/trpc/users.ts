import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import type { Router } from './index';
import * as trpc from '@trpc/server';
import { claim_text } from 'svelte/internal';
import { z } from 'zod';
import { auth } from '../lucia';
import type { Context } from './context';
import { signUpSchema } from '$lib/auth/auth';

export default trpc.router<Context>().mutation('create', {
	input: signUpSchema,
	resolve: async ({ ctx, input: { username, password } }) => {
		const createdUser = await auth.createUser('id', username, {
			password
		});

		createdUser.cookies;

		return {
			status: 201,
			message: 'Account created successfully',
			result: createdUser
		};
	}
});
