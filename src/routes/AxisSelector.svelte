<script>
  export let options = [];
  export let groupName = "";
  export let selectedValue = "";
  export let title = "";

  const dispatch = createEventDispatcher();

  function updateData(event) {
    dispatch("change", {
      groupName: groupName,
      selectedValue: event.target.value
    });
  }
</script>

<h3>{title}</h3>
{#each options as option}
  <label>
    <input
      type="radio"
      name={groupName}
      value={option}
      on:change={updateData}
      checked={option === selectedValue}
    />
    {option}
  </label>
{/each}
