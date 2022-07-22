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
	import NumberInput from '$components/inputs/NumberInput.svelte';
	import DateInput from '$components/inputs/DateInput.svelte';
	import ExpenseCard from '$components/ExpenseCard.svelte';
	import CheckboxInput from '$components/inputs/CheckboxInput.svelte';

	type Expense = InferMutationInput<'expenses:save'>;
	type Category = InferMutationInput<'categories:save'>;

	let editorErrors: Record<string, string> | undefined;

	const newExpense = (): Expense => {
		editorErrors = undefined;
		return {
			id: null,
			categoryId: -1,
			paymentType: PaymentTypes.NORMAL,
			description: '',
			repeatingMonths: 0,
			defaultValue: undefined,
			duedate: undefined,
			isIncome: false
		};
	};

	const newCategory = (): Category => ({
		id: null,
		name: '',
		order: 0
	});

	export let expenses: InferQueryOutput<'expenses:list'> = [];

	let expense = newExpense();
	let category = newCategory();
	let expenseDialogVisible = false;
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
		if (category.name && category.name.length > 0) {
			const newCategory = await trpc().mutation('categories:save', category);
			expense.categoryId = newCategory.id;
		}

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

<div class="flex flex-wrap gap-2 mt-2">
	{#each expenses as expense}
		<ExpenseCard {expense} on:delete={() => reloadExpenses()} />
	{/each}
</div>

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
	<CategorySelect
		label="Kategori"
		bind:value={expense.categoryId}
		bind:newCategoryValue={category.name}
		error={editorErrors?.categoryId}
	/>
	<NumberInput
		label="Standardkostnad"
		bind:value={expense.defaultValue}
		placeholder="0"
		suffix="SEK"
		required={false}
		error={editorErrors?.defaultValue}
	/>
	<NumberInput
		label="Återkommande var X månad?"
		bind:value={expense.repeatingMonths}
		prefix="Var"
		suffix="månad"
		placeholder="0"
		required={false}
		error={editorErrors?.repeatingMonths}
	/>
	<DateInput
		label="Förfallodatum"
		placeholder=""
		required={false}
		bind:value={expense.duedate}
		error={editorErrors?.duedate}
	/>
	<CheckboxInput
		label="Är det en inkomst istället?"
		required={false}
		bind:checked={expense.isIncome}
		error={editorErrors?.isIncome}
	/>
</ModalDialog>
