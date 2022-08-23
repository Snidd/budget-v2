<script lang="ts">
	import SpinnerIcon from '$components/icons/SpinnerIcon.svelte';
	import type { InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';
	import { expenseValueSorter, formatMonth, formatSEK } from '$lib/utils';
	import { debounce } from '$lib/utils/debounce';
	import type { Expense, Month } from '@prisma/client';
	import { compareDesc } from 'date-fns';
	import compareAsc from 'date-fns/compareAsc';
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import ExpenseValueTable from './ExpenseValueTable.svelte';
	import { fade } from 'svelte/transition';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { TRPCClientError } from '@trpc/client';
	import type { Router } from '$lib/server/trpc';
	import ErrorDisplay from '$components/ErrorDisplay.svelte';

	type ExpenseValue = InferQueryOutput<'expensevalues:getById'>;

	export let defaultValue: string;
	export let expenseValues: ExpenseValue[];
	export let currentMonth: Month;
	export let currentExpenseId: number;
	export let isIncome: boolean;

	const dispatch = createEventDispatcher<{ update: never }>();

	let editorErrors: Record<string, string> | undefined;

	const evFilter = (ev: ExpenseValue) => {
		if (ev?.monthId === currentMonth.id) return false;

		const month1 = ev?.month;

		if (month1 === undefined || month1 === null) return false;

		const date1 = new Date(month1.year, month1.month, 1);
		const date2 = new Date(currentMonth.year, currentMonth.month, 1);

		if (compareAsc(date1, date2) > -1) return false;

		return true;
	};

	$: current = expenseValues.find((ev) => ev?.monthId === currentMonth.id);
	$: sorted = expenseValues.slice().filter(evFilter).sort(expenseValueSorter);

	const filter = (incoming: unknown): string => {
		if (incoming === undefined || incoming === null) return '';
		return String(incoming);
	};

	let currentValue = filter(current?.value);
	let currentComment = filter(current?.comment);

	let isSaving = false;
	let saveSuccessful = false;

	onMount(() => {
		currentValue = filter(current?.value);
		currentComment = filter(current?.comment);
	});

	const createExpenseValue = async () => {
		let response = await trpc().mutation('expensevalues:create', {
			value: currentValue.length > 0 ? currentValue : undefined,
			comment: currentComment,
			expense: {
				connect: {
					id: currentExpenseId
				}
			},
			month: {
				connect: {
					id: currentMonth.id
				}
			}
		});
		if (Array.isArray(expenseValues)) {
			expenseValues.push(response);
		} else {
			expenseValues = [response];
		}
	};

	const saveExpenseValue = async (id: number) => {
		await trpc().mutation('expensevalues:save', {
			id: id,
			value: currentValue,
			comment: currentComment
		});
	};

	const saveOrUpdateExpenseValue = async () => {
		editorErrors = undefined;
		isSaving = true;
		await tick();
		try {
			if (current === null || current === undefined) {
				await createExpenseValue();
			} else {
				let id = current.id;
				await saveExpenseValue(id);
			}
			isSaving = false;
			saveSuccessful = true;
			dispatch('update');
			debouncedDone();
		} catch (err) {
			isSaving = false;
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};

	const doneSaving = () => {
		saveSuccessful = false;
	};

	const debouncedDone = debounce(() => doneSaving(), 1500);
	const debouncedSaveOrUpdate = debounce(() => saveOrUpdateExpenseValue(), 500);
</script>

<td><ExpenseValueTable {isIncome} expenseValues={sorted} /> </td>
<td class="align-top"
	><input
		type="text"
		placeholder={defaultValue === null ? '' : defaultValue}
		class="input input-bordered w-full max-w-xs"
		on:input={() => debouncedSaveOrUpdate()}
		bind:value={currentValue}
	/>
</td>
<td class="align-top"
	><input
		type="text"
		placeholder=""
		class="input input-bordered w-full max-w-xs"
		on:input={() => debouncedSaveOrUpdate()}
		bind:value={currentComment}
	/>
</td>
<td class="w-32"
	>{#if isSaving}
		<p class="text-info flex gap-2" transition:fade>Saving <SpinnerIcon /></p>
	{:else if saveSuccessful}
		<p class="text-success" transition:fade>Saved.</p>
	{/if}
	<ErrorDisplay {editorErrors} fields={['value', 'comment']} />
</td>
