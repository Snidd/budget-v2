<script lang="ts">
	import { formatMonth, formatSEK } from '$lib/utils';

	import type { Errors, PageData } from './$types';
	import ExpenseValueDisplay from './ExpenseValueDisplay.svelte';

	export let data: PageData;
	export let errors: Errors;

	$: ({ month, expenses } = data);
</script>

{#if month}
	<h1 class="font-bold text-xl mb-4">{formatMonth(month.year, month.month)}</h1>

	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th />
				<th>Beskrivning</th>
				<th>Kategori</th>
				<th>Standard</th>
				<th>Senast</th>
				<th>Nytt värde</th>
				<th>Kommentar</th>
			</tr>
		</thead>
		<tbody>
			{#each expenses as expense}
				<tr class="">
					<th />
					<td>{expense.description}</td>
					<td><div class="badge badge-outline">{expense.category.name}</div></td>
					<td>
						{#if expense.defaultValue !== null}
							<span>{expense.isIncome ? '+' : '-'}</span>
							<span>{formatSEK(expense.defaultValue)}</span>
						{/if}
					</td>
					<ExpenseValueDisplay
						currentMonth={month}
						defaultValue={String(expense.defaultValue)}
						expenseValues={expense.expenseValue}
						isIncome={expense.isIncome}
					/>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
