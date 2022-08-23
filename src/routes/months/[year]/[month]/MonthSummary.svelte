<script lang="ts">
	import CategoryBadge from '$components/badges/CategoryBadge.svelte';
	import type { InferQueryOutput } from '$lib/client/trpc';
	import { formatMonth, formatSEK } from '$lib/utils';
	import Decimal from 'decimal.js';
	import { months } from '$lib/stores/months';
	import PaymentTypeSummary from './PaymentTypeSummary.svelte';
	import { compareAsc } from 'date-fns';
	type Expenses = InferQueryOutput<'expenses:listByMonth'>;

	export let expenses: Expenses;
	export let monthId: number;

	const getCategories = (expensesList: Expenses) => {
		const categoryNames = expensesList.map((expense) => expense.category.name);
		const uniqueNames = [...new Set(categoryNames)];

		const categories = uniqueNames.map((name) => {
			let expenseWithCategory = expensesList.find((exp) => exp.category.name === name);
			if (expenseWithCategory === undefined)
				return {
					name: name,
					color: '#ccc',
					isIncome: false
				};
			return expenseWithCategory.category;
		});
		return categories;
	};

	const getCategoriesSum = (
		expensesList: Expenses,
		monthId: number,
		categories: { name: string; color: string; isIncome: boolean }[]
	) => {
		return categories.map((cat) => getCategorySum(expensesList, monthId, cat));
	};

	const getCategorySum = (
		expensesList: Expenses,
		monthId: number,
		category: { name: string; color: string; isIncome: boolean }
	) => {
		let values = expensesList
			.filter((exp) => exp.category.name === category.name)
			.map((exp) => exp.expenseValue)
			.flat()
			.filter((ev) => ev.monthId === monthId);
		let categoryWithValues = { ...category, ev: values };

		const sum = categoryWithValues.ev.reduce((prev, cur) => {
			if (cur.value !== null) {
				return prev.plus(new Decimal(cur.value.toString()));
			}
			return prev;
		}, new Decimal(0));

		let categoryWithSum = { ...categoryWithValues, sum: sum };
		return categoryWithSum;
	};

	const getTotalFromSums = (
		catWithSum: Partial<{ sum: Decimal; isIncome: boolean }[]>
	): Decimal => {
		if (catWithSum === undefined || catWithSum.length === 0) return new Decimal(0);

		return catWithSum.reduce((prev, cur) => {
			if (cur === undefined) return prev;
			if (cur.isIncome) {
				return prev.plus(cur.sum);
			} else {
				return prev.minus(cur.sum);
			}
		}, new Decimal(0));
	};

	$: categories = getCategories(expenses);
	$: categoriesWithSum = getCategoriesSum(expenses, monthId, categories);

	$: total = getTotalFromSums(categoriesWithSum);

	const getLastFiveMonths = (currentId: number) => {
		const currentMonth = $months.find((m) => m.id === currentId);
		if (currentMonth === undefined) return [];
		const currentDate = new Date(currentMonth.year, currentMonth.month, 1);

		const results = $months.filter((m) => {
			if (m.id === currentId) return false;
			const compareDate = new Date(m.year, m.month, 1);
			if (compareAsc(currentDate, compareDate) > -1) {
				return true;
			}
			return false;
		});

		console.log({ results });

		return results.slice(-5);
	};

	$: lastFiveMonths = getLastFiveMonths(monthId);
</script>

<div class="flex flex-col w-full border-opacity-50">
	<div class="divider">Summering</div>
	<table class="table">
		<thead>
			<tr>
				<th>Kategori</th>
				{#each lastFiveMonths as month}
					<th>{formatMonth(month.year, month.month)}</th>
				{/each}
				<th>Summa denna månad</th>
			</tr>
		</thead>
		<tbody>
			{#each categoriesWithSum as category}
				<tr>
					<td><CategoryBadge {category} /></td>
					{#each lastFiveMonths as month, index}
						{@const catWithSum = getCategorySum(expenses, month.id, category)}
						{@const lastSum = getCategorySum(expenses, lastFiveMonths[index - 1]?.id, category)}
						{@const diff = lastSum.sum.equals(0)
							? new Decimal(0)
							: lastSum.sum.minus(catWithSum.sum)}
						{#if month.id !== monthId}
							<td
								>{category.isIncome ? '' : '-'}
								{formatSEK(catWithSum.sum)}
								{#if diff.greaterThan(0)}<span class="text-green-700">-{formatSEK(diff)}</span
									>{:else if diff.lessThan(0)}<span class="text-red-600"
										>+{formatSEK(diff.absoluteValue())}</span
									>{/if}</td
							>
						{/if}
					{/each}
					<td>{category.isIncome ? '' : '-'} {formatSEK(category.sum)}</td>
				</tr>
			{/each}
			<tr class="bg-accent">
				<td class="bg-accent"><span class="font-bold">Totalt</span></td>
				{#each lastFiveMonths as month}
					{@const sums = getCategoriesSum(expenses, month.id, categories)}
					{@const totals = getTotalFromSums(sums)}
					<td class="bg-accent">{totals > new Decimal(0) ? '+' : ''} {formatSEK(totals)}</td>
				{/each}
				<td class="bg-accent">{total > new Decimal(0) ? '+' : ''} {formatSEK(total)}</td>
			</tr>
			<PaymentTypeSummary {expenses} {monthId} {lastFiveMonths} />
		</tbody>
	</table>
</div>
