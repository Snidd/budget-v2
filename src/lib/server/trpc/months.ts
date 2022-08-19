import prismaClient from '$lib/server/prismaClient';
import { trim } from '$lib/zodTransformer';
import { prisma } from '@prisma/client';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export default trpc
	.router()
	.query('list', {
		resolve: () =>
			prismaClient.month.findMany({
				select: {
					id: true,
					comment: true,
					year: true,
					month: true
				},
				orderBy: [{ year: 'asc' }, { month: 'asc' }]
			})
	})
	.query('getByMonthAndYear', {
		input: z.object({
			year: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
			month: z.number().or(z.string().regex(/^\d+$/).transform(Number))
		}),
		resolve: ({ input: { year, month } }) =>
			prismaClient.month.findUnique({
				where: { month_year: { month: month, year: year } }
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number().nullable(),
			comment: z.string().transform(trim),
			year: z.number(),
			month: z.number().min(0).max(12),
			expenses: z.object({
				connect: z.array(z.object({ id: z.number() }))
			})
		}),
		resolve: ({ input: { id, ...data } }) =>
			id
				? prismaClient.month.update({ data, where: { id }, select: { id: true } })
				: prismaClient.month.create({ data, select: { id: true } })
	})
	.mutation('createdefaultvalues', {
		input: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
		resolve: async ({ input: id }) => {
			const expenses = await prismaClient.expense.findMany({
				where: { months: { some: { id } } }
			});

			console.log(expenses.length);
			console.log(expenses.map((exp) => exp.defaultValue));

			let expenseValues = expenses
				.filter((exp) => exp.defaultValue !== null)
				.map((exp) => ({
					comment: '',
					value: exp.defaultValue,
					month: {
						connect: { id }
					},
					expense: {
						connect: { id: exp.id }
					}
				}));

			let results: { id: number }[] = [];

			//TODO: Rebuild when moving from sqlite
			for (var i = 0; i < expenseValues.length; i++) {
				try {
					const result = await prismaClient.expenseValue.create({
						data: expenseValues[i],
						select: { id: true }
					});
					results.push(result);
				} catch (err) {
					continue;
				}
			}

			return results;
		}
	})
	.mutation('delete', {
		input: z.number(),
		resolve: ({ input: id }) =>
			prismaClient.category.delete({ where: { id } }).then(() => undefined)
	});
