<script lang="ts">
	import AddIcon from '$components/icons/AddIcon.svelte';
	import RemoveIcon from '$components/icons/RemoveIcon.svelte';
	import { formatMonth, formatSEK } from '$lib/utils';

	import type { ExpenseValue, Month } from '@prisma/client';

	export let isIncome: boolean;
	export let expenseValues: ((ExpenseValue & { month: Month | null }) | null)[];

	let showFull = false;
</script>

{#if expenseValues && expenseValues.length > 0}
	<div class="flex w-full items-start gap-2">
		{#if expenseValues && expenseValues.length > 1}
			<button on:click={() => (showFull = !showFull)} class="btn mt-4 btn-xs"
				>{#if showFull}<RemoveIcon />{:else}<AddIcon />{/if}</button
			>
		{/if}
		<table class="table w-full">
			<tbody>
				<tr>
					<td
						><span>{isIncome ? '+' : '-'}</span><span>{formatSEK(expenseValues[0]?.value)}</span
						></td
					>
					<td>{expenseValues[0]?.comment ? expenseValues[0]?.comment : ''}</td>
					{#if showFull}<td
							>{formatMonth(expenseValues[0]?.month?.year, expenseValues[0]?.month?.month)}</td
						>{/if}
				</tr>
				{#if showFull}
					{#each expenseValues.slice(1) as expenseValue}
						<tr>
							<td
								><span>{isIncome ? '+' : '-'}</span><span>{formatSEK(expenseValue?.value)}</span
								></td
							>
							<td>{expenseValue?.comment ? expenseValue?.comment : ''}</td>
							<td>{formatMonth(expenseValue?.month?.year, expenseValue?.month?.month)}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
{/if}
