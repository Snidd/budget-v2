import type { InferQueryOutput } from '$lib/client/trpc';
import { compareDesc } from 'date-fns';

type ExpenseValue = InferQueryOutput<'expensevalues:getById'>;

export const expenseValueSorter = (ev1: ExpenseValue, ev2: ExpenseValue) => {
	const month1 = ev1?.month;
	const month2 = ev2?.month;

	if (month1 === undefined || month1 === null) return -1;
	if (month2 === undefined || month2 === null) return 1;

	const date1 = new Date(month1.year, month1.month, 1);
	const date2 = new Date(month2.year, month2.month, 1);

	return compareDesc(date1, date2);
};
