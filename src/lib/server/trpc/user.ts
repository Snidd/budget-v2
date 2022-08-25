import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import type { Context } from '.';
import { authMiddleware } from './authMiddleware';

export default trpc
	.router<Context>()
	.middleware(authMiddleware)
	.query('get', {
		resolve: ({ ctx }) => ctx.locals.accessToken
	});
