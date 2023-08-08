<!-- Highlighter.svelte -->
<script>
	import { highlightedIndex, targetIndex } from '../routes/stores.js';
	import HighlightableChar from './HighlightChar.svelte';
	export let protein_sequence;

	let text = protein_sequence;
	let characters = [...text];

	const highlightChar = (index) => {
		$targetIndex = index;
		moveHighlight();
	};

	let intervalId;

	const moveHighlight = () => {
		clearInterval(intervalId);
		intervalId = setInterval(() => {
			if ($highlightedIndex < $targetIndex) {
				$highlightedIndex++;
			} else if ($highlightedIndex > $targetIndex) {
				$highlightedIndex--;
			} else {
				clearInterval(intervalId);
			}
		}, 10); // Adjust time interval as needed
	};

	// Reactive statement
	$: {
		if ($targetIndex !== -1) {
			moveHighlight();
		}
	}
</script>
<p> You can click the Amino Acids in the sequence below or on the left scatterplot.</p>
<p> ---<span style="color:red">Red</span> amino acids on the scatterplot : <b>Binding Sites</b></p>
<p> ---<span style="color:green">Green</span> amino acids on the scatterplot : <b>Active Sites</b></p>
<div>
	{#each characters as char, index}
		<HighlightableChar {char} {index} {highlightChar} />
	{/each}
</div>




<style>
	div {
		color: #0f0; /* Matrix green */
		font-family: 'Courier New', monospace;
		white-space: pre-wrap;
		word-wrap: break-word;
		background-color: #000; /* Black background */
		font-size: 20px; /* Larger font size */
		line-height: 1.6; /* More space between lines */
	}
</style>
