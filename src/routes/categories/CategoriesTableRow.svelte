<script lang="ts">
	import DeleteIcon from '$components/icons/DeleteIcon.svelte';
	import EditIcon from '$components/icons/EditIcon.svelte';
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import { createEventDispatcher } from 'svelte';

	type Category = InferMutationInput<'categories:save'>;

	export let categories: InferQueryOutput<'categories:list'>;
	const dispatch = createEventDispatcher<{
		delete: { category: Category };
		edit: { category: Category };
	}>();
</script>

{#each categories as category}
	<tr>
		<td>{category.name}</td>
		<td
			><div
				class="badge badge-outline"
				style="color: {category.color}; border-color: {category.color}"
			>
				{category.color}
			</div></td
		>
		<td
			><button
				class="btn btn-xs btn-accent mr-2"
				on:click={() => dispatch('edit', { category: category })}><EditIcon /></button
			><button
				class="btn btn-xs btn-error"
				on:click={() => dispatch('delete', { category: category })}><DeleteIcon /></button
			></td
		>
	</tr>
{/each}
