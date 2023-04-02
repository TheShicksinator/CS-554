<script>
	export let data;
	$: ({ page, charData, lastPage } = data);
</script>

{#if page > 1}
	<a data-sveltekit-preload-data="hover" href="/characters/page/{parseInt(page) - 1}" class="links"
		>Previous Page</a
	>
{/if}
{#if !lastPage}
	<a data-sveltekit-preload-data="hover" href="/characters/page/{parseInt(page) + 1}" class="links"
		>Next Page</a
	>
{/if}
<br />

{#each charData as { id, name } (id)}
	<a href="/characters/{id}">{name}</a>
	<br />
{/each}
