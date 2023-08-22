<script>
	import { scaleLinear } from 'd3';
	let selectionBox;

	export let data; // an array of floats
	let n_bins = 100;
	let minVal = Math.min(...data);
	let maxVal = Math.max(...data);
	let binWidth = (maxVal - minVal) / n_bins;
	let binIndexes = new Array(n_bins).fill().map(() => []); // Initialize binIndexes with empty arrays
	let bins = new Array(n_bins).fill().map((_, i) => ({ binIndex: i, count: 0, indexes: [] }));
	let rects = [];

	data.forEach((val, idx) => {
		let binIndex = Math.floor((val - minVal) / binWidth);
		binIndex = binIndex === n_bins ? binIndex - 1 : binIndex;
		bins[binIndex].count++;
		bins[binIndex].indexes.push(idx); // Add the current index to the appropriate bin
	});

	let width = 500;
	let height = 350;

	let yScale = scaleLinear()
		.domain([0, Math.max(...bins.map((bin) => bin.count))])
		.range([height, 0]);

	let selectionStart = 0;
	let selecting = false;
	let dragStart = { x: 0, y: 0 };
	let dragging = false;

	function startSelection(event) {
		let boxStart = Number(selectionBox.getAttribute('x'));
		let boxEnd = boxStart + Number(selectionBox.getAttribute('width'));

		if (event.clientX >= boxStart && event.clientX <= boxEnd) {
			dragging = true;
			dragStart.x = event.clientX;
		} else {
			selecting = true;
			selectionStart = event.clientX;
			selectionBox.setAttribute('x', event.clientX);
			selectionBox.setAttribute('width', 0);
		}
	}

	function updateSelection(event) {
		if (dragging) {
			let dx = event.clientX - dragStart.x;
			let newX = Number(selectionBox.getAttribute('x')) + dx;
			selectionBox.setAttribute('x', newX);
			dragStart.x = event.clientX;
		} else if (selecting) {
			selectionBox.setAttribute('x', Math.min(event.clientX, selectionStart));
			selectionBox.setAttribute('width', Math.abs(event.clientX - selectionStart));
		}

		// Update bin colors
		selectionStart = Number(selectionBox.getAttribute('x'));
		let selectionEnd = selectionStart + Number(selectionBox.getAttribute('width'));
		for (let i = 0; i < n_bins; i++) {
			let rect = rects[i];
			let binStart = Number(rect.getAttribute('x'));
			let binEnd = binStart + Number(rect.getAttribute('width'));
			if (binStart >= selectionStart && binEnd <= selectionEnd) {
				rect.setAttribute('fill', 'blue');
			} else {
				rect.setAttribute('fill', 'black');
			}
		}
	}

	function endSelection() {
		selecting = false;
		dragging = false;
		let selectionStart = Number(selectionBox.getAttribute('x'));
		let selectionEnd = selectionStart + Number(selectionBox.getAttribute('width'));

		let selectedIndexes = [];
		for (let i = 0; i < n_bins; i++) {
			let rect = rects[i];
			let binStart = Number(rect.getAttribute('x'));
			let binEnd = binStart + Number(rect.getAttribute('width'));
			if (binStart >= selectionStart && binEnd <= selectionEnd) {
				rect.setAttribute('fill', 'blue');
				selectedIndexes.push(...bins[i].indexes);
			} else {
				rect.setAttribute('fill', 'black');
			}
		}
		console.log(selectedIndexes);
	}
</script>

<svg
	{width}
	{height}
	on:mousedown={startSelection}
	on:mousemove={updateSelection}
	on:mouseup={endSelection}
>
	<rect
		bind:this={selectionBox}
		id="selectionBox"
		x={0}
		y={0}
		width={0}
		{height}
		fill="rgba(0, 0, 0, 0.2)"
	/>
	{#each bins as bin, i (i)}
		<rect
			bind:this={rects[i]}
			id={`bin-${i}`}
			x={i * (width / n_bins)}
			y={yScale(bin.count)}
			width={width / n_bins}
			height={height - yScale(bin.count)}
		/>
	{/each}
</svg>
