import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export default trpc
	.router()
	.query('listByMonthId', {
		input: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
		resolve: ({ input }) =>
			prismaClient.expenseValue.findUnique({
				include: { month: true, expense: true },
				where: { id: input }
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number(),
			comment: z.string().transform(trim).optional(),
			value: z.number().optional(),
			month: z
				.object({
					connect: z.object({ id: z.number() })
				})
				.optional(),
			expense: z
				.object({
					connect: z.object({ id: z.number() })
				})
				.optional()
		}),
		resolve: ({ input: { id, ...data } }) =>
			prismaClient.expenseValue.update({ data, where: { id }, select: { id: true } })
	})
	.mutation('create', {
		input: z.object({
			comment: z.string().transform(trim).optional(),
			value: z.number(),
			month: z.object({
				connect: z.object({ id: z.number() })
			}),
			expense: z.object({
				connect: z.object({ id: z.number() })
			})
		}),
		resolve: ({ input: { ...data } }) =>
			prismaClient.expenseValue.create({ data, select: { id: true } })
	})
	.mutation('saveMultiple', {
		input: z.array(
			z.object({
				id: z.number().nullable(),
				comment: z.string().transform(trim),
				month: z.object({
					connect: z.object({ id: z.number() })
				}),
				expense: z.object({
					connect: z.object({ id: z.number() })
				}),
				value: z.number()
			})
		),
		resolve: ({ input: { ...data } }) => {
			let result = data.map((item) => {
				let { id, ...itemdata } = item;
				if (id !== null) {
					return prismaClient.expenseValue.update({
						data: itemdata,
						where: { id: id },
						select: { id: true }
					});
				} else {
					return prismaClient.expenseValue.create({ data: itemdata, select: { id: true } });
				}
			});
			return result;
		}
	})
	.mutation('delete', {
		input: z.number(),
		resolve: ({ input: id }) =>
			prismaClient.expenseValue.delete({ where: { id } }).then(() => undefined)
	});
