<script lang="ts">
	export let loading: boolean;
	export let errors: unknown;
</script>

<div class="w-full h-full">
	{#if errors}
		<p class="bg-red-500 text-white">Errors: {String(errors)}</p>
	{/if}
	{#if loading}
		<div
			class="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-black/40"
		>
			<p>Loading...</p>
		</div>
	{/if}
	<slot />
</div>
