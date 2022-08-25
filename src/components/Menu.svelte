<script lang="ts">
	import type { InferQueryOutput } from '$lib/client/trpc';
	import { formatMonth } from '$lib/utils';

	import type { Session } from '@supabase/auth-helpers-svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import AddIcon from './icons/AddIcon.svelte';

	type MonthOutput = InferQueryOutput<'months:list'>;

	export let months: MonthOutput;

	const session = getContext<Writable<Session>>('session');
</script>

<div class="w-36">
	<ul class="menu bg-base-100 rounded-md">
		<li class="menu-title">
			<span>Main</span>
		</li>
		{#if $session?.user}
			<li><a href="/api/auth/logout">Logga ut</a></li>
		{:else}
			<li><a href="/login">Logga in</a></li>
		{/if}
		<li><a href="/expenses">Utgifter</a></li>
		<li><a href="/incomes">Inkomster</a></li>
		<li><a href="/categories">Kategorier</a></li>
		<li class="menu-title">
			<span>Månader</span>
		</li>
		<li><a href="/months/create"><AddIcon /> Öppna ny</a></li>
		{#if months}
			{#each months as month}
				<li>
					<a href="/months/{month.year}/{month.month}">{formatMonth(month.year, month.month)}</a>
				</li>
			{/each}
		{/if}
	</ul>
</div>
