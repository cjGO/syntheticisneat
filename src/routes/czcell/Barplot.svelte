<script>
	import { scaleLinear } from 'd3';

	export let data; // an array of floats
	let n_bins = 100;
	let minVal = Math.min(...data);
	let maxVal = Math.max(...data);
	let binWidth = (maxVal - minVal) / n_bins;
	let bins = new Array(n_bins).fill(0);

	data.forEach((val) => {
		let binIndex = Math.floor((val - minVal) / binWidth);
		binIndex = binIndex === n_bins ? binIndex - 1 : binIndex; // Handle the edge case where the value is exactly equal to maxVal
		bins[binIndex]++;
	});
	console.log(bins); // Outputs the counts in each bin

	let width = 500;
	let height = 350;

	let yScale = scaleLinear()
		.domain([0, Math.max(...bins)])
		.range([height, 0]);

	let selectionStart = 0;
	let selecting = false;
  let dragStart = {x: 0, y: 0};
let dragging = false;

function startSelection(event) {
    let selectionBox = document.getElementById('selectionBox');
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
    let selectionBox = document.getElementById('selectionBox');

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
        let bin = document.getElementById(`bin-${i}`);
        let binStart = Number(bin.getAttribute('x'));
        let binEnd = binStart + Number(bin.getAttribute('width'));
        if (binStart >= selectionStart && binEnd <= selectionEnd) {
            bin.setAttribute('fill', 'blue'); // set fill color to blue if bin is within selection
        } else {
            bin.setAttribute('fill', 'black'); // set fill color to black if bin is not within selection
        }
    }
}



	function endSelection() {
		selecting = false;
    dragging = false;
		let selectionBox = document.getElementById('selectionBox');
		let selectionStart = Number(selectionBox.getAttribute('x'));
		let selectionEnd = selectionStart + Number(selectionBox.getAttribute('width'));

		for (let i = 0; i < n_bins; i++) {
			let bin = document.getElementById(`bin-${i}`);
			let binStart = Number(bin.getAttribute('x'));
			let binEnd = binStart + Number(bin.getAttribute('width'));

			if (binStart >= selectionStart && binEnd <= selectionEnd) {
				bin.setAttribute('fill', 'blue'); // set fill color to blue if bin is within selection
			} else {
				bin.setAttribute('fill', 'black'); // set fill color to black if bin is not within selection
			}
		}
	}
</script>

<svg
	{width}
	{height}
	on:mousedown={startSelection}
	on:mousemove={updateSelection}
	on:mouseup={endSelection}
>
	<!-- histogram bars -->
	{#each bins as bin, i (i)}
		<rect
			id={`bin-${i}`}
			x={i * (width / n_bins)}
			y={yScale(bin)}
			width={width / n_bins}
			height={height - yScale(bin)}
		/>
	{/each}

	<!-- selection box -->
	<rect id="selectionBox" x={0} y={0} width={0} {height} fill="rgba(0, 0, 0, 0.2)" />
</svg>
