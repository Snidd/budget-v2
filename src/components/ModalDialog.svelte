<script lang="ts">
	export let title: string;
</script>

<dialog>
	<header>
		<p>{title}</p>
	</header>
	<slot />
	<footer>
		<p>test</p>
	</footer>
</dialog>
