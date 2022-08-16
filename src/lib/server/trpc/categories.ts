import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export default trpc
	.router()
	.query('list', {
		input: z.boolean().default(false).optional(),
		resolve: ({ input }) =>
			prismaClient.category.findMany({
				select: {
					id: true,
					name: true
				},
				where: { isIncome: input !== undefined ? input : false },
				orderBy: [{ order: 'asc' }, { name: 'asc' }]
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number().nullable(),
			name: z.string().min(3).max(150).transform(trim),
			isIncome: z.boolean().default(false),
			order: z.number().default(0)
			/*price: z.string().refine(
				(val) => {
					try {
						new Decimal(val);
						return true;
					} catch {
						return false;
					}
				},
				{ message: 'Valid number required' }
			),*/
		}),
		resolve: ({ input: { id, ...data } }) =>
			id
				? prismaClient.category.update({ data, where: { id }, select: { id: true } })
				: prismaClient.category.create({ data, select: { id: true } })
	})
	.mutation('delete', {
		input: z.number(),
		resolve: ({ input: id }) =>
			prismaClient.category.delete({ where: { id } }).then(() => undefined)
	});
