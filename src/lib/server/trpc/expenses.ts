import { PaymentTypes } from '$lib/model/PaymentTypes';
import prismaClient from '$lib/server/prismaClient';
import type { Prisma } from '@prisma/client';
import { falsyToNull, trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import Decimal from 'decimal.js';
import { string, z } from 'zod';
import categories from './categories';
import { ca } from 'date-fns/locale';

const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

const booleanSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Boolean) return new Boolean(arg);
}, z.boolean());

type DateSchema = z.infer<typeof dateSchema>;
type BooleanSchema = z.infer<typeof booleanSchema>;
type ExpenseSelect = Prisma.ExpenseSelect;

const selectObject = {
	id: true,
	description: true,
	repeatingMonths: true,
	active: true,
	duedate: true,
	defaultValue: true,
	isIncome: true,
	paymentType: true,
	category: { select: { name: true, color: true } },
	categoryId: true
};

export default trpc
	.router<{ req: Request; locals: App.Locals }>()
	.query('list', {
		input: z.enum([
			'description',
			'active',
			'duedate',
			'defaultValue',
			'isIncome',
			'paymentType',
			'category'
		]),
		resolve: ({ input: orderParameter }) => {
			const orderByDescription = { description: 'asc' };
			const orderArray: object[] = [orderByDescription];
			let orderObject: Record<string, string> | Record<string, Record<string, string>> | undefined =
				undefined;
			if (orderParameter !== undefined) {
				orderObject = {};
				orderObject[orderParameter] = 'asc';
				if (orderParameter === 'category') {
					orderObject[orderParameter] = {
						name: 'asc'
					};
				}
				orderArray.unshift(orderObject);
			}
			return prismaClient.expense.findMany({
				select: selectObject,
				where: { isIncome: false, active: true },
				orderBy: orderArray
			});
		}
	})
	.query('listAll', {
		resolve: () =>
			prismaClient.expense.findMany({
				select: {
					...selectObject,
					expenseValue: {
						include: { month: true }
					}
				},
				orderBy: [{ isIncome: 'asc' }, { category: { name: 'asc' } }]
			})
	})
	.query('getById', {
		input: z.number(),
		resolve: ({ input: id }) =>
			prismaClient.expense.findUnique({
				where: { id },
				select: selectObject
			})
	})
	.query('listByMonth', {
		input: z.object({
			year: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
			month: z.number().or(z.string().regex(/^\d+$/).transform(Number))
		}),
		resolve: async ({ input: { year, month } }) => {
			const dbMonth = await prismaClient.month.findUnique({
				where: {
					month_year: {
						month: month,
						year: year
					}
				},
				include: {
					expenses: {
						include: {
							expenseValue: {
								include: {
									month: true
								}
							},
							category: true
						}
					}
				}
			});
			if (dbMonth === null) return [];
			return dbMonth.expenses;
		}
	})
	.query('listByCategory', {
		input: z.number(),
		resolve: ({ input: categoryId }) =>
			prismaClient.expense.findMany({
				where: { categoryId },
				select: selectObject
			})
	})
	.mutation('save', {
		input: z.object({
			id: z.number().nullable(),
			description: z.string().min(3).max(50).transform(trim),
			paymentType: z.nativeEnum(PaymentTypes),
			categoryId: z.number().min(1, 'Should be selected'),
			repeatingMonths: z.number().or(z.string().regex(/^\d+$/).transform(Number)),
			duedate: dateSchema.nullable().optional(),
			active: z.boolean().default(true),
			defaultValue: z
				.string()
				.refine(
					(val) => {
						try {
							new Decimal(val);
							return true;
						} catch {
							return false;
						}
					},
					{ message: 'Valid number required' }
				)
				.optional(),
			isIncome: z.boolean().default(false)
		}),
		resolve: ({ input: { id, ...data } }) =>
			id
				? prismaClient.expense.update({ data, where: { id }, select: { id: true } })
				: prismaClient.expense.create({ data, select: { id: true } })
	})
	.mutation('delete', {
		input: z.number(),
		resolve: async ({ input: id }) => {
			await prismaClient.expenseValue.deleteMany({
				where: {
					expenseId: id
				}
			});

			return await prismaClient.expense.delete({ where: { id } }).then(() => undefined);
		}
	});
