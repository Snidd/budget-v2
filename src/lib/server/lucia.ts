import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import client from './prismaClient';
import { dev } from '$app/env';

export const auth = lucia({
	adapter: prisma(client),
	secret: 'aWmJoT0gOdjh2-Zc2Zv3BTErb29qQNWEunlj',
	env: dev ? 'DEV' : 'PROD'
});
