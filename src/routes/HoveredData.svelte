<script>
	export let data = null;
</script>

<div class="hovered-data">
	{#if data}
		<h2>{data.scientific_name}</h2>
		<p><strong>Sequence:</strong> {data.sequence}</p>
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
		padding: 1em;
		background-color: #f9f9f9;
		border-radius: 4px;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
	}
	.hovered-data h2 {
		margin-top: 0;
	}
	.hovered-data p {
		margin: 0.5em 0;
	}
</style>
