<script lang="ts">
	import CategoryBadge from '$components/badges/CategoryBadge.svelte';
	import SpinnerIcon from '$components/icons/SpinnerIcon.svelte';
	import trpc, { type InferMutationInput } from '$lib/client/trpc';
	import { formatMonth, formatSEK } from '$lib/utils';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { Router } from '$lib/server/trpc';
	import type { TRPCClientError } from '@trpc/client';
	import type { Errors, PageData } from './$types';
	import ExpenseValueDisplay from './ExpenseValueDisplay.svelte';
	import ErrorDisplay from '$components/ErrorDisplay.svelte';
	import AddIcon from '$components/icons/AddIcon.svelte';
	import ModalDialog from '$components/ModalDialog.svelte';
	import TextInput from '$components/inputs/TextInput.svelte';
	import {
		incomePaymentTypeSelect,
		onetimePaymentTypeSelect,
		PaymentTypes,
		paymentTypeSelect
	} from '$lib/model/PaymentTypes';
	import NumberInput from '$components/inputs/NumberInput.svelte';
	import CategorySelect from '$components/inputs/CategorySelect.svelte';
	import EditIcon from '$components/icons/EditIcon.svelte';
	import MonthSummary from './MonthSummary.svelte';
	import PaymentTypeSummary from './PaymentTypeSummary.svelte';
	import SelectInput from '$components/inputs/SelectInput.svelte';
	import { invalidate } from '$app/navigation';

	type Expense = InferMutationInput<'incomes:save'>;
	type ExpenseValue = InferMutationInput<'expensevalues:create'>;
	type Category = InferMutationInput<'categories:save'>;

	export let data: PageData;

	$: ({ month, expenses } = data);

	let editorErrors: Record<string, string> | undefined;
	let loading = false;

	const fillStandard = async () => {
		try {
			loading = true;
			if (month && month.id) {
				await trpc().mutation('months:createdefaultvalues', month?.id);
				await reloadExpenses();
			}
			loading = false;
		} catch (err) {
			loading = false;
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};

	const reloadExpenses = async () => {
		expenses = await trpc().query('expenses:listByMonth', {
			month: month.month,
			year: month.year
		});
	};

	let showAddDialog = false;

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
			isIncome: false,
			active: false
		};
	};

	const newCategory = (): Category => ({
		id: null,
		name: '',
		order: 0,
		isIncome: true,
		color: '#fff'
	});

	let expense = newExpense();
	let category = newCategory();

	const handleCloseDialog = () => {
		showAddDialog = false;
		expense = newExpense();
	};

	const handleSaveDialog = async () => {
		try {
			if (month?.id === undefined) return;

			const result = await trpc().mutation('months:addexpense', {
				categoryId: expense.categoryId,
				description: expense.description,
				monthId: month.id,
				paymentType: expense.paymentType,
				value: expense.defaultValue !== undefined ? Number(expense.defaultValue) : undefined
			});
			expense = newExpense();
			showAddDialog = false;
			reloadExpenses();
		} catch (err) {
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};
</script>

{#if month}
	<div class="flex content-start gap-4">
		<h1 class="font-bold text-xl mb-4">{formatMonth(month.year, month.month)}</h1>
		<button class="btn btn-primary btn-sm gap-2" disabled={loading} on:click={() => fillStandard()}
			><EditIcon /> Fyll i med standardvärden {#if loading}<SpinnerIcon />{/if}</button
		>
		<button class="btn-accent btn btn-sm gap-2" on:click={() => (showAddDialog = true)}
			><AddIcon /> Lägg till engångspost</button
		>
		<ErrorDisplay {editorErrors} fields={'id'} />
	</div>

	<table class="table w-full">
		<!-- head -->
		<thead>
			<tr>
				<th />
				<th>Beskrivning</th>
				<th>Kategori</th>
				<th>Standard</th>
				<th>Tidigare</th>
				<th>Nytt värde</th>
				<th>Kommentar</th>
			</tr>
		</thead>
		<tbody>
			{#each expenses as expense}
				<tr class="">
					<th />
					<td class="align-top pt-8">{expense.description}</td>
					<td class="align-top pt-8"><CategoryBadge category={expense.category} /></td>
					<td class="align-top pt-8">
						{#if expense.defaultValue !== null}
							<span>{expense.isIncome ? '+' : '-'}</span>
							<span>{formatSEK(expense.defaultValue)}</span>
						{/if}
					</td>
					{#key month}
						<ExpenseValueDisplay
							on:update={reloadExpenses}
							currentExpenseId={expense.id}
							currentMonth={month}
							defaultValue={String(expense.defaultValue)}
							expenseValues={expense.expenseValue}
							isIncome={expense.isIncome}
						/>
					{/key}
				</tr>
			{/each}
		</tbody>
	</table>

	<MonthSummary {expenses} monthId={month.id} />

	<ModalDialog
		on:save={() => handleSaveDialog()}
		on:close={() => handleCloseDialog()}
		title="Lägg till post"
		visible={showAddDialog}
	>
		<TextInput
			label="Beskrivning"
			required={true}
			placeholder="Beskriv posten"
			bind:value={expense.description}
			error={editorErrors?.description}
		/>
		<NumberInput
			label="Värde (använd minus om det är en utgift)"
			bind:value={expense.defaultValue}
			placeholder="-200"
			suffix="SEK"
			required={false}
			error={editorErrors?.defaultValue}
		/>
		<SelectInput
			label="Betalningsmetod"
			required={true}
			values={onetimePaymentTypeSelect}
			bind:value={expense.paymentType}
			error={editorErrors?.paymentType}
		/>
		<CategorySelect
			label="Kategori"
			bind:value={expense.categoryId}
			bind:newCategoryValue={category.name}
			createCategory={false}
			isIncome={null}
			error={editorErrors?.categoryId}
		/>
	</ModalDialog>
{/if}
