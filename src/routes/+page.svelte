<script>
	import { onMount } from 'svelte';
	import Scatterplot from './Scatterplot.svelte';
	import AAscatter from './AAscatter.svelte';
	import { selectedPoint, hoveredPoint } from './stores';
	import { transformData, runUMAP } from '../lib/helpers';
	import HoveredData from './HoveredData.svelte';
	let protein_umap;
	let protein_meta;
	let isLoading = true;

	let hoveredDatapoint = null;

	hoveredPoint.subscribe((value) => {
		hoveredDatapoint = value;
	});
	// pull all data to be visualized
	onMount(async () => {
		try {
			const [response1, response2] = await Promise.all([
				fetch('https://api.syntheticisneat.com/all_protein_umaps'),
				fetch('https://api.syntheticisneat.com/proteins/')
			]);

			protein_umap = await response1.json();
			protein_meta = await response2.json();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
			console.log(protein_umap);
			console.log(protein_meta);
			isLoading = false; // update the loading state when the request completes
		}
	});

	// Create a local variable to hold the current value of the store.
	let currentPoint;
	let selected_protein = null;

	// Subscribe to the store. This function will be called any time the store's value changes.
	// It will also be called immediately with the current value of the store.
	const unsubscribe = selectedPoint.subscribe((value) => {
		currentPoint = value;
	});

	let previousPoint = null;
	$: if (currentPoint !== null && currentPoint !== previousPoint) {
		previousPoint = currentPoint;
		let protein_id = protein_umap[currentPoint].protein_id;
		fetch(`https://api.syntheticisneat.com/amino_acids/${protein_id}`)
			.then((response) => response.json())
			.then((data) => {
				selected_protein = data;
				console.log(transformData(selected_protein));
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}
</script>

{#if isLoading}
	<p>Loading...</p>
{:else if protein_umap.length === 0}
	<p>No data available.</p>
{/if}

<div class="container">
	{#if protein_umap}
		<div class="scatterplot">
			<Scatterplot data={protein_umap} meta={protein_meta} />
		</div>
	{/if}

	{#if hoveredDatapoint}
		<div class="hovered-data">
			<HoveredData data={protein_meta[hoveredDatapoint]} />
		</div>
	{/if}
</div>

<button on:click={() => (selected_protein = runUMAP(selected_protein))}>Run UMAP</button>

{#if Array.isArray(selected_protein) && selected_protein.length > 0 && selected_protein[0].hasOwnProperty('umap_component1')}
	<AAscatter data={selected_protein} />
{/if}

<br />

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr; /* This will create two columns of equal width */
		gap: 1em; /* Add some space between the components */
	}
</style>
