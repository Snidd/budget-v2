<script lang="ts">
	import type { InferQueryOutput } from '$lib/client/trpc';
	import { PaymentTypes } from '$lib/model/PaymentTypes';
	import { formatSEK } from '$lib/utils';
	import Decimal from 'decimal.js';

	type Expenses = InferQueryOutput<'expenses:listByMonth'>;

	export let expenses: Expenses;
	export let monthId: number;
	export let lastFiveMonths: InferQueryOutput<'months:list'>;

	const getPaymentTypeSum = (expensesList: Expenses, monthId: number, paymentType: number) => {
		let values = expensesList
			.filter((exp) => exp.paymentType === paymentType)
			.map((exp) => exp.expenseValue)
			.flat()
			.filter((ev) => ev.monthId === monthId);

		let paymentTypeWithValues = { paymentType, ev: values };

		const sum = paymentTypeWithValues.ev.reduce((prev, cur) => {
			if (cur.value !== null) {
				return prev.plus(new Decimal(cur.value.toString()));
			}
			return prev;
		}, new Decimal(0));

		let paymentTypeWithSum = { ...paymentTypeWithValues, sum: sum };
		return paymentTypeWithSum;
	};

	$: creditSum = getPaymentTypeSum(expenses, monthId, PaymentTypes.CREDIT).sum;
	$: klarnaSum = getPaymentTypeSum(expenses, monthId, PaymentTypes.KLARNA).sum;
</script>

{#if creditSum && creditSum.greaterThan(0)}
	<tr>
		<td class="bg-orange-200">remember</td>
		{#each lastFiveMonths as month}
			<td class="bg-orange-200"
				>{formatSEK(getPaymentTypeSum(expenses, month.id, PaymentTypes.CREDIT).sum)}</td
			>
		{/each}
		<td class="bg-orange-200"
			>{formatSEK(getPaymentTypeSum(expenses, monthId, PaymentTypes.CREDIT).sum)}</td
		>
	</tr>
{/if}
{#if klarnaSum && klarnaSum.greaterThan(0)}
	<tr>
		<td class="bg-blue-200">Klarna</td>
		{#each lastFiveMonths as month}
			<td class="bg-blue-200"
				>{formatSEK(getPaymentTypeSum(expenses, month.id, PaymentTypes.KLARNA).sum)}</td
			>
		{/each}
		<td class="bg-blue-200"
			>{formatSEK(getPaymentTypeSum(expenses, monthId, PaymentTypes.KLARNA).sum)}</td
		>
	</tr>
{/if}
