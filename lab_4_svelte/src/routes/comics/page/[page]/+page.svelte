<script>
	export let data;
	$: ({ page, lastPage } = data);
	let search = '';
	async function fetchSearchResults(searchTerm) {
		if (!searchTerm.trim().length) return;
		let response = await fetch(`http://localhost:4000/api/comics/search/${searchTerm}`);
		let data = await response.json();
		console.log(data.results);
		return data.results;
	}
	$: searchResults = fetchSearchResults(search);
	$: comicData = search.trim() ? searchResults : data.comicData;
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
		<a data-sveltekit-preload-data="hover" href="/comics/page/{parseInt(page) - 1}" class="links"
			>Previous Page</a
		>
	{/if}
	{#if !lastPage}
		<a data-sveltekit-preload-data="hover" href="/comics/page/{parseInt(page) + 1}" class="links"
			>Next Page</a
		>
	{/if}
{/if}
<br />
{#await comicData}
	<p>Loading...</p>
{:then comics}
	{#each comics as { id, title } (id)}
		<a href="/comics/{id}">{title}</a>
		<br />
	{/each}
{/await}
