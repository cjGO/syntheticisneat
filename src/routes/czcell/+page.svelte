<script>
	import SingleCellScatter from './SingleCellScatter.svelte';
	import FilterSidebar from './FilterSidebar.svelte';
	import { onMount } from 'svelte';
	import { summarizeKeys } from './sc_helpers';
	import Barplot from './Barplot.svelte';
	import {filter_state, color_scheme} from './czcell_stores'

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

		$filter_state = (filter_categorys);
		console.log($filter_state)
		 isLoading = false;
	});

	$: console.log({'filterstatus':$filter_state})
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
