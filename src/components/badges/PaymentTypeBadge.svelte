<script lang="ts">
	import { getPaymentTypeString, PaymentTypes } from '$lib/model/PaymentTypes';
	export let paymentType: PaymentTypes;
</script>

{#if paymentType === PaymentTypes.NORMAL}
	<div class="badge badge-outline badge-info">{getPaymentTypeString(paymentType)}</div>
{:else if paymentType === PaymentTypes.CREDIT}
	<div class="badge badge-outline badge-warning">{getPaymentTypeString(paymentType)}</div>
{:else if paymentType === PaymentTypes.AUTO}
	<div class="badge badge-outline badge-success">{getPaymentTypeString(paymentType)}</div>
{:else}
	<div class="badge badge-outline">{getPaymentTypeString(paymentType)}</div>
{/if}
