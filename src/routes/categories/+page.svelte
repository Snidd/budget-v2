<script lang="ts">
	import ModalDialog from '$components/ModalDialog.svelte';

	import type { InferMutationInput, InferQueryInput } from '$lib/client/trpc';
	import trpc from '$lib/client/trpc';

	import type { Errors, PageData } from './$types';
	import getEditorErrors from '$lib/client/getEditorErrors';
	import type { Router } from '$lib/server/trpc';
	import type { TRPCClientError } from '@trpc/client';
	import TextInput from '$components/inputs/TextInput.svelte';
	import CategoriesTable from './CategoriesTable.svelte';
	import CheckboxInput from '$components/inputs/CheckboxInput.svelte';
	import ColorInput from '$components/inputs/ColorInput.svelte';
	import { invalidate } from '$app/navigation';

	export let data: PageData;
	export let errors: Errors;

	type Category = InferMutationInput<'categories:save'>;

	const newCategory = (): Category => ({
		isIncome: false,
		color: '#000',
		id: null,
		name: '',
		order: undefined
	});

	let category = newCategory();

	let editorErrors: Record<string, string> | undefined;
	let loading = false;
	let categoryDialogVisible = false;

	$: ({ expenseCategories, incomeCategories } = data);

	const reloadCategories = async () => {
		loading = true;
		await invalidate();
		loading = false;
	};

	const handleEditorClose = () => {
		categoryDialogVisible = false;
		category = newCategory();
	};

	const handleEditorSave = async () => {
		//save category
		try {
			await trpc().mutation('categories:save', category);
			categoryDialogVisible = false;
			category = newCategory();
			reloadCategories();
		} catch (err) {
			editorErrors = getEditorErrors(err as TRPCClientError<Router>);
		}
	};

	const showCategoryEdit = async (editCategory: Category) => {
		category = editCategory;
		categoryDialogVisible = true;
	};

	const handleCategoryDelete = async (categoryToDelete: Category) => {
		if (categoryToDelete.id === null) return;
		await trpc().mutation('categories:delete', categoryToDelete.id);
		reloadCategories();
	};
</script>

<CategoriesTable
	{expenseCategories}
	{incomeCategories}
	on:edit={(cat) => showCategoryEdit(cat.detail.category)}
	on:delete={(cat) => handleCategoryDelete(cat.detail.category)}
/>

<button class="btn btn-primary" on:click={() => (categoryDialogVisible = true)}
	>Lägg till kategori</button
>

<ModalDialog
	title="Lägg till kategori"
	visible={categoryDialogVisible}
	on:close={handleEditorClose}
	on:save={handleEditorSave}
>
	<TextInput
		label="Namn"
		required={true}
		placeholder="Kategorinamn"
		bind:value={category.name}
		error={editorErrors?.name}
	/>
	<ColorInput
		label="Färg"
		required={false}
		bind:value={category.color}
		error={editorErrors?.color}
	/>
	<CheckboxInput
		label="Inkomstkategori?"
		required={true}
		bind:checked={category.isIncome}
		error={editorErrors?.isIncome}
	/>
</ModalDialog>
