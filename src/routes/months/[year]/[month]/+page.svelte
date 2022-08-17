<script lang="ts">
	import { formatMonth, formatSEK } from '$lib/utils';

	import type { Errors, PageData } from './$types';

	export let data: PageData;
	export let errors: Errors;

	$: ({ month } = data);
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
			{#each month.expenses as expense}
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
					<td />
					<td
						><input
							type="text"
							placeholder={String(expense.defaultValue === null ? '' : expense.defaultValue)}
							class="input input-bordered w-full max-w-xs"
						/>
					</td>
					<td
						><input type="text" placeholder="" class="input input-bordered w-full max-w-xs" />
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
