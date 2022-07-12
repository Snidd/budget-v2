<script lang="ts">
	import type { SelectElements } from '$lib/model/PaymentTypes';

	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let value: string | number;
	export let values: SelectElements[];
	export let error: string | void;

	const id = `selectinput-${label}`.replaceAll(' ', '-');
</script>

<div class="form-control w-full max-w-xs">
	<label class="label" for={id}>
		<span class="label-text">{label}<LabelAsterisk {required} /></span>
	</label>
	<select
		{id}
		class="select select-bordered"
		{required}
		aria-invalid={error ? 'true' : undefined}
		bind:value
	>
		<option disabled selected value={-1}>Välj en...</option>
		{#if values}
			{#each values as value}
				<option value={value.value}>{value.name}</option>
			{/each}
		{/if}
	</select>
	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
