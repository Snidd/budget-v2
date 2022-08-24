<script lang="ts">
	import type { ISignUp } from '$lib/auth/auth';

	import trpc from '$lib/client/trpc';

	const createUser = async () => {
		const signupData: ISignUp = {
			password: 'testtest',
			username: 'test'
		};

		const user = await trpc().mutation('users:create', signupData);
		console.log({ user });
	};

	const authenticateUser = async () => {
		const user = await trpc().query('users:signin', {
			username: 'test',
			password: 'testtest'
		});
		console.log({ user });
		return user;
	};
</script>

<button class="btn btn-primary" on:click={() => createUser()}>Create user</button>
<button class="btn btn-secondary" on:click={() => authenticateUser()}>Login</button>
