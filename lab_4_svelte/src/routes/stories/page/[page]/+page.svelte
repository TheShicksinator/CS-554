<script>
	export let data;
	let { page, storyData, lastPage } = data;
</script>

{#if page > 1}
	<a
		data-sveltekit-reload
		data-sveltekit-preload-data="hover"
		href="/stories/page/{parseInt(page) - 1}"
		class="links">Previous Page</a
	>
{/if}
{#if !lastPage}
	<a
		data-sveltekit-reload
		data-sveltekit-preload-data="hover"
		href="/stories/page/{parseInt(page) + 1}"
		class="links">Next Page</a
	>
{/if}
<br />
{#each storyData as { id, title } (id)}
	<a href="/stories/{id}">{title}</a>
	<br />
{/each}
