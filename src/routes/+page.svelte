<script>
	import { onMount } from 'svelte';
	import Scatterplot from './Scatterplot.svelte';

  let protein_umap; 

	let isLoading = true; // reactive variable to track loading state

	onMount(async () => {
		try {
			const response = await fetch('http://3.91.217.55:8004/all_protein_umaps');
			protein_umap = await response.json();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		} finally {
      console.log(protein_umap)
			isLoading = false; // update the loading state when the request completes
		}
	});
</script>

Test

{#if isLoading}
	<p>Loading...</p>
{:else if protein_umap.length === 0}
	<p>No data available.</p>
{/if}

{#if protein_umap}
<Scatterplot data={protein_umap}/>
{/if}

<br />
