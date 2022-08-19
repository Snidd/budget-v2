<script lang="ts">
	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let value: string | undefined;
	export let error: string | void;

	const id = `colorinput-${label}`.replaceAll(' ', '-');
</script>

<div class="form-control mt-4">
	<label class="label" for={id}>
		<span class="label-text">{label}<LabelAsterisk {required} /></span>
	</label>
	<input {id} type="color" {required} aria-invalid={error ? 'true' : undefined} bind:value />
	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
