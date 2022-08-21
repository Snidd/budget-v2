<script lang="ts">
	import AddIcon from '$components/icons/AddIcon.svelte';

	import trpc, { type InferQueryOutput } from '$lib/client/trpc';

	import type { SelectElements } from '$lib/model/PaymentTypes';
	import { onMount, tick } from 'svelte';

	import LabelAsterisk from './LabelAsterisk.svelte';
	import TextInput from './TextInput.svelte';

	export let label: string;
	export let required = true;
	export let value: number;
	export let newCategoryValue: string;
	export let error: string | void;
	export let isIncome: boolean | null = false;
	export let createCategory: boolean;
	export let categories: InferQueryOutput<'categories:list'> = [];

	let loading = true;

	const reloadCategories = async () => {
		let existingCategoryId = value;
		loading = true;
		if (isIncome === null) {
			categories = await trpc().query('categories:listAll');
		} else {
			categories = await trpc().query('categories:list', isIncome);
		}
		await tick();
		console.log(existingCategoryId);
		value = existingCategoryId;
		loading = false;
	};

	let addCategory = createCategory;

	onMount(() => reloadCategories());

	const id = `categoryinput-${label}`.replaceAll(' ', '-');
</script>

{#if !addCategory}
	<div class="form-control w-full max-w-xs">
		<label class="label" for={id}>
			<span class="label-text">{label}<LabelAsterisk {required} /></span>
		</label>
		<div class="input-group w-full max-w-xs">
			<select
				{id}
				class="select select-bordered w-60"
				{required}
				aria-invalid={error ? 'true' : undefined}
				bind:value
			>
				{#if value === -1}
					<option disabled selected value={-1}>Välj kategori...</option>
				{/if}
				{#if !loading}
					{#each categories as category}
						<option selected={value === category.id} value={category.id}>{category.name}</option>
					{/each}
				{/if}
			</select>
			{#if isIncome !== null}
				<button class="btn btn-secondary gap-2" on:click={() => (addCategory = true)}
					><AddIcon /></button
				>{/if}
		</div>
		{#if error}
			<small class="text-error">{error}</small>
		{/if}
	</div>
{:else}
	<TextInput
		{label}
		required={true}
		placeholder={'Kategorinamn'}
		bind:value={newCategoryValue}
		error={undefined}
	/>
{/if}
