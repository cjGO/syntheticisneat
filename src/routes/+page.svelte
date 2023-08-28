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
	import HoveredData from './HoveredData.svelte';
	import Highlighter from '../components/Highlighter.svelte';

	let protein_meta;
	let isLoading = true;
	let umapLoading = false;

	let hoveredDatapoint = null;

	hoveredPoint.subscribe((value) => {
		hoveredDatapoint = value;
	});
	// pull all data to be visualized
	let protein_umap = {};

	onMount(async () => {
		try {
			const [response1, response2] = await Promise.all([
				fetch(`https://api.syntheticisneat.com/grab_protein_umap_both`),
				fetch('https://api.syntheticisneat.com/proteins/')
			]);
			protein_umap = await response1.json();
			protein_meta = await response2.json();
			console.log(protein_umap);
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
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
		selected_protein = null;
		$highlightedIndex = null;
		// $selectedProtein = protein_meta.find((protein) => protein.id === currentPoint);
		$selectedProtein = protein_meta[currentPoint];
		// https://api.syntheticisneat.com/amino_acid_embedding/protein/1
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
<p> Click a protein point to turn it red to view the amino acid UMAP for that protein below! </p>
<p> This is an app to explore ~700 proteins BLASTed from the nicotine biosynthesis pathway. It uses <a href="https://github.com/facebookresearch/esm">Meta's ESM-2 models</a> to explore the internal representations of each protein and each amino acid within particular proteins.</p>
<Switcher arg1={'Click: Showing Small Model'} arg2={'Click: Showing Big Model'} />

<div class="container">
	{#if !isLoading}
		<div class="scatterplot">
			<Scatterplot {protein_umap} meta={protein_meta} />
		</div>
	{/if}

	<div class="hovered-data-container">
		<HoveredData
			data={protein_meta && protein_meta[$selectedPoint] ? protein_meta[$selectedPoint] : null}
		/>
		<HoveredData
			data={protein_meta && protein_meta[$hoveredPoint] ? protein_meta[$hoveredPoint] : null}
		/>
	</div>
</div>

<button
	on:click={() => {
		umapLoading = true;

		fetch(`https://api.syntheticisneat.com/run_umap_on_selected_protein/${$selectedProtein.id}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				selected_protein = [...data]; // Create a new array with the same contents as data
				console.log('SELECTEDPROTEIN HERE', selected_protein);
				umapLoading = false; // Set umapLoading to false when fetch is complete
			})
			.catch((error) => {
				console.error('Error:', error);
				umapLoading = false; // Set umapLoading to false when fetch breaks
			});
	}}
	disabled={umapLoading || currentPoint === null} 
		>
	Run UMAP (~15 seconds)
</button>


<Switcher arg1={'Click: Showing Small Model'} arg2={'Click: Showing Big Model'} />

<div class="container">
	{#if Array.isArray(selected_protein) && selected_protein.length > 0 && selected_protein[0].hasOwnProperty('facebook/esm2_t6_8M_UR50D_umap_component_1')}
		<div class="item">
			<AAscatter {selected_protein} />
		</div>
		<div class="highlighter">
			<Highlighter protein_sequence={protein_meta[$selectedPoint].sequence} />

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
