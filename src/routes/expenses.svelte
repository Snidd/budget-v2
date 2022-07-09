<script context="module" lang="ts">
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';
	import { PaymentTypes } from '$lib/model/PaymentTypes';
	import type { Load } from '@sveltejs/kit';
	import { formatDistanceToNow } from 'date-fns';

	export const load: Load = async ({ fetch }) => {
		const expenses = await trpc(fetch).query('expenses:list');
		return { props: { expenses: expenses } };
	};
</script>

<script lang="ts">
	import ModalDialog from '$components/ModalDialog.svelte';

	type Expense = InferMutationInput<'expenses:save'>;
	type EditorErrors = {
		description?: string;
	} | void;

	const newExpense = (): Expense => ({
		id: '',
		categoryId: '',
		paymentType: PaymentTypes.NORMAL,
		description: ''
	});

	export let expenses: InferQueryOutput<'expenses:list'> = [];

	let expense = newExpense();
</script>

<button class="btn btn-primary gap-2">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-plus-circle"
		viewBox="0 0 16 16"
	>
		<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
		<path
			d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"
		/>
	</svg> Lägg till utgift</button
>

<!-- promise was fulfilled -->
{#each expenses as expense}
	<p>{expense.description}</p>
{/each}
<!-- promise was fulfilled -->

<ModalDialog title="Lägg till utgift">
	<input bind:value={expense.description} />
</ModalDialog>
