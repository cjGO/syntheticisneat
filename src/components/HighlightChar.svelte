<!-- HighlightChar.svelte -->
<script>
	export let char;
	export let index;
	export let highlightChar;

	import { highlightedIndex } from '../routes/stores.js';
</script>

<span class:highlight={$highlightedIndex === index} on:click={() => highlightChar(index)}>
	{char}
</span>

<style>
	.highlight {
		background-color: green;
	}
</style>
