<script>
	import { onMount } from 'svelte';
	import { scaleLinear } from 'd3-scale';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';
	export let data;
	import { filter_state, color_scheme, hovered_cat, color_cats } from './czcell_stores';
	import { generateColors } from './sc_helpers';

	let isLoading = true;
	let xScale;
	let yScale;
	let width;
	let height;
	let x_umapValues;
	let filtered_data = data;
	const margin = { top: 20, right: 15, bottom: 20, left: 0 };
	let innerWidth = width - margin.right - margin.left;
	let innerHeight = height - margin.top - margin.bottom;

	let color_array;

	// let tissueLocations = filtered_data.map(obj => obj.tissue_location);
	// let uniqueTissueLocations = tissueLocations.filter((value, index, self) => self.indexOf(value) === index);
	// let category_ids = data.map(obj => uniqueTissueLocations.indexOf(obj.tissue_location));
	// let number_colors = new Set(category_ids).size
	// let colors = (generateColors(number_colors))
	// console.log(colors)
	// console.log(category_ids)
	// var color_array = category_ids.map(index => colors[index]);

	$: {
		if (data.length > 0) {
			if ($filter_state && data) {
				filtered_data = data.filter((item) => {
					for (let key in $filter_state) {
						if (!$filter_state[key].values[item[key]].filter) {
							return false;
						}
					}
					return true;
				});

				if ($color_scheme && $color_scheme.length) {
					console.log('running color_scheme');
					console.log($color_scheme);
					let tissueLocations = filtered_data.map((obj) => obj[$color_scheme]);
					let uniqueTissueLocations = tissueLocations.filter(
						(value, index, self) => self.indexOf(value) === index
					);
					console.log(uniqueTissueLocations);

					let category_ids = filtered_data.map((obj) =>
						uniqueTissueLocations.indexOf(obj[$color_scheme])
					);
					let number_colors = new Set(category_ids).size;
					let colors = generateColors(number_colors);
					console.log(category_ids);
					color_array = category_ids.map((index) => colors[index]);
					$color_cats = color_array;
				} else {
					color_array = null;
					$color_cats = null;
				}

				/// add logic to create the color_array for filtered_data.
				// this reactive statement also must run when $color_scheme change
			}

			x_umapValues = filtered_data.map((obj) => obj.umap_x);
			xScale = scaleLinear()
				.domain([Math.min(...x_umapValues), Math.max(...x_umapValues)])
				.range([15, innerWidth]);

			const y_umapValues = filtered_data.map((obj) => obj.umap_y);
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
	let activeRectangle = null; // for the rectangle being actively drawn

	let idCounter = 0;

	function handleMouseDown(event) {
		console.log('click');
		if (isDeleting) {
			return;
		}
		if (isDisabled) {
			return;
		}
		const rect = svgElement.getBoundingClientRect();
		rectStart = { x: event.clientX - rect.left, y: event.clientY - rect.top };
		rectangles.push({ id: idCounter++, start: rectStart, end: rectStart });
	}

	function handleMouseMove(event) {
		if (isDisabled) {
			return;
		}
		const rect = svgElement.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		if (selectedRectangle !== null) {
			const selectedRect = rectangles.find((rect) => rect.id === selectedRectangle);

			// Check if selectedRect is not undefined
			if (selectedRect) {
				const oldCenterX = (selectedRect.start.x + selectedRect.end.x) / 2;
				const oldCenterY = (selectedRect.start.y + selectedRect.end.y) / 2;

				const dx = mouseX - oldCenterX;
				const dy = mouseY - oldCenterY;

				selectedRect.start.x += dx;
				selectedRect.start.y += dy;
				selectedRect.end.x += dx;
				selectedRect.end.y += dy;

				rectangles = [...rectangles]; // This line will trigger Svelte's reactivity system
			}
		} else if (rectStart) {
			rectEnd = { x: mouseX, y: mouseY };
			rectangles[rectangles.length - 1].end = rectEnd;
		}
	}

	function handleMouseUp() {
		if (isDisabled) {
			return;
		}
		rectStart = null;

		// Deselect any highlighted text
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			// For IE
			document.selection.empty();
		}
	}
	let isDeleting = false;

	let isDisabled = false;
	let selectedRectangle = null;

	function handleRectangleClick(id, event) {
		event.stopPropagation();
		if (selectedRectangle === id) {
			selectedRectangle = null;
		} else {
			selectedRectangle = id;
			const selectedRect = rectangles.find((rect) => rect.id === selectedRectangle);
			if (selectedRect) {
				const rect = svgElement.getBoundingClientRect();
				const mouseX = event.clientX - rect.left;
				const mouseY = event.clientY - rect.top;

				const oldCenterX = (selectedRect.start.x + selectedRect.end.x) / 2;
				const oldCenterY = (selectedRect.start.y + selectedRect.end.y) / 2;

				const dx = mouseX - oldCenterX;
				const dy = mouseY - oldCenterY;

				selectedRect.start.x += dx;
				selectedRect.start.y += dy;
				selectedRect.end.x += dx;
				selectedRect.end.y += dy;

				rectangles = [...rectangles]; // This line will trigger Svelte's reactivity system
			}
		}
	}

	function handleRectangleDoubleClick(id, event) {
		event.stopPropagation();
		isDisabled = true;
		isDeleting = true;
		setTimeout(function () {
			rectangles = rectangles.filter((rect) => rect.id !== id);
			isDeleting = false;
			isDisabled = false; // Set isDisabled back to false immediately after deleting a rectangle
		}, 122); // Time to delete a rectangle
		console.log('deleted');
	}

	function getPointsInRectangles(filtered_data, rectangles) {
		let pointsInRectangles = rectangles.map((rect) => {
			if (!rectangles || rectangles.length === 0) {
				return [];
			}
			let pointsInRect = filtered_data.filter((point) => {
				let rectStartX = Math.min(rect.start.x, rect.end.x);
				let rectEndX = Math.max(rect.start.x, rect.end.x);
				let rectStartY = Math.min(rect.start.y, rect.end.y);
				let rectEndY = Math.max(rect.start.y, rect.end.y);

				let pointX = xScale(point.umap_x);
				let pointY = yScale(point.umap_y);

				return (
					pointX >= rectStartX && pointX <= rectEndX && pointY >= rectStartY && pointY <= rectEndY
				);
			});

			return { rectId: rect.id, points: pointsInRect };
		});

		return pointsInRectangles;
	}

	let pointsInRectangles = [];

	$: {
		pointsInRectangles = getPointsInRectangles(filtered_data, rectangles);
		//   console.log(pointsInRectangles);
	}

	let hover_category;
	let hover_type;
	$: {
		hover_category = $hovered_cat[0];
		hover_type = $hovered_cat[1];
	}
</script>

{#if filtered_data && filtered_data.length > 0 && xScale && yScale && x_umapValues}
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

				{#each filtered_data as d, i (d.id)}
					<circle
						cx={xScale(d.umap_x)}
						cy={yScale(d.umap_y)}
						r={hover_category && d[hover_category] == hover_type ? 5 : 3}
						fill={color_array && color_array[i] ? color_array[i] : 'black'}
					/>
				{/each}

				{#each rectangles as rect (rect.id)}
					<rect
						x={Math.min(rect.start.x, rect.end.x)}
						y={Math.min(rect.start.y, rect.end.y)}
						width={Math.abs(rect.end.x - rect.start.x)}
						height={Math.abs(rect.end.y - rect.start.y)}
						fill="rgba(0, 0, 0, 0.5)"
						style={rect.id === selectedRectangle ? 'stroke: red; stroke-width: 2;' : ''}
						on:dblclick={(event) => handleRectangleDoubleClick(rect.id, event)}
						on:click={(event) => handleRectangleClick(rect.id, event)}
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
		height: 80vh; /* Set the height to 100% of the viewport height */
	}
</style>
