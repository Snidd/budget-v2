<script lang="ts">
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';
	import { createEventDispatcher } from 'svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import SpinnerIcon from './icons/SpinnerIcon.svelte';
	import sv from 'date-fns/locale/sv';
	import { format, formatDistance } from 'date-fns';
	import { getPaymentTypeString } from '$lib/model/PaymentTypes';
	import PaymentTypeBadge from './badges/PaymentTypeBadge.svelte';
	import { formatMonthDistance, formatSEK } from '$lib/utils';
	import CategoryBadge from './badges/CategoryBadge.svelte';
	import EditIcon from './icons/EditIcon.svelte';

	type Expense = InferQueryOutput<'expenses:getById'>;

	const dispatch = createEventDispatcher<{
		delete: never;
		edit: {
			expense: Expense;
		};
	}>();

	export let expense: Expense;

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
</script>

{#if expense != null}
	<div class="card w-96 bg-base-100 shadow-xl">
		<div class="card-body">
			<div class="card-actions justify-between">
				<CategoryBadge category={expense.category} />
				<div class="flex gap-2">
					<button
						class="btn btn-xs hover:opacity-80 btn-accent"
						on:click={() => dispatch('edit', { expense: expense })}
					>
						<EditIcon />
					</button>
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
			</div>
			<h2 class="card-title">{expense.description}</h2>
			<p>
				{formatSEK(Number(expense.defaultValue))}
				{formatMonthDistance(expense.repeatingMonths)}
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
