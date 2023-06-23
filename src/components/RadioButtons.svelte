<script>
  export let options = [];
  export let selectedOption = '';
  export let label = '';

  function handleChange(option) {
    selectedOption = option;
  }
</script>

<h3> {label} </h3>
{#each options as option}
  <label>
    <input
      type="radio"
      name={label}
      value={option}
      on:change={() => handleChange(option)}
      checked={option === selectedOption}
    />
    {option}
  </label>
{/each}

<style>
  /* Add any desired styles for the radio buttons */
</style>
