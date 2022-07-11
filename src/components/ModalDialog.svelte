<script lang="ts">
	import { browser } from '$app/env';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';

	export let title: string;
	export let visible: boolean;

	const dispatch = createEventDispatcher<{ save: never; close: never }>();

	const handleCancelClick = () => {
		dispatch('close');
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.code === 'Escape') dispatch('close');
	};

	$: {
		if (browser) {
			visible
				? window.addEventListener('keydown', handleKeyDown)
				: window.removeEventListener('keydown', handleKeyDown);
		}
	}
</script>

<dialog open={visible} on:click|self={handleCancelClick}>
	{#if visible}
		<article transition:fly={{ y: -200, duration: 100 }}>
			<header>
				<p>{title}</p>
			</header>
			<slot />
			<footer>
				<button class="btn btn-secondary gap-2" on:click|preventDefault={handleCancelClick}>
					Cancel
				</button>
				<button class="btn btn-secondary gap-2" on:click|preventDefault={() => dispatch('save')}>
					Save
				</button>
			</footer>
		</article>
	{/if}
</dialog>
