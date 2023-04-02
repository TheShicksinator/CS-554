<script>
	import { navigating } from '$app/stores';
</script>

<h1>Stories</h1>

{#if $navigating}
	<h2>Loading...</h2>
{:else}
	<slot />
{/if}
