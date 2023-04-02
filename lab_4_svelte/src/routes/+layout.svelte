<script>
	import marvelLogo from '../img/Marvel.png';
</script>

<div class="app">
	<header class="app-header">
		<img src={marvelLogo} class="logo" alt="logo" />
		<title>Lab 4 Svelte</title>
		<a href="/" class="link">
			<h1>Svelte Marvel API (click here for home)</h1>
		</a>
	</header>
	<br />

	<slot />
</div>

<style>
	.logo {
		width: 500px;
		height: auto;
	}
	.app {
		text-align: center;
	}
	.app-header {
		background-color: #282c34;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: calc(10px + 2vmin);
		color: white;
	}
</style>
