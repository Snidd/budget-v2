<script lang="ts">
	import type { Session } from '@supabase/auth-helpers-svelte';
	import type { Writable } from 'svelte/store';

	const session = getContext<Writable<Session>>('session');
	import { signedIn } from '$lib/stores/signedIn';
	import { getContext } from 'svelte';
</script>

{#if $session?.user || $signedIn}
	Välkommen!
{:else}
	<a href="/login" class="btn btn-primary">Logga in för att fortsätta</a>
{/if}
