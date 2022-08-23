<script lang="ts">
	import trpc from '$lib/client/trpc';

	import { differenceInCalendarMonths, format } from 'date-fns';
	import { sv } from 'date-fns/locale';
	import type { Errors, PageData } from './$types';
	import type { InferMutationInput, InferQueryInput, InferQueryOutput } from '$lib/client/trpc';
	import { expenseValueSorter, formatMonthDistance, formatSEK } from '$lib/utils';
	import AddIcon from '$components/icons/AddIcon.svelte';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { TRPCClientError } from '@trpc/client';
	import type { Router } from '$lib/server/trpc';
	import { goto } from '$app/navigation';
	import CategoryBadge from '$components/badges/CategoryBadge.svelte';
	import { months } from '$lib/stores/months';

	export let data: PageData;
	export let errors: Errors;

	type Month = InferMutationInput<'months:save'>;
	type Expenses = InferQueryOutput<'expenses:listAll'>;
	type ExpenseValue = InferQueryOutput<'expensevalues:getById'>;

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

	let monthsArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
	let year = [2022, 2023];

	$: selectableMonths = getSelectableMonths(month.year);

	const getSelectableMonths = (selectedYear: number) => {
		const existingMonths = $months;
		return monthsArray.filter(
			(monthIndex) =>
				existingMonths.find((exm) => exm.month === monthIndex && exm.year === selectedYear) ===
				undefined
		);
	};

	function capitalizeFirstLetter(string: string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	let monthNames = monthsArray.map((month) => {
		let objDate = new Date();
		objDate.setMonth(month);
		objDate.setDate(1);

		return capitalizeFirstLetter(format(objDate, 'LLLL', { locale: sv }));
	});

	let expenses: Expenses = data.expenses;

	const getSelectableExpenses = (expenses: Expenses, monthNumber: number, year: number) => {
		let newExpenses = expenses.map((expense) => {
			let distance = calculateLastMonth(expense.expenseValue, year, monthNumber);
			let selected = expense.repeatingMonths <= distance;
			let newExpense = { ...expense, selected, distance };
			return newExpense;
		});
		return newExpenses;
	};

	$: selectableExpenses = getSelectableExpenses(expenses, month.month, month.year);
	$: selectedExpenses = selectableExpenses.filter((exp) => exp.selected);

	const handleSave = async () => {
		try {
			month.expenses.connect = selectedExpenses.map((exp) => {
				return { id: exp.id };
			});

			let successMonth = month.month;
			let successYear = month.year;
			await trpc().mutation('months:save', month);
			newMonth();

			$months = await trpc(fetch).query('months:list');
			goto(`/months/${successYear}/${successMonth}`);
		} catch (err) {
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};

	const calculateLastMonth = (
		expenseValues: ExpenseValue[],
		year: number,
		month: number
	): number => {
		const currentDate = new Date(year, month, 1);
		if (expenseValues.length === 0) return 0;

		const sortedExpenseValues = expenseValues.sort(expenseValueSorter);
		const lastMonth = sortedExpenseValues[0]?.month;
		if (lastMonth === null || lastMonth === undefined) return 0;

		const lastDate = new Date(lastMonth.year, lastMonth.month, 1);

		return differenceInCalendarMonths(currentDate, lastDate);
	};
</script>

<div class="flex flex-col gap-4">
	<div class="flex gap-4">
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

		<div class="form-control w-full max-w-xs">
			<label class="label" for="monthSelector">
				<span class="label-text">Månad</span>
			</label>
			<select id="monthSelector" class="select select-bordered" bind:value={month.month}>
				<option disabled value={-1}>Välj månad</option>
				{#each selectableMonths as value, index}
					<option {value}>{monthNames[value]}</option>
				{/each}
			</select>
		</div>
	</div>

	{#if month.month > -1 && month.year > -1}
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
					<th>Senast använd</th>
					<th>Repetera</th>
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
						<td
							>{#if expense.distance === 1}Förra månaden{:else if expense.distance > 1}{expense.distance}
								månader sedan{:else}Aldrig.{/if}</td
						>
						<td>{formatMonthDistance(expense.repeatingMonths)}</td>
						<td><input type="checkbox" bind:checked={expense.selected} class="checkbox" /></td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
