<script>
	export let height;
	export let width;
	export let xScale;

	let xTicks = xScale.ticks(10);
</script>

<g class="axis x" transform="translate(0, {height})">
	{#each xTicks as tick, index}
			<line x1={0} x2={0} y1={0} y2={6} stroke="hsla(212, 10%, 53%, 1)" />
			<text y={6} dy={9} text-anchor={tick === '0' ? 'start' : 'middle'} dominant-baseline="middle">
				{tick}%
			</text>
	{/each}
</g>
