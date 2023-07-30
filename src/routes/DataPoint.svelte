<script>
	import { createEventDispatcher } from 'svelte';
	export let x;
	export let y;
	export let selected = false;
	export let index; // Add this line

	const dispatch = createEventDispatcher();

	// Dispatch a click event when the data point is clicked
	function handleClick() {
		dispatch('click');
	}

	// Dispatch a mouseover event when the data point is hovered over
	function handleMouseOver() {
		dispatch('mouseover', { index }); // Dispatch the index of the hovered datapoint
	}
</script>

<circle
	cx={$x}
	cy={$y}
	r={selected ? '5' : '3'}
	fill={selected ? 'red' : 'black'}
	on:click={handleClick}
	on:mouseover={handleMouseOver}
/>
