<script>
	let str = 'TTADEYLDQFV';
	let chars = [...str];
	let highlightedIndex = -1;
	let targetIndex = -1;

	const highlightChar = (index) => {
		clearInterval(intervalId);
		targetIndex = index;
		moveHighlight();
	};

	let intervalId;

	const moveHighlight = () => {
		intervalId = setInterval(() => {
			if (highlightedIndex < targetIndex) {
				highlightedIndex++;
			} else if (highlightedIndex > targetIndex) {
				highlightedIndex--;
			} else {
				clearInterval(intervalId);
			}
		}, 200); // Adjust time interval as needed
	};
</script>

<div>
	{#each chars as char, index}
		<span class:highlight={index === highlightedIndex} on:click={() => highlightChar(index)}>
			{char}
		</span>
	{/each}
</div>

<style>
	.highlight {
		background-color: yellow;
	}
</style>
