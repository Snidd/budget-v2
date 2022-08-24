<script lang="ts">
	import { getContext } from 'svelte';

	import type { Session } from '@supabase/auth-helpers-svelte';
	import type { Writable } from 'svelte/store';

	const session = getContext<Writable<Session>>('session');

	import { goto, invalidate } from '$app/navigation';
	import { supabaseClient } from '$lib/supabase';
	import PasswordInput from '$components/inputs/PasswordInput.svelte';
	import TextInput from '$components/inputs/TextInput.svelte';

	let email: string;
	let password: string;

	let allErrors: string;

	async function signin() {
		let error, user, sbSession;
		try {
			if (!supabaseClient) throw new Error('supabaseClient is not defined');
			({
				error,
				user,
				session: sbSession
			} = await supabaseClient.auth.signIn({
				email,
				password
			}));
			if (error) throw error;
			$session = {
				user,
				accessToken: sbSession?.access_token
			};
		} catch (error) {
			// ... handle error
			allErrors = JSON.stringify(error);
		} finally {
			if (error) {
				// ... handle error
				allErrors = JSON.stringify(error);
			} else {
				// *** this is the key to avoid having to reload after login
				await invalidate();
				// *** ^^^^
				await goto('/expenses');
			}
		}
	}

	async function signup() {
		let error, user, sbSession;
		try {
			if (!supabaseClient) throw new Error('supabaseClient is not defined');
			({
				error,
				user,
				session: sbSession
			} = await supabaseClient.auth.signUp({
				email,
				password
			}));
			if (error) throw error;
			$session = {
				user,
				accessToken: sbSession?.access_token
			};
		} catch (error) {
			// ... handle error
			allErrors = JSON.stringify(error);
		} finally {
			if (error) {
				// ... handle error
				allErrors = JSON.stringify(error);
			} else {
				// *** this is the key to avoid having to reload after login
				await invalidate();
				// *** ^^^^
				await goto('/expenses');
			}
		}
	}
</script>

{#if $session?.user}
	<a class="btn btn-secondary" href="/api/auth/logout">Logout</a>
{:else}
	<div class="flex flex-col">
		<TextInput
			error={undefined}
			label="Email"
			placeholder="test@email.com"
			required={true}
			bind:value={email}
		/>
		<PasswordInput
			error={undefined}
			label="Password"
			placeholder="****"
			required={true}
			bind:value={password}
		/>
		<button class="btn btn-primary mt-4" on:click={signin}>Login</button>
		<button class="btn btn-secondary mt-4" on:click={signup}>Sign up</button>
	</div>
{/if}
