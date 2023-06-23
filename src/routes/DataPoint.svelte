<script>
  import { createEventDispatcher } from 'svelte';
  export let x;
  export let y;
  export let selected = false;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click');
  }
</script>

<circle
  cx={$x}
  cy={$y}
  r="3"
  fill={selected ? "red" : "black"}
  on:click={handleClick}
/>
