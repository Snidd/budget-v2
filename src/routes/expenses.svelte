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
	import TextInput from '$components/inputs/TextInput.svelte';

	type Expense = InferMutationInput<'expenses:save'>;
	type EditorErrors = {
		description?: string;
	} | void;

	let editorErrors: EditorErrors = {
		description: 'Required!'
	};

	const newExpense = (): Expense => ({
		id: null,
		categoryId: -1,
		paymentType: PaymentTypes.NORMAL,
		description: '',
		repeatingMonths: 0,
		defaultValue: undefined,
		duedate: undefined
	});

	export let expenses: InferQueryOutput<'expenses:list'> = [];

	let expense = newExpense();

	let expenseDialogVisible = true;

	const handleEditorClose = () => {
		expenseDialogVisible = false;
	};

	const handleEditorSave = () => {
		expenseDialogVisible = false;
	};
</script>

<button class="btn btn-primary gap-2" on:click={() => (expenseDialogVisible = true)}>
	<AddIcon /> Lägg till utgift</button
>

<!-- promise was fulfilled -->
{#each expenses as expense}
	<p>{expense.description}</p>
{/each}
<!-- promise was fulfilled -->

<ModalDialog
	title="Lägg till utgift"
	visible={expenseDialogVisible}
	on:close={handleEditorClose}
	on:save={handleEditorSave}
>
	<TextInput
		label="Beskrivning"
		required={true}
		placeholder="Beskriv utgiften"
		bind:value={expense.description}
		error={editorErrors?.description}
	/>
</ModalDialog>
