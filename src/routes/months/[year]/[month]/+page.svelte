<script lang="ts">
	import CategoryBadge from '$components/badges/CategoryBadge.svelte';
	import SpinnerIcon from '$components/icons/SpinnerIcon.svelte';
	import trpc from '$lib/client/trpc';
	import { formatMonth, formatSEK } from '$lib/utils';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { Router } from '$lib/server/trpc';
	import type { TRPCClientError } from '@trpc/client';
	import type { Errors, PageData } from './$types';
	import ExpenseValueDisplay from './ExpenseValueDisplay.svelte';
	import ErrorDisplay from '$components/ErrorDisplay.svelte';

	export let data: PageData;
	export let errors: Errors;

	$: ({ month, expenses } = data);

	let editorErrors: Record<string, string> | undefined;
	let loading = false;

	const fillStandard = async () => {
		try {
			loading = true;
			if (month && month.id) {
				await trpc().mutation('months:createdefaultvalues', month?.id);
				await reloadExpenses();
			}
			loading = false;
		} catch (err) {
			loading = false;
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};

	const reloadExpenses = async () => {
		let monthNumber = month?.month;
		let year = month?.year;
		if (monthNumber !== undefined && year !== undefined) {
			expenses = await trpc().query('expenses:listByMonth', {
				month: monthNumber,
				year: year
			});
		}
	};
</script>

{#if month}
	<div class="flex content-start gap-4">
		<h1 class="font-bold text-xl mb-4">{formatMonth(month.year, month.month)}</h1>
		<button class="btn btn-primary btn-sm" disabled={loading} on:click={() => fillStandard()}
			>Fyll i med standardvärden {#if loading}<SpinnerIcon />{/if}</button
		>
		<ErrorDisplay {editorErrors} fields={'id'} />
	</div>

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
					<td class="align-top pt-8"><CategoryBadge category={expense.category} /></td>
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
