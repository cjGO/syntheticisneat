<script>
  export let x;
  export let y;
  export let selected = false;
</script>

<circle cx={$x} cy={$y} r="5" fill={selected ? "red" : "black"} />
