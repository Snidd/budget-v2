<script lang="ts">
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';
	import { createEventDispatcher } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import SpinnerIcon from './icons/SpinnerIcon.svelte';

	const dispatch = createEventDispatcher<{ delete: never }>();

	export let expense: InferQueryOutput<'expenses:getById'>;

	let deleting = false;

	const deleteExpense = async () => {
		if (expense && expense.id) {
			try {
				deleting = true;
				await trpc().mutation('expenses:delete', expense.id);
				dispatch('delete');
				expense = null;
			} catch (err) {
				console.log(err);
			} finally {
				deleting = false;
			}
		}
	};
</script>

{#if expense != null}
	<div class="bg-base-200 border border-primary rounded-md p-2">
		<p>{expense.id}.</p>
		<p>{expense.description}</p>
		<p>{expense.category.name}</p>
		<p>{expense.defaultValue}</p>
		<p>{expense.repeatingMonths}</p>
		<p>{expense.duedate}</p>
		<button
			class="btn btn-secondary gap-2 {deleting ? 'btn-disabled' : ''}"
			on:click={() => deleteExpense()}
		>
			{#if deleting}
				<SpinnerIcon />
			{:else}
				<DeleteIcon />
			{/if}
			Delete
		</button>
	</div>
{/if}
