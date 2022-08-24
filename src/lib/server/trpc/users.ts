import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import type { Router } from './index';
import * as trpc from '@trpc/server';
import { claim_text } from 'svelte/internal';
import { z } from 'zod';
import { auth } from '../lucia';

import { loginSchema, signUpSchema } from '$lib/auth/auth';

export default trpc
	.router()
	.mutation('create', {
		input: signUpSchema,
		resolve: async ({ ctx, input: { username, password } }) => {
			const createdUser = await auth.createUser('id', username, {
				password
			});

			return {
				status: 201,
				message: 'Account created successfully',
				result: createdUser
			};
		}
	})
	.query('signin', {
		input: loginSchema,
		resolve: async ({ ctx, input: { username, password } }) => {
			const user = await auth.authenticateUser('id', username, password);
			return user;
		}
	});
