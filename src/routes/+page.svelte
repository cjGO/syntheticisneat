<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let data = Array.from({length: 5}, () => ({
    pc1: Math.random() * 100,
    pc2: Math.random() * 100,
    pc3: Math.random() * 100
  }));

  let x_data = 'pc1';
  let y_data = 'pc2';

  const margin = {top: 20, right: 20, bottom: 20, left: 20};
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  $: xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[x_data]))
    .range([0, width]);

  $: yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d[y_data]))
    .range([height, 0]);

  let svg;
  let origin = {x: 0, y: 0};
  let selectionRect = {x: 0, y: 0, width: 0, height: 0};
  let isSelecting = false;

  let selectedPoints = [];

  onMount(() => {
    d3.select(svg)
      .on('mousedown', function(event) {
        const [x, y] = d3.pointer(event, this);
        origin.x = x;
        origin.y = y;
        isSelecting = true;
        // Reset the previous rectangle selection
        selectionRect.width = 0;
        selectionRect.height = 0;
        console.log('mousedown', x, y);
      });

    window.addEventListener('mousemove', function(event) {
      if (!isSelecting) return;
      const [x, y] = d3.pointer(event, svg);
      selectionRect.x = Math.min(origin.x, x);
      selectionRect.y = Math.min(origin.y, y);
      selectionRect.width = Math.abs(x - origin.x);
      selectionRect.height = Math.abs(y - origin.y);
      console.log('mousemove', x, y);
    });

    window.addEventListener('mouseup', function(event) {
      if (!isSelecting) return;
      isSelecting = false;
      // Compute the list of selected points
      selectedPoints = data.filter(d =>
        xScale(d[x_data]) > selectionRect.x &&
        xScale(d[x_data]) < selectionRect.x + selectionRect.width &&
        yScale(d[y_data]) > selectionRect.y &&
        yScale(d[y_data]) < selectionRect.y + selectionRect.height
      );
      console.log('mouseup', selectedPoints);
    });
  });
</script>

<style>
  rect {
    pointer-events: none;
  }
</style>

<svg bind:this={svg} width="{width + margin.left + margin.right}" height="{height + margin.top + margin.bottom}">
  <g transform="translate({margin.left}, {margin.top})">
    {#each data as point (point.pc1)}
      <circle
        cx="{xScale(point[x_data])}"
        cy="{yScale(point[y_data])}"
        r="5"
        fill="{selectedPoints.includes(point) ? 'red' : 'black'}"
      />
    {/each}
    <rect
      x="{selectionRect.x}"
      y="{selectionRect.y}"
      width="{selectionRect.width}"
      height="{selectionRect.height}"
      fill="rgba(0, 0, 255, 0.2)"
      stroke="blue"
      stroke-width="1"
      style="display: {isSelecting ? 'block' : 'none'}"
    />
  </g>
</svg>
