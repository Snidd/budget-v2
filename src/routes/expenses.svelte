<script lang="ts">
	import type { InferMutationInput, InferQueryOutput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';

	const expensesPromise = trpc(fetch).query('expenses:list');
</script>

{#await expensesPromise}
	<!-- promise is pending -->
{:then expenses}
	<!-- promise was fulfilled -->
	{#each expenses as expense}
		<p>{expense.description}</p>
	{/each}
{/await}
<!-- promise was fulfilled -->
