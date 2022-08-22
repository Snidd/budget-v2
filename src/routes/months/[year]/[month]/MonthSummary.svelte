<script lang="ts">
	import CategoryBadge from '$components/badges/CategoryBadge.svelte';
	import type { InferQueryOutput } from '$lib/client/trpc';
	import { formatSEK } from '$lib/utils';
	import Decimal from 'decimal.js';

	type Expenses = InferQueryOutput<'expenses:listByMonth'>;

	export let expenses: Expenses;
	export let monthId: number;

	const getCategories = (expensesList: Expenses) => {
		const categoryNames = expensesList.map((expense) => expense.category.name);
		const uniqueNames = [...new Set(categoryNames)];
		console.log({ uniqueNames });

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
		console.log(categories);
		return categories;
	};

	const getCategorySum = (
		expensesList: Expenses,
		monthId: number,
		categories: { name: string; color: string; isIncome: boolean }[]
	) => {
		const categoriesWithValues = categories.map((cat) => {
			let values = expensesList
				.filter((exp) => exp.category.name === cat.name)
				.map((exp) => exp.expenseValue)
				.flat()
				.filter((ev) => ev.monthId === monthId);
			return {
				...cat,
				ev: values
			};
		});

		const categoriesWithSum = categoriesWithValues.map((catv) => {
			const sum = catv.ev.reduce((prev, cur) => {
				if (cur.value !== null) {
					return prev.plus(new Decimal(cur.value.toString()));
				}
				return prev;
			}, new Decimal(0));
			return { ...catv, sum: sum };
		});

		return categoriesWithSum;
	};

	$: categories = getCategories(expenses);
	$: categoriesWithSum = getCategorySum(expenses, monthId, categories);

	$: total = categoriesWithSum.reduce((prev, cur) => {
		if (cur.isIncome) {
			return prev.plus(cur.sum);
		} else {
			return prev.minus(cur.sum);
		}
	}, new Decimal(0));
</script>

<div class="flex flex-col w-full border-opacity-50">
	<div class="divider">Summering</div>
	<table class="table">
		<thead>
			<tr>
				<th>Kategori</th>
				<th>Summa</th>
			</tr>
		</thead>
		<tbody>
			{#each categoriesWithSum as category}
				<tr>
					<td><CategoryBadge {category} /></td>
					<td>{category.isIncome ? '' : '-'} {formatSEK(category.sum)}</td>
				</tr>
			{/each}
			<tr class="bg-accent">
				<td class="bg-accent"><span class="font-bold">Totalt</span></td>
				<td class="bg-accent">{total > new Decimal(0) ? '+' : ''} {formatSEK(total)}</td>
			</tr>
		</tbody>
	</table>
</div>
