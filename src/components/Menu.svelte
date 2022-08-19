<script lang="ts">
	import type { InferQueryOutput } from '$lib/client/trpc';
	import { formatMonth } from '$lib/utils';

	import AddIcon from './icons/AddIcon.svelte';

	type MonthOutput = InferQueryOutput<'months:list'>;

	export let months: MonthOutput;
</script>

<div class="w-36">
	<ul class="menu bg-base-100 rounded-md">
		<li class="menu-title">
			<span>Main</span>
		</li>
		<li><a href="/">Dashboard</a></li>
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
