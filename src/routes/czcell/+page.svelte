<script>
	import SingleCellScatter from './SingleCellScatter.svelte';
	import FilterSidebar from './FilterSidebar.svelte';
	import { onMount } from 'svelte';
	import { summarizeKeys } from './sc_helpers';
	import Barplot from './Barplot.svelte';
	import { filter_state, color_scheme } from './czcell_stores';

	let isLoading = true;
	let data;
	let filter_categorys;
	let filteredData;

	const endpoint = 'https://api.syntheticisneat.com/random_annotations/';

	onMount(async function () {
		const response = await fetch(endpoint);
		data = await response.json();
		console.log(data);
		filter_categorys = summarizeKeys(data);
		let keysArray = Object.keys(filter_categorys);
		$filter_state = filter_categorys;
		isLoading = false;
	});

	$: {
		if ($filter_state && data) {
			filteredData = data.filter((item) => {
				for (let key in $filter_state) {
					if (!$filter_state[key].values[item[key]].filter) {
						return false;
					}
				}
				return true;
			});
		}
	}
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
