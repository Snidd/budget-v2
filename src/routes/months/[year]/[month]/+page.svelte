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
				<th>Tidigare</th>
				<th>Nytt värde</th>
				<th>Kommentar</th>
			</tr>
		</thead>
		<tbody>
			{#each expenses as expense}
				<tr class="">
					<th />
					<td class="align-top pt-8">{expense.description}</td>
					<td class="align-top pt-8"
						><div class="badge badge-outline">{expense.category.name}</div></td
					>
					<td class="align-top pt-8">
						{#if expense.defaultValue !== null}
							<span>{expense.isIncome ? '+' : '-'}</span>
							<span>{formatSEK(expense.defaultValue)}</span>
						{/if}
					</td>
					{#key expense.expenseValue}
						<ExpenseValueDisplay
							currentExpenseId={expense.id}
							currentMonth={month}
							defaultValue={String(expense.defaultValue)}
							expenseValues={expense.expenseValue}
							isIncome={expense.isIncome}
						/>
					{/key}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
