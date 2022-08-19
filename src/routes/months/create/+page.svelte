<script lang="ts">
	import trpc from '$lib/client/trpc';

	import { format } from 'date-fns';
	import { sv } from 'date-fns/locale';
	import type { Errors, PageData } from './$types';
	import type { InferMutationInput, InferQueryInput, InferQueryOutput } from '$lib/client/trpc';
	import { formatSEK } from '$lib/utils';
	import AddIcon from '$components/icons/AddIcon.svelte';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { TRPCClientError } from '@trpc/client';
	import type { Router } from '$lib/server/trpc';
	import { goto } from '$app/navigation';
	import CategoryBadge from '$components/badges/CategoryBadge.svelte';

	export let data: PageData;
	export let errors: Errors;

	type Month = InferMutationInput<'months:save'>;
	type Expenses = InferQueryOutput<'incomes:list'>;

	const newMonth = (): Month => {
		return {
			id: null,
			comment: '',
			month: -1,
			year: -1,
			expenses: { connect: [] }
		};
	};

	let month = newMonth();

	let editorErrors: Record<string, string> | undefined;

	let months = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	let year = [2022, 2023];

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	let monthNames = months.map((month) => {
		let objDate = new Date();
		objDate.setMonth(month);
		objDate.setDate(1);

		return capitalizeFirstLetter(format(objDate, 'LLLL', { locale: sv }));
	});

	$: shouldLoadTable = month.month > -1 && month.year > -1;

	let expenses: Expenses = data.expenses;

	const reloadExpenseData = async () => {
		const expensesResult = await trpc().query('expenses:list', 'category');
		expenses = expensesResult;
	};

	$: selectableExpenses = expenses.map((expense) => {
		let newExpense = { ...expense, selected: true };
		return newExpense;
	});

	$: month.expenses.connect = selectableExpenses
		.filter((exp) => exp.selected)
		.map((exp) => {
			return { id: exp.id };
		});

	const handleSave = async () => {
		try {
			let successMonth = month.month;
			let successYear = month.year;
			await trpc().mutation('months:save', month);
			month = newMonth();
			//TODO: reloadMonths here
			goto(`/months/${successYear}/${successMonth}`);
		} catch (err) {
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-4">
		<div class="form-control w-full max-w-xs">
			<label class="label" for="monthSelector">
				<span class="label-text">Månad</span>
			</label>
			<select id="monthSelector" class="select select-bordered" bind:value={month.month}>
				<option disabled value={-1}>Välj månad</option>
				{#each months as value, index}
					<option {value}>{monthNames[index]}</option>
				{/each}
			</select>
		</div>

		<div class="form-control w-full max-w-xs">
			<label class="label" for="yearSelector">
				<span class="label-text">År</span>
			</label>
			<select id="yearSelector" class="select select-bordered" bind:value={month.year}>
				<option disabled value={-1}>Välj år</option>
				{#each year as value, index}
					<option {value}>{value}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if shouldLoadTable}
		<button class="btn btn-primary w-56 gap-2" on:click={() => handleSave()}
			><AddIcon /> Öppna ny månad</button
		>
		<table class="table w-full">
			<!-- head -->
			<thead>
				<tr>
					<th />
					<th>Beskrivning</th>
					<th>Kategori</th>
					<th>Standard</th>
					<th>Senast</th>
					<th>Inkludera?</th>
				</tr>
			</thead>
			<tbody>
				{#each selectableExpenses as expense}
					<tr
						class="hover cursor-pointer {expense.selected ? 'opacity-100' : 'opacity-50'}"
						on:click={() => (expense.selected = !expense.selected)}
					>
						<th />
						<td>{expense.description}</td>
						<td><CategoryBadge category={expense.category} /></td>
						<td>
							{#if expense.defaultValue !== null}
								<span>{expense.isIncome ? '+' : '-'}</span>
								<span>{formatSEK(expense.defaultValue)}</span>
							{/if}
						</td>
						<td />
						<td><input type="checkbox" bind:checked={expense.selected} class="checkbox" /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
