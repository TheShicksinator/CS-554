<script>
	export let data;
	$: ({ charData } = data);
</script>

{#each charData as { id, name } (id)}
	<a href="/characters/{id}">{name}</a>
	<br />
{/each}
