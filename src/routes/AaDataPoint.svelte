<script>
	import { createEventDispatcher } from 'svelte';
	import { highlightedIndex } from './stores';

	export let x;
	export let y;
	export let selected = false;
	export let amino_acid;
	export let binding;
	export let index;

	$: highlighted = $highlightedIndex === index;
</script>

<svg>
	<g>
		{#if highlighted}
			<rect x={$x - 10} y={$y - 10} width="20" height="20" fill="none" stroke="blue" />
		{/if}
		<text
			x={$x}
			y={$y}
			text-anchor="middle"
			dominant-baseline="central"
			font-size={binding ? '14px' : '8px'}
			fill={binding ? 'red' : 'black'}
		>
			{amino_acid}
		</text>
	</g>
</svg>
