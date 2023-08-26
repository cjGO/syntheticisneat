<script>
	import SingleCellScatter from './SingleCellScatter.svelte';
	import FilterSidebar from './FilterSidebar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { summarizeKeys, getContinuous } from './sc_helpers';
	import Barplot from './Barplot.svelte';
	import { filter_state, continuous_variables } from './czcell_stores';

	let isLoading = true;
	let data;
	let filter_categorys;
	let filteredData;
	let sidebarWidth;
	let resizeObserver;

	const endpoint = 'https://api.syntheticisneat.com/random_annotations/';

	onMount(async function () {
		const response = await fetch(endpoint);
		data = await response.json();
		console.log(data);
		$continuous_variables = getContinuous(data);
		$filter_state = summarizeKeys(data);
		console.log($filter_state);
		isLoading = false;




	});
</script>

<p>
	This is a recreation of
	<a href="https://cellxgene.cziscience.com/e/c8d40d53-387b-48f2-9f89-72bfdb9c7c9f.cxg/"
		>cellxgene</a
	>
	using
	<a href="https://svelte.dev/">Svelte.js</a>
	and
	<a href="https://d3js.org/">D3.js</a>
</p>
{#if isLoading}
	<p>Loading...</p>
{/if}

{#if data}
	<div class="container">
		<div class="sidebar">
			{#each Object.entries($filter_state) as [key, value]}
				<div>
					<FilterSidebar {key} {value} />
				</div>
			{/each}
			{#each Object.keys($continuous_variables) as continuous_key, i}
				<div class="barplot-container">
					<Barplot
						data={Object.entries(data).map(([key, value]) => value[continuous_key])}
					/>
					<p class="barplot-label">{continuous_key}</p>
				</div>
			{/each}

			<!-- <Barplot data={Object.entries(data).map(([key, value]) => value.percent_rb)} />
			<Barplot data={Object.entries(data).map(([key, value]) => value.donor_BMI_at_collection)} /> -->
		</div>
		<div class="scatter">
			<SingleCellScatter {data} />
			<br />
		</div>
	</div>
{/if}

<style>
	.container {
		display: flex;
		height: 80vh;
	}

	.sidebar {
		flex: 1;
		overflow-y: auto;
	}

	.scatter {
		flex: 4;
	}

	.barplot-container {
		border: 1px solid #000;
		box-sizing: border-box;
	}
	.barplot-label {
		
		text-align: center;
		font-weight: bold;
		margin-top: 10px;
	}
</style>
