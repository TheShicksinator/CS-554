<script>
	export let data;
	$: ({ page, lastPage } = data);
	let search = '';
	async function fetchSearchResults(searchTerm) {
		if (!searchTerm.trim().length) return;
		let response = await fetch(`http://localhost:4000/api/characters/search/${searchTerm}`);
		let data = await response.json();
		console.log(data.results);
		return data.results;
	}
	$: searchResults = fetchSearchResults(search);
	$: charData = search.trim() ? searchResults : data.charData;
</script>

<form>
	<input
		type="text"
		name="search"
		placeholder="Search"
		bind:value={search}
		on:input={(e) => (search = e.target.value.trim() ? e.target.value : '')}
	/>
</form>
<br />
{#if !search.trim()}
	{#if page > 1}
		<a
			data-sveltekit-preload-data="hover"
			href="/characters/page/{parseInt(page) - 1}"
			class="links">Previous Page</a
		>
	{/if}
	{#if !lastPage}
		<a
			data-sveltekit-preload-data="hover"
			href="/characters/page/{parseInt(page) + 1}"
			class="links">Next Page</a
		>
	{/if}
{/if}

<br />
{#await charData}
	<p>Loading...</p>
{:then chars}
	{#each chars as { id, name } (id)}
		<a href="/characters/{id}">{name}</a>
		<br />
	{/each}
{/await}
