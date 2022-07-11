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
	import AddIcon from '$components/icons/AddIcon.svelte';

	type Expense = InferMutationInput<'expenses:save'>;
	type EditorErrors = {
		description?: string;
	} | void;

	const newExpense = (): Expense => ({
		id: '',
		categoryId: '',
		paymentType: PaymentTypes.NORMAL,
		description: '',
		defaultValue: undefined,
		duedate: undefined
	});

	export let expenses: InferQueryOutput<'expenses:list'> = [];

	let expense = newExpense();
</script>

<button class="btn btn-primary gap-2"> <AddIcon /> Lägg till utgift</button>

<!-- promise was fulfilled -->
{#each expenses as expense}
	<p>{expense.description}</p>
{/each}
<!-- promise was fulfilled -->

<ModalDialog title="Lägg till utgift" visible={true}>
	<input bind:value={expense.description} />
</ModalDialog>
