<script>
	export let data;
	let { character } = data;
</script>

<h2>{character.name}</h2>
<img
	class="infoImg"
	src={character.thumbnail.path + '.' + character.thumbnail.extension}
	alt={character.name}
/>
<p>{character.description}</p>
{#if character.comics.items.length}
	<h3>Comics</h3>
{/if}
<ul>
	{#each character.comics.items as comic}
		<a href="/comics/{comic.resourceURI.split('/').pop()}"
			><li>
				{comic.name}
			</li></a
		>
	{/each}
</ul>
{#if character.stories.items.length}
	<h3>Stories</h3>
{/if}
<ul>
	{#each character.stories.items as story}
		<a href="/stories/{story.resourceURI.split('/').pop()}"
			><li>
				{story.name}
			</li></a
		>
	{/each}
</ul>
