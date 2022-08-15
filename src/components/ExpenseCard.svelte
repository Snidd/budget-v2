<script lang="ts">
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';
	import { createEventDispatcher } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import SpinnerIcon from './icons/SpinnerIcon.svelte';
	import { sv } from 'date-fns/locale';
	import { format, formatDistance } from 'date-fns';
	import { getPaymentTypeString } from '$lib/model/PaymentTypes';
	import PaymentTypeBadge from './badges/PaymentTypeBadge.svelte';

	const dispatch = createEventDispatcher<{ delete: never }>();

	export let expense: InferQueryOutput<'expenses:getById'>;

	let deleting = false;

	const deleteExpense = async () => {
		if (expense && expense.id) {
			try {
				deleting = true;
				await trpc().mutation('expenses:delete', expense.id);
				dispatch('delete');
				expense = null;
			} catch (err) {
				console.log(err);
			} finally {
				deleting = false;
			}
		}
	};

	const getRepeatingMonthText = (repeatingMonths: number): string => {
		if (repeatingMonths === null || repeatingMonths === 0) {
			return '';
		}
		if (repeatingMonths === 1) {
			return 'varje månad';
		}
		if (repeatingMonths === 2) {
			return 'varannan månad';
		}

		return `var ${repeatingMonths}:e månad`;
	};
</script>

{#if expense != null}
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-actions justify-between">
				<div class="badge badge-outline -ml-2">{expense.category.name}</div>
				<button
					class="btn btn-xs hover:opacity-80 btn-error gap-2 {deleting ? 'btn-disabled' : ''}"
					on:click={() => deleteExpense()}
				>
					{#if deleting}
						<SpinnerIcon />
					{:else}
						<DeleteIcon />
					{/if}
				</button>
			</div>
			<h2 class="card-title">{expense.description}</h2>
			<p>
				{expense.defaultValue != null
					? Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(
							Number(expense.defaultValue)
					  )
					: ''}
				{getRepeatingMonthText(expense.repeatingMonths)}
			</p>
			<div class="card-actions justify-end">
				{#if expense.duedate != null}<p>
						om {formatDistance(expense.duedate, new Date(), { locale: sv })}
					</p>{/if}
				<PaymentTypeBadge paymentType={expense.paymentType} />
			</div>
		</div>
	</div>
{/if}
