<script lang="ts">
	import type { InferQueryOutput } from '$lib/client/trpc';
	import { formatSEK } from '$lib/utils';
	import type { Month } from '@prisma/client';
	import { compareDesc } from 'date-fns';
	import compareAsc from 'date-fns/compareAsc';

	export let defaultValue: string;
	export let expenseValues: ExpenseValue[];
	export let currentMonth: Month;
	export let isIncome: boolean;

	type ExpenseValue = InferQueryOutput<'expensevalues:getById'>;

	const evFilter = (ev: ExpenseValue) => {
		if (ev?.monthId === currentMonth.id) return false;

		const month1 = ev?.month;

		if (month1 === undefined || month1 === null) return false;

		const date1 = new Date(month1.year, month1.month, 1);
		const date2 = new Date(currentMonth.year, currentMonth.month, 1);

		if (compareAsc(date1, date2) > -1) return false;

		return true;
	};

	const evSorter = (ev1: ExpenseValue, ev2: ExpenseValue) => {
		const month1 = ev1?.month;
		const month2 = ev2?.month;

		if (month1 === undefined || month1 === null) return -1;
		if (month2 === undefined || month2 === null) return 1;

		const date1 = new Date(month1.year, month1.month, 1);
		const date2 = new Date(month2.year, month2.month, 1);

		return compareDesc(date1, date2);
	};

	$: current = expenseValues.find((ev) => ev?.monthId === currentMonth.id);
	$: sorted = expenseValues.slice().filter(evFilter).sort(evSorter);

	$: console.log({ expenseValues });
	$: console.log({ sorted });

	const filter = (incoming: unknown): string => {
		if (incoming === undefined || incoming === null) return '';
		return String(incoming);
	};
</script>

<td
	>{#if sorted && sorted.length > 0}<span>{isIncome ? '+' : '-'}</span><span
			>{formatSEK(sorted[0]?.value)}</span
		>{/if}</td
>
<td
	><input
		type="text"
		placeholder={defaultValue === null ? '' : defaultValue}
		class="input input-bordered w-full max-w-xs"
		value={filter(current?.value)}
	/>
</td>
<td
	><input
		type="text"
		placeholder=""
		class="input input-bordered w-full max-w-xs"
		value={filter(current?.comment)}
	/>
</td>
