<script>
	import SingleCellScatter from './SingleCellScatter.svelte';
	import FilterSidebar from './FilterSidebar.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { summarizeKeys, getContinuous } from './sc_helpers';
	import Barplot from './Barplot.svelte';
	import { filter_state, filter_cont } from './czcell_stores';

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
		$filter_cont = getContinuous(data);
		$filter_state = summarizeKeys(data);
		console.log($filter_cont);
		isLoading = false;

		resizeObserver = new ResizeObserver((entries) => {
			for (let entry of entries) {
				sidebarWidth = entry.contentRect.width;
			}
		});

		resizeObserver.observe(document.querySelector('.sidebar'));
	});

	onDestroy(() => {
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	});
</script>

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
			{#each Object.keys($filter_cont) as continuous_key, i}
				<div class="barplot-container">
					<Barplot
						id={`barplot-${i}`}
						data={Object.entries(data).map(([key, value]) => value[continuous_key])}
						width={sidebarWidth}
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
	}
	.sidebar {
		flex: 1;
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
