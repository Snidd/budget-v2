import { PaymentTypes } from '$lib/model/PaymentTypes';
import prismaClient from '$lib/server/prismaClient';
import type { Prisma } from '@prisma/client';
import { falsyToNull, trim } from '$lib/zodTransformer';
import * as trpc from '@trpc/server';
import Decimal from 'decimal.js';
import { z } from 'zod';

const dateSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date());

const booleanSchema = z.preprocess((arg) => {
	if (typeof arg == 'string' || arg instanceof Boolean) return new Boolean(arg);
}, z.boolean());

type DateSchema = z.infer<typeof dateSchema>;
type BooleanSchema = z.infer<typeof booleanSchema>;

const selectObject = {
	id: true,
	description: true,
	repeatingMonths: true,
	active: true,
	duedate: true,
	defaultValue: true,
	isIncome: true,
	category: { select: { name: true } }
};

export default trpc
	.router()
	.query('list', {
		resolve: () =>
			prismaClient.expense.findMany({
				select: selectObject,
				orderBy: [{ description: 'asc' }]
			})
	})
	.query('listByIncome', {
		input: z.boolean(),
		resolve: ({ input: isIncome }) =>
			prismaClient.expense.findMany({
				where: { isIncome },
				select: selectObject,
				orderBy: [{ description: 'asc' }]
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
			repeatingMonths: z.number(),
			duedate: dateSchema.optional(),
			active: z.boolean().default(true),
			defaultValue: z.number().optional(),
			isIncome: z.boolean().default(false)
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
