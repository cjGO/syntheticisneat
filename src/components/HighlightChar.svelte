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
	span {
		border: 1px solid transparent; /* All elements have a transparent border by default */
		box-sizing: border-box;
	}

	.highlight {
		border-color: blue; /* Only the border color changes on hover */
	}

	.hover {
		border-color: green; /* Only the border color changes on hover */
	}
</style>
