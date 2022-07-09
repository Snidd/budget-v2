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
				select: { id: true, description: true, category: { select: { name: true } }, values: true },
				orderBy: [{ description: 'asc' }]
			})
	})
	.query('listByCategory', {
		input: z.string(),
		resolve: ({ input: categoryId }) =>
			prismaClient.expense.findMany({
				where: { categoryId },
				select: { id: true, description: true, category: { select: { name: true } }, values: true }
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.string().nullable(),
			description: z.string().min(3).max(50).transform(trim),
			paymentType: z.nativeEnum(PaymentTypes),
			categoryId: z.string().min(1, 'Should be selected')
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
		input: z.string(),
		resolve: ({ input: id }) => prismaClient.expense.delete({ where: { id } }).then(() => undefined)
	});
