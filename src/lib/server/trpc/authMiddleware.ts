import type { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares';
import { TRPCError } from '@trpc/server';
import type { Context } from './index';

export const authMiddleware: MiddlewareFunction<
	{ req: Request; locals: App.Locals },
	Context,
	unknown
> = async ({ ctx: { locals }, next }) => {
	if (!locals.user) throw new TRPCError({ message: `Unauthorized`, code: 'UNAUTHORIZED' });
	return next();
};
