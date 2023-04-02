<script>
	export let data;
	$: ({ page, comicData, lastPage } = data);
</script>

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
<br />
{#each comicData as { id, title } (id)}
	<a href="/comics/{id}">{title}</a>
	<br />
{/each}
