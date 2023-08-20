<script>
export let category;
	function toggleFilterStatus(category, subCategory = null) {
		if (subCategory === null) {
			categories[category].filter = !categories[category].filter;
		} else {
			categories[category].values[subCategory].filter =
				!categories[category].values[subCategory].filter;
		}
	}
</script>

{#each Object.entries(categories) as [category, data]}
	<details>
		<summary>
			<h2>{category}</h2>
			<input
				type="checkbox"
				bind:checked={data.filter}
				on:change={() => toggleFilterStatus(category)}
			/> Filter
		</summary>
		{#each Object.entries(data.values) as [subCategory, subData]}
			<div>
				<h3>{subCategory}</h3>
				<p>Count: {subData.count}</p>
				<input
					type="checkbox"
					bind:checked={subData.filter}
					on:change={() => toggleFilterStatus(category, subCategory)}
				/> Filter
			</div>
		{/each}
	</details>
{/each}
