<script>
	import { onMount } from 'svelte';
	export let options = [];
	export let selectedOption = '';
	export let label = '';
	let intervalId;
	let randomSelectActive = true;

	function handleChange(option) {
		selectedOption = option;
	}

	function startRandomSelect() {
		intervalId = setInterval(() => {
			let randomOption = options[Math.floor(Math.random() * options.length)];
			handleChange(randomOption);
		}, 4000);
	}

	function stopRandomSelect() {
		clearInterval(intervalId);
	}

	$: {
		if (randomSelectActive) {
			startRandomSelect();
		} else {
			stopRandomSelect();
		}
	}

	onMount(() => {
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	});
</script>

<h3>{label}</h3>
{#each options as option, index (option)}
	<label title={option}>
		<!-- Tooltip with the option name -->
		<input
			type="radio"
			name={label}
			value={option}
			bind:group={selectedOption}
			disabled={randomSelectActive}
		/>
		{index + 1}
		<!-- Button label is the 1-indexed array index -->
	</label>
{/each}

<label>
	<input type="checkbox" bind:checked={randomSelectActive} />
	Start/Stop random selection
</label>
