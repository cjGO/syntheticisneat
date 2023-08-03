<script>
	import { onMount } from 'svelte';
	export let options = [];
	export let selectedOption = '';
	export let label = '';
	let intervalId;

	function handleChange(option) {
		selectedOption = option;
	}

	function randomSelect() {
		intervalId = setInterval(() => {
			let randomOption = options[Math.floor(Math.random() * options.length)];
			handleChange(randomOption);
		}, 2000);
	}

	function stopRandomSelect() {
		clearInterval(intervalId);
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
{#each options as option (option)}
	<label>
		<input type="radio" name={label} value={option} bind:group={selectedOption} />
		{option}
	</label>
{/each}

<button on:click={randomSelect}> Start random selection </button>

<button on:click={stopRandomSelect}> Stop random selection </button>
