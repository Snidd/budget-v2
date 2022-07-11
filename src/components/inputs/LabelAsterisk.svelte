<script lang="ts">
	export let required: boolean;
</script>

{#if required}
	<span class="ml-1 opacity-50">*</span>
{/if}
