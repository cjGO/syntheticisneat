<script>
	export let key;
	export let value;
	import { filter_state, color_scheme, hovered_cat} from './czcell_stores';

	let is_collapsed = false;
	const toggleCollapse = () => {
		is_collapsed = !is_collapsed;
	};

	function handleFilterChange() {
		$filter_state[key].value = value.filter;
		console.log($filter_state)
	}

	function logHello(sub_key,subcat_item) {
		$hovered_cat = [sub_key, subcat_item];
		console.log($hovered_cat)
	}

	function clearHoveredCat() {
	$hovered_cat = ['',''];
}
</script>

<div class="container">
	<div class="left">

		<label for="checkbox1">{key}</label>
		<button class="arrow-button" on:click={toggleCollapse}>
			{is_collapsed ? '⇩' : '⇨'}
		</button>
	</div>
	<input type="checkbox" id="checkbox2" name="color" bind:checked={value.color_scale} />
</div>

{#if is_collapsed}
	{#each Object.entries(value.values) as [subcat_key, subcat_item]}
		<div class="item-row" 
		     on:mouseover="{() => logHello(key,subcat_key)}"
		     on:mouseout="{() => clearHoveredCat()}">
			<input type="checkbox" bind:checked={subcat_item.filter} on:change={handleFilterChange}/>
			<p>{subcat_key}: {subcat_item.count}</p>
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
