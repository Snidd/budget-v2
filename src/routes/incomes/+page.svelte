<script lang="ts">
	import { browser } from '$app/env';
	import { goto } from '$app/navigation';
	import ExpenseCard from '$components/ExpenseCard.svelte';
	import ExpenseGroup from '$components/ExpenseGroup.svelte';
	import AddIcon from '$components/icons/AddIcon.svelte';
	import CategorySelect from '$components/inputs/CategorySelect.svelte';
	import DateInput from '$components/inputs/DateInput.svelte';
	import NumberInput from '$components/inputs/NumberInput.svelte';
	import SelectInput from '$components/inputs/SelectInput.svelte';
	import TextInput from '$components/inputs/TextInput.svelte';
	import LoadingWithErrors from '$components/LoadingWithErrors.svelte';
	import ModalDialog from '$components/ModalDialog.svelte';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { InferMutationInput, InferQueryInput, InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';
	import { PaymentTypes, paymentTypeSelect } from '$lib/model/PaymentTypes';
	import type { Router } from '$lib/server/trpc';
	import type { TRPCClientError } from '@trpc/client';
	import type { Errors, PageData } from './$types';

	type Expense = InferMutationInput<'incomes:save'>;
	type Category = InferMutationInput<'categories:save'>;
	type ExpenseInput = InferQueryInput<'incomes:list'>;

	export let data: PageData;
	export let errors: Errors;

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
			isIncome: true
		};
	};

	const newCategory = (): Category => ({
		id: null,
		name: '',
		order: 0,
		isIncome: true
	});

	$: expenses = data.expenses;
	$: orderBy = data.orderBy as ExpenseInput;

	let expense = newExpense();
	let category = newCategory();
	let expenseDialogVisible = false;
	let loading = false;

	const reloadExpenses = async () => {
		loading = true;
		expenses = await trpc().query('incomes:list', orderBy as ExpenseInput);
		loading = false;
	};

	const handleEditorClose = () => {
		expenseDialogVisible = false;
		expense = newExpense();
	};

	const handleEditorSave = async () => {
		if (category.name && category.name.length > 0) {
			try {
				const newCategoryResult = await trpc().mutation('categories:save', category);
				expense.categoryId = newCategoryResult.id;
				category = newCategory();
			} catch (err) {
				editorErrors = getEditorErrors(err as TRPCClientError<Router>);
				return;
			}
		}

		//save expense
		try {
			await trpc().mutation('incomes:save', expense);
			expenseDialogVisible = false;
			expense = newExpense();
			reloadExpenses();
		} catch (err) {
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};

	const orderByValues = [
		{
			name: 'Kategori',
			value: 'category'
		},
		{
			name: 'Betalningstyp',
			value: 'paymentType'
		}
	];

	let selectedOrder: ExpenseInput = orderBy as ExpenseInput;

	const changeOrderUrl = (orderKey: string) => {
		if (browser) {
			goto(`?orderBy=${orderKey}`);
		}
	};

	$: changeOrderUrl(selectedOrder);
</script>

<LoadingWithErrors {loading} {errors}>
	<div class="w-full pr-10 flex items-end gap-4 justify-between">
		<div class="form-control w-full max-w-xs">
			<label class="label" for="orderBySelector">
				<span class="label-text">Sortera efter</span>
			</label>
			<select id="orderBySelector" class="select select-bordered" bind:value={selectedOrder}>
				{#each orderByValues as value, index}
					<option value={value.value}>{value.name}</option>
				{/each}
			</select>
		</div>
		<button class="btn btn-primary gap-2" on:click={() => (expenseDialogVisible = true)}>
			<AddIcon /> Lägg till inkomst</button
		>
	</div>

	<ExpenseGroup groupBy={selectedOrder} {expenses} let:expense>
		<ExpenseCard {expense} on:delete={() => reloadExpenses()} />
	</ExpenseGroup>
</LoadingWithErrors>
<ModalDialog
	title="Lägg till inkomst"
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
		createCategory={false}
		isIncome={true}
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
</ModalDialog>
