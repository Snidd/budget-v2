<script context="module" lang="ts">
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import type { Router } from '$lib/server/trpc';
	import type { TRPCClientError } from '@trpc/client';
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
	import SelectInput from '$components/inputs/SelectInput.svelte';
	import { paymentTypeSelect } from '$lib/model/PaymentTypes';
	import CategorySelect from '$components/inputs/CategorySelect.svelte';

	type Expense = InferMutationInput<'expenses:save'>;

	let editorErrors: Record<string, string> | undefined;

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
	let loading = false;

	const reloadExpenses = async () => {
		loading = true;
		expenses = await trpc().query('expenses:list');
		loading = false;
	};

	const handleEditorClose = () => {
		expenseDialogVisible = false;
		expense = newExpense();
	};

	const handleEditorSave = async () => {
		//save expense
		try {
			await trpc().mutation('expenses:save', expense);
			expenseDialogVisible = false;
			expense = newExpense();
			reloadExpenses();
		} catch (err) {
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
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
	<SelectInput
		label="Betalningsmetod"
		required={true}
		values={paymentTypeSelect}
		bind:value={expense.paymentType}
		error={editorErrors?.paymentType}
	/>
	<CategorySelect label="Kategori" bind:value={expense.categoryId} />
</ModalDialog>
