import type { User } from '@supabase/auth-helpers-sveltekit';
import { writable } from 'svelte/store';

export const session = writable<ISession>();

export interface ISession {
	user: User | null;
	accessToken?: string | null;
	error?: string | null;
}
