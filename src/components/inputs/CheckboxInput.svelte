<script lang="ts">
	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let checked: boolean | undefined;
	export let error: string | void;

	const id = `checkbox-${label}`.replaceAll(' ', '-');
</script>

<div class="form-control mt-4">
	<label class="label" for={id}>
		<span class="label-text">{label}<LabelAsterisk {required} /></span>
	</label>
	<!-- svelte-ignore a11y-autofocus -->
	<input
		{id}
		class="checkbox"
		type="checkbox"
		{required}
		aria-invalid={error ? 'true' : undefined}
		bind:checked
	/>
	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
