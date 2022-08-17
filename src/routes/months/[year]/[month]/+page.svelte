<script lang="ts">
	import { formatMonth } from '$lib/utils';

	import type { Errors, PageData } from './$types';

	export let data: PageData;
	export let errors: Errors;

	$: ({ month } = data);
</script>

{#if month}
	<h1 class="font-bold text-xl">{formatMonth(month.year, month.month)}</h1>
{/if}
