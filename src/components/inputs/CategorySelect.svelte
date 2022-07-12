<script lang="ts">
	import AddIcon from '$components/icons/AddIcon.svelte';

	import trpc, { type InferQueryOutput } from '$lib/client/trpc';

	import type { SelectElements } from '$lib/model/PaymentTypes';

	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = true;
	export let value: number;
	export let error: string | void;

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
	<div class="input-group w-full max-w-xs">
		<select
			{id}
			class="select select-bordered w-1/2"
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
		<button class="btn btn-secondary gap-2 w-1/2"><AddIcon />Ny kategori</button>
	</div>
	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
