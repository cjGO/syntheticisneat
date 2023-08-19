<script>
  export let width;
  export let yScale;
  let yTicks = yScale.ticks(4);
</script>

<g class='axis y'>
  {#each yTicks as tick}
    <g class='tick' transform="translate(0, {yScale(tick)})">
      <line x1={0} x2={width} y1={0} y2={0} stroke='black' />
			<text y={-3}>{tick}</text>    </g>
  {/each}
</g>