import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import categories from './categories';
import expenses from './expenses';
import expensevalues from './expensevalues';
import incomes from './incomes';
import months from './months';
import type { RequestEvent } from '@sveltejs/kit';
import user from './user';

export const createContext = async ({ request, locals }: RequestEvent) => {
	return {
		req: request,
		locals
	};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const router = trpc
	.router<Context>()
	.transformer(trpcTransformer)
	.merge('expenses:', expenses)
	.merge('incomes:', incomes)
	.merge('months:', months)
	.merge('expensevalues:', expensevalues)
	.merge('categories:', categories)
	.merge('user:', user);

export type Router = typeof router;
