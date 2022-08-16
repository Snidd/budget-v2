<script>
	import Menu from '$components/Menu.svelte';
	import { navigating } from '$app/stores';
	import '../app.css';
	import SpinnerIcon from '$components/icons/SpinnerIcon.svelte';
</script>

<svelte:head>
	<title>Snickis Budget</title>
</svelte:head>

<div class="flex">
	<div class="p-2 py-10">
		<Menu />
	</div>
	<div class="py-10">
		{#if $navigating}
			<div class="absolute left-36 top-4"><SpinnerIcon /></div>
		{/if}
		<slot />
	</div>
</div>
