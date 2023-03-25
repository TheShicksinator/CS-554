<script>
	export let data;
	let { comic } = data;
</script>

<h2>{comic.title}</h2>
<img
	class="infoImg"
	src={comic.thumbnail.path + '.' + comic.thumbnail.extension}
	alt={comic.title}
/>
<p>{comic.description}</p>
{#if comic.characters.items.length}
	<h3>Characters</h3>
{/if}
<ul>
	{#each comic.characters.items as character}
		<a href="/characters/{character.resourceURI.split('/').pop()}"
			><li>
				{character.name}
			</li></a
		>
	{/each}
</ul>
{#if comic.stories.items.length}
	<h3>Stories</h3>
{/if}
<ul>
	{#each comic.stories.items as story}
		<a href="/stories/{story.resourceURI.split('/').pop()}"
			><li>
				{story.name}
			</li></a
		>
	{/each}
</ul>
