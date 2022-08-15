<script lang="ts">
	import type { InferQueryInput, InferQueryOutput } from '$lib/client/trpc';
	import { getPaymentTypeString, PaymentTypes } from '$lib/model/PaymentTypes';
	export let groupBy: InferQueryInput<'expenses:list'>;
	export let expenses: InferQueryOutput<'expenses:list'> = [];

	let lastGroup: object;

	function hasOwnProperty<T, K extends PropertyKey>(
		obj: T,
		prop: K
	): obj is T & Record<K, unknown> {
		return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	interface Group {
		name: unknown;
		expenses: InferQueryOutput<'expenses:list'>;
	}

	const getGroups = (
		expensesList: InferQueryOutput<'expenses:list'>,
		groupKey: InferQueryInput<'expenses:list'>
	): Group[] => {
		let groups: Group[] = [];
		let lastGroup: unknown;

		expensesList.forEach((expense, index) => {
			let current = expense[groupKey];
			if (hasOwnProperty(current, 'name')) {
				if (current.name !== lastGroup) {
					groups.push({ name: current.name, expenses: [expense] });
					lastGroup = current.name;
					return;
				} else {
					groups[groups.length - 1].expenses.push(expense);
				}
			} else {
				if (current !== lastGroup) {
					groups.push({ name: current, expenses: [expense] });
					lastGroup = current;
					return;
				} else {
					groups[groups.length - 1].expenses.push(expense);
				}
			}
		});

		return groups;
	};

	const getGroupName = (groupKey: unknown): string => {
		if (groupBy === 'paymentType') {
			return getPaymentTypeString(groupKey as PaymentTypes);
		}

		return String(groupKey);
	};
</script>

<!--
<div class="flex flex-col w-full border-opacity-50">
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
  <div class="divider">OR</div>
  <div class="grid h-20 card bg-base-300 rounded-box place-items-center">content</div>
</div>-->

<div class="flex flex-col w-full border-opacity-50">
	{#each getGroups(expenses, groupBy) as group}
		<div class="divider">{getGroupName(group.name)}</div>
		<div class="flex flex-wrap gap-2 mb-10">
			{#each group.expenses as expense}
				<slot {expense} />
			{/each}
		</div>
	{/each}
</div>
