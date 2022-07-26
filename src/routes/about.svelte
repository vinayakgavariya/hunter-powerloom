<script context="module">
	export const prerender = true;
	const V3 = import.meta.env.VITE_UNISWAPV3 == 'true';
	const APP_NAME = import.meta.env.VITE_APP_NAME || 'Uniswap ' + (V3 ? 'V3' : 'V2');
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<h1>About this app</h1>

	<p class="text-center">
		This is a {APP_NAME} info page built using PowerLoom Protocol!
	</p>
</div>
