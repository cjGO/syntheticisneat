<script>
	import { onMount } from 'svelte';
	import Scatterplot from './Scatterplot.svelte';
	import { selectedPoint } from './stores';

	let protein_umap;

	let isLoading = true; // reactive variable to track loading state

	onMount(async () => {
		try {
			const response = await fetch('https://api.syntheticisneat.com/all_protein_umaps');
			protein_umap = await response.json();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
			console.log(protein_umap);
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
				console.log(selected_protein);
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

{#if protein_umap}
	<Scatterplot data={protein_umap} />
{/if}

{#if protein_umap && selectedPoint}
	{[currentPoint]}
{/if}

<br />
