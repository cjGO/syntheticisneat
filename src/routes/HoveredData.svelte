<script>
	export let data = null;
</script>

<div class="hovered-data">
	{#if data}
		<h2>{data.scientific_name}</h2>
		<div class="sequence">
			<p><strong>Sequence:</strong> {data.sequence}</p>
		</div>
		<p><strong>Created at:</strong> {data.created_at}</p>
		<p><strong>ID:</strong> {data.id}</p>
		<p><strong>Biological Process:</strong> {data.biological_process}</p>
		<p><strong>Species Name:</strong> {data.species_name}</p>
		<p><strong>Primary Accession:</strong> {data.primary_accession}</p>
		<p><strong>Uniprot ID:</strong> {data.uniprot_id}</p>
	{:else}
		<p>No data available.</p>
	{/if}
</div>

<style>
	.hovered-data {
		height: 100%; /* Full height of its parent */
		padding: 1em;
		border: 1px solid #dcdcdc; /* Light grey border */
		background-color: #f9f9f9;
		box-sizing: border-box; /* Include padding and border in height calculation */
	}

	.hovered-data .sequence {
		height: 50px; /* Fixed height */
		width: 100%; /* Full width of its parent */
		word-break: break-all; /* Break words between any two letters (not only at spaces like break-word) */
		overflow-y: auto; /* Enable vertical scrollbar */
		white-space: pre-wrap; /* Preformating: respects line breaks and spaces, and it allows them to wrap */
	}
</style>
