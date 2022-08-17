import type { inferAsyncReturnType } from '@trpc/server';
import * as trpc from '@trpc/server';
import trpcTransformer from 'trpc-transformer';
import categories from './categories';
import expenses from './expenses';
import expensevalues from './expensevalues';
import incomes from './incomes';
import months from './months';

export const createContext = async () => ({});

export const router = trpc
	.router<inferAsyncReturnType<typeof createContext>>()
	.transformer(trpcTransformer)
	.merge('expenses:', expenses)
	.merge('incomes:', incomes)
	.merge('months:', months)
	.merge('expensevalues:', expensevalues)
	.merge('categories:', categories);

export type Router = typeof router;
