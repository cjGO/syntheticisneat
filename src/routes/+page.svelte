<script>
	import { onMount } from 'svelte';
	import Scatterplot from './Scatterplot.svelte';
	import AAscatter from './AAscatter.svelte';
	import { selectedPoint, hoveredPoint, selectedProtein, selectedAminoAcids } from './stores';
	import { transformData, runUMAP } from '../lib/helpers';
	import HoveredData from './HoveredData.svelte';
	import StringSpan from '../components/StringSpan.svelte';
	import Highlighter from '../components/Highlighter.svelte';

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
		$selectedProtein = protein_meta.find((protein) => protein.id === currentPoint);
		console.log({ protein_id: $selectedProtein.id });
		fetch(`https://api.syntheticisneat.com/amino_acids/${$selectedProtein.id}`)
			.then((response) => response.json())
			.then((data) => {
				selected_protein = transformData(data);
				console.log(selectedProtein);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	}

	$: {
		console.log({ selectedProteinStore: $selectedProtein });
	}
</script>

<!-- <div style="width: 25%; height: 10; overflow: auto;">
	<Highlighter />
</div> -->

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

	{#if $selectedProtein}
		<div class="hovered-data">
			<HoveredData data={$selectedProtein} />
			<HoveredData data={protein_meta[$hoveredPoint]} />
		</div>
	{/if}
</div>

<button
	on:click={() => {
		// console.log('runumap');
		selected_protein = runUMAP(selected_protein);
		console.log({ 'selected protein from UMAP button': selected_protein });
	}}>Run UMAP</button
>
<div class="container">
	{#if Array.isArray(selected_protein) && selected_protein.length > 0 && selected_protein[0].hasOwnProperty('umap_component1')}
		<div class="item">
			<AAscatter data={selected_protein} />
		</div>
		<div class="highlighter">
			<Highlighter protein_sequence={$selectedProtein.sequence} />
		</div>
	{/if}
</div>
<br />

<StringSpan />

<style>
	.container {
		display: flex;
		justify-content: space-between;
		padding: 20px;
	}

	.highlighter {
		flex: 1;
		margin: 0 10px;
		overflow-wrap: break-word; /* Allow long words to be able to break and wrap onto the next line */
		word-wrap: break-word; /* Older browsers may not support overflow-wrap property, so this is a fallback */
		overflow: auto; /* Add a scrollbar if necessary, e.g. if content is too tall to fit in the container */
		max-width: 100%; /* Ensure this box doesn't exceed its parent's width */
		height: 100%; /* If you want a specific height, replace 100% with your value */
	}
</style>
