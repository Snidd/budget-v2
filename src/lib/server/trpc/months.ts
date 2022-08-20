import { PaymentTypes } from '$lib/model/PaymentTypes';
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
	.mutation('addexpense', {
		input: z.object({
			monthId: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
			value: z.number().optional(),
			description: z.string().min(3).max(50).transform(trim),
			categoryId: z.number().min(1, 'Should be selected')
		}),
		resolve: async ({ input: { monthId, ...data } }) => {
			const isIncome = data.value !== undefined && data.value > 0;
			if (!isIncome && data.value !== undefined) {
				data.value = Math.abs(data.value);
			}
			console.log(data.value);
			// create expense
			let expData = {
				defaultValue: data.value,
				description: data.description,
				categoryId: data.categoryId,
				paymentType: PaymentTypes.NORMAL,
				active: false,
				isIncome: isIncome,
				repeatingMonths: 0
			};
			const expense = await prismaClient.expense.create({ data: expData, select: { id: true } });

			// link it to month
			await prismaClient.month.update({
				data: {
					expenses: {
						connect: {
							id: expense.id
						}
					}
				},
				where: { id: monthId }
			});

			// create expensevalue
			let ev = await prismaClient.expenseValue.create({
				data: {
					value: data.value,
					comment: '',
					expense: {
						connect: {
							id: expense.id
						}
					},
					month: {
						connect: {
							id: monthId
						}
					}
				}
			});

			return ev;
		}
	})
	.mutation('createdefaultvalues', {
		input: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
		resolve: async ({ input: id }) => {
			const expenses = await prismaClient.expense.findMany({
				where: { months: { some: { id } } }
			});

			console.log(expenses.length);
			console.log(expenses.map((exp) => exp.defaultValue));

			let expenseValues = expenses.map((exp) => ({
				comment: '',
				value: exp.defaultValue === null ? 0 : exp.defaultValue,
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
