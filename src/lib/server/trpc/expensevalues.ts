import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import type { Context } from '.';
import { authMiddleware } from './authMiddleware';

export default trpc
	.router<Context>()
	.middleware(authMiddleware)
	.query('listByMonthId', {
		input: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
		resolve: ({ input }) =>
			prismaClient.expenseValue.findUnique({
				include: { month: true, expense: true },
				where: { id: input }
			})
	})
	.query('getById', {
		input: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
		resolve: ({ input: id }) =>
			prismaClient.expenseValue.findUnique({
				include: { month: true },
				where: { id }
			})
	})
	.query('getByIdWithoutMonth', {
		input: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
		resolve: ({ input: id }) =>
			prismaClient.expenseValue.findUnique({
				where: { id }
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number(),
			comment: z.string().transform(trim).optional(),
			value: z.number().or(
				z
					.string()
					.regex(/^[\d\,\.]+$/)
					.transform(Number)
			),
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
			value: z
				.number()
				.or(
					z
						.string()
						.regex(/^[\d\,\.]+$/)
						.transform(Number)
				)
				.optional(),
			month: z.object({
				connect: z.object({ id: z.number() })
			}),
			expense: z.object({
				connect: z.object({ id: z.number() })
			})
		}),
		resolve: ({ input: { ...data } }) =>
			prismaClient.expenseValue.create({ data, include: { month: true } })
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
