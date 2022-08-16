<script lang="ts">
	import trpc from '$lib/client/trpc';

	import { format } from 'date-fns';
	import { sv } from 'date-fns/locale';
	import type { Errors, PageData } from './$types';
	import type { InferMutationInput, InferQueryInput, InferQueryOutput } from '$lib/client/trpc';
	import { formatSEK } from '$lib/utils';

	export let data: PageData;
	export let errors: Errors;

	console.log(`data expenses is array: ${Array.isArray(data.expenses)}`);

	let selectedMonth = -1;
	let selectedYear = -1;

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

	$: shouldLoadTable = selectedMonth > -1 && selectedYear > -1;

	type Expenses = InferQueryOutput<'incomes:list'>;

	let expenses: Expenses = data.expenses;

	const reloadExpenseData = async () => {
		const expensesResult = await trpc().query('expenses:list', 'category');
		expenses = expensesResult;
	};

	$: selectableExpenses = expenses.map((expense) => {
		let newExpense = { ...expense, selected: true };
		return newExpense;
	});

	//$: shouldLoadTable === true ? loadExpenseData() : false;
</script>

<div class="flex gap-4">
	<div class="form-control w-full max-w-xs">
		<label class="label" for="monthSelector">
			<span class="label-text">Månad</span>
		</label>
		<select id="monthSelector" class="select select-bordered" bind:value={selectedMonth}>
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
		<select id="yearSelector" class="select select-bordered" bind:value={selectedYear}>
			<option disabled value={-1}>Välj år</option>
			{#each year as value, index}
				<option {value}>{value}</option>
			{/each}
		</select>
	</div>
</div>

{#if shouldLoadTable}
	<table class="table w-full mt-4">
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
					<td>{expense.description} {expense.selected}</td>
					<td><div class="badge badge-outline">{expense.category.name}</div></td>
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
