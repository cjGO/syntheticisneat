<script>
	import SingleCellScatter from './SingleCellScatter.svelte';
	import FilterSidebar from './FilterSidebar.svelte';
	import { onMount } from 'svelte';
	import { summarizeKeys } from './sc_helpers';
	import Barplot from './Barplot.svelte';
	let isLoading = true;

	const endpoint = 'https://api.syntheticisneat.com/random_annotations/';
	let data;
	let filter_categorys;
	onMount(async function () {
		const response = await fetch(endpoint);
		data = await response.json();
		console.log(data);
		filter_categorys = summarizeKeys(data);
		let keysArray = Object.keys(filter_categorys);

		console.log(filter_categorys);
		console.log(filter_categorys[keysArray[1]]);
		isLoading = false;
	});
</script>

{#if isLoading}
	<p>Loading...</p>
{/if}

{#if data}
<Barplot data={Object.entries(data).map(([key, value]) => value.n_count_rna)} />
	<div class="container">
		<div class="sidebar">
			{#each Object.entries(filter_categorys) as [key, value]}
				<div>
					<FilterSidebar {key} {value} />

				</div>
			{/each}
		</div>
		<div class="scatter">
			<SingleCellScatter {data} />
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
	}
	.sidebar {
		flex: 1;
	}
	.scatter {
		flex: 4;
	}
</style>
