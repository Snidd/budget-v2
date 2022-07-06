<script>
	import Menu from '$components/Menu.svelte';

	import '../app.css';
</script>

<div class="flex">
	<div class="p-2 py-10">
		<Menu />
	</div>
	<div class="py-10">
		<slot />
	</div>
</div>
