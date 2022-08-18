<script lang="ts">
	export let editorErrors: Record<string, string> | undefined;

	export let fields: string | string[];

	const formatError = (error: string, field: string) => {
		return `${error} ${field}`;
	};

	const getText = () => {
		if (editorErrors === undefined) return '';

		if (typeof fields === 'string') {
			return formatError(editorErrors[fields], fields);
		}

		const texts = fields
			.filter((field) => {
				if (editorErrors === undefined) return false;
				return editorErrors[field] !== undefined;
			})
			.map((field) =>
				formatError(editorErrors !== undefined ? editorErrors[field] : 'unknown', field)
			);
		return texts.join('. ');
	};
</script>

{#if editorErrors}
	<p class="text-error">{getText()}</p>
{/if}
