<script>
	export let data;
	$: ({ page, lastPage } = data);
	let search = '';
	async function fetchSearchResults(searchTerm) {
		if (!searchTerm.trim().length) return;
		try {
			let response = await fetch(`http://localhost:4000/api/stories/search/${searchTerm}`);
			let data = await response.json();
			console.log(data.results);
			return data.results;
		} catch (error) {
			return;
		}
	}
	$: searchResults = fetchSearchResults(search);
	$: storyData = search.trim() ? searchResults : data.storyData;
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
		<a data-sveltekit-preload-data="hover" href="/stories/page/{parseInt(page) - 1}" class="links"
			>Previous Page</a
		>
	{/if}
	{#if !lastPage}
		<a data-sveltekit-preload-data="hover" href="/stories/page/{parseInt(page) + 1}" class="links"
			>Next Page</a
		>
	{/if}
{/if}

<br />
{#await storyData}
	<p>Loading...</p>
{:then stories}
	{#if stories}
		{#each stories as { id, title } (id)}
			<a href="/stories/{id}">{title}</a>
			<br />
		{/each}
	{:else}
		<p>No results found</p>
	{/if}
{/await}
