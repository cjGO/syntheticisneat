<script>
	import { createEventDispatcher } from 'svelte';
	export let x;
	export let y;
	export let selected = false;
	export let amino_acid;
	export let binding;
</script>

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
