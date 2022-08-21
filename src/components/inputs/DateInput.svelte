<script lang="ts">
	import { format } from 'date-fns';

	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let placeholder = '';
	export let date: Date | null | undefined;

	let value: string;

	export let error: string | void;

	const input = (x: Date | undefined | null) => {
		if (x === undefined || x === null) return;
		value = format(x !== undefined ? x : new Date(), 'yyyy-MM-dd');
	};

	const output = (x: string) => {
		if (x === '' || x === undefined) {
			date = null;
			return;
		}
		date = new Date(x);
	};

	$: input(date);
	$: output(value);

	const id = `dateinput-${label}`.replaceAll(' ', '-');
</script>

<div class="form-control w-full max-w-xs">
	<label class="label" for={id}>
		<span class="label-text">{label}<LabelAsterisk {required} /></span>
	</label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		{id}
		class="input input-bordered w-full max-w-xs"
		type="date"
		{placeholder}
		{required}
		aria-invalid={error ? 'true' : undefined}
		bind:value
	/>
	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
