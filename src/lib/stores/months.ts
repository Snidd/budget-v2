import type { InferQueryOutput } from '$lib/client/trpc';
import { writable } from 'svelte/store';

export const months = writable<InferQueryOutput<'months:list'>>([]);
