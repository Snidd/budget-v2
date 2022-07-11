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
			prismaClient.expense.findMany({
				select: {
					id: true,
					description: true,
					active: true,
					duedate: true,
					defaultValue: true,
					category: { select: { name: true } },
					values: true
				},
				orderBy: [{ description: 'asc' }]
			})
	})
	.query('listByCategory', {
		input: z.number(),
		resolve: ({ input: categoryId }) =>
			prismaClient.expense.findMany({
				where: { categoryId },
				select: {
					id: true,
					description: true,
					active: true,
					duedate: true,
					defaultValue: true,
					category: { select: { name: true } },
					values: true
				}
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number().nullable(),
			description: z.string().min(3).max(50).transform(trim),
			paymentType: z.nativeEnum(PaymentTypes),
			categoryId: z.number().min(1, 'Should be selected'),
			repeatingMonths: z.number(),
			duedate: z.date().optional(),
			active: z.boolean().default(true),
			defaultValue: z.number().optional()
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
				? prismaClient.expense.update({ data, where: { id }, select: { id: true } })
				: prismaClient.expense.create({ data, select: { id: true } })
	})
	.mutation('delete', {
		input: z.number(),
		resolve: ({ input: id }) => prismaClient.expense.delete({ where: { id } }).then(() => undefined)
	});
