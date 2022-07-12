<script lang="ts">
	import trpc, { type InferQueryOutput } from '$lib/client/trpc';

	import type { SelectElements } from '$lib/model/PaymentTypes';

	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = true;
	export let value: number;

	let error: string | void;

	export let categories: InferQueryOutput<'categories:list'> = [];

	let loading = true;

	const reloadCategories = async () => {
		loading = true;
		categories = await trpc().query('categories:list');
		loading = false;
	};

	reloadCategories();

	const id = `categoryinput-${label}`.replaceAll(' ', '-');
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
		<option disabled selected value={-1}>Välj kategori...</option>
		{#if !loading}
			{#each categories as category}
				<option value={category.id}>{category.name}</option>
			{/each}
		{/if}
	</select>
	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
