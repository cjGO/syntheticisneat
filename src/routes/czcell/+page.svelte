<script>
	import SingleCellScatter from './SingleCellScatter.svelte';
	import { onMount } from 'svelte';

	const endpoint = 'https://api.syntheticisneat.com/random_annotations/';
	let data;

	onMount(async function () {
		const response = await fetch(endpoint);
		data = await response.json();
		console.log(data);

		isLoading = false;
	});
</script>

{#if data}
<SingleCellScatter {data} />
{/if}