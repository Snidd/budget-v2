<script lang="ts">
	import LabelAsterisk from './LabelAsterisk.svelte';

	export let label: string;
	export let required = false;
	export let placeholder = '';
	export let value: number | undefined;
	export let error: string | void;
	export let suffix = '';
	export let prefix = '';

	const id = `numberinput-${label}`.replaceAll(' ', '-');
</script>

<div class="form-control w-full max-w-xs">
	<label class="label" for={id}>
		<span class="label-text">{label}<LabelAsterisk {required} /></span>
	</label>
	<label class="input-group" for={id}>
		{#if prefix.length > 0}
			<span class="bg-base-200">{prefix}</span>
		{/if}
		<!-- svelte-ignore a11y-autofocus -->
		<input
			{id}
			class="input input-bordered"
			type="number"
			{placeholder}
			{required}
			aria-invalid={error ? 'true' : undefined}
			bind:value
		/>
		{#if suffix.length > 0}
			<span class="bg-base-200">{suffix}</span>
		{/if}
	</label>

	{#if error}
		<small class="text-error">{error}</small>
	{/if}
</div>
