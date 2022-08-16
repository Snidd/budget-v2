<script lang="ts">
	import { page } from '$app/stores';
	import ErrorIcon from '$components/icons/ErrorIcon.svelte';
	import SadIcon from '$components/icons/SadIcon.svelte';

	console.log($page.error);
</script>

<div class="w-[90vw] h-[20vw] flex items-center justify-center">
	<div class="w-[36rem]">
		{#if $page.status === 404}
			<div class="alert alert-warning shadow-lg">
				<div class="flex flex-col justify-start w-full">
					<div class="flex items-center justify-start gap-2">
						<SadIcon /><span>Ooops, page not found!</span>
					</div>
					<div>{$page.url}</div>
				</div>
			</div>
		{:else}
			<div class="alert alert-error shadow-lg">
				<div>
					<ErrorIcon />
					<span>{$page.error.message} ({$page.status})</span>
				</div>
			</div>
		{/if}
	</div>
</div>
