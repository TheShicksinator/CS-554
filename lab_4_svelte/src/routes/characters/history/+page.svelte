<script>
	export let data;
	let { charData } = data;
</script>

{#each charData as { id, name } (id)}
	<a href="/characters/{id}">{name}</a>
	<br />
{/each}
