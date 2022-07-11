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

{#if visible}
	<div class="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-black/40">
		<dialog
			transition:fly={{ y: -200, duration: 100 }}
			class="bg-base-300 rounded-md p-6 w-96 drop-shadow-lg z-10"
			open={visible}
			on:click|self={handleCancelClick}
		>
			<article>
				<header class="italic drop-shadow-sm">
					<p>{title}</p>
				</header>
				<slot />
				<footer class="mt-4">
					<button class="btn btn-secondary gap-2" on:click|preventDefault={handleCancelClick}>
						Avbryt
					</button>
					<button class="btn btn-primary gap-2" on:click|preventDefault={() => dispatch('save')}>
						Spara
					</button>
				</footer>
			</article>
		</dialog>
	</div>
{/if}
