<script lang="ts">
	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let placeholder = '';
	export let value: Date | undefined;
	export let error: string | void;

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
