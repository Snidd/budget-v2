import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import { auth } from '../lucia';
import categories from './categories';
import expenses from './expenses';
import expensevalues from './expensevalues';
import incomes from './incomes';
import months from './months';
//import { context } from './context';
import users from './users';

export const createContext = async (event: any) => {
	try {
		const user = await auth.validateRequest(event.request);
		return {
			user
		};
	} catch (err) {
		return {
			user: undefined
		};
	}
};

export const router = trpc
	.router<inferAsyncReturnType<typeof createContext>>()
	.transformer(trpcTransformer)
	.merge('expenses:', expenses)
	.merge('incomes:', incomes)
	.merge('months:', months)
	.merge('expensevalues:', expensevalues)
	.merge('users:', users)
	.merge('categories:', categories);

export type Router = typeof router;
