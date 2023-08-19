<script>
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3-scale';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	let data = [];
	let isLoading = true;
	let xScale;
	let yScale;
	let width;
	let height;
	let x_umapValues;

	const margin = { top: 20, right: 15, bottom: 20, left: 0 };
	let innerWidth = width - margin.right - margin.left;
	let innerHeight = height - margin.top - margin.bottom;

	const endpoint = 'https://api.syntheticisneat.com/random_annotations/';

	onMount(async function () {
		const response = await fetch(endpoint);
		data = await response.json();
		console.log(data);

		isLoading = false;
	});

	$: {
		if (data.length > 0) {
			x_umapValues = data.map((obj) => obj.umap_x);
			xScale = scaleLinear()
				.domain([Math.min(...x_umapValues), Math.max(...x_umapValues)])
				.range([15, innerWidth]);

			const y_umapValues = data.map((obj) => obj.umap_y);
			yScale = scaleLinear()
				.domain([Math.min(...y_umapValues), Math.max(...y_umapValues)])
				.range([innerHeight, 0]);
		}
	}
	$: {
		innerWidth = width - margin.right - margin.left;
		innerHeight = height - margin.top - margin.bottom;
	}

	let rectangles = [];
	let rectStart = null;
	let rectEnd = null;
	let svgElement;

	let idCounter = 0;

	function handleMouseDown(event) {
		const rect = svgElement.getBoundingClientRect();
		rectStart = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		rectangles.push({ id: idCounter++, start: rectStart, end: rectStart });
	}

	function handleMouseMove(event) {
		if (rectStart) {
			const rect = svgElement.getBoundingClientRect();
			rectEnd = { x: event.clientX - rect.left, y: event.clientY - rect.top };
			rectangles[rectangles.length - 1].end = rectEnd;
		}
	}

	function handleRectangleDoubleClick(id) {
		rectangles = rectangles.filter((rect) => rect.id !== id);
	}

	function handleMouseUp() {
		rectStart = null;

		// Deselect any highlighted text
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			// For IE
			document.selection.empty();
		}
	}
	let selectedRectangle = null;

	function handleRectangleClick(id) {
		if (selectedRectangle === id) {
			selectedRectangle = null;
		} else {
			selectedRectangle = id;
		}
	}
</script>

<main>
	{#if isLoading}
		<p>Loading...</p>
	{/if}
</main>

{#if data && data.length > 0 && xScale && yScale && x_umapValues}
	<div class="chart-container" bind:clientWidth={width} bind:clientHeight={height}>
		<svg
			{width}
			{height}
			bind:this={svgElement}
			on:mousedown={handleMouseDown}
			on:mousemove={handleMouseMove}
			on:mouseup={handleMouseUp}
		>
			<g class="inner-chart" transform="translate({margin.left}, {margin.top})">
				<AxisX {xScale} height={innerHeight} width={innerWidth} />
				<AxisY {yScale} width={innerWidth} />

				{#each rectangles as rect (rect.id)}
					<rect
						x={Math.min(rect.start.x, rect.end.x)}
						y={Math.min(rect.start.y, rect.end.y)}
						width={Math.abs(rect.end.x - rect.start.x)}
						height={Math.abs(rect.end.y - rect.start.y)}
						fill="rgba(0, 0, 0, 0.5)"
						style={rect.id === selectedRectangle ? 'stroke: red; stroke-width: 2;' : ''}
						on:dblclick={() => handleRectangleDoubleClick(rect.id)}
						on:click={() => handleRectangleClick(rect.id)}
					/>
				{/each}

				{#each data as d}
					<circle
						cx={xScale(d.umap_x)}
						cy={yScale(d.umap_y)}
						r={1}
						fill="purple"
						stroke="black"
						stroke-width="1"
					/>
				{/each}
			</g>
		</svg>
	</div>
{/if}

<style>
	:global(.tick text, .axis-title) {
		font-weight: 400; /* How thick our text is */
		font-size: 12px; /* How big our text is */
		fill: hsla(212, 10%, 53%, 1); /* The color of our text */
	}
	.chart-container {
		height: 100vh; /* Set the height to 100% of the viewport height */
	}
</style>
