<script>
	import { createEventDispatcher } from 'svelte';
	import { targetIndex, highlightedIndex, hoveredAA, selectedAminoAcids } from './stores';

	export let x;
	export let y;
	export let selected = false;
	export let amino_acid;
	export let binding_site;
	export let active_site;
	export let index;
	export let location;

	$: highlighted = $highlightedIndex === location;
	$: hovered = $hoveredAA === location;

	function handleMouseOver() {
		hoveredAA.set(location);
	}

	function handleMouseOut() {
		hoveredAA.set(null);
	}

	function handleClick() {
		$targetIndex = location;
	}
</script>

<svg>
	<g>
		{#if highlighted}
			<rect x={$x - 10} y={$y - 10} width="20" height="20" fill="none" stroke="blue" />
		{/if}
		{#if hovered}
			<rect x={$x - 12} y={$y - 12} width="24" height="24" fill="none" stroke="lightgreen" />
		{/if}
		<text
			x={$x}
			y={$y}
			text-anchor="middle"
			dominant-baseline="central"
			font-size={binding_site || active_site ? '14px' : '8px'}
			fill={active_site ? 'green' : binding_site ? 'red' : 'black'}
			on:mouseover={handleMouseOver}
			on:mouseout={handleMouseOut}
			on:click={handleClick}
		>
			{amino_acid}
		</text>
	</g>
</svg>
