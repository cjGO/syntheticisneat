<script>
  import { createEventDispatcher } from 'svelte';
  export let x;
  export let y;
  export let selected = false;

  const dispatch = createEventDispatcher();

// Dispatch a click event when the data point is clicked
function handleClick() {
  dispatch('click');
}

</script>

<circle
  cx={$x}
  cy={$y}
  r={selected ? "5" : "1"}
  fill={selected ? "red" : "black"}
  on:click={handleClick}
/>
