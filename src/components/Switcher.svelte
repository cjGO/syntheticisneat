<script>
	import { modelSize } from '../routes/stores.js';

	export let arg1;
	export let arg2;

	// Initialize the store with the first model

	let display = $modelSize;

	function switchArg() {
		display = display === arg1 ? arg2 : arg1;

		// Switch the modelSize depending on the display value
		if (display === arg1) {
			$modelSize = 'facebook/esm2_t6_8M_UR50D';
		} else {
			$modelSize = 'facebook/esm2_t33_650M_UR50D';
		}
	}
  $: console.log({'modelSize':$modelSize})
</script>

<button on:click={switchArg}>
	{display}
</button>
