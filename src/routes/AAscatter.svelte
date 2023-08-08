<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { tweened } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import AaDataPoint from './AaDataPoint.svelte';
	import RadioButtons from '../components/RadioButtons.svelte';
	import { selectedPoint, modelSize } from './stores';
	export let selected_protein;
	import { hoveredAminoAcidStore } from './aa_store';

	let hoveredAminoAcid = null;

	let x = 'umap_component_1';
	let y = 'umap_component_2';
	let prefix = 'facebook/esm2_t6_8M_UR50D_';

	$: x_data = `${$modelSize}${x}`;
	$: y_data = `${$modelSize}${y}`;

	let data = selected_protein;

	hoveredAminoAcidStore.subscribe((value) => {
		hoveredAminoAcid = value;
	});

	const zoomTransform = writable({ x: 0, y: 0, k: 1 });

	function handleZoom(event) {
		const { x, y, k } = event.transform;
		zoomTransform.set({ x, y, k });
	}

	onMount(() => {
		const zoom = d3.zoom().on('zoom', handleZoom);
		d3.select(svg)
			.call(zoom)
			.on('dblclick.zoom', null) // Disable the default double-click behavior
			.on('dblclick', (event) => {
				event.preventDefault(); // Prevent the default behavior of the double-click event
			});
	});

	// Transform the data for the scatter plot
	$: {
		data = data.map((point) => ({
			...point,
			x: tweened(point.x, { duration: 1000 }),
			y: tweened(point.y, { duration: 1000 })
		}));
	}
	let prefixes = ['facebook/esm2_t6_8M_UR50D_', 'facebook/esm2_t33_650M_UR50D_'];
	let options = ['umap_component_1', 'umap_component_2', 'umap_component_3', 'umap_component_4'];
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	const width = 500 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;

	let xScale, yScale;

	$: {
		if (data && data.length > 0) {
			xScale = d3
				.scaleLinear()
				.domain(d3.extent(data, (d) => d[x_data]))
				.range([0, width])
				.nice();
			yScale = d3
				.scaleLinear()
				.domain(d3.extent(data, (d) => d[y_data]))
				.range([height, 0])
				.nice();
			data.forEach((d) => {
				d.x.update(() => xScale(d[x_data]));
				d.y.update(() => yScale(d[y_data]));
			});
		} else {
			xScale = d3.scaleLinear().range([0, width]);
			yScale = d3.scaleLinear().range([height, 0]);
		}
	}

	let svg;

	let currentPoint = null;
</script>

<div class="scatterplot-container">
	<svg
		bind:this={svg}
		width={width + margin.left + margin.right}
		height={height + margin.top + margin.bottom}
	>
		<g
			transform="translate({margin.left}, {margin.top})"
			style="transform: translate({$zoomTransform.x}px, {$zoomTransform.y}px) scale({$zoomTransform.k})"
		>
			{#if data && data.length > 0}
				{#each data as point, index (index)}
					<AaDataPoint
						{index}
						x={point.x}
						y={point.y}
						amino_acid={point.amino_acid}
						binding_site={point.binding_site}
						active_site={point.active_site}
						location = {point.location}
					/>
				{/each}
			{/if}
		</g>
	</svg>
	<div class="radio-buttons">
		<RadioButtons label={'X axis'} {options} bind:selectedOption={x} />
		<RadioButtons label={'Y axis'} {options} bind:selectedOption={y} />
	</div>
</div>

<style>
	.scatterplot-container {
		display: flex;
		flex-direction: column; /* Stack children vertically */
		height: 100%; /* Take up the full height of the parent */
		width: 100%; /* Take up the full width of the parent */
	}

	svg {
		width: 100%; /* This will make the SVG responsive to the width of the container */
		height: auto; /* Height is adjusted automatically to maintain the aspect ratio */
		flex-grow: 1;
	}

	.radio-buttons {
		display: flex;
		justify-content: space-between; /* Distribute RadioButtons evenly */
	}
</style>
