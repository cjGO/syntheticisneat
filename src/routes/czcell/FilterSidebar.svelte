<script>
	export let key;
	export let value;
	import { filter_state, color_scheme, hovered_cat, color_cats } from './czcell_stores';

	let is_collapsed = false;
	const toggleCollapse = () => {
		is_collapsed = !is_collapsed;
	};

	function handleFilterChange() {
		$filter_state[key].value = value.filter;
	}

	function logHello(sub_key, subcat_item) {
		$hovered_cat = [sub_key, subcat_item];
	}

	function clearHoveredCat() {
		$hovered_cat = ['', ''];
	}

	$: if ($color_scheme !== key) {
		value.color_scale = false;
	} else {
		value.color_scale = true;
	}

	function handleCheckboxClick() {
		if (value.color_scale) {
			$color_scheme = null;
			console.log($color_scheme);
		} else {
			$color_scheme = key;
		}
	}

	let unique_color_cats;
	$: unique_color_cats = [...new Set($color_cats)];

	// check if the current color filter is this key if so , set current_color = true; then render appropriate colors in sidebar
</script>

<div class="container">
	<div class="left">
		<label for="checkbox1">{key}</label>
		<button class="arrow-button" on:click={toggleCollapse}>
			{is_collapsed ? '⇩' : '⇨'}
		</button>
	</div>
	<input
		type="checkbox"
		id="color_box"
		name="color"
		bind:checked={value.color_scale}
		on:click={handleCheckboxClick}
	/>
</div>

{#if is_collapsed}
	{#each Object.entries(value.values) as [subcat_key, subcat_item], index}
		<div
			class="item-row"
			on:mouseover={() => logHello(key, subcat_key)}
			on:mouseout={() => clearHoveredCat()}
		>
			<input type="checkbox" bind:checked={subcat_item.filter} on:change={handleFilterChange} />
			<p>{subcat_key}: {subcat_item.count}</p>
			{#if value.color_scale}
				<div style="background-color: {unique_color_cats[index]}; width: 10px; height: 10px;" />
			{/if}
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
