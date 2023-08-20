<script>
	export let key;
	export let value;

	let is_collapsed = false;
	const toggleCollapse = () => {
		is_collapsed = !is_collapsed;
	};

  function logHello() {
    console.log('hello');
  }
</script>

<div class="container">
	<div class="left">
		<input type="checkbox" id="checkbox1" name="checkbox1" bind:checked={value.filter} />
		<label for="checkbox1">{key}</label>
		<button class="arrow-button" on:click={toggleCollapse}>
			{is_collapsed ? '⇩' : '⇨'}
		</button>
	</div>
	<input type="checkbox" id="checkbox2" name="checkbox2" bind:checked={value.color_scale} />
</div>

{#if is_collapsed}
  {#each Object.entries(value.values) as [key, item]}
    <div class="item-row" on:mouseover={logHello}>
      <input type="checkbox" bind:checked={item.filter} />
      <p>{key}: {item.count}</p>
    </div>
  {/each}
{/if}

<style>
	.container {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.left {
		display: flex;
		align-items: center;
	}

	.arrow-button {
		margin-left: 10px;
	}

	.item-row {
		display: flex;
		align-items: center;
		margin: 5px 0; /* Reduce the vertical margin */
		justify-content: flex-start; /* Align items to the start */
	}

	.item-row p {
		margin-left: 5px; /* Reduce the gap between the checkbox and the paragraph */
	}
</style>
