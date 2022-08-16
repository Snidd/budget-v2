<script>
	import AddIcon from './icons/AddIcon.svelte';
</script>

<div class="w-36">
	<ul class="menu bg-base-100 rounded-md">
		<li class="menu-title">
			<span>Main</span>
		</li>
		<li><a href="/">Dashboard</a></li>
		<li><a href="/expenses">Utgifter</a></li>
		<li><a href="/incomes">Inkomster</a></li>
		<li class="menu-title">
			<span>Månader</span>
		</li>
		<li><a href="/months/create"><AddIcon /> Öppna ny</a></li>
		<li><a href="/months/2022/3">Mars, 2022</a></li>
		<li><a href="/months/2022/4">April, 2022</a></li>
	</ul>
</div>
