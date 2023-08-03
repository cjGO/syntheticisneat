<script>
	import { createEventDispatcher } from 'svelte';
	import { targetIndex, highlightedIndex, hoveredAA, selectedAminoAcids } from './stores';

	export let x;
	export let y;
	export let selected = false;
	export let amino_acid;
	export let binding;
	export let index;

	$: highlighted = $highlightedIndex === index;
	$: hovered = $hoveredAA === index;

	function handleMouseOver() {
		hoveredAA.set(index);
	}

	function handleMouseOut() {
		hoveredAA.set(null);
	}

	function handleClick() {
		$targetIndex = index;
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
			font-size={binding ? '14px' : '8px'}
			fill={binding ? 'red' : 'black'}
			on:mouseover={handleMouseOver}
			on:mouseout={handleMouseOut}
			on:click={handleClick}
		>
			{amino_acid}
		</text>
	</g>
</svg>
