<script>
	export let data;
	$: ({ charData } = data);
</script>

{#each charData as { id, name }}
	<a href="/characters/{id}">{name}</a>
	<br />
{/each}
