<script>
	export let data;
	$: ({ story } = data);
</script>

<h2>{story.title}</h2>
{#if story.thumbnail}
	<img
		class="infoImg"
		src={story.thumbnail.path + '.' + story.thumbnail.extension}
		alt={story.title}
	/>
{/if}

<p>{story.description}</p>
{#if story.comics.items.length}
	<h3>Comics</h3>
{/if}
<ul>
	{#each story.comics.items as comic}
		<a href="/comics/{comic.resourceURI.split('/').pop()}"
			><li>
				{comic.name}
			</li></a
		>
	{/each}
</ul>
{#if story.characters.items.length}
	<h3>Characters</h3>
{/if}
<ul>
	{#each story.characters.items as character}
		<a href="/characters/{character.resourceURI.split('/').pop()}"
			><li>
				{character.name}
			</li></a
		>
	{/each}
</ul>
