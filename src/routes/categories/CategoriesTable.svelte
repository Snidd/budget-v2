<script lang="ts">
	import type { InferQueryOutput } from '$lib/client/trpc';
	import CategoriesTableRow from './CategoriesTableRow.svelte';

	export let expenseCategories: InferQueryOutput<'categories:list'>;
	export let incomeCategories: InferQueryOutput<'categories:list'>;

	const isEmpty = (): boolean => {
		if (expenseCategories.length === 0 && incomeCategories.length === 0) return true;
		return false;
	};

	const colSpan = 2;
</script>

<table class="table">
	<thead>
		<tr>
			<th>Namn</th>
			<th>Färg</th>
			<th />
		</tr>
	</thead>
	<tbody>
		{#if isEmpty()}
			<tr>
				<td class="italic text-center" colspan={colSpan}>Inga kategorier</td>
			</tr>
		{:else}
			{#if expenseCategories.length > 0}
				<tr>
					<td class="text-xs font-bold" colspan={colSpan}>Utgiftskategorier</td>
				</tr>
			{/if}
			<CategoriesTableRow categories={expenseCategories} on:delete on:edit />
			{#if incomeCategories.length > 0}
				<tr>
					<td class="text-xs font-bold" colspan={colSpan}>Inkomstkategorier</td>
				</tr>
			{/if}
			<CategoriesTableRow categories={incomeCategories} on:delete on:edit />
		{/if}
	</tbody>
</table>
