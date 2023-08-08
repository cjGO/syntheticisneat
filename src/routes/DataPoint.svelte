<script>
	import { createEventDispatcher } from 'svelte';
	export let x;
	export let y;
	export let selected = false;
	export let index; // Add this line
	import { hoveredPoint, selectedPoint } from './stores';

	const dispatch = createEventDispatcher();

	// Dispatch a click event when the data point is clicked
	function handleClick() {
		dispatch('click');
	}
</script>

<circle
	cx={$x}
	cy={$y}
	r={index == $selectedPoint ? '3' : '1'}
	fill={index == $hoveredPoint ? 'blue' : index == $selectedPoint ? 'red' : 'black'}
	on:click={() => {
		$selectedPoint = index;
	}}
	on:mouseover={() => {
		$hoveredPoint = index;
	}}
	on:mouseout={() => {
		$hoveredPoint = null;
	}}
/>
