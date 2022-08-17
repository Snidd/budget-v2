<script lang="ts">
	import Menu from '$components/Menu.svelte';
	import { navigating } from '$app/stores';
	import '../app.css';
	import SpinnerIcon from '$components/icons/SpinnerIcon.svelte';
	import type { Errors, LayoutData } from './$types';
	import trpc from '$lib/client/trpc';
	import { months } from '$lib/stores/months';

	export let data: LayoutData;

	months.set(data.months);
</script>

<svelte:head>
	<title>Snickis Budget</title>
</svelte:head>

<div class="flex">
	<div class="p-2 py-10">
		<Menu months={$months} />
	</div>
	<div class="py-10">
		{#if $navigating}
			<div class="absolute left-36 top-4"><SpinnerIcon /></div>
		{/if}
		<slot />
	</div>
</div>
