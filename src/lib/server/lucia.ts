import lucia from 'lucia-sveltekit';
import prisma from '@lucia-sveltekit/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { dev } from '$app/env';

const client = new PrismaClient();

export const auth = lucia({
	adapter: prisma(client),
	secret: 'aWmJoT0gOdjh2-Zc2Zv3BTErb29qQNWEunlj',
	env: dev ? 'DEV' : 'PROD'
});
