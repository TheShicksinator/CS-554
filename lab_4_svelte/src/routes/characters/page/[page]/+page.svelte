<script>
	import axios from 'axios';
	import { onMount } from 'svelte';
	const page = $page.params.page;
	let characters = undefined;
	let loading = true;
	let lastPage = false;
	let search = '';

	onMount(async () => {
		let charData = [];
		let data;
		try {
			data = await axios.get(`http://localhost:4000/api/characters/page/${parseInt(page)}`);
			charData = data.data.results;
		} catch (error) {
			console.log(error);
			//navigate to error page with code of 404
			throw redirect(404, '/error');
		}
		lastPage =
			data.data.total - 1 - data.data.offset <= data.data.limit ||
			charData.length < data.data.limit;
		if (charData.length === 0) {
			throw redirect(404, '/error');
		}
		characters = charData;
		loading = false;
	});
</script>

<h1>Characters</h1>
{#if loading}
	<p>Loading...</p>
{:else}
	{#if page > 1}
		<a href="/characters/page/{parseInt(page) - 1}" class="links">Previous Page</a>
	{/if}
	{#if !lastPage}
		<a href="/characters/page/{parseInt(page) + 1}" class="links">Next Page</a>
	{/if}
	{#each characters as { id, name } (id)}
		<a href="/characters/{id}">{name}</a>
		<br />
	{/each}
{/if}
