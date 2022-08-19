<script lang="ts">
	export let category: { name: string; color: string };
</script>

<div class="badge badge-outline" style="color: {category.color}; border-color: {category.color}">
	{category.name}
</div>
