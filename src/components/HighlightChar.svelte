<!-- HighlightChar.svelte -->
<script>
	export let char;
	export let index;
	export let highlightChar;
	import { hoveredAA } from '../routes/stores';
	import { highlightedIndex } from '../routes/stores.js';

	$: highlighted = $highlightedIndex === index;
	$: hovered = $hoveredAA === index;

	function handleMouseOver() {
		hoveredAA.set(index);
	}

	function handleMouseOut() {
		hoveredAA.set(null);
	}
</script>

<span
	class:highlight={$highlightedIndex === index}
	class:hover={$hoveredAA === index}
	on:click={() => highlightChar(index)}
	on:mouseover={handleMouseOver}
	on:mouseout={handleMouseOut}
>
	{char}
</span>

<style>
	.highlight {
		background-color: green;
	}

	.hover {
		border: 2px solid green;
		box-sizing: border-box;
	}
</style>
