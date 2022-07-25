<script context="module">
	export const prerender = true;
	const V3 = import.meta.env.VITE_UNISWAPV3 == 'true';
</script>

<svelte:head>
	<title>About</title>
</svelte:head>

<div class="content">
	<h1>About this app</h1>

	<p class="text-center">
		This is a Uniswap {V3 ? 'V3' : 'V2'} info page built using PowerLoom Protocol!
	</p>
</div>
