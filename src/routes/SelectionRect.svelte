<script>
  export let x = 0;
  export let y = 0;
  export let width = 0;
  export let height = 0;
  export let isSelecting = false;
</script>

<rect
  x="{x}"
  y="{y}"
  width="{width}"
  height="{height}"
  fill="rgba(0, 0, 255, 0.2)"
  stroke="blue"
  stroke-width="1"
  style="display: {isSelecting ? 'block' : 'none'}"
/>
