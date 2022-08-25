<script lang="ts">
	import Menu from '$components/Menu.svelte';
	import { navigating } from '$app/stores';
	import '../app.css';
	import SpinnerIcon from '$components/icons/SpinnerIcon.svelte';
	import type { Errors, LayoutData } from './$types';
	import trpc from '$lib/client/trpc';
	import { months } from '$lib/stores/months';

	import { supabaseClient } from '$lib/supabase';
	import { SupaAuthHelper, type Session } from '@supabase/auth-helpers-svelte';
	import { page } from '$app/stores';

	export let data: LayoutData;

	$: ({ currentUser } = data);

	$: signedIn.set(currentUser !== undefined);

	import { writable, type Writable } from 'svelte/store';
	import { getContext, setContext } from 'svelte';
	import { signedIn } from '$lib/stores/signedIn';

	setContext('session', writable<Session>($page.data.session));
	const session = getContext<Writable<Session>>('session');

	months.set(data.months);
</script>

<svelte:head>
	<title>Snickis Budget</title>
</svelte:head>

{#if supabaseClient}
	<SupaAuthHelper {supabaseClient} {session}>
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
	</SupaAuthHelper>
{/if}
