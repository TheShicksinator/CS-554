<script>
	import { navigating } from '$app/stores';
</script>

<h1>Characters</h1>

{#if $navigating}
	<h2>Loading...</h2>
{:else}
	<slot />
{/if}
