<script>
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { tweened } from 'svelte/motion';
	import { writable } from 'svelte/store';
	import DataPoint from './DataPoint.svelte';
	import RadioButtons from '../components/RadioButtons.svelte';
	import { selectedPoint } from './stores';
	export let data;
	export let meta;

	import { createEventDispatcher } from 'svelte';
	import { hoveredPoint } from './stores';
	const dispatch = createEventDispatcher();

	function handleMouseOver(datapoint) {
		dispatch('datapointHover', { datapoint });
		hoveredPoint.set(datapoint);
	}

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
	data = data.map((point) => ({
		...point,
		x: tweened(0, { duration: 2000 }),
		y: tweened(0, { duration: 2000 })
	}));

	let x_data = 'umap_component1';
	let y_data = 'umap_component2';
	let meta_pick = 'species_name';
	let options = ['umap_component1', 'umap_component2', 'umap_component3', 'umap_component4'];
	const margin = { top: 20, right: 20, bottom: 20, left: 20 };
	const width = 500 - margin.left - margin.right;
	const height = 500 - margin.top - margin.bottom;

	let xScale, yScale;

	$: {
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
			d.x.set(xScale(d[x_data]));
			d.y.set(yScale(d[y_data]));
		});
	}

	let svg;

	let currentPoint = null;

	// Subscribe to changes in the selectedPoint store.
	// Whenever the store's value changes, update the currentPoint variable.
	function handlePointClick(index) {
		// Update the store's value. If the current value is the same as the clicked index,
		// set the store's value to null. Otherwise, set it to the clicked index.
		selectedPoint.update((prevIndex) => (prevIndex === index ? null : index));
		console.log(selectedPoint);
	}
</script>

<svg
	bind:this={svg}
	width={width + margin.left + margin.right}
	height={height + margin.top + margin.bottom}
>
	<g
		transform="translate({margin.left}, {margin.top})"
		style="transform: translate({$zoomTransform.x}px, {$zoomTransform.y}px) scale({$zoomTransform.k})"
	>
		{#each data as point, index (index)}
			<DataPoint x={point.x} y={point.y} {index} />
		{/each}
	</g>
</svg>

<!-- <RadioButtons
	label={'Meta'}
	options={['species_name', 'biological_process']}
	bind:selectedOption={meta_pick}
/> -->
<RadioButtons label={'X axis'} {options} bind:selectedOption={x_data} />
<RadioButtons label={'Y axis'} {options} bind:selectedOption={y_data} />