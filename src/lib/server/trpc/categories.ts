import { PaymentTypes } from '$lib/model/PaymentTypes';
import prismaClient from '$lib/server/prismaClient';
import { falsyToNull, trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import Decimal from 'decimal.js';
import { z } from 'zod';

export default trpc
	.router()
	.query('list', {
		resolve: () =>
			prismaClient.category.findMany({
				select: {
					id: true,
					name: true
				},
				orderBy: [{ order: 'asc' }, { name: 'asc' }]
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number().nullable(),
			name: z.string().min(3).max(150).transform(trim),
			active: z.boolean().default(true),
			order: z.number().nullable()
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
