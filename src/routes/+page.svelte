<script>
	import { onMount } from 'svelte';
	import Scatterplot from './Scatterplot.svelte';
	import AAscatter from './AAscatter.svelte';
	import Switcher from '../components/Switcher.svelte';
	import {
		selectedPoint,
		hoveredPoint,
		selectedProtein,
		highlightedIndex,
		selectedAminoAcids,
		modelSize
	} from './stores';
	import { transformData, runUMAP } from '../lib/helpers';
	import HoveredData from './HoveredData.svelte';
	import StringSpan from '../components/StringSpan.svelte';
	import Highlighter from '../components/Highlighter.svelte';

	let protein_umap_data;
	let protein_meta;
	let isLoading = true;

	let hoveredDatapoint = null;

	hoveredPoint.subscribe((value) => {
		hoveredDatapoint = value;
	});
	// pull all data to be visualized
	let protein_umap = {};

	onMount(async () => {
		try {
			const [umap_small, umap_big, response2] = await Promise.all([
				fetch(`https://api.syntheticisneat.com/model_umaps/?model_name=facebook/esm2_t6_8M_UR50D`),
				fetch(
					`https://api.syntheticisneat.com/model_umaps/?model_name=facebook/esm2_t33_650M_UR50D`
				),
				fetch('https://api.syntheticisneat.com/proteins/')
			]);

			protein_umap_data = {
				'facebook/esm2_t6_8M_UR50D': await umap_small.json(),
				'facebook/esm2_t33_650M_UR50D': await umap_big.json()
			};
			protein_meta = await response2.json();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
			console.log(protein_umap_data);
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
		// https://api.syntheticisneat.com/amino_acid_embedding/protein/1
		fetch(`https://api.syntheticisneat.com/grab_aa_embeddings_full/${$selectedProtein.id}/`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data)
				selected_protein = transformData(data);
				console.log('SELECTEDPROTEIN HERE', selected_protein);
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
<Switcher arg1={'facebook/esm2_t6_8M_UR50D'} arg2={'facebook/esm2_t33_650M_UR50D'} />

<div class="container">
	{#if !isLoading}
		<div class="scatterplot">
			<Scatterplot {protein_umap_data} meta={protein_meta} />
		</div>
	{/if}

	<div class="hovered-data-container">
		<HoveredData data={$selectedProtein ? $selectedProtein : null} />
		<HoveredData
			data={protein_meta && protein_meta[$hoveredPoint] ? protein_meta[$hoveredPoint] : null}
		/>
	</div>
</div>

<button
	on:click={() => {
		// console.log('runumap');
		selected_protein = runUMAP(selected_protein);
		console.log({ 'selected protein from UMAP button': selected_protein });
	}}>Run UMAP</button
>
<Switcher arg1={'facebook/esm2_t6_8M_UR50D'} arg2={'facebook/esm2_t33_650M_UR50D'} />

<div class="container">
	{#if Array.isArray(selected_protein) && selected_protein.length > 0 && selected_protein[0].hasOwnProperty('umap_component1')}
		<div class="item">
			<AAscatter data={selected_protein} />
		</div>
		<div class="highlighter">
			<Highlighter protein_sequence={$selectedProtein.sequence} />
			<p>{JSON.stringify(selected_protein[$highlightedIndex], null, 2)}</p>
		</div>
	{/if}
</div>
<br />

<style>
	.container {
		display: flex;
		height: 100vh; /* Full height */
	}

	.scatterplot {
		flex: 1; /* Take up half of the container's width */
	}

	.hovered-data-container {
		flex: 1; /* Take up the other half of the container's width */
		display: flex;
		flex-direction: column; /* Stack children vertically */
	}

	.hovered-data-container > * {
		flex: 1; /* Each HoveredData takes up half of the .hovered-data-container's height */
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
